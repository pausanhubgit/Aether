import api from "./api";

export async function payviaKhalti(orderId) {
  return await api.post(`/api/orders/${orderId}/payment/Khalti`);
}
