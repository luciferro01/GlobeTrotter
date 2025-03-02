import { Header } from "encore.dev/api";
import { CommonResponse } from "../services/shared/types";

export interface RegisterUserDto {
  userName: string;
  // password: string; // This would need proper hashing
}

export interface UserDto {
  id: string;
  userName: string;
  createdAt: Date;
}

export interface LoginResponseDto {
  user: UserDto;
  token: string;
}

export interface UserResponse extends CommonResponse<UserDto | null> {}
export interface LoginResponse
  extends CommonResponse<LoginResponseDto | null> {}

export interface UserRegistrationResponse {
  success: boolean;
  data?: { userName: string; token: Header<"Authorization"> };
  message?: string;
}
