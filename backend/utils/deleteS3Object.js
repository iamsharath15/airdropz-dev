import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IMAGE_UPLOAD_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_IMAGE_UPLOAD_SECRET_ACCESS_KEY,
  },
});

export async function deleteObjectFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  try {
    await s3.send(command);
    console.log(`Deleted ${key} from S3.`);
  } catch (err) {
    console.error("Error deleting object from S3:", err);
    throw err;
  }
}
