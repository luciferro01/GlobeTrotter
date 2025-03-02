import { api, APIError, ErrCode } from "encore.dev/api";
import { RegisterUserDto, UserRegistrationResponse } from "./user.types";
import UserService from "./user.service";

export const regitserUser = api(
  { expose: true, path: "/user/register", method: "POST", auth: false },
  async (data: RegisterUserDto): Promise<UserRegistrationResponse> => {
    try {
      const result = await UserService.register(data);
      return {
        success: result.success,
        data: result.data
          ? {
              userName: result.data.user.userName,
              token: `Bearer ${result.data.token}`,
            }
          : undefined,
        message: result.message,
      };
    } catch (error) {
      throw new APIError(ErrCode.InvalidArgument, "Invalid registration data");
    }
  }
);
