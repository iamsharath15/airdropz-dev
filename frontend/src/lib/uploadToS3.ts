// utils/uploadToS3.ts
import axios from 'axios';

export const uploadImageToS3 = async (
  file: File,
  s3PathPrefix: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const contentType = file.type;

  const s3Path = `${s3PathPrefix}.${fileExt}`;

  // Step 1: Get presigned URL
  const presignRes = await axios.get(
    'http://localhost:8080/api/upload/v1/generate-upload-url',
    {
      params: {
        filename: s3Path,
        contentType,
      },
    }
  );

  const { uploadUrl, publicUrl } = presignRes.data;

  // Step 2: Upload to S3
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': contentType,
    },
  });

  return publicUrl; // ✅ Use this in your payloads
};
