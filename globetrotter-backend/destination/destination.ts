import { api, APIError, ErrCode, Query } from "encore.dev/api";
import {
  CreateDestinationDto,
  DestinationResponse,
  UpdateDestinationDto,
} from "./types";
import DestinationService from "./destination.service";
import exp from "constants";

export const get = api(
  { expose: true, method: "GET", path: "/destinations" },
  async ({ id }: { id: Query }): Promise<DestinationResponse> => {
    try {
      const result = await DestinationService.get(id);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.NotFound, "Destination not found");
    }
  }
);

export const create = api(
  { expose: true, method: "POST", path: "/destinations", auth: false },
  async (data: CreateDestinationDto): Promise<DestinationResponse> => {
    try {
      const result = await DestinationService.create(data);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.InvalidArgument, "Invalid data");
    }
  }
);
export const update = api(
  { expose: true, method: "PATCH", path: "/destinations/:id" },
  async ({
    id,
    ...data
  }: { id: string } & UpdateDestinationDto): Promise<DestinationResponse> => {
    try {
      const result = await DestinationService.update(data, id);
      return result;
    } catch (error) {
      throw new APIError(ErrCode.InvalidArgument, "Invalid data");
    }
  }
);

export const random = api(
  { expose: true, method: "GET", path: "/destinations/random" },
  async (): Promise<DestinationResponse> => {
    try {
      const result = await DestinationService.random();
      return result;
    } catch (error) {
      throw new APIError(ErrCode.NotFound, "Destination not found");
    }
  }
);

interface Response {
  id: string;
}
