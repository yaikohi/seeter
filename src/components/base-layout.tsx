import type { PropsWithChildren } from "react";

export const BaseLayout = (props: PropsWithChildren<object>) => {
  return (
    <>
      <main className="relative">
        <div className="absolute inset-0 -z-40 h-full w-full bg-opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted to-background"></div>
        <div className="z-100 mx-auto max-w-[80rem] rounded-xl bg-background/10 p-2 shadow-2xl shadow-transparent backdrop-blur-3xl">
          {props.children}
        </div>
      </main>
    </>
  );
};
