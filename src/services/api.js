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
