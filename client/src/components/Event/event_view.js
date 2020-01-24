// @flow

import * as React from 'react';
import {Component} from "react-simplified";
import {Event, eventService} from "../../services/eventService";
import {Ticket} from "../../services/ticketService";
import {EventEquipment} from "../../services/equipmentService";
import {ModalWidget} from "../Modal/modal";
import {Button} from "../Buttons/buttons";
import {Alert} from "../Alert/alert";
import Map from "../map";
import {EventViewHeader} from "../Header/headers";


export default class EventView extends Component {
    errorMessage:string="";
    currentEvent: number = 0;
    eventOverview: Event = null;
    tickets: Ticket[] = [];
    eventEquipment: EventEquipment[] =[];

    state = {
        showModal: false,
        setShowModal: false,
        location: ''
    };

    show = () => {
        this.setState({ setShowModal: true });
    };

    close = () => {
        this.setState({ setShowModal: false });
    };

    render(){
        //TODO legge til error melding hvis eventen ikke kommer opp/finnes
        if (!this.eventOverview) return null;

        return (
            <div>
                <EventViewHeader label="Beskrivelse:"/>
                <p>{this.eventOverview[0].description}</p>
                <EventViewHeader label="Kategori:"/>
                <p>{this.eventOverview[0].category}</p>
                <EventViewHeader label="Tidspunkt:"/>
                <p><b>Fra:</b> {this.eventOverview[0].start_time}
                    <br/><b>Til:</b> {this.eventOverview[0].end_time}</p>
                <EventViewHeader label="Kapasitet:"/>
                <p>{this.eventOverview[0].capacity}</p>
                <EventViewHeader label="Sted:"/>
                <p>{this.eventOverview[0].location}</p>
                <Map
                    google={this.props.google}
                    center={{lat: 63.4154, lng: 10.4055}}
                    height='300px'
                    zoom={15}
                    currentAddress={this.state.location}
                    onChange={() => this.empty()}
                    readonly={true}
                />

                <div className="btn-toolbar">
                    {!this.props.isArtist ?
                        <button type="button" className="btn btn-outline-dark my-2 mr-4" onClick={this.props.handleClick}>Rediger arrangement
                        </button>
                    : null}

                    {!this.props.isArtist ?
                        <button type="button" className="btn btn-outline-dark my-2" data-toggle="modal" data-target="#showModal">Avlyst arrangement
                        </button>
                    : null}
                </div>

                <ModalWidget title="Advarsel" body="Er du sikker på at du vil avlyse dette arrangementet?">
                    <button type="button" className="btn btn-outline-primary" data-dismiss="modal">Lukk</button>
                    <button type="button" className="btn btn-outline-danger" onClick={this.cancelEvent}>Avlys</button>
                </ModalWidget>
            </div>
        )
    }

    empty() {

    }

    mounted(){
        this.currentEvent = this.props.eventId;
        eventService
            .getEventById(this.currentEvent)
            .then(eventOverview => {
                this.eventOverview = eventOverview;
                this.setState({location: this.eventOverview[0].location})
            })
            .catch((error: Error) => {error.message});
    }

    cancelEvent() {

        //console.log(this.eventOverview[0].event_id);

        if(!this.eventOverview) return Alert.danger("Finner ikke arrangementet");

        if (this.eventOverview[0].cancelled === 0) {

            this.currentEvent = this.props.eventId;

            eventService
                .cancelEvent(this.currentEvent)
                .then(window.location.reload())
                .then(console.log("Arrangementet er avlyst!"))
                //.then(Alert.success("Arrangementet er avlyst! Varsel er sendt på epost."))
                .catch((error: Error) => Alert.danger(error));

        } else if (this.eventOverview[0].cancelled === 1) {
            console.log("Dette arrangementet er allerede avlyst");
            //return (Alert.info("Dette arrangementet er allerede avlyst"));

        } else {
            console.log("Noe gikk galt!");
            //return Alert.danger("Noe gikk galt!");
        }

    }

}