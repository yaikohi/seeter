import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import React from "react";
import { intlFormatDistance } from "date-fns";
import type { Post } from "@prisma/client";

const PostCreator = () => {
  const { user } = useUser();
  const { mutate } = api.posts.create.useMutation();

  const [input, setInput] = React.useState("");

  if (!user) return null;

  return (
    <div className="m-2 flex gap-4">
      <Avatar>
        <AvatarImage src={user.profileImageUrl} alt="Profile image" />
        <AvatarFallback>no avatar</AvatarFallback>
      </Avatar>

      <div className="flex flex-grow flex-col gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write something ..."
          type="text"
          className=""
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
};

const Home: NextPage = () => {
  const { user, isSignedIn: userSignedIn } = useUser();
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();
  console.log(posts);
  return (
    <>
      <Head>
        <title>seeter</title>
        <meta name="description" content="twitter but seeter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="p-2">
          <h1 className="tracking-tight">Seeter</h1>
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div>
            {!userSignedIn && (
              <SignInButton>
                <Button variant={"default"}>Sign in!</Button>
              </SignInButton>
            )}
            {userSignedIn && (
              <SignOutButton>
                <Button variant={"secondary"}>Sign out!</Button>
              </SignOutButton>
            )}
          </div>
          <div className="mx-auto max-w-lg">
            <PostCreator />
            {user?.username && (
              <Posts
                posts={posts}
                postsLoading={postsLoading}
                username={user.username}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

const Posts = ({
  username,
  posts,
  postsLoading,
}: {
  username: string;
  posts: Post[] | undefined;
  postsLoading: boolean;
}) => {
  return (
    <div className="rounded-xl p-2">
      <h2>Posts</h2>
      <div className="flex flex-col gap-2">
        {!posts && postsLoading && <LoadingSpinner />}
        {!postsLoading &&
          posts &&
          posts?.map((post) => {
            return (
              <div
                className="flex flex-col rounded-xl bg-muted p-2"
                key={post.id}
              >
                <div className="flex place-items-center gap-2">
                  <p className="font-medium">{`@${username}`}</p>
                  <span className="font-light">·</span>
                  <span className="font-light">
                    {intlFormatDistance(post.createdAt, new Date())}
                  </span>
                </div>
                <div>
                  <p>{post.content}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default Home;
