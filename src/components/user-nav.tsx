import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { User, LogOut, Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { LoadingSpinner } from "./ui/loading-spinner";

export function UserNav() {
  const loggedInUser = useUser();
  const { signOut } = useClerk();

  const username = (loggedInUser.user as { username: string }).username;

  if (!loggedInUser.isLoaded) {
    return <LoadingSpinner />;
  }
  if (!loggedInUser.user?.username) {
    <LoadingSpinner />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full bg-slate-500"
          >
            <Avatar>
              {loggedInUser.isSignedIn && (
                <AvatarImage src={loggedInUser.user.profileImageUrl} />
              )}
              {loggedInUser.isSignedIn && (
                <AvatarFallback>
                  {(loggedInUser.user?.firstName || "").charAt(0)}
                  {(loggedInUser.user?.lastName || "").charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="bottom" sticky="partial">
          <DropdownMenuLabel>{`${username}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Button variant={"link"}>
                <Link href="/" className="flex">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button variant={"link"}>
                <Link href={`/@${username}`} className="flex">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Button
              onClick={() => {
                void signOut();
              }}
              variant={"link"}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign-out</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
