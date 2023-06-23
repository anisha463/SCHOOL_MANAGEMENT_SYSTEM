import { uuidv4 } from "@firebase/util";
import React, { useState, useEffect } from "react";
import StudentNavBar from "./NavBar/StudentNavBar";

export default function ViewClassTimeTableStud() {
  const [fetching, setFetching] = useState(false);
  const [timeTableList, setTimeTableList] = useState([{}]);
  const [isTimeTable, setIsTimeTable] = useState(false);
  const [teacherList, setTeacherList] = useState([{}]);

  const getTimeTable = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/get-class-timetable`,
        {
          method: "GET",
          headers: { token: localStorage.Token, sid: localStorage.id },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setTimeTableList([...res.List]);
      } else {
        alert(`Cannot fetch the time table`);
        setFetching(false);
        setIsTimeTable(false);
      }
    } catch (error) {
      alert(`Cannot fetch the time table, ${error.message}`);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/teacher-list`,
        {
          method: "GET",
          headers: { token: localStorage.Token, sid: localStorage.id },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setTeacherList([...res.List]);

        setIsTimeTable(true);
        setFetching(false);
      } else {
        alert(`Cannot fetch the teacher table got status false`);
        setFetching(false);
        setIsTimeTable(false);
      }
    } catch (error) {
      alert(`Cannot fetch the time table, ${error.message}`);
    }
  };
  useEffect(() => {
    getTimeTable();
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
            {isTimeTable ? (
              <>
                <h4 className="text-primary text-center mb-3">Time Table</h4>
                <table className="text-dark table table-bordered text-center mb-5 ">
                  <thead className="bg-dark text-light">
                    <tr>
                      <th>Day</th>
                      <th>
                        Period 1 <br /> (8:00Am-8:45AM)
                      </th>
                      <th>
                        Period 2 <br /> (8:45Am-9:30AM)
                      </th>
                      <th>
                        Period 3 <br /> (9:30Am-10:15AM)
                      </th>
                      <th>
                        Period 4 <br /> (10:15Am-10:30AM)
                      </th>
                      <th>
                        Period 5 <br /> (10:30Am-11:15AM)
                      </th>
                      <th>
                        Period 6 <br /> (11:15Am-12:00PM)
                      </th>
                      <th>
                        Period 7 <br /> (12:00Pm-12:45PM)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeTableList.map((timeTable) => {
                      const {
                        day,
                        period1,
                        period2,
                        period3,
                        period4,
                        period5,
                        period6,
                        period7,
                      } = timeTable;
                      return (
                        <tr key={uuidv4()}>
                          <td className="bg-warning text-dark">{day}</td>
                          <td>{period1}</td>
                          <td>{period2}</td>
                          <td>{period3}</td>
                          <td className="bg-info text-light">{period4}</td>
                          <td>{period5}</td>
                          <td>{period6}</td>
                          <td>{period7}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <table className="text-dark table table-bordered text-center my-4">
                  <thead className="bg-dark text-light">
                    <th>Subject Name</th>
                    <th>Teacher</th>
                  </thead>
                  <tbody>
                    {teacherList.map((teacher) => {
                      const { subjectName, name } = teacher;
                      return (
                        <tr>
                          <td>{subjectName}</td>
                          <td>{name}</td>
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
