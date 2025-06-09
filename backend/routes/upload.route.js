// backend/routes/upload.js (Express.js)
import express from "express";
import { generatePresignedUrl } from "../utils/s3Presigned.js";

const router = express.Router();

router.get("/generate-upload-url", async (req, res) => {
  try {
    const { filename, contentType } = req.query;

    if (!filename || !contentType) {
      return res.status(400).json({ message: "Missing filename or contentType" });
    }

    const key = `airdrop-images/${filename}`;
    const url = await generatePresignedUrl({ key, contentType });

    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ uploadUrl: url, publicUrl });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    res.status(500).json({ message: "Failed to generate presigned URL" });
  }
});

export default router;
