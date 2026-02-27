import mongoose from "mongoose";
// import { upload } from "../middlewares/multer.middleware";

const FileModel = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  objectName: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },

  originalName: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  storageRef: {
    type: String,
    required: true,
  },
  maxDownloads: {
    type: Number,
    default:-1
  },
  downloadCount: {
    type: Number,
    default: 0,
  }
});

const ShareLink = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  maxDownloads: {
    type: Number,
    required: true,
  },
});
export const fileModel = mongoose.model("FileModel", FileModel);
export const ShareLinkModel = mongoose.model("linkModel", ShareLink);
