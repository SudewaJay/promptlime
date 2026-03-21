import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Premium AI Prompts Library";
    const style = searchParams.get("style") || "Modern";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            backgroundImage: "radial-gradient(circle at top left, #3f6212 0%, #000 40%)",
            padding: "80px",
            border: "1px solid #ffffff10",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 50,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ width: 12, height: 24, backgroundColor: "#a3e635", borderRadius: 4 }} />
            <span style={{ fontSize: 24, fontWeight: "bold", color: "#fff", letterSpacing: "1px" }}>PromptLime</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: "#a3e635",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "4px",
                marginBottom: "20px",
              }}
            >
              {style.replace("-", " ")} Collection
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: "900",
                color: "#fff",
                lineHeight: 1.1,
                maxWidth: "900px",
                marginBottom: "40px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 24,
                color: "#ffffff60",
                maxWidth: "600px",
              }}
            >
              Copy-paste proven high-quality prompts specifically optimized for top AI tools.
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 50,
              right: 50,
              display: "flex",
              alignItems: "center",
              gap: "20px",
              backgroundColor: "#ffffff05",
              padding: "15px 30px",
              borderRadius: "50px",
              border: "1px solid #ffffff10",
            }}
          >
            <span style={{ color: "#fff", fontSize: 20 }}>promptlime.space</span>
            <div style={{ width: 40, height: 40, backgroundColor: "#a3e635", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    const err = error as Error;
    console.log(`${err.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
