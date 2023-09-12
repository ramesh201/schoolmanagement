import { Component } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export class ModalComponent extends Component {
  // handleClose(isShow) {
  //   if (isShow) this.setState({ deleteModelShow: true });
  //   else this.setState({ deleteModelShow: false });
  // }

  // handleInactive = async () => {
  //   try {
  //     this.setState({ loading: true });

  //     const response = await axios.delete(
  //       inactiveClassroomService() + this.props.selectedId
  //     );

  //     this.setState({
  //       loading: false,
  //       success: response.data > 0 ? true : false,
  //       toastVariant: response.data > 0 ? "success" : "danger",
  //       toastHeader: response.data > 0 ? "Success" : "Error",
  //       toastMessage: response.data > 0 ? "Action Done" : "Action Failed",
  //       toastShow: true,
  //       deleteModelShow: false,
  //     });
  //     this.getClassrooms();
  //   } catch (error) {
  //     console.log(error);
  //     this.setState({
  //       loading: false,
  //       success: true,
  //       toastVariant: "danger",
  //       toastHeader: "Error",
  //       toastMessage: "Action Failed",
  //       toastShow: true,
  //       deleteModelShow: false,
  //     });

  //     alert("error");
  //   }

  //   setTimeout(() => {
  //     this.setState({ toastShow: false });
  //   }, 4000);
  // };

  render() {
    return (
      <>
        <h1>Hello</h1>
        {/* <Modal show={this.props.deleteModelShow}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you really want to inactive this {this.props.moduleType}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose(false)}>
              No
            </Button>
            <Button variant="primary" onClick={() => this.handleInactive()}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal> */}
      </>
    );
  }
}

export default ModalComponent;
