import { APIError, ErrCode, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { prisma } from "../../database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "globetrotter-secret-key";

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
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
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

// Helper to get user ID from request
export const getUserId = (req: any): string => {
  if (!req.auth?.userID) {
    throw new APIError(ErrCode.Unauthenticated, "Not authenticated");
  }
  return req.auth.userID;
};
