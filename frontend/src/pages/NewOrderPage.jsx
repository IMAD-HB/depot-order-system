import { useState } from "react";
import { createOrder } from "../services/orderService";
import ProductInput from "../components/ProductInput";

const NewOrderPage = () => {
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [items, setItems] = useState([
    { product: { _id: "", name: "" }, quantity: 1 },
  ]);
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    if (field === "product") {
      updated[index].product = value;
    } else {
      updated[index][field] = value;
    }
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { product: { _id: "", name: "" }, quantity: 1 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const item of items) {
        if (!item.product || !item.product._id) {
          throw new Error("Produit non sélectionné ou invalide.");
        }
        if (item.quantity < 1 || isNaN(item.quantity)) {
          throw new Error("Quantité invalide pour un ou plusieurs produits.");
        }
      }

      const order = {
        customerName,
        location,
        notes,
        items: items.map((item) => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
        })),
      };

      await createOrder(order);

      // Reset form
      setCustomerName("");
      setLocation("");
      setItems([{ product: { _id: "", name: "" }, quantity: 1 }]);
      setNotes("");
      setSuccessMsg("✅ Commande envoyée avec succès !");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de la création de la commande."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1f1c2c] to-[#928DAB] p-6 sm:p-10 text-white">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 tracking-wide">
          📝 Nouvelle commande
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom du client */}
          <div>
            <label className="block mb-1 font-medium text-white/90">
              👤 Nom du client
            </label>
            <input
              type="text"
              placeholder="Ex: Jean Dupont"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          {/* Localisation */}
          <div>
            <label className="block mb-1 font-medium text-white/90">
              📍 Localisation
            </label>
            <input
              type="text"
              placeholder="Ex: Paris, Lyon..."
              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Produits */}
          <div>
            <label className="block mb-2 font-medium text-white/90">
              🛒 Produits
            </label>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 mb-2"
              >
                <ProductInput
                  value={item.product?.name || ""}
                  onChange={(product) =>
                    handleItemChange(index, "product", product)
                  }
                />
                <input
                  type="number"
                  min={1}
                  className="w-20 bg-white/10 border border-white/20 rounded-lg p-2 text-white focus:outline-none"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", parseInt(e.target.value))
                  }
                  required
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-400 hover:text-red-300 text-lg font-bold"
                    title="Supprimer ce produit"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="text-blue-300 hover:underline text-sm mt-2"
            >
              + Ajouter un produit
            </button>
          </div>

          {/* Remarques */}
          <div>
            <label className="block mb-1 font-medium text-white/90">
              📝 Remarques (optionnel)
            </label>
            <textarea
              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none"
              rows={3}
              placeholder="Ex: À livrer avant 18h"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 transition px-6 py-2 rounded-xl text-white font-semibold w-full"
          >
            ✅ Envoyer la commande
          </button>

          {/* Success Message */}
          {successMsg && (
            <p className="text-green-400 mt-3 font-medium text-center">{successMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewOrderPage;
