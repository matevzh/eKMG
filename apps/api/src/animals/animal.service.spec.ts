import { ConflictException, NotFoundException } from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { AnimalsService } from "./animal.service";
import { FarmService } from "../farms/farm.service";
import { Animal } from "./entities/animal.entity";

describe("AnimalsService", () => {
  let service: AnimalsService;
  let animalRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let farmService: jest.Mocked<Pick<FarmService, "findById">>;

  const farm = { id: 10 } as any;

  beforeEach(() => {
    animalRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((x) => x),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    farmService = { findById: jest.fn().mockResolvedValue(farm) };
    service = new AnimalsService(animalRepository as any, farmService as unknown as FarmService);
  });

  it("findByFarm filters by birthFarmId", async () => {
    animalRepository.find.mockResolvedValue([{ id: 1 }]);
    await service.findByFarm(10);
    expect(animalRepository.find).toHaveBeenCalledWith({
      where: { birthFarmId: 10 },
      order: { createdAt: "DESC" },
    });
  });

  it("create returns existing row for the same clientId", async () => {
    const existing = { id: 3, clientId: "uuid-1", birthFarmId: 10 } as Animal;
    animalRepository.findOne.mockResolvedValueOnce(existing);

    const result = await service.create(
      { name: "Mila", si_id: "SI123", clientId: "uuid-1" } as any,
      10,
    );

    expect(result).toBe(existing);
    expect(animalRepository.save).not.toHaveBeenCalled();
  });

  it("create maps unique si_id violations to ConflictException", async () => {
    const err = new QueryFailedError("INSERT", [], new Error("dup"));
    (err as any).code = "23505";
    animalRepository.save.mockRejectedValue(err);

    await expect(
      service.create({ name: "Mila", si_id: "SI123" } as any, 10),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("update rejects animals from another farm", async () => {
    animalRepository.findOne.mockResolvedValue({ id: 1, birthFarmId: 99 } as Animal);

    await expect(service.update(1, { isLactating: true }, 10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("delete rejects animals from another farm", async () => {
    animalRepository.findOne.mockResolvedValue({ id: 1, birthFarmId: 99 } as Animal);

    await expect(service.delete(1, 10)).rejects.toBeInstanceOf(NotFoundException);
    expect(animalRepository.delete).not.toHaveBeenCalled();
  });

  it("update succeeds when farm matches", async () => {
    animalRepository.findOne
      .mockResolvedValueOnce({ id: 1, birthFarmId: 10 } as Animal)
      .mockResolvedValueOnce({ id: 1, birthFarmId: 10, isLactating: true } as Animal);
    animalRepository.update.mockResolvedValue(undefined);

    const updated = await service.update(1, { isLactating: true }, 10);
    expect(updated.isLactating).toBe(true);
    expect(animalRepository.update).toHaveBeenCalledWith(1, { isLactating: true });
  });
});
