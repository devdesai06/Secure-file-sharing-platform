import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { fileUpload } from "../controllers/file.controller.js";
import {fileLinkGeneration} from "../controllers/file.controller.js"

const router = express.Router();

router.post("/file-upload", upload.single("file"), fileUpload);
router.get("/:fileId/file",fileLinkGeneration)

export default router;
