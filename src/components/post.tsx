import type { ComponentProps } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { intlFormatDistance } from "date-fns";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import { LogIn, MoreHorizontal, Trash2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SignInButton, type useUser } from "@clerk/nextjs";
import { toast } from "./ui/use-toast";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";

export type PostGetAllOutput = RouterOutputs["posts"]["getAll"];
export type LoggedInUser = ReturnType<typeof useUser>["user"];

export function Feed({
  posts,
  loggedInUser,
  isSignedIn,
}: {
  posts: PostGetAllOutput;
  loggedInUser: LoggedInUser | ReturnType<typeof filterUserForClient>;
  isSignedIn?: boolean;
}) {
  /**
   * Messy as hell but ok
   */
  const isActuallySignedIn = !!(
    loggedInUser && typeof loggedInUser.username === "string"
  );
  return (
    <div className="flex flex-col gap-2 rounded-xl p-2">
      <h2>Seethes</h2>
      <div className="flex flex-col gap-2 xl:max-w-[60rem]">
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Fade damping={20}>
                <Post
                  post={post}
                  loggedInUser={loggedInUser}
                  isSignedIn={isSignedIn || isActuallySignedIn}
                />
              </Fade>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PostProps extends ComponentProps<"div"> {
  post: RouterOutputs["posts"]["getAll"][number];
  loggedInUser: LoggedInUser | ReturnType<typeof filterUserForClient>;
  isSignedIn?: boolean;
}

export function Post(props: PostProps) {
  const {
    post: { content },
  } = props;

  return (
    <div className="flex flex-col rounded-xl bg-muted p-2 opacity-100 transition-opacity duration-200 delay-200">
      <PostName {...props} />
      <p className="ml-4 break-words">{content}</p>
    </div>
  );
}

export function PostName(props: PostProps) {
  const {
    post: { username, createdAt },
  } = props;

  return (
    <div className="flex place-items-center justify-between gap-2 px-2 py-1 text-sm">
      <div className="flex place-items-center gap-2">
        <Link
          href={`/@${username as string}`}
          className="text-base font-bold tracking-tight hover:underline"
        >{`@${username as string}`}</Link>
        <span className="font-light">·</span>
        <span className="font-light">
          {intlFormatDistance(createdAt, new Date())}
        </span>
      </div>
      <SeetheMenuOptions {...props} />
    </div>
  );
}

export function SeetheMenuOptions(props: PostProps) {
  const {
    post: { authorId, id },
    loggedInUser,
    isSignedIn,
  } = props;

  const isLoggedInUserSeethe = loggedInUser && authorId === loggedInUser.id;

  if (isSignedIn && isLoggedInUserSeethe) {
    const { mutate: deleteSeethe } = api.posts.delete.useMutation({
      onSuccess: () => {
        toast({ title: "Seethe deleted!" });
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors?.content;

        if (errorMessage) {
          return toast({ title: "Error", description: errorMessage[0] });
        }

        return toast({ title: "Error", description: e.message });
      },
    });
    return (
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={"left"}>
            <DialogTrigger asChild>
              <DropdownMenuItem className="flex place-items-center gap-2">
                <Trash2 />
                <span> Delete</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this seethe from our servers?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" onClick={() => deleteSeethe({ postId: id })}>
              Delete seethe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isSignedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent side={"left"}>
          <DropdownMenuItem disabled className="flex place-items-center gap-2">
            <User />
            <span>Follow</span>
            <DropdownMenuShortcut className="tracking-tight">
              Coming soon...
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent side={"left"}>
        <DropdownMenuItem className="flex place-items-center gap-2">
          <LogIn />
          <SignInButton>Sign in</SignInButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
