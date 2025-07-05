// chizatoBack/src/controllers/orderController.js
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js"; // Necesario para reducir stock

// @desc    Crear una nueva orden (Checkout)
// @route   POST /api/orders
// @access  Private (Usuario autenticado)
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    // Opcional: Si tienes información de envío/pago desde el frontend
    const { shippingAddress, paymentMethod, paymentResult } = req.body;

    // 1. Obtener el carrito del usuario
    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    // 2. Verificar stock para cada producto antes de crear la orden (CRÍTICO)
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product; // El producto ya está populado
      const quantity = cartItem.quantity;

      if (!product) {
        // Esto no debería pasar si el populate funciona, pero es una buena salvaguarda
        return res.status(404).json({
          message: `Producto con ID ${cartItem.product} no encontrado.`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}. Solo hay ${product.stock} disponibles.`,
        });
      }

      // Guardar los detalles del producto en la orden, incluyendo el precio al momento de la compra
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: quantity,
        priceAtPurchase: product.price, // Usar el precio actual del producto
        image: product.image,
      });
      totalAmount += product.price * quantity;
    }

    // 3. Crear la nueva orden
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalAmount: totalAmount,
      status: "completed",
      shippingAddress: shippingAddress, // Si se proporciona
      paymentMethod: paymentMethod, // Si se proporciona
      paymentResult: paymentResult, // Si se proporciona
    });

    const createdOrder = await newOrder.save();

    // 4. Reducir el stock de cada producto
    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(
        orderItem.product,
        { $inc: { stock: -orderItem.quantity } } // Decrementar el stock
      );
    }

    // 5. Vaciar el carrito del usuario después de la compra exitosa
    cart.items = [];
    await cart.save();

    res
      .status(201)
      .json({ message: "Orden creada exitosamente.", order: createdOrder });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({
      message: "Error interno del servidor al procesar la compra.",
      detailedError: error.message, // Para depuración
    });
  }
};

// @desc    Obtener todas las órdenes (solo para administradores)
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // Popula el usuario que hizo la orden (solo nombre y email)
      .populate("items.product", "name"); // Popula el nombre del producto en cada item

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener órdenes.",
      detailedError: error.message,
    });
  }
};

// @desc    Obtener órdenes de un usuario específico (para el propio usuario o admin)
// @route   GET /api/orders/myorders o /api/orders/user/:userId
// @access  Private (Usuario autenticado o Admin)
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

// @desc    Obtener una orden por ID (para ver detalles de una orden específica)
// @route   GET /api/orders/:id
// @access  Private (Usuario autenticado o Admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email") // Popula el usuario
      .populate("items.product", "name image price"); // Popula los productos completos

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    // Asegurarse de que el usuario solo pueda ver sus propias órdenes, a menos que sea admin
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

// @desc    Actualizar el estado de una orden (solo para administradores)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // Nuevo estado (ej: 'shipped', 'completed')

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

// @desc    Eliminar una orden (solo para administradores)
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
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

// Funciones para reportes/estadísticas (a desarrollar en el frontend o como endpoints específicos si la lógica es compleja)
/*
export const getTopCustomers = async (req, res) => {
    try {
        // Agregación de MongoDB para encontrar usuarios que compraron más
        const topCustomers = await Order.aggregate([
            { $group: { _id: "$user", totalOrders: { $sum: 1 }, totalSpent: { $sum: "$totalAmount" } } },
            { $sort: { totalOrders: -1, totalSpent: -1 } },
            { $limit: 10 },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "userDetails" } },
            { $unwind: "$userDetails" },
            { $project: { _id: 0, user: "$userDetails.name", email: "$userDetails.email", totalOrders: 1, totalSpent: 1 } }
        ]);
        res.status(200).json(topCustomers);
    } catch (error) {
        console.error("Error al obtener los mejores clientes:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener los mejores clientes." });
    }
};

export const getMostPurchasedProducts = async (req, res) => {
    try {
        // Agregación de MongoDB para encontrar productos más comprados
        const mostPurchased = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.product", totalQuantitySold: { $sum: "$items.quantity" } } },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 10 },
            { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "productDetails" } },
            { $unwind: "$productDetails" },
            { $project: { _id: 0, product: "$productDetails.name", totalQuantitySold: 1 } }
        ]);
        res.status(200).json(mostPurchased);
    } catch (error) {
        console.error("Error al obtener los productos más comprados:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener los productos más comprados." });
    }
};
*/
