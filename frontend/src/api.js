// src/api.js
import axios from 'axios';
import { API_BASE } from './config';
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
