import { Fade } from "react-awesome-reveal";
import { type RouterOutputs, api } from "~/utils/api";

import { Seethe, SeetheDropdownMenu } from "./seethe";
import { useUser } from "@clerk/nextjs";

/**
 * A feed of various Seethes.
 *
 * Can contain 'all' seethes or an individuals' specific seethes.
 */
export function MainFeed() {
  const { user: loggedInUser } = useUser();
  const { data: posts } = api.posts.getAll.useQuery();

  return (
    <div className="my-8 flex flex-col gap-2 rounded-xl bg-background/30 p-2 ">
      <h2>Seethes</h2>
      {posts?.map((post) => {
        return (
          <Fade key={post.id} damping={20}>
            <Seethe post={post} loggedInUser={loggedInUser}>
              <SeetheDropdownMenu loggedInUser={loggedInUser} post={post} />
            </Seethe>
          </Fade>
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

  if (!loggedInUser || !loggedInUser.id) {
    return <p>Not logged in.</p>;
  }

  const { data: posts } = api.posts.getPostsById.useQuery({
    userId: pageUser?.id,
  });

  return (
    <div className="my-8 flex flex-col gap-2 rounded-xl bg-background/30 p-2 ">
      <h2>Seethes</h2>
      {posts?.map((post) => {
        return (
          <Fade key={post.id} damping={20}>
            <Seethe post={post} loggedInUser={loggedInUser}>
              <SeetheDropdownMenu loggedInUser={loggedInUser} post={post} />
            </Seethe>
          </Fade>
        );
      })}
    </div>
  );
}
