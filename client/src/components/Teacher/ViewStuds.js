import React, { useEffect, useState } from "react";
import TeacherNavBar from "./NavBar/TeacherNavBar";
import ViewStudsDetails from "./ViewStudDetails";

function ViewStuds() {
  const [fetching, setFetching] = useState(false);
  const [studentList, setStudentList] = useState([{}]);
  const [classId1, setClassId1] = useState(null);
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const getStudentList = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/get-student-list`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            classId: classId,
            tid: localStorage.id,
          },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setStudentList([...gotList.List]);

        setClassId1(classId);
        setLoaded(true);
        setTimeout(() => {
          setFetching(false);
        }, 1000);
      } else {
        setStudentList([]);
        setClassId1(classId);
        setLoaded(true);
        setFetching(false);
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      alert("something went wrong");
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };
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
        alert("something went wrong");
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      alert("something went wrong");
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };
  useEffect(() => {
    getClassList();
  }, []);

  return (
    <>
      <TeacherNavBar />
      <div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-10">
            <div>
              <h4
                style={{ paddingRight: "250px" }}
                className="text-info text-center mb-3"
              >
                Students List
              </h4>
            </div>
            <div className="col-10 ">
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
                    <option key={classes.class}> {classes.class}</option>
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
                  <button
                    onClick={getStudentList}
                    className=" btn btn-warning "
                  >
                    View
                  </button>
                </p>
              )}
            </div>

            {fetching ? (
              <div
                className="spinner-border m-5 justify-content-center"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
                {loaded ? (
                  <div>
                    <h6 className="text-primary">
                      Viewing Students Of{" "}
                      <span className="text-danger">Class {classId1}</span>
                    </h6>
                    {studentList.length === 0 ? (
                      <>
                        <div className="text-danger text-center mt-3">
                          <h5 className="text-danger">
                            No Students in This Class
                          </h5>
                        </div>
                      </>
                    ) : (
                      <>
                        <table className="text-dark table table-bordered text-center mb-5 ">
                          <thead className="bg-dark text-light">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Ph No. </th>
                              <th>Class</th>
                              <th>Attendance</th>
                              <th>View Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentList.map((student) => {
                              const {
                                name,
                                email,
                                phoneNumber,
                                sid,
                                attendance,
                              } = student;

                              return (
                                <tr key={sid}>
                                  <td>{name}</td>
                                  <td>{email}</td>
                                  <td>{phoneNumber}</td>
                                  <td>{classId1}</td>
                                  {attendance > 75 ? (
                                    <td className="text-success">
                                      {attendance}%
                                    </td>
                                  ) : (
                                    <td className="text-danger">
                                      {attendance}%
                                    </td>
                                  )}
                                  <td>
                                    <ViewStudsDetails
                                      student={student}
                                      classId1={classId1}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    )}
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
export default ViewStuds;
