const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signIn = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Sign in failed");
        error.statusCode = response.status;
        throw error;
    }

    return data;
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

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Sign up failed");
        error.statusCode = response.status;
        throw error;
    }

    return data;
};

export const getMe = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Failed to get user info");
        error.statusCode = response.status;
        throw error;
    }

    return data;
};

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Sign out failed");
        error.statusCode = response.status;
        throw error;
    }

    return data;
};
