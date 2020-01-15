// @flow

const Dao = require('./dao.js');

export class EventDAO extends Dao {
    constructor(pool) {
        super(pool);
    }

    createEvent(json: Object, callback: (status: string, data: string) => void) {
        let newEvent = [json.title, json.description, json.location, json.start_time, json.end_time, json.category, json.capacity, json.organizer];
        console.log('event', newEvent);
        super.query("CALL create_event(?,?,?,?,?,?,?,?)", newEvent, callback)
    }

    getAllEvents(callback: (status: string, data: string) => void) {
        super.query("CALL get_all_events", [], callback);
    }

    getEventById(event_id: number, callback: (status: string, data:string) => void) {
        let values = [event_id];
        super.query("CALL get_event_by_id(?)", values, callback);
    }

    getEventByName(name: string, callback: (status: string, data: string) => void) {
        let values = [name];
        super.query("CALL get_event_by_name(?)", values, callback);
    }

    getEventByUser(organizer: number, callback: (status: string, data: string) => void) {
        let values = [organizer];
        super.query("CALL get_events_by_user(?)",
            values,
            callback);
    }

    getEventsByCancelled(cancelled: boolean, callback: (status: string, data: string) => void) {
        let values = [cancelled];
        super.query("CALL get_events_by_cancelled(?)",
            values,
            callback);
    }

    deleteEvent(event_id: number, callback: (status: string, data: string) => void) {
        let values = [event_id];
        super.query("CALL delete_event(?)",
            values,
            callback);
    }

    deleteEventsByEndTime(organizer: number, callback: (status: string, data: string) => void) {
        let values = [organizer];
        super.query("CALL delete_events_by_end_time(?)",
            values,
            callback);
    }

    cancelEvent(event_id : number, callback: (status: string, data: string) => void) {
        let values = [event_id];
        super.query("CALL cancel_event_by_id(?)",
            values,
            callback);
    }

    getCancelledEventInfo(event_id: number, callback: (status: string, data: string) => void) {
        let values = [event_id];
        super.query("CALL get_cancelled_event_email_info(?)",
            values,
            callback);
    }
}