import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  adjustStock,
  buyProduct,
  searchProducts, // Importa la nueva función de búsqueda
} from "../controllers/productController.js";

import { verifyToken, isAdmin } from "../middleware/auth.js"; // Asegúrate de que esta ruta es correcta

const productRouter = Router();

// Rutas públicas

// **Ruta para buscar productos **
productRouter.get("/search", searchProducts);

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.patch("/adjust-stock/:productId", adjustStock);
productRouter.post("/buy/:productId", verifyToken, buyProduct);

// Rutas protegidas para admins
productRouter.post("/", verifyToken, isAdmin, createProduct);
productRouter.put("/:id", verifyToken, isAdmin, updateProduct);
productRouter.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default productRouter;
