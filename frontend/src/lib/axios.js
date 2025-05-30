// lib/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // set your base URL
  withCredentials: true, // if using cookies or auth
});

export default axiosInstance;
