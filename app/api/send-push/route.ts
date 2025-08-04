import { sendPush } from "@/app/lib/sendPush";
import { NextRequest, NextResponse } from "next/server";

type Url = {
  token: string;
  title: string;
  body: string;
  url?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { token, title, body, url } = (await req.json()) as Url;

    if (!token || !title || !body) {
      return NextResponse.json(
        { error: "token, title and body is mandatory" },
        { status: 400 },
      );
    }

    const result = (await sendPush(token, title, body, url)) as Promise<Url>;

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: "Push failed", detail: (error as Error).message },
      { status: 500 },
    );
  }
}
