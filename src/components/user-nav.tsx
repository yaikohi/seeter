import { LogOut, Settings, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export function UserNav() {
  const { user } = useUser();
  if (!user) return <div>Loading...</div>;

  const username = user.username as string;
  const githubUrl = `https://github.com/${username}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full bg-slate-500"
        >
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user?.profileImageUrl}
              alt={`${username}'s profile picture`}
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-4 w-56" align="center" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {githubUrl}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={`/@${username}`} className="flex">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <SignOutButton>
            <span>Sign out</span>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
