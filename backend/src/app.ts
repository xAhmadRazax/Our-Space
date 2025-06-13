import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import crypto from "crypto";
import { router as authRoutes } from "./routes/auth.router.js";

// generating hash for bcrypt
// console.log(crypto.randomBytes(64).toString("hex"));

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);

export { app };
