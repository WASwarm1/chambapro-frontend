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