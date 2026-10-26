import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/user.service";
import { FarmService } from "../farms/farm.service";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, "create" | "findByEmail">>;
  let farmService: jest.Mocked<Pick<FarmService, "findByKmgMid" | "findOrCreateByKmgMid">>;
  let jwtService: jest.Mocked<Pick<JwtService, "sign">>;

  const farm = { id: 42, kmg_mid: "100-001" } as any;
  const user = {
    id: 7,
    email: "a@b.c",
    firstName: "Ana",
    lastName: "Novak",
    password: "hashed",
    farm,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  beforeEach(() => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
    farmService = {
      findByKmgMid: jest.fn(),
      findOrCreateByKmgMid: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue("signed.jwt.token"),
    };
    service = new AuthService(
      usersService as unknown as UsersService,
      farmService as unknown as FarmService,
      jwtService as unknown as JwtService,
    );
  });

  describe("register", () => {
    it("signs a JWT that includes farmId", async () => {
      farmService.findByKmgMid.mockResolvedValue(null);
      farmService.findOrCreateByKmgMid.mockResolvedValue(farm);
      usersService.create.mockResolvedValue(user);

      const result = await service.register({
        email: "a@b.c",
        firstName: "Ana",
        lastName: "Novak",
        password: "TestPass1!",
        kmg_mid: "100-001",
        acceptedTerms: true,
        policyVersion: "1.0",
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: "a@b.c",
        sub: 7,
        farmId: 42,
      });
      expect(result.data.access_token).toBe("signed.jwt.token");
      expect(result.data.farm.id).toBe(42);
      expect(result.data.needsFarmSetup).toBe(true);
    });

    it("maps unique email violations to ConflictException", async () => {
      farmService.findByKmgMid.mockResolvedValue(farm);
      usersService.create.mockRejectedValue({ code: "23505" });

      await expect(
        service.register({
          email: "a@b.c",
          firstName: "Ana",
          lastName: "Novak",
          password: "TestPass1!",
          kmg_mid: "100-001",
          acceptedTerms: true,
          policyVersion: "1.0",
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe("login", () => {
    it("signs a JWT with farmId on success", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ email: "a@b.c", password: "secret" });

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: "a@b.c",
        sub: 7,
        farmId: 42,
      });
      expect(result.access_token).toBe("signed.jwt.token");
      expect(result.user.farm.id).toBe(42);
    });

    it("rejects bad passwords", async () => {
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: "a@b.c", password: "wrong" })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it("rejects unknown emails", async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.login({ email: "x@y.z", password: "x" })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
