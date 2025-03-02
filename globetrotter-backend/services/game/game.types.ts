import { CommonResponse } from "../shared/types";

export interface CreateGameSessionDto {
  userId?: string;
}

export interface SubmitAnswerDto {
  gameSessionId: string;
  answer: string;
}

export interface AnswerResponseDto {
  correct: boolean;
  score: number;
  wrongAnswers: number;
  feedback?: string; // Fun fact or trivia if correct
  gameCompleted: boolean;
  correctAnswer?: string; // City and country of the correct destination
}

export interface GameSessionDto {
  id: string;
  userId: string | null;
  destination: {
    id: string;
    city: string;
    country: string;
    clues: string[];
    funFact: string[];
    trivia: string[];
    imageUrl: string | null;
  };
  score: number;
  wrongAnswers: number;
  status: string;
  startTime: Date;
  endTime: Date | null;
  maxWrongAnswers: number;
}

export interface GameCluesDto {
  id: string;
  clues: string[]; // 1-2 random clues
  possibleAnswers: {
    id: string;
    name: string;
  }[];
}

export interface AnswerResponse
  extends CommonResponse<AnswerResponseDto | null> {}
export interface GameSessionResponse
  extends CommonResponse<GameSessionDto | null> {}
export interface GameCluesResponse
  extends CommonResponse<GameCluesDto | null> {}
