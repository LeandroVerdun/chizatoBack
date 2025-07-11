import { Router } from "express";
import {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  forgotPassword,
} from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", verifyToken, getAllUsers);
userRouter.put("/:id", verifyToken, updateUser);
userRouter.delete("/:id", verifyToken, deleteUser);
userRouter.post("/forgot-password", forgotPassword);
export default userRouter;
