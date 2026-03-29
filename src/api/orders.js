import api from "./api";

async function createOrder(data) {
  return await api.post("/api/orders", data);
}

async function getOrdersByUser(params) {
  const query = new URLSearchParams(params).toString();
  return await api.get(`/api/orders/user?${query}`);
}

async function getOrderById(id) {
  return await api.get(`/api/orders/${id}`);
}

async function payViaKhalti(orderId) {
  return await api.post(`/api/orders/${orderId}/payment/khalti`);
}

async function markAsCOD(orderId, data) {
  return await api.put(`/api/orders/${orderId}/cod`, data);
}

async function cancelOrder(orderId) {
  return await api.put(`/api/orders/${orderId}/cancel`);
}

export default {
  createOrder,
  getOrdersByUser,
  getOrderById,
  payViaKhalti,
  markAsCOD,
  cancelOrder,
};
