import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function EditStudentModal({ student, getStudentList, classId1 }) {
  const {
    sid,
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
  const handleShow = () => {
    setShow(true);
  };
  const [newName, setNewName] = useState(name);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  const [newEmail, setNewEmail] = useState(email);
  const [newAddress, setNewAddress] = useState(address);
  const updateStudent = async (sid) => {
    const body = { sid, newName, newPhoneNumber, newEmail, newAddress };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/edit-student`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.Token,
          },
          body: JSON.stringify(body),
        }
      );
      const res = await response.json();
      if (res) {
        alert("The Student Was Edited");
        getStudentList();
      } else {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };

  return (
    <>
      <Button className="btn-danger" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Student's Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mx-2">
            <h6 className="text-danger">Fields Marked in Red Can Be Changed</h6>
          </div>
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
              <div className="form-outline mb-1 text-danger">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                  }}
                />
              </div>
              <div className="form-outline mb-1 text-danger">
                <label>Email</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                  }}
                />
              </div>
              <div className="form-outline mb-1 text-danger">
                <label>Ph No.</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={newPhoneNumber}
                  onChange={(e) => {
                    setNewPhoneNumber(e.target.value);
                  }}
                />
              </div>
              <div className="form-outline mb-1 text-danger">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={newAddress}
                  onChange={(e) => {
                    setNewAddress(e.target.value);
                  }}
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
          <div></div>
          <Button
            className="btn-danger mx-2"
            onClick={() => {
              updateStudent(sid);
            }}
          >
            Update
          </Button>

          <Button className="btn-warning" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditStudentModal;
