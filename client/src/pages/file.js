import * as React from 'react';
import {Component} from "react-simplified";
import { createHashHistory } from 'history';
const history = createHashHistory();
import axios from 'axios';
import { FileInfo, fileInfoService, fileService } from "../services/fileService";
import { userService } from "../services/userService";

export class FileMain extends Component <{match: {params: {eventId: number}}}> {
    constructor(props) {
        super(props);
        this.state = {file: null};
    }
    form: any = null;
    name: string = "";
    fileList: Object[] = [];
    errorMessage: string = "";

    render() {
        return(
            <div className="row justify-content-center">
                <div className="row" style={{}}>
                    <div className="card" style={{}}>
                        <form ref={e => (this.form = e)}>
                            <input
                                type="text"
                                className="form-control"
                                value={this.name}
                                placeholder="Filnavn"
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.name = event.target.value)}
                                required
                                maxLength={50}
                            />
                            <input
                                type="file"
                                className="form-control"
                                value={this.file}
                                placeholder="Fil"
                                onChange={(e) => this.handleFile(e)}
                                required
                                style={{paddingBottom: "50px", paddingTop: "20px"}}
                            />
                            <button
                                type="button"
                                className="btn btn-dark"
                                style={{}}
                                onClick={e => this.handleUpload(e)}
                                style={{marginBottom: "0px", marginTop: "20px", width: "100%"}}
                            >Last opp</button>
                            <button
                                type="button"
                                className="btn btn-dark"
                                style={{}}
                                onClick={e => this.handleOverwrite(e)}
                                style={{marginBottom: "0px", marginTop: "20px", width: "100%"}}
                            >Skriv over</button>
                            <button
                                type="button"
                                className="btn btn-dark"
                                style={{}}
                                onClick={e => this.handleDelete(e)}
                                style={{marginBottom: "0px", marginTop: "20px", width: "100%"}}
                            >Slett</button>
                        </form>
                        <p style={{color: "red"}}>{this.errorMessage}</p>
                    </div>
                </div>
                <div className="card" style={{width: "25%"}}>
                    <div className="list-group">
                        <li className="list-group-item" style={{}}>
                            <div className="row justify-content-center">
                                Documents with event_id: {this.props.match.params.event}
                            </div>
                        </li>
                        <ul>
                        {this.fileList.map(f => (
                            <li key={"fileId" + f.document_id} className="list-group-item list-group-item-action">
                                {f.name}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    mounted() {
        this.fetch();
    }

    fetch() {
        fileInfoService.getFileInfo(this.props.match.params.eventId).then(response => {
            this.fileList = response[0];
            console.log(response[0]);
        })
    }

    handleFile(e) {
        let file = e.target.files[0];
        this.setState({file: file});
        this.name = file.name;
    }

    //returnerer 1 hvis navnet ikke finnes i databasen
    chechkFileName(){
        fileInfoService.checkFileName(this.props.match.params.eventId, this.name).then(response => {
            console.log("DUP?: "+ response[0][0].duplicate);
            let val = Number.parseInt(response[0][0].duplicate);
            console.log("val: " + val);
            this.setState({dup: val});
        });
    }

    handleUpload(e) {
        let file = this.state.file;
        let formData = new FormData();


        fileInfoService.checkFileName(this.props.match.params.eventId, this.name)
            .then(response => {
            console.log("DUP?: "+ response[0][0].duplicate);
                if(response[0][0].duplicate === 0){

                    const myNewFile = new File([file], this.props.match.params.eventId + '------' + file.name, {type: file.type});

                    formData.append('file', myNewFile);
                    formData.append('name', this.name);
                    formData.append('path', "./files/" + myNewFile.name);

                    fileInfoService.postFileInfo(this.name, this.props.match.params.eventId,  formData).then(response => {
                        console.log("should have posted fileInfo to database");
                        this.mounted();
                    });
                }else{
                    this.errorMessage = "En fil med dette navnet finnes allerede";
                    this.mounted();
                }
        });

    }
    handleOverwrite(){

    }

    handleDelete(){

    }

}
