import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Uploads a buffer or string to Cloudflare R2
 */
export async function uploadToR2(key: string, body: Buffer | string, contentType: string) {
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME is not defined in environment variables");
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  return r2Client.send(command);
}

/**
 * Generates the Cloudflare Image Resizing URL
 * Format: https://<custom-domain>/cdn-cgi/image/<options>/<path-to-r2-object>
 */
export function getImageUrl(path: string, width = 800, quality = 85) {
  const domain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "images.promptlime.space";
  
  // If it's already a full URL (like Pinterest), return it as is (fallback during migration)
  if (path.startsWith("http")) return path;

  // Clean path (remove leading slash if present)
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  return `https://${domain}/cdn-cgi/image/width=${width},quality=${quality},format=auto/${cleanPath}`;
}
