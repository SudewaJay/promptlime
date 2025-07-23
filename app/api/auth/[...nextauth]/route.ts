import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise";
import User from "@/models/User"; // Ensure this is correct
import connectToDatabase from "@/lib/mongodb";
import { NextAuthOptions, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

// Extend session type to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isPro?: boolean;
      createdAt?: string | Date;
    };
  }
}

interface ExtendedAdapterUser extends AdapterUser {
  isPro?: boolean;
  createdAt?: Date | string;
}

// ✅ Define your auth options
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "promptlime",
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: ExtendedAdapterUser }) {
      if (session.user) {
        // Add custom fields to session.user
        session.user.id = user.id;
        session.user.isPro = user.isPro ?? false;
        session.user.createdAt = user.createdAt ?? undefined;
      }
      return session;
    },
  },
};

// ✅ Export route handlers for Next.js App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };