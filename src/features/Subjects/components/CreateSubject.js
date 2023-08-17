import { Component } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import addOrUpdateSubjectService from "../api/addUpdateSubjectService";

export class CreateSubject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      success: false,
      toastVariant: "",
      toastShow: false,
      subjectName: "",
    };
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      validated: true,
    });

    if (form.checkValidity()) {
      var formBody = {
        subjectId: !this.props.selectedSubject.subjectId
          ? -1
          : this.props.selectedSubject.subjectId,
        subjectName: form[0].value,
      };
      this.addOrUpdateSubject(formBody);

      setTimeout(() => {
        this.setState({ toastShow: false });
      }, 3000);
    }
  }

  addOrUpdateSubject = async (body) => {
    try {
      this.setState({ loading: true });
      var res = await axios.post(addOrUpdateSubjectService(), body);

      this.setState({
        loading: false,
        success: res.data > 0 ? true : false,
        toastVariant: res.data > 0 ? "success" : "danger",
        toastHeader: res.data > 0 ? "Success" : "Error",
        toastMessage: res.data > 0 ? "Action Done" : "Action Failed",
        toastShow: true,
      });
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false,
        success: true,
        toastVariant: "danger",
        toastHeader: "Error",
        toastMessage: "Action Failed",
        toastShow: true,
      });
    }
  };

  componentDidMount(event) {
    this.setState({
      childProps: this.props.parentToChild,
      subjectName: this.props.selectedSubject.subjectName,
    });
  }
  setSubjectName(currentValue) {
    this.setState({ subjectName: currentValue });
  }

  render() {
    return (
      <>
        {this.state.loading && (
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button>
        )}
        {
          <Toast
            show={this.state.toastShow}
            bg={this.state.toastVariant}
            className="text-white"
          >
            <Toast.Header>
              <strong className="me-auto ">{this.state.toastHeader}</strong>
            </Toast.Header>
            <Toast.Body>{this.state.toastMessage}</Toast.Body>
          </Toast>
        }
        <Card className="mx-4">
          <Card.Header>Subject Add/Edit Form</Card.Header>
          <Card.Body>
            <div className="px-4">
              <Form
                noValidate
                validated={this.state.validated}
                onSubmit={(evt) => {
                  this.handleSubmit(evt);
                }}
              >
                <Row className="g-2 mb-2">
                  <Col md>
                    <FloatingLabel
                      controlId="floatingInputGrid"
                      label="Subject Name"
                    >
                      <Form.Control
                        name="subjectName"
                        value={this.state.subjectName}
                        type="text"
                        placeholder="Information Technology"
                        required
                        onChange={(e) =>
                          this.setSubjectName(e.currentTarget.value)
                        }
                      />
                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter subject name.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
                <br />
                <Button type="submit" variant="primary">
                  Save
                </Button>{" "}
                <Button
                  variant="secondary"
                  active
                  onClick={() => document.location.reload()}
                >
                  Cancel
                </Button>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default CreateSubject;
