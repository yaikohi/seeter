import { SignIn, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import { UserNav } from "./user-nav";
import { Flame } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ThemeSwitcher } from "./theme-switcher";

export const BaseLayout = (props: PropsWithChildren<object>) => {
  return (
    <>
      <main className="relative">
        <ThemeSwitcher />
        <div className="absolute inset-0 -z-30 bg-gradient-to-r from-muted  via-blue-200 to-violet-200 blur-3xl dark:via-blue-600 dark:to-violet-600"></div>
        <div className="z-100 m-8 mx-auto rounded-xl bg-background/40 px-4 py-2 shadow-2xl shadow-transparent backdrop-blur-3xl md:max-w-4xl">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="my-12 flex flex-col gap-8   ">
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
    <div className="flex justify-between">
      <div className="">
        <h2>Hello stranger!</h2>
        <p>Please login with github to seethe!</p>
      </div>

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
      <Flame className="invisible place-self-center" />
      <Link href="/">
        <Flame className="place-self-center" />
      </Link>
      <UserNav />
    </div>
  );
}
