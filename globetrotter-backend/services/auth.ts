import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { prisma } from "../database";
import jwt from "jsonwebtoken";

interface AuthParams {
  authorization: Header<"Authorization">;
}
interface AuthResponse {
  userID: string;
}

export const myAuthHandler = authHandler<AuthParams, AuthResponse>(
  async (params) => {
    if (!params.authorization) {
      throw APIError.unauthenticated("Authorization header is missing");
    }
    const token = params.authorization.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("no token provided");
    }

    try {
      //decode token
      const userId = jwt.decode(token) as string;

      //verify token with jsonwebtoken
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw APIError.unauthenticated("invalid token");
      }
      return { userID: user.id };
    } catch (error) {
      throw APIError.unauthenticated("invalid token");
    }
  }
);

export const gateway = new Gateway({
  authHandler: myAuthHandler,
});
