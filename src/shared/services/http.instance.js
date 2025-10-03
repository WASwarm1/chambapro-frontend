import axios from 'axios';

export const httpInstance = axios.create({
    baseURL: 'https://68d448d6214be68f8c68eb21.mockapi.io/api/v1/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});