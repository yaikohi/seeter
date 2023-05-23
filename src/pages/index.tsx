import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/loading-page";
import { BaseLayout } from "~/components/base-layout";
import { MainFeed } from "~/components/feed";
import { SeetheCreator } from "~/components/seethe-creator";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Seeter</title>
      </Head>
      <BaseLayout>
        <div className="my-8 w-full xl:mx-auto xl:my-0">
          <SeetheCreator hideAvatar={true} />
          <MainFeed />
        </div>
      </BaseLayout>
    </>
  );
};

export default Home;
