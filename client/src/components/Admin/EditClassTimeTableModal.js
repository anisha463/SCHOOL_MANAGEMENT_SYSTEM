import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function EditClassTimeTableModal({ timeTable, getTimeTable }) {
  const {
    classId,
    day,
    period1,
    period2,
    period3,
    period4,
    period5,
    period6,
    period7,
  } = timeTable;
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setNewPeriod1(period1);
    setNewPeriod2(period2);
    setNewPeriod3(period3);
    setNewPeriod5(period5);
    setNewPeriod6(period6);
    setNewPeriod7(period7);
  };
  const handleShow = () => setShow(true);
  const [subjectsList, setSubjectsList] = useState([{}]);

  const [newPeriod1, setNewPeriod1] = useState(period1);
  const [newPeriod2, setNewPeriod2] = useState(period2);
  const [newPeriod3, setNewPeriod3] = useState(period3);
  const [newPeriod5, setNewPeriod5] = useState(period5);
  const [newPeriod6, setNewPeriod6] = useState(period6);
  const [newPeriod7, setNewPeriod7] = useState(period7);
  const updateTimeTable = async () => {
    const body = {
      classId,
      day,
      newPeriod1,
      newPeriod2,
      newPeriod3,
      period4,
      newPeriod5,
      newPeriod6,
      newPeriod7,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/edit-timetable`,
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
        alert("The Time Table Row Was Edited");
        getTimeTable();
      } else {
        alert(
          "Time table Not Updated, Some error has occured on the server side"
        );
      }
    } catch (error) {
      alert(`Error in catch Block, ${error.message}`);
    }
  };
  const getSubjectsList = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/studies-subjects`,
        {
          method: "GET",
          headers: { token: localStorage.Token, classId: classId },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setSubjectsList(gotList.List);
      } else {
        alert("Something Went Wrong");
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
    }
  };
  useEffect(() => {
    getSubjectsList();
  }, []);

  return (
    <>
      <Button className="btn-danger" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Time Table for {day} of Class {classId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="text-dark table table-bordered  text-center mb-5 ">
            <thead className="bg-dark text-light">
              <tr>
                <th>Day</th>
                <th>
                  Period 1 <br /> (8:00Am-8:45AM)
                </th>
                <th>
                  Period 2 <br /> (8:45Am-9:30AM)
                </th>
                <th>
                  Period 3 <br /> (9:30Am-10:15AM)
                </th>
                <th>
                  Period 4 <br /> (10:15Am-10:30AM)
                </th>
                <th>
                  Period 5 <br /> (10:30Am-11:15AM)
                </th>
                <th>
                  Period 6 <br /> (11:15Am-12:00PM)
                </th>
                <th>
                  Period 7 <br /> (12:00Pm-12:45PM)
                </th>
              </tr>
            </thead>
            <tbody style={{ height: "40px" }} className="pb-5 bg-light">
              <td className="bg-warning text-dark pt-3">{day.slice(0, 3)}</td>
              <td>
                <select
                  className="form-select bg-light"
                  aria-label="Default select example"
                  autoComplete="off"
                  value={newPeriod1}
                  onChange={(e) => setNewPeriod1(e.target.value)}
                >
                  <option selected>{newPeriod1}</option>
                  {subjectsList.map((subject) => (
                    <option key={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="form-select bg-light"
                  aria-label="Default select example"
                  autoComplete="off"
                  value={newPeriod2}
                  onChange={(e) => setNewPeriod2(e.target.value)}
                >
                  <option selected>{newPeriod2}</option>
                  {subjectsList.map((subject) => (
                    <option key={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="form-select bg-light"
                  aria-label="Default select example"
                  autoComplete="off"
                  value={newPeriod3}
                  onChange={(e) => setNewPeriod3(e.target.value)}
                >
                  <option selected>{newPeriod3}</option>
                  {subjectsList.map((subject) => (
                    <option key={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className="form-outline bg-light"
                  value={period4}
                  disabled
                />
                {/* <select
                  className="form-select bg-light"
                  aria-label="Default select example"
                  autoComplete="off"
                  disabled
                  value={period4}
                >
                  <option selected>{period4}</option>
                </select> */}
              </td>
              <td>
                <select
                  className="form-select bg-light"
                  aria-label="Default select example"
                  autoComplete="off"
                  value={newPeriod5}
                  onChange={(e) => setNewPeriod5(e.target.value)}
                >
                  <option selected>{newPeriod5}</option>
                  {subjectsList.map((subject) => (
                    <option key={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="form-select bg-light"
                  aria-label="Default select example"
                  autoComplete="off"
                  value={newPeriod6}
                  onChange={(e) => setNewPeriod6(e.target.value)}
                >
                  <option selected>{newPeriod6}</option>
                  {subjectsList.map((subject) => (
                    <option key={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="form-select bg-light"
                  aria-label="Default select example"
                  autoComplete="off"
                  onChange={(e) => setNewPeriod7(e.target.value)}
                >
                  <option selected>{period7}</option>
                  {subjectsList.map((subject) => (
                    <option key={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </td>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <div></div>
          <Button
            className="btn-danger mx-2"
            onClick={() => {
              updateTimeTable();
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

export default EditClassTimeTableModal;
