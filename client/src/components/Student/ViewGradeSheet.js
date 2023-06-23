import { uuidv4 } from "@firebase/util";
import React, { useState, useEffect } from "react";

import StudentNavBar from "./NavBar/StudentNavBar";
import ViewAnalysis from "./ViewAnalysis";

export default function ViewGradeSheet() {
  const [fetching, setFetching] = useState(false);
  const [gradeSheet, setGradeSheet] = useState([{}]);
  const [isGradeTable, setIsGradeTable] = useState(false);
  const [examType, setExamType] = useState([{}]);
  const [examTypeKey, setExamTypeKey] = useState();
  const [examTypeKey1, setExamTypeKey1] = useState();
  const [total, setTotal] = useState(0);
  const [maxMarks, setMaxMarks] = useState(0);

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
        alert("something went wrong");
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      alert("something went wrong");
      // localStorage.removeItem("Token");
      // window.location.href = "/";
    }
  };

  const getGradeSheet = async () => {
    setFetching(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/grade-sheet`,
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
        var ObtainedMarks = res.List.map((grade) => grade.obtainedMarks);
        var MAXMARKS = res.List.map((grade) => grade.maximumMarks);

        let x = 0;
        let y = 0;
        for (let i = 0; i < ObtainedMarks.length; i++) {
          x += ObtainedMarks[i];
          y += MAXMARKS[i];
        }

        setTotal(x);
        setMaxMarks(y);
        setGradeSheet([...res.List]);

        setExamTypeKey1(examTypeKey);
        setIsGradeTable(true);
        setFetching(false);
      } else {
        alert(`Cannot fetch the Grade Sheet `);
        setGradeSheet([]);
        setExamTypeKey1(examTypeKey);
        setIsGradeTable(true);
        setFetching(false);
      }
    } catch (error) {
      alert(`Something went wrong, ${error.message}`);
      setGradeSheet([]);
      setExamTypeKey1(examTypeKey);
      setIsGradeTable(true);
      setFetching(false);
      // localStorage.removeItem("Token");
      // window.location.href = "/";
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
              <button onClick={getGradeSheet} className=" btn btn-warning ">
                View
              </button>
            </p>
          )}
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-9" style={{ marginLeft: "50px" }}>
            {gradeSheet.length === 0 ? (
              <>
                <div className="mt-5 pt-5 text-center">
                  <h5 className="text-danger text-center">
                    Sorry Grade Sheet not available at the Moment
                  </h5>
                </div>
              </>
            ) : (
              <>
                {isGradeTable ? (
                  <>
                    <h6 className="text-primary">
                      Grade Sheet Of
                      <span className="text-danger"> {examTypeKey1}</span>{" "}
                      Examination
                    </h6>
                    <table className="text-dark table table-bordered text-center mb-5 ">
                      <thead className="bg-dark text-light">
                        <tr>
                          <th>Subject</th>
                          <th>Obtained Marks</th>
                          <th>Max Marks</th>
                          <th>Date of Obtained Marks</th>
                          <th>View Analysis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradeSheet.map((grades) => {
                          const {
                            subjectName,
                            obtainedMarks,
                            maximumMarks,
                            dateOfUpdatingMarks,
                          } = grades;
                          return (
                            <tr key={uuidv4()}>
                              <td className="bg-warning text-dark">
                                {subjectName}
                              </td>
                              <td>{obtainedMarks}</td>
                              <td>{maximumMarks}</td>
                              <td>{dateOfUpdatingMarks.slice(0, 10)}</td>
                              <td>
                                <ViewAnalysis
                                  examTypeKey1={examTypeKey1}
                                  grades={grades}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <table className="text-dark table table-bordered text-center mb-5 mt-3 ">
                      <thead className="bg-dark text-light">
                        <tr>
                          <th>Total</th>
                          <th>%</th>
                          <th>Final Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{total}</td>
                          <td>{(total / maxMarks) * 100}</td>

                          {(total / maxMarks) * 100 > 33 ? (
                            <td className="text-success">Pass</td>
                          ) : (
                            <td className="text-danger">Fail</td>
                          )}
                        </tr>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
