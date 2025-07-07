import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    console.log("ENTRO AL CONTROLADOR REGISTER");
    if (!req.body) {
      res.status(400).json({ message: "el body es obligatorio" });
    }

    const { name, email, password, isAdmin } = req.body;
    const hashedPass = await bcryptjs.hash(password, 10);
    const newUUser = new User({ name, email, password: hashedPass, isAdmin });
    await newUUser.save();
    res.status(201).json({ message: "Usuario creado" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcryptjs.compare(password, user.password)))
    return res.status(401).json({ message: "Credenciales invalidas" });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );
  res.json({ token });
};

export const getAllUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Acceso denegado. No eres administrador." });
    }
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Acceso denegado. No eres administrador." });
    }
    const { id } = req.params;
    const { name, email, password, isAdmin } = req.body;

    let updateData = { name, email, isAdmin };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario actualizado", user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Acceso denegado. No eres administrador." });
    }
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Si el usuario no es encontrado, devuelve 404 como antes.
      return res
        .status(404)
        .json({ message: "El correo o usuario no fue encontrado." });
    }

    console.log(
      `Solicitud de recuperación para ${user.email} recibida. Se notificará al administrador.`
    );
    res.status(200).json({
      message: "Solicitud enviada. El administrador se comunicará contigo.",
    });
  } catch (error) {
    console.error("Error en forgotPassword (simulado):", error);
    res
      .status(500)
      .json({ message: "Error al procesar la solicitud de contraseña." });
  }
};
