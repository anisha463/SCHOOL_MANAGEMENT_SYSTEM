import React, { useEffect, useState } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
import ViewChallanDetails from "./ViewChallanDetails";

function ViewFeeChallan() {
  const [fetching, setFetching] = useState(true);
  const [challanList, setChallanList] = useState([{}]);

  const getFeeChallan = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/view-fee-challan`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setChallanList([...gotList.List]);

        setTimeout(() => {
          setFetching(false);
        }, 1000);
      } else {
        setFetching(false);
        setChallanList([]);
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      setFetching(false);
      setChallanList([]);
      alert("Something went wrong");
      // console.log(error.message);
      // localStorage.removeItem("Token");
    }
  };

  useEffect(() => {
    getFeeChallan();
  }, []);

  return (
    <>
      <AdminNavBar />
      <div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-10">
            <div>
              <h4 className="text-info text-center">Challans List</h4>
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
                {challanList.length === 0 ? (
                  <>
                    <div className="my-3 text-center">
                      <h5 className="text-danger">No Challans Available</h5>
                    </div>
                  </>
                ) : (
                  <>
                    <table className="text-dark table  text-center mb-5 ">
                      <thead className="bg-dark text-light">
                        <tr>
                          <th>Date Of Challan</th>
                          <th>Session</th>
                          <th>Amount</th>
                          <th>View Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {challanList.map((challan) => {
                          const { challanNo, amount, session, dateOfChallan } =
                            challan;
                          return (
                            <tr key={challanNo}>
                              <td>{dateOfChallan.slice(0, 10)}</td>
                              <td>{session}</td>
                              <td>{amount}</td>
                              <td>
                                <ViewChallanDetails challan={challan} />
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
export default ViewFeeChallan;
