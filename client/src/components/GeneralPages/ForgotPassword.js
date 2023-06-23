import React, { useState } from "react";
import "./styles/LoginPageColor.css";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBBadge,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [login, setLogin] = useState(false);
  const [user, setUser] = useState("student");
  const [message, setMessage] = useState("");
  const [messageBox, setMessageBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailLabel, setEmailLabel] = useState("Student Email");

  const timeout = (delay) => {
    return new Promise((res) => setTimeout(res, delay));
  };
  const ForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await timeout(1000); //for 1 sec delay

    const body = { email, user };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/${user}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const gotData = await response.json();
      if (gotData.Status) {
        setIsLoading(false);
        setMessage(gotData.message);
        setMessageBox(true);
      } else {
        setMessageBox(false);
      }
    } catch (message) {
      console.log(message.message);
    }
  };
  return (
    <>
      <div className="bg-color">
        <div className="container pt-5 ">
          <div className="pt-5 justify-content-center d-flex">
            <h3>
              <MDBBadge>SELECT YOUR ROLE</MDBBadge>
            </h3>
          </div>
          <div className="container-fluid pt-2 justify-content-center d-flex">
            <MDBBtnGroup size="lg" aria-label="Basic example">
              <button
                className="btn btn-light btn-outline"
                onClick={
                  () => setUser("student") & setEmailLabel("Student Email")
                  //setLogin(false) &
                }
              >
                Student
              </button>
              <button
                className="btn btn-light btn-outline"
                onClick={
                  () => setUser("teacher") & setEmailLabel("Teacher Email")
                  //   setLogin(false) &
                }
              >
                Teacher
              </button>
              <button
                className="btn btn-light btn-outline"
                onClick={
                  () => setUser("admin") & setEmailLabel(`Admin Email`)
                  //   setLogin(false) &
                }
              >
                Admin
              </button>
            </MDBBtnGroup>
          </div>
          <div className="row justify-content-center pt-5 ">
            <div className="col-8">
              <div className="mb-3">
                <MDBContainer>
                  <MDBCard>
                    <MDBRow className="g-0">
                      <MDBCol md="6">
                        <MDBCardImage
                          src="https://o7services.com/wp-content/uploads/2021/01/school-mgmt-system.jpg"
                          alt="login form"
                          className="rounded-start w-100"
                        />
                      </MDBCol>

                      <MDBCol md="6">
                        <MDBCardBody className="d-flex flex-column">
                          {messageBox ? (
                            <h6
                              className="fw-normal my-4 pb-3 text-danger"
                              style={{ letterSpacing: "1px" }}
                            >
                              {message}
                            </h6>
                          ) : (
                            <h5
                              className="fw-normal my-4 pb-3"
                              style={{ letterSpacing: "1px" }}
                            >
                              Please enter your Email registered with us!
                            </h5>
                          )}

                          <MDBInput
                            autoComplete="off"
                            required
                            wrapperClass="mb-4"
                            label={emailLabel}
                            type="email"
                            size="lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />

                          {isLoading ? (
                            <div className="justify-content-center ps-3 pb-3">
                              <MDBSpinner role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </MDBSpinner>
                            </div>
                          ) : (
                            <MDBBtn
                              onClick={(e) =>
                                ForgotPassword(e) & setMessageBox(false)
                              }
                              className="mb-4 px-5"
                              color="dark"
                              size="lg"
                            >
                              Submit
                            </MDBBtn>
                          )}

                          <a className="small text-muted" href="/">
                            Back to Login?
                          </a>
                        </MDBCardBody>
                      </MDBCol>
                    </MDBRow>
                  </MDBCard>
                </MDBContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ForgotPassword;
