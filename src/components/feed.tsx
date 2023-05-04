import type { ComponentProps } from "react";
import { Fade } from "react-awesome-reveal";
import { type RouterOutputs, api } from "~/utils/api";
import type { filterUserForClient } from "~/server/helpers/filterUserForClient";

import { type LoggedInUser, Seethe, SeetheDropdownMenu } from "./seethe";

interface MainFeedProps extends ComponentProps<"div"> {
  posts: RouterOutputs["posts"]["getAll"];
  loggedInUser: LoggedInUser | ReturnType<typeof filterUserForClient>;
  //   isSignedIn?: boolean;
}

/**
 * A feed of various Seethes.
 *
 * Can contain 'all' seethes or an individuals' specific seethes.
 */
export function MainFeed(props: MainFeedProps) {
  const {
    posts,
    loggedInUser,
    // isSignedIn,
    ...rest
  } = props;
  /**
   * Messy as hell but ok
   */
  const isActuallySignedIn = !!(
    loggedInUser && typeof loggedInUser.username === "string"
  );

  const ctx = api.useContext();

  return (
    <div className="flex flex-col gap-2 rounded-xl p-2" {...rest}>
      <h2>Seethes</h2>
      <div className="flex flex-col gap-2 xl:max-w-[60rem]">
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Fade damping={20}>
                <Seethe
                  post={post}
                  loggedInUser={loggedInUser}
                  //   isSignedIn={isSignedIn || isActuallySignedIn}
                >
                  <SeetheDropdownMenu
                    loggedInUser={loggedInUser}
                    post={post}
                    // isSignedIn={isSignedIn}
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
  //   isSignedIn?: boolean;
}

export function ProfileFeed(props: ProfileFeedProps) {
  const {
    posts,
    loggedInUser,
    // isSignedIn,
    ...rest
  } = props;
  const ctx = api.useContext();

  return (
    <div className="flex flex-col gap-2 rounded-xl p-2" {...rest}>
      <h2>Seethes</h2>
      <div className="flex flex-col gap-2 xl:max-w-[60rem]">
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Fade damping={20}>
                <Seethe
                  post={post}
                  loggedInUser={loggedInUser}
                  //   isSignedIn={isSignedIn}
                >
                  <SeetheDropdownMenu
                    loggedInUser={loggedInUser}
                    post={post}
                    // isSignedIn={isSignedIn}
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
