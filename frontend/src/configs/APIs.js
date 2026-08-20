import axios from "axios";

export const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;

export const endpoints = {
    'generate': '/generate',
    'stream': (taskId) => `/stream/${taskId}`
}

export default axios.create({
    baseURL: `${BASE_URL}/`
});