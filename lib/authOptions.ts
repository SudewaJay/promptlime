// lib/authOptions.ts
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise";
import { AuthOptions, Session, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";

interface ExtendedToken extends JWT {
  isPro?: boolean;
  sub?: string;
}

interface ExtendedSession extends Session {
  user: Session["user"] & {
    id: string;
    isPro: boolean;
    copiesLeft?: number;
  };
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "promptlime",
  }),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database", // use "jwt" if you don't want DB sessions
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }): Promise<ExtendedToken> {
      if (user) {
        token.sub = user.id ?? token.sub;
      }

      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.isPro = dbUser.isPro || false;
        }
      } catch (err) {
        console.error("❌ Failed to fetch user in JWT callback:", err);
      }

      return token as ExtendedToken;
    },

    async session({ session, token }: { session: Session; token: JWT }): Promise<ExtendedSession> {
      const extToken = token as ExtendedToken;
      const extSession = session as ExtendedSession;

      if (!extSession.user || !extToken) return extSession;

      extSession.user.id = extToken.sub ?? "";
      extSession.user.isPro = extToken.isPro || false;

      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: extSession.user.email });

        if (!dbUser) return extSession;

        const today = new Date().toDateString();
        const lastCopyDate = dbUser.lastCopyDate?.toDateString();
        const isSameDay = today === lastCopyDate;

        const copiesUsedToday = isSameDay ? dbUser.copiesToday || 0 : 0;
        const copiesLeft = dbUser.isPro ? Infinity : Math.max(0, 5 - copiesUsedToday);

        extSession.user.copiesLeft = copiesLeft;
      } catch (err) {
        console.error("❌ Failed to fetch user in session callback:", err);
      }

      return extSession;
    },
  },
};