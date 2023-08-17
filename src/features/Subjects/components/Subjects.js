import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import CreateSubject from "./CreateSubject.js";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { MdModeEdit, MdClear } from "react-icons/md";
import Toast from "react-bootstrap/Toast";
import TeacherSubject from "./TeacherSubject";
import getAllSubjectsService from "../api/getSubjectsService.js";
import inactiveSubjectService from "../api/inactiveSubjectService.js";

export class Subjects extends Component {
  state = {
    loading: false,
    studentList: [],
    searchText: "",
    variant: "primary",
    listOfSubjects: [],
    listofHeaders: ["Subject Name", "Actions"],
    tabKey: 1,
    deleteModelShow: false,
    selectedSubject: {},
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

  editStudent(val) {
    this.setState({ selectedSubject: val });
    this.getSelectedTabId(2);
  }

  inactiveStudent(val) {
    this.setState({ selectedSubject: val, deleteModelShow: true });
  }

  componentDidMount() {
    this.getSubjects();
    console.log(this.props);
  }

  getSubjects = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(getAllSubjectsService());

      var pgs = Math.round(res.data.length / 5);
      this.setState({
        loading: false,
        listOfSubjects: res.data,
        totalPages: pgs + 1,
      });
    } catch (error) {
      console.log(error);
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
    var formBody = {
      subjectId: this.state.selectedSubject.subjectId,
    };

    try {
      this.setState({ loading: true });

      const response = await axios.delete(
        inactiveSubjectService() + this.state.selectedSubject.subjectId
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
      this.getSubjects();
    } catch (error) {
      console.log(error);
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

        {this.state.listOfSubjects.length > 0 && (
          <>
            <Tabs
              defaultActiveKey="1"
              activeKey={this.state.tabKey}
              onSelect={(key) => this.getSelectedTabId(key)}
              id="controlled-tab-example"
            >
              <Tab eventKey={1} title="Subject Page">
                <div className="mx-4">
                  <div className="mb-2">
                    <Button
                      variant="primary"
                      disabled={this.state.loading}
                      onClick={() => this.getSubjects()}
                    >
                      {this.state.loading ? "Loading…" : "Load Subjects"}
                    </Button>
                  </div>
                  <form>
                    <fieldset>
                      <legend>Subject List:</legend>
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
                          {this.state.listOfSubjects
                            .slice(
                              this.state.paginationStart,
                              this.state.paginationStop
                            )
                            .map((student, index) => (
                              <tr key={index}>
                                <td>{student.subjectName} </td>

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
                                      subject?
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
              <Tab eventKey={2} title="Add/Edit Subject">
                {this.state.tabKey == 2 && (
                  <CreateSubject
                    parentToChild={this.state}
                    childProps={this.childToParent}
                    selectedSubject={this.state.selectedSubject}
                  />
                )}
              </Tab>
              <Tab eventKey={3} title="Teacher's Subject">
                {this.state.tabKey == 3 && <TeacherSubject />}
              </Tab>
            </Tabs>
          </>
        )}
      </>
    );
  }
}

export default Subjects;
