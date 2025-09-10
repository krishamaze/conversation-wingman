const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

let authToken = localStorage.getItem('token') || '';

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

let requestInterceptor = null;
let responseInterceptor = null;

export const setRequestInterceptor = (fn) => {
  requestInterceptor = fn;
};

export const setResponseInterceptor = (fn) => {
  responseInterceptor = fn;
};

const baseRequest = async (path, options = {}, retry = 1) => {
  const opts = { ...options };
  opts.headers = {
    ...(opts.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...opts.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, opts);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const data = await res.json();
    return data;
  } catch (err) {
    if (retry > 0) {
      return baseRequest(path, options, retry - 1);
    }
    throw err;
  }
};

const request = async (path, options = {}, retry = 1) => {
  const modified = requestInterceptor ? requestInterceptor({ path, options }) : { path, options };
  const response = await baseRequest(modified.path, modified.options, retry);
  return responseInterceptor ? responseInterceptor(response) : response;
};

export const transcribeAudio = (file) => {
  const form = new FormData();
  form.append('audio', file);
  return request('/transcribe', { method: 'POST', body: form });
};

export const suggestResponses = (payload) =>
  request('/suggest', { method: 'POST', body: JSON.stringify(payload) });

export const getFavorites = () => request('/favorites', { method: 'GET' });

export const saveFavorite = (phrase) =>
  request('/favorites', { method: 'POST', body: JSON.stringify({ phrase }) });
