import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { createTestApp } from "./utils/app";
import { truncateAll } from "./utils/db";
import { decodeJwtPayload, loginUser, registerUser } from "./utils/auth";

describe("Auth (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await truncateAll(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it("register returns a JWT that includes farmId", async () => {
    const session = await registerUser(app);
    const payload = decodeJwtPayload(session.token);
    expect(payload.farmId).toBe(session.farmId);
    expect(payload.sub).toBe(session.userId);
    expect(payload.email).toBe(session.email);
  });

  it("login returns a JWT with farmId", async () => {
    const password = "TestPass1!";
    const session = await registerUser(app, { password });
    const loggedIn = await loginUser(app, session.email, password);
    const payload = decodeJwtPayload(loggedIn.token);
    expect(payload.farmId).toBe(session.farmId);
  });

  it("rejects bad login credentials", async () => {
    const session = await registerUser(app, { password: "TestPass1!" });
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: session.email, password: "WrongPass1!" })
      .expect(401);
  });
});
