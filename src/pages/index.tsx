import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import React from "react";
import { useToast } from "~/components/ui/use-toast";
import { LoadingPage } from "~/components/loading-page";
import { Posts } from "~/components/post";
import { UserProfile } from "~/components/user-profile";

function PostCreator() {
  const { user } = useUser();
  const { toast } = useToast();
  const [input, setInput] = React.useState("");

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      toast({ title: "Seethed!" });
      const ctx = api.useContext();
      setInput("");
      await ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      toast({ title: "Error" });
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        if (typeof errorMessage === "string") toast({ title: errorMessage });
        else {
          toast({ title: errorMessage[0] });
        }
      }
    },
  });

  if (!user) return null;

  return (
    <div className="m-2 flex gap-4">
      <UserProfile imgUrl={user.profileImageUrl} />

      <div className="flex flex-grow flex-col gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's up?"
          type="text"
          className=""
          disabled={isPosting}
        />
        <div className="flex justify-between">
          <div className="flex gap-2">
            {/* Icons can be put here */}
            {/* <div>icon</div> */}
            {/* <div>icon</div> */}
            {/* <div>icon</div> */}
            {/* <div>icon</div> */}
          </div>
          <Button
            className="max-w-[72px] rounded-full"
            variant={"default"}
            onClick={() => mutate({ content: input })}
          >
            seethe
          </Button>
        </div>
      </div>
    </div>
  );
}

const Home: NextPage = () => {
  const { user, isSignedIn: userSignedIn, isLoaded: userLoaded } = useUser();
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading && !userLoaded) return <div />;
  if (postsLoading) return <LoadingPage />;
  return (
    <>
      <Head>
        <title>seeter</title>
        <meta name="description" content="twitter but seeter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="p-2">
          <h1 className="mb-4 tracking-tight">Seeter</h1>
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="my-12 flex gap-8  px-4">
            <div className="rounded-xl bg-slate-200 p-8">
              {!userSignedIn && (
                <div className="my-8 min-w-max max-w-xs">
                  <div className="">
                    <h2>Hello stranger!</h2>
                    <p>Please login with github to seethe!</p>
                  </div>

                  <SignInButton>
                    <Button variant={"default"}>Sign in!</Button>
                  </SignInButton>
                </div>
              )}
              {userSignedIn && (
                <div className="my-8 min-w-max max-w-xs">
                  <h2>Hello {user.username}!</h2>
                  <p>Welcome to seeter</p>

                  <SignOutButton>
                    <Button variant={"secondary"}>Sign out!</Button>
                  </SignOutButton>
                </div>
              )}
            </div>
            <div className="w-full">
              <PostCreator />

              {postsLoading && <LoadingSpinner />}
              {!postsLoading && posts && <Posts posts={posts} />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
