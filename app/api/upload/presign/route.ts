import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CF_ACCOUNT_ID 
    ? `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req: Request) {
  try {
    let contentType = "image/jpeg";
    let folder = "prompts";
    let ext = "jpg";

    try {
      const body = await req.json();
      if (body.contentType) contentType = body.contentType;
      if (body.folder) folder = body.folder;
    } catch {
      // Ignore JSON parse error if body is empty
    }

    if (contentType === "image/png") ext = "png";
    else if (contentType === "image/webp") ext = "webp";

    const fileKey = `${folder}/${uuidv4()}.${ext}`;
    
    // Default bucket name from env or fallback
    const bucketName = process.env.R2_BUCKET_NAME || "promptlime-images";

    const presignedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        ContentType: contentType, // Accept dynamic content types
      }),
      { expiresIn: 60 }
    );

    // Final public URL - using the custom domain if available
    const domain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "images.promptlime.space";
    const cleanedDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const publicUrl = `https://${cleanedDomain}/${fileKey}`;

    return NextResponse.json({ presignedUrl, publicUrl, fileKey });
  } catch (error) {
    const err = error as Error;
    console.error("Presign error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
