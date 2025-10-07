import { httpInstance } from '../../../shared/services/http.instance.js'
import { toTechnicianProfileViewModel } from './tecnico.assembler.js';

export class TecnicoApi {
    /**
     * Fetches all reservations from the API.
     * @returns {Promise<*>}
     */
    async getAll() {
        const response = await httpInstance.get('https://68e464108e116898997bb2b6.mockapi.io/api/v1/technicians');
        return response.data;
    }
    /**
     * Fetches specific technician with ID.
     * @param {number | string} id .
     * @returns {Promise<any>}
     */
    static async getById(id) {

        const response = await httpInstance.get(`https://68e464108e116898997bb2b6.mockapi.io/api/v1/technicians/${id}`);
        const rawData = response.data;


        return toTechnicianProfileViewModel(rawData);
    }

}