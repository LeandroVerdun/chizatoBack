import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No autorizado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    req.user = user; // ahora incluye name, email, isAdmin, _id, etc.
    next();
  } catch (error) {
    console.error("Error de verificación de token:", error);
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Acceso denegado. Solo admin." });
  }
  next();
};
