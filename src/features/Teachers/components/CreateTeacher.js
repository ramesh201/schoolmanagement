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
import addOrUpdateTeacher from "../api/addOrUpdateTeacher";

export class CreateTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      success: false,
      toastVariant: "",
      toastShow: false,
      firstName: "",
      lastName: "",
      mobileNo: "",
      emailAddres: "",
    };
  }
  resetData() {
    document.location.reload();
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
        teacherId: !this.props.selectedTeacher.teacherId
          ? -1
          : this.props.selectedTeacher.teacherId,
        teacherFirstName: form[0].value,
        teacherLastName: form[1].value,
        teacherContatctNo: form[2].value,
        teacherEmail: form[3].value,
      };
      this.addOrUpdateTeacher(formBody);

      setTimeout(() => {
        this.setState({ toastShow: false });
      }, 3000);
    }
  }

  addOrUpdateTeacher = async (body) => {
    try {
      this.setState({ loading: true });
      var res = await axios.post(addOrUpdateTeacher(), body);

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
      firstName: this.props.selectedTeacher.teacherFirstName,
      lastName: this.props.selectedTeacher.teacherLastName,
      mobileNo: this.props.selectedTeacher.teacherContatctNo,
      emailAddres: this.props.selectedTeacher.teacherEmail,
    });
  }
  setFieldValue(fieldName, fieldValue) {
    if (fieldName === "firstName") this.setState({ firstName: fieldValue });
    if (fieldName === "lastName") this.setState({ lastName: fieldValue });
    if (fieldName === "mobileNo") this.setState({ mobileNo: fieldValue });
    if (fieldName === "emailAddress")
      this.setState({ emailAddres: fieldValue });
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
          <Card.Header>Teacher Registration Form</Card.Header>
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
                      label="First Name"
                    >
                      <Form.Control
                        name="firstname"
                        value={this.state.firstName}
                        onChange={(e) =>
                          this.setFieldValue("firstName", e.currentTarget.value)
                        }
                        type="text"
                        placeholder="John"
                        required
                      />
                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter first name.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md>
                    <FloatingLabel
                      controlId="floatingInputGrid"
                      label="Last Name"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Doe"
                        value={this.state.lastName}
                        onChange={(e) =>
                          this.setFieldValue("lastName", e.currentTarget.value)
                        }
                        required
                      />

                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter last name.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className="g-2 mb-2">
                  <Col md>
                    <FloatingLabel
                      controlId="floatingInputGrid"
                      label="Contact Number"
                    >
                      <Form.Control
                        type="mobile"
                        placeholder="0776952098"
                        value={this.state.mobileNo}
                        onChange={(e) =>
                          this.setFieldValue("mobileNo", e.currentTarget.value)
                        }
                        required
                      />
                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter contact number
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md>
                    <FloatingLabel
                      controlId="floatingInputGrid"
                      label="Email address"
                    >
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={this.state.emailAddres}
                        onChange={(e) =>
                          this.setFieldValue(
                            "emailAddress",
                            e.currentTarget.value
                          )
                        }
                        required
                      />
                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter valid email address.
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
                  onClick={() => this.resetData()}
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

export default CreateTeacher;
