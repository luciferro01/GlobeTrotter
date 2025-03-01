import { api, APIError, ErrCode, Query } from "encore.dev/api";
import { CreateDestinationDto, DestinationResponse } from "./types";
import DestinationService from "./destination.service";

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

interface Response {
  id: string;
}
