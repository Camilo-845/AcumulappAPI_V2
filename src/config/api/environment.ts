import dotenv from "dotenv";
dotenv.config();

export const environment = {
  port: process.env.PORT || "3123",
  nodeEnv: process.env.NODE_ENV || "development",

  jwtSecret: process.env.JWT_SECRET || "Top_Secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "604800",

  baseUrl: process.env.BASE_URL || "http://localhost:3123",

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",

  awsRegion: process.env.AWS_REGION || "us-east-1",

  awsBucketName: process.env.AWS_BUCKET_NAME || "",

  // db: {
  //     host: process.env.DB_HOST,
  //     port: parseInt(process.env.DB_PORT || '5432', 10),
  //     username: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  // },
  // jwtSecret: process.env.JWT_SECRET || 'tu_super_secreto'
};
