import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DestinationService from "./destination.service";
import { prisma } from "../../database";
import {
  CreateDestinationDto,
  UpdateDestinationDto,
  BulkCreateDestinationDto,
} from "./types";

// Mock the prisma client
vi.mock("../../database", () => ({
  prisma: {
    destination: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

describe("DestinationService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a destination successfully", async () => {
      // Arrange
      const mockDestination = {
        id: "123",
        city: "Paris",
        country: "France",
        clues: ["Clue 1", "Clue 2"],
        funFact: ["Fun Fact 1"],
        trivia: ["Trivia 1"],
        imageUrl: "http://example.com/image.jpg",
        createdAt: new Date(),
      };

      const createDto: CreateDestinationDto = {
        city: "Paris",
        country: "France",
        clues: ["Clue 1", "Clue 2"],
        funFact: ["Fun Fact 1"],
        trivia: ["Trivia 1"],
        imageUrl: "http://example.com/image.jpg",
      };

      vi.mocked(prisma.destination.create).mockResolvedValue(mockDestination);

      // Act
      const result = await DestinationService.create(createDto);

      // Assert
      expect(prisma.destination.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual({
        success: true,
        data: {
          ...mockDestination,
          imageUrl: mockDestination.imageUrl,
          clues: mockDestination.clues,
          funFact: mockDestination.funFact,
          trivia: mockDestination.trivia,
        },
      });
    });
  });

  describe("get", () => {
    it("should return a destination when found by id", async () => {
      // Arrange
      const mockDestination = {
        id: "123",
        city: "Paris",
        country: "France",
        clues: ["Clue 1", "Clue 2"],
        funFact: ["Fun Fact 1"],
        trivia: ["Trivia 1"],
        imageUrl: "http://example.com/image.jpg",
        createdAt: new Date(),
      };

      vi.mocked(prisma.destination.findUnique).mockResolvedValue(
        mockDestination
      );

      // Act
      const result = await DestinationService.get("123");

      // Assert
      expect(prisma.destination.findUnique).toHaveBeenCalledWith({
        where: { id: "123" },
      });
      expect(result).toEqual({
        success: true,
        data: {
          ...mockDestination,
          imageUrl: mockDestination.imageUrl,
          clues: mockDestination.clues,
          funFact: mockDestination.funFact,
          trivia: mockDestination.trivia,
        },
      });
    });

    it("should return not found message when destination is not found", async () => {
      // Arrange
      vi.mocked(prisma.destination.findUnique).mockResolvedValue(null);

      // Act
      const result = await DestinationService.get("nonexistentId");

      // Assert
      expect(prisma.destination.findUnique).toHaveBeenCalledWith({
        where: { id: "nonexistentId" },
      });
      expect(result).toEqual({
        success: false,
        data: null,
        message: "Destination not found",
      });
    });
  });

  describe("random", () => {
    it("should return a random destination", async () => {
      // Arrange
      const mockCount = 10;
      const mockDestination = {
        id: "123",
        city: "Paris",
        country: "France",
        clues: ["Clue 1", "Clue 2"],
        funFact: ["Fun Fact 1"],
        trivia: ["Trivia 1"],
        imageUrl: "http://example.com/image.jpg",
        createdAt: new Date(),
      };

      vi.mocked(prisma.destination.count).mockResolvedValue(mockCount);
      vi.mocked(prisma.destination.findMany).mockResolvedValue([
        mockDestination,
      ]);

      // Mock Math.random to return a predictable value
      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);

      // Act
      const result = await DestinationService.random();

      // Assert
      expect(prisma.destination.count).toHaveBeenCalled();
      expect(prisma.destination.findMany).toHaveBeenCalledWith({
        skip: 5, // Based on our mocked random value
        take: 1,
      });
      expect(result).toEqual({
        success: true,
        data: {
          ...mockDestination,
          imageUrl: mockDestination.imageUrl,
          clues: mockDestination.clues,
          funFact: mockDestination.funFact,
          trivia: mockDestination.trivia,
        },
      });

      randomSpy.mockRestore();
    });

    it("should handle no destinations available", async () => {
      // Arrange
      vi.mocked(prisma.destination.count).mockResolvedValue(0);

      // Act
      const result = await DestinationService.random();

      // Assert
      expect(prisma.destination.count).toHaveBeenCalled();
      expect(prisma.destination.findMany).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: "Destination not found",
        data: null,
      });
    });
  });

  describe("update", () => {
    it("should update a destination successfully", async () => {
      // Arrange
      const mockUpdatedDestination = {
        id: "123",
        city: "Updated Paris",
        country: "France",
        clues: ["Updated Clue"],
        funFact: ["Updated Fun Fact"],
        trivia: ["Updated Trivia"],
        imageUrl: "http://example.com/updated.jpg",
        createdAt: new Date(),
      };

      const updateDto: UpdateDestinationDto = {
        city: "Updated Paris",
        clues: ["Updated Clue"],
      };

      vi.mocked(prisma.destination.update).mockResolvedValue(
        mockUpdatedDestination
      );

      // Act
      const result = await DestinationService.update(updateDto, "123");

      // Assert
      expect(prisma.destination.update).toHaveBeenCalledWith({
        where: { id: "123" },
        data: updateDto,
      });
      expect(result).toEqual({
        success: true,
        data: {
          ...mockUpdatedDestination,
          imageUrl: mockUpdatedDestination.imageUrl,
          clues: mockUpdatedDestination.clues,
          funFact: mockUpdatedDestination.funFact,
          trivia: mockUpdatedDestination.trivia,
        },
      });
    });
  });

  describe("bulkCreate", () => {
    it("should create multiple destinations successfully", async () => {
      // Arrange
      const bulkCreateDto: BulkCreateDestinationDto = {
        destinations: [
          {
            city: "Paris",
            country: "France",
            clues: ["Clue 1", "Clue 2"],
            funFact: ["Fun Fact 1"],
            trivia: ["Trivia 1"],
          },
          {
            city: "Tokyo",
            country: "Japan",
            clues: ["Clue 3", "Clue 4"],
            funFact: ["Fun Fact 2"],
            trivia: ["Trivia 2"],
            imageUrl: "http://example.com/tokyo.jpg",
          },
        ],
      };

      // Setup mocks for the transaction actions
      const mockCreate = vi.fn().mockResolvedValue({ id: "123" });
      prisma.destination.create = mockCreate;

      // Act
      const result = await DestinationService.bulkCreate(bulkCreateDto);

      // Assert
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("data");
      expect(result.data).toHaveProperty("created");
      expect(result.data).toHaveProperty("failed");
    });

    it("should handle empty destinations array", async () => {
      // Arrange
      const emptyDto: BulkCreateDestinationDto = {
        destinations: [],
      };

      // Act
      const result = await DestinationService.bulkCreate(emptyDto);

      // Assert
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        message: "No valid destinations provided",
        data: { created: 0, failed: 0 },
      });
    });
  });
});
