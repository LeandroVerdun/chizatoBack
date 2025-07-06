// chizatoBack/src/models/Order.js
import mongoose from "mongoose";

// Esquema para los ítems dentro de una orden (similar a cartItemSchema, pero para la orden final)
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    // Guardar el nombre del producto al momento de la compra
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtPurchase: {
    // Precio del producto en el momento de la compra
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    // Guardar la imagen del producto
    type: String,
    required: true,
  },
  // Podrías añadir isOfferApplied, discountPercentage si quieres mantener ese detalle en la orden
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema], // Array de productos comprados
    totalAmount: {
      // Suma de todos los precios de los ítems * cantidad
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      // Estado de la orden (ej: 'pending', 'processing', 'shipped', 'completed', 'cancelled')
      type: String,
      enum: ["pending", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    // Información de envío (opcional, pero útil)
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    // Información de pago (opcional, si implementas pasarela de pago)
    paymentMethod: {
      type: String,
      // enum: ['credit_card', 'paypal', 'cash_on_delivery', etc.]
    },
    paymentResult: {
      // Detalles del resultado de la transacción del pago
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
  },
  {
    timestamps: true, // `createdAt` para la fecha de compra, `updatedAt` para actualizaciones de estado
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
