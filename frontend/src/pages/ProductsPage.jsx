import { useEffect, useState } from "react";
import {
  fetchProducts,
  deleteProduct,
  updateProduct,
} from "../services/productService";
import ProductItem from "../components/ProductItem";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res);
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Supprimer ce produit ?");
    if (!confirm) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression du produit :", err);
    }
  };

  const handleUpdate = async (updated) => {
    try {
      await updateProduct(updated._id, updated);
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour du produit :", err);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">🛒 Produits</h1>

      <input
        type="text"
        placeholder="🔍 Rechercher un produit..."
        className="w-full p-3 mb-6 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/30"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="text-white/60 text-center py-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
          Aucun produit trouvé.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
