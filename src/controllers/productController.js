import Product from "../models/Product.js";
//Solo esta creada chicos, las funciones
// estan vacias para luego llenarlas
// Funciones para el CRUD de productos
export const createProduct = (req, res) => {
  // Lógica para crear un producto
  res.status(501).json({ message: "createProduct no implementado" }); // 501 Not Implemented
};

export const getProducts = (req, res) => {
  // Lógica para obtener todos los productos
  res.status(501).json({ message: "getProducts no implementado" });
};

export const getProductById = (req, res) => {
  // Lógica para obtener un producto por su ID
  res.status(501).json({ message: "getProductById no implementado" });
};

export const updateProduct = (req, res) => {
  // Lógica para actualizar un producto
  res.status(501).json({ message: "updateProduct no implementado" });
};

export const deleteProduct = (req, res) => {
  // Lógica para eliminar un producto
  res.status(501).json({ message: "deleteProduct no implementado" });
};
