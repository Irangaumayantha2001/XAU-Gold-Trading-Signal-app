import axios, { AxiosInstance } from 'axios';

// Replace with your computer's local IP when testing
// Or your deployed API URL in production
const API_BASE_URL: string = 'http://192.168.8.108:8000';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;