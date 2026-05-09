import api from "./api";

async function submitContact(data) {
  return await api.post(`/api/contacts`, data);
}

async function getContacts() {
  return await api.get(`/api/contacts`);
}

export default {
  submitContact,
  getContacts,
};
