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
import Image from "next/image";
// import { ProfileFeed } from "~/components/feed";
import { useUser } from "@clerk/nextjs";
import { ProfileSheet } from "~/components/profile-sheet";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profiles.getUserByUsername.useQuery({
    username,
  });
  const loggedInUser = useUser().user;

  const { data: userProfile } = api.profiles.getProfileById.useQuery({
    id: user?.id || "",
  });

  const { data: postsByUser, isLoading: postsLoading } =
    api.posts.getPostsById.useQuery({ userId: user?.id || "" });

  if (!user) return <div>404</div>;
  if (!loggedInUser) return <div>no loggedin user!</div>;

  if (postsLoading) {
    return <LoadingPage />;
  }

  if (!postsByUser) return <div>404</div>;

  const loggedInUserOwnsProfile = loggedInUser.id === user.id;

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
              <div className="flex w-full place-items-center justify-between gap-8 bg-background/30 p-8 px-2">
                <div className="flex place-items-center gap-8">
                  <Image
                    src={user.profileImageUrl}
                    alt={`${
                      user.username ? user.username : username ?? ""
                    }'s profile picture`}
                    height={64}
                    width={64}
                    className="max-h-[96px] max-w-[96px] rounded-full"
                  />
                  <div className="flex max-w-xs flex-col">
                    <h1 className="text-xl font-bold tracking-tighter">
                      {"@"}
                      {user.username}
                    </h1>
                    {userProfile && (
                      <p className="text-sm font-light tracking-tight">
                        {userProfile.description}
                      </p>
                    )}
                    {/* <div className="flex flex-row gap-1 overflow-x-auto">
                      <Github />
                      <Twitter />
                    </div> */}
                  </div>
                </div>

                {loggedInUserOwnsProfile && <ProfileSheet />}
              </div>
            </div>
          </div>
          <div className="mx-auto w-full rounded-xl">
            {/* <ProfileFeed loggedInUser={loggedInUser} posts={postsByUser} /> */}
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
