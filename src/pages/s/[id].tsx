import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { BaseLayout } from "~/components/base-layout";

const PostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Seeter</title>
        <meta name="description" content="twitter but seeter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <h1>Seethe</h1>
      </BaseLayout>
    </>
  );
};

export default PostPage;
