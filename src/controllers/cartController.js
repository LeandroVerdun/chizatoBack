// chizatoBack/src/controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js"; // Necesitamos el modelo de Producto para verificar stock

// Función para obtener el carrito del usuario actual
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario obtenido del token (req.user.id)
    let cart = await Cart.findOne({ user: userId }).populate("items.product"); // Popula los detalles del producto

    // Si no hay carrito, retorna un carrito vacío
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save(); // Guarda el carrito vacío para el usuario
      return res.status(200).json(cart);
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al obtener el carrito." });
  }
};

// Función para añadir o actualizar un producto en el carrito
export const addOrUpdateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Se requiere productId y quantity (mínimo 1)." });
    }

    // Verificar si el producto existe y si hay stock suficiente
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `No hay suficiente stock para ${product.name}. Stock disponible: ${product.stock}`,
      });
    }

    let cart = await Cart.findOne({ user: userId });

    // Si el usuario no tiene carrito, crea uno nuevo
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Si el item ya existe en el carrito, actualiza la cantidad
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Si el item no existe, añádelo al carrito
      cart.items.push({
        product: productId,
        quantity,
        priceAtAddToCart: product.price,
      });
    }

    await cart.save();
    // Popula los detalles del producto para la respuesta
    await cart.populate("items.product");
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al añadir/actualizar item en el carrito:", error);
    res.status(500).json({
      message:
        "Error interno del servidor al añadir/actualizar item en el carrito.",
    });
  }
};

// Función para eliminar un producto del carrito
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params; // Viene como parámetro de la URL

    if (!productId) {
      return res
        .status(400)
        .json({ message: "Se requiere el ID del producto para eliminar." });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Carrito no encontrado para este usuario." });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialItemCount) {
      // Si la longitud no cambió, significa que el producto no estaba en el carrito
      return res
        .status(404)
        .json({ message: "El producto no se encontró en el carrito." });
    }

    await cart.save();
    await cart.populate("items.product"); // Popula para la respuesta
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al eliminar item del carrito:", error);
    res.status(500).json({
      message: "Error interno del servidor al eliminar item del carrito.",
    });
  }
};

// Función para vaciar el carrito
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Carrito no encontrado para este usuario." });
    }

    cart.items = []; // Vacía el array de items
    await cart.save();
    res.status(200).json({ message: "Carrito vaciado exitosamente.", cart });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al vaciar el carrito." });
  }
};

// NOTA IMPORTANTE: La función de "checkout" o "finalizar compra" se haría aquí
// Implicaría:
// 1. Obtener el carrito del usuario.
// 2. Verificar el stock de cada producto en el carrito.
// 3. Crear un nuevo modelo de "Order" (Pedido) con los detalles de la compra.
// 4. Reducir el stock de los productos correspondientes.
// 5. Vaciar el carrito del usuario.
// Esto lo podemos hacer en un paso posterior una vez que el manejo básico del carrito funcione.
