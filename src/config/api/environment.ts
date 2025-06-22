import dotenv from "dotenv";
dotenv.config();

export const environment = {
  port: process.env.PORT || "3000",
  nodeEnv: process.env.NODE_ENV || "development",

  jwtSecret: process.env.JWT_SECRET || "Top_Secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "604800",

  // db: {
  //     host: process.env.DB_HOST,
  //     port: parseInt(process.env.DB_PORT || '5432', 10),
  //     username: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  // },
  // jwtSecret: process.env.JWT_SECRET || 'tu_super_secreto'
};
