"use client";

import { SessionProvider } from "next-auth/react";
import { SearchProvider } from "@/context/SearchContext";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SearchProvider>{children}</SearchProvider>
    </SessionProvider>
  );
}