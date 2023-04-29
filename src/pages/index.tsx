import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

const PostCreator = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="m-2 flex gap-4">
      <Avatar>
        <AvatarImage src={user.profileImageUrl} alt="Profile image" />
        <AvatarFallback>???</AvatarFallback>
      </Avatar>

      <Input placeholder="Seethe!" type="text" />
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();
  console.log(data);
  return (
    <>
      <Head>
        <title>seeter</title>
        <meta name="description" content="twitter but seeter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="bg-violet-50 p-2">
          <h1 className="tracking-tight">Seeter</h1>

          <PostCreator />
          <div className="bg-slate-100">
            <h2>Posts</h2>
            <div>
              {isLoading && <LoadingSpinner />}
              {!isLoading &&
                data &&
                data?.map((post) => <div key={post.id}>{post.content}</div>)}
            </div>
          </div>
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        <div>
          {!user.isSignedIn && (
            <SignInButton>
              <Button variant={"default"}>Sign in!</Button>
            </SignInButton>
          )}
          {user.isSignedIn && (
            <SignOutButton>
              <Button variant={"secondary"}>Sign out!</Button>
            </SignOutButton>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
