import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
function EditTeacherModal({ teacher, getTeachersList }) {
  const { name, email, phoneNumber, subjectName, imageURL, tid, address } =
    teacher;
  const [show, setShow] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newAddress, setNewAddress] = useState(address);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  const [teachesIn, setTeachesIn] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const updateTeacher = async (tid) => {
    const body = { tid, newName, newEmail, newPhoneNumber, newAddress };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/edit-teacher`,
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
        alert("The Teacher Was Edited");
        getTeachersList();
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

  const getTeachesIn = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/teaches-in`,
        {
          method: "GET",
          headers: { token: localStorage.Token, tid: tid },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setTeachesIn([...gotList.List]);
        setTimeout(() => {}, 1000);
      } else {
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
    }
  };

  useEffect(() => {
    getTeachesIn();
  }, []);
  return (
    <>
      <Button className="btn-danger" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Teacher's Details</Modal.Title>
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
                alt="Teacher's Pic"
                height="200"
              />
            </div>
            <div>
              <div className="form-outline text-danger mb-1">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="form-outline text-danger mb-1">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="form-outline text-danger mb-1">
                <label>Ph No.</label>
                <input
                  type="number"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                />
              </div>
              <div className="form-outline text-danger mb-1">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Subject</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={subjectName}
                />
              </div>
              <div className="form-outline mx-2-1">
                <label>Teaches In</label>
                {teachesIn.map((teaches) => {
                  return (
                    <h6 className="text-warning fs-6">Class {teaches.class}</h6>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div></div>
          <Button
            className="btn-danger mx-2"
            onClick={() => {
              updateTeacher(tid);
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
export default EditTeacherModal;
