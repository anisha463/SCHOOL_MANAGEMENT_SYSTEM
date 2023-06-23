import React, { useState } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";

function FeeChallan() {
  const [fetching, setFetching] = useState(false);
  const [added, setAdded] = useState(false);
  const [amount, setAmount] = useState("");
  const [session, setSession] = useState("");
  const [description, setDescription] = useState("");
  const handleClick = () => {
    setAdded(false);
    setAmount("");
    setDescription("");
    setSession("");
    setFetching(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFetching(true);
    const body = { amount, description, session };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/create-fee-challan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.Token,
            id: localStorage.id,
          },
          body: JSON.stringify(body),
        }
      );
      const res = await response.json();
      if (res.Status) {
        setFetching(false);
        setAdded(true);
      } else {
        alert("Something Went Wrong");
      }
    } catch (error) {
      alert(
        `Something Went Wrong, I'm in the Catch block of Try And Catch, ${error.message}`
      );
    }
  };
  return (
    <>
      <AdminNavBar />
      <div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-10"></div>
        </div>
        <div className="row content-justify-center">
          <div className="col-2"></div>
          <div className="col-7">
            {added ? (
              <>
                <h5 className="text-center text-success mt-5 pt-5">
                  The Following Challan Was Created
                </h5>

                <div className="form-outline mb-4">
                  <label>Amount</label>
                  <input
                    disabled
                    type="number"
                    className="form-control bg-light"
                    required
                    autoComplete="off"
                    value={amount}
                  />
                </div>
                <div className="form-outline mb-4">
                  <label>Session</label>
                  <input
                    disabled
                    type="text"
                    className="form-control bg-light"
                    required
                    autoComplete="off"
                    value={session}
                  />
                </div>
                <div className="form-outline mb-4">
                  <label>Description</label>
                  <textarea
                    disabled
                    className="form-control bg-light"
                    id="exampleFormControlTextarea1"
                    rows="10"
                    value={description}
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block mb-4 mt-2"
                  onClick={handleClick}
                >
                  Add More?
                </button>
              </>
            ) : (
              <>
                <h5 className="text-center text-info mt-5 pt-5">
                  Please Enter The Details Of The Challan
                </h5>
                <form
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                >
                  <div className="form-outline mb-4">
                    <label>Amount</label>
                    <input
                      type="number"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <label>Session</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      onChange={(e) => {
                        setSession(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <label>Description</label>
                    <textarea
                      required
                      className="form-control bg-light"
                      id="exampleFormControlTextarea1"
                      rows="10"
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    ></textarea>
                  </div>
                  {fetching ? (
                    <button
                      className="btn btn-primary btn-block mb-4 mt-2"
                      type="button"
                      disabled
                    >
                      Creating...{" "}
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4 mt-2"
                    >
                      Create
                    </button>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default FeeChallan;
