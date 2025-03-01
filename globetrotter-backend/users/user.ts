import { api } from "encore.dev/api";
import { prisma } from "../database";

// export const get = api(
//   { expose: true, method: "GET", path: "/users" },
//   async (): Promise<Response> => {
//     const users = await prisma.user.findMany();
//     return { users };
//   }
// );

export const get = api(
  { expose: true, method: "GET", path: "/users/:id" },
  async ({ id }: { id: string }): Promise<Response> => {
    // const user = await prisma.user.findUnique({
    //   where: { id: parseInt(id) },
    // });
    return { id: id };
  }
);

interface Response {
  // users?: User[];
  id: string;
}
