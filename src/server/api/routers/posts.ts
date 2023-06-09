import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

// Create a new ratelimiter, that allows 4 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(4, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 20,
    });

    const postsWithUsernames = posts.map((post) => {
      const foundUser = users.find((user) => user.id === post.authorId);
      const username = foundUser ? foundUser.username : "null";

      return {
        ...post,
        username,
      };
    });

    return postsWithUsernames;
  }),

  getPostsById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const postsByUser = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
        },
        take: 100,
        orderBy: {
          createdAt: "desc",
        },
      });

      const users = await clerkClient.users.getUserList({
        userId: postsByUser.map((post) => post.authorId),
        limit: 100,
      });

      const postsByUserWithUsername = postsByUser.map((post) => {
        const foundUser = users.find((user) => user.id === post.authorId);
        const username = foundUser ? foundUser.username : "null";

        return {
          ...post,
          username,
        };
      });

      return postsByUserWithUsername;
    }),

  create: privateProcedure
    .input(z.object({ content: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "The limit for seething is 4 requests per minute.",
        });
      }
      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
  delete: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
    }),
});
