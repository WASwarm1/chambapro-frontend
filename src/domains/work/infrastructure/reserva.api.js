import { httpInstance } from '../../../shared/services/http.instance.js'

export class ReservaApi {
    /**
     * Fetches all reservations from the API.
     * @returns {Promise<*>}
     */
    async getAll() {
        const response = await httpInstance.get('reservations');
        return response.data;
    }
}