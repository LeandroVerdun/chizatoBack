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
orderRouter.post("/", verifyToken, createOrder);
orderRouter.get("/myorders", verifyToken, getUserOrders);
orderRouter.get("/:id", verifyToken, getOrderById);

// Rutas protegidas para administradores
orderRouter.get("/", verifyToken, isAdmin, getOrders);
orderRouter.get("/user/:userId", verifyToken, isAdmin, getUserOrders);
orderRouter.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);
orderRouter.delete("/:id", verifyToken, isAdmin, deleteOrder);

export default orderRouter;
