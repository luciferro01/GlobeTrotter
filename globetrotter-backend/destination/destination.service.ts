import { prisma } from "../database";
import { CommonResponse } from "../services/shared/types";
import {
  CreateDestinationDto,
  DestinationResponse,
  UpdateDestinationDto,
} from "./types";

const DestinationService = {
  create: async (data: CreateDestinationDto): Promise<DestinationResponse> => {
    const destination = await prisma.destination.create({
      data,
    });
    return {
      success: true,
      data: {
        ...destination,
        imageUrl: destination.imageUrl ?? undefined,
        clues: Array.isArray(destination.clues) ? destination.clues : [],
        funFact: Array.isArray(destination.funFact) ? destination.funFact : [],
        trivia: Array.isArray(destination.trivia) ? destination.trivia : [],
      },
    };
  },

  get: async (id: string): Promise<DestinationResponse> => {
    const destination = await prisma.destination.findUnique({
      where: { id },
    });
    if (!destination) {
      return {
        success: false,
        data: null,
        message: "Destination not found",
      };
    }
    return {
      success: true,
      // data: destination,
      data: {
        ...destination,
        imageUrl: destination.imageUrl ?? undefined,
        clues: Array.isArray(destination.clues) ? destination.clues : [],
        funFact: Array.isArray(destination.funFact) ? destination.funFact : [],
        trivia: Array.isArray(destination.trivia) ? destination.trivia : [],
      },
    };
  },

  update: async (
    data: UpdateDestinationDto,
    id: string
  ): Promise<DestinationResponse> => {
    const destination = await prisma.destination.update({
      where: { id: id },
      data,
    });
    return {
      success: true,
      data: {
        ...destination,
        imageUrl: destination.imageUrl ?? undefined,
        clues: Array.isArray(destination.clues) ? destination.clues : [],
        funFact: Array.isArray(destination.funFact) ? destination.funFact : [],
        trivia: Array.isArray(destination.trivia) ? destination.trivia : [],
      },
    };
  },

  random: async (): Promise<DestinationResponse> => {
    // I want to find the random destination from the database
    // I want to return the destination as a response

    const count = await prisma.destination.count();
    if (count === 0) {
      return {
        success: false,
        data: null,
        message: "Destination not found",
      };
    }
    const randomId = Math.floor(Math.random() * count) + 1;
    const destinations = await prisma.destination.findMany({
      skip: randomId - 1,
      take: 1,
    });
    const destination = destinations[0];
    if (!destination) {
      return {
        success: false,
        data: null,
        message: "Destination not found",
      };
    }
    return {
      success: true,
      data: {
        ...destination,
        imageUrl: destination.imageUrl ?? undefined,
        clues: Array.isArray(destination.clues) ? destination.clues : [],
        funFact: Array.isArray(destination.funFact) ? destination.funFact : [],
        trivia: Array.isArray(destination.trivia) ? destination.trivia : [],
      },
    };
  },
};

export default DestinationService;
