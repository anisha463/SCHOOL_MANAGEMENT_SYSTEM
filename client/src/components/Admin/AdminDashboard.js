import React, { useEffect, useState } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
function AdminDashboard() {
  const [total, setTotal] = useState(0);
  const [studentTotal, setStudentTotal] = useState(0);
  const [teacherTotal, setTeacherTotal] = useState(0);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [fetching, setFetching] = useState(true);
  const getTotalRequests = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/total-request`,
        { method: "GET", headers: { token: localStorage.Token } }
      );
      const res = await response.json();
      if (res.Status) {
        setTotal(res.total);
      } else {
      }
    } catch (error) {}
  };
  const getTotalStudent = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/total-students`,
        { method: "GET", headers: { token: localStorage.Token } }
      );
      const res = await response.json();
      if (res.Status) {
        setStudentTotal(res.total);
      } else {
      }
    } catch (error) {}
  };
  const getTotalTeacher = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/total-teachers`,
        { method: "GET", headers: { token: localStorage.Token } }
      );
      const res = await response.json();
      if (res.Status) {
        setTeacherTotal(res.total);
      } else {
      }
    } catch (error) {}
  };
  const getMyProfile = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/my-profile`,
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
    getTotalRequests();
    getTotalStudent();
    getTotalTeacher();
    getMyProfile();
  }, []);
  if (fetching) {
    return (
      <>
        <AdminNavBar />
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
        <AdminNavBar />
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
                          <h3 className="text-warning">{total}</h3>
                          <p className="mb-2 fs-5">Total Requests</p>
                          <a href="/student-requests">
                            <button className="btn btn-primary">Student</button>
                          </a>
                          <a href="/teacher-requests">
                            <button className="btn btn-primary mx-1 ">
                              Teacher
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
                          <h3 className="text-success">{studentTotal}</h3>
                          <p className="mb-2 fs-5">Total No Of Students</p>
                          <a href="/edit-student">
                            <button className="btn btn-primary ">
                              View All
                            </button>
                          </a>
                        </div>
                        <div className="align-self-center">
                          <i className="far fa-user text-success fa-3x"></i>
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
                          <h3 className="text-danger">{teacherTotal}</h3>
                          <p className="mb-2 fs-5">Total No Of Teachers</p>
                          <a href="/edit-teacher">
                            <button className="btn btn-primary ">
                              View All
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
                  className="text-center  mb-4 mt-5"
                >
                  <h4 className="text-primary"> Your Profile</h4>
                </div>
              </div>
              <div>
                <div className="container py-5">
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
                          <h5 className="my-3">Admin</h5>
                          <p className="text-muted mb-4">
                            School Management System
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7 mt-5">
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
export default AdminDashboard;
