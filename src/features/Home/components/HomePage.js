import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { deleteCookieHandler } from "../../../hooks/cookieHandler";

export class HomePage extends Component {
  state = {
    loading: false,
    listOfAreas: [
      { key: 1, schoolManageArea: "Student", bgClr: "secondary" },
      { key: 2, schoolManageArea: "Teacher", bgClr: "secondary" },
      { key: 3, schoolManageArea: "Subject", bgClr: "secondary" },
      { key: 4, schoolManageArea: "Classroom", bgClr: "secondary" },
    ],
  };

  goToPage = (val) => {
    switch (val.key) {
      case 1:
        this.props.history.push(`/students/`);
        break;
      case 2:
        this.props.history.push(`/teachers/`);
        break;
      case 3:
        this.props.history.push(`/subjects/`);
        break;
      case 4:
        this.props.history.push(`/classrooms/`);
        break;
      case 5:
        deleteCookieHandler();
        document.location.href = "/";
        break;
      default:
        this.props.history.push(`/`);
        break;
    }
    document.location.reload();
  };
  render() {
    return (
      <>
        <div className="mx-2">
          <Row xs={1} md={2} className="g-2">
            {this.state.listOfAreas.map((val, idx) => (
              <Col key={idx}>
                <Card
                  bg={val.bgClr}
                  text={val.bgClr == "light" ? "black" : "white"}
                  key={val.key}
                  onClick={() => this.goToPage(val)}
                >
                  <Card.Body>
                    <Card.Title className="bg-warning text-center">
                      {val.schoolManageArea}
                    </Card.Title>
                    <Card.Text>
                      This is the {val.schoolManageArea} management area.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </>
    );
  }
}

export default HomePage;
