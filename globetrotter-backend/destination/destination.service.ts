import { prisma } from "../database";
import { CreateDestinationDto, DestinationResponse } from "./types";

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
};

export default DestinationService;
