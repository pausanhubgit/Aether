import api from "./api";

async function getCart() {
  return await api.get("/api/users/cart");
}

async function addToCart(artId) {
  return await api.post("/api/users/cart", { artId });
}

async function removeFromCart(artId) {
  return await api.delete(`/api/users/cart/${artId}`);
}

export default {
  getCart,
  addToCart,
  removeFromCart,
};
