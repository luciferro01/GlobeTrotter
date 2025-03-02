import { prisma } from "../../database";
import {
  AnswerResponse,
  CreateGameSessionDto,
  GameCluesResponse,
  GameSessionResponse,
  SubmitAnswerDto,
} from "./game.types";

const GameService = {
  createSession: async (
    data: CreateGameSessionDto
  ): Promise<GameSessionResponse> => {
    // Get a random destination
    const count = await prisma.destination.count();
    if (count === 0) {
      return {
        success: false,
        message: "No destinations available",
        data: null,
      };
    }

    const randomId = Math.floor(Math.random() * count) + 1;
    const destinations = await prisma.destination.findMany({
      skip: randomId - 1,
      take: 1,
    });

    if (destinations.length === 0) {
      return {
        success: false,
        message: "Failed to get destination",
        data: null,
      };
    }

    const destination = destinations[0];

    // Create a new game session
    const gameSession = await prisma.gameSession.create({
      data: {
        userId: data.userId,
        destinationId: destination.id,
      },
      include: {
        destination: true,
      },
    });

    return {
      success: true,
      data: gameSession,
      // data: {
      //   ...gameSession,
      //   destination: {
      //     ...gameSession.destination,
      //     clues: Array.isArray(gameSession.destination.clues)
      //       ? gameSession.destination.clues
      //       : [],
      //     funFact: Array.isArray(gameSession.destination.funFact)
      //       ? gameSession.destination.funFact
      //       : [],
      //     trivia: Array.isArray(gameSession.destination.trivia)
      //       ? gameSession.destination.trivia
      //       : [],
      //     imageUrl: gameSession.destination.imageUrl ?? undefined,
      //   },
      // },
    };
  },

  getClues: async (id: string): Promise<GameCluesResponse> => {
    const gameSession = await prisma.gameSession.findUnique({
      where: { id },
      include: {
        destination: true,
      },
    });

    if (!gameSession) {
      return {
        success: false,
        message: "Game session not found",
        data: null,
      };
    }

    // Get 1-2 random clues
    const clues = Array.isArray(gameSession.destination.clues)
      ? gameSession.destination.clues
      : [];

    const randomClues: string[] = [];
    const numClues = Math.min(clues.length, Math.floor(Math.random() * 2) + 1); // 1 or 2 clues

    const clueIndices = new Set<number>();
    while (clueIndices.size < numClues && clues.length > 0) {
      clueIndices.add(Math.floor(Math.random() * clues.length));
    }

    clueIndices.forEach((index) => {
      randomClues.push(clues[index]);
    });

    // Get 3-4 random destinations (including the correct one) for multiple choice
    const otherDestinations = await prisma.destination.findMany({
      where: {
        id: {
          not: gameSession.destinationId,
        },
      },
      take: 3,
      orderBy: {
        id: "asc", // Consistent ordering for testing
      },
    });

    const allOptions = [
      ...otherDestinations.map((d) => ({
        id: d.id,
        name: `${d.city}, ${d.country}`,
      })),
      {
        id: gameSession.destination.id,
        name: `${gameSession.destination.city}, ${gameSession.destination.country}`,
      },
    ];

    // Shuffle the options
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    return {
      success: true,
      data: {
        id: gameSession.id,
        clues: randomClues,
        possibleAnswers: allOptions,
      },
    };
  },

  submitAnswer: async (
    data: SubmitAnswerDto,
    userId?: string
  ): Promise<AnswerResponse> => {
    // Get the game session
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: data.gameSessionId },
      include: { destination: true },
    });

    if (!gameSession) {
      return {
        success: false,
        message: "Game session not found",
        data: null,
      };
    }

    // Check if the game is still in progress
    if (gameSession.status !== "in_progress") {
      return {
        success: false,
        message: `Game is ${gameSession.status}`,
        data: null,
      };
    }

    // Validate the answer (check if the provided destination ID matches)
    const isCorrect = data.answer === gameSession.destinationId;

    // Update game session based on answer
    if (isCorrect) {
      // Correct answer - increment score and possibly complete the game
      await prisma.gameSession.update({
        where: { id: data.gameSessionId },
        data: {
          score: gameSession.score + 1,
          status: "completed",
        },
      });

      // Select a random fun fact or trivia
      const feedback =
        Math.random() > 0.5
          ? gameSession.destination.funFact[
              Math.floor(Math.random() * gameSession.destination.funFact.length)
            ]
          : gameSession.destination.trivia[
              Math.floor(Math.random() * gameSession.destination.trivia.length)
            ];

      return {
        success: true,
        data: {
          correct: true,
          score: gameSession.score + 1,
          wrongAnswers: gameSession.wrongAnswers,
          feedback,
          gameCompleted: true,
        },
      };
    } else {
      // Wrong answer - increment wrong answers count
      const newWrongAnswers = gameSession.wrongAnswers + 1;
      const gameOver = newWrongAnswers >= gameSession.maxWrongAnswers;

      await prisma.gameSession.update({
        where: { id: data.gameSessionId },
        data: {
          wrongAnswers: newWrongAnswers,
          status: gameOver ? "failed" : "in_progress",
        },
      });

      return {
        success: true,
        data: {
          correct: false,
          score: gameSession.score,
          wrongAnswers: newWrongAnswers,
          gameCompleted: gameOver,
          correctAnswer: `${gameSession.destination.city}, ${gameSession.destination.country}`,
        },
      };
    }
  },

  getGameSession: async (
    id: string,
    userId?: string
  ): Promise<GameSessionResponse> => {
    const gameSession = await prisma.gameSession.findUnique({
      where: { id },
      include: {
        destination: true,
      },
    });

    if (!gameSession) {
      return {
        success: false,
        message: "Game session not found",
        data: null,
      };
    }

    // Optional: Check if the user is authorized to view this session
    if (userId && gameSession.userId && gameSession.userId !== userId) {
      return {
        success: false,
        message: "Unauthorized access to game session",
        data: null,
      };
    }

    return {
      success: true,
      data: gameSession,
    };
  },
};

export default GameService;
