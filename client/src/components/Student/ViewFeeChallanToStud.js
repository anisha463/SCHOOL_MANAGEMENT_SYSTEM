import React, { useEffect, useState } from "react";
import StudentNavBar from "./NavBar/StudentNavBar";
import PayFee from "./PayFee";
import ViewChallanDetails from "./ViewChallanDetails";

function ViewFeeChallanToStud() {
  const [fetching, setFetching] = useState(true);
  const [challanList, setChallanList] = useState([{}]);

  const getFeeChallan = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/view-fee-challan`,
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
        setChallanList([]);
        setFetching(false);
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      setChallanList([]);
      setFetching(false);
      alert("Something went wrong");
      localStorage.removeItem("Token");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    getFeeChallan();
  }, []);

  return (
    <>
      <StudentNavBar />
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
                    <div className="mt-5 pt-5 text-center">
                      <h5 className="text-center text-danger">
                        No challans available at the moment
                      </h5>
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
                          <th>Pay</th>
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
                              <td>
                                <PayFee challan={challan} />
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
export default ViewFeeChallanToStud;
