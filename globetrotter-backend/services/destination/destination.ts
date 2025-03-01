import { api } from "encore.dev/api";

export const get = api(
  { expose: true, method: "GET", path: "/destinations/:id" },
  async ({ id }: { id: string }): Promise<Response> => {
    // const user = await prisma.user.findUnique({
    //   where: { id: parseInt(id) },
    // });
    return { id: id };
  }
);

interface Response {
  id: string;
}
