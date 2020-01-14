//@flow

import * as React from 'react';
import {Component} from "react-simplified";
import { createHashHistory } from 'history';
const history = createHashHistory();
import Modal from 'react-bootstrap/Modal';
import { riderService, Rider} from "../services/riderService";
import { Row, Column} from "../widgets";
import Autosuggest from 'react-autosuggest';

export class RiderCard extends Component <{rider_id: React.Node, description: React.Node, url: React.Node}> {
    show = false;
    render(){
        return(
            <div className="row justify-content-center">
                <div className="card mb-4" style={{width: '50%'}}>
                    <div id={"card"} className="card-img-overlay"></div>
                    <div className="card-body">
                        <div className="card-text" style={{whiteSpace: 'pre-line'}}>{this.props.description}</div>
                        <br/>
                        <Row>
                            <Column width={2}>
                                <button type="button" className="btn btn-info" onClick={this.edit}>
                                    Rediger
                                </button>
                            </Column>
                            <Column>
                                <button type="button" className="btn btn-danger" onClick={this.handleShow}>
                                    Slett
                                </button>
                            </Column>
                        </Row>
                    </div>
                </div>
                <Modal show={this.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Er du sikker på at du vil slette denne Rideren?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary" onClick={this.handleClose}>
                            Avbryt
                        </button>
                        <button type="button" className="btn btn-danger" onClick={this.delete}>
                            Slett
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
    handleShow(){
        this.show = true;
    }
    handleClose(){
        this.show = false;
    }
    edit(){
        history.push(this.props.url + "/edit/" + String(this.props.rider_id))
    }

    delete(){
        riderService
            .deleteRider(parseInt(this.props.rider_id))
            .then((response) => {
                console.log("Rider deleted")
            })
            .catch((error: Error) => console.error(error.message));
    }
}

export class RiderList extends Component<{match : {params: {documentId: number}}}>{
    riders: Rider[] = [];
    url: string = "";
    render(){
        return(
            <div>
                {this.riders.map(r => (
                    <RiderCard rider_id={r.rider_id} description={r.description} url={this.url} key={r.rider_id}/>
                ))}
            </div>
        );
    }

    mounted(){
        this.url = this.props.match.url;
        riderService
            .getAllRiders(this.props.match.params.documentId)
            .then(riders => {
                this.riders = riders[0];
            })
            .catch((error: Error) => console.error(error.message));
    }
}

export class RiderEdit extends Component<{match : {params: {riderId: number, eventId: number, documentId: number}}}>{
    errorMessage: string = "";
    rider: Rider = new Rider();
render(){
        return(
            <div className="row justify-content-center">
                <div className="mb-4 border-0 " style={{width: '75%'}}>
                    <div className="card-body">
                        <form ref={e => (this.form = e)}>
                            <label htmlFor="basic-url">Tekst: </label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                </div>
                                <textarea
                                    className="form-control"
                                    required
                                    minLength={1}
                                    maxLength={100}
                                    aria-label="tekst"
                                    rows="10"
                                    value={this.rider.description}
                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.rider.description = event.target.value)}> </textarea>
                            </div>
                        </form>

                    </div>
                    <button type="button" className="btn btn-info" onClick={this.update}>
                        Rediger
                    </button>
                    <p style={{color: "red"}}>{this.errorMessage}</p>
                </div>
            </div>
        )
    }
    update(){
        if(!this.form || !this.form.checkValidity()){
            this.errorMessage = "Fyll ut de røde feltene";
            this.mounted();
            return;
        }else{
            riderService
                .updateRider(this.props.match.params.riderId, this.rider.description)
                .then((response) => {
                    window.location.reload()
                }, console.log("Rider oppdatert"))
                .then(history.push('/event/edit/' + this.props.match.params.eventId + '/document/' + this.props.match.params.documentId + '/riders'))
                .catch((error: Error) => console.error(error.message));
        }
    }
}