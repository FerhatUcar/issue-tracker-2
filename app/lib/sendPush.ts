import fetch from "node-fetch";
import { JWT } from "google-auth-library";
// import { pushToken } from "../token";
import dotenv from "dotenv";

dotenv.config();

type ServiceAccount = {
  client_email: string;
  private_key: string;
  project_id: string;
};

type FCMMessage = {
  message: {
    token: string;
    notification: {
      title: string;
      body: string;
    };
    webpush?: {
      fcmOptions: {
        link: string;
      };
    };
  };
};

type FCMResponse = {
  name?: string;
  error?: {
    code: number;
    message: string;
    status: string;
  };
};

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON!,
) as ServiceAccount;

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];
const projectId = serviceAccount.project_id;

async function getAccessToken(): Promise<string | null | undefined> {
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
): Promise<FCMResponse | null> {
  const accessToken = await getAccessToken();

  const message: FCMMessage = {
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
    const json = JSON.parse(text) as FCMResponse;

    console.log("✅ Send:", json);

    return json;
  } catch (err: unknown) {
    console.error("❌ No JSON:", text);

    return null;
  }
}

// sendPush(pushToken, "title", "body");
