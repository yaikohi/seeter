import React from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { UserProfile } from "~/components/user-profile";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

interface SeetheCreatorProps {
  hideAvatar?: boolean;
}
export function SeetheCreator({ hideAvatar }: SeetheCreatorProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [input, setInput] = React.useState("");

  const ctx = api.useContext();

  /** Checks whether the url contains a username */
  const routeUsername = useRouter().asPath.replace("/@", "");

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      if (user?.username === routeUsername) {
        await ctx.posts.getPostsById.invalidate({ userId: user?.id });
        setInput("");
        toast({ title: "Seethed!" });
      } else {
        await ctx.posts.getAll.invalidate();
        setInput("");
        toast({ title: "Seethed!" });
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

  if (!user) return null;

  return (
    <div className="rounded-xl bg-background p-8 transition-all duration-100 ease-in-out hover:bg-background sm:bg-background/40">
      <div className="mx-2 flex gap-4 ">
        {!hideAvatar && <UserProfile imgUrl={user.profileImageUrl} />}

        <div className="flex max-w-[50rem] flex-grow flex-col gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's up?"
            disabled={isPosting}
          />

          <div className="flex justify-between">
            {input.length > 100 && (
              <p className="text-sm text-red-500">
                Too many characters (over 100)!
              </p>
            )}
            <div className="flex gap-2">{/* Icons can be put here */}</div>
            <Button
              disabled={input === "" || input.length > 100}
              className="rounded-xl"
              variant={isPosting ? "loading" : "default"}
              onClick={() => mutate({ content: input })}
            >
              seethe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
