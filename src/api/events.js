import api from "./api";

async function createEvent(data) {
  return await api.post(`/api/events`, data);
}

async function getEvents() {
  return await api.get(`/api/events`);
}

async function deleteEvent(id) {
  return await api.delete(`/api/events/${id}`);
}

async function updateEvent(id, data) {
  return await api.put(`/api/events/${id}`, data);
}

async function getEventsCount() {
  return await api.get(`/api/events/count`);
}

async function registerForEvent(data) {
  return await api.post(`/api/events/register`, data);
}

async function getEventById(id) {
  return await api.get(`/api/events/${id}`);
}

async function getMyRegistrations() {
  return await api.get(`/api/events/my-registrations`);
}

export default {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
  updateEvent,
  getEventsCount,
  registerForEvent,
  getMyRegistrations,
};
