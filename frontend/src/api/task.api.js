const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getTasks = async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Failed to fetch tasks");
        error.statusCode = response.status;
        throw error;
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
        const error = new Error(data.message || "Failed to create task");
        error.statusCode = response.status;
        throw error;
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
        const error = new Error(data.message || "Failed to update task");
        error.statusCode = response.status;
        throw error;
    }

    return data;
};

export const deleteTask = async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Failed to delete task");
        error.statusCode = response.status;
        throw error;
    }

    return data;
};
