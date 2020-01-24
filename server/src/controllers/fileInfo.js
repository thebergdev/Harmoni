//@flow

import {FileInfoDAO} from '../dao/fileInfoDao.js';

/**
 * Controller for receiving HTTP requests through the fileinfo endpoint
 * @type {{listen?: *}}
 */

const fs = require('fs');

const pool = require('../server.js');

const fileInfoDao = new FileInfoDAO(pool);

const TAG = '[FileInfoController]';

// Håndterer login og sender JWT-token tilbake som JSON
exports.getFileInfoById = (req, res, next) => {
    console.log(TAG, `GET-request: /file/info`);
    fileInfoDao.getFileInfoById((err, rows) => {
        res.json(rows);
    })
};

exports.getFileInfoByEvent = (req, res, next) => {
    console.log(TAG, `GET-request: /file/info/:eventId`);
    fileInfoDao.getFileInfoByEvent(req.params.eventId, (err, rows) => {
        res.json(rows);
    })
};

exports.insertFileInfo = (req, res, next) => {
    console.log(TAG, `POST-request: /file/info`);
    fileInfoDao.insertFileInfo({"event": req.query.event, "name": req.body.name}, (err, rows) => {
        res.json(rows);
    })
};

exports.checkFileName = (req, res, next) => {
    console.log(TAG, 'POST-request: /file/check/:eventId');
    console.log(TAG, req.params.eventId);
    console.log(TAG, req.body.name);
    fileInfoDao.checkFileName(req.params.eventId, req.body.name, (err, rows) => {
        res.json(rows);
    })
};

exports.downloadFile = (req, res, next) => {
    console.log(TAG, 'GET-request: /file/download');
    let path: string = Buffer.from(req.params.file, 'base64').toString();
    res.download(path);
};

exports.downloadContract = (req, res, next) => {
    console.log(TAG, 'GET-request: /file/download/contract');
    fileInfoDao.getContractByArtistId(req.params.artistId, (err, rows) => {
        res.download(rows[0][0].path);
    })
};

exports.getFileContent = (req, res, next) => {
    console.log(TAG, 'GET-request: /file/edit');
    let path: string = Buffer.from(req.params.file, 'base64').toString();
    fs.readFile(path, 'utf8', (err, rows) => {
        res.json(rows);
    });
};

exports.updateFileInfo = (req, res, next) => {
};

exports.deleteFileInfo = (req, res, next) => {
    console.log(TAG, 'DELETE-request: /file/delete');
    let path: string = Buffer.from(req.params.file, 'base64').toString();
    fileInfoDao.deleteFileInfo(path, (error, rows) => {
        if (error != 200) {
            console.log(TAG, error.message + " " + error);
            res.json(rows);
        } else {
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err);
                    res.json(err);
                } else {
                    res.json(rows);
                }
            });
        }
    });
};