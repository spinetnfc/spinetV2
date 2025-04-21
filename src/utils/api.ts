

const API_URL = process.env.API_URL;
export const apiFetch = async (
    url: string,
    options: RequestInit = {},
    token?: string,
  ) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for HttpOnly tokens
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'API request failed');
    }
  
    return res.json();
  };
  
  // Example endpoints
  export const login = async (email: string, password: string) => {
    return apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  };
  
  export const getUser = async (token: string) => {
    return apiFetch('/api/user', {}, token);
  };