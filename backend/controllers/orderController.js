import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Comment from "../models/Comment.js";

// @desc Créer une nouvelle commande
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user?._id || null; // If user system is in place

    // Step 1: Validate stock for all items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Produit non trouvé: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuffisant pour le produit: ${product.name}`,
        });
      }
    }

    // Step 2: Deduct stock
    for (const item of items) {
      // Fetch before update to compare later
      const productBefore = await Product.findById(item.productId);
      const previousStock = productBefore.stock;

      // Deduct stock
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });

      // Re-fetch updated product
      const updatedProduct = await Product.findById(item.productId);

      // Step 3: If stock now 0 and wasn't before, create comment
      if (previousStock > 0 && updatedProduct.stock === 0) {
        await Comment.create({
          contenu: `⚠️ Le produit "${updatedProduct.name}" est en rupture de stock.`,
          produit: updatedProduct._id,
          utilisateur: userId,
        });
      }
    }

    // Step 4: Create and save the order
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    req.app.get("io").emit("order_created", savedOrder);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Erreur création commande:", err);
    res.status(400).json({
      message: "Échec de la création de la commande : " + err.message,
    });
  }
};

// @desc Récupérer toutes les commandes
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes : " + err.message,
    });
  }
};

// @desc Mettre à jour une commande
export const updateOrder = async (req, res) => {
  console.log("ID de mise à jour :", req.params.id);
  console.log("Corps de la mise à jour :", req.body);
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Commande introuvable." });
    }
    req.app.get("io").emit("order_updated", updated);
    res.json(updated);
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    res
      .status(400)
      .json({ message: "Échec de la mise à jour : " + err.message });
  }
};

// @desc Supprimer une commande
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    req.app.get("io").emit("order_deleted", req.params.id);
    res.json({ message: "Commande supprimée avec succès." });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la commande : " + err.message,
    });
  }
};
