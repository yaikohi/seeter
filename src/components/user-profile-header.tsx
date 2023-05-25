import Image from "next/image";
import { type RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

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
import { toast } from "~/components/ui/use-toast";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "./ui/loading-spinner";
// import Link from "next/link";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface UserProfileHeaderProps {
  username: string;
  user: RouterOutputs["profiles"]["getUserByUsername"];
  profileImageUrl: string;
}
export function UserProfileHeader({
  user,
  username,
  profileImageUrl,
}: UserProfileHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const { user: loggedInUser, isSignedIn } = useUser();
  const ctx = api.useContext();

  const { data: userProfile, isLoading: profileLoading } =
    api.profiles.getProfileById.useQuery({
      id: user?.id || "",
    });

  const { mutate: followProfile } = api.profiles.followProfile.useMutation({
    onSuccess: async () => {
      await ctx.profiles.invalidate();
      toast({ title: `Followed ${username}!` });
    },
  });

  const { mutate: unFollowProfile } = api.profiles.unFollowProfile.useMutation({
    onSuccess: async () => {
      await ctx.profiles.invalidate();
      toast({ title: `Unfollowed ${username}` });
    },
  });

  const loggedInUserOwnsProfile = isSignedIn && loggedInUser.id === user.id;

  if (!user) return <LoadingSpinner />;
  if (profileLoading) return <LoadingSpinner />;
  if (!userProfile) return <p>404</p>;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const followingCount: number = userProfile?.following.length;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const followedByCount: number = userProfile?.followedBy.length;

  const profileIsFollowedByLoggedInUser =
    loggedInUser &&
    (userProfile?.followedBy).filter(
      (profile) => profile.authorId === loggedInUser.id
    ).length === 1;
  return (
    <div className="mx-auto flex w-full place-items-center justify-between gap-8 rounded-xl bg-background/30 p-8">
      <div className="flex flex-col gap-4">
        <Image
          src={profileImageUrl}
          alt={`${username}'s profile picture`}
          height={120}
          width={120}
          className="rounded-full"
        />
        <div className="flex flex-col gap-2">
          <div className="flex max-w-xs flex-col">
            <h1 className="text-xl font-bold tracking-tighter">
              {"@"}
              {username}
            </h1>
            {userProfile.description && (
              <p className="text-sm font-light tracking-tight">
                {userProfile.description}
              </p>
            )}
          </div>
          <div className="flex gap-8">
            {/* <Link href={`/@${username}/following`}> */}
              <p className="text-base hover:underline">
                {followingCount}{" "}
                <span className="text-xs text-foreground/50">following</span>
              </p>
            {/* </Link> */}
            {/* <Link href={`/@${username}/followers`}> */}
              <p className="text-base hover:underline">
                {followedByCount}{" "}
                <span className="text-xs text-foreground/50">followers</span>
              </p>
            {/* </Link> */}
          </div>
        </div>
      </div>
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

      {isSignedIn &&
        !loggedInUserOwnsProfile &&
        !profileIsFollowedByLoggedInUser && (
          <>
            <Button
              onClick={() => {
                followProfile({
                  userToFollowId: user.id || "",
                });
              }}
            >
              follow
            </Button>
          </>
        )}
      {isSignedIn &&
        !loggedInUserOwnsProfile &&
        profileIsFollowedByLoggedInUser && (
          <>
            <Button
              onClick={() => {
                unFollowProfile({
                  userToUnfollowId: user.id || "",
                });
              }}
              variant={"secondary"}
            >
              unfollow
            </Button>
          </>
        )}
    </div>
  );
}
