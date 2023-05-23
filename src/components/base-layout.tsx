import type { PropsWithChildren } from "react";
import React from "react";
import Link from "next/link";
import { SignIn, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { UserNav } from "~/components/user-nav";
import { Flame } from "lucide-react";
import { ThemeSwitcher } from "~/components/theme-switcher";

export const BaseLayout = (props: PropsWithChildren<object>) => {
  return (
    <>
      <main className="relative">
        <ThemeSwitcher />
        <div className="absolute inset-0 -z-30 bg-gradient-to-tl from-muted via-blue-200 to-violet-100 blur-3xl dark:via-blue-900 dark:to-violet-900"></div>
        <div className="z-100 m-8 mx-auto rounded-xl bg-background/40 px-4 py-2 shadow-2xl shadow-transparent backdrop-blur-3xl md:max-w-2xl">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="my-12 flex flex-col gap-8">
            <SignedOut>
              <div className="">
                <h2>Hello stranger!</h2>
                <p>Please login with github to seethe!</p>
              </div>
              <UserSignedOutHeader />
            </SignedOut>
            <SignedIn>
              <UserSignedInHeader />
            </SignedIn>
            <div>{props.children}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export function UserSignedOutHeader() {
  return (
    <div className="flex place-items-center justify-between">
      <Flame className="invisible" />
      <Link href="/">
        <Flame className="place-self-center" />
      </Link>

      <SignInButton>
        <Button className="" variant={"default"}>
          Sign in!
        </Button>
      </SignInButton>
    </div>
  );
}

export function UserSignedInHeader() {
  return (
    <div className="flex justify-between">
      <Flame className="invisible" />
      <Link href="/">
        <Flame className="place-self-center" />
      </Link>
      <UserNav />
    </div>
  );
}
