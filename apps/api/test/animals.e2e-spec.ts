import { INestApplication } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as request from "supertest";
import { createTestApp } from "./utils/app";
import { truncateAll } from "./utils/db";
import { registerUser } from "./utils/auth";

describe("Animals (e2e)", () => {
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

  it("creates, lists, patches, and deletes an animal", async () => {
    const created = await request(app.getHttpServer())
      .post("/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mila", si_id: "SI-CRUD-1", isLactating: false })
      .expect(201);

    expect(created.body.name).toBe("Mila");
    expect(created.body.si_id).toBe("SI-CRUD-1");

    const list = await request(app.getHttpServer())
      .get("/animals")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(list.body).toHaveLength(1);

    const patched = await request(app.getHttpServer())
      .patch(`/animals/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isLactating: true })
      .expect(200);
    expect(patched.body.isLactating).toBe(true);

    await request(app.getHttpServer())
      .delete(`/animals/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const empty = await request(app.getHttpServer())
      .get("/animals")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(empty.body).toEqual([]);
  });

  it("rejects duplicate si_id with 409", async () => {
    await request(app.getHttpServer())
      .post("/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mila", si_id: "SI-DUP" })
      .expect(201);

    await request(app.getHttpServer())
      .post("/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Other", si_id: "SI-DUP" })
      .expect(409);
  });

  it("is idempotent when the same clientId is posted twice", async () => {
    const clientId = randomUUID();
    const first = await request(app.getHttpServer())
      .post("/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mila", si_id: "SI-IDEM-1", clientId })
      .expect(201);

    const second = await request(app.getHttpServer())
      .post("/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mila", si_id: "SI-IDEM-1", clientId })
      .expect(201);

    expect(second.body.id).toBe(first.body.id);

    const list = await request(app.getHttpServer())
      .get("/animals")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(list.body).toHaveLength(1);
  });

  it("ignores birthFarmId in the patch body", async () => {
    const created = await request(app.getHttpServer())
      .post("/animals")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Mila", si_id: "SI-FARM-1" })
      .expect(201);

    const originalFarmId = created.body.birthFarmId;

    const patched = await request(app.getHttpServer())
      .patch(`/animals/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ birthFarmId: 999999, isPregnant: true })
      .expect(200);

    expect(patched.body.birthFarmId).toBe(originalFarmId);
    expect(patched.body.isPregnant).toBe(true);
  });
});
