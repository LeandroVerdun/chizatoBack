import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      // En este caso seria para el nombre del libro (ej. "Cien años de soledad")
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    description: {
      // Podría ser una sinopsis del libro
      type: String,
      required: true,
    },
    lastStockControlDate: {
      type: Date,
      default: Date.now,
    },
    image: {
      // Podría ser la URL de la portada del libro
      type: String,
      required: false,
    },
    category: {
      // El PDF menciona categorías, esto puede ser el género
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
