import { HistoryService} from "../domain/history-services.entity.js";

export function assembleHistoryServices(reservations, technicians) {
    return reservations.map((reservation, index) => {
        const technician = technicians[index % technicians.length]

        return new HistoryService({
            date: formatDate(reservation.date),
            technicianName: `${technician.name} ${technician.lastname}`,
            cost: `S/ ${100 + index * 50}.00`,
            status: 'Completado'
        })
    })
}

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}
