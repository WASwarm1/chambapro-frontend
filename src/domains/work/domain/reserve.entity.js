export class Reserve {
    /**
     * Creates an instance of Reserva.
     * @param id
     * @param date
     * @param time
     * @param description
     * @param client
     * @param category
     */
    constructor(id, date, time, description, client, category) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.description = description;
        this.client = client;
        this.category = category;
    }
}