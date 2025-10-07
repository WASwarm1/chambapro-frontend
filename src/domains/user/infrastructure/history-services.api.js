import { httpInstance} from "../../../shared/services/http.instance.js";

export async function getTechnicians() {
    const res = await httpInstance.get('https://68e464108e116898997bb2b6.mockapi.io/api/v1/technicians')
    return res.data
}

export async function getReservations() {
    const res = await httpInstance.get('https://68e464108e116898997bb2b6.mockapi.io/api/v1/reservations')
    return res.data
}

