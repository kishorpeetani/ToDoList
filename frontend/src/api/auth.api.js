const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.message || "Request failed");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
};

export const signIn = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
};

export const signUp = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
};

export const getMe = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
    });

    return handleResponse(response);
};

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
    });

    return handleResponse(response);
};
