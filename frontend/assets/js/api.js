const API_URL = 'http://localhost:5000/api';

class API {
    static async request(endpoint, method = 'GET', body = null, token = null) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async upload(endpoint, formData, token = null) {
        const headers = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers, // Do NOT set Content-Type for FormData, browser sets it with boundary
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            return data;
        } catch (error) {
            console.error('API Upload Error:', error);
            throw error;
        }
    }
}
