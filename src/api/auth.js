// Authentication service
import api from "./api";

async function login({ email, password }) {
  return await api.post(`/api/auths/login`, {
    email,
    password
  });
}

async function signup(data) {
  return await api.post(`/api/auths/register`, data);
}

async function forgotPassword(data) {
  return await api.post(`/api/auths/forgot-password`, data);
}

async function resetPassword(token, userId, data) {
  return await api.post(
    `/api/auths/reset-password?token=${token}&userId=${userId}`,
    data
  );
}

async function googleLogin(token) {
  return await api.post(`/api/auths/google`, { token });
}

const authAPI = {
  login,
  signup,
  forgotPassword,
  resetPassword,
  googleLogin,
};

export default authAPI;