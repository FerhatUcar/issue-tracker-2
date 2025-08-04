import authOptions from "@/app/auth/authOptions";
import NextAuth from "next-auth";

// TODO: fix the handler type
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
