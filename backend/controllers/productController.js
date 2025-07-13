import Product from "../models/Product.js";
import Comment from "../models/Comment.js";

// Get all products
export const getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

// Create a product
export const createProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  const product = await Product.create({ name, price, stock });
  res.status(201).json(product);
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Update request for product ID:", id);
    console.log("Updates:", updates);

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    const previousStock = product.stock;

    Object.assign(product, updates);
    const updatedProduct = await product.save();

    const newStock = updatedProduct.stock;

    if (previousStock > 0 && newStock === 0 && req.user?._id) {
      console.log("Creating out-of-stock comment");
      await Comment.create({
        contenu: `⚠️ Le produit "${product.name}" est en rupture de stock.`,
        produit: product._id,
        utilisateur: req.user._id,
      });
    }

    if (previousStock === 0 && newStock > 0 && req.user?._id) {
      console.log("Creating restock comment");
      await Comment.create({
        contenu: `✅ Le produit "${product.name}" a été réapprovisionné.`,
        produit: product._id,
        utilisateur: req.user._id,
      });
    }
    
    console.log("Utilisateur courant :", req.user);

    res.json(updatedProduct);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du produit:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
