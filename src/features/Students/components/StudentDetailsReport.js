import { Component } from "react";
import DetailTable from "../../../shared/DetailTable";
import axios from "axios";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import CommonFormControl from "../../../shared/CommonFormControl";
import dateFormat from "dateformat";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getStudentDetailsService } from "../api/getStudentDetailsService";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { MdPrint } from "react-icons/md";

export class StudentDetailsReport extends Component {
  state = {
    tableHeaders: ["Subject", "Teacher"],
    tableRecords: [],
    students: [],
    studentId: "",
    studentDetails: {},
    isPrinting: false,
  };

  getStudentDetails = async (studentId) => {
    try {
      const res = await axios.get(getStudentDetailsService(studentId));

      this.setState({
        tableRecords: res.data.teacherSubjects,
        studentId: studentId,
        studentDetails: res.data.studentDetails,
      });
    } catch (error) {
      console.log(error);

      alert("error");
    }
  };
  printDetaiLReprt() {
    this.setState({ isPrinting: true });

    html2canvas(document.querySelector("#studentdetails")).then((canvas) => {
      canvas.hidden = true;
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        window.innerWidth / 7,
        window.innerHeight / 10
      );
      pdf.save(
        this.state.studentDetails.studentFirstName +
          " " +
          this.state.studentDetails.studentLastName +
          "'s" +
          "_Detail Report.pdf"
      );
    });
  }
  selectStudent(student) {
    this.getStudentDetails(student);
  }
  componentDidMount() {
    this.setState({ students: this.props.studentList });
  }

  render() {
    return (
      <>
        <div class="d-flex bd-highlight mb-3 mx-4">
          <Button
            onClick={() => this.printDetaiLReprt()}
            className="ms-auto bd-highlight"
          >
            <MdPrint className="mx-2" />
            Print
          </Button>
        </div>
        <div id="studentdetails">
          <div className="text-center">
            <h2>
              {this.state.studentDetails.studentFirstName
                ? this.state.studentDetails.studentFirstName +
                  " " +
                  this.state.studentDetails.studentLastName +
                  "'s"
                : ""}{" "}
              Detail Report
            </h2>
          </div>
          <div>
            <Card className="mx-4">
              <Card.Header>Student Details</Card.Header>
              <Card.Body>
                <div className="mx-4 ">
                  <Row className="g-2 mb-2">
                    <Col md>
                      <FloatingLabel
                        controlId="floatingSelectGrid"
                        label="Student"
                      >
                        <Form.Select
                          aria-label="Floating label select example"
                          value={this.state.studentId}
                          onChange={(e) => {
                            console.log("e.target.value", e.target.value);
                            this.selectStudent(e.target.value);
                          }}
                          required
                        >
                          <option value="">Select Student</option>

                          {this.state.students.map((student, index) => (
                            <option key={index} value={student.studentId}>
                              {student.studentFirstName +
                                " " +
                                student.studentLastName}
                            </option>
                          ))}
                        </Form.Select>
                      </FloatingLabel>
                    </Col>
                    <Col md>
                      <CommonFormControl
                        controlId="floatingInputGrid"
                        label="Classroom"
                        type="text"
                        placeholder="Class -----"
                        value={this.state.studentDetails.classroomName}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row className="g-2 mb-2">
                    <Col md>
                      <CommonFormControl
                        controlId="floatingInputGrid"
                        label="Contact Person"
                        type="text"
                        placeholder="John Doe"
                        value={this.state.studentDetails.contactPersonName}
                        disabled={true}
                      />
                    </Col>
                    <Col md>
                      <CommonFormControl
                        controlId="floatingInputGrid"
                        label="EmailAddress"
                        type="email"
                        placeholder="name@example.com"
                        value={this.state.studentDetails.contactPersonEmail}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row className="g-2 mb-2">
                    <Col md>
                      <CommonFormControl
                        controlId="floatingInputGrid"
                        label="Contact No."
                        type="text"
                        placeholder="07xxxxxxxxx"
                        value={this.state.studentDetails.contactPersonMobile}
                        disabled={true}
                      />
                    </Col>
                    <Col md>
                      <CommonFormControl
                        controlId="floatingInputGrid"
                        label="Date of Birth"
                        type="text"
                        placeholder="Birth day here"
                        value={
                          !this.state.studentDetails.dateOfBirth
                            ? ""
                            : dateFormat(
                                this.state.studentDetails.dateOfBirth,
                                "yyyy-mm-dd"
                              )
                        }
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
            <Card className="mx-4">
              <Card.Header>Teacher & Subject Details</Card.Header>
              <Card.Body>
                {this.state.tableRecords.length > 0 && (
                  <DetailTable
                    tableHeaders={this.state.tableHeaders}
                    tableRecords={this.state.tableRecords}
                  />
                )}
              </Card.Body>
            </Card>
            <br />
          </div>
        </div>
      </>
    );
  }
}

export default StudentDetailsReport;
