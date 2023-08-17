import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import CreateStudent from "./CreateStudent.js";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import dateFormat from "dateformat";
import { MdModeEdit, MdClear } from "react-icons/md";
import Toast from "react-bootstrap/Toast";
import StudentDetailsReport from "./StudentDetailsReport.js";
import getStudentsService from "../api/getStudentsService.js";
import inactiveStudentService from "../api/inactiveStudentService.js";

export class Students extends Component {
  state = {
    loading: false,
    studentList: [],
    searchText: "",
    variant: "primary",
    listOfStudents: [],
    listofHeaders: [
      "First Name",
      "Last Name",
      "Contact Person",
      "Contact Number",
      "Email Address",
      "Date Of Birth",
      "Age",
      "Class Room",
      "Actions",
    ],
    tabKey: 1,
    deleteModelShow: false,
    selectedStudent: {},
    paginationStart: 0,
    paginationStop: 5,
    totalPages: 0,
    toastShow: false,
  };

  getSelectedTabId(key) {
    if (!key) this.setState({ tabKey: 1 });
    else this.setState({ tabKey: key });
    return this.state.tabKey;
  }

  handleTablSelect(key) {
    this.setState({ tabKey: key });
  }

  editStudent(val) {
    this.setState({ selectedStudent: val });
    this.getSelectedTabId(2);
  }
  calculateAge(dob) {
    return new Date(new Date() - new Date(dob)).getFullYear() - 1970;
  }
  inactiveStudent(val) {
    this.setState({ selectedStudent: val, deleteModelShow: true });
  }

  componentDidMount() {
    this.getStudents();
  }

  getStudents = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(getStudentsService());
      var pgs = Math.round(res.data.length / 5);
      this.setState({
        loading: false,
        listOfStudents: res.data,
        totalPages: pgs + 1,
      });
    } catch (error) {
      this.setState({ loading: false });

      alert("error");
    }
  };

  loadPaginationData(pageNumber) {
    var startCount = pageNumber * 5 - 5;
    this.setState({
      paginationStart: startCount,
      paginationStop: startCount + 5,
    });
  }
  handleClose(isShow) {
    if (isShow) this.setState({ deleteModelShow: true });
    else this.setState({ deleteModelShow: false });
  }
  handleInactive = async () => {
    try {
      this.setState({ loading: true });

      const response = await axios.delete(
        inactiveStudentService() + this.state.selectedStudent.studentId
      );

      this.setState({
        loading: false,
        success: response.data > 0 ? true : false,
        toastVariant: response.data > 0 ? "success" : "danger",
        toastHeader: response.data > 0 ? "Success" : "Error",
        toastMessage: response.data > 0 ? "Action Done" : "Action Failed",
        toastShow: true,
        deleteModelShow: false,
      });
      this.getStudents(true);
    } catch (error) {
      this.setState({
        loading: false,
        success: true,
        toastVariant: "danger",
        toastHeader: "Error",
        toastMessage: "Action Failed",
        toastShow: true,
        deleteModelShow: false,
      });

      alert("error");
    }

    setTimeout(() => {
      this.setState({ toastShow: false });
    }, 4000);
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

        {this.state.toastShow && (
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
        )}

        {this.state.listOfStudents.length > 0 && (
          <>
            <Tabs
              defaultActiveKey="1"
              activeKey={this.state.tabKey}
              onSelect={(key) => this.getSelectedTabId(key)}
              id="controlled-tab-example"
            >
              <Tab eventKey={1} title="Student List Page">
                <div className="mx-4">
                  <div className="mb-2">
                    <Button
                      variant="primary"
                      disabled={this.state.loading}
                      onClick={() => this.getStudents(true)}
                    >
                      {this.state.loading ? "Loading…" : "Load Students"}
                    </Button>
                  </div>
                  <form>
                    <fieldset>
                      <legend>Student List:</legend>
                      <Table striped bordered hover variant="secondary">
                        <thead>
                          <tr>
                            {this.state.listofHeaders.map(
                              (tblHeader, index) => (
                                <th>{tblHeader}</th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.listOfStudents
                            .slice(
                              this.state.paginationStart,
                              this.state.paginationStop
                            )
                            .map((student, index) => (
                              <tr key={index}>
                                <td>{student.studentFirstName} </td>
                                <td>{student.studentLastName} </td>
                                <td>{student.contactPersonName} </td>
                                <td>{student.contactPersonContactNo} </td>
                                <td>{student.contactPersonEmail}</td>
                                <td>
                                  {dateFormat(
                                    student.dateOfBirth,
                                    "yyyy/mm/dd"
                                  )}
                                </td>
                                <td>
                                  {this.calculateAge(student.dateOfBirth)}{" "}
                                </td>
                                <td>{student.classroom} </td>
                                <td>
                                  <Button
                                    variant="warning"
                                    onClick={(evt) => {
                                      evt.preventDefault();
                                      evt.stopPropagation();
                                      this.editStudent(student);
                                    }}
                                  >
                                    <MdModeEdit />
                                  </Button>{" "}
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      this.inactiveStudent(student)
                                    }
                                  >
                                    <MdClear />
                                  </Button>{" "}
                                </td>
                                {this.state.deleteModelShow && (
                                  <Modal show={this.state.deleteModelShow}>
                                    <Modal.Header closeButton>
                                      <Modal.Title>Confirmation</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      Do you really want to inactive this
                                      student?
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
                        <Pagination variant="primary" count={1} color="primary">
                          <Pagination.First />
                          <Pagination.Prev />
                          {Array.from(Array(this.state.totalPages)).map(
                            (_, index) => (
                              <Pagination.Item
                                onClick={() =>
                                  this.loadPaginationData(index + 1)
                                }
                              >
                                {index + 1}
                              </Pagination.Item>
                            )
                          )}

                          <Pagination.Next />
                          <Pagination.Last />
                        </Pagination>
                      </Table>
                    </fieldset>
                  </form>
                </div>
              </Tab>
              <Tab eventKey={2} title="Add New Student">
                {this.state.tabKey == 2 && (
                  <CreateStudent
                    parentToChild={this.state}
                    selectedStudent={this.state.selectedStudent}
                  />
                )}
              </Tab>
              <Tab eventKey={3} title="Student Detail Report">
                {this.state.tabKey == 3 && (
                  <StudentDetailsReport
                    studentList={this.state.listOfStudents}
                  />
                )}
              </Tab>
            </Tabs>
          </>
        )}
      </>
    );
  }
}

export default Students;
