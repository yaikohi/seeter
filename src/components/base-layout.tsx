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
        <div className="absolute inset-0 -z-30 bg-gradient-to-t from-primary-foreground/50 via-tint-blue/50 to-tint-violet/50 blur-[1000px]"></div>
        <div className="z-100 m-8 mx-auto max-w-lg rounded-xl bg-background/80 px-0 py-2 shadow-2xl shadow-transparent backdrop-blur-3xl md:max-w-2xl md:px-4">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="my-12 flex w-full flex-col gap-8">
            <SignedOut>
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
    <>
      <div className="">
        <h2>Hello stranger!</h2>
        <p>Please login with github to seethe!</p>
      </div>
      <div className="grid grid-flow-dense grid-cols-3 place-items-center justify-items-center">
        <Link href="/" className="col-start-2">
          <Flame aria-label="Go to home page" />
        </Link>
        <SignInButton>
          <Button
            className="col-start-3 mr-2 max-w-max place-self-end"
            size="sm"
            variant={"default"}
          >
            Sign in!
          </Button>
        </SignInButton>
      </div>
    </>
  );
}

export function UserSignedInHeader() {
  return (
    <div className="flex place-items-center justify-between">
      <Flame className="invisible" />
      <Link href="/">
        <Flame className="place-self-center" aria-label="Go to the home page" />
      </Link>
      <UserNav />
    </div>
  );
}
