import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { BaseLayout } from "~/components/base-layout";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Seeter</title>
        <meta name="description" content="twitter but seeter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <h1>Profile</h1>
      </BaseLayout>
    </>
  );
};

export default ProfilePage;
