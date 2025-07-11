import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/orders",
  withCredentials: true,
});

export const fetchOrders = () => API.get("/");

export const createOrder = (orderData) => API.post("/", orderData);

export const updateOrder = (id, updatedData) => API.put(`/${id}`, updatedData);

export const deleteOrder = (id) => API.delete(`/${id}`);
