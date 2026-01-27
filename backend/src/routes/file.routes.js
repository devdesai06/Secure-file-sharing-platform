import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { fileLinkGeneration, downloadFile, fileUpload,getMyFiles,getFileById,deleteFile} from "../controllers/file.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'
const router = express.Router();

router.post("/file-upload",authMiddleware, upload.single("file"), fileUpload);
router.get("/:fileId/file",authMiddleware, fileLinkGeneration)
router.get("/download/:fileId", downloadFile)
router.get("/getmyfiles",authMiddleware,getMyFiles)
router.get("/getfile/:fileid",authMiddleware,getFileById);
router.delete("/deletefile/:fileId",authMiddleware,deleteFile);
export default router;
