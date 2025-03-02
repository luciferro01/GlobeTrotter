import { api, APIError, ErrCode } from "encore.dev/api";
import {
  ChallengeInviteResponse,
  ChallengeResponse,
  CreateChallengeDto,
  JoinChallengeDto,
} from "./challenge.types";
import ChallengeService from "./challenge.service";
import { getUserId } from "../shared/auth";
import { getAuthData } from "encore.dev/internal/codegen/auth";
interface AuthData {
  userID: string;
}

export const createChallenge = api(
  { expose: true, method: "POST", path: "/challenge", auth: true },

  async (data: CreateChallengeDto): Promise<ChallengeResponse> => {
    try {
      const userId: string = (getAuthData() as AuthData).userID;
      const result = await ChallengeService.createChallenge({
        ...data,
        userId,
      });
      return result;
    } catch (error) {
      throw new APIError(ErrCode.Internal, "Failed to create challenge");
    }
  }
);

export const getChallenge = api(
  { expose: true, method: "GET", path: "/challenge/:inviteCode", auth: false },
  async ({
    inviteCode,
  }: {
    inviteCode: string;
  }): Promise<ChallengeInviteResponse> => {
    try {
      const result = await ChallengeService.getChallenge(inviteCode);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.NotFound, "Challenge not found");
    }
  }
);

export const joinChallenge = api(
  { expose: true, method: "POST", path: "/challenge/join", auth: false },
  async (data: JoinChallengeDto): Promise<ChallengeResponse> => {
    try {
      const result = await ChallengeService.joinChallenge(data);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.Internal, "Failed to join challenge");
    }
  }
);
