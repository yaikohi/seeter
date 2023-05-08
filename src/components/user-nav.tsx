import { useUser, UserButton, SignedIn } from "@clerk/nextjs";

export function UserNav() {
  return (
    <SignedIn>
      <UserButton />
    </SignedIn>
  );
}
