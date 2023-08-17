import { Component } from "react";
import { Table } from "react-bootstrap";

export class DetailTable extends Component {
  state = {
    deleteModelShow: false,
  };

  inactiveStudent(record) {}

  handleClose() {
    document.location.reload();
  }
  render() {
    return (
      <>
        <div className="mx-4">
          <Table striped bordered hover variant="secondary">
            <thead>
              <tr>
                {this.props.tableHeaders.map((tblHeader, index) => (
                  <th>{tblHeader}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.props.tableRecords.length > 0 &&
                this.props.tableRecords.map((record, index) => (
                  <tr key={index}>
                    {record.subjectName && <td>{record.subjectName} </td>}
                    {record.teacherName && <td>{record.teacherName} </td>}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </>
    );
  }
}

export default DetailTable;
