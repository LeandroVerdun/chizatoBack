import { Router } from "express";
import {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js"; // <--- IMPORTANTE: Ajusta la ruta si es diferente
import auth from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", auth, getAllUsers);
userRouter.put("/:id", auth, updateUser); //agregar mas rutas
userRouter.delete("/:id", auth, deleteUser);
export default userRouter;
