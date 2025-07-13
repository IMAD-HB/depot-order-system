import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const OrderItem = ({ order, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order);

  const handleChange = (index, field, value) => {
    const updatedItems = [...editedOrder.items];
    updatedItems[index][field] = value;
    setEditedOrder({ ...editedOrder, items: updatedItems });
  };

  const handleFieldChange = (field, value) => {
    setEditedOrder({ ...editedOrder, [field]: value });
  };

  const saveChanges = () => {
    onUpdate(editedOrder);
    setEditing(false);
  };

  const statusColor = {
    livré: "bg-green-600/20 text-green-300 border-green-400/40",
    "non livré": "bg-yellow-600/20 text-yellow-300 border-yellow-400/40",
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md p-5 text-white space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-tight">👤 {order.customerName}</h2>
        <span className="text-xs text-white/60">
          🕒 {dayjs(order.createdAt).fromNow()}
        </span>
      </div>

      {/* Editing Mode */}
      {editing ? (
        <>
          <input
            type="text"
            placeholder="📍 Localisation"
            value={editedOrder.location || ""}
            onChange={(e) => handleFieldChange("location", e.target.value)}
            className="w-full p-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none"
          />

          <ul className="space-y-2 mt-2">
            {editedOrder.items.map((item, index) => (
              <li key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Produit"
                  className="flex-1 p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none"
                  value={item.productName}
                  onChange={(e) =>
                    handleChange(index, "productName", e.target.value)
                  }
                />
                <input
                  type="number"
                  min="1"
                  className="w-20 p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none"
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", parseInt(e.target.value) || 1)
                  }
                />
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <label className="text-sm mr-2 text-white/80">📦 Statut :</label>
            <select
              value={editedOrder.status || "non livré"}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              className="p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none"
            >
              <option value="non livré">Non livré</option>
              <option value="livré">Livré</option>
            </select>
          </div>
        </>
      ) : (
        <>
          {/* Static Mode */}
          {order.location && (
            <p className="text-sm text-white/70">📍 {order.location}</p>
          )}

          <ul className="list-disc ml-5 text-sm text-white/90 space-y-1">
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.productName} — {item.quantity}
              </li>
            ))}
          </ul>

          <div className="mt-2">
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full border font-medium mt-2 ${statusColor[order.status || "non livré"]}`}
            >
              📦 {order.status || "non livré"}
            </span>
          </div>
        </>
      )}

      {/* Notes */}
      {order.notes && !editing && (
        <p className="italic text-sm text-white/60">📝 {order.notes}</p>
      )}

      {/* Actions */}
      <div className="flex gap-4 mt-4">
        {editing ? (
          <>
            <button
              onClick={saveChanges}
              className="px-4 py-1 rounded-md bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm font-medium transition"
            >
              💾 Enregistrer
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white/80 text-sm font-medium transition"
            >
              ❌ Annuler
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm font-medium transition"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => onDelete(order._id)}
              className="px-4 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium transition"
            >
              🗑️ Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
