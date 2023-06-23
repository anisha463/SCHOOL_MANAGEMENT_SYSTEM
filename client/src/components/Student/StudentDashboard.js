import React, { useState, useEffect } from "react";
// import DashBoardTable from "./DashBoardTable";
import StudentNavBar from "./NavBar/StudentNavBar";
function StudentDashboard() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [classId, setClassId] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [adminAnnouncement, setAdminAnnouncement] = useState(0);
  const [teacherAnnouncement, setTeacherAnnouncement] = useState(0);
  const [minAttendance, setMinAttendance] = useState(0);

  const gettotals = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/total-teacher-announcement`,
        {
          method: "GET",
          headers: { token: localStorage.Token, sid: localStorage.id },
        }
      );
      const res = await response.json();
      if (res.total) {
        setTeacherAnnouncement(res.total);
      } else {
        setTeacherAnnouncement(0);
      }
    } catch (error) {
      // alert(`in catch block, some error has occured, ${error.message}`);
      setTeacherAnnouncement(0);
    }
    // try {
    //   const response = await fetch(
    //     `${process.env.REACT_APP_SERVER_URL}/teacher/total-requests`,
    //     {
    //       method: "GET",
    //       headers: { token: localStorage.Token, id: localStorage.id },
    //     }
    //   );
    //   const res = await response.json();
    //   if (res.total) {
    //     setTotalRequests(res.total);
    //   }
    // } catch (error) {
    //   setTotalRequests(0);
    // }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/total-admin-announcement`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const res = await response.json();
      if (res.total) {
        setAdminAnnouncement(res.total);
      }
    } catch (error) {
      setAdminAnnouncement(0);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/get-min-attendance`,
        {
          method: "GET",
          headers: { token: localStorage.Token, sid: localStorage.id },
        }
      );
      const res = await response.json();
      if (res.minAtt) {
        setMinAttendance(res.minAtt);
      }
    } catch (error) {
      setMinAttendance(0);
    }
    getMyProfile();
  };

  const getMyProfile = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/my-profile`,
        {
          method: "GET",
          headers: { token: localStorage.Token, id: localStorage.id },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setName(res.name);
        setEmail(res.email);
        setAddress(res.address);
        setPhoneNumber(res.phoneNumber);
        setClassId(res.classId);
        setFetching(false);
      } else {
        setFetching(false);
      }
    } catch (error) {
      // alert(`in catch block, some error has occured, ${error.message}`);
      setFetching(true);
    }
  };
  useEffect(() => {
    gettotals();
  }, []);
  if (fetching) {
    return (
      <>
        <StudentNavBar />
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
        <StudentNavBar />
        <div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-10 pt-3">
              <div
                style={{ paddingRight: "400px" }}
                className="text-center  mb-4 mt-3"
              >
                <h4 className="text-primary"> Quick Access</h4>
              </div>
              <div className="row">
                <div className="col-xl-3 col-sm-6 col-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between px-md-1">
                        <div>
                          <h3 className="text-warning">
                            {teacherAnnouncement}
                          </h3>
                          <p className="mb-2 fs-5">Teacher Announcement</p>
                          <a href="/view-teacher-annc">
                            <button className="btn btn-primary">
                              View All
                            </button>
                          </a>
                        </div>
                        <div className="align-self-center">
                          <i className="far fa-comments mb-5 text-warning fa-3x"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between px-md-1">
                        <div>
                          <h3 className="text-success">{adminAnnouncement}</h3>
                          <p className="mb-2 fs-5">Admin Announcement</p>
                          <a href="/view-admin-annc-to-student">
                            <button className="btn btn-primary ">
                              View All
                            </button>
                          </a>
                        </div>
                        <div className="align-self-center">
                          <i className="far fa-comments mb-5 text-success fa-3x"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between px-md-1">
                        <div>
                          {minAttendance < 75 ? (
                            <h3 className="text-danger">{minAttendance}%</h3>
                          ) : (
                            <h3 className="text-success">{minAttendance}%</h3>
                          )}

                          <p className="mb-2 fs-5">Minimum Attendance</p>
                          <a href="/view-attendance">
                            <button className="btn btn-primary ">
                              View Details
                            </button>
                          </a>
                        </div>
                        <div className="align-self-center">
                          <i className="far fa-user text-danger fa-3x"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ paddingLeft: "150px" }} className="row">
              <div className="col-2"></div>
              <div className="col-1"></div>
              <div className="col-9">
                <div
                  style={{ paddingRight: "650px" }}
                  className="text-center mt-5"
                >
                  <h4 className="text-primary"> Your Profile</h4>
                </div>
              </div>
              <div>
                <div className="container py-4">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="card mb-4">
                        <div className="card-body text-center">
                          <img
                            src={localStorage.imageURL}
                            alt="avatar"
                            className="rounded-circle img-fluid"
                            style={{ width: "200px", height: "200px" }}
                          />
                          <h5 className="my-3">Student</h5>
                          <p className="text-muted mb-4">
                            School Management System
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7 mt-4">
                      <div className="card mb-4">
                        <div className="card-body">
                          <div className="row ">
                            <div className="col-sm-3">
                              <p className="mb-0">Full Name</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">{name}</p>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Email</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">{email}</p>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Phone</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">{phoneNumber}</p>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Class</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">{classId}</p>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Address</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">{address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default StudentDashboard;
