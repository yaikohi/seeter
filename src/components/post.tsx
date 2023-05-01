import type { ComponentProps } from "react";
import type { RouterOutputs } from "~/utils/api";
import { intlFormatDistance } from "date-fns";
import { Fade } from "react-awesome-reveal";
export type PostGetAllOutput = RouterOutputs["posts"]["getAll"];

export function Posts({ posts }: { posts: PostGetAllOutput }) {
  return (
    <div className="rounded-xl p-2">
      <h2>Posts</h2>
      <div className="flex flex-col gap-2">
        {posts?.map((post) => {
          return (
            <div key={post.id}>
              <Fade damping={20}>
                <Post post={post} />
              </Fade>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PostProps extends ComponentProps<"div"> {
  post: RouterOutputs["posts"]["getAll"][number];
}

export function Post(props: PostProps) {
  const {
    post: { username, createdAt, content },
  } = props;
  return (
    <div className="flex transition-opacity duration-200 delay-200  opacity-100 flex-col rounded-xl bg-muted p-2">
      <div className="flex place-items-center gap-2">
        <p className="font-medium">{`@${username as string}`}</p>
        <span className="font-light">·</span>
        <span className="font-light">
          {intlFormatDistance(createdAt, new Date())}
        </span>
      </div>
      <div>
        <p>{content}</p>
      </div>
    </div>
  );
}
