// @flow

import * as React from 'react';
import {Component} from "react-simplified";
import {createHashHistory} from 'history';
import {eventService, Event} from "../services/eventService";
import {Alert} from "../components/Alert/alert.js";
import DateTime from 'react-datetime';
import moment from "moment";
import { userService } from "../services/userService";

const history = createHashHistory();

moment.locale("no");

export class AddEvent extends Component {

    event: Event[] = [];
    allEvents = [];
    categories: string[] = [];
    createEvent = new Event();
    state = {
        start_time: new moment(),
        end_time: new moment()
    };

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

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return(
            <div className={"m-2"}>

                    <form className="form-inline" onSubmit={this.onSubmit}>
                        <div className="text-center">
                        <div className={"form-group m-2"}>
                            <label>Navn på arrangement:</label>
                            <br></br>
                            <input
                                required
                                type={"text"}
                                className={"form-control"}
                                id={"event-title"}
                                placeholder={"Navn på arrangement"}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                    (this.createEvent.title = event.target.value)}/>
                        </div>
                        <div className={"form-group m-2"}>
                            <label>Beskrivelse:</label>
                            <br></br>
                            <textarea
                                required
                                rows={4} cols={50}
                                className={"form-control"}
                                id={"event-description"}
                                placeholder={"Beskrivelse av arrangement"}

                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                    (this.createEvent.description = event.target.value)}
                            />

                        </div>
                        <div className={"form-group m-2"}>
                            <label>Lokasjon:</label>
                            <br></br>
                            <input
                                required
                                type={"text"}
                                className={"form-control"}
                                id={"event-location"}
                                placeholder={"Lokasjon"}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                    (this.createEvent.location = event.target.value)}
                            />
                        </div>
                        <div className={"form-group m-2"}>
                            <label>Start tidspunkt:</label>
                            <br></br>
                            <div>
                                <DateTime

                                    type={'text'}
                                    id={"start_time"}
                                    dateFormat={"YYYY-MM-DD"}
                                    timeFormat={"HH:mm"}
                                    locale={"no"}
                                    inputProps={{ readOnly: true}}
                                    onChange={this.handleStartTime}
                                    closeOnSelect={true}

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
                                    locale={"no"}
                                    inputProps={{ readOnly: true}}
                                    onChange={this.handleEndTime}
                                    closeOnSelect={true}

                                />
                            </div>
                        </div>

                        <div className={"form-group m-2"}>
                            <label>Type arrangement:</label>
                            <br></br>
                            <select
                                required
                                name={"category"}
                                className="custom-select w-25"
                                onChange={event => this.createEvent.category = event.target.value}
                                value={this.createEvent.category}>
                                <option selected value="">Velg kategori...</option>
                                {this.categories.map(category =>
                                    <option value={category.name}>{category.name}</option>
                                )}
                            </select>
                        </div>
                        <div className={"form-group m-2"}>
                            <label>Total kapasitet:</label>
                            <br></br>
                            <input
                                required
                                type="number"
                                className={"form-control"}
                                id={"ticket-amount"}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                    (this.createEvent.capacity = event.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Registrer</button>
                        </div>
                    </form>
            </div>
        )
    }

    onSubmit(e) {
        e.preventDefault();
        this.createEvent.start_time = this.state.start_time;
        this.createEvent.end_time = this.state.end_time;
        console.log(typeof this.createEvent.start_time  === typeof this.createEvent.end_time);
        console.log(this.createEvent.start_time + 100 < this.createEvent.end_time);

        if (typeof this.createEvent.start_time  === typeof this.createEvent.end_time && this.createEvent.start_time + 100 < this.createEvent.end_time) {
            e.preventDefault();
            eventService
                .createEvent(this.createEvent)
                .then((response) => {
                    Alert.success(response);
                    history.push('/user/' + userService.getUserId() + '/overview');
                })
                .catch((error: Error) => Alert.danger(error.message));
        } else {
            e.preventDefault();
            if(this.createEvent.start_time + 100 >= this.createEvent.end_time){
                return alert("start må være før slutt!");
            }else{
                e.preventDefault();
                return alert("Du må fylle ut event start og slutt!");
            }

        }
    }


    mounted() {
        this.createEvent.organizer = userService.getUserId();
        eventService
            .getEventByName()
            .then(event => (this.allEvents  = event))
            .catch((error: Error) => Alert.danger(error.message));
        eventService
            .getCategories()
            .then(categories => this.categories = categories[0])
            .catch((error: Error) => error.message);
    }

}