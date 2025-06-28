import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import auth from "../middleware/auth.js"; // Importa tu middleware de autenticación

const productRouter = Router();

// Rutas de acceso público (cualquier usuario puede ver los productos)
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);

// Rutas protegidas para administradores (CRUD)
productRouter.post("/", auth, createProduct); // Nota: `auth` aún no verifica si es admin
productRouter.put("/:id", auth, updateProduct);
productRouter.delete("/:id", auth, deleteProduct);

export default productRouter;
