import React, { useEffect, useState } from "react";
import "./AdminNavBar.css";

const AdminNavBar = () => {
  const logout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Token");
    window.location.reload();
  };
  const [total, setTotal] = useState(0);
  const [teacherTotal, setTeacherTotal] = useState(0);
  const [studentTotal, setStudentTotal] = useState(0);

  const getTotal = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/total-teacher-requests`,
        { method: "GET", headers: { token: localStorage.Token } }
      );
      const res = await response.json();
      if (res.Status) {
        setTeacherTotal(res.total);
      } else {
      }
    } catch (error) {}
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/total-student-requests`,
        { method: "GET", headers: { token: localStorage.Token } }
      );
      const res = await response.json();
      if (res.Status) {
        setStudentTotal(res.total);
      } else {
      }
    } catch (error) {}
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

  useEffect(() => {
    getTotal();
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
                href="/admin-dashboard"
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
                      Teacher's Section
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
                          href="/add-teacher"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Add Teacher</span>
                        </a>
                        <a
                          href="/edit-teacher"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Edit Teacher </span>
                        </a>
                        <a
                          href="/delete-teacher"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Delete Teacher </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-mdb-toggle="collapse"
                      data-mdb-target="#flush-collapseTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseTwo"
                    >
                      Student's Section
                    </button>
                  </h2>
                  <div
                    id="flush-collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingTwo"
                    data-mdb-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <div className="list-group list-group-flush ">
                        <a
                          href="/add-student"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Add Student</span>
                        </a>
                        <a
                          href="/edit-student"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Edit Student</span>
                        </a>
                        <a
                          href="/delete-student"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Delete Student</span>
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
                      Fee Challan
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
                          href="/fee-challan"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Create Fee Challan </span>
                        </a>
                        <a
                          href="/view-challan"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>View Fee Challan </span>
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
                          href="/exam-time-table"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Exams</span>
                        </a>
                        {/* <a
                          href="/class-time-table"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>View Class Time Table</span>
                        </a> */}
                        <a
                          href="/edit-class-time-table"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Class</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingFour">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-mdb-toggle="collapse"
                      data-mdb-target="#flush-collapseFour"
                      aria-expanded="false"
                      aria-controls="flush-collapseFour"
                    >
                      Subjects Section
                    </button>
                  </h2>
                  <div
                    id="flush-collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingFour"
                    data-mdb-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <div className="list-group list-group-flush ">
                        <a
                          href="/add-subject"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Add Subject</span>
                        </a>
                        <a
                          href="/view-subjects"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>View Subjects</span>
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
                      Announcements
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
                          href="/add-announcement"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Create </span>
                        </a>
                        <a
                          href="/check-announcements"
                          className="list-group-item list-group-item-action py-2 ripple"
                          aria-current="true"
                        >
                          <span>Check</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="/admin-password"
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
              <h4 className="navbar-brand mt-2 text-dark">AdminPortal</h4>
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
                    <a className="dropdown-item" href="/teacher-requests">
                      Teacher's Requests ({teacherTotal})
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/student-requests">
                      Student's Requests ({studentTotal})
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
                      className="dropdown-item btn  btn-light"
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

export default AdminNavBar;
