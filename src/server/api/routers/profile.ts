import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        userId: [input.id],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found.",
        });
      }

      return filterUserForClient(user);
    }),
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found.",
        });
      }

      return filterUserForClient(user);
    }),
  getProfileById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.profile.findUnique({
        where: {
          authorId: input.id,
        },
      });
    }),
  updateProfile: privateProcedure
    .input(
      z.object({
        username: z
          .string()
          // .min(4, "Username needs to be at least 4 characters long.")
          .max(20, "Username can only be 20 characters long.")
          .optional(),
        description: z
          .string()
          .max(100, "Description can only be 100 characters long.")
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { description, username } = input;

      if (typeof description === "string" && !username) {
        await ctx.prisma.profile.upsert({
          where: { authorId: ctx.userId },
          create: {
            authorId: ctx.userId,
            description: description || "",
            username: username || "",
          },
          update: {
            description: description,
          },
        });
      }

      if (typeof username === "string" && !description) {
        await ctx.prisma.profile.upsert({
          where: { authorId: ctx.userId },
          create: {
            authorId: ctx.userId,
            description: description || "",
            username: username || "",
          },
          update: {
            username: username,
          },
        });
      } else {
        await ctx.prisma.profile.upsert({
          where: { authorId: ctx.userId },
          create: {
            authorId: ctx.userId,
            description: description || "",
            username: username || "",
          },
          update: {
            description: description,
            username: username,
          },
        });
      }
    }),
  followProfile: privateProcedure
    .input(z.object({ userToFollowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userToFollowId } = input;
      console.dir({ userId: ctx.userId, userToFollowId });
      await ctx.prisma.profile.update({
        where: {
          authorId: ctx.userId,
        },
        data: {
          following: {
            create: {
              following: {
                connect: {
                  authorId: userToFollowId,
                },
              },
            },
          },
        },
      });
    }),
});
