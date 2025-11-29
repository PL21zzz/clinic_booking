// client/src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api', // URL gốc của Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động gắn Token vào mọi request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Lấy token từ bộ nhớ
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Gắn vào Header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor: Xử lý lỗi (Ví dụ: Token hết hạn thì đá về login)
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Nếu Backend báo 401 (Không có quyền/Token sai) -> Xóa token và reload
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
