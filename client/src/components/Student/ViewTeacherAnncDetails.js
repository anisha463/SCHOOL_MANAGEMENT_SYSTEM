import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ViewTeacherAnncDetails({ annc }) {
  const {
    dateOfAnnouncement,
    topic,
    announcementId,
    name,
    subjectName,
    content,
  } = annc;
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
          <Modal.Title> Announcement's Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group modal-body">
            <div>
              <div className="form-outline mb-1">
                <label>Topic</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={topic}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Date of Announcement</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={dateOfAnnouncement.slice(0, 10)}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Content</label>
                <textarea
                  disabled
                  className="form-control bg-light"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  value={content}
                ></textarea>
              </div>
              <div className="form-outline mb-1">
                <label>Subject Name</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={subjectName}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Teacher Name</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={name}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Announcement Id</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={announcementId}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-warning my-2" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewTeacherAnncDetails;
