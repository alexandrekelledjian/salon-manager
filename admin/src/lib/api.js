const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getToken = () => {
    if (typeof window !== 'undefined') {
          return localStorage.getItem('admin_token');
    }
    return null;
};

export const setToken = (token) => {
    if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token);
    }
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
    }
};

export const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
          'Content-Type': 'application/json',
          ...options.headers,
    };

    if (token) {
          headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
    });

    return response;
};

export const login = async (email, password) => {
    const response = await apiFetch('/api/admin/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erreur de connexion');
    }

    const data = await response.json();
    setToken(data.token);
    return data;
};

export const logout = () => {
    removeToken();
};
