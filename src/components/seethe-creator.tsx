import { useUser } from "@clerk/nextjs";
import { useToast } from "~/components/ui/use-toast";
import React from "react";
import { api } from "~/utils/api";
import { UserProfile } from "~/components/user-profile";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface SeetheCreatorProps {
  hideAvatar?: boolean;
}
export function SeetheCreator({ hideAvatar }: SeetheCreatorProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [input, setInput] = React.useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      toast({ title: "Seethed!" });
      setInput("");
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

  if (!user) return null;

  return (
    <div className="rounded-xl bg-background p-8 transition-all duration-100 ease-in-out hover:bg-background sm:bg-background/40">
      <div className="mx-2 flex gap-4 ">
        {!hideAvatar && <UserProfile imgUrl={user.profileImageUrl} />}

        <div className="flex max-w-[50rem] flex-grow flex-col gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's up?"
            type="text"
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
              className="max-w-[72px] rounded-full"
              variant={"default"}
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
