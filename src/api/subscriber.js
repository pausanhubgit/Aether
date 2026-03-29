import api from "./api";

async function subscribe(email) {
  return await api.post(`/api/subscribers`, { email });
}

async function getSubscribers() {
  return await api.get(`/api/subscribers`);
}

export default {
    subscribe,
    getSubscribers
};
