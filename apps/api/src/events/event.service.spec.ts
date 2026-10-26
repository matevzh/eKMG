import { NotFoundException } from "@nestjs/common";
import { EventsService } from "./event.service";
import { AnimalsService } from "../animals/animal.service";
import { PushService } from "../notifications/push.service";
import { CalendarEvent } from "./entities/event.entity";

describe("EventsService", () => {
  let service: EventsService;
  let eventRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };
  let animalsService: jest.Mocked<Pick<AnimalsService, "findById">>;
  let pushService: jest.Mocked<Pick<PushService, "sendToFarm">>;

  beforeEach(() => {
    eventRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => ({ ...x, id: 5 })),
      delete: jest.fn(),
    };
    animalsService = { findById: jest.fn() };
    pushService = { sendToFarm: jest.fn().mockResolvedValue(undefined) };
    service = new EventsService(
      eventRepository as any,
      animalsService as unknown as AnimalsService,
      pushService as unknown as PushService,
    );
  });

  it("create is idempotent for the same clientId", async () => {
    const existing = {
      id: 9,
      title: "Semenitev",
      note: null,
      date: "2026-11-01",
      notificationId: null,
      reminderDaySentAt: null,
      animalId: null,
      animal: null,
      clientId: "evt-1",
      farmId: 10,
    } as unknown as CalendarEvent;
    eventRepository.findOne.mockResolvedValue(existing);

    const result = await service.create(
      { title: "Semenitev", date: "2026-11-01", clientId: "evt-1" } as any,
      10,
      1,
    );

    expect(result.id).toBe(9);
    expect(eventRepository.save).not.toHaveBeenCalled();
    expect(pushService.sendToFarm).not.toHaveBeenCalled();
  });

  it("create rejects animals from another farm", async () => {
    eventRepository.findOne.mockResolvedValue(null);
    animalsService.findById.mockResolvedValue({ id: 2, birthFarmId: 99 } as any);

    await expect(
      service.create(
        { title: "Premik", date: "2026-11-01", animalId: 2 } as any,
        10,
        1,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("create notifies the farm after saving", async () => {
    eventRepository.findOne
      .mockResolvedValueOnce(null) // idempotency lookup
      .mockResolvedValueOnce({
        id: 5,
        title: "Premik",
        note: null,
        date: "2026-11-01",
        notificationId: null,
        reminderDaySentAt: null,
        animalId: null,
        animal: null,
        farmId: 10,
      } as unknown as CalendarEvent);

    await service.create({ title: "Premik", date: "2026-11-01" } as any, 10, 1);

    expect(pushService.sendToFarm).toHaveBeenCalledWith(
      10,
      expect.objectContaining({ data: { type: "event.created", eventId: 5 } }),
      1,
    );
  });

  it("delete rejects events from another farm", async () => {
    eventRepository.findOne.mockResolvedValue({ id: 5, farmId: 99, title: "X", date: "2026-01-01" });

    await expect(service.delete(5, 10, 1)).rejects.toBeInstanceOf(NotFoundException);
    expect(eventRepository.delete).not.toHaveBeenCalled();
  });

  it("delete succeeds when farm matches", async () => {
    eventRepository.findOne.mockResolvedValue({
      id: 5,
      farmId: 10,
      title: "Premik",
      date: "2026-11-01",
    });

    await service.delete(5, 10, 1);
    expect(eventRepository.delete).toHaveBeenCalledWith(5);
    expect(pushService.sendToFarm).toHaveBeenCalledWith(
      10,
      expect.objectContaining({ data: { type: "event.deleted", eventId: 5 } }),
      1,
    );
  });
});
