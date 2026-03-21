import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      isPro: boolean;
      createdAt?: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username?: string;
    isPro: boolean;
    createdAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    isPro: boolean;
    createdAt?: Date;
  }
}