import axios from 'axios';

export const httpInstance = axios.create({
    baseURL: 'https://chambapro-platform-production.up.railway.app/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
