import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Support cookies for cross-origin requests
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const persistedRoot = localStorage.getItem("persist:root");
        if (persistedRoot) {
          const rootState = JSON.parse(persistedRoot);
          let authState = rootState.auth;
          
          if (typeof authState === "string") {
            try {
              authState = JSON.parse(authState);
            } catch(e) { /* fallback if already parsed or malformed */ }
          }

          // Search all possible token locations (case-insensitive priority)
          const tokenDetails = findToken(authState);
          
          if (tokenDetails.token) {
            let cleanToken = String(tokenDetails.token).trim();
            
            // Remove any potential double Bearer if it somehow got in
            if (cleanToken.startsWith("Bearer ")) {
                cleanToken = cleanToken.substring(7).trim();
            }
            
            // Remove quotes
            cleanToken = cleanToken.replace(/^"|"$/g, "");
            
            // CRITICAL: Prevent sending "null" or "undefined" as strings
            if (cleanToken !== "null" && cleanToken !== "undefined" && cleanToken.length > 20) {
              config.headers.Authorization = `Bearer ${cleanToken}`;
              // Log once to verify, but keep it quiet for performance
              if (!window._apiLogDone) {
                   console.log(`[API] Auth Token successfully attached from ${tokenDetails.source}`);
                   window._apiLogDone = true;
              }
            } else {
              console.error(`[API] Invalid token detected. Value: "${cleanToken}", Length: ${cleanToken.length}, Source: ${tokenDetails.source}`);
            }
          } else {
            // Enhanced debugging for missing token
            console.groupCollapsed("[API] Auth Debugging (Token Not Found)");
            console.log("Persisted Root exists:", !!persistedRoot);
            console.log("Auth State exists:", !!authState);
            if (authState) {
               console.log("Auth keys:", Object.keys(authState));
               console.log("Token value:", authState.token);
               console.log("User nested token:", authState.user?.token || authState.user?.authtoken);
            }
            console.groupEnd();

            const publicRoutes = ['/api/auths/login', '/api/auths/register', '/api/auths/forgot-password', '/api/auths/reset-password'];
            if (!publicRoutes.some(route => config.url?.includes(route))) {
                console.warn(`[API] No token found for protected route: ${config.url}`);
            }
          }
        }
      } catch (e) {
        console.error("[API] Interceptor failed:", e.message);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function findToken(authState) {
    // 1. Check root level of auth state
    if (authState?.token) return { token: authState.token, source: "state.token" };
    if (authState?.authtoken) return { token: authState.authtoken, source: "state.authtoken" };
    if (authState?.authToken) return { token: authState.authToken, source: "state.authToken" };
    
    // 2. Check nested user object
    if (authState?.user?.authtoken) return { token: authState.user.authtoken, source: "state.user.authtoken" };
    if (authState?.user?.token) return { token: authState.user.token, source: "state.user.token" };
    if (authState?.user?.authToken) return { token: authState.user.authToken, source: "state.user.authToken" };
    
    return { token: null, source: "none" };
}

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.group("🚨 [API] 401 UNAUTHORIZED DETECTED");
      console.error("Endpoint:", error.config?.url);
      console.error("Method:", error.config?.method?.toUpperCase());
      console.error("Token Sent:", error.config?.headers?.Authorization ? "Yes" : "No");
      console.error("Backend Message:", error.response?.data?.message || "No message provided");
      console.error("Full Error Response:", error.response?.data);
      console.groupEnd();
    }
    return Promise.reject(error);
  }
);

export default api;