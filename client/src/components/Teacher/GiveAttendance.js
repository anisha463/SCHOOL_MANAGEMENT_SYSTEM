import React, { useState, useEffect } from "react";
import TeacherNavBar from "./NavBar/TeacherNavBar";

export default function GiveAttendance() {
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [studentList, setStudentList] = useState([{}]);
  const [loaded, setLoaded] = useState(false);
  const [classId1, setClassId1] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);

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

        setLoading(false);
      } else {
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      // console.log(error.message);
      // localStorage.removeItem("Token");
    }
  };

  const getStudentList = async () => {
    setFetching(true);
    setLoaded(false);
    //function to get total no of lec held till now

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/get-student-attendance`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            classId: classId,
            tid: localStorage.id,
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

  const handleChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (checked) {
      setSelectedStudents([...selectedStudents, value]);
    } else {
      setSelectedStudents(selectedStudents.filter((e) => e !== value));
      setSelectedStudents(selectedStudents.filter((e) => e !== value));
    }
  };

  const handleAttendance = async () => {
    try {
      const body = {
        students: selectedStudents,
        tid: localStorage.id,
        classId: classId1,
      };
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/update-attendance`,
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
      if (res.Status) {
        alert("Attendance was marked, page will reload");
        window.location.reload();
      } else {
        alert("Couldn't mark the attendance");
      }
    } catch (error) {
      alert("Some error occured, in catch block of handleAttendance Func");
    }
  };
  useEffect(() => {
    getClassList();
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
              Please Select a Class to Mark The Attendance
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
                    Marking Attendance of{" "}
                    <span className="text-danger">Class {classId1}</span>
                  </h6>
                  <h6 className="text-info mt-3 mb-2">
                    Please Check the check boxes if student was present, else
                    leave them unchecked.
                  </h6>
                  <table className="text-dark table  table-bordered text-center mb-5 ">
                    <thead className="bg-dark text-light">
                      <tr>
                        <th>Student Name</th>
                        <th>Student Id</th>
                        <th>Lecture No.</th>
                        <th>Today's Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentList.map((student) => {
                        const { sid, name, totalLecturesByFaculty } = student;
                        return (
                          <tr key={sid}>
                            <td>{name}</td>
                            <td>
                              <input
                                type="checkbox"
                                name="classes"
                                autoComplete="off"
                                value={sid}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                className="fs-3"
                              />
                              <label className="fs-5">&nbsp; {sid}</label>
                              &nbsp;
                            </td>
                            <td className="text-danger ">
                              {totalLecturesByFaculty + 1}
                            </td>
                            <td>{Date()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="my-3 ">
                    {fetching ? (
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
                        onClick={handleAttendance}
                        style={{ marginLeft: "700px" }}
                        className="btn btn-warning "
                      >
                        Submit?
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
