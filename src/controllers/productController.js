import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, stock, description, category, image, author, rating, price } =
      req.body;

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

    const newProduct = new Product({
      name,
      stock,
      description,
      category,
      image,
      author,
      rating,
      price,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Producto creado con éxito",
      product: savedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el producto.", error: error.message });
  }
};

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

export const updateProduct = async (req, res) => {
  try {
    const { stock, ...otherUpdates } = req.body;

    const updateFields = { ...otherUpdates };

    if (stock !== undefined || Object.keys(otherUpdates).length > 0) {
      updateFields.lastStockControlDate = new Date();
    }
    if (stock !== undefined) {
      updateFields.stock = stock;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json({ message: "Producto actualizado", product: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar producto", error: error.message });
  }
};

export const adjustStock = async (req, res) => {
  const { productId } = req.params;
  const { amount } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    product.stock += amount;
    product.lastStockControlDate = new Date();
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

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: "Se requiere un término de búsqueda (q)." });
    }

    const searchRegex = new RegExp(q, "i");

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
