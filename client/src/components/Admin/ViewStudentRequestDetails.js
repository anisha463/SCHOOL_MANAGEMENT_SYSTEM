import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ViewStudentRequestDetails({ request }) {
  const {
    requestId,
    topic,
    content,
    dateOfRequest,
    name,
    phoneNumber,
    classId,
  } = request;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className="btn-warning" onClick={handleShow}>
        View Details
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group modal-body">
            <div>
              <div className="form-outline mb-1">
                <label>Full Name</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={name}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Parent's Ph No.</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={phoneNumber}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Class</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={`${classId}`}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Request Topic</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={topic}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Request Content</label>
                <textarea
                  disabled
                  className="form-control bg-light"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  value={content}
                ></textarea>
              </div>
              <div className="form-outline mb-1">
                <label>Date Of Request </label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={dateOfRequest.slice(0, 10)}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Request Id</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={requestId}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-warning" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewStudentRequestDetails;
