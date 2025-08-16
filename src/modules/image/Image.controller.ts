import { Request, Response } from "express";
import { uploadFile } from "../../utils/aws";
import { asyncHandler } from "../../core";

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    // Handle error when no file is uploaded
    res.status(400).send({ message: "No file uploaded." });
    return;
  }
  const { url, key } = await uploadFile(req.file);
  res.status(200).send({
    message: "File uploaded successfully",
    url,
    key,
  });
});
