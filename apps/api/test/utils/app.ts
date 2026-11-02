import { CanActivate, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AppModule } from "../../src/app.module";
import { PushService } from "../../src/notifications/push.service";
import { ReminderService } from "../../src/events/reminder.service";

const silentPush: Pick<PushService, "sendToFarm" | "sendToTokens" | "registerToken" | "removeToken"> = {
  sendToFarm: async () => undefined,
  sendToTokens: async () => undefined,
  registerToken: async () => undefined,
  removeToken: async () => undefined,
};

const silentReminder: Pick<ReminderService, "onModuleInit" | "onModuleDestroy" | "sendDueReminders"> = {
  onModuleInit: () => undefined,
  onModuleDestroy: () => undefined,
  sendDueReminders: async () => undefined,
};

const passthroughThrottle: CanActivate = { canActivate: () => true };

/** Boot the full Nest app for e2e with the same ValidationPipe as production. */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PushService)
    .useValue(silentPush)
    .overrideProvider(ReminderService)
    .useValue(silentReminder)
    // Auth e2e registers many users from one IP; don't flake on production limits.
    .overrideGuard(ThrottlerGuard)
    .useValue(passthroughThrottle)
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: false,
    }),
  );
  await app.init();
  return app;
}
