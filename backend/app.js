import dotenv from "dotenv";
dotenv.config();
import cors from "cors"
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/mongodb.config.js";
import fileRoutes from "./src/routes/file.routes.js";
import UserRoutes from "./src/routes/auth.routes.js"
const app = express();
const PORT = process.env.PORT || 5000;
connectDB()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/share", fileRoutes);
app.use("/app", UserRoutes);
app.listen(PORT, () => {
  console.log(`Server succesfully started on port: ${PORT}`);
});