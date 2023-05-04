import {
  type GetStaticPropsContext,
  type GetStaticProps,
  type NextPage,
  type GetStaticPaths,
} from "next";
import Head from "next/head";
import React from "react";
import { BaseLayout } from "~/components/base-layout";
import { LoadingPage } from "~/components/loading-page";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user, isLoading: userLoading } =
    api.profiles.getUserByUsername.useQuery({
      username,
    });

  if (userLoading) {
    console.log("\n\nLoading state hit for user!\n\n");
    return <LoadingPage />;
  }

  if (!user) return <div>404</div>;

  const { data: postsByUser, isLoading: postsLoading } =
    api.posts.getPostsById.useQuery({ userId: user.id });

  if (postsLoading) {
    console.log("\n\nLoading state hit for postsByUser!\n\n");
    return <LoadingPage />;
  }

  if (!postsByUser) return <div>404</div>;

  return (
    <>
      <Head>
        <title>
          {user.username}
          {"'"}s profile
        </title>
        <meta name="description" content="user seeter profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <div className="flex w-full flex-col gap-20">
          <div className="h-48">
            <div className="flex h-full place-items-end">
              <div className="flex w-full place-items-center gap-8 px-2">
                <Image
                  src={user.profileImageUrl}
                  alt={`${
                    user.username ? user.username : username ?? ""
                  }'s profile picture`}
                  height={8 * 12}
                  width={8 * 12}
                  className="max-h-[96px] max-w-[96px] rounded-full"
                />
                <div className="flex flex-col ">
                  <div className="flex flex-col">
                    <h1 className="border-b-2 border-border text-xl font-bold tracking-normal">
                      {"@"}
                      {user.username}
                    </h1>
                  </div>
                  <div className="flex gap-4 pt-1">
                    <Link
                      href={`https://github.com/${username}`}
                      className="flex place-items-center gap-2 hover:underline"
                    >
                      <Github className="stroke-foreground/50" />
                      {/* <p className=""> Github</p> */}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Feed loggedInUser={user} posts={postsByUser} />
          </div>
        </div>
      </BaseLayout>
    </>
  );
};

import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import { Feed } from "~/components/post";

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No slug? why");

  const usernameFromSlug = slug.replace("@", "");

  await ssg.profiles.getUserByUsername.prefetch({ username: usernameFromSlug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: usernameFromSlug,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
