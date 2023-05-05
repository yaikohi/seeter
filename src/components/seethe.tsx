import type { ComponentProps } from "react";
import { api, type RouterOutputs } from "~/utils/api";
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
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { SignInButton, type useUser } from "@clerk/nextjs";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";

export type PostGetAllOutput = RouterOutputs["posts"]["getAll"];
export type LoggedInUser = ReturnType<typeof useUser>["user"];

interface SeetheProps extends ComponentProps<"div"> {
  post: RouterOutputs["posts"]["getAll"][number];
  loggedInUser: LoggedInUser | ReturnType<typeof filterUserForClient>;
}

export function Seethe(props: SeetheProps) {
  const {
    children,
    post: { content, username, createdAt },
  } = props;

  return (
    <div className="flex flex-col rounded-xl bg-background sm:bg-background/60 p-2 opacity-100 transition-all duration-100 ease-in-out hover:bg-background">
      <div className="flex place-items-center justify-between gap-2 px-2 py-1 text-sm">
        <div className="flex place-items-center gap-2">
          <h3 className="text-base font-bold">{username as string}</h3>
          <Link
            href={`/@${username as string}`}
            className="text-smfont-light tracking-tight hover:underline"
          >{`@${username as string}`}</Link>
          <span className="font-light">·</span>
          <span className="font-light">
            {intlFormatDistance(createdAt, new Date())}
          </span>
        </div>
        {children}
      </div>
      <p className="ml-2 break-words">{content}</p>
    </div>
  );
}

interface SeetheDropdownMenuProps extends SeetheProps {
  ctx: ReturnType<typeof api.useContext>;
}
/**
 * The dropdown menu + dialogue modal for a Seethe.
 *
 * There are currently three states that are possible.
 * - user is not logged in
 * - user is logged in + is not Seethe author
 * - user is logged in + is Seethe author
 *
 * TODO: Somehow refactor this?
 */
export function SeetheDropdownMenu(props: SeetheDropdownMenuProps) {
  const {
    ctx,
    post: { authorId, id },
    loggedInUser,
  } = props;

  const isLoggedInUserSeethe = loggedInUser && authorId === loggedInUser.id;

  const { mutate: deleteSeethe } = api.posts.delete.useMutation({
    onSuccess: async () => {
      toast({ title: "Seethe deleted!" });
      await ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors?.content;

      if (errorMessage) {
        return toast({ title: "Error", description: errorMessage[0] });
      }

      return toast({ title: "Error", description: e.message });
    },
  });

  /** User is logged in and is the Seethe author */
  if (isLoggedInUserSeethe) {
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

  /** User is logged in is not the Seethe author */
  if (loggedInUser?.id) {
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

  /** User is not logged in */
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
