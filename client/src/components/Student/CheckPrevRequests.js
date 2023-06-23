import React, { useState } from "react";
import StudentNavBar from "./NavBar/StudentNavBar";
import ViewRequestDetails from "./ViewRequestDetails";

function CheckPrevRequests() {
  const [fetching, setFetching] = useState(false);
  const [requestList, setRequestList] = useState([{}]);
  const [loaded, setLoaded] = useState(false);
  const [loaded2, setLoaded2] = useState(true);
  const [choice1, setChoice1] = useState(null);

  const choice = [
    { name: "Admin", id: 1 },
    { name: "Teacher", id: 2 },
  ];
  const [selectedChoice, setSelectedChoice] = useState(null);

  const getRequests = async () => {
    setLoaded2(false);
    setLoaded(false);
    setRequestList([{}]);
    if (selectedChoice === "Admin") {
      try {
        const list = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/student/check-requests-to-admin-by-student`,
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
          setTimeout(() => {
            setRequestList([...gotList.List]);
            setLoaded(true);
            setLoaded2(true);
            setChoice1(selectedChoice);
            setFetching(false);
          }, 1000);
        } else {
          setRequestList([]);
          setLoaded(true);
          setLoaded2(true);
          setFetching(false);
          // localStorage.removeItem("Token");
          // localStorage.removeItem("User");
          // window.location.href = "/";
        }
      } catch (error) {
        alert(`Something went wrong`);
        setRequestList([]);
        setLoaded(true);
        setLoaded2(true);
        setFetching(false);
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } else {
      try {
        const list = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/student/check-requests`,
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
          setTimeout(() => {
            setRequestList([...gotList.List]);
            console.log(requestList);
            setLoaded(true);
            setLoaded2(true);
            setChoice1(selectedChoice);
            setFetching(false);
          }, 1000);
        } else {
          setRequestList([]);
          setLoaded(true);
          setLoaded2(true);
          setFetching(false);
          // localStorage.removeItem("Token");
          // localStorage.removeItem("User");
          // window.location.href = "/";
        }
      } catch (error) {
        alert(`Something went wrong`);

        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    }
  };

  return (
    <>
      <StudentNavBar />
      <div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-9 justify-content-center">
            {fetching ? (
              <>
                <div
                  className="spinner-border m-5 justify-content-center"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </>
            ) : (
              <>
                <div className="my-5 text-center">
                  <h5 className="text-info text-center">
                    Select either Admin or Teacher to view previous requests
                  </h5>
                </div>

                <div className="form-outline mb-3">
                  <select
                    className="form-select bg-light"
                    aria-label="Default select example"
                    autoComplete="off"
                    required
                    value={selectedChoice}
                    onChange={(e) => setSelectedChoice(e.target.value)}
                  >
                    <option selected>Please Click To Select A Choice</option>
                    {choice.map((choices) => (
                      <option key={choices.tid}>{choices.name}</option>
                    ))}
                  </select>
                  <div>
                    {loaded2 ? (
                      <p align="right" className="mt-4">
                        <button
                          onClick={getRequests}
                          className=" btn btn-warning "
                        >
                          View
                        </button>
                      </p>
                    ) : (
                      <p align="right" className="mt-4">
                        <button
                          class="btn btn-warning text-dark"
                          type="button"
                          disabled
                        >
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </button>
                      </p>
                    )}
                  </div>
                </div>

                {loaded ? (
                  <div>
                    <h6 className="text-primary">
                      Viewing Requests Made to The {choice1}
                    </h6>
                    {requestList.length === 0 ? (
                      <>
                        <div className="mt-5 text-center">
                          <h5 className="text-danger text-center">
                            No Requests
                          </h5>
                        </div>
                      </>
                    ) : (
                      <>
                        {choice1 === "Admin" ? (
                          <>
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
                        ) : (
                          <>
                            {" "}
                            <table className="text-dark table  text-center mb-5 ">
                              <thead className="bg-dark text-light">
                                <tr>
                                  <th>Teacher Name</th>
                                  <th>Topic</th>
                                  <th>Date</th>
                                  <th>View Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                {requestList.map((request) => {
                                  const {
                                    topic,
                                    dateOfRequest,
                                    requestId,
                                    name,
                                  } = request;
                                  return (
                                    <tr key={requestId}>
                                      <th>{name}</th>
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
export default CheckPrevRequests;
