import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import chatRoutes from "./routes/chatRoute.js";

import { connectDB } from "./config/db.js";

const { parse } = await import('path-to-regexp');

function debugPath(pathStr, label) {
  try {
    parse(pathStr);
    console.log(`✅ OK route: ${label} → ${pathStr}`);
  } catch (err) {
    console.error(`❌ ERROR in route ${label}: ${pathStr}`, err.message);
  }
}


const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

debugPath("/api/auth", "authRoutes");
app.use("/api/auth", authRoutes);

debugPath("/api/user", "userRoutes");
app.use("/api/user", userRoutes);

debugPath("/api/chat", "chatRoutes");
app.use("/api/chat", chatRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

 app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});