import { type RouterOutputs, api } from "~/utils/api";

import { Seethe, SeetheDropdownMenu } from "./seethe";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "./ui/loading-spinner";

/**
 * A feed of various Seethes.
 *
 * Can contain 'all' seethes or an individuals' specific seethes.
 */
export function MainFeed() {
  const { user: loggedInUser } = useUser();
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();

  return (
    <div className="my-8 flex flex-col gap-2 rounded-xl bg-background/30 p-2 ">
      <h2>Seethes</h2>

      {postsLoading && <LoadingSpinner />}

      {posts &&
        posts?.map((post) => {
          return (
            <Seethe post={post} loggedInUser={loggedInUser} key={post.id}>
              <SeetheDropdownMenu loggedInUser={loggedInUser} post={post} />
            </Seethe>
          );
        })}
    </div>
  );
}

interface ProfileFeedProps {
  pageUser: RouterOutputs["profiles"]["getUserByUsername"];
}

/** The feed that shoes on a user profile. */
export function ProfileFeed({ pageUser }: ProfileFeedProps) {
  const { user: loggedInUser } = useUser();

  const { data: posts, isLoading: postsLoading } =
    api.posts.getPostsById.useQuery({
      userId: pageUser?.id,
    });

  return (
    <div className="my-8 flex flex-col gap-2 rounded-xl bg-background/30 p-2 ">
      <h2>Seethes</h2>

      {postsLoading && <LoadingSpinner />}

      {posts &&
        posts?.map((post) => {
          return (
            <Seethe key={post.id} post={post} loggedInUser={loggedInUser}>
              <SeetheDropdownMenu loggedInUser={loggedInUser} post={post} />
            </Seethe>
          );
        })}
    </div>
  );
}
