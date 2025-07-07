// chizatoBack/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./src/routes/userRouter.js";
import productRouter from "./src/routes/productRouter.js";
import cartRouter from "./src/routes/cartRouter.js";
import orderRouter from "./src/routes/orderRouter.js"; // ¡Importa el nuevo router de órdenes!

dotenv.config();

const app = express();
// Middlewares
app.use(
  cors({
    origin: "https://chisato-lib2.netlify.app", // Permite solicitudes solo desde tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"], // Encabezados permitidos
  })
);
app.use(express.json());

app.use(morgan("dev"));
//rutas
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter); // ¡Usa el nuevo router de órdenes!

// cone4xion a mongo y arranque del servidor

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Control de Stock funcionando!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(5000, () => console.log("Servidor corriendo en el puerto 5000"));
  })
  .catch((err) => console.error(err));
