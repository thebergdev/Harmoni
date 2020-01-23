// @flow

import * as React from 'react';
import {Component} from "react-simplified";
import {createHashHistory} from "history";
import {eventService, Event, CreateEvent} from "../services/eventService";
import {Alert} from "../components/Alert/alert.js";
import DateTime from "react-datetime";
import moment from "moment";

const history = createHashHistory();

export class EditEvent extends Component<{match: { params: {event_id: number}}}> {
    errorMessage:string="";
    allEvents = [];
    event = new Event();
    updateEvent = new CreateEvent();
    state = {
        start_time: new moment(),
        end_time: new moment()
    };

    constructor(props, context) {
        super(props, context);
    }

    handleStartTime(moment){
        this.setState({
            start_time: moment.format("YYYY-MM-DDTHH:mm:ss"),
        })
    };

    handleEndTime(moment) {
        this.setState({
            end_time: moment.format("YYYY-MM-DDTHH:mm:ss")
        });
    }

    render() {
        return(
            <div className={"m-2"}>

                <form className="form-group">
                    <div className={"form-group m-2"}>
                        <label>Navn på arrangement:</label>
                        <br></br>
                        <input type={"text"}
                               className={"form-control"}
                               id={"event-title"}
                               defaultValue={this.event.title}
                               required={true}
                               onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                   (this.event.title = event.target.value)}/>
                    </div>
                    <div className={"form-group m-2"}>
                        <label>Beskrivelse:</label>
                        <br></br>
                        <textarea rows={4} cols={50}
                                  className={"form-control"}
                                  id={"event-description"}
                                  defaultValue={this.event.description}
                                  required={true}
                                  onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                      (this.event.description = event.target.value)}
                        />
                    </div>
                    <div className={"form-group m-2"}>
                        <label>Lokasjon:</label>
                        <br></br>
                        <input type={"text"}
                               className={"form-control"}
                               id={"event-location"}
                               defaultValue={this.event.location}
                               required={true}
                               onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                   (this.event.location = event.target.value)}
                        />
                    </div>
                    <div className={"form-group m-2"}>
                        <label>Start tidspunkt:</label>
                        <br></br>
                        <div>
                            <DateTime
                                id={"start_time"}
                                dateFormat={"YYYY-MM-DD"}
                                timeFormat={"HH:mm"}
                                value={this.state.start_time}
                                locale={"no"}
                                inputProps={{readOnly: true}}
                                onChange={this.handleStartTime}
                            />
                        </div>
                    </div>
                    <div className={"form-group m-2"}>
                        <label>Slutt tidspunkt:</label>
                        <br></br>
                        <div>
                            <DateTime
                                id={"end_time"}
                                dateFormat={"YYYY-MM-DD"}
                                timeFormat={"HH:mm"}
                                value={this.state.end_time}
                                locale={"no"}
                                inputProps={{readOnly: true}}
                                onChange={this.handleEndTime}
                            />
                        </div>
                    </div>
                    <div className={"form-group m-2"}>
                        <label>Antall billettyper:</label>
                        <br></br>
                        <select name={"ticket-types"} size={"1"}>
                            <option value={"1"}>1</option>
                            <option value={"2"}>2</option>
                            <option value={"3"}>3</option>
                            <option value={"4"}>4</option>
                            <option value={"5"}>5</option>
                        </select>
                    </div>
                    <div className={"form-group m-2"}>
                        <label>Type arrangement:</label>
                        <br></br>
                        <input type={"text"}
                               className={"form-control"}
                               id={"category"}
                               defaultValue={this.event.category}
                               required={true}
                               onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                   (this.event.category = event.target.value)}
                        />
                    </div>
                    <div className={"form-group m-2"}>
                        <label>Total kapasitet:</label>
                        <br></br>
                        <input type={"text"}
                               className={"form-control"}
                               id={"ticket-amount"}
                               defaultValue={this.event.capacity}
                               required={true}
                               onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                   (this.event.capacity = event.target.value)}
                        />
                    </div>
                    <div className={"form-group m-2"}>
                        <label>Organizer:</label>
                        <br></br>
                        <input type={"text"}
                               className={"form-control"}
                               id={"organizer"}
                               defaultValue={this.event.organizer}
                               required={true}
                               onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                   (this.event.organizer = event.target.value)}
                        />
                    </div>
                </form>
                <div className="text-center">
                    <button type="button"
                            className="btn btn-ghost btn-ghost-bordered center-block"
                            onClick={this.update}>
                        {' '}Lagre{' '}
                    </button>
                </div>
            </div>
        )
    }

    update() {
        this.createEvent.start_time = this.state.start_time;
        this.createEvent.end_time = this.state.end_time;
        eventService
            .updateEvent(this.props.match.params.event_id, this.event)
            .then((response) => {
                //Alert.success('You have updated your event');
                if(response.body.error) this.errorMessage = response.body.error;
            })
            //.catch((error: Error) => Alert.danger(error.message));
        /*history.push('/event/' + JSON.parse(this.updateEvent.event_id));*/
    }

    mounted() {

        eventService
            .getEventIDUpdate(this.props.match.params.event_id)
            .then(event => {
                this.event = event[0][0];
                if(event.body.error) this.errorMessage = event.body.error;
            })
            //.catch((error: Error) => Alert.danger(error.message));
    }
}