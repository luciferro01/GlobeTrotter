import { prisma } from "../../database";
import { CommonResponse } from "../shared/types";
import {
  BulkCreateDestinationDto,
  BulkDestinationResponse,
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

  bulkCreate: async (
    data: BulkCreateDestinationDto
  ): Promise<BulkDestinationResponse> => {
    if (
      !data.destinations ||
      !Array.isArray(data.destinations) ||
      data.destinations.length === 0
    ) {
      return {
        success: false,
        message: "No valid destinations provided",
        data: { created: 0, failed: 0 },
      };
    }

    let created = 0;
    let failed = 0;

    // For better performance, use prisma's transaction
    await prisma.$transaction(async (tx) => {
      for (const destination of data.destinations) {
        try {
          // Validate required fields
          if (!destination.city || !destination.country) {
            failed++;
            continue;
          }

          // Ensure arrays are properly formatted
          const clues = Array.isArray(destination.clues)
            ? destination.clues
            : [];
          const funFact = Array.isArray(destination.funFact)
            ? destination.funFact
            : [];
          const trivia = Array.isArray(destination.trivia)
            ? destination.trivia
            : [];

          await tx.destination.create({
            data: {
              city: destination.city,
              country: destination.country,
              clues,
              funFact,
              trivia,
              imageUrl: destination.imageUrl || null,
            },
          });
          created++;
        } catch (error) {
          failed++;
          // In a real app, you might want to log the error
        }
      }
    });

    return {
      success: true,
      message: `Successfully created ${created} destinations. Failed: ${failed}`,
      data: { created, failed },
    };
  },
};

export default DestinationService;
