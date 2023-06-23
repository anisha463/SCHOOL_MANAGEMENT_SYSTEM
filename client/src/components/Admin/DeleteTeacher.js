import React, { useEffect, useState } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
import ViewTeachersDetails from "./ViewTeachersDetails";

function DeleteTeacher() {
  const [fetching, setFetching] = useState(false);
  const [teachersList, setTeachersList] = useState([{}]);
  const [classId1, setClassId1] = useState(null);
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const getTeachersList = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/teacher-list-class`,
        {
          method: "GET",
          headers: { token: localStorage.Token, classId: classId },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setTeachersList([...gotList.List]);
        setClassId1(classId);
        setLoaded(true);
        setTimeout(() => {
          setFetching(false);
        }, 1000);
      } else {
        setFetching(false);
        setLoaded(true);
        setTeachersList([]);
      }
    } catch (error) {
      alert("In catch block of getTeachersList, cant fetch the data");
      setFetching(false);
      setLoaded(true);
      setTeachersList([]);
    }
  };

  const deleteTeacher = async (tid) => {
    const body = { tid };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/delete-teacher`,
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
        alert("The Teacher Was Deleted");
        getTeachersList();
      } else {
        alert("In else block of deleteTeacher");
      }
    } catch (error) {
      alert("In catch block of deleteTeacher");
    }
  };
  const getClassList = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/class-list`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setClassList(gotList.List);
      } else {
        alert("In else block of getClassList");
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      alert("In catch block of getClassList");
      console.log(error.message);
    }
  };

  useEffect(() => {
    getClassList();
  }, []);

  return (
    <>
      <AdminNavBar />
      <div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-10">
            <div>
              <h4
                style={{ paddingRight: "250px" }}
                className="text-info text-center"
              >
                Teachers List
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
                    <option key={classes.classId}> {classes.classId}</option>
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
                    onClick={getTeachersList}
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
                  <>
                    <div>
                      <h6 className="text-primary">
                        Viewing/Delete Teachers Of{" "}
                        <span className="text-danger">Class {classId1}</span>
                      </h6>
                      {teachersList.length === 0 ? (
                        <>
                          <div className="my-3 text-center">
                            <h5 className="text-danger">
                              No Teachers In This Class
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
                                <th>Subject</th>
                                <th>View Details</th>
                                <th>Delete</th>
                              </tr>
                            </thead>
                            <tbody>
                              {teachersList.map((teacher) => {
                                console.log(teacher);
                                const {
                                  name,
                                  email,
                                  phoneNumber,
                                  subjectName,
                                  tid,
                                } = teacher;
                                return (
                                  <tr key={tid}>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>{phoneNumber}</td>
                                    <td>{subjectName}</td>
                                    <td>
                                      <ViewTeachersDetails teacher={teacher} />
                                    </td>
                                    <td>
                                      <button
                                        onClick={() => deleteTeacher(tid)}
                                        className="btn btn-danger"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </>
                      )}
                    </div>
                  </>
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
export default DeleteTeacher;
