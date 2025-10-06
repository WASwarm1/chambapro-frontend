import { httpInstance} from "../../../shared/services/http.instance.js";

export async function getTechnicians() {
    const res = await httpInstance.get('/technicians')
    return res.data
}

export async function getReservations() {
    const res = await httpInstance.get('/reservations')
    return res.data
}

