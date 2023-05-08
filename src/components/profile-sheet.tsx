import { Label } from "~/components/ui/label";
import { Sheet, Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import React from "react";
import { api } from "~/utils/api";
import { toast } from "~/components/ui/use-toast";

type ProfileState = {
  username?: string;
  description?: string;
};
export function ProfileSheet() {
  const [profile, setProfile] = React.useState<ProfileState>({
    username: "",
    description: "",
  });

  const ctx = api.useContext();

  const { mutate } = api.profiles.updateProfile.useMutation({
    onSuccess: async () => {
      await ctx.profiles.invalidate();
      toast({ title: "Your profile was updated!" });
      setProfile({
        username: "",
        description: "",
      });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors?.content;

      if (errorMessage) {
        return toast({ title: "Error", description: errorMessage[0] });
      }

      console.log(e.message[0]);
      return toast({ title: "Error", description: e.message });
    },
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"secondary"} className="rounded-full">
          <Pencil className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent position="right" size="sm">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            {`Make changes to your profile here. Click save when
            you're done.`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  username: e.target.value,
                })
              }
              placeholder="ykhi"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              onChange={(e) =>
                setProfile({
                  ...profile,
                  description: e.target.value,
                })
              }
              value={profile.description}
              id="description"
              placeholder="Some description of a maximum of 100 characters."
            />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={() => mutate(profile)} type="submit">
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
