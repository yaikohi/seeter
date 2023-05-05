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
  const { data: user } = api.profiles.getUserByUsername.useQuery({
    username,
  });
  const loggedInUser = useUser().user;
  // const { mutate } = api.profiles.updateProfile.useMutation();

  if (!user) return <div>404</div>;

  const { data: postsByUser, isLoading: postsLoading } =
    api.posts.getPostsById.useQuery({ userId: user?.id });

  if (postsLoading) {
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
        <div className="relative flex w-full flex-col gap-8">
          <div className="absolute inset-0 -z-50  bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky/10  via-blue-200/20 to-violet-300/20 backdrop-blur-3xl"></div>
          <div className="bg-background-100/40 z-50 mx-auto w-full backdrop-blur-xl">
            <div className="flex h-full place-items-end">
              <div className="flex w-full flex-col place-items-center gap-8 bg-background/30 p-8 px-2">
                <Image
                  src={user.profileImageUrl}
                  alt={`${
                    user.username ? user.username : username ?? ""
                  }'s profile picture`}
                  height={64}
                  width={64}
                  className="max-h-[96px] max-w-[96px] rounded-full"
                />
                <h1 className="text-xl font-bold tracking-tighter">
                  {"@"}
                  {user.username}
                </h1>
              </div>
            </div>
          </div>
          <div className="mx-auto rounded-xl">
            <ProfileFeed loggedInUser={loggedInUser} posts={postsByUser} />
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
import { ProfileFeed } from "~/components/feed";
import { useUser } from "@clerk/nextjs";

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
