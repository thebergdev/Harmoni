// @flow

import {Email} from "../email";

/**
 * Controller for receiving HTTP requests through the email endpoint
 * @type {{listen?: *}}
 */

const pool = require("../server.js");
const emailService = new Email();

const TAG = '[ContactController]';


exports.contactUs = (req, res, next) => {

    console.log(TAG, 'POST-request: /contactUs')
    emailService.contactUs(req.body.email, req.body.name, req.body.subject, req.body.content);

};