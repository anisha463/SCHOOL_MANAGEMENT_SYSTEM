import "./styles/LoginPageColor.css";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
function LoginPage({ handleUserAuth }) {
  return (
    <>
      <div className="row justify-content-center pt-5 mt-5 ">
        <div className="col-8 mt-5 pt-5">
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
                    <MDBCardBody className="flex-column pt-5">
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <h3
                        className="fw-normal mt-5 pb-5 text-danger text-center"
                        style={{ letterSpacing: "1px" }}
                      >
                        404.. Page Not Found !
                      </h3>
                      <p align="center">
                        <button
                          onClick={() => (window.location.href = "/")}
                          className="btn btn-primary mb-4 px-5"
                        >
                          Return Home?
                        </button>
                      </p>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBContainer>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
