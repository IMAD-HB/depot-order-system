import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/auth";

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);