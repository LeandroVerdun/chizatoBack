import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
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

export const addOrUpdateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Se requiere productId y quantity (mínimo 1)." });
    }

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

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtAddToCart: product.price,
      });
    }

    await cart.save();

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

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

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
      return res
        .status(404)
        .json({ message: "El producto no se encontró en el carrito." });
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al eliminar item del carrito:", error);
    res.status(500).json({
      message: "Error interno del servidor al eliminar item del carrito.",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Carrito no encontrado para este usuario." });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Carrito vaciado exitosamente.", cart });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al vaciar el carrito." });
  }
};
