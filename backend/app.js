import dotnev from "dotenv";
dotnev.config();
import express from "express";
import connectDB from "./src/config/mongodb.config.js";
import fileRoutes from "./src/routes/file.routes.js";
import UserRoutes from "./src/routes/auth.routes.js"
const app = express();
const PORT = process.env.PORT;
connectDB()
app.use(express.json());

app.use("/share", fileRoutes);
app.use("/app", UserRoutes);
app.listen(PORT, () => {
  console.log(`Server succesfully started on port: ${PORT}`);
});
