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
    await fileModel.create({
      fileId: fileid,
      uploadTime: Date.now(),
      objectName: objectName,
      ownerId: req.user._id,
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

export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await fileModel.findOne({ fileId });
    if (!file) return res.status(404).json({ error: "File not found" });

    const objectKey = file.objectName;

    const stream = await minioClient.getObject(process.env.MINIO_BUCKET, objectKey);
    res.setHeader("Content-Disposition", `attachment; filename="${objectKey}"`);
    stream.pipe(res);

  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error downloading File" });
  }
}

export const getMyFiles = async (req, res) => {
  try {
    const files = await fileModel.find({ ownerId: req.user._id })
    if (!files) return res.json("Cannot find your files")
    return res.json({ files });

  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error getting Files" });
  }
}

export const getFileById = async (req, res) => {
  try {
    const { fileid } = req.params;
    const file = await fileModel.findById(fileid);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (!file.ownerId.equals(req.user._id))
      return res.status(403).json({ error: "Access denied" });

    return res.json({ file });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error getting File" });
  }
}

export const updateFileVisibility = async (req, res) => {
  try {

  }
  catch {

  }
}
export const deleteFile = async (req, res) => {
  try {
    const { fileid } = req.params;
    const file = await fileModel.findById(fileid);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (!file.ownerId.equals(req.user._id))
      return res.status(403).json({ error: "Access denied" });

    await minioClient.removeObject(process.env.MINIO_BUCKET, file.objectName);
    await fileModel.deleteOne({ _id: fileid });
    res.json({ message: "File deleted successfully" });

  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error deleting File" });
  }
}


