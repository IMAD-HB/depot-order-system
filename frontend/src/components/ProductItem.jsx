import { useState } from "react";

const ProductItem = ({ product, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(product);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-5 text-white">
      {editing ? (
        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-white/60 focus:outline-none"
            placeholder="Nom du produit"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-white/60 focus:outline-none"
            placeholder="Prix"
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-white/60 focus:outline-none"
            placeholder="Stock"
          />

          <div className="flex gap-4 mt-2 text-sm">
            <button
              onClick={handleSave}
              className="text-green-300 hover:underline font-medium"
            >
              💾 Enregistrer
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-white/70 hover:underline font-medium"
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-semibold">{product.name}</div>
            <div className="text-sm text-white/70 mt-1">
              💶 <span className="text-green-200">{product.price}</span>{" "}
              | 📦 <span className="text-yellow-200">{product.stock}</span>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <button
              onClick={() => setEditing(true)}
              className="text-blue-300 hover:underline font-medium"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="text-red-300 hover:underline font-medium"
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
