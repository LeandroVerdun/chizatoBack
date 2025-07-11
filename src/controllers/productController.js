// chizatoBack/src/controllers/productController.js
import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    // 1. Obtener los datos del cuerpo de la solicitud
    const {
      name,
      stock,
      description,
      lastStockControlDate,
      category,
      image,
      author,
      rating,
      price,
    } = req.body;

    // 2. Validar que los campos obligatorios no estén vacíos
    if (
      !name ||
      !stock ||
      !description ||
      !price ||
      !category ||
      !author ||
      !image
    ) {
      return res.status(400).json({
        message:
          "Todos los campos obligatorios (nombre, stock, descripción, precio, categoría, autor, imagen) son necesarios.",
      });
    }

    // 3. Crear una nueva instancia del modelo Product
    const newProduct = new Product({
      name,
      stock,
      description,
      lastStockControlDate,
      category,
      image,
      author,
      rating,
      price,
    });

    // 4. Guardar el producto en la base de datos
    const savedProduct = await newProduct.save();

    // 5. Enviar una respuesta exitosa
    res.status(201).json({
      message: "Producto creado con éxito",
      product: savedProduct,
    });
  } catch (error) {
    // 6. Si ocurre un error, enviamos una respuesta de error
    res
      .status(500)
      .json({ message: "Error al crear el producto.", error: error.message });
  }
};

//7. Funcion para obtener los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener productos", error: error.message });
  }
};

//8. Funcion para obtener el producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener producto", error: error.message });
  }
};

//9. Funcion para actualizar los productos
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json({ message: "Producto actualizado", product: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar producto", error: error.message });
  }
};

//10. Funcion para cambiar el stock del producto
export const adjustStock = async (req, res) => {
  const { productId } = req.params;
  const { amount } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    product.stock += amount;
    await product.save();

    res
      .status(200)
      .json({ message: "Stock actualizado correctamente", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al ajustar stock", error: error.message });
  }
};

//11. Funcion para borrar producto
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar producto", error: error.message });
  }
};

//12. Funcion para realizar compra
export const buyProduct = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Cantidad inválida." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado." });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stock insuficiente." });
    }

    product.stock -= quantity;
    product.lastStockControlDate = new Date();

    await product.save();

    res.status(200).json({
      message: `Compra realizada. Stock restante: ${product.stock}`,
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al procesar la compra.", error: error.message });
  }
};
//searchProducts (para el backend)**
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: "Se requiere un término de búsqueda (q)." });
    }

    // Crear una expresión regular insensible a mayúsculas/minúsculas
    const searchRegex = new RegExp(q, "i");

    // Buscar productos que coincidan en nombre, autor, descripción o categoría
    const products = await Product.find({
      $or: [
        { name: { $regex: searchRegex } },
        { author: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({
      message: "Error interno del servidor al buscar productos.",
      error: error.message,
    });
  }
};
