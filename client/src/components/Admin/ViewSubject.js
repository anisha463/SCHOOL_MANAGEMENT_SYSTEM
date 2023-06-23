import React, { useEffect } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
import { useState } from "react";

function ViewSubject() {
  const [registeredSubjectsList, setRegisteredSubjectsList] = useState([{}]);
  const [registeredSubjectsLoader, setRegisteredSubjectsLoader] =
    useState(false);
  const [counter, setCounter] = useState(0);
  const [fetching, setFetching] = useState(true);

  const timeout = (delay) => {
    return new Promise((res) => setTimeout(res, delay));
  };
  const getRegisteredSubjects = async () => {
    setFetching(true);
    setRegisteredSubjectsLoader(true);
    await timeout(1000); // 1 second time out, fancy lol.;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/subject-list`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
          },
        }
      );
      const gotData = await response.json();
      if (!gotData.Status) {
        setRegisteredSubjectsLoader(false);
        setRegisteredSubjectsList([]);
      } else if (gotData.Status) {
        setRegisteredSubjectsList([...gotData.List]);
        console.log(gotData.List);

        setRegisteredSubjectsLoader(true);
        setFetching(false);
      }
    } catch (error) {
      alert("Something went wrong");
      setRegisteredSubjectsList([]);
      setRegisteredSubjectsLoader(true);
    }
  };

  useEffect(() => {
    getRegisteredSubjects();
  }, []);
  return (
    <>
      <AdminNavBar />
      <div className="row">
        <div className="col-2"></div>
        <div className="col-10"></div>
        <div className="row">
          <div className="col-2"></div>
          {fetching ? (
            <>
              <div
                className="spinner-border mt-5 justify-content-center"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </>
          ) : (
            <>
              {!registeredSubjectsLoader ? (
                <div className="mt-5 pt-5 text-center col-10 ">
                  <h4 className="text-center text-danger">
                    No Subjects Available
                  </h4>
                </div>
              ) : (
                <div className="col-10 mt-5 pt-5 text-center">
                  <h5 className="text-center text-primary mb-3">
                    Subjects List
                  </h5>
                  <table className="text-dark table table-bordered text-center mb-5 ">
                    <thead className="bg-dark text-light">
                      <tr>
                        <th>Subject Id</th>
                        <th>Subject Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredSubjectsList.map((subject) => {
                        const { subjectName, subjectId } = subject;
                        return (
                          <tr key={Math.random()}>
                            <td>{subjectId.slice(0, 20)}</td>
                            <td>{subjectName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default ViewSubject;
