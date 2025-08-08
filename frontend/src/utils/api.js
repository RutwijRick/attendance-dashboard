import axios from "axios";
import urls from "./urls";
import { getAuthToken } from "./fn";

const api = {
    get: async (urlKey, config = {}) => {
        const token = getAuthToken();
        return axios.get(urls[urlKey], {
            headers: { Authorization: `Bearer ${token}` },
            ...config,
        });
    },

    post: async (urlKey, data = {}, config = {}) => {
        const token = getAuthToken();
        return axios.post(urls[urlKey], data, {
            headers: { Authorization: `Bearer ${token}` },
            ...config,
        });
    },

    put: async (urlOrKey, data = {}, config = {}) => {
        const token = getAuthToken();
        const url = typeof urlOrKey === 'string' && urlOrKey.startsWith('http')
            ? urlOrKey
            : urls[urlOrKey];

        return axios.put(url, data, {
            headers: { Authorization: `Bearer ${token}` },
            ...config,
        });
    },

    delete: async (urlKey, config = {}) => {
        const token = getAuthToken();
        return axios.delete(urls[urlKey], {
            headers: { Authorization: `Bearer ${token}` },
            ...config,
        });
    },

    patch: async (urlOrKey, data = {}, config = {}) => {
        const token = getAuthToken();
        const url = typeof urlOrKey === 'string' && urlOrKey.startsWith('http')
            ? urlOrKey
            : urls[urlOrKey];

        return axios.patch(url, data, {
            headers: { Authorization: `Bearer ${token}` },
            ...config,
        });
    },

    upload: async (urlOrKey, fileData, config = {}) => {
        const token = getAuthToken();
        const url = typeof urlOrKey === 'string' && urlOrKey.startsWith('http')
            ? urlOrKey
            : urls[urlOrKey];

        const formData = new FormData();
        for (const key in fileData) {
            formData.append(key, fileData[key]);
        }

        return axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        });
    },
};

export default api;
