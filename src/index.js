import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));
//rutas
app.use("/api/users", userRouter);

// cone4xion a mongo

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(5000, () => console.log("Servidor corriendo en el puerto 5000"));
  })
  .catch((err) => console.error(err));
