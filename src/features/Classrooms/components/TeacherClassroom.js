import { Component } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import { Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import getAllTeachersService from "../../Teachers/api/getTeachersService";
import Modal from "react-bootstrap/Modal";
import getAllClassroomsService from "../api/getClassroomsService";
import getTeacherClassroomsService from "../api/getTeacherClassroomsService";
import allocateTeacherClassroomsService from "../api/allocateTeacherClassroomsService";
import inactiveTeacherClassroomService from "../api/inactiveTeacherClassroomService";

export class TeacherClassroom extends Component {
  state = {
    loading: false,
    listOfTeachers: [],
    searchText: "",
    variant: "primary",
    listOfClassrooms: [],
    listofHeaders: ["Subject Name", "Actions"],
    listOfTeacherClassrooms: [],
    tabKey: 1,
    deleteModelShow: false,
    selectedTeacher: {},
    selectedSubject: {},
    selectedTeacherClassroom: {},
    selectedTeacherId: 0,
    selectedClassroomId: 0,
    paginationStart: 0,
    paginationStop: 5,
    totalPages: 0,
    toastShow: false,
    validatedTeacher: false,
    validatedSubject: false,
    success: false,
    toastVariant: "",
  };

  getTeachers = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(getAllTeachersService());

      this.setState({
        loading: false,
        listOfTeachers: res.data,
      });
    } catch (error) {
      this.setState({ loading: false });
      alert("error");
    }
  };

  getClassrooms = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(getAllClassroomsService());

      this.setState({
        loading: false,
        listOfClassrooms: res.data,
      });
    } catch (error) {
      this.setState({ loading: false });

      alert("error");
    }
  };

  setTeacher(teacher) {
    this.setState({ selectedTeacher: teacher });
  }

  setSubject(subject) {
    this.setState({ selectedSubject: subject });
  }

  //allocateTeacherSubject(record) {}
  componentDidMount() {
    this.getTeachers();
    this.getClassrooms();
  }
  getTeacherClassrooms = async (teacherIdParam) => {
    const res = await axios.get(getTeacherClassroomsService(teacherIdParam));
    this.setState({
      listOfTeacherClassrooms: res.data,
      selectedTeacherId: teacherIdParam,
    });
  };

  handleTeacherSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      validatedTeacher: true,
    });

    var teacherIdParam = form[0].value === "" ? 0 : parseInt(form[0].value);
    this.setState({ selectedTeacherId: teacherIdParam });
    this.getTeacherClassrooms(teacherIdParam);
  };
  handleClassroomSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      validatedSubject: true,
    });

    var classroomIdParam = form[0].value === "" ? 0 : parseInt(form[0].value);

    if (classroomIdParam !== 0 && this.state.selectedTeacherId !== 0) {
      var formBody = {
        allocateCLassroomId: -1,
        ClassroomId: classroomIdParam,
        teacherId: this.state.selectedTeacherId,
        TeacherName: "",
        classroomName: "",
      };
      this.setState({ selectedClassroomId: classroomIdParam });
      this.addTeacherClassroom(formBody);

      setTimeout(() => {
        this.getTeacherClassrooms(this.state.selectedTeacherId);
        this.setState({ toastShow: false });
      }, 3000);
    }
  };

  addTeacherClassroom = async (body) => {
    try {
      this.setState({ loading: true });

      const res = await axios.post(allocateTeacherClassroomsService(), body);

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
  handleClose(record) {
    this.setState({ deleteModelShow: false });
  }

  handleInactive = async () => {
    this.setState({ deleteModelShow: false });

    try {
      this.setState({ loading: true });

      const response = await axios.delete(
        inactiveTeacherClassroomService() +
          this.state.selectedTeacherClassroom.allocateClassroomId
      );

      this.setState({
        loading: false,
        success: response.data > 0 ? true : false,
        toastVariant: response.data > 0 ? "success" : "danger",
        toastHeader: response.data > 0 ? "Success" : "Error",
        toastMessage: response.data > 0 ? "Action Done" : "Action Failed",
        toastShow: true,
      });
      this.getTeacherClassrooms(this.state.selectedTeacherId);
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

      alert("error");
    }

    setTimeout(() => {
      this.setState({ toastShow: false });
    }, 4000);
  };

  inactive(record) {
    this.setState({ selectedTeacherClassroom: record, deleteModelShow: true });
  }

  render() {
    return (
      <>
        {" "}
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
        }{" "}
        <Card className="mx-4">
          <Card.Header>Teachers Details</Card.Header>
          <Card.Body>
            <Form
              noValidate
              validated={this.state.validatedTeacher}
              onSubmit={(evt) => {
                this.handleTeacherSubmit(evt);
              }}
            >
              <Row className="g-2 mb-2">
                <Col md>
                  <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Teachers"
                  >
                    <Form.Select
                      aria-label="Floating label select example"
                      required
                    >
                      <option value="">Select a Teacher</option>

                      {this.state.listOfTeachers.map((teacher, index) => (
                        <option
                          key={index}
                          value={teacher.teacherId}
                          onChange={() => alert()}
                        >
                          {teacher.teacherFirstName +
                            " " +
                            teacher.teacherLastName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback></Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please select a teacher.
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md>
                  <Button type="submit" variant="primary">
                    Load Data
                  </Button>{" "}
                </Col>
              </Row>
              <br />
            </Form>
          </Card.Body>
        </Card>
        <Card className="mx-4">
          <Card.Header>Allocated Classrooms</Card.Header>
          <Card.Body>
            <Form
              noValidate
              validated={this.state.validatedSubject}
              onSubmit={(evt) => {
                this.handleClassroomSubmit(evt);
              }}
            >
              <Row className="g-2 mb-2">
                <Col md>
                  <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Subjects"
                  >
                    <Form.Select
                      aria-label="Floating label select example"
                      required
                    >
                      <option value="">Select a Classroom</option>

                      {this.state.listOfClassrooms.map((subject, index) => (
                        <option key={index} value={subject.classroomId}>
                          {subject.classroomName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback></Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please select a classroom
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md>
                  <Button
                    type="submit"
                    variant="primary"
                    // onClick={() =>
                    //   this.allocateTeacherSubject(this.state.selectedSubject)
                    // }
                  >
                    Allocate
                  </Button>{" "}
                </Col>
              </Row>
              <br />
              <div className="mx-4">
                <Table striped bordered hover variant="secondary">
                  <thead>
                    <tr>
                      {this.state.listofHeaders.map((tblHeader, index) => (
                        <th>{tblHeader}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listOfTeacherClassrooms.map((record, index) => (
                      <tr key={index}>
                        <td>{record.classroomName} </td>

                        <td>
                          <Button
                            variant="danger"
                            onClick={() => this.inactive(record)}
                          >
                            Deallocate
                          </Button>{" "}
                        </td>
                        {this.state.deleteModelShow && (
                          <Modal show={this.state.deleteModelShow}>
                            <Modal.Header closeButton>
                              <Modal.Title>Confirmation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Do you really want to inactive this?
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={() => this.handleClose(false)}
                              >
                                No
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() => this.handleInactive()}
                              >
                                Yes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default TeacherClassroom;
