import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { shippingAddress, paymentMethod, paymentResult } = req.body;

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      const quantity = cartItem.quantity;

      if (!product) {
        return res.status(404).json({
          message: `Producto con ID ${cartItem.product} no encontrado.`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}. Solo hay ${product.stock} disponibles.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: quantity,
        priceAtPurchase: product.price,
        image: product.image,
      });
      totalAmount += product.price * quantity;
    }

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalAmount: totalAmount,
      status: "completed",
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      paymentResult: paymentResult,
    });

    const createdOrder = await newOrder.save();

    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(orderItem.product, {
        $inc: { stock: -orderItem.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    res
      .status(201)
      .json({ message: "Orden creada exitosamente.", order: createdOrder });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({
      message: "Error interno del servidor al procesar la compra.",
      detailedError: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener órdenes.",
      detailedError: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user.id;

    if (req.user.id !== targetUserId && !req.user.isAdmin) {
      return res.status(403).json({
        message: "Acceso denegado. No autorizado para ver estas órdenes.",
      });
    }

    const orders = await Order.find({ user: targetUserId }).populate(
      "items.product",
      "name image"
    );
    console.log(orders);

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener órdenes del usuario:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener las órdenes del usuario.",
      detailedError: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name image price");

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        message: "Acceso denegado. No autorizado para ver esta orden.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al obtener orden por ID:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener la orden por ID.",
      detailedError: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      !status ||
      !["pending", "processing", "shipped", "completed", "cancelled"].includes(
        status
      )
    ) {
      return res.status(400).json({ message: "Estado de orden inválido." });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: "Estado de la orden actualizado exitosamente.", order });
  } catch (error) {
    console.error("Error al actualizar estado de la orden:", error);
    res.status(500).json({
      message:
        "Error interno del servidor al actualizar el estado de la orden.",
      detailedError: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    res.status(200).json({ message: "Orden eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    res.status(500).json({
      message: "Error interno del servidor al eliminar la orden.",
      detailedError: error.message,
    });
  }
};
