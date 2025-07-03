import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(req.headers);
  if (!token) {
    return res
      .status(401)
      .json({ message: "No autorizado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
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
