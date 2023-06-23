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
function LoginPage({ handleUserAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [errorBox, setErrorBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailLabel, setEmailLabel] = useState("");

  const timeout = (delay) => {
    return new Promise((res) => setTimeout(res, delay));
  };
  const LoginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await timeout(1000); //for 1 sec delay

    const body = { email, password, user };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/${user}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const gotData = await response.json();
      if (gotData.code === 400) {
        setIsLoading(false);
        setError(gotData.error);
        setErrorBox(true);
      } else if (gotData.Token) {
        localStorage.setItem("User", user);
        localStorage.setItem("Token", gotData.Token);
        localStorage.setItem("imageURL", gotData.imageURL);
        localStorage.setItem("id", gotData.id);
        setErrorBox(false);
        handleUserAuth(user);
        window.location.href = `${user}-dashboard`;
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="bg-color">
        <div className="container pt-5 ">
          <div className="pt-5 justify-content-center d-flex">
            <h3>
              <MDBBadge>LOGIN AS</MDBBadge>
            </h3>
          </div>
          <div className="container-fluid pt-2 justify-content-center d-flex">
            <MDBBtnGroup size="lg" aria-label="Basic example">
              <button
                className="btn btn-light btn-outline"
                onClick={() =>
                  setUser("student") &
                  setLogin(false) &
                  setEmailLabel("Student Email")
                }
              >
                Student
              </button>
              <button
                className="btn btn-light btn-outline"
                onClick={() =>
                  setUser("teacher") &
                  setLogin(false) &
                  setEmailLabel("Teacher Email")
                }
              >
                Teacher
              </button>
              <button
                className="btn btn-light btn-outline"
                onClick={() =>
                  setUser("admin") &
                  setLogin(false) &
                  setEmailLabel(`Admin Email`)
                }
              >
                Admin
              </button>
            </MDBBtnGroup>
          </div>
          {login ? (
            <div>
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
                              <h5 className="text-center text-success pt-3 font-light">
                                Welcome to the School Management system
                              </h5>
                              <h5
                                className="fw-normal text-center text-danger my-5"
                                style={{ letterSpacing: "1px" }}
                              >
                                Please select a User type from above to login as
                              </h5>
                            </MDBCardBody>
                          </MDBCol>
                        </MDBRow>
                      </MDBCard>
                    </MDBContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                            {errorBox ? (
                              <h6
                                className="fw-normal my-4 pb-3 text-danger"
                                style={{ letterSpacing: "1px" }}
                              >
                                {error}
                              </h6>
                            ) : (
                              <h5
                                className="fw-normal my-4 pb-3"
                                style={{ letterSpacing: "1px" }}
                              >
                                Login into your account
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
                            <MDBInput
                              autoComplete="off"
                              required
                              wrapperClass="mb-4"
                              label="Password"
                              type="password"
                              size="lg"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
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
                                  LoginUser(e) & setErrorBox(false)
                                }
                                className="mb-4 px-5"
                                color="dark"
                                size="lg"
                              >
                                Login
                              </MDBBtn>
                            )}

                            <a
                              className="small text-muted"
                              href="/forgot-password"
                            >
                              Forgot password?
                            </a>
                          </MDBCardBody>
                        </MDBCol>
                      </MDBRow>
                    </MDBCard>
                  </MDBContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default LoginPage;
