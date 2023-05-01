import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
// import { type Post } from "@prisma/client";
// import { type User } from "@clerk/nextjs/dist/api";
// import { TRPCError } from "@trpc/server";
// import { RouterOutputs } from "~/utils/api";

// const filterUserForClient = (user: User) => {
//   return {
//     id: user.id,
//     username: user.username,
//     profileImageUrl: user.profileImageUrl,
//     externalUsername:
//       user.externalAccounts.find(
//         (externalAccount) => externalAccount.provider === "oauth_github"
//       )?.username || null,
//   };
// };

// const addUserDataToPosts = async (posts: Post[]) => {
//   const userId = posts.map((post) => post.authorId);
//   const users = (
//     await clerkClient.users.getUserList({
//       userId: userId,
//       limit: 110,
//     })
//   ).map(filterUserForClient);

//   return posts.map((post) => {
//     const author = users.find((user) => user.id === post.authorId);
//     if (!author) {
//       console.error("AUTHOR NOT FOUND");
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
//       });
//     }
//     if (!author.username) {
//       // user the ExternalUsername
//       if (!author.externalUsername) {
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: `Author has no GitHub Account: ${author.id}`,
//         });
//       }
//       author.username = author.externalUsername;
//     }
//     return {
//       post,
//       author: {
//         ...author,
//         username: author.username ?? "(username not found)",
//       },
//     };
//   });
// };

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

    const newPosts = posts.map((post) => {
      const foundUser = users.find((user) => user.id === post.authorId);
      const username = foundUser ? foundUser.username : "null";

      return {
        ...post,
        username,
      };
    });

    return newPosts;
  }),

  create: privateProcedure
    .input(z.object({ content: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
});
