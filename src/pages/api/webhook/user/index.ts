import { type NextApiRequest, type NextApiResponse } from "next";
import { Webhook } from "svix";
import { prisma } from "~/server/db";
import type {
  SessionCreatedPayload,
  UserCreatedPayload,
  UserUpdatedPayload,
  WebhookPayload,
} from "~/types/Webhook";

/** Ensures that the secret gets loaded properly. */
const webhook = () => {
  const secret = process.env["CLERK_WEBHOOK_SIGNING_SECRET"];
  if (!secret) {
    throw new Error("No webhook secret found!");
  }

  return new Webhook(secret);
};

const updateProfileOnLoginHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    try {
      const payload = webhook().verify(
        JSON.stringify(req.body),
        // ts ignore bc idk why not && how would I typesafe this??
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req.headers
      ) as WebhookPayload;

      switch (payload.type) {
        case "session.created": {
          payload.data as SessionCreatedPayload;
          return res
            .status(200)
            .json({ message: "Handler not implemented yet." });
        }
        case "user.created": {
          const authorId = payload.data.id;

          try {
            const newProfile = await prisma.profile.create({
              data: {
                authorId,
                username: (payload.data as UserCreatedPayload).username,
              },
            });

            res
              .status(200)
              .json({ message: "Profile created!", profile: newProfile });
            break;
          } catch (err) {
            res.status(500).json({ error: err });
            break;
          }
        }
        case "user.updated": {
          const authorId = payload.data.id;

          const newProfile = await prisma.profile.update({
            where: {
              authorId,
            },
            data: {
              username: (payload.data as UserUpdatedPayload).username,
            },
          });

          res
            .status(200)
            .json({ message: "Profile updated!", profile: newProfile });
          break;
        }
        default: {
          res
            .status(400)
            .json({ message: "Event type not supported by API point." });
          break;
        }
      }
    } catch (cause) {
      // Another error occured
      console.error(cause);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "There is nothing here." });
  }
};

export default updateProfileOnLoginHandler;
