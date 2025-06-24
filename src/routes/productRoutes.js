const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/productController");
const auth = require("../middleware/auth");

router.get("/", productCtrl.getProducts);
router.get("/:id", productCtrl.getProductById);
router.post("/", auth, productCtrl.createProduct);
router.put("/:id", auth, productCtrl.updateProduct);
router.delete("/:id", auth, productCtrl.deleteProduct);

module.exports = router;
