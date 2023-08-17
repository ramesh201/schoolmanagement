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
import getAllSubjectsService from "../api/getSubjectsService";
import Modal from "react-bootstrap/Modal";
import getTeacherSubjectsService from "../api/getTeacherSubjectsService";
import allocateTeacherSubjectService from "../api/allocateTeacherSubjectService";
import inactiveTeacherSubjectService from "../api/inactiveTeacherSubjectService";

export class TeacherSubject extends Component {
  state = {
    loading: false,
    listOfTeachers: [],
    searchText: "",
    variant: "primary",
    listOfSubjects: [],
    listofHeaders: ["Subject Name", "Actions"],
    listOfTeacherSubjects: [],
    tabKey: 1,
    deleteModelShow: false,
    selectedTeacher: {},
    selectedSubject: {},
    selectedTeacherSubject: {},
    selectedTeacherId: 0,
    selectedSubjectId: 0,
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
      console.log(error);
      this.setState({ loading: false });

      alert("error");
    }
  };

  getSubjects = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(getAllSubjectsService());

      this.setState({
        loading: false,
        listOfSubjects: res.data,
      });
    } catch (error) {
      console.log(error);
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

  // allocateTeacherSubject(record) {}
  componentDidMount() {
    this.getTeachers();
    this.getSubjects();
  }
  getTeacherSubject = async (teacherIdParam) => {
    const res = await axios.get(getTeacherSubjectsService(teacherIdParam));

    this.setState({
      listOfTeacherSubjects: res.data,
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
    this.getTeacherSubject(teacherIdParam);
  };
  handleSubjectSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      validatedSubject: true,
    });

    var subjectIdParam = form[0].value === "" ? 0 : parseInt(form[0].value);

    if (subjectIdParam !== 0 && this.state.selectedTeacherId !== 0) {
      var formBody = {
        allocateSubjectId: -1,
        ClassroomId: -1,
        teacherId: this.state.selectedTeacherId,
        TeacherName: "",
        subjectId: subjectIdParam,
        subjectName: "",
      };
      this.setState({ selectedSubjectId: subjectIdParam });
      this.addTeacherSubject(formBody);

      setTimeout(() => {
        this.getTeacherSubject(this.state.selectedTeacherId);
        this.setState({ toastShow: false });
      }, 3000);
    }
  };

  addTeacherSubject = async (body) => {
    try {
      this.setState({ loading: true });

      const res = await axios.post(allocateTeacherSubjectService(), body);

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
        inactiveTeacherSubjectService() +
          this.state.selectedTeacherSubject.allocateSubjectId
      );

      this.setState({
        loading: false,
        success: response.data > 0 ? true : false,
        toastVariant: response.data > 0 ? "success" : "danger",
        toastHeader: response.data > 0 ? "Success" : "Error",
        toastMessage: response.data > 0 ? "Action Done" : "Action Failed",
        toastShow: true,
      });
      this.getTeacherSubject(this.state.selectedTeacherId);
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
    }, 5000);
  };

  inactive(record) {
    this.setState({ selectedTeacherSubject: record, deleteModelShow: true });
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
          <Card.Header>Allocated Subjects</Card.Header>
          <Card.Body>
            <Form
              noValidate
              validated={this.state.validatedSubject}
              onSubmit={(evt) => {
                this.handleSubjectSubmit(evt);
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
                      <option value="">Select a Subject</option>

                      {this.state.listOfSubjects.map((subject, index) => (
                        <option key={index} value={subject.subjectId}>
                          {subject.subjectName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback></Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please select a subject
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
                    {this.state.listOfTeacherSubjects.map((record, index) => (
                      <tr key={index}>
                        <td>{record.subjectName} </td>

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

export default TeacherSubject;
