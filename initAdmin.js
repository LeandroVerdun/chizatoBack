import mongoose from "mongoose"; // Cambiado de const mongoose = require('mongoose');
import User from "./src/models/User.js"; // Cambiado de const User = require('./models/User'); y ajustada la extensión
import bcrypt from "bcryptjs"; // Cambiado de const bcrypt = require('bcryptjs');
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const exists = await User.findOne({ email: "chizato@gmail.com" });
    if (!exists) {
      const admin = new User({
        name: "Chizato",
        email: "chizato@gmail.com",
        password: await bcrypt.hash("1234", 10),
        isAdmin: true,
      });
      await admin.save();
      console.log("Admin creado");
    } else {
      console.log("admin ya existe");
    }
    process.exit();
  })
  .catch((err) =>
    console.error("Error al conectar a MongoDB para initAdmin:", err)
  );
