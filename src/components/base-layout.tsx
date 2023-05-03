import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";

export const BaseLayout = (props: PropsWithChildren<object>) => {
  const { user, isSignedIn: userSignedIn } = useUser();

  return (
    <>
      <main className="relative">
        <div className="absolute inset-0 -z-40 h-full w-full bg-opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted to-background"></div>
        <div className="z-100 mx-auto max-w-[80rem] rounded-xl bg-background/10 p-2 shadow-2xl shadow-transparent backdrop-blur-3xl">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="my-12 flex max-w-6xl flex-col gap-8 px-4 xl:mx-auto xl:flex-row">
            <div className="h-min rounded-xl p-8">
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
                <div className=" h-min min-w-max max-w-sm">
                  <h2>Hello {user.username}!</h2>
                  <p>Welcome to seeter</p>

                  <div className="flex flex-col gap-8 pt-4">
                    <Link href="/" className="hover:underline">
                      Home
                    </Link>

                    <SignOutButton>
                      <Button className="max-w-[100px]" variant={"secondary"}>
                        Sign out!
                      </Button>
                    </SignOutButton>
                  </div>
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
