import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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

  return (
    <div className="border p-4 rounded-lg shadow mb-4 bg-white">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold">
          👤 {order.customerName}
        </h2>
        <span className="text-xs text-gray-500">
          🕒 {dayjs(order.createdAt).fromNow()}
        </span>
      </div>

      {editing ? (
        <>
          <input
            type="text"
            placeholder="Localisation"
            value={editedOrder.location || ''}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            className="border p-1 rounded w-full mb-2"
          />

          <ul className="ml-5">
            {editedOrder.items.map((item, index) => (
              <li key={index} className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="border p-1 rounded flex-1"
                  value={item.productName}
                  onChange={(e) =>
                    handleChange(index, 'productName', e.target.value)
                  }
                />
                <input
                  type="number"
                  className="border p-1 w-20 rounded"
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(index, 'quantity', parseInt(e.target.value))
                  }
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          {order.location && (
            <p className="text-sm text-gray-600 mb-1">📍 {order.location}</p>
          )}
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.productName} - {item.quantity}
              </li>
            ))}
          </ul>
        </>
      )}

      {order.notes && !editing && (
        <p className="mt-2 italic text-sm text-gray-500">
          📝 Remarques: {order.notes}
        </p>
      )}

      <div className="flex gap-3 mt-3 text-sm">
        {editing ? (
          <>
            <button onClick={saveChanges} className="text-green-600 font-medium">💾 Enregistrer</button>
            <button onClick={() => setEditing(false)} className="text-gray-600 font-medium">❌ Annuler</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="text-blue-600 font-medium">✏️ Modifier</button>
            <button onClick={() => onDelete(order._id)} className="text-red-600 font-medium">🗑️ Supprimer</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
