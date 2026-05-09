import formatParams from "@/helpers/formatParams";
import api from "./api";

async function getOrders() {
  return await api.get(`/api/orders`);
}

async function getOrdersByMerchant() {
  return await api.get(`/api/orders/merchant`);
}

async function createOrder(data) {
  return await api.post(`/api/orders`, data);
}

async function getOrdersByUser(status) {
  const query = formatParams({ status });

  return await api.get(`/api/orders/user?${query}`);
}

async function deleteOrder(id) {
  return await api.delete(`/api/orders/${id}`);
}

async function updateOrder(id, data) {
  return await api.put(`/api/orders/${id}`, data);
}

async function payViaKhalti(orderId, data) {
  return await api.post(`/api/orders/${orderId}/payment/khalti`, data);
}

async function payViaStripe(orderId) {
  return await api.post(`/api/orders/${orderId}/payment/stripe`);
}

async function confirmPayment(orderId, data) {
  return await api.put(`/api/orders/${orderId}/confirm-payment`, data);
}

async function getAllOrders() {
  return await api.get(`/api/orders`);
}

async function getMerchantOrders(merchantId) {
  return await api.get(`/api/orders/merchant/${merchantId}`);
}

async function updateOrderStatus(orderId, data) {
  return await api.put(`/api/orders/${orderId}/status`, data);
}

async function completePayment(data) {
  return await api.post(`/api/orders/complete-payment`, data);
}

export default {
  getOrders,
  createOrder,
  getOrdersByUser,
  deleteOrder,
  updateOrder,
  payViaKhalti,
  confirmPayment,
  getOrdersByMerchant,
  payViaStripe,
  getAllOrders,
  getMerchantOrders,
  updateOrderStatus,
  completePayment,
};
