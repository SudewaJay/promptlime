import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise"; // Make sure this path is correct

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise), // ✅ MongoDB adapter added

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      // 👇 Attach user id and custom fields if needed
      if (session?.user) {
        session.user.id = user.id;
        session.user.isPro = user.isPro || false; // assuming your DB has isPro field
        session.user.createdAt = user.createdAt;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };