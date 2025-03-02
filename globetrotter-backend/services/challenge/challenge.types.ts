import { CommonResponse } from "../shared/types";
import { GameSessionDto } from "../game/game.types";

export interface CreateChallengeDto {
  userId: string; // Challenger ID
  gameSessionId: string | null; // Existing game session ID (optional)
}

export interface JoinChallengeDto {
  inviteCode: string;
  userName: string | null; // Optional username for anonymous users
}

export interface ChallengeDto {
  id: string;
  inviteLink: string;
  ownerScore: number;
  owner: {
    id: string;
    userName: string;
  };
  createdAt: Date;
  expiresAt?: Date;
  gameSession: GameSessionDto | null;
}

export interface ChallengeInviteDto {
  inviteCode: string;
  ownerName: string;
  ownerScore: number;
}

export interface ChallengeResponse
  extends CommonResponse<ChallengeDto | null> {}
export interface ChallengeInviteResponse
  extends CommonResponse<ChallengeInviteDto | null> {}
