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
import { Button } from "~/components/ui/button";
import { Github, Pencil, Twitter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import Image from "next/image";
import { ProfileFeed } from "~/components/feed";
import { useUser } from "@clerk/nextjs";

type ProfileState = {
  username?: string;
  description?: string;
  urls?: {
    twitter?: string;
    readcv?: string;
    website?: string;
    github?: string;
  };
};
const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profiles.getUserByUsername.useQuery({
    username,
  });
  const loggedInUser = useUser().user;
  const { mutate } = api.profiles.updateProfile.useMutation();

  const [profile, setProfile] = React.useState<ProfileState>({
    username: "yaikohi",
    description: "",
    urls: {
      twitter: "",
      readcv: "",
      website: "",
      github: "",
    },
  });

  if (!user) return <div>404</div>;
  if (!loggedInUser) return <div>404</div>;

  const { data: postsByUser, isLoading: postsLoading } =
    api.posts.getPostsById.useQuery({ userId: user?.id });

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
                    <p className="text-sm font-light tracking-tight">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Facere nobis dolor laborum alias cupiditate
                    </p>
                    <div className="flex flex-row gap-1 overflow-x-auto">
                      <Github />
                      <Twitter />
                    </div>
                  </div>
                </div>

                {loggedInUserOwnsProfile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant={"secondary"} className="rounded-full">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent position="right" size="sm">
                      <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>
                          {`Make changes to your profile here. Click save when
                        you're done.`}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col gap-6 py-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input
                            id="username"
                            value={profile.username}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                username: e.target.value,
                              })
                            }
                            placeholder="@ykhi"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                description: e.target.value,
                              })
                            }
                            value={profile.description}
                            id="description"
                            placeholder="Some description of a maximum of 100 characters."
                          />
                        </div>
                      </div>
                      <SheetFooter>
                        <Button
                          onClick={() =>
                            mutate(profile)
                          }
                          type="submit"
                        >
                          Save changes
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          </div>
          <div className="mx-auto w-full rounded-xl">
            <ProfileFeed loggedInUser={loggedInUser} posts={postsByUser} />
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
