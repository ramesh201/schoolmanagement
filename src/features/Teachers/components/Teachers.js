import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import CreateTeacher from "./CreateTeacher.js";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { MdModeEdit, MdClear } from "react-icons/md";
import Toast from "react-bootstrap/Toast";
import { getAllTeachersService } from "../api/getTeachersService";
import inactiveTeachersService from "../api/inactiveTeachersService.js";

export class Teachers extends Component {
  state = {
    loading: false,
    studentList: [],
    searchText: "",
    variant: "primary",
    listOfTeachers: [],
    listofHeaders: [
      "First Name",
      "Last Name",
      "Contact Number",
      "Email Address",
      "Actions",
    ],
    tabKey: 1,
    deleteModelShow: false,
    selectedTeacher: {},
    paginationStart: 0,
    paginationStop: 5,
    totalPages: 0,
    toastShow: false,
    toastMessage: "",
  };

  getSelectedTabId(key) {
    if (!key) this.setState({ tabKey: 1 });
    else this.setState({ tabKey: key });
    return this.state.tabKey;
  }

  editTeacher(val) {
    this.setState({ selectedTeacher: val });
    this.getSelectedTabId(2);
  }

  inactiveTeacher(val) {
    this.setState({ selectedTeacher: val, deleteModelShow: true });
  }

  componentDidMount() {
    this.getTeachers();
  }

  getTeachers = async () => {
    try {
      this.setState({ loading: true });
      const res = await axios.get(getAllTeachersService());

      var pgs = Math.round(res.data.length / 5);
      this.setState({
        loading: false,
        listOfTeachers: res.data,
        totalPages: pgs + 1,
      });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      alert("error");
    }
    this.setState({ selectedTeacher: {} });
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
        inactiveTeachersService() + this.state.selectedTeacher.teacherId
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
      this.getTeachers();
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

        {this.state.listOfTeachers.length > 0 && (
          <>
            <Tabs
              defaultActiveKey="1"
              activeKey={this.state.tabKey}
              onSelect={(key) => this.getSelectedTabId(key)}
              id="controlled-tab-example"
            >
              <Tab eventKey={1} title="Techers List Page">
                <div className="mx-4">
                  <div className="mb-2">
                    <Button
                      variant="primary"
                      disabled={this.state.loading}
                      onClick={() => this.getTeachers(true)}
                    >
                      {this.state.loading ? "Loading…" : "Load Teachers"}
                    </Button>
                  </div>
                  <form>
                    <fieldset>
                      <legend>Teacher List:</legend>
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
                          {this.state.listOfTeachers
                            .slice(
                              this.state.paginationStart,
                              this.state.paginationStop
                            )
                            .map((teacher, index) => (
                              <tr key={index}>
                                <td>{teacher.teacherFirstName} </td>
                                <td>{teacher.teacherLastName} </td>
                                <td>{teacher.teacherContatctNo} </td>
                                <td>{teacher.teacherEmail}</td>

                                <td>
                                  <Button
                                    variant="warning"
                                    onClick={(evt) => {
                                      evt.preventDefault();
                                      evt.stopPropagation();
                                      this.editTeacher(teacher);
                                    }}
                                  >
                                    <MdModeEdit />
                                  </Button>{" "}
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      this.inactiveTeacher(teacher)
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
                                      teacher?
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
              <Tab eventKey={2} title="Add New Teacher">
                {this.state.tabKey == 2 && (
                  <CreateTeacher
                    parentToChild={this.state}
                    selectedTeacher={this.state.selectedTeacher}
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

export default Teachers;
