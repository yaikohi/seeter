import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";

// const exampleHeaders = {
//   "svix-id": "msg_p5jXN8AQM9LWM0D4loKWxJek",
//   "svix-timestamp": "1614265330",
//   "svix-signature": "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=",
// };

const updateProfileOnLoginHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    // Create context and caller

    const sId = req.headers["svix-id"];
    const sTimestamp = req.headers["svix-timestamp"];
    const sSignature = req.headers["svix-signature"];

    // const caller = appRouter.createCaller(ctx);

    try {
      if (sId && sTimestamp && sSignature) {
        console.log({ sId, sTimestamp, sSignature });
        return res.status(200).json({ sId, sTimestamp, sSignature });
      }
      console.log(req.headers);
      return res.status(200).json("something happened");
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
