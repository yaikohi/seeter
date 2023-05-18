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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Pencil } from "lucide-react";
import { FormUpdateProfile } from "~/components/form-update-profile";
import { UserProfileHeader } from "~/components/user-profile-header";
import { toast } from "~/components/ui/use-toast";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const [open, setOpen] = React.useState(false);
  const { user: loggedInUser, isSignedIn } = useUser();
  const ctx = api.useContext();

  const { data: user } = api.profiles.getUserByUsername.useQuery({
    username,
  });
  const { data: userProfile } = api.profiles.getProfileById.useQuery({
    id: user?.id || "",
  });
  const { data: postsByUser, isLoading: postsLoading } =
    api.posts.getPostsById.useQuery({ userId: user?.id || "" });

  const { mutate: followProfile } = api.profiles.followProfile.useMutation({
    onSuccess: async () => {
      await ctx.profiles.invalidate();
      toast({ title: "Followed!" });
    },
  });

  if (!user) return <div>404</div>;

  if (postsLoading) {
    return <LoadingPage />;
  }

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
              <div className="flex w-full place-items-center justify-between gap-8 bg-background/30 p-8 px-2">
                <UserProfileHeader
                  username={username}
                  profileImageUrl={user.profileImageUrl}
                  profileDescription={userProfile?.description}
                />
                {loggedInUserOwnsProfile && (
                  <>
                    <Sheet open={open} onOpenChange={setOpen}>
                      <SheetTrigger asChild>
                        <Button variant={"secondary"} className="rounded-full">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent position="right" size="default">
                        <SheetHeader>
                          <SheetTitle>Edit profile</SheetTitle>
                          <SheetDescription>
                            {`Make changes to your profile here. Click save when you're done.`}
                          </SheetDescription>
                        </SheetHeader>

                        {/* Component for updating the profile username and / or description. */}
                        <FormUpdateProfile />
                      </SheetContent>
                    </Sheet>
                  </>
                )}

                {isSignedIn && !loggedInUserOwnsProfile && (
                  <>
                    <Button
                      onClick={() => {
                        followProfile({
                          userToFollowId: user.id,
                        });
                        console.log("followed!");
                      }}
                    >
                      follow
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mx-auto w-full rounded-xl">
            {loggedInUserOwnsProfile && <SeetheCreator hideAvatar={true} />}
            <ProfileFeed />
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
