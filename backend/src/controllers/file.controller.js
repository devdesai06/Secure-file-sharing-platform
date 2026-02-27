import { minioClient } from "../config/minio.config.js";
import path from "path";
import crypto from "crypto";
import { fileModel, ShareLinkModel } from "../models/file.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

// ================= FILE UPLOAD =================
export const fileUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return errorResponse(res, "No file uploaded", 400);
    }

    const ext = path.extname(file.originalname);
    const objectName = crypto.randomUUID() + ext;
    const fileid = crypto.randomUUID();

    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      objectName,
      file.buffer,
      file.size,
      { "Content-Type": file.mimetype }
    );

    await fileModel.create({
      fileId: fileid,
      uploadTime: Date.now(),
      objectName,
      ownerId: req.user._id,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      storageRef: objectName,
    });

    return successResponse(
      res,
      "File uploaded successfully",
      { fileId: fileid, objectKey: objectName },
      200
    );
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error uploading file");
  }
};

// ================= GENERATE SHARE LINK =================
export const fileLinkGeneration = async (req, res) => {
  try {
    const { fileId } = req.params;
   const expiryTime = parseInt(req.query.expiryTime) || 300;

    const expiry = Number(expiryTime);
    if (!expiry || expiry < 10 || expiry > 3600) {
      return errorResponse(res, "Invalid expiry time", 400);
    }

    if (!fileId) {
      return errorResponse(res, "fileId is required", 400);
    }

    const file = await fileModel.findOne({ fileId });
    if (!file) {
      return errorResponse(res, "File not found", 404);
    }

    const url = await minioClient.presignedGetObject(
      process.env.MINIO_BUCKET,
      file.storageRef,
      expiry
    );

    await ShareLinkModel.create({
      link: url,
      ownerId: req.user._id,
      maxDownloads: 4,
      fileId: file._id,
      expiresAt: new Date(Date.now() + expiry * 1000),
    });

    return successResponse(res, "Sharing link generated", {
      downloadUrl: url,
      expires: expiry,
      filename: file.originalName,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error generating sharing link");
  }
};

// ================= DOWNLOAD FILE =================
export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await fileModel.findOne({ fileId });

    if (!file) {
      return errorResponse(res, "File not found", 404);
    }

    const stream = await minioClient.getObject(
      process.env.MINIO_BUCKET,
      file.objectName
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );

    stream.pipe(res);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error downloading file");
  }
};

// ================= GET MY FILES =================
export const getMyFiles = async (req, res) => {
  try {
    const files = await fileModel.find({ ownerId: req.user._id });

    return successResponse(res, "Files fetched successfully", { files });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error getting files");
  }
};

// ================= GET FILE BY ID =================
export const getFileById = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await fileModel.findOne({fileId});

    if (!file) {
      return errorResponse(res, "File not found", 404);
    }

    if (!file.ownerId.equals(req.user._id)) {
      return errorResponse(res, "Access denied", 403);
    }

    return successResponse(res, "File fetched successfully", { file });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error getting file");
  }
};

// ================= DELETE FILE =================
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await fileModel.findOne({ fileId });

    if (!file) {
      return errorResponse(res, "File not found", 404);
    }

    if (!file.ownerId.equals(req.user._id)) {
      return errorResponse(res, "Access denied", 403);
    }

    await minioClient.removeObject(
      process.env.MINIO_BUCKET,
      file.objectName
    );

    await fileModel.deleteOne({ fileId });

    return successResponse(res, "File deleted successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error deleting file");
  }
};

export const updateFileVisibility = async (req, res) => {
  try {
    
  }
  catch (err){

  }
}

export const maxDownloads=async(req,res)=>{
  try{

  }
  catch(err){

  }
}