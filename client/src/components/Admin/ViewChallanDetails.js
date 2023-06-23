import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ViewChallanDetails({ challan }) {
  const { challanNo, amount, session, dateOfChallan, description } = challan;
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
          <Modal.Title> Challan's Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group modal-body">
            <div>
              <div className="form-outline mb-1">
                <label>Date Of Challan</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={dateOfChallan.slice(0, 10)}
                />
              </div>
              <div className="form-outline mb-1">
                <label>Session</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={session}
                />
                <div className="form-outline mb-1">
                  <label>Amount</label>
                  <input
                    disabled
                    type="number"
                    className="form-control bg-light"
                    autoComplete="off"
                    value={amount}
                  />
                </div>
                <div className="form-outline mb-1">
                  <label>Description</label>
                  <textarea
                    disabled
                    className="form-control bg-light"
                    id="exampleFormControlTextarea1"
                    rows="5"
                    value={description}
                  ></textarea>
                </div>
                <div className="form-outline mb-1">
                  <label>Challan No.</label>
                  <input
                    disabled
                    type="text"
                    className="form-control bg-light"
                    autoComplete="off"
                    value={challanNo}
                  />
                </div>
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

export default ViewChallanDetails;
