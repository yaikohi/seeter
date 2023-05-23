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
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { ProfileFeed } from "~/components/feed";
import { useUser } from "@clerk/nextjs";
import { SeetheCreator } from "~/components/seethe-creator";

import { UserProfileHeader } from "~/components/user-profile-header";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profiles.getUserByUsername.useQuery({
    username,
  });

  const { data: postsByUser, isLoading: postsLoading } =
    api.posts.getPostsById.useQuery({ userId: user?.id || "" });

  const { user: loggedInUser, isSignedIn } = useUser();

  if (postsLoading) return <LoadingPage />;

  if (!user) return <div>404</div>;
  if (!postsByUser) return <div>404</div>;

  const loggedInUserOwnsProfile = isSignedIn && loggedInUser.id === user.id;

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
          <div className="from-sky/10 absolute inset-0  -z-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]  via-blue-200/20 to-violet-300/20 backdrop-blur-3xl"></div>
          <div className="bg-background-100/40 z-50 mx-auto w-full backdrop-blur-xl">
            <div className="flex h-full place-items-end">
              <UserProfileHeader
                user={user}
                username={username}
                profileImageUrl={user.profileImageUrl}
              />
            </div>
          </div>
          <div className="mx-auto w-full rounded-xl">
            {loggedInUserOwnsProfile && <SeetheCreator hideAvatar={true} />}
            <ProfileFeed pageUser={user} />
          </div>
        </div>
      </BaseLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null, userObj: null },
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
