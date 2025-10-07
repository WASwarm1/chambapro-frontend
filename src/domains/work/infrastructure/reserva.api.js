import { httpInstance } from '../../../shared/services/http.instance.js'

export class ReservaApi {
    /**
     * Fetches all reservations from the API.
     * @returns {Promise<*>}
     */
    async getAll() {
        const response = await httpInstance.get('https://68e464108e116898997bb2b6.mockapi.io/api/v1/reservations');
        return response.data;
    }
}