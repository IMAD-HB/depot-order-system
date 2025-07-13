import { useEffect, useState } from "react";
import { fetchOrders } from "../services/orderService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error("Échec du chargement des commandes :", err);
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  const totalOrders = orders.length;
  const totalDelivered = orders.filter((o) => o.status === "livré").length;
  const totalPending = orders.filter((o) => o.status === "non livré").length;
  const todayOrders = orders.filter((o) =>
    dayjs(o.createdAt).isSame(dayjs(), "day")
  ).length;

  const lastFiveOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1f1c2c] to-[#928DAB] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center tracking-wide">
          📊 Tableau de bord
        </h1>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total" value={totalOrders} emoji="📦" />
          <StatCard title="Livrées" value={totalDelivered} emoji="✅" />
          <StatCard title="Non Livrées" value={totalPending} emoji="🚚" />
          <StatCard title="Aujourd'hui" value={todayOrders} emoji="📅" />
        </section>

        {/* Last 5 Orders */}
        <section
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 text-white"
          aria-label="Dernières commandes"
        >
          <h2 className="text-xl font-bold mb-4 tracking-tight">
            🕓 5 dernières commandes
          </h2>
          <ul className="divide-y divide-white/10">
            {lastFiveOrders.length === 0 ? (
              <li className="py-4 text-white/60 italic">Aucune commande récente.</li>
            ) : (
              lastFiveOrders.map((order) => (
                <li
                  key={order._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <p className="font-medium text-white">
                      {order.customerName} — {order.location}
                    </p>
                    <p className="text-sm text-white/60">
                      {dayjs(order.createdAt).fromNow()}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-semibold ${
                      order.status === "livré"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

// Card component
const StatCard = ({ title, value, emoji }) => (
  <div
    className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl text-white hover:scale-105 hover:shadow-pink-500/30 transition-all duration-300 ease-in-out"
    aria-label={`${title}: ${value}`}
  >
    <div className="text-3xl font-bold mb-2 tracking-tight">
      {emoji} {value}
    </div>
    <div className="text-sm uppercase text-white/70 font-medium">{title}</div>
  </div>
);

export default DashboardPage;
