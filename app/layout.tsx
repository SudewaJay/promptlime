import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Promptlime – Best ChatGPT Prompts",
  description: "Stop guessing. Start generating. Discover the most powerful and curated ChatGPT prompts for every use case.",
  openGraph: {
    title: "Promptlime – Best ChatGPT Prompts",
    description: "Stop guessing. Start generating. Discover the most powerful and curated ChatGPT prompts for every use case.",
    url: "https://www.promptlime.space",
    siteName: "Promptlime",
    images: [
      {
        url: "https://www.promptlime.space/og-image.png", // 👈 Replace with your actual image
        width: 1200,
        height: 630,
        alt: "Promptlime – Best ChatGPT Prompts",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptlime – Best ChatGPT Prompts",
    description: "Stop guessing. Start generating. Discover the best prompts for ChatGPT.",
    images: ["https://www.promptlime.space/og-image.png"], // Same image for Twitter
  },
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