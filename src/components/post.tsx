import type { ComponentProps } from "react";
import type { RouterOutputs } from "~/utils/api";
import { intlFormatDistance } from "date-fns";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Plus,
  PlusCircle,
  Settings,
  Trash,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
export type PostGetAllOutput = RouterOutputs["posts"]["getAll"];

export function Feed({ posts }: { posts: PostGetAllOutput }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-2">
      <h2>Seethes</h2>
      <div className="flex flex-col gap-2 xl:max-w-[60rem]">
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Fade damping={20}>
                <Post post={post} />
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
}

export function Post(props: PostProps) {
  const {
    post: { content, id },
  } = props;
  return (
    <div className="flex flex-col rounded-xl bg-muted p-2 opacity-100 transition-opacity duration-200 delay-200">
      <PostName post={props.post} />
      {/* <Link href={`/s/${id}`}> */}
      <p className="ml-4 break-words">{content}</p>
      {/* </Link > */}
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
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <DropdownMenuItem className="flex place-items-center gap-2">
                  <Trash2 />
                  <span> Delete</span>
                </DropdownMenuItem>
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
            <Button type="submit">Delete seethe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
