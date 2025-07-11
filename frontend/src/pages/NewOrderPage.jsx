import { useState } from 'react';
import { createOrder } from '../services/orderService';

const NewOrderPage = () => {
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [items, setItems] = useState([{ productName: '', quantity: 1 }]);
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const order = { customerName, location, items, notes };
      await createOrder(order);
      setCustomerName('');
      setLocation('');
      setItems([{ productName: '', quantity: 1 }]);
      setNotes('');
      setSuccessMsg('✅ Commande envoyée avec succès !');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Erreur lors de la création de la commande.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">📝 Nouvelle commande</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nom du client</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Localisation</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Produits</label>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Produit"
                className="flex-1 border p-2 rounded"
                value={item.productName}
                onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                required
              />
              <input
                type="number"
                min={1}
                className="w-20 border p-2 rounded"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                required
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 text-sm"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-500 text-sm underline mt-1"
          >
            + Ajouter un produit
          </button>
        </div>

        <div>
          <label className="block font-medium mb-1">Remarques (optionnel)</label>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Envoyer la commande
        </button>

        {successMsg && (
          <p className="text-green-600 mt-3">{successMsg}</p>
        )}
      </form>
    </div>
  );
};

export default NewOrderPage;
