import { Tecnico } from '../domain/tecnico.entity.js'

export class TecnicoAssembler {
    /**
     * Converts a DTO to a Tecnico entity.
     * @param dto
     * @returns {Tecnico}
     */

    static toEntity(dto) {
        return new Tecnico(dto.id, dto.name, dto.lastname, dto.speciality, dto.description);
    }

    static toEntities(dtos) {
        return dtos.map((dto) => this.toEntity(dto));
    }
}

/**
 * Transforma los datos crudos de la API a un "View Model"
 * para la página de perfil del técnico.
 * @param {object} apiData
 * @returns {object}
 */
export const toTechnicianProfileViewModel = (apiData) => {
    return {
        id: apiData.id,
        avatar: apiData.image,
        name: apiData.name,
        lastname: apiData.lastname,
        specialty: apiData.speciality,
        rating: apiData.rating || 0,
        reviewsCount: apiData.reviewsCount || 0,
        reviews: apiData.reviews || []
    };
};