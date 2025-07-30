import fetch from "node-fetch";
import { JWT } from "google-auth-library";
import { pushToken } from "../token";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];
const projectId = serviceAccount.project_id;

async function getAccessToken() {
  const jwtClient = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: SCOPES,
  });

  const tokens = await jwtClient.authorize();
  return tokens.access_token;
}

export async function sendPush(
  token: string,
  title: string,
  body: string,
  url?: string,
) {
  const accessToken = await getAccessToken();

  const message = {
    message: {
      token,
      notification: {
        title,
        body,
      },
      ...(url && {
        webpush: {
          fcmOptions: {
            link: url, // f.e. https://rocketissues.com/issues/123
          },
        },
      }),
    },
  };

  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    },
  );

  const text = await res.text();

  try {
    const json = JSON.parse(text);

    console.log("✅ Verzonden:", json);

    return json;
  } catch (err) {
    console.error("❌ Geen JSON:", text);
    return null;
  }
}

sendPush(
  pushToken,
  "title",
  "body",
);
