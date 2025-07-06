import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "El body es obligatorio" });
    }

    const { name, email, password, isAdmin } = req.body;
    const hashedPass = await bcryptjs.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPass, isAdmin });
    await newUser.save();
    res.status(201).json({ message: "Usuario creado" });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Acceso denegado. No eres administrador." });
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
    const { id } = req.params;

    // Si el usuario no es admin, solo puede modificar su propio perfil
    if (!req.user.isAdmin && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "No autorizado para modificar este usuario." });
    }

    const { name, email, password, isAdmin } = req.body;

    let updateData = { name, email };

    // Solo los admins pueden modificar el campo isAdmin
    if (req.user.isAdmin && typeof isAdmin !== "undefined") {
      updateData.isAdmin = isAdmin;
    }

    if (password) {
      updateData.password = await bcryptjs.hash(password, 10);
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
      return res.status(403).json({ message: "Acceso denegado. No eres administrador." });
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
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El email es obligatorio." });
  }

  try {
    // Buscar usuario por email (en minúsculas para evitar problemas)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "Correo no encontrado." });
    }



    return res.status(200).json({ message: "Instrucciones enviadas a tu correo." });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};






