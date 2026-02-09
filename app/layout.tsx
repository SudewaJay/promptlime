import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";
import { SearchProvider } from "@/context/SearchContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PromptLime | Premium AI Prompts & Creative Tools",
  description:
    "Discover high-quality AI prompts and creative assets to supercharge your workflow. Explore the best tools for AI generation at PromptLime.",
  openGraph: {
    title: "PromptLime | Premium AI Prompts & Creative Tools",
    description:
      "Discover high-quality AI prompts and creative assets to supercharge your workflow. Explore the best tools for AI generation at PromptLime.",
    url: "https://promptlime.space/",
    siteName: "PromptLime",
    images: [
      {
        url: "https://i.pinimg.com/736x/b4/8c/33/b48c33dd1dec716d1cb184c04b208d22.jpg",
        width: 1200,
        height: 630,
        alt: "PromptLime | Premium AI Prompts & Creative Tools",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptLime | Premium AI Prompts & Creative Tools",
    description:
      "Discover high-quality AI prompts and creative assets to supercharge your workflow. Explore the best tools for AI generation at PromptLime.",
    images: [
      "https://i.pinimg.com/736x/b4/8c/33/b48c33dd1dec716d1cb184c04b208d22.jpg",
    ],
  },
  // 👇 Add your Google AdSense meta here
  other: {
    "google-adsense-account": "ca-pub-1238521286098316",
  },
  verification: {
    other: {
      "p:domain_verify": "90e938baca6d644be96a5dcc11ad13e3",
    },
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
        <SessionWrapper>
          <SearchProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            {children}
            <Analytics />
          </SearchProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}