import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI image prompt generator for ChatGPT | PromptLime",
  description:
    "Build professional AI image prompts visually. The ultimate AI image prompt generator for ChatGPT and Gemini. Select styles, lighting, and cameras to perfect your Midjourney, DALL-E, or Gemini outputs.",
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
