import React, { useEffect, useState } from "react";
import TeacherNavBar from "./NavBar/TeacherNavBar";
import ViewAnnounDetails from "./ViewAnnounDetails";

function CheckTeacherAnn() {
  const [fetching, setFetching] = useState(false);
  const [announcementsList, setAnnouncementsList] = useState([{}]);
  const [classId1, setClassId1] = useState(null);
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const getAnnouncements = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/check-announcements`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            tid: localStorage.id,
            classId: classId,
          },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setAnnouncementsList([...gotList.List]);
        setClassId1(classId);
        setFetching(false);

        setLoaded(true);
        setTimeout(() => {
          setFetching(false);
        }, 1000);
      } else {
        setAnnouncementsList([]);
        setClassId1(classId);
        setFetching(false);

        setLoaded(true);
        setTimeout(() => {
          setFetching(false);
        }, 1000);
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      alert("seomthing went wrong");
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };

  const deleteAnnoucement = async (announcementId) => {
    const body = { announcementId };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/delete-announcement`,
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
        alert("The Announcement Was Deleted");
        getAnnouncements();
      } else {
        alert("seomthing went wrong");
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      alert("seomthing went wrong");
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
        setClassList(gotList.List);
      } else {
        alert("seomthing went wrong");
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      alert("seomthing went wrong");
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
              <h4 className="text-info text-center">Announcements List</h4>
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
                  <button
                    onClick={getAnnouncements}
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
                      Viewing Announcements Made for{" "}
                      <span className="text-danger">Class {classId1}</span>
                    </h6>
                    {announcementsList.length === 0 ? (
                      <>
                        <div className="text-danger text-center mt-3">
                          <h5>No Announcements Available</h5>
                        </div>
                      </>
                    ) : (
                      <>
                        <table className="text-dark table  text-center mb-5 ">
                          <thead className="bg-dark text-light">
                            <tr>
                              <th>Topic</th>
                              <th>Date</th>
                              <th>View Details</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {announcementsList.map((announcement) => {
                              const {
                                topic,
                                dateOfAnnouncement,
                                announcementId,
                              } = announcement;
                              return (
                                <tr key={announcementId}>
                                  <td>{topic}</td>
                                  <td>{dateOfAnnouncement.slice(0, 10)}</td>
                                  <td>
                                    <ViewAnnounDetails
                                      announcement={announcement}
                                    />
                                  </td>
                                  <td>
                                    <button
                                      onClick={() =>
                                        deleteAnnoucement(announcementId)
                                      }
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
export default CheckTeacherAnn;
