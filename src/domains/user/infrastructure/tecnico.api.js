import { httpInstance } from '../../../shared/services/http.instance.js'

export class TecnicoApi {
    /**
     * Fetches all reservations from the API.
     * @returns {Promise<*>}
     */
    async getAll() {
        const response = await httpInstance.get('technicians');
        return response.data;
    }
}