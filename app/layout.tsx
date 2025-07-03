import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
      <body className={`${inter.className} bg-[#0f0f0f] text-white`}>
        {/* ✅ NextAuth session provider wrapper */}
        <SessionWrapper>
          {/* ✅ Global Toast notifications */}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          
          {/* ✅ Page content */}
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}