import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "No autorizado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjunta la información del usuario decodificada
    next();
  } catch (error) {
    console.error("Error de verificación de token:", error);
    return res.status(403).json({ message: "Token inválido o expirado." }); // Asegúrate de retornar para evitar que el código siga ejecutándose
  }
};

export default auth;
