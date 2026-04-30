const API_BASE_URL = "http://localhost:5001";

export const getTasks = async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks");
    }

    return data;
};

export const createTask = async (title, description) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
    }

    return data;
};

export const updateTask = async (id, title, description) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
    }

    return data;
};