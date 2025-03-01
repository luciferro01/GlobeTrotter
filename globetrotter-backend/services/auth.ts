import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { prisma } from "../database";

interface AuthParams {
  authorization: Header<"Authorization">;
}
interface AuthResponse {
  userID: string;
  // status: "success";
  // user: {
  //   id: string;
  //   userName: string;
  // };
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
      //verify token with jsonwebtoken
      const user = await prisma.user.findUnique({
        where: { id: token },
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
