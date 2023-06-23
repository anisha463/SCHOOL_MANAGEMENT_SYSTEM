import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ViewAnncDetailsToTeacher({ annc }) {
  const { announcementId, topic, content, dateOfAnnouncement } = annc;
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
          <Modal.Title> Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group modal-body">
            <div>
              <div className="form-outline mb-1">
                <label>Announcement Topic</label>
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
                <label>Announcement Content</label>
                <textarea
                  disabled
                  className="form-control bg-light"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  value={content}
                ></textarea>
              </div>
              <div className="form-outline mb-1">
                <label>Date Of Announcement </label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={dateOfAnnouncement.slice(0, 10)}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Announcement Id</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  value={announcementId}
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

export default ViewAnncDetailsToTeacher;
