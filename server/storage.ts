/**
 * Storage Module - AWS S3 / Cloudflare R2 Compatible
 * 
 * Provides direct S3/R2 storage without Manus dependencies.
 * Supports both AWS S3 and Cloudflare R2 (S3-compatible).
 * 
 * Configuration via environment variables:
 * - S3_REGION: AWS region (e.g., us-east-1)
 * - S3_ACCESS_KEY_ID: AWS access key
 * - S3_SECRET_ACCESS_KEY: AWS secret key
 * - S3_BUCKET_NAME: S3 bucket name
 * - S3_ENDPOINT: (Optional) For R2 or other S3-compatible services
 * - S3_PUBLIC_URL: (Optional) Custom public URL for files
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

// Initialize S3 Client
function getS3Client() {
  const region = process.env.S3_REGION || "us-east-1";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT; // For R2 or other S3-compatible

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 credentials not configured: set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY"
    );
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    ...(endpoint && { endpoint }),
  });
}

function getBucketName() {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }
  return bucket;
}

function getPublicUrl(key: string): string {
  const customUrl = process.env.S3_PUBLIC_URL;
  if (customUrl) {
    return `${customUrl.replace(/\/$/, "")}/${key}`;
  }

  // Default AWS S3 URL
  const region = process.env.S3_REGION || "us-east-1";
  const bucket = getBucketName();
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * Normalize key by removing leading slashes
 */
function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

/**
 * Append random hash suffix to filename to ensure uniqueness
 */
function appendHashSuffix(relKey: string): string {
  const hash = randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

/**
 * Upload file to S3/R2
 * 
 * @param relKey - Relative key/path (e.g., "products/image.jpg")
 * @param data - File data (Buffer, Uint8Array, or string)
 * @param contentType - MIME type (default: "application/octet-stream")
 * @returns Object with key and public URL
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getS3Client();
  const bucket = getBucketName();
  const key = appendHashSuffix(normalizeKey(relKey));

  // Convert string to Buffer if needed
  const body =
    typeof data === "string" ? Buffer.from(data, "utf-8") : data;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );

    const url = getPublicUrl(key);
    return { key, url };
  } catch (error) {
    throw new Error(
      `Failed to upload file to S3: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get presigned URL for downloading a file
 * 
 * @param relKey - Relative key/path
 * @param expiresIn - Expiration time in seconds (default: 3600)
 * @returns Object with key and presigned URL
 */
export async function storageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const client = getS3Client();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  try {
    // First check if object exists
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    // Generate presigned URL
    const url = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      { expiresIn }
    );

    return { key, url };
  } catch (error) {
    throw new Error(
      `Failed to get file from S3: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Delete file from S3/R2
 * 
 * @param relKey - Relative key/path
 */
export async function storageDelete(relKey: string): Promise<void> {
  const client = getS3Client();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
  } catch (error) {
    throw new Error(
      `Failed to delete file from S3: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Check if file exists in S3/R2
 * 
 * @param relKey - Relative key/path
 * @returns true if file exists, false otherwise
 */
export async function storageExists(relKey: string): Promise<boolean> {
  const client = getS3Client();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get public URL for a file without presigning
 * Use this when files are public or for direct references
 * 
 * @param relKey - Relative key/path
 * @returns Public URL
 */
export function getStorageUrl(relKey: string): string {
  const key = normalizeKey(relKey);
  return getPublicUrl(key);
}
