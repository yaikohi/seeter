import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { useToast } from "~/components/ui/use-toast";
import { LoadingPage } from "~/components/loading-page";
import { UserProfile } from "~/components/user-profile";
import { BaseLayout } from "~/components/base-layout";
import { MainFeed } from "~/components/feed";

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
    <div className="rounded-xl bg-background p-8 transition-all duration-100 ease-in-out hover:bg-background sm:bg-background/40">
      <div className="mx-2 flex gap-4 ">
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
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <BaseLayout>
        <div className="my-8 w-full xl:mx-auto xl:my-0">
          <PostCreator />

          {postsLoading && <LoadingSpinner />}
          {!postsLoading && posts && (
            <MainFeed posts={posts} loggedInUser={user} />
          )}
        </div>
      </BaseLayout>
    </>
  );
};

export default Home;
