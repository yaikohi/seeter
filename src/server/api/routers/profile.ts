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
      const userProfile = await ctx.prisma.profile.findUnique({
        where: {
          authorId: input.id,
        },
        include: {
          followedBy: true,
          following: true,
        },
      });

      if (!userProfile) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Profile not found.",
        });
      }

      return userProfile;
    }),
  updateProfile: privateProcedure
    .input(
      z.object({
        description: z
          .string()
          .max(100, "Description can only be 100 characters long.")
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.profile.upsert({
        where: { authorId: ctx.userId },
        create: {
          authorId: ctx.userId,
          description: input.description || "",
        },
        update: {
          description: input.description,
        },
      });
    }),
  followProfile: privateProcedure
    .input(z.object({ userToFollowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.profile.update({
        where: {
          authorId: ctx.userId,
        },
        data: {
          following: {
            connect: {
              authorId: input.userToFollowId,
            },
          },
        },
      });
    }),
  unFollowProfile: privateProcedure
    .input(z.object({ userToUnfollowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.profile.update({
        where: {
          authorId: ctx.userId,
        },
        data: {
          following: {
            disconnect: {
              authorId: input.userToUnfollowId,
            },
          },
        },
      });
    }),
});
