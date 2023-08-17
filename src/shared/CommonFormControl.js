import { Component } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

export class CommonFormControl extends Component {
  render() {
    return (
      <FloatingLabel controlId={this.props.controlId} label={this.props.label}>
        <Form.Control
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.props.value}
        />
      </FloatingLabel>
    );
  }
}

export default CommonFormControl;
