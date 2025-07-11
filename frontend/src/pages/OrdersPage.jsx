import { useEffect, useRef, useState } from "react";
import {
  fetchOrders,
  deleteOrder,
  updateOrder,
} from "../services/orderService";
import OrderItem from "../components/OrderItem";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const socketRef = useRef(null);

  const loadOrders = async () => {
    try {
      const res = await fetchOrders();
      setOrders(res.data);
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette commande ?"
    );
    if (!confirm) return;

    try {
      await deleteOrder(id);
    } catch (_) {}
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateOrder(updatedData._id, updatedData);
    } catch (_) {}
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("order_created", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    socket.on("order_updated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    socket.on("order_deleted", (deletedId) => {
      setOrders((prev) => prev.filter((order) => order._id !== deletedId));
    });

    loadOrders();

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const term = filter.toLowerCase();
    const nameMatch = order.customerName.toLowerCase().includes(term);
    const locationMatch = (order.location || "").toLowerCase().includes(term);
    const productMatch = order.items.some((item) =>
      item.productName.toLowerCase().includes(term)
    );
    return nameMatch || locationMatch || productMatch;
  });

  const groupedOrders = {
    today: [],
    yesterday: [],
    older: [],
  };

  filteredOrders.forEach((order) => {
    const createdAt = dayjs(order.createdAt);
    const now = dayjs();

    if (createdAt.isSame(now, "day")) {
      groupedOrders.today.push(order);
    } else if (createdAt.isSame(now.subtract(1, "day"), "day")) {
      groupedOrders.yesterday.push(order);
    } else {
      groupedOrders.older.push(order);
    }
  });

  const renderGroup = (title, group) =>
    group.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {group.map((order) => (
          <OrderItem
            key={order._id}
            order={order}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📦 Commandes</h1>

      <input
        type="text"
        placeholder="🔍 Rechercher par client, produit ou lieu..."
        className="w-full border p-2 rounded mb-6"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filteredOrders.length === 0 ? (
        <p className="text-gray-600">Aucune commande trouvée.</p>
      ) : (
        <>
          {renderGroup("📅 Aujourd'hui", groupedOrders.today)}
          {renderGroup("📆 Hier", groupedOrders.yesterday)}
          {renderGroup("🗂️ Plus anciennes", groupedOrders.older)}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
