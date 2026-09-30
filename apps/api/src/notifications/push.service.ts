import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
import { PushToken } from "./entities/push-token.entity";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_CHUNK_SIZE = 100;

export interface PushMessage {
    title: string;
    body: string;
    data?: Record<string, unknown>;
}

@Injectable()
export class PushService {
    private readonly logger = new Logger(PushService.name);

    constructor(
        @InjectRepository(PushToken) private readonly tokenRepository: Repository<PushToken>,
    ) {}

    // Upsert by token: a device's Expo token is unique but may move between users.
    async registerToken(userId: number, farmId: number, token: string, platform?: string): Promise<void> {
        const existing = await this.tokenRepository.findOne({ where: { token } });
        if (existing) {
            existing.userId = userId;
            existing.farmId = farmId;
            if (platform) existing.platform = platform;
            await this.tokenRepository.save(existing);
            return;
        }
        await this.tokenRepository.save(this.tokenRepository.create({ token, userId, farmId, platform }));
    }

    async removeToken(token: string): Promise<void> {
        await this.tokenRepository.delete({ token });
    }

    // Send to every device on a farm, optionally excluding the acting user's own devices.
    async sendToFarm(farmId: number, message: PushMessage, excludeUserId?: number): Promise<void> {
        const where = excludeUserId != null ? { farmId, userId: Not(excludeUserId) } : { farmId };
        const tokens = await this.tokenRepository.find({ where });
        await this.sendToTokens(tokens.map((t) => t.token), message);
    }

    async sendToTokens(tokens: string[], message: PushMessage): Promise<void> {
        if (tokens.length === 0) return;

        const messages = tokens.map((to) => ({
            to,
            title: message.title,
            body: message.body,
            data: message.data ?? {},
            sound: "default" as const,
        }));

        for (let i = 0; i < messages.length; i += EXPO_CHUNK_SIZE) {
            const chunk = messages.slice(i, i + EXPO_CHUNK_SIZE);
            try {
                const res = await fetch(EXPO_PUSH_URL, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(chunk),
                });
                if (!res.ok) {
                    this.logger.warn(`Expo push responded ${res.status}: ${await res.text()}`);
                    continue;
                }
                const body = (await res.json()) as { data?: unknown };
                await this.pruneDeadTokens(body.data, chunk);
            } catch (err) {
                this.logger.error(`Failed to send push chunk: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
    }

    // Expo returns a per-message ticket; DeviceNotRegistered means the token is
    // stale and should be dropped so we stop sending to it.
    private async pruneDeadTokens(tickets: unknown, chunk: { to: string }[]): Promise<void> {
        if (!Array.isArray(tickets)) return;
        const dead: string[] = [];
        tickets.forEach((ticket, idx) => {
            const t = ticket as { status?: string; details?: { error?: string } };
            if (t?.status === "error" && t?.details?.error === "DeviceNotRegistered") {
                dead.push(chunk[idx].to);
            }
        });
        if (dead.length) {
            await this.tokenRepository.delete({ token: In(dead) });
            this.logger.log(`Pruned ${dead.length} unregistered push token(s)`);
        }
    }
}
