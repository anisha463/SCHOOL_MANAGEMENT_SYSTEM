import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ViewStudentsDetails({ student, classId1 }) {
  const {
    name,
    email,
    phoneNumber,
    imageURL,
    address,
    fatherName,
    motherName,
  } = student;
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
          <Modal.Title> Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group modal-body">
            <div className="text-center justify-content-center mb-2">
              <img
                className="rounded-circle"
                src={imageURL}
                alt="Student's Pic"
                height="200"
              />
            </div>
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
                <label>Email</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={email}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Ph No.</label>
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
                <label>Address</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={address}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Studies In</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={`Class ${classId1}`}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Father's Name</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={fatherName}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Mother's Name</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={motherName}
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

export default ViewStudentsDetails;
