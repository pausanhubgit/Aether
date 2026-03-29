import api from "./api";

async function getAllUsers() {
  return await api.get(`/api/users`);
}

async function getUserById(id) {
  return await api.get(`/api/users/${id}`);
}

async function updateUser(id, data) {
  return await api.put(`/api/users/${id}`, data);
}

async function deleteUser(id) {
  return await api.delete(`/api/users/${id}`);
}

async function updateUserRoles(id, data) {
  return await api.put(`/api/users/${id}/roles`, data);
}

async function updateProfileImage(id, file) {
  return await api.patch(`/api/users/${id}/profile-image`, file);
}

async function updateCoverImage(id, file) {
  return await api.patch(`/api/users/${id}/cover-image`, file);
}

async function getMerchants() {
  return await api.get(`/api/users/merchants`);
}

async function getMerchantById(id) {
  return await api.get(`/api/users/merchant/${id}`);
}

async function getUserDashboard(id) {
  return await api.get(`/api/users/${id}/dashboard`);
}

async function getUserProfile(id) {
  return await api.get(`/api/users/profile/${id}`);
}

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRoles,
  updateProfileImage,
  getMerchants,
  getMerchantById,
  getUserDashboard,
  getUserProfile,
  updateCoverImage,
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRoles,
  updateProfileImage,
  getMerchants,
  getMerchantById,
  getUserDashboard,
  getUserProfile,
  updateCoverImage,
};