// chizatoBack/src/models/Cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Referencia al modelo de Producto
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Asegura que la cantidad sea al menos 1
  },
  // NUEVOS CAMPOS:
  priceAtAddToCart: {
    // El precio del producto en el momento de añadirlo al carrito (ya con descuento si aplica)
    type: Number,
    required: true,
    min: 0,
  },
  isOfferApplied: {
    // Bandera para saber si se aplicó una oferta
    type: Boolean,
    default: false,
  },
  discountPercentage: {
    // El porcentaje de descuento aplicado (0.15 para 15%)
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia al modelo de Usuario
      required: true,
      unique: true, // Un usuario solo puede tener un carrito activo
    },
    items: [cartItemSchema], // Un array de items en el carrito
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
