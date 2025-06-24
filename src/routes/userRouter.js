import { Router } from "express";
/* const auth = require("../middleware/auth");
 */
import { register, login } from "../controllers/userController.js"; // <--- IMPORTANTE: Ajusta la ruta si es diferente

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

//agregar mas rutas

export default userRouter;
