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
import { Feed } from "~/components/post";
import { UserProfile } from "~/components/user-profile";
import { BaseLayout } from "~/components/base-layout";

function PostCreator() {
  const { user } = useUser();
  const { toast } = useToast();
  const [input, setInput] = React.useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      toast({ title: "Seethed!" });
      setInput("");
      await ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors?.content;

      if (errorMessage) {
        return toast({ title: "Error", description: errorMessage[0] });
      }

      return toast({ title: "Error", description: e.message });
    },
  });

  if (!user) return null;

  return (
    <div className="mx-2 flex gap-4">
      <UserProfile imgUrl={user.profileImageUrl} />

      <div className="flex max-w-[50rem] flex-grow flex-col gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's up?"
          type="text"
          disabled={isPosting}
        />

        <div className="flex justify-between">
          {input.length > 100 && (
            <p className="text-sm text-red-500">
              Too many characters (over 100)!
            </p>
          )}
          <div className="flex gap-2">{/* Icons can be put here */}</div>
          <Button
            disabled={input === "" || input.length > 100}
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
  const { user, isLoaded: userLoaded } = useUser();
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading && !userLoaded) return <div />;
  if (postsLoading) return <LoadingPage />;
  return (
    <>
      <Head>
        <title>Seeter</title>
        <meta name="description" content="twitter but seeter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <div className="my-8 w-full xl:mx-auto xl:my-0">
          <PostCreator />

          {postsLoading && <LoadingSpinner />}
          {!postsLoading && posts && <Feed posts={posts} loggedInUser={user} />}
        </div>
      </BaseLayout>
    </>
  );
};

export default Home;
