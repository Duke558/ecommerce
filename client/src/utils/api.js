// api.js
import axios from "axios";

export const getProducts = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/products");
    return res.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};
