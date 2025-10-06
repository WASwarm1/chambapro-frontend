import { httpInstance } from '../../../shared/services/http.instance.js'

export class ReservaApi {
    /**
     * Fetches all reservations from the API.
     * @returns {Promise<*>}
     */
    async getAll() {
        const response = await httpInstance.get('http://localhost:3000/api/v1/reservations');
        return response.data;
    }
}