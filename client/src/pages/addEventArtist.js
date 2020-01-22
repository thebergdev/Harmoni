// @flow

import * as React from 'react';
import {Component} from 'react-simplified';
import {Artist, artistService} from "../services/artistService";
import {eventService, Event, Document} from "../services/eventService";
import {Modal} from 'react-bootstrap';
import {Button} from "../components/widgets";
import { createHashHistory } from 'history';
import {userService} from "../services/userService";
import {fileInfoService} from "../services/fileService";
const history = createHashHistory();

// TODO: Clean up this mess
// TODO: Add alert on artist add

export class AddEventArtist extends Component {
    event: Event = new Event();
    newArtist: Artist;
    seeArtist: Artist;
    eventArtists: Artist[] = [];
    eventDocuments: Document[] = [];
    artistFilter: string = "";
    documentId: number = -1;
    name: string = "";
    path: string = "./files/";
    nameAddOn: string = "------";

    state = {
        showModal: false,
        setRemoveWarningShow: false,
        setAddArtistUserShow: false,
        eventArtists: []
    };

    show(e) {
        if (e.target.id === "showWarning") {
            this.setState({setRemoveWarningShow: true});
        } else if (e.target.id === "showAddUser") {
            this.setState({setAddArtistUserShow: true});
        }
    };

    constructor(props) {
        super(props);
        this.state = {file: null};

        this.newArtist = {
            artist_id: -1,
            artist_name: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        };

        this.seeArtist = {
            artist_id: -1,
            artist_name: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        };
    }

    mounted(): void {
        this.eventArtists = [];
        eventService
            .getEventById(this.props.eventId)
            .then(event => this.event = event[0])
            .catch((error: Error) => console.log(error.message));

        artistService
            .getArtistByEvent(this.props.eventId)
            .then(artists => this.eventArtists = artists[0])
            .catch((error: Error) => console.log(error.message));

        eventService
            .getDocumentByEvent(this.props.eventId)
            .then(documents => this.eventDocuments = documents[0])
            .catch((error: Error) => console.log(error.message));
    }

    onChange(e) {
        if (e.currentTarget.id === "documentSelect") {
            this.documentId = e.target.value;
        }
        const name = e.target.name;
        this.newArtist[name] = e.target.value;
    }

    onSelect(artist: Artist) {
        this.seeArtist = artist;
    }

    onChangeFilter(e) {
        this.artistFilter = e.target.value;
    }

    removeArtist() {
        //this.eventArtists = this.eventArtists.filter(artist => artist.artist_id !== this.seeArtist.artist_id);
        artistService.removeArtistFromEvent(this.event.event_id, this.seeArtist.artist_id);
        this.seeArtist = {
            artist_id: -1,
            artist_name: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        };
        this.setState({setRemoveArtistShow: false});
        this.mounted();
    }

    addArtistUser() {
        userService.generateArtistUser(this.seeArtist.artist_name, this.seeArtist.first_name, this.seeArtist.last_name,
                                        this.seeArtist.phone, this.seeArtist.email, this.seeArtist.contact_id);
        this.setState({setAddArtistUserShow: false});
        this.mounted();
    }

    download() {
        window.open("http://localhost:4000/api/file/download/contract/" + this.seeArtist.artist_id, "_blank");
        fileInfoService.downloadContract(this.seeArtist.artist_id).then( res => {});
    }

