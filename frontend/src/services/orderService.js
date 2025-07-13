import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/orders`;

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const fetchOrders = async () => {
  try {
    const response = await API.get("/");
    return Array.isArray(response.data) ? response.data : []; // 🔥 fixed
  } catch (error) {
    console.error("Fetch error:", error);
    throw error.response?.data || error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token"); // Or from your auth context

    const response = await API.post("/", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrder = async (id, updatedData) => {
  try {
    const response = await API.put(`/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await API.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
