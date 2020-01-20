// @flow

import * as React from "react";
import {Component} from "react-simplified";
import {Event, eventService} from "../services/eventService";
import {createHashHistory} from "history";

const history = createHashHistory();

export class EventSearch extends Component<{match: {params: {input: string}}}> {
    events: Event[] = [];
    input: string = "";

    mounted(){
        this.input = this.props.match.params.input;
        eventService.getEventBy(this.input).then(response => {
            this.events = [];
            response[0].map(e => {
                this.events.push(e);
            });
        }).catch((error: Error) => console.log(error.message));
    }
    render() {
        return (
            <div className="container">
                <div className="card-columns">
                    {this.events.map(events => (
                        <div className="card" onClick={() => history.push("/event/" + events.event_id + "/view")}>
                            <img className="card-img-top img-fluid" src="" alt=""/>
                            <div className="card-body">
                                <h5>
                                    {events.title} {events.start_time}
                                </h5>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        )
    }
}