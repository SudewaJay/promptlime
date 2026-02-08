import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";
import { SearchProvider } from "@/context/SearchContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Promptlime – Best ChatGPT Prompts",
  description:
    "Stop guessing. Start generating. Discover the most powerful and curated ChatGPT prompts for every use case.",
  openGraph: {
    title: "Promptlime – Best ChatGPT Prompts",
    description:
      "Stop guessing. Start generating. Discover the most powerful and curated ChatGPT prompts for every use case.",
    url: "https://www.promptlime.space",
    siteName: "Promptlime",
    images: [
      {
        url: "/images/promptlime site feature image.jpg",
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
    description:
      "Stop guessing. Start generating. Discover the best prompts for ChatGPT.",
    images: ["/images/promptlime site feature image.jpg"],
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
          </SearchProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}