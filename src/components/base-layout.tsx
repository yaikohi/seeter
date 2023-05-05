import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import { UserNav } from "./user-nav";
import { Flame } from "lucide-react";
import Link from "next/link";

export const BaseLayout = (props: PropsWithChildren<object>) => {
  const { isSignedIn: userSignedIn } = useUser();

  return (
    <>
      <main className="relative">
        {/* <div className="absolute inset-0 -z-40 h-full w-full bg-opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted to-background"></div> */}
        <div className="absolute inset-0 -z-30 bg-gradient-to-r from-muted  via-blue-200 to-violet-200 blur-3xl"></div>
        <div className="z-100 m-8 mx-auto rounded-xl bg-background/40 px-4 py-2 shadow-2xl shadow-transparent backdrop-blur-3xl md:max-w-4xl">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="my-12 flex flex-col gap-8   ">
            {!userSignedIn && (
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
            )}
            {userSignedIn && (
              <div className="flex justify-between">
                <Flame className="invisible place-self-center" />
                <Link href="/">
                  <Flame className="place-self-center" />
                </Link>
                <UserNav />
              </div>
            )}
            {props.children}
          </div>
        </div>
      </main>
    </>
  );
};
