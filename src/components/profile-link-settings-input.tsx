import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function ProfileLinkSettingsInput() {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="website-link">Website</Label>
      <div className="flex">
        <Input type="website-link" />
        <Button>update</Button>
      </div>
    </div>
  );
}
