import type { ComponentProps } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { intlFormatDistance } from "date-fns";
import Link from "next/link";
import { SignInButton, type useUser } from "@clerk/nextjs";
import { LogIn, MoreHorizontal, Trash2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { toast } from "~/components/ui/use-toast";
import { buttonVariants } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";

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
    <div className="flex flex-col rounded-xl bg-background p-2 hover:bg-background sm:bg-background/60">
      <div className="flex place-items-center justify-between gap-2 px-2 py-1 text-sm">
        <div className="flex place-items-center gap-2">
          <h3 className="text-base font-bold">{username as string}</h3>
          <Link
            href={`/@${username as string}`}
            className="text-sm tracking-tight hover:underline"
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

type SeetheDropdownMenuProps = SeetheProps;
/**
 * The dropdown menu + dialogue modal for a Seethe.
 *
 * There are currently three states that are possible.
 * - user is not logged in
 * - user is logged in + is not Seethe author
 * - user is logged in + is Seethe author
 */
export function SeetheDropdownMenu(props: SeetheDropdownMenuProps) {
  const {
    post: { authorId },
    loggedInUser,
  } = props;

  const isLoggedInUserSeethe = loggedInUser?.id && authorId === loggedInUser.id;
  // hover on component to see context comment.
  if (isLoggedInUserSeethe) {
    return <LoggedInUserOwnsSeethe {...props} />;
  } else if (loggedInUser?.id) {
    return <LoggedInSeethe />;
  } else return <LoggedOutSeethe />;
}

type LoggedInUserOwnsSeetheProps = SeetheDropdownMenuProps;
/**Signed-in user is author of seethe and can only (for now) delete the Seethe. */
export const LoggedInUserOwnsSeethe = ({
  loggedInUser,
  post,
}: LoggedInUserOwnsSeetheProps) => {
  const ctx = api.useContext();
  const pageUser = useRouter().asPath.replace("/@", "");

  const loggedInUserOwnsProfile =
    loggedInUser && loggedInUser.username === pageUser;

  const { mutate: deleteSeethe, isLoading: isDeleting } =
    api.posts.delete.useMutation({
      onSuccess: async () => {
        if (loggedInUserOwnsProfile) {
          await ctx.posts.getPostsById
            .invalidate({ userId: loggedInUser.id })
            .then(() => toast({ title: "Seethe deleted!" }));
        } else {
          await ctx.posts.getAll
            .invalidate()
            .then(() => toast({ title: "Seethe deleted!" }));
        }
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
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Open seethe options"
          title="Seethe options"
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent side={"left"}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex place-items-center gap-2">
              <Trash2 />
              <span> Delete</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this seethe from our servers?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({
              variant: isDeleting ? "loading" : "default",
            })}
            onClick={() => deleteSeethe({ postId: post.id })}
          >
            Delete seethe
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/** Signed-in user is not the Seethe author; can only 'follow' author of Seethe */
export const LoggedInSeethe = () => {
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
};

/** User is not logged in; can only 'sign-in'. */
export const LoggedOutSeethe = () => {
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
};
