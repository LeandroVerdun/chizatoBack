// chizatoBack/src/routes/orderRouter.js
import { Router } from "express";
import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const orderRouter = Router();

// Rutas protegidas para usuarios y administradores
orderRouter.post("/", verifyToken, createOrder); // Crear una nueva orden (checkout)
orderRouter.get("/myorders", verifyToken, getUserOrders); // Obtener las órdenes del usuario logueado
orderRouter.get("/:id", verifyToken, getOrderById); // Obtener detalles de una orden específica

// Rutas protegidas para administradores
orderRouter.get("/", verifyToken, isAdmin, getOrders); // Obtener todas las órdenes (solo admin)
orderRouter.get("/user/:userId", verifyToken, isAdmin, getUserOrders); // Obtener órdenes de un usuario específico (admin)
orderRouter.put("/:id/status", verifyToken, isAdmin, updateOrderStatus); // Actualizar estado de una orden (admin)
orderRouter.delete("/:id", verifyToken, isAdmin, deleteOrder); // Eliminar una orden (admin)

export default orderRouter;
