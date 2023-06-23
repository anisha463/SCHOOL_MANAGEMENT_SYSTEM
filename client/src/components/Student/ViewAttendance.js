import { uuidv4 } from "@firebase/util";
import React, { useState, useEffect } from "react";
import StudentNavBar from "./NavBar/StudentNavBar";

export default function ViewAttendance() {
  const [fetching, setFetching] = useState(false);
  const [attendanceList, setAttendanceList] = useState([{}]);
  const [isAttendance, setIsAttendance] = useState(false);

  const getAttendance = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/get-attendance`,
        {
          method: "GET",
          headers: { token: localStorage.Token, sid: localStorage.id },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setAttendanceList([...res.List]);
        setIsAttendance(true);
        setFetching(false);
      } else {
        alert(`Cannot fetch the attendance `);
        setFetching(false);
        setIsAttendance(false);
        setAttendanceList([]);
      }
    } catch (error) {
      alert(`Cannot fetch the attendance, something went wrong `);
      setFetching(false);
      setIsAttendance(false);
      setAttendanceList([]);
    }
  };
  useEffect(() => {
    getAttendance();
  }, []);
  return (
    <>
      <StudentNavBar />
      <div className="row mt-5">
        <div className="col-2"></div>
        <div className="col-10"></div>
      </div>
      <div className="row mt-3 pt-3">
        <div className="col-2"></div>
        <div className="col-1"></div>

        <div className="row">
          <div className="col-2"></div>
          <div className="col-9" style={{ marginLeft: "50px" }}>
            {isAttendance ? (
              <>
                <h4 className="text-primary mb-4 text-center">Attendance</h4>
                <table className="text-dark table table-bordered text-center mb-5 ">
                  <thead className="bg-dark text-light">
                    <tr>
                      <th>Subject</th>
                      <th>Total Lectures Attended</th>
                      <th>Total Lectures By Faculty</th>
                      <th>Your Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((attendance) => {
                      const {
                        subjectName,
                        totalLecturesAttended,
                        totalLecturesByFaculty,
                        yourAttendance,
                      } = attendance;
                      return (
                        <tr key={uuidv4()}>
                          <td className="bg-warning text-dark">
                            {subjectName}
                          </td>
                          <td>{totalLecturesAttended}</td>
                          <td>{totalLecturesByFaculty}</td>
                          {yourAttendance > 75 ? (
                            <td className="text-success">{yourAttendance}%</td>
                          ) : (
                            <td className="text-danger">{yourAttendance}%</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                {fetching ? (
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="mt-5 pt-5 text-center">
                      <h5 className="mt-5 text-center text-danger">
                        Sorry Can't fetch the attendance at the moment
                      </h5>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
