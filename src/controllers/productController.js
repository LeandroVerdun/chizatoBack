import Product from "../models/Product.js";

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Public (por ahora, luego lo protegeremos)
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
    } = req.body;

    // 2. Validar que los campos obligatorios no estén vacíos
    if (!name || !stock || !description) {
      return res.status(400).json({
        message: "El nombre, stock y descripción son campos obligatorios.",
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

export const getProducts = (req, res) => {
  res.status(501).json({
    message: "Función para obtener todos los productos no implementada.",
  });
};

export const getProductById = (req, res) => {
  res.status(501).json({
    message: "Función para obtener un producto por ID no implementada.",
  });
};

export const updateProduct = (req, res) => {
  res
    .status(501)
    .json({ message: "Función para actualizar un producto no implementada." });
};

export const deleteProduct = (req, res) => {
  res
    .status(501)
    .json({ message: "Función para eliminar un producto no implementada." });
};
