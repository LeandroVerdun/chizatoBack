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
    process.env.JWT_SECRET
  );
  res.json({ token });
};

// listar usuarios, editar y borrar
