const API_BASE_URL = "http://localhost:5001";

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
        throw new Error(data.message || "Sign in failed");
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
        throw new Error(data.message || "Sign up failed");
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
        throw new Error(data.message || "Failed to get user info");
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
        throw new Error(data.message || "Sign out failed");
    }

    return data;
};