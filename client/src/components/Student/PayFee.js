import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function PayFee({ challan }) {
  const { amount } = challan;
  const [cardNo, setCardNo] = useState(null);
  const [cvv, setCvv] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handlePay = () => {
    alert("Fees Paid");
    window.location.reload();
  };

  return (
    <>
      <Button className="btn-primary" onClick={handleShow}>
        Pay
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Paying Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group modal-body">
            <div>
              <div className="form-outline mb-1">
                <label>Amount</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={amount}
                />
              </div>
              <div className="form-outline mb-1">
                <label>PayMent Date</label>
                <input
                  disabled
                  type="text"
                  className="form-control bg-light"
                  autoComplete="off"
                  value={new Date()}
                />
                <div className="form-outline mb-1">
                  <label>Please Enter the Card No.</label>
                  <input
                    required
                    type="number"
                    className="form-control bg-light"
                    autoComplete="off"
                    value={cardNo}
                    onChange={(e) => setCardNo(e.target.value)}
                  />
                </div>

                <div className="form-outline mb-1">
                  <label>Please Enter The Cvv</label>
                  <input
                    required
                    type="number"
                    className="form-control bg-light"
                    autoComplete="off"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-Primary my-2" onClick={handlePay}>
            Pay
          </Button>
          <Button className="btn-warning my-2" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PayFee;
