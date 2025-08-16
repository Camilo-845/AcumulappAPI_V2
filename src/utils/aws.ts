import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { environment } from "../config/api/environment";

const { awsAccessKeyId, awsSecretAccessKey, awsRegion, awsBucketName } =
  environment;

if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion || !awsBucketName) {
  throw new Error(
    "AWS credentials, region, or bucket name are not set in environment variables",
  );
}

// Crea un cliente S3
const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

export const uploadFile = async (file: {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}) => {
  const key = `${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: awsBucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  const url = `https://${awsBucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
  return { url, key };
};

export { s3Client };
