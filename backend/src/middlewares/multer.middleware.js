import multer, { memoryStorage } from "multer";
export const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:10*1024*1024,//10MB
        files:1 //max 1 file
    }
})
