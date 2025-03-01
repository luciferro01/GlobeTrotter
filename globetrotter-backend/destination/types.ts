// import { JsonArray } from "@prisma/client/runtime/library";
import { CommonResponse } from "../services/shared/types";

export type JsonArray = any[];

export interface CreateDestinationDto {
  city: string;
  country: string;
  clues: JsonArray;
  funFact: JsonArray;
  trivia: JsonArray;
  imageUrl?: string;
}

export interface GetDestinationDto {
  id: string;
  city: string;
  country: string;
  clues: JsonArray;
  funFact: JsonArray;
  trivia: JsonArray;
  imageUrl?: string;
  createdAt: Date;
}

export interface UpdateDestinationDto {
  city?: string;
  country?: string;
  clues?: JsonArray;
  funFact?: JsonArray;
  trivia?: JsonArray;
  imageUrl?: string;
}

export interface DestinationResponse
  extends CommonResponse<CreateDestinationDto | null> {}
