import React, { useEffect, useState } from "react";
import TeacherNavBar from "./NavBar/TeacherNavBar";
import ViewRequestDetails from "./ViewRequestDetails";

function CheckPrevRequest() {
  const [fetching, setFetching] = useState(false);
  const [requestList, setRequestList] = useState([{}]);
  const [loaded, setLoaded] = useState(false);

  const getRequests = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/check-requests`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            id: localStorage.id,
          },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setRequestList([...gotList.List]);
        setTimeout(() => {
          setLoaded(true);
          setFetching(false);
        }, 1000);
      } else {
        setRequestList([]);
        setTimeout(() => {
          setLoaded(true);
          setFetching(false);
        }, 1000);
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      alert("Something Went Wrong");
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <>
      <TeacherNavBar />
      <div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-10">
            {fetching ? (
              <div
                className="spinner-border m-5 justify-content-center"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
                {loaded ? (
                  <div>
                    <h5 className="text-primary text-center">
                      Viewing Requests Made to The Admin{" "}
                    </h5>
                    {requestList.length === 0 ? (
                      <>
                        <div className="text-center text-danger">
                          <h5 className="text-danger">No Requests</h5>
                        </div>
                      </>
                    ) : (
                      <>
                        {" "}
                        <table className="text-dark table  text-center mb-5 ">
                          <thead className="bg-dark text-light">
                            <tr>
                              <th>Topic</th>
                              <th>Date</th>
                              <th>View Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requestList.map((request) => {
                              const { topic, dateOfRequest, requestId } =
                                request;
                              return (
                                <tr key={requestId}>
                                  <td>{topic}</td>
                                  <td>{dateOfRequest.slice(0, 10)}</td>
                                  <td>
                                    <ViewRequestDetails request={request} />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    )}
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
export default CheckPrevRequest;
