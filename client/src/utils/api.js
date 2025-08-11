import axios from 'axios'

const api = axios.create({
 // baseURL:"http://localhost:5000/api", // your backend route proxy (e.g. http://localhost:5000/api if not proxied)
  baseURL:process.env.FRONTEND_URL/api,
 timeout: 10000,

})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
     console.log('🟨 Sending token:', token); // <--- Add this
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      config.data &&
      typeof config.data === 'object' &&
      !(config.data instanceof FormData)
    ) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Catch errors in responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
