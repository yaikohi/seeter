import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import { UserNav } from "./user-nav";
import { Flame } from "lucide-react";
import Link from "next/link";

export const BaseLayout = (props: PropsWithChildren<object>) => {
  const { user, isSignedIn: userSignedIn } = useUser();

  return (
    <>
      <main className="relative">
        <div className="absolute inset-0 -z-40 h-full w-full bg-opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted to-background"></div>
        <div className="z-100 mx-auto max-w-[80rem] rounded-xl bg-background/10 p-2 shadow-2xl shadow-transparent backdrop-blur-3xl">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="my-12 flex flex-col gap-8   ">
            <div className="h-min rounded-xl  px-4">
              {!userSignedIn && (
                <div className="flex h-min min-w-min max-w-sm flex-col gap-8">
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
              )}
              {userSignedIn && (
                <div className="flex justify-between ">
                  <Flame className="invisible place-self-center" />
                  <Link href="/">
                    <Flame className="place-self-center" />
                  </Link>
                  <UserNav />
                </div>
              )}
            </div>
            {props.children}
          </div>
        </div>
      </main>
    </>
  );
};
