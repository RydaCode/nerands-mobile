import axios from 'axios';
import { NERANDS_API_KEY, SERVER_URI } from '../RequestMethods';
import { authService } from '../services/authService';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
    failedQueue = [];
};

const axiosInstance = axios.create({
    baseURL: SERVER_URI,
    timeout: 10000,
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = await authService.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-api-key'] = NERANDS_API_KEY;
    // console.log('➡️ API REQUEST:', config.method?.toUpperCase(), config.url);
    return config;
});

axiosInstance.interceptors.response.use(
    res => res,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest?.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await authService.getRefreshToken();
                if (!refreshToken) throw error;

                const { data } = await axios.post(
                    `${SERVER_URI}/auth/refresh`,
                    { refresh_token: refreshToken },
                    { headers: { 'x-api-key': NERANDS_API_KEY } }
                );

                await authService.setTokens({
                    accessToken: data.token,
                    refreshToken: data.refresh_token,
                });

                processQueue(null, data.token);
                originalRequest.headers.Authorization = `Bearer ${data.token}`;

                return axiosInstance(originalRequest);

            } catch (err) {
                processQueue(err, null);
                await authService.clearTokens();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;