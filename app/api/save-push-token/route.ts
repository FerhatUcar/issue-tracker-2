import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const FILE = path.resolve("./tokens.json");

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Geen token meegegeven" }, { status: 400 });
    }

    let tokens: string[] = [];

    try {
      const content = await readFile(FILE, "utf-8");

      tokens = JSON.parse(content);

    } catch (e) {}
    if (!tokens.includes(token)) {
      tokens.push(token);

      await writeFile(FILE, JSON.stringify(tokens, null, 2));

      console.log("✅ Token opgeslagen:", token);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Fout bij opslaan token:", error);
    return NextResponse.json({ error: "Er ging iets mis" }, { status: 500 });
  }
}
