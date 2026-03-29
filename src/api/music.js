import formatParams from "@/helpers/formatParams";
import api from "./api";

async function createMusic(data) {
  return await api.post(`/api/musics`, data);
}

async function deleteMusic(id) {
  return await api.delete(`/api/musics/${id}`);
}

async function getMusic(searchParams) {
  const query = formatParams(searchParams);
  return await api.get(`/api/musics?${query}`);
}

async function getMusicCount(searchParams) {
  const query = formatParams(searchParams);
  return await api.get(`/api/musics/count?${query}`);
}

async function getMusicById(id) {
  return await api.get(`/api/musics/${id}`);
}

async function updateMusic(id, data) {
  return await api.put(`/api/musics/${id}`, data);
}

async function getGenres() {
  return await api.get(`/api/musics/genres`);
}

async function likeMusic(musicId) {
  return await api.post(`/api/musics/${musicId}/react`);
}

async function addComment(musicId, data) {
  return await api.post(`/api/musics/${musicId}/comment`, data);
}

async function getComments(musicId) {
  return await api.get(`/api/musics/${musicId}`); // comments are embedded in item
}

async function deleteComment(musicId, commentId) {
  return await api.delete(`/api/musics/${musicId}/comment/${commentId}`);
}

async function getLikesAnalytics(merchantId) {
  return await api.get(`/api/musics/analytics/likes?merchantId=${merchantId}`);
}

export default {
  createMusic,
  deleteMusic,
  getMusic,
  getMusicCount,
  getMusicById,
  updateMusic,
  getGenres,
  likeMusic,
  addComment,
  getComments,
  deleteComment,
  getLikesAnalytics,
};
