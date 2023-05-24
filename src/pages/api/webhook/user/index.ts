import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { Webhook } from "svix";
// const exampleHeaders = {
//   "svix-id": "msg_p5jXN8AQM9LWM0D4loKWxJek",
//   "svix-timestamp": "1614265330",
//   "svix-signature": "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=",
// };

const webhookVerifier = () => {
  const secret = process.env["CLERK_WEBHOOK_SIGNING_SECRET"];
  if (!secret) {
    throw new Error("No webhook secret found!");
  }

  return new Webhook(secret);
};

const updateProfileOnLoginHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    try {
      const payload = webhookVerifier().verify(
        JSON.stringify(req.body),
        // ts ignore bc idk why not && how would I typesafe this??
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req.headers
      );
      return res.status(200).json({ data: payload });
    } catch (cause) {
      // Another error occured
      console.error(cause);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const authorId = "123";
      res.status(200).json({
        message: `Profile for authorId: ${authorId} was successfully created!`,
      });
    } catch (cause) {
      if (cause instanceof TRPCError) {
        // An error from tRPC occured
        const httpCode = getHTTPStatusCodeFromError(cause);
        return res.status(httpCode).json(cause);
      }
      // Another error occured
      console.error(cause);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default updateProfileOnLoginHandler;
