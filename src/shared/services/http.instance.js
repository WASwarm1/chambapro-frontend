import axios from 'axios';

export const httpInstance = axios.create({
    baseURL: 'https://wa-swarm-2025-20-d3hac9guatdxfyby.brazilsouth-01.azurewebsites.net/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
