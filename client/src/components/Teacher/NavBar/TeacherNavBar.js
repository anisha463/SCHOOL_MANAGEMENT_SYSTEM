import React, { useState, useEffect } from "react";
import "./TeacherNavBar.css";

const TeacherNavBar = () => {
  const [total, setTotal] = useState(0);
  const [adminAnnouncement, setAdminAnnouncement] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const logout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Token");
    window.location.reload();
  };
  const gettotals = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/get-navbar-total`,
        {
          method: "GET",
          headers: { token: localStorage.Token, id: localStorage.id },
        }
      );
      const res = await response.json();
      if (res.total) {
        setTotal(res.total);
      }
    } catch (error) {
      setTotal(0);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/total-requests`,
        {
          method: "GET",
          headers: { token: localStorage.Token, id: localStorage.id },
        }
      );
      const res = await response.json();
      if (res.total) {
        setTotalRequests(res.total);
      }
    } catch (error) {
      setTotalRequests(0);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/total-admin-announcement`,
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
  };
  useEffect(() => {
    gettotals();
  }, []);
  return (
    <>
      <header>
        <nav
          id="sidebarMenu"
          className="collapse d-lg-block sidebar collapse bg-white"
        >
          <div className="position-sticky">
            <div className="list-group list-group-flush mx-3 mt-4">
              <a
                href="/teacher-dashboard"
                className="list-group-item list-group-item-action py-2 ripple"
                aria-current="true"
              >
                <i className="fas fa-tachometer-alt fa-fw me-3"></i>
                <span>Main dashboard</span>
              </a>

              <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-mdb-toggle="collapse"
                      data-mdb-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      My Activities
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-mdb-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <div className="list-group list-group-flush ">
                        <a
                          href="/update-marks"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Update Marks</span>
                        </a>
                        <a
                          href="/mark-attendance"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Update Attendance</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-mdb-toggle="collapse"
                      data-mdb-target="#flush-collapseThree"
                      aria-expanded="false"
                      aria-controls="flush-collapseThree"
                    >
                      Time Table
                    </button>
                  </h2>
                  <div
                    id="flush-collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingThree"
                    data-mdb-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <div className="list-group list-group-flush ">
                        <a
                          href="/get-exam-timetable"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Exams</span>
                        </a>
                        <a
                          href="/get-class-time-table"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Classes</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingFive">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-mdb-toggle="collapse"
                      data-mdb-target="#flush-collapseFive"
                      aria-expanded="false"
                      aria-controls="flush-collapseFive"
                    >
                      Requests
                    </button>
                  </h2>
                  <div
                    id="flush-collapseFive"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingFive"
                    data-mdb-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <div className="list-group list-group-flush ">
                        <a
                          href="/create-request-to-admin-from-teacher"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Create New Request to Admin</span>
                        </a>
                        <a
                          href="/view-request-senttoadmin-by-teacher"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Check Previous Requests</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingSix">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-mdb-toggle="collapse"
                      data-mdb-target="#flush-collapseSix"
                      aria-expanded="false"
                      aria-controls="flush-collapseSix"
                    >
                      Announcements
                    </button>
                  </h2>
                  <div
                    id="flush-collapseSix"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingSix"
                    data-mdb-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <div className="list-group list-group-flush ">
                        <a
                          href="/add-teacher-announcement"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Create New</span>
                        </a>
                        <a
                          href="/check-teacher-announcements"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Check Previous</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="/teacher-password"
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-lock fa-fw me-3"></i>
                <span>Password</span>
              </a>
            </div>
          </div>
        </nav>

        <nav
          id="main-navbar"
          className="navbar navbar-expand-lg navbar-light bg-white fixed-top"
        >
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-mdb-toggle="collapse"
              data-mdb-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars"></i>
            </button>
            <a href="/admin-dashboard">
              <h4 className="navbar-brand mt-2 text-dark">TeacherPortal</h4>
            </a>

            <ul className="navbar-nav ms-auto d-flex flex-row mx-5 ">
              <li className="nav-item dropdown">
                <a
                  className="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow"
                  href="/"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-2xl  pt-3 fa-bell"></i>
                  <span className="badge fs-6 rounded-pill badge-notification bg-danger ">
                    {total}
                  </span>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="/view-admin-announcement-to-teacher"
                    >
                      Admin Announcements ({adminAnnouncement})
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/view-request-to-teacher"
                    >
                      Student Requests ({totalRequests})
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item mx-4 dropdown">
                <a
                  className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
                  href="/"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={localStorage.imageURL}
                    className="rounded-circle"
                    height="38"
                    width="38"
                    alt=""
                    loading="lazy"
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <button
                      onClick={() => logout()}
                      className="dropdown-item btn btn-light"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main style={{ marginTop: "58px" }}>
        <div className="container pt-4"></div>
      </main>
    </>
  );
};

export default TeacherNavBar;
