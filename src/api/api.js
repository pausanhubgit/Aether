import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Support cookies for cross-origin requests
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        // Search all possible token locations (priority-based)
        const tokenDetails = findTokenAdvanced();

        if (tokenDetails.token) {
          let cleanToken = String(tokenDetails.token).trim();
          cleanToken = cleanToken.replace(/^"|"$/g, ""); // remove quotes

          if (cleanToken.startsWith("Bearer ")) {
            cleanToken = cleanToken.substring(7).trim();
          }

          if (
            cleanToken !== "null" &&
            cleanToken !== "undefined" &&
            cleanToken.length > 20
          ) {
            config.headers.Authorization = `Bearer ${cleanToken}`;
            if (!window._apiLogDone) {
              console.log(
                `[API] Auth Token successfully attached from ${tokenDetails.source}`,
              );
              window._apiLogDone = true;
            }
          }
        } else {
          // Define truly protected prefixes
          const protectedPrefixes = [
            "/api/notifications",
            "/api/events",
            "/api/orders",
            "/api/user/profile",
          ];
          const isProtected = protectedPrefixes.some((p) =>
            config.url?.startsWith(p),
          );

          // Quiet check for public-facing search or auth routes
          const isPublicAuth =
            config.url?.includes("/api/auths/login") ||
            config.url?.includes("/api/auths/register");

          if (isProtected && !isPublicAuth) {
            console.warn(
              `[API] No token found for protected route: ${config.url}`,
            );
          }
        }
      } catch (e) {
        console.error("[API] Interceptor failed:", e.message);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

function findTokenAdvanced() {
  // 0. Check plain localStorage (reliable fallback)
  const directVal =
    localStorage.getItem("authtoken") || localStorage.getItem("token");
  if (directVal) return { token: directVal, source: "localStorage.direct" };

  // 1. Check Redux Persist Store
  const persistedRoot = localStorage.getItem("persist:root");
  if (persistedRoot) {
    try {
      const rootState = JSON.parse(persistedRoot);
      let authState = rootState.auth;

      if (typeof authState === "string") {
        authState = JSON.parse(authState);
      }

      if (authState?.token)
        return { token: authState.token, source: "state.token" };
      if (authState?.authtoken)
        return { token: authState.authtoken, source: "state.authtoken" };
      if (authState?.user?.authtoken)
        return {
          token: authState.user.authtoken,
          source: "state.user.authtoken",
        };
      if (authState?.user?.token)
        return { token: authState.user.token, source: "state.user.token" };
    } catch (e) {
      /* ignore parse errors */
    }
  }

  // 2. Fallback to common direct localStorage keys (redundancy)
  const directKeys = ["authtoken", "authToken", "userToken", "token"];
  for (const key of directKeys) {
    const val = localStorage.getItem(key);
    if (val) return { token: val, source: `localStorage.${key}` };
  }

  // 3. Fallback to Cookies
  const cookieToken = `; ${document.cookie}`
    .split(`; authtoken=`)
    .pop()
    .split(";")
    .shift();
  if (cookieToken && cookieToken.length > 20)
    return { token: cookieToken, source: "document.cookie" };

  return { token: null, source: "none" };
}

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Quiet 401 handling for public-facing search pages
      const isPublicSearch =
        error.config?.url?.includes("/api/users") &&
        error.config?.method === "get";
      if (!isPublicSearch) {
        console.group("🚨 [API] 401 UNAUTHORIZED DETECTED");
        console.error("Endpoint:", error.config?.url);
        console.error("Method:", error.config?.method?.toUpperCase());
        console.error(
          "Token Sent:",
          error.config?.headers?.Authorization ? "Yes" : "No",
        );
        console.error(
          "Backend Message:",
          error.response?.data?.message || "No message provided",
        );
        console.groupEnd();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
