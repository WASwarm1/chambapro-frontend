import { httpInstance } from '../../../shared/services/http.instance.js'
import { toTechnicianProfileViewModel } from './tecnico.assembler.js';

export class TecnicoApi {
    /**
     * Fetches all reservations from the API.
     * @returns {Promise<*>}
     */
    async getAll() {
        const response = await httpInstance.get('technicians');
        return response.data;
    }
    /**
     * Fetches specific technician with ID.
     * @param {number | string} id .
     * @returns {Promise<any>}
     */
    static async getById(id) {

        const response = await httpInstance.get(`/technicians/${id}`);
        const rawData = response.data;


        return toTechnicianProfileViewModel(rawData);
    }

}