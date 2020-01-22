const express = require("express");

const contactController = require("../controllers/contact");
const eventController = require("../controllers/event");
const userController = require("../controllers/user");

const router = express.Router();

router.get("/event", eventController.getEvents);
router.get("/event/search/:input", eventController.getEventByInput);
router.post("/contact", contactController.contactUs);
router.get("/categories", eventController.getCategories);
router.get("/event/:contactId", userController.getOrganizerUsername);

module.exports = router;
