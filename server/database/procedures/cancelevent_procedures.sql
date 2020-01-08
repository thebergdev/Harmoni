/**
  Delete all procedures for recreation
 */
DROP PROCEDURE IF EXISTS cancel_event_by_id;

/**
  Cancels event based on an id

  IN event_id_in: Id of the event

  Issued by: cancelEvent(eventId: number)
 */
DELIMITER //

CREATE PROCEDURE cancel_event_by_id(IN event_id_in INT)
BEGIN
  UPDATE event SET canceled=true WHERE event_id=event_id_in;
END //

DELIMITER ;

