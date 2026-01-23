import { minioClient } from "../config/minio.config.js";
import path from "path";
import crypto from "crypto";
import { fileModel, ShareLinkModel } from "../models/file.model.js";

//share/file-upload
export const fileUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const ext = path.extname(file.originalname);
    const objectName = crypto.randomUUID() + ext;
    const fileid = crypto.randomUUID();
    const storageRef = objectName;

    //fPutObject expects a file on disk hence using putobject with buffer
    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      objectName,
      file.buffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      },
    );
    await fileModel.insertOne({
      fileId: fileid,
      uploadTime: Date.now(),
      // ownerId: req.user.id,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      storageRef: storageRef,
    });

    return res.status(201).json({
      message: "File uploaded",
      fileId: fileid,
      objectKey: objectName,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error uploading file" });
  }
};

//share/:fileId/file
export const fileLinkGeneration = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { expiryTime } = req.body;
    const expiry = Number(expiryTime);
    if (!expiry || expiry < 10 || expiry > 3600) {
      return res.status(400).json({ error: "Invalid expiry time" });
    }

    if (!fileId) {
      return res.status(400).json({ error: "fileId is required" });
    }

    const file = await fileModel.findOne({ fileId: fileId });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    const url = await minioClient.presignedGetObject(
      process.env.MINIO_BUCKET,
      file.storageRef,
      expiry,
    );
    await ShareLinkModel.insertMany({
      link: url,
      ownerId: user,
    });

    return res.json({
      downloadUrl: url,
      expires: expiry,
      filename: file.originalName,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error generating sharing link" });
  }
};
