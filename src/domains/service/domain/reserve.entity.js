export class Reserve {
    /**
     * Creates an instance of Reserve.
     * @param id
     * @param date
     * @param time
     * @param description
     * @param client
     * @param category
     * @param status
     * @param technicianId
     */
    constructor(id, date, time, description, client, category, status = 'Pending', technicianId = null) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.description = description;
        this.client = client;
        this.category = category;
        this.status = status;
        this.technicianId = technicianId;
    }
}