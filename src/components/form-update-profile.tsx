import React from "react";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";
import { toast } from "./ui/use-toast";

type ProfileState = {
  description?: string;
};

export function FormUpdateProfile() {
  const [profile, setProfile] = React.useState<ProfileState>({
    description: "",
  });

  const ctx = api.useContext();

  const { mutate } = api.profiles.updateProfile.useMutation({
    onSuccess: async () => {
      await ctx.profiles.invalidate();
      toast({ title: "Your profile was updated!" });
      setProfile({
        description: "",
      });
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
    <div className="flex flex-col gap-6">
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
      <Button
        onClick={() => {
          mutate(profile);
        }}
        type="submit"
      >
        Save changes
      </Button>
    </div>
  );
}
