import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise";
import { AdapterUser } from "next-auth/adapters";

// ✅ Extend Session type
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

// ✅ Extend AdapterUser type
interface ExtendedAdapterUser extends AdapterUser {
  isPro?: boolean;
  createdAt?: Date | string;
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
    async session({ session, user }: { session: Session; user: ExtendedAdapterUser }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isPro = user.isPro ?? false;
        session.user.createdAt = user.createdAt ?? undefined;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// ✅ These exports are required for Next.js route handlers
export { handler as GET, handler as POST };