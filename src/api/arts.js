import api from "./api";
import formatParams from "@/helpers/formatParams";

async function createArts(data) {
  return await api.post(`/api/arts`, data);
}

async function deleteArts(id) {
  return await api.delete(`/api/arts/${id}`);
}

async function getArt(searchParams) {
  const query = formatParams(searchParams);
  return await api.get(`/api/arts?${query}`);
}

async function getArtsCount(searchParams) {
  const query = formatParams(searchParams);
  return await api.get(`/api/arts/count?${query}`);
}

async function getArtsById(id) {
  return await api.get(`/api/arts/${id}`);
}

// alias for backward compatibility
async function getArtById(id) {
  return getArtsById(id);
}

async function updateArt(id, data) {
  return await api.put(`/api/arts/${id}`, data);
}

async function getCategories() {
  return await api.get(`/api/arts/categories`);
}

async function likeArt(artId) {
  return await api.post(`/api/arts/${artId}/react`);
}

async function addComment(artId, data) {
  return await api.post(`/api/arts/${artId}/comment`, data);
}

async function getComments(artId) {
  return await api.get(`/api/arts/${artId}`); // embedded
}

async function deleteComment(artId, commentId) {
  return await api.delete(`/api/arts/${artId}/comment/${commentId}`);
}

async function getLikesAnalytics(merchantId) {
  return await api.get(`/api/arts/analytics/likes?merchantId=${merchantId}`);
}

const artsAPI = {
  createArts,
  deleteArts,
  deleteArt: deleteArts,
  getArt,
  getArtsCount,
  getArtsById,
  getArtById,
  updateArt,
  getCategories,
  likeArt,
  addComment,
  getComments,
  deleteComment,
  getLikesAnalytics,
};

export default artsAPI;
