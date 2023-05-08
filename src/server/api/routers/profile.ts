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
  updateProfile: privateProcedure
    .input(
      z.object({
        username: z.string().min(4).max(20).optional(),
        description: z.string().min(1).max(100).optional(),
        urls: z
          .object({
            twitter: z.string().optional(),
            github: z.string().optional(),
            website: z.string().optional(),
            readcv: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // const test = {
      //   description: input.description,
      //   urls: input.urls,
      //   username: input.username,
      // };
      // console.log("\n\n___________TEST___________\n");
      // console.dir(test);
      // console.log("\n\n__________________________\n");

      const { prisma, userId } = ctx;

      const { urls, description, username } = input;

      if (urls) {
        if (urls.twitter) {
        }
        if (urls.github) {
        }
        if (urls.readcv) {
        }
        if (urls.website) {
        }
      }

      return await new Promise(() => ({ urls, description, username }));
    }),
});
