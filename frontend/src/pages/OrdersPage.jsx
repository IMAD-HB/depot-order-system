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
  const [filter, setFilter] = useState(() => localStorage.getItem("order_filter") || "");
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem("order_status_filter") || "all");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error("Erreur de chargement des commandes :", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?");
    if (!confirm) return;
    try {
      await deleteOrder(id);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateOrder(updatedData._id, updatedData);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
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
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
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

  useEffect(() => {
    localStorage.setItem("order_filter", filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem("order_status_filter", statusFilter);
  }, [statusFilter]);

  const filteredOrders = orders.filter((order) => {
    const term = filter.toLowerCase();
    const nameMatch = order.customerName.toLowerCase().includes(term);
    const locationMatch = (order.location || "").toLowerCase().includes(term);
    const productMatch = order.items.some((item) =>
      (item.productName || "").toLowerCase().includes(term)
    );
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    return (nameMatch || locationMatch || productMatch) && statusMatch;
  });

  const groupedOrders = { today: [], yesterday: [], older: {} };
  filteredOrders.forEach((order) => {
    const createdAt = dayjs(order.createdAt);
    const now = dayjs();
    if (createdAt.isSame(now, "day")) {
      groupedOrders.today.push(order);
    } else if (createdAt.isSame(now.subtract(1, "day"), "day")) {
      groupedOrders.yesterday.push(order);
    } else {
      const dateLabel = createdAt.format("DD/MM/YYYY");
      if (!groupedOrders.older[dateLabel]) {
        groupedOrders.older[dateLabel] = [];
      }
      groupedOrders.older[dateLabel].push(order);
    }
  });

  const renderGroup = (title, group) =>
    group.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-white/90">{title}</h2>
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

  const renderOlderGroups = (olderGroups) =>
    Object.entries(olderGroups)
      .sort(([a], [b]) => dayjs(b, "DD/MM/YYYY").valueOf() - dayjs(a, "DD/MM/YYYY").valueOf())
      .map(([date, group]) => renderGroup(`🗓️ ${date}`, group));

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1f1c2c] to-[#928DAB] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 text-white">
        <h1 className="text-3xl font-extrabold mb-6 text-center tracking-wide">
          📦 Commandes
        </h1>

        {/* Filters */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Rechercher client, produit ou lieu..."
            className="w-full bg-white/10 text-white placeholder-white/70 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <select
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">📃 Toutes les commandes</option>
            <option value="non livré">🚚 Non livrées</option>
            <option value="livré">✅ Livrées</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-white/70 italic">Chargement des commandes...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-white/70 italic">Aucune commande trouvée.</p>
        ) : (
          <>
            {renderGroup("📅 Aujourd'hui", groupedOrders.today)}
            {renderGroup("📆 Hier", groupedOrders.yesterday)}
            {renderOlderGroups(groupedOrders.older)}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
