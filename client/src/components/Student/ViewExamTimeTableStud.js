import { uuidv4 } from "@firebase/util";
import React, { useState, useEffect } from "react";

import StudentNavBar from "./NavBar/StudentNavBar";

export default function ViewExamTimeTableStud() {
  const [fetching, setFetching] = useState(false);
  const [timeTableList, setTimeTableList] = useState([{}]);
  const [isTimeTable, setIsTimeTable] = useState(false);
  const [examType, setExamType] = useState([{}]);
  const [examTypeKey, setExamTypeKey] = useState();
  const [examTypeKey1, setExamTypeKey1] = useState();

  const getExamType = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/exam-type`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setExamType(gotList.List);
      } else {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
    }
  };

  const getExamTimeTable = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/exam-timetable`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            sid: localStorage.id,
            examType: examTypeKey,
          },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setTimeTableList([...res.List]);
        setExamTypeKey1(examTypeKey);
        setIsTimeTable(true);
        setFetching(false);
      } else {
        alert(`Cannot fetch the time table`);
        setFetching(false);
        setIsTimeTable(false);
      }
    } catch (error) {
      alert(`Cannot fetch the time table, ${error.message}`);
    }
  };
  useEffect(() => {
    getExamType();
  }, []);
  return (
    <>
      <StudentNavBar />
      <div className="row mt-5">
        <div className="col-2"></div>
        <div className="col-10"></div>
      </div>
      <div className="row mt-3 pt-3">
        <div className="col-2"></div>
        <div className="col-1"></div>

        <div className="col-7 ">
          <div className="my-3">
            <h5 className="text-primary text-center">
              Please Select A Exam Type
            </h5>
          </div>
          <div className="form-outline mb-3">
            <select
              className="form-select bg-light"
              aria-label="Default select example"
              autoComplete="off"
              required
              value={examTypeKey}
              onChange={(e) => setExamTypeKey(e.target.value)}
            >
              <option selected>Please Select The Exam Type</option>
              {examType.map((exam) => (
                <option key={uuidv4()}> {exam.examName}</option>
              ))}
            </select>
          </div>
          {fetching ? (
            <p align="right">
              <button class="btn btn-warning text-dark" type="button" disabled>
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </button>
            </p>
          ) : (
            <p align="right">
              <button onClick={getExamTimeTable} className=" btn btn-warning ">
                View
              </button>
            </p>
          )}
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-9" style={{ marginLeft: "50px" }}>
            {isTimeTable ? (
              <>
                <h6 className="text-primary">
                  Exam Time Table
                  <span className="text-danger"> for {examTypeKey1}</span>{" "}
                  Examination
                </h6>
                <table className="text-dark table table-bordered text-center mb-5 ">
                  <thead className="bg-dark text-light">
                    <tr>
                      <th>Day</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Subject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeTableList.map((timeTable) => {
                      const { day, dateOfExam, subjectName } = timeTable;
                      return (
                        <tr key={uuidv4()}>
                          <td className="bg-warning text-dark">{day}</td>
                          <td>{dateOfExam}</td>
                          <td>9:00Am-11:00Am</td>
                          <td>{subjectName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                {fetching ? (
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
