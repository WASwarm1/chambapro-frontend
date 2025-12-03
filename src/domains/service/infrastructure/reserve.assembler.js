import { Reserve } from '../domain/reserve.entity.js'

export class ReserveAssembler {
    /**
     * Converts a DTO to a Reserve entity.
     * @param dto
     * @returns {Reserve}
     */

    static toEntity(dto) {
        return new Reserve(dto.id, dto.date, dto.time, dto.description, dto.clientName, dto.category);
    }

    static toEntities(dtos) {
        return dtos.map((dto) => this.toEntity(dto));
    }
}
