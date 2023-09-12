import { Component } from "react";
import Pagination from "react-bootstrap/Pagination";

export class Paging extends Component {
  loadPaginationData(pageNumber) {
    var startCount = pageNumber * 5 - 5;
    this.props.paginationHandleCallback({
      paginationStart: startCount,
      paginationStop: startCount + 5,
    });
  }

  render() {
    return (
      <>
        <Pagination variant="primary" count={1} color="primary">
          <Pagination.First />
          <Pagination.Prev />
          {Array.from(Array(this.props.totalPages)).map((_, index) => (
            <Pagination.Item onClick={() => this.loadPaginationData(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </>
    );
  }
}

export default Paging;
