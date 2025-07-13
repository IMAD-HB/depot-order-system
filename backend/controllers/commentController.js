import Comment from "../models/Comment.js";

// Récupérer tous les commentaires (optionnellement par produit ou commande)
export const getAllComments = async (req, res) => {
  const { produit, order } = req.query;
  const filter = {};
  if (produit) filter.produit = produit;
  if (order)   filter.order   = order;

  // ⬇︎ on demande le champ "name" du user, pas "nom"
  const comments = await Comment.find(filter)
    .populate("utilisateur", "name _id")
    .sort({ createdAt: -1 });

  res.json(comments);
};

// Créer un commentaire
export const createComment = async (req, res) => {
  const { contenu, produit, order } = req.body;

  const comment = await Comment.create({
    contenu,
    produit:  produit || null,
    order:    order   || null,
    utilisateur: req.user._id,
  });

  // Pour que la réponse contienne déjà le nom de l'utilisateur :
  await comment.populate("utilisateur", "name _id");
  res.status(201).json(comment);
};

// Supprimer un commentaire
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Commentaire introuvable" });

  if (!comment.utilisateur.equals(req.user._id)) {
    return res.status(403).json({ message: "Non autorisé à supprimer ce commentaire" });
  }

  await comment.deleteOne();
  res.json({ message: "Commentaire supprimé" });
};