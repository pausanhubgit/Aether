import formatParams from "@/helpers/formatParams";
import api from "./api";

async function createVideo(data) {
  return await api.post(`/api/videos`, data);
}

async function deleteVideo(id) {
  return await api.delete(`/api/videos/${id}`);
}

async function getVideo(searchParams) {
  const query = formatParams(searchParams);
  return await api.get(`/api/videos?${query}`);
}

async function getVideoCount(searchParams) {
  const query = formatParams(searchParams);
  return await api.get(`/api/videos/count?${query}`);
}

async function getVideoById(id) {
  return await api.get(`/api/videos/${id}`);
}

async function updateVideo(id, data) {
  return await api.put(`/api/videos/${id}`, data);
}

async function getGenres() {
  return await api.get(`/api/videos/genres`);
}

async function likeVideo(videoId) {
  return await api.post(`/api/videos/${videoId}/react`);
}

async function addComment(videoId, data) {
  return await api.post(`/api/videos/${videoId}/comment`, data);
}

async function getComments(videoId) {
  return await api.get(`/api/videos/${videoId}`); // embedded
}

async function deleteComment(videoId, commentId) {
  return await api.delete(`/api/videos/${videoId}/comment/${commentId}`);
}

async function getLikesAnalytics(merchantId) {
  return await api.get(`/api/videos/analytics/likes?merchantId=${merchantId}`);
}

export default {
  createVideo,
  deleteVideo,
  getVideo,
  getVideoCount,
  getVideoById,
  updateVideo,
  getGenres,
  likeVideo,
  addComment,
  getComments,
  deleteComment,
  getLikesAnalytics,
};
