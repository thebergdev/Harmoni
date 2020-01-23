// @flow

const Dao = require("./dao.js");

export class FileInfoDAO extends Dao {
    constructor(pool) {
        super(pool);
    }

    /**
     * Get one fileInfo
     * @param document_id
     * @param callback
     */
    getFileInfoById(document_id: number, callback: (status: string, data: string) => void) {
        let values = [document_id];
        super.query("CALL get_document_by_id(?)",
            values,
            callback);
    }

    /**
     * Get all fileInfo by event
     * @param event
     * @param callback
     */
    getFileInfoByEvent(event: number, callback: (status: string, data: string) => void) {
        let values = [event];
        super.query("CALL get_document_by_event(?)",
            values,
            callback);
    }

    /**
     * check if a document name exist in db
     * @param eventId
     * @param fileName
     * @param callback
     */
    checkFileName(eventId: number, fileName: string, callback: (status: string, data: string) => void) {
        let values = [eventId, fileName];
        console.log("SE PÅ DENNE DATAN!!!!: " + eventId);
        super.query("CALL check_document_name(?,?)",
            values,
            callback);
    }

    getContractByArtistId(artistId: number, callback: (status: string, data: string) => void){
        let values = [artistId];
        super.query("CALL get_contract_by_artist_id(?)",
            values,
            callback);
    }

    /**
     * Posts a document to the db
     * @param data
     * @param callback
     */
    //<DO NOT TOUCH>
    postFileInfo(data, callback: ()=>void) {
        console.log("data.name: " + data.name);
        console.log("data.eventId: " + data.eventId);
        super.query(
            "INSERT INTO document(document_id, name, path, event) VALUES(default,?,?,?)",
            [data.name, data.path, data.eventId],
            callback
        );
    }

    /**
     * Deletes a document from the db
     * @param path
     * @param callback
     */
    //</DO NOT TOUCH
    deleteFileInfo(path: string, callback: (status: string, data: string) => void){
        let values = [path];
        super.query("CALL delete_document(?)",
            values,
            callback);
    }
    //</DO NOT TOUCH>

}