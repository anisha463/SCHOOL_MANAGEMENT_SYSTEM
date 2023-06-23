import React, { useEffect, useState } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
import ViewTeacherRequestDetails from "./ViewTeacherRequestDetails";

function TeachersRequest() {
  const [fetching, setFetching] = useState(true);
  const [requestsList, setRequestsList] = useState([{}]);

  const getTeachersRequests = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/teacher-requests`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setRequestsList([...gotList.List]);
        setTimeout(() => {
          setFetching(false);
        }, 1000);
      } else {
        setRequestsList([]);
        setFetching(false);
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      alert("Can't fetch data from backend");
      setRequestsList([]);
      setFetching(false);
      // console.log(error.message);
      // localStorage.removeItem("Token");
    }
  };

  useEffect(() => {
    getTeachersRequests();
  }, []);
  return (
    <>
      <AdminNavBar />
      <div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-10">
            <div>
              <h4 className="text-info text-center">Teacher Requests </h4>
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
                {requestsList.length === 0 ? (
                  <>
                    <div className="my-3 text-center">
                      <h5 className="text-danger">No Requests Available</h5>
                    </div>
                  </>
                ) : (
                  <>
                    <table className=" table  text-center text-dark">
                      <thead className="bg-dark text-light">
                        <tr>
                          <th>Name</th>
                          <th>Ph No. </th>
                          <th>Topic</th>
                          <th>Date Of Request</th>
                          <th>View Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requestsList.map((request) => {
                          const {
                            name,
                            phoneNumber,
                            topic,
                            requestId,
                            dateOfRequest,
                          } = request;
                          return (
                            <tr key={requestId}>
                              <td>{name}</td>
                              <td>{phoneNumber}</td>
                              <td>{topic}</td>
                              <td>{dateOfRequest.slice(0, 10)}</td>
                              <td>
                                <ViewTeacherRequestDetails request={request} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default TeachersRequest;
