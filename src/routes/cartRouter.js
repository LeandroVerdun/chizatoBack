import { Router } from "express";
import {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const cartRouter = Router();
cartRouter.get("/", verifyToken, getCart);
cartRouter.post("/", verifyToken, addOrUpdateCartItem);
cartRouter.delete("/:productId", verifyToken, removeCartItem);
cartRouter.delete("/", verifyToken, clearCart);

export default cartRouter;
