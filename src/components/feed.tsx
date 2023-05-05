import type { ComponentProps } from "react";
import { Fade } from "react-awesome-reveal";
import { type RouterOutputs, api } from "~/utils/api";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";

import { type LoggedInUser, Seethe, SeetheDropdownMenu } from "./seethe";

interface MainFeedProps extends ComponentProps<"div"> {
  posts: RouterOutputs["posts"]["getAll"];
  loggedInUser: LoggedInUser | ReturnType<typeof filterUserForClient>;
}

/**
 * A feed of various Seethes.
 *
 * Can contain 'all' seethes or an individuals' specific seethes.
 */
export function MainFeed(props: MainFeedProps) {
  const { posts, loggedInUser, ...rest } = props;

  const ctx = api.useContext();

  return (
    <div
      className="my-8 flex flex-col gap-2 rounded-xl bg-background/30 p-2 "
      {...rest}
    >
      <h2>Seethes</h2>
      <div className="flex flex-col gap-2 xl:max-w-[60rem]">
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Fade damping={20}>
                <Seethe post={post} loggedInUser={loggedInUser}>
                  <SeetheDropdownMenu
                    loggedInUser={loggedInUser}
                    post={post}
                    ctx={ctx}
                  />
                </Seethe>
              </Fade>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ProfileFeedProps {
  posts: RouterOutputs["posts"]["getAll"];
  loggedInUser: LoggedInUser | ReturnType<typeof filterUserForClient>;
}

export function ProfileFeed(props: ProfileFeedProps) {
  const { posts, loggedInUser, ...rest } = props;
  const ctx = api.useContext();

  return (
    <div
      className="my-8 flex flex-col gap-2 rounded-xl bg-background/30 p-2"
      {...rest}
    >
      <h2>Seethes</h2>
      <div className="flex flex-col gap-2 xl:max-w-[60rem]">
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Fade damping={20}>
                <Seethe post={post} loggedInUser={loggedInUser}>
                  <SeetheDropdownMenu
                    loggedInUser={loggedInUser}
                    post={post}
                    ctx={ctx}
                  />
                </Seethe>
              </Fade>
            </div>
          );
        })}
      </div>
    </div>
  );
}
