import "./globals.css";
import { Inter } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prompt Hubb",
  description: "Prompt marketplace powered by ChatGPT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ Session provider wrapper for NextAuth */}
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}