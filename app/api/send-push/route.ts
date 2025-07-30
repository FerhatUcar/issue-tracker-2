import { sendPush } from "@/app/lib/sendPush";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, title, body, url } = await req.json();
    console.log("📩 Push API call ontvangen");
    console.log("📦 payload:", {
      token,
      title,
      body,
      url,
    });

    if (!token || !title || !body) {
      return NextResponse.json(
        { error: "token, title en body zijn verplicht" },
        { status: 400 }
      );
    }

    const result = await sendPush(token, title, body, url);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: "Push mislukt", detail: (error as Error).message },
      { status: 500 }
    );
  }
}