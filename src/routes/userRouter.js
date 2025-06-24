import { Router } from "express";
import { register, login, getAllUsers } from "../controllers/userController.js"; // <--- IMPORTANTE: Ajusta la ruta si es diferente
import auth from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", auth, getAllUsers);
//agregar mas rutas

export default userRouter;
