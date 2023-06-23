import React from "react";
import TeacherNavBar from "./NavBar/TeacherNavBar";
import { useState } from "react";
function ChangeTeacherPassword() {
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [message, setMessage] = useState("");
  const [messageBox, setMessageBox] = useState(false);
  const [color, setColor] = useState("");
  const [fetching, setFetching] = useState(false);

  const changePassword = async (e) => {
    setFetching(true);
    setMessage("");
    e.preventDefault();
    const tid = localStorage.id;
    const body = {
      tid,
      currentPassword,
      newPassword,
      confirmPassword,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.Token,
          },
          body: JSON.stringify(body),
        }
      );
      const res = await response.json();
      if (res.Status) {
        setMessageBox(true);
        setMessage(res.message);
        setColor("text-success");
        setFetching(false);
        setConfirmPassword("");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessageBox(true);
        setMessage(res.message);
        setColor("text-danger");
        setFetching(false);
        setConfirmPassword("");
        setCurrentPassword("");
        setNewPassword("");
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };

  return (
    <>
      <TeacherNavBar />
      <div className="row ">
        <div className="col-2"></div>
        <div className="col-10"></div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-10">
            {messageBox ? (
              <h6
                className={`fw-normal my-4 pb-3 ${color}`}
                style={{ letterSpacing: "1px" }}
              >
                {message}
              </h6>
            ) : (
              <h5
                className="fw-normal my-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Please enter the following details!
              </h5>
            )}
            <form
              onSubmit={(e) => {
                changePassword(e);
              }}
            >
              <div className="mb-4">
                <div className="form-outline">
                  <input
                    type="password"
                    className="form-control bg-light"
                    required
                    autoComplete="off"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    value={currentPassword}
                  />
                  <label className="form-label">Current Password</label>
                </div>
              </div>
              <div className="form-outline mb-4">
                <input
                  type="password"
                  className="form-control bg-light"
                  required
                  autoComplete="off"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
                <label className="form-label">New Password</label>
              </div>
              <div className="mb-4">
                <div className="form-outline">
                  <input
                    type="password"
                    className="form-control bg-light"
                    required
                    autoComplete="off"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                  <label className="form-label">Confirm New Password</label>
                </div>
              </div>
              {fetching ? (
                <button
                  className="btn btn-primary btn-block mb-4 mt-2"
                  type="button"
                  disabled
                >
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
                  Change Password
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default ChangeTeacherPassword;
