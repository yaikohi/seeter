import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    });

    console.log(users);

    return posts;
  }),
});
