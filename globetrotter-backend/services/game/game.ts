import { api, APIError, ErrCode } from "encore.dev/api";
import {
  AnswerResponse,
  CreateGameSessionDto,
  GameCluesResponse,
  GameSessionResponse,
  SubmitAnswerDto,
} from "./game.types";
import GameService from "./game.service";
import { getUserId } from "../shared/auth";

export const createSession = api(
  { expose: true, method: "POST", path: "/game/session", auth: true },
  async (
    data: CreateGameSessionDto,
    req: { auth: any }
  ): Promise<GameSessionResponse> => {
    try {
      // If authenticated, include userId
      if (req.auth) {
        data.userId = getUserId(req);
      }

      const result = await GameService.createSession(data);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.Internal, "Failed to create game session");
    }
  }
);

export const getClues = api(
  { expose: true, method: "GET", path: "/game/session/:id/clues", auth: false },
  async ({ id }: { id: string }): Promise<GameCluesResponse> => {
    try {
      const result = await GameService.getClues(id);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.NotFound, "Failed to get game clues");
    }
  }
);

export const submitAnswer = api(
  { expose: true, method: "POST", path: "/game/answer", auth: false },
  async (
    data: SubmitAnswerDto,
    req: { auth: any }
  ): Promise<AnswerResponse> => {
    try {
      let userId: string | undefined = undefined;

      // If authenticated, include userId
      if (req.auth) {
        userId = getUserId(req);
      }

      const result = await GameService.submitAnswer(data, userId);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.Internal, "Failed to process answer");
    }
  }
);

export const getGameSession = api(
  { expose: true, method: "GET", path: "/game/session/:id", auth: false },
  async (
    { id }: { id: string },
    req: { auth: any }
  ): Promise<GameSessionResponse> => {
    try {
      let userId: string | undefined = undefined;

      // If authenticated, include userId
      if (req.auth) {
        userId = getUserId(req);
      }

      const result = await GameService.getGameSession(id, userId);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.NotFound, "Game session not found");
    }
  }
);
