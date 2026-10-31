import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as request from "supertest";
import { createTestApp } from "./utils/app";
import { truncateAll } from "./utils/db";
import { registerUser } from "./utils/auth";

describe("Farm scope (e2e)", () => {
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

  async function createAnimal(token: string, si_id: string) {
    const res = await request(app.getHttpServer())
      .post("/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mila", si_id })
      .expect(201);
    return res.body;
  }

  async function createEvent(token: string, title: string) {
    const res = await request(app.getHttpServer())
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title, date: "2026-12-01", reminderDate: "2026-11-24" })
      .expect(201);
    return res.body;
  }

  it("keeps animals and events isolated across farms", async () => {
    const a = await registerUser(app, { kmg_mid: "FARM-A" });
    const b = await registerUser(app, { kmg_mid: "FARM-B" });

    const animalA = await createAnimal(a.token, "SI-AAA-001");
    const eventA = await createEvent(a.token, "Premik");

    const listB = await request(app.getHttpServer())
      .get("/animals")
      .set("Authorization", `Bearer ${b.token}`)
      .expect(200);
    expect(listB.body).toEqual([]);

    const eventsB = await request(app.getHttpServer())
      .get("/events")
      .set("Authorization", `Bearer ${b.token}`)
      .expect(200);
    expect(eventsB.body).toEqual([]);

    await request(app.getHttpServer())
      .patch(`/animals/${animalA.id}`)
      .set("Authorization", `Bearer ${b.token}`)
      .send({ isLactating: true })
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/animals/${animalA.id}`)
      .set("Authorization", `Bearer ${b.token}`)
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/events/${eventA.id}`)
      .set("Authorization", `Bearer ${b.token}`)
      .expect(404);
  });

  it("rejects farm-scoped routes when JWT has no farmId", async () => {
    const jwt = app.get(JwtService);
    const stale = jwt.sign({ email: "old@example.com", sub: 1 });

    await request(app.getHttpServer())
      .get("/animals")
      .set("Authorization", `Bearer ${stale}`)
      .expect(403);
  });
});
