/**
 * Clear all authentication data and redirect to login
 */
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userData");
  window.location.href = "/auth/login";
}

/**
 * Make authenticated API requests with automatic token refresh
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("access_token");

  // Check if token exists
  if (!token) {
    console.error("No access token found");
    logout();
    throw new Error("No authentication token found");
  }

  // Make initial request
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  });

  // 🔁 If token expired (401), try to refresh
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    // Check if refresh token exists
    if (!refreshToken) {
      console.error("No refresh token found");
      logout();
      throw new Error("Session expired. Please login again.");
    }

    try {
      // Attempt to refresh token
      const refreshRes = await fetch("http://127.0.0.1:8000/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      // Check if refresh was successful
      if (!refreshRes.ok) {
        console.error("Failed to refresh token:", refreshRes.status);

        // If refresh token is also invalid/expired, logout
        if (refreshRes.status === 401 || refreshRes.status === 403) {
          logout();
          throw new Error("Session expired. Please login again.");
        }

        throw new Error("Failed to refresh token");
      }

      const data = await refreshRes.json();

      // Check if new access token is returned
      if (!data.access_token) {
        console.error("No access token in refresh response");
        logout();
        throw new Error("Invalid token response");
      }

      // Save new access token
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("authToken", data.access_token);

      // Also update refresh token if provided
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      // 🔁 Retry original request with new token
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.access_token}`
        }
      });

    } catch (error: any) {
      console.error("Error refreshing token:", error);

      // Only logout if it's an auth error (not network error)
      if (error.message.includes("Session expired") || error.message.includes("No authentication")) {
        throw error;
      }

      // For network errors, still throw but don't logout
      throw new Error("Network error while refreshing token");
    }
  }

  return res;
}