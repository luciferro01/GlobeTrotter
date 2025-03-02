import { nanoid } from "nanoid";
import { prisma } from "../../database";
import {
  ChallengeInviteResponse,
  ChallengeResponse,
  CreateChallengeDto,
  JoinChallengeDto,
} from "./challenge.types";
import GameService from "../game/game.service";

const INVITE_EXPIRATION_DAYS = 7; // Invites expire after 7 days

const ChallengeService = {
  createChallenge: async (
    data: CreateChallengeDto
  ): Promise<ChallengeResponse> => {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    // Create a challenge session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRATION_DAYS);

    const challengeSession = await prisma.challengeSession.create({
      data: {
        ownerId: data.userId,
        endTime: expiresAt, // Use expiration date as end time
        status: "in_progress",
      },
      include: {
        owner: true,
      },
    });

    // Generate a unique invite link
    const inviteCode = nanoid(10); // 10 character unique code

    // Create an invite
    const invite = await prisma.challengeInvite.create({
      data: {
        challengeSessionId: challengeSession.id,
        inviteLink: inviteCode,
        expiresAt,
      },
    });

    // Get user's highest score
    const highestScoreGame = await prisma.gameSession.findFirst({
      where: {
        userId: data.userId,
        status: "completed",
      },
      orderBy: {
        score: "desc",
      },
    });

    // Update the owner's score
    if (highestScoreGame) {
      await prisma.challengeInvite.update({
        where: { id: invite.id },
        data: {
          ownerScore: highestScoreGame.score,
        },
      });
    }

    return {
      success: true,
      data: {
        id: challengeSession.id,
        inviteLink: inviteCode,
        ownerScore: highestScoreGame?.score || 0,
        owner: {
          id: user.id,
          userName: user.userName,
        },
        createdAt: challengeSession.createdAt,
        expiresAt: invite.expiresAt || undefined,
        gameSession: null,
      },
    };
  },

  getChallenge: async (
    inviteCode: string
  ): Promise<ChallengeInviteResponse> => {
    // Find the invite
    const invite = await prisma.challengeInvite.findUnique({
      where: { inviteLink: inviteCode },
      include: {
        challengeSession: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!invite) {
      return {
        success: false,
        message: "Challenge not found",
        data: null,
      };
    }

    // Check if expired
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return {
        success: false,
        message: "Challenge has expired",
        data: null,
      };
    }

    return {
      success: true,
      data: {
        inviteCode: invite.inviteLink,
        ownerName: invite.challengeSession.owner.userName,
        ownerScore: invite.ownerScore,
      },
    };
  },

  joinChallenge: async (data: JoinChallengeDto): Promise<ChallengeResponse> => {
    // Find the invite
    const invite = await prisma.challengeInvite.findUnique({
      where: { inviteLink: data.inviteCode },
      include: {
        challengeSession: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!invite) {
      return {
        success: false,
        message: "Challenge not found",
        data: null,
      };
    }

    // Check if expired
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return {
        success: false,
        message: "Challenge has expired",
        data: null,
      };
    }

    let userId: string | undefined = undefined;
    let tempId: string | undefined = undefined;

    // Register anonymous user if userName provided
    if (data.userName) {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { userName: data.userName },
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create a new user
        const newUser = await prisma.user.create({
          data: {
            userName: data.userName,
          },
        });
        userId = newUser.id;
      }
    } else {
      // Generate a temporary ID for anonymous user
      tempId = nanoid(10);
    }

    // Create a challenge participant
    await prisma.challengeParticipant.create({
      data: {
        challengeSessionId: invite.challengeSession.id,
        userId,
        temporaryId: tempId,
      },
    });

    // Create a new game session
    const gameSessionResult = await GameService.createSession({
      userId,
    });

    if (!gameSessionResult.success || !gameSessionResult.data) {
      return {
        success: false,
        message: "Failed to create game session",
        data: null,
      };
    }

    return {
      success: true,
      data: {
        id: invite.challengeSession.id,
        inviteLink: invite.inviteLink,
        ownerScore: invite.ownerScore,
        owner: {
          id: invite.challengeSession.owner.id,
          userName: invite.challengeSession.owner.userName,
        },
        createdAt: invite.challengeSession.createdAt,
        expiresAt: invite.expiresAt || undefined,
        gameSession: gameSessionResult.data || null,
      },
    };
  },
};

export default ChallengeService;
