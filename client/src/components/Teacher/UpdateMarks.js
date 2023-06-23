import { uuidv4 } from "@firebase/util";
import React, { useState, useEffect } from "react";
import GiveMarksTable from "./GiveMarksTable";
import TeacherNavBar from "./NavBar/TeacherNavBar";

export default function UpdateMarks() {
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [studentList, setStudentList] = useState([{}]);
  const [loaded, setLoaded] = useState(false);
  const [classId1, setClassId1] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examType, setExamType] = useState([{}]);
  const [examTypeKey1, setExamTypeKey1] = useState();
  const [maxMarks, setMaxMarks] = useState(0);
  const [refreshingList, setRefreshingList] = useState(false);

  const getClassList = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/teaches-in`,
        {
          method: "GET",
          headers: { token: localStorage.Token, tid: localStorage.id },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setClassList([...gotList.List]);
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

  const getStudentList = async () => {
    setFetching(true);
    setLoaded(false);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/max-marks`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            classId: classId,
            tid: localStorage.id,
            examType: examTypeKey1,
          },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setMaxMarks(res.maximumMarks);
      } else {
        setMaxMarks(0);
      }
    } catch (error) {
      setMaxMarks(0);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/get-student-marks`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            classId: classId,
            tid: localStorage.id,
            examType: examTypeKey1,
          },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setStudentList([...res.List]);
        setClassId1(classId);
        setLoaded(true);
        setTimeout(() => {
          setFetching(false);
        }, 1000);
      } else {
        alert(`Cannot fetch the time table`);
        setFetching(false);
        setLoaded(false);
      }
    } catch (error) {
      alert(`Cannot fetch the time table, ${error.message}`);
    }
  };

  const getStudentList2 = async () => {
    setRefreshingList(true);
    setLoaded(false);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/max-marks`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            classId: classId,
            tid: localStorage.id,
            examType: examTypeKey1,
          },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setMaxMarks(res.maximumMarks);
      } else {
        setMaxMarks(0);
      }
    } catch (error) {
      setMaxMarks(0);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/get-student-marks`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            classId: classId,
            tid: localStorage.id,
            examType: examTypeKey1,
          },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setStudentList([...res.List]);
        setRefreshingList(false);
        setLoaded(true);
        setTimeout(() => {}, 1000);
      } else {
        alert(`Cannot fetch the marks table`);
      }
    } catch (error) {
      alert(`Cannot fetch the marks table, ${error.message}`);
    }
  };

  const getExamType = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/exam-type`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setExamType(gotList.List);
        setLoading(false);
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
  useEffect(() => {
    getClassList();
    getExamType();
  }, []);
  if (loading) {
    return (
      <>
        <TeacherNavBar />
        <div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-10  pt-3"></div>
          </div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-10  pt-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <TeacherNavBar />
        <div className="row mt-5">
          <div className="col-2"></div>
          <div className="col-10"></div>
        </div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-1"></div>

          <div className="col-7 ">
            <h4 className="text-info text-center mb-3">
              Please Select a Class and Exam Type To Update Marks
            </h4>
            <div className="form-outline mb-3">
              <select
                className="form-select bg-light"
                aria-label="Default select example"
                autoComplete="off"
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option selected>Please Click To Select A Class</option>
                {classList.map((classes) => (
                  <option key={classes.classId}> {classes.class}</option>
                ))}
              </select>
            </div>
            <div className="form-outline mb-3">
              <select
                className="form-select bg-light"
                aria-label="Default select example"
                autoComplete="off"
                required
                value={examTypeKey1}
                onChange={(e) => setExamTypeKey1(e.target.value)}
              >
                <option selected>Please Select The Exam Type</option>
                {examType.map((exam) => (
                  <option key={uuidv4()}> {exam.examName}</option>
                ))}
              </select>
            </div>
            {fetching ? (
              <p align="right">
                <button
                  class="btn btn-warning text-dark"
                  type="button"
                  disabled
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </button>
              </p>
            ) : (
              <p align="right">
                <button onClick={getStudentList} className=" btn btn-warning ">
                  View
                </button>
              </p>
            )}
          </div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-10">
              {loaded ? (
                <>
                  <h6 className="text-primary">
                    Viewing/Editing/Giving Marks to{" "}
                    <span className="text-danger">
                      Class {classId1} students for {examTypeKey1}
                    </span>{" "}
                    Examination
                  </h6>
                  <div className="form-outline my-3">
                    <label>Please Enter Maximum Marks</label>
                    <input
                      type="number"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                    />
                  </div>
                  <table className="text-dark table  table-bordered text-center mb-5 ">
                    <thead className="bg-dark text-light">
                      <tr>
                        <th>Student Id</th>
                        <th>Student Name</th>
                        <th>Obtained Marks</th>
                        <th>Maximum Marks</th>
                        <th>Date of Updating Marks</th>
                        <th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentList.map((student) => {
                        const { sid } = student;
                        return (
                          <tr key={sid}>
                            <GiveMarksTable
                              examTypeKey1={examTypeKey1}
                              maxMarks={maxMarks}
                              student={student}
                              classId={classId}
                            />
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="my-3 ">
                    {refreshingList ? (
                      <p style={{ marginLeft: "700px" }}>
                        <button
                          class="btn btn-warning text-dark"
                          type="button"
                          disabled
                        >
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </button>
                      </p>
                    ) : (
                      <button
                        onClick={getStudentList2}
                        style={{ marginLeft: "700px" }}
                        className="btn btn-warning "
                      >
                        Refresh List
                      </button>
                    )}
                  </div>
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
}
