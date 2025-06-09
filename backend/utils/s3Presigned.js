// backend/utils/s3Presigned.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IMAGE_UPLOAD_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_IMAGE_UPLOAD_SECRET_ACCESS_KEY,
  },
});

export async function generatePresignedUrl({ key, contentType }) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 minutes
  return url;
}
