import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ViewTeachersDetails({ teacher }) {
  const { name, email, phoneNumber, subjectName, imageURL, address, tid } =
    teacher;
  const [show, setShow] = useState(false);
  const [teachesIn, setTeachesIn] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
      <Button className="btn-warning" onClick={handleShow}>
        View Details
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Teacher's Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button className="btn-warning" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewTeachersDetails;

// import React, { useState } from "react";

// function ViewTeachersDetails({ teacher }) {
//   const { name, email, phoneNumber, subjectName, imageURL, tid } = teacher;
//   const [newStatus, setNewStatus] = useState(Boolean);
//   console.log("hi");
//   return (
//     <>
//       {/* <!-- Button to Open the Modal --> */}
//       <button
//         type="button"
//         className="btn btn-warning"
//         data-toggle="modal"
//         data-target={`#changestatus${tid}`}
//         onClick={() => setNewStatus(false)}
//       >
//         View Details
//       </button>

//       {/* <!-- The Modal --> */}
//       <div
//         className="text-dark fade modal"
//         id={`changestatus${tid}`}
//         onClick={() => setNewStatus(true)}
//       >
//         <div className="modal-dialog">
//           <div className="modal-content">
//             {/* <!-- Modal Header --> */}
//             <div className="text-dark modal-header ">
//               <h4 style={{ textAlign: "center" }} className="modal-title ">
//                 Teacher's Details
//               </h4>
//               <button
//                 type="button"
//                 className="close"
//                 data-dismiss="modal"
//                 onClick={() => setNewStatus(true)}
//               >
//                 &times;
//               </button>
//             </div>

//             {/* <!-- Modal body --> */}

//             {/* <!-- Modal footer --> */}
//             <div className="modal-footer">
//               <button
//                 onClick={() => setNewStatus(true)}
//                 type="button"
//                 className="btn btn-danger"
//                 data-dismiss="modal"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// export default ViewTeachersDetails;
