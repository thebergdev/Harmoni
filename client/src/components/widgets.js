
// @flow

import * as React from 'react';
import {Component} from "react-simplified";
import {Modal} from "react-bootstrap";

export class Row extends Component < { children?: React.Node } > {

    render() {

        return <div className="row">{this.props.children}</div>

    }
}

export class Column extends Component < { width?: number, children?: React.Node } > {

    render() {

        return (

            <div className={'col-lg' + (this.props.width ? '-' + this.props.width : '') + (this.props.right ? ' text-right' : '')} style={{paddingLeft: 0}}
            >
                {this.props.children}
            </div>

        )
    }
}

export class ModalWidget extends Component < {  title: string, body: string, children: React.Node  } > {

    render() {
        return (

            <div className="modal fade" id="showModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                        </div>
                        <div className="modal-body">{this.props.body}</div>
                        <div className="modal-footer">{this.props.children}</div>
                    </div>
                </div>
            </div>

        )
    }
}

class RedButton extends Component< { onClick: () => mixed, style?: React.Node, children?: React.Node }> {

    render() {
        return (

            <button
                style={this.props.style}
                type="button"
                className="btn btn-danger btn-md btn-block"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>

        )
    }
}

class GreenButton extends Component< { onClick: () => mixed, children?: React.Node }> {

    render() {
        return (

            <button
                type="button"
                className="btn btn-success btn-md btn-block"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>

        )
    }
}

class LightButton extends Component< { onClick: () => mixed, children?: React.Node } > {

    render() {
        return (

            <button
                type="button"
                className="btn btn-light btn-md btn-block"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>

        );
    }
}
class BlueButton extends Component< { onClick: () => mixed, style?: React.Node, children?: React.Node} > {

    render() {
        return (

            <button
                type="button"
                className="btn btn-info btn-md btn-block"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>

        )
    }
}

export class Button {
    static Red = RedButton;
    static Green = GreenButton;
    static Light = LightButton;
    static Blue = BlueButton;
}




