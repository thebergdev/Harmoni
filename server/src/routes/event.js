//@flow

const express = require("express");

const eventController = require("../controllers/event");
const equipmentController = require("../controllers/equipment");
const artistController = require("../controllers/artist");
const roleController = require("../controllers/role");

const router = express.Router();

router.get("/", eventController.getEvents);
router.get("/:eventId/email", eventController.getEventEmail);
router.get("/:eventId", eventController.getEventById);
router.get("/:eventId/artist", artistController.getArtistByEvent);
router.get("/:eventId/document", eventController.getDocumentByEvent);
router.get("/:eventId/role", roleController.getRoleByEvent);
router.post("/", eventController.insertEvent);
router.post("/:eventId/equipment", equipmentController.addEquipmentToEvent);
router.post("/:eventId/artist", artistController.addArtistToEvent);
router.post("/:eventId/role", roleController.addRoleToEvent);
router.delete("/:eventId/equipment/:equipmentId", equipmentController.removeEquipmentFromEvent);
router.delete("/:eventId/artist/:artistId", artistController.removeArtistFromEvent);
router.delete("/:eventId/role/:roleId", roleController.removeRoleFromEvent);
router.put("/:eventId/equipment/:equipmentId", equipmentController.updateEquipmentOnEvent);
router.put("/:eventId/cancel", eventController.cancelEvent);
router.put("/edit/:event_id", eventController.updateEvent);
router.put("/:eventId/role", roleController.updateRoleCount);
router.get("/edit/:event_id", eventController.getEventByIdUpdate);
router.post("/new", eventController.createEvent);
router.get("/:eventId/artist", artistController.getArtistByEvent);

module.exports = router;
