/**
  Delete all procedures for recreation
 */
DROP PROCEDURE IF EXISTS get_event_by_id;
DROP PROCEDURE IF EXISTS get_event_by_name;
DROP PROCEDURE IF EXISTS get_all_events;
DROP PROCEDURE IF EXISTS create_event;
DROP PROCEDURE IF EXISTS get_event_by_month;
DROP PROCEDURE IF EXISTS get_events_by_cancelled;
DROP PROCEDURE IF EXISTS cancel_event_by_id;
DROP PROCEDURE IF EXISTS get_cancelled_event_email_info;
DROP PROCEDURE IF EXISTS get_event_by_id_update;

/**
  Fetch event by ID
 */

CREATE PROCEDURE get_event_by_id(IN event_id_in int)
BEGIN
    SELECT event_id, title, location, DATE_FORMAT(start_time, "%a %e.%m.%Y %H:%i") as start_time, DATE_FORMAT(end_time, "%a %e.%m.%Y %H:%i") as end_time, category, capacity, organizer FROM event where event_id = event_id_in;
END;

/**
  Get event by name
 */
CREATE PROCEDURE get_event_by_name(IN event_name_in VARCHAR(100))
BEGIN
    SELECT event_id, title, location, DATE_FORMAT(start_time, "%a %e.%m.%Y %H:%i") as start_time, DATE_FORMAT(end_time, "%a %e.%m.%Y %H:%i") as end_time, category, capacity, organizer from event where title like CONCAT('%', event_name_in, '%');
end ;



/**
  get all event by
 */
CREATE PROCEDURE get_all_events()
BEGIN
    SELECT event_id, title, location, DATE_FORMAT(start_time, "%a %e.%m.%Y %H:%i") as start_time, DATE_FORMAT(end_time, "%a %e.%m.%Y %H:%i") as end_time, category, capacity, organizer from event;
end;

/**
  get events by month
 */
CREATE PROCEDURE get_event_by_month(IN event_month_in int)
BEGIN
    SELECT event_id, title, location, DATE_FORMAT(start_time, "%a %e.%m.%Y %H:%i") as start_time, DATE_FORMAT(end_time, "%a %e.%m.%Y %H:%i") as end_time, category, capacity, organizer from event where MONTH(start_time) = event_month_in;
end;

/**
  insert a new event in table
 */
 CREATE PROCEDURE create_event(IN event_title_in VARCHAR(50), event_description_in VARCHAR(500), event_location_in VARCHAR(100), event_start_time_in DATETIME, event_end_time_in DATETIME, event_category_in VARCHAR(50), event_capacity_in int, event_organizer_in int)
BEGIN
    INSERT INTO event VALUES (DEFAULT, event_title_in, event_description_in, event_location_in, event_start_time_in, event_end_time_in, event_category_in, event_capacity_in, event_organizer_in, DEFAULT);
end ;

/**

  Fetch cancelled events

  Issued by: getCanceledEvents()
 */

CREATE PROCEDURE get_events_by_cancelled(IN cancelled_in BIT)
BEGIN
    SELECT * FROM event WHERE cancelled=cancelled_in;
END;

/**
  Cancel event based on an id

  IN event_id_in: Id of the event

  Issued by: cancelEvent(eventId: number)
 */

CREATE PROCEDURE cancel_event_by_id(IN event_id_in INT)
BEGIN
    UPDATE event SET cancelled = 1 WHERE event_id=event_id_in;
END;

/**
  Fetch cancelled event information

  IN event_id_in: Id of the event

  Issued by: getCancelledEventInfo(eventId: number)
 */
CREATE PROCEDURE get_cancelled_event_email_info(IN event_id_in INT)
BEGIN
    SELECT first_name, last_name, email FROM contact
                                                 INNER JOIN event ON contact.contact_id = event.organizer
    WHERE event_id = event_id_in;
END;


/**
  Get event by id for event update
 */

 CREATE PROCEDURE get_event_by_id_update(IN event_id_in INT)
 BEGIN
     SELECT event_id, title, location, DATE_FORMAT(start_time, '%Y-%m-%dT%H:%i') as start_time, DATE_FORMAT(end_time, '%Y-%m-%dT%H:%i') as end_time, category, capacity, organizer FROM event where event_id = event_id_in;
 end;