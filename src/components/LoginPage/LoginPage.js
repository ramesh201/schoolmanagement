import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { getCookieHandler, setCookieHandler } from "../../hooks/cookieHandler";

export class LoginPage extends Component {
  state = {
    loading: false,
    validated: false,
    loggedin: false,
    modalShow: false,
  };

  validateLoginPage = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      if (form[0].value == "admin@log.in" && form[1].value == "123") {
        this.setState({ loggedin: true, modalShow: true });
      } else {
        this.setState({ modalShow: true });
      }
    }

    setTimeout(() => {
      this.setState({ modalShow: false });
      var loginCookie = getCookieHandler("loggedin");

      if (loginCookie != "") {
        if (loginCookie == "true") {
          this.props.history.push(`/main`);
          document.location.reload();
        }
      } else {
        if (this.state.loggedin) {
          setCookieHandler("loggedin", this.state.loggedin, 1);
          this.props.history.push(`/main`);
          document.location.reload();
        }
      }
    }, 2000);
  };
  componentDidMount() {
    var loginCookie = getCookieHandler("loggedin");

    if (loginCookie != "") {
      if (loginCookie == "true") {
        this.props.history.push(`/main`);
        document.location.reload();
      }
    }
  }

  render() {
    return (
      <>
        <Modal
          size="sm"
          show={this.state.modalShow}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Body>
            {this.state.loggedin && "Successfully logged in"}
            {!this.state.loggedin && "Logged in failed"}
          </Modal.Body>
        </Modal>
        <div>
          <div className="mx-4 d-flex justify-content-center">
            <Card className="bg-light">
              <Card.Header>Login</Card.Header>
              <Card.Body className="bg-info">
                <Form
                  onSubmit={(evt) => {
                    this.validateLoginPage(evt);
                  }}
                >
                  <FloatingLabel controlId="floatingInputGrid" label="Email">
                    <Form.Control
                      name="email"
                      type="email"
                      defaultValue={"admin@log.in"}
                      required
                    />
                    <Form.Control.Feedback></Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please enter email address.
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <br />
                  <FloatingLabel controlId="floatingInputGrid" label="Password">
                    <Form.Control
                      name="password"
                      type="password"
                      defaultValue={"123"}
                      required
                    />
                    <Form.Control.Feedback></Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      Please enter password.
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <br />

                  <div class="d-flex bd-highlight mb-3 mx-4">
                    <Button
                      type="submit"
                      className="mx-4 h-100 d-flex justify-content-center"
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </>
    );
  }
}

export default LoginPage;
