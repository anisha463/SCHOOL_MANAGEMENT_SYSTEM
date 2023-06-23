import React, { useEffect, useState } from "react";
import StudentNavBar from "./NavBar/StudentNavBar";
import ViewTeacherAnncDetails from "./ViewTeacherAnncDetails";

function TeacherAnnc() {
  const [fetching, setFetching] = useState(true);
  const [teacherAnnc, setTeacherAnnc] = useState([{}]);

  const getTeacherAnnc = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/teacher-announcement`,
        {
          method: "GET",
          headers: { token: localStorage.Token, sid: localStorage.id },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setTeacherAnnc([...gotList.List]);

        setTimeout(() => {
          setFetching(false);
        }, 1000);
      } else {
        setTeacherAnnc([]);
        setFetching(false);
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      alert("something went wrong");
      setTeacherAnnc([]);
      setFetching(false);
      localStorage.removeItem("Token");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    getTeacherAnnc();
  }, []);
  return (
    <>
      <StudentNavBar />
      <div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-10">
            <div>
              <h4 className="text-info text-center">Teacher Announcements </h4>
            </div>
            {fetching ? (
              <div
                className="spinner-border m-5 justify-content-center"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <div>
                {teacherAnnc.length === [] ? (
                  <div className="mt-3 text-center">
                    <h5 className="text-danger">No Available Announcements</h5>
                  </div>
                ) : (
                  <table className=" table  text-center text-dark">
                    <thead className="bg-dark text-light">
                      <tr>
                        <th>Date Of Announcement</th>
                        <th>Topic </th>
                        <th>Subject Name</th>
                        <th>Teacher Name</th>
                        <th>View Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherAnnc.map((annc) => {
                        const {
                          dateOfAnnouncement,
                          topic,
                          announcementId,
                          name,
                          subjectName,
                        } = annc;
                        return (
                          <tr key={announcementId}>
                            <td>{dateOfAnnouncement.slice(0, 10)}</td>
                            <td>{topic}</td>
                            <td>{subjectName}</td>
                            <td>{name}</td>
                            <td>
                              <ViewTeacherAnncDetails annc={annc} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default TeacherAnnc;
