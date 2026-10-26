import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

export interface TestUserSession {
  token: string;
  email: string;
  farmId: number;
  userId: number;
  kmg_mid: string;
}

let userSeq = 0;

function nextEmail(prefix: string): string {
  userSeq += 1;
  return `${prefix}.${userSeq}.${Date.now()}@example.com`;
}

/** Register a user (and farm by kmg_mid) via HTTP; returns Bearer token + farmId. */
export async function registerUser(
  app: INestApplication,
  overrides: Partial<{
    email: string;
    password: string;
    kmg_mid: string;
    firstName: string;
    lastName: string;
  }> = {},
): Promise<TestUserSession> {
  const email = overrides.email ?? nextEmail("user");
  const password = overrides.password ?? "TestPass1!";
  const kmg_mid = overrides.kmg_mid ?? `KMG-${userSeq}-${Date.now()}`;

  const res = await request(app.getHttpServer())
    .post("/auth/register")
    .send({
      email,
      password,
      firstName: overrides.firstName ?? "Test",
      lastName: overrides.lastName ?? "User",
      kmg_mid,
      acceptedTerms: true,
      policyVersion: "1.0",
    })
    .expect(201);

  const data = res.body.data;
  return {
    token: data.access_token as string,
    email,
    farmId: data.farm.id as number,
    userId: data.id as number,
    kmg_mid,
  };
}

export async function loginUser(
  app: INestApplication,
  email: string,
  password: string,
): Promise<{ token: string; farmId: number }> {
  const res = await request(app.getHttpServer())
    .post("/auth/login")
    .send({ email, password })
    .expect(201);

  return {
    token: res.body.access_token as string,
    farmId: res.body.user.farm.id as number,
  };
}

/** Decode JWT payload without verifying (tests already got the token from the API). */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split(".");
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}
