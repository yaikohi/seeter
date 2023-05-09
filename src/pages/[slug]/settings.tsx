import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { BaseLayout } from "~/components/base-layout";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Profile settings page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <h1>User Settings</h1>
        <div className="flex  flex-col md:flex-row md:gap-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your profile description.
              </CardDescription>
              <CardContent className="flex max-w-md flex-col gap-3">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <div className="flex flex-col gap-2">
                    <Textarea id="description" />
                    <p className="text-sm text-muted-foreground">
                      Max characters: 100
                    </p>
                    <Button className="max-w-[80px]">update</Button>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <CardDescription>
                Show others the links to your socials.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="github-link">GitHub</Label>
                <div className="flex gap-2">
                  <Input id="github-link" placeholder="@github_username" />
                  <Button>update</Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="readcv-link">readcv</Label>
                <div className="flex gap-2">
                  <Input id="readcv-link" placeholder="@readcv_username" />
                  <Button>update</Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="twitter-link">twitter</Label>
                <div className="flex gap-2">
                  <Input id="twitter-link" placeholder="@twitter_username" />
                  <Button>update</Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col gap-1">
                <Label htmlFor="website-link">Your website</Label>
                <div className="flex gap-2">
                  <Input
                    id="website-link"
                    placeholder="https://your-website.url/"
                  />
                  <Button>update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseLayout>
    </>
  );
};
export default ProfilePage;
