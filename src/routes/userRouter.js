import { Router } from "express";
import {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import User from "../models/User.js";
import { forgotPassword } from "../controllers/userController.js";

const userRouter = Router();

// Registro y login
userRouter.post("/register", register);
userRouter.post("/login", login);

// Admin: ver, editar y eliminar otros usuarios
userRouter.get("/", verifyToken, isAdmin, getAllUsers);
userRouter.delete("/:id", verifyToken, isAdmin, deleteUser);

// Editar el perfil
userRouter.put("/:id", verifyToken, updateUser);

//forgot-password
userRouter.post("/forgot-password", forgotPassword);



// Usuario autenticado: obtener sus propios datos (sin isAdmin)
userRouter.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
});

export default userRouter;
