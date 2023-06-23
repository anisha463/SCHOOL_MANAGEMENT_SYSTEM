import { uuidv4 } from "@firebase/util";
import React, { useState, useEffect } from "react";
import EditClassTimeTableModal from "./EditClassTimeTableModal";
import AdminNavBar from "./NavBar/AdminNavBar";

export default function EditClassTimeTable() {
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [timeTableList, setTimeTableList] = useState([{}]);
  const [isTimeTable, setIsTimeTable] = useState(false);
  const [classId1, setClassId1] = useState(null);

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
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
    }
  };
  const getTimeTable = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/get-timetable`,
        {
          method: "GET",
          headers: { token: localStorage.Token, classId: classId },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setTimeTableList([...res.List]);
        setClassId1(classId);
        setIsTimeTable(true);
        setFetching(false);
      } else {
        alert(`Cannot fetch the time table`);
        setFetching(false);
        setIsTimeTable(false);
      }
    } catch (error) {
      alert(`Cannot fetch the time table, ${error.message}`);
    }
  };
  useEffect(() => {
    getClassList();
  }, []);
  return (
    <>
      <AdminNavBar />
      <div className="row mt-5">
        <div className="col-2"></div>
        <div className="col-10"></div>
      </div>
      <div className="row mt-3 pt-3">
        <div className="col-2"></div>
        <div className="col-1"></div>

        <div className="col-7 ">
          <h4 className="text-info text-center mb-3">
            Please Select A Class To Edit The Time Table
          </h4>
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
              <button class="btn btn-warning text-dark" type="button" disabled>
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </button>
            </p>
          ) : (
            <p align="right">
              <button onClick={getTimeTable} className=" btn btn-warning ">
                View
              </button>
            </p>
          )}
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-9" style={{ marginLeft: "50px" }}>
            {isTimeTable ? (
              <>
                <h6 className="text-primary">
                  Viewing/Editing Time Table Of Class {classId1}
                </h6>
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
                      <th></th>
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
                          <td className="bg-light">
                            <EditClassTimeTableModal
                              getTimeTable={getTimeTable}
                              timeTable={timeTable}
                            />
                          </td>
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
