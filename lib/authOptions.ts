import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // ✅ Add this
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "promptlime",
  }),
  providers: [
    // ✅ Admin login with username + password
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
          console.error("❌ Admin credentials not set in environment variables");
          return null;
        }

        const inputUsername = credentials?.username?.trim();
        const inputPassword = credentials?.password; // Passwords might have spaces, but usually not leading/trailing. Let's not trim password to be safe, or just check.

        console.log("🔐 Admin Login Attempt:");
        console.log(`   - Env Username Set: ${!!adminUsername}`);
        console.log(`   - Env Password Set: ${!!adminPassword}`);
        console.log(`   - Input Username: '${inputUsername}'`);
        console.log(`   - Match Username: ${inputUsername === adminUsername}`);
        console.log(`   - Match Password: ${inputPassword === adminPassword}`);

        if (
          inputUsername === adminUsername &&
          inputPassword === adminPassword
        ) {
          console.log("✅ Admin login successful");
          return { id: "admin", name: "Admin", email: "admin@promptlime.com" };
        }

        console.log("❌ Admin login failed: Invalid credentials");
        return null;
      },
    }),

    // ✅ Existing Google provider (unchanged)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: '/signin',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isPro = user.isPro;
        token.createdAt = user.createdAt ? new Date(user.createdAt) : undefined;
      }
      // Handle user updates if necessary (e.g. valid session updates)
      if (trigger === "update" && session) {
        token.isPro = session.user.isPro;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isPro = (token.isPro as boolean) ?? false;
        session.user.createdAt = (token.createdAt as Date) ?? undefined;
      }
      return session;
    },
  },
};