    onSubmit(e) {
        let file = this.state.file;
        let formData = new FormData();
        e.preventDefault();
        if(this.name !== file.name){
            if(this.name.slice((Math.max(0, this.name.lastIndexOf(".")) || Infinity) + 1) !== file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)){
                this.name = this.name + "." + file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
            }
        }
        if(Number.parseInt(this.documentId) === -1){
            if(this.state.file !== null){
                fileInfoService.checkFileName(this.props.eventId, this.name)
                    .then(response => {
                        console.log("DUP?: "+ response[0][0].duplicate);
                        if(response[0][0].duplicate === 0){

                            const myNewFile = new File([file], this.props.eventId + this.nameAddOn + this.name, {type: file.type});

                            formData.append('file', myNewFile);
                            formData.append('name', this.name);
                            formData.append('path', this.path + myNewFile.name);


                            let path = this.path + myNewFile.name;

                            artistService.addArtistWithNewContract(this.newArtist, this.name, this.props.eventId, path).then(response => {
                                fileInfoService.updateFile(formData).then(res =>{
                                    console.log("should have posted to server");
                                });
                                console.log("should have posted fileInfo to database");
                                this.newArtist = {
                                    artist_id: -1,
                                    artist_name: "",
                                    first_name: "",
                                    last_name: "",
                                    email: "",
                                    phone: ""
                                };
                                this.documentId = -1;
                                this.name="";
                                this.file=null;
                                this.setState({file: null});
                                this.mounted();
                            });
                        }else{
                            this.errorMessage = "En fil med dette navnet finnes allerede";
                            this.mounted();
                        }
                    });
            }
        }else{
            artistService.addArtistToEvent(this.newArtist, this.documentId).then( res => {
                this.newArtist = {
                    artist_id: -1,
                    artist_name: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: ""
                };
                this.documentId = -1;
                this.name="";
                this.file=null;
                this.setState({file: null});
            })
        }
    }

    handleFile(e) {
        let file = e.target.files[0];
        this.setState({file: file});
        this.name = file.name;
    }

    render() {
        let uploadBox;
        if(Number.parseInt(this.documentId) === -1){
            uploadBox = (
                <div>
                    <input
                        type="text"
                        className="form-control m-2"
                        value={this.name}
                        placeholder="Filnavn"
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.name = event.target.value)}
                        required
                        maxLength={50}
                    />
                    <input
                        type="file"
                        className="form-control m-2"
                        value={this.file}
                        placeholder="Fil"
                        onChange={(e) => this.handleFile(e)}
                        required
                        style={{paddingBottom: "50px", paddingTop: "20px"}}
                        accept=".txt,.pdf,.doc,.docx,.odt"
                    />
                </div>
            )
        }else{
            uploadBox = (
                <div>
                </div>
            )
        }
        return (
            <div>
                <div className="m-4">
                    <h2 className="m-2">Artistliste for #{this.event.event_id} ({this.event.title})</h2>
                    <div className="row">
                        <div className="col">
                            <select size="10" className="form-control m-2" id="exampleFormControlSelect1">
                                {this.eventArtists.filter(artist => artist.artist_name.toLowerCase().includes(this.artistFilter.toLowerCase())).map(artist =>
                                    <option value={artist} key={artist.artist_id}
                                            onClick={() => this.onSelect(artist)}>{artist.artist_name}</option>
                                )}
                            </select>
                            <input className="form-control m-2" name="filter" placeholder="Filter"
                                   value={this.artistFilter}
                                   onChange={this.onChangeFilter}/>
                        </div>
                        <div className="col">
                            <div className="card m-2">
                                <div className="card-header">
                                    Artist
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{this.seeArtist.artist_name}</h5>
                                    <p className="card-text"><b>Fullt
                                        navn: </b>{this.seeArtist.first_name + " " + this.seeArtist.last_name}</p>
                                    <p className="card-text"><b>Epost: </b>{this.seeArtist.email}</p>
                                    <p className="card-text"><b>Telefonnr.: </b>{this.seeArtist.phone}</p>
                                    {this.seeArtist.artist_name !== "" ? <p className="card-text">
                                        <a onClick={this.download} href="javascript:;"><img src="./img/icons/download.svg"/> Last ned kontrakt</a>
                                    </p> : null}
                                    {this.seeArtist.artist_name !== "" ?
                                        <div className="align-bottom form-inline">
                                            {!this.seeArtist.user_id ?
                                                <button
                                                    id="showAddUser"
                                                    className="btn btn-primary m-1"
                                                    onClick={this.show}>
                                                    Opprett bruker
                                                </button> : null}
                                            <button id="showWarning" className="btn btn-danger m-1" onClick={this.show}>Fjern</button>
                                        </div>
                                         : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <form className="w-75 m-4" onSubmit={this.onSubmit}>
                        <h4 className="m-2">Legg til ny artist:</h4>
                        <div className="row">
                            <div className="col">
                                <input
                                    className="form-control m-2 col"
                                    name="artist_name"
                                    placeholder="Artistnavn"
                                    value={this.newArtist.artist_name}
                                    onChange={this.onChange}
                                    required/>
                            </div>
                            <div className="col">
                                <div className="m-2"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input
                                    className="form-control m-2 col"
                                    name="first_name"
                                    placeholder="Fornavn"
                                    value={this.newArtist.first_name}
                                    onChange={this.onChange}
                                    required/>
                            </div>
                            <div className="col">
                                <input className="form-control m-2 col" name="last_name" placeholder="Etternavn"
                                       value={this.newArtist.last_name} onChange={this.onChange} required/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input className="form-control m-2" name="email" placeholder="E-post"
                                       value={this.newArtist.email} onChange={this.onChange} required/>
                            </div>
                            <div className="col">
                                <input className="form-control m-2" name="phone" placeholder="Telefonnr."
                                       value={this.newArtist.phone} onChange={this.onChange} required/>
                            </div>
                        </div>
                        <h5 className="m-2">Legg til kontrakt</h5>
                        <div className="row">
                            <div className="col">
                                <select id="documentSelect" className="custom-select m-2" value={this.documentId}
                                        onChange={this.onChange} required>
                                    <option selected value="-1">Velg dokument...</option>
                                    {this.eventDocuments.map(document =>
                                        <option value={document.document_id}>{document.name}</option>
                                    )}
                                </select>
                                {uploadBox}
                            </div>
                            <div className="col"/>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="m-2"/>
                            </div>
                            <div className="col">
                                <button className="btn btn-success m-2 float-right" type="submit">Legg til</button>
                            </div>
                        </div>
                    </form>
                </div>
                <Modal
                    show={this.state.setRemoveWarningShow}
                    onHide={this.close}
                    centered>
                    <Modal.Header>
                        <Modal.Title>Advarsel</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Er du sikker på at du vil slette kontrakten med denne artisten?
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Light id="closeWarning" onClick={() => this.setState({setRemoveWarningShow: false})}>Lukk</Button.Light>
                        <Button.Red onClick={this.removeArtist}>Slett</Button.Red>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={this.state.setAddArtistUserShow}
                    onHide={this.close}
                    centered>
                    <Modal.Header>
                        <Modal.Title>Bekreft</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Bekreft opprettelse av bruker for {this.seeArtist.artist_name}.
                            E-post med innlogging blir sendt til {this.seeArtist.email}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Light
                            value="closeAddUser"
                            className="modal-button"
                            id="closeAddUser"
                            onClick={() => this.setState({setAddArtistUserShow: false})}>Lukk</Button.Light>
                        <Button.Green onClick={this.addArtistUser}>Bekreft</Button.Green>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}