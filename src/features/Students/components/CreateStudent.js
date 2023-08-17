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
import getAllClassroomsService from "../../Classrooms/api/getClassroomsService";
import addOrUpdateStudentService from "../api/addOrUpdateStudentService";

export class CreateStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calanderDate: new Date().toString("yyyy-mm-dd"),
      age: "",
      validated: false,
      firstnameok: false,
      firstnamewrong: false,
      classrooms: [],
      key: 2,
      firstName: "",
      lastName: "",
      contactPerson: "",
      contactMobile: "",
      contactEmail: "",
      dob: "",
      classroomId: "",
      success: false,
      toastVariant: "",
      toastShow: false,
      classroomName: "",
    };
  }
  setFieldValue(fieldName, fieldValue) {
    if (fieldName === "firstName") this.setState({ firstName: fieldValue });
    if (fieldName === "lastName") this.setState({ lastName: fieldValue });
    if (fieldName === "contactPerson")
      this.setState({ contactPerson: fieldValue });
    if (fieldName === "contactMobile")
      this.setState({ contactMobile: fieldValue });
    if (fieldName === "contactEmail")
      this.setState({ contactEmail: fieldValue });
    if (fieldName === "dob") this.setDate(fieldValue);
    if (fieldName === "classroomId") {
      this.setSelectedStudentClassroom();
    }
  }
  componentDidMount(event) {
    this.getClassrooms();
    this.setDate(this.props.selectedStudent.dateOfBirth);
    this.setState({
      firstName: this.props.selectedStudent.studentFirstName,
      lastName: this.props.selectedStudent.studentLastName,
      contactPerson: this.props.selectedStudent.contactPersonName,
      contactMobile: this.props.selectedStudent.contactPersonContactNo,
      contactEmail: this.props.selectedStudent.contactPersonEmail,
    });
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
        studentId: !this.props.selectedStudent.studentId
          ? -1
          : this.props.selectedStudent.studentId,
        studentFirstName: form[0].value,
        studentLastName: form[1].value,
        contactPersonName: form[2].value,
        contactPersonContactNo: form[3].value,
        contactPersonEmail: form[4].value,
        classroomId: form[5].value,
        dateOfBirth: form[6].value,
      };
      this.addOrUpdateStudent(formBody);

      setTimeout(() => {
        this.setState({ toastShow: false });
      }, 4000);
    }
  }

  addOrUpdateStudent = async (body) => {
    try {
      this.setState({ loading: true });

      var res = await axios.post(addOrUpdateStudentService(), body);

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
  setClassroom(classroom) {
    this.setState({ classroomId: classroom.classroomId });
  }
  setDate(date) {
    var totalAge = 0;

    if (!this.props.selectedStudent.dateOfBirth) {
      totalAge = !date
        ? ""
        : (
            new Date(new Date() - new Date(date)).getFullYear() - 1970
          ).toString();
      this.setState({ calanderDate: date, age: totalAge });
    } else {
      var dob = new Date(date);
      totalAge = new Date(new Date() - new Date(dob)).getFullYear() - 1970;
      this.setState({
        calanderDate:
          dob.getFullYear() +
          "-" +
          (dob.getMonth() < 10
            ? "0" + (dob.getMonth() + 1)
            : dob.getMonth() + 1) +
          "-" +
          (dob.getDate() < 10 ? "0" + dob.getDate() : dob.getDate()),
        age: totalAge.toString(),
      });
    }
  }
  setSelectedStudentClassroom() {
    var studentClassroom = this.state.classrooms.find(
      (x) => x.classroomName === this.props.selectedStudent.classroom
    );

    this.setState({ classroomId: studentClassroom.classroomId });
  }
  getClassrooms = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(getAllClassroomsService());

      this.setState({ loading: false, classrooms: res.data });
      if (this.props.selectedStudent.classroom) {
        var clss = res.data.find(
          (x) => x.classroomName === this.props.selectedStudent.classroom
        );

        this.setState({ classroomId: clss.classroomId });
      }
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };
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
          <Card.Header>Student Registration Form</Card.Header>
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
                      label="Contact Person"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Jane Doe"
                        value={this.state.contactPerson}
                        onChange={(e) =>
                          this.setFieldValue(
                            "contactPerson",
                            e.currentTarget.value
                          )
                        }
                        required
                      />
                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter contact person name.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md>
                    <FloatingLabel
                      controlId="floatingInputGrid"
                      label="Contact Number"
                    >
                      <Form.Control
                        type="mobile"
                        placeholder="0776952098"
                        value={this.state.contactMobile}
                        onChange={(e) =>
                          this.setFieldValue(
                            "contactMobile",
                            e.currentTarget.value
                          )
                        }
                        required
                      />
                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter contact number
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className="g-2 mb-2">
                  <Col md>
                    <FloatingLabel
                      controlId="floatingInputGrid"
                      label="Email address"
                    >
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={this.state.contactEmail}
                        onChange={(e) =>
                          this.setFieldValue(
                            "contactEmail",
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
                  <Col md>
                    <FloatingLabel
                      controlId="floatingSelectGrid"
                      label="Classrooms"
                    >
                      <Form.Select
                        aria-label="Floating label select example"
                        required
                      >
                        {!this.props.selectedStudent.studentFirstName && (
                          <option value="">Select a Classroom</option>
                        )}
                        {this.props.selectedStudent.studentFirstName && (
                          <option value={this.state.classroomId}>
                            {this.props.selectedStudent.classroom}
                          </option>
                        )}

                        {this.state.classrooms.map((classroom, index) => (
                          <option key={index} value={classroom.classroomId}>
                            {classroom.classroomName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter class room.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className="g-2 mb-2">
                  <Col md>
                    <FloatingLabel
                      controlId="floatingInputGrid"
                      label="Date of Birth"
                    >
                      <Form.Control
                        type="date"
                        name="dob"
                        placeholder="Date of Birth"
                        value={this.state.calanderDate}
                        onChange={(e) =>
                          this.setFieldValue("dob", e.currentTarget.value)
                        }
                        required
                      />
                      <Form.Control.Feedback></Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        Please enter date of birth.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md>
                    <FloatingLabel controlId="floatingInputGrid" label="Age">
                      <Form.Control
                        type="text"
                        disabled
                        value={this.state.age}
                      />
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

export default CreateStudent;
