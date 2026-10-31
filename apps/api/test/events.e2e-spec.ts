import { INestApplication } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as request from "supertest";
import { createTestApp } from "./utils/app";
import { truncateAll } from "./utils/db";
import { registerUser } from "./utils/auth";

describe("Events (e2e)", () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await truncateAll(app);
    const session = await registerUser(app);
    token = session.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates, lists, and deletes an event", async () => {
    const created = await request(app.getHttpServer())
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Veterinarski pregled",
        date: "2026-12-15",
        reminderDate: "2026-12-08",
        note: "ok",
      })
      .expect(201);

    expect(created.body.title).toBe("Veterinarski pregled");
    expect(created.body.date).toBe("2026-12-15");
    expect(created.body.reminderDate).toBe("2026-12-08");

    const list = await request(app.getHttpServer())
      .get("/events")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(list.body).toHaveLength(1);

    await request(app.getHttpServer())
      .delete(`/events/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const empty = await request(app.getHttpServer())
      .get("/events")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(empty.body).toEqual([]);
  });

  it("links an event to an animal on the same farm", async () => {
    const animal = await request(app.getHttpServer())
      .post("/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mila", si_id: "SI-EVT-1" })
      .expect(201);

    const event = await request(app.getHttpServer())
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Semenitev",
        date: "2026-12-20",
        reminderDate: "2026-12-19",
        animalId: animal.body.id,
      })
      .expect(201);

    expect(event.body.animalId).toBe(animal.body.id);
    expect(event.body.animalName).toBe("Mila");
    expect(event.body.animalSiId).toBe("SI-EVT-1");
  });

  it("is idempotent when the same clientId is posted twice", async () => {
    const clientId = randomUUID();
    const first = await request(app.getHttpServer())
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Premik", date: "2026-12-01", reminderDate: "2026-11-24", clientId })
      .expect(201);

    const second = await request(app.getHttpServer())
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Premik", date: "2026-12-01", reminderDate: "2026-11-24", clientId })
      .expect(201);

    expect(second.body.id).toBe(first.body.id);

    const list = await request(app.getHttpServer())
      .get("/events")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(list.body).toHaveLength(1);
  });

  it("allows custom event titles", async () => {
    const created = await request(app.getHttpServer())
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Cepljenje proti blatu", date: "2026-12-05", reminderDate: "2026-12-05" })
      .expect(201);

    expect(created.body.title).toBe("Cepljenje proti blatu");
  });
});
