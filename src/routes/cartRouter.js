// chizatoBack/src/routes/cartRouter.js
import { Router } from "express";
import {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js"; // Importa los controladores del carrito
import { verifyToken } from "../middleware/auth.js"; // Necesitamos el middleware de autenticación

const cartRouter = Router();

// Ruta para obtener el carrito del usuario autenticado
cartRouter.get("/", verifyToken, getCart);

// Ruta para añadir o actualizar un item en el carrito
// (Por ejemplo: POST /api/cart con { productId: 'abc', quantity: 1 } )
cartRouter.post("/", verifyToken, addOrUpdateCartItem);

// Ruta para eliminar un item específico del carrito
// (Por ejemplo: DELETE /api/cart/:productId )
cartRouter.delete("/:productId", verifyToken, removeCartItem);

// Ruta para vaciar completamente el carrito
cartRouter.delete("/", verifyToken, clearCart);

export default cartRouter;
