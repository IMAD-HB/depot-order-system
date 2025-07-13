import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/comments`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};

export const fetchComments = async (query = {}) => {
  try {
    const params = new URLSearchParams(query).toString();
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postComment = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
