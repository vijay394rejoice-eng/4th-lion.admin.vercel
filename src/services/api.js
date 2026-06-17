import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' 
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Automatically attaches the Bearer token from cookies to every outgoing request.
// Works in both browser (document.cookie) and server-side (next/headers cookies()).
api.interceptors.request.use(async (config) => {
  let token = null;

  if (typeof window !== 'undefined') {
    // Client-side: read from document.cookie
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    token = match ? decodeURIComponent(match[1]) : null;
  } else {
    // Server-side: read from next/headers cookies()
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value || null;
    } catch {
      // cookies() may not be available in all server contexts
      token = null;
    }
  }

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Response Interceptor (Token Refresh) ───────────────────────────────────
// Automatically handles 401 errors, requests a new access token using the refresh token,
// updates the cookies, and retries the original request.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Prevent infinite loop if login or refresh requests themselves fail
      if (originalRequest.url?.includes('/user/login') || originalRequest.url?.includes('/user/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let refreshToken = null;
        if (typeof window !== 'undefined') {
          const match = document.cookie.match(/(?:^|;\s*)refresh_token=([^;]*)/);
          refreshToken = match ? decodeURIComponent(match[1]) : null;
        }

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Request a new access token
        const res = await axios.post(
          `${BASE_URL}/user/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (res.data && res.data.status === 1) {
          const newToken = res.data.data.access_token;

          // Update cookies with the new token
          if (typeof window !== 'undefined') {
            document.cookie = `token=${encodeURIComponent(newToken)}; path=/; max-age=604800; SameSite=Lax; Secure`;
          }

          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          processQueue(null, newToken);
          isRefreshing = false;

          return api(originalRequest);
        } else {
          throw new Error(res.data?.message || 'Token refresh failed');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        // Clear cookies and force redirect to login on refresh token expiration/failure
        if (typeof window !== 'undefined') {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
          document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
          window.location.href = '/';
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export const request = async (fn, showError = true) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Something went wrong';
    
    // Only show toast if showError is true and we're in the browser
    if (showError && typeof window !== 'undefined') {
      toast.error(message);
    }
    
    throw err?.response?.data || err;
  }
};
