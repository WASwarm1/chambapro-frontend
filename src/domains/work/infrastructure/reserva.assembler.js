import { Reserva } from '../domain/reserve.entity.js'

export class ReservaAssembler {
    /**
     * Converts a DTO to a Reserva entity.
     * @param dto
     * @returns {Reserva}
     */

    static toEntity(dto) {
        return new Reserva(dto.id, dto.date, dto.time, dto.description, dto.client, dto.category);
    }

    static toEntities(dtos) {
        return dtos.map((dto) => this.toEntity(dto));
    }
}