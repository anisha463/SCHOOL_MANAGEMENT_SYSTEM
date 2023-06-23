import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function EditExamTimeTableModal({ timeTable, getExamTimeTable }) {
  const { day, dateOfExam, subjectName, classId, examType } = timeTable;
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setNewDateOfExam(dateOfExam);
    setSubjectName1(subjectName);
  };
  const handleShow = () => setShow(true);
  const [subjectsList, setSubjectsList] = useState([{}]);

  const [newDateOfExam, setNewDateOfExam] = useState(dateOfExam);
  const [subjectName1, setSubjectName1] = useState(subjectName);

  const updateTimeTable = async () => {
    const body = {
      day,
      subjectName1,
      newDateOfExam,
      classId,
      examType,
    };
    // alert(`${newDateOfExam}`);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/edit-exam-timetable`,
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
        getExamTimeTable();
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
            Exam Time Table for {day} of Class {classId} And Type {examType}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="text-dark table table-bordered  text-center mb-5 ">
            <thead className="bg-dark text-light">
              <tr>
                <th>Day</th>
                <th>Date</th>
                <th>Time</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody style={{ height: "40px" }} className="pb-5 bg-light">
              <td className="bg-warning text-dark pt-3">{day.slice(0, 3)}</td>
              <td>
                <input
                  className="form-outline bg-light"
                  type="date"
                  value={newDateOfExam}
                  required
                  autoComplete="off"
                  onChange={(e) => setNewDateOfExam(e.target.value)}
                />
              </td>
              <td className="text-center">
                <input
                  className="form-outline bg-light"
                  type="text"
                  value={`9:00Am-11:00Am`}
                  disabled
                  autoComplete="off"
                />
              </td>
              <td>
                <select
                  className="form-select bg-light"
                  aria-label="Default select example"
                  autoComplete="off"
                  value={subjectName1}
                  onChange={(e) => setSubjectName1(e.target.value)}
                >
                  <option selected>{subjectName}</option>
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

export default EditExamTimeTableModal;
