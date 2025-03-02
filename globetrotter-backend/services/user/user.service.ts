import { env } from "process";
import { prisma } from "../../database";
import { LoginResponse, RegisterUserDto, UserResponse } from "./user.types";
import jwt from "jsonwebtoken";
// In a real-world app, move this to environment variables
const JWT_SECRET = env.JWT_SECRET;

const UserService = {
  register: async (data: RegisterUserDto): Promise<LoginResponse> => {
    const checkUserName = await prisma.user.findUnique({
      where: { userName: data.userName },
    });
    if (checkUserName) {
      return {
        success: false,
        message: "User already exists",
        data: null,
      };
    }
    const user = await prisma.user.create({
      data,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          userName: user.userName,
          createdAt: user.createdAt,
        },
        token,
      },
    };
  },

  getProfile: async (userId: string): Promise<UserResponse> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    return {
      success: true,
      data: {
        id: user.id,
        userName: user.userName,
        createdAt: user.createdAt,
      },
    };
  },
};

export default UserService;
