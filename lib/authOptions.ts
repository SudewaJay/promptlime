import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise";
import { AuthOptions } from "next-auth";
import User from "@/models/User"; // ✅ use Mongoose model
import connectToDatabase from "@/lib/mongodb";

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
    strategy: "database",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? token.sub;
      }

      // 🟡 Fetch user from DB to get isPro
      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.isPro = dbUser.isPro || false;
        }
      } catch (err) {
        console.error("🔴 Failed to fetch user in JWT callback:", err);
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user || !token) return session;

      (session.user as any).id = token.sub;
      (session.user as any).isPro = token.isPro || false;

      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user.email });

        if (!dbUser) return session;

        const today = new Date().toDateString();
        const lastCopyDate = dbUser.lastCopyDate?.toDateString();
        const isSameDay = today === lastCopyDate;

        const copiesUsedToday = isSameDay ? dbUser.copiesToday || 0 : 0;
        const copiesLeft = dbUser.isPro ? Infinity : Math.max(0, 5 - copiesUsedToday);

        (session.user as any).copiesLeft = copiesLeft;
      } catch (err) {
        console.error("🔴 Failed to fetch user in session callback:", err);
      }

      return session;
    },
  },
};

export default authOptions;