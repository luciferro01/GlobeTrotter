import { CommonResponse } from "../shared/types";

export interface CreateDestinationDto {
  city: string;
  country: string;
  clues: string[];
  funFact: string[];
  trivia: string[];
  imageUrl?: string;
}

export interface GetDestinationDto {
  id: string;
  city: string;
  country: string;
  clues: string[];
  funFact: string[];
  trivia: string[];
  imageUrl?: string;
  createdAt: Date;
}

export interface UpdateDestinationDto {
  city?: string;
  country?: string;
  clues?: string[];
  funFact?: string[];
  trivia?: string[];
  imageUrl?: string;
}
export interface BulkCreateDestinationDto {
  destinations: CreateDestinationDto[];
}

export interface BulkDestinationResponse
  extends CommonResponse<{
    created: number;
    failed: number;
  }> {}
export interface DestinationResponse
  extends CommonResponse<CreateDestinationDto | null> {}
