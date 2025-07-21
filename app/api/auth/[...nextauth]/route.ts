import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise"; // ✅ Ensure correct path
import { AdapterUser } from "next-auth/adapters";

// Extend the Session user type to include isPro and createdAt
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isPro?: boolean;
      createdAt?: Date | string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isPro = (user as any).isPro || false; // TypeScript workaround
        session.user.createdAt = (user as any).createdAt;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };