import React, { useEffect } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
import { useState } from "react";

function AddSubject() {
  const [subjectName, setSubjectName] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);
  const [addMoreSubject, setAddMoreSubject] = useState(true);
  const [registeredSubjects, setRegisteredSubjects] = useState(0);
  const [registeredSubjectsLoader, setRegisteredSubjectsLoader] =
    useState(false);
  const [classList, setClassList] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [showError, setShowError] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [gettingClasses, setGettingClasses] = useState(true);
  const addMoreSubjectFunc = () => {
    setSelectedClasses([]);
    setAddMoreSubject(true);
  };

  const timeout = (delay) => {
    return new Promise((res) => setTimeout(res, delay));
  };
  const getRegisteredSubjects = async () => {
    setRegisteredSubjectsLoader(true);
    await timeout(1000); // 1 second time out, fancy lol.;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/total-subjects`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
          },
        }
      );
      const gotData = await response.json();
      if (!gotData.Status) {
        setRegisteredSubjectsLoader(true);
      } else if (gotData.Status) {
        setRegisteredSubjects(gotData.total);
        setRegisteredSubjectsLoader(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const checkSubject = async () => {
    setErrorText("");
    setShowError(false);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/check-subject`,
        {
          method: "GET",
          headers: { token: localStorage.Token, subjectName: subjectName },
        }
      );
      const data = await response.json();
      if (data.Status) {
        return true;
      } else {
        setErrorText(data.error);
        setShowError(true);
        return false;
      }
    } catch (error) {}
  };
  const addSubject = async (e) => {
    e.preventDefault();
    setButtonLoader(true);
    setRegisteredSubjectsLoader(true);
    const check = await checkSubject();
    if (!check) {
      getRegisteredSubjects();
      setButtonLoader(false);
      return;
    }

    const body = { subjectName, selectedClasses };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/add-subject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.Token,
          },
          body: JSON.stringify(body),
        }
      );
      const gotData = await response.json();
      if (!gotData.Status) {
        setButtonLoader(false);
      } else if (gotData.Status) {
        getRegisteredSubjects();
        setButtonLoader(false);
        setAddMoreSubject(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const getClassesList = async () => {
    setGettingClasses(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/class-list`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const data = await response.json();
      if (data.Status) {
        setClassList(data.List);
        setGettingClasses(false);
      } else {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (checked) {
      setSelectedClasses([...selectedClasses, value]);
    } else {
      setSelectedClasses(selectedClasses.filter((e) => e !== value));
      setSelectedClasses(selectedClasses.filter((e) => e !== value));
    }
  };
  useEffect(() => {
    getRegisteredSubjects();
    getClassesList();
  }, []);
  return (
    <>
      <AdminNavBar />
      <div className="row">
        <div className="col-2"></div>
        <div className="col-10"></div>
        <div className="row">
          <div className="col-2"></div>
          {addMoreSubject ? (
            <div className="col-4">
              <div className="mt-5">
                <h3 className="text-primary  text-center mt-2">
                  Enter Subject Details
                </h3>
                {showError ? (
                  <h6 className="text-danger text-center mx-2 ">{errorText}</h6>
                ) : (
                  <></>
                )}
              </div>
              <form onSubmit={(e) => addSubject(e)}>
                <div className="form-outline mt-2 ">
                  <input
                    autoComplete="off"
                    name="subjectName"
                    onChange={(e) => {
                      setSubjectName(e.target.value);
                    }}
                    type="text"
                    className="form-control bg-light"
                    required
                  />
                  <label className="form-label">
                    Please Enter The Subject Name
                  </label>
                </div>
                {gettingClasses ? (
                  <div className="form-outline mb-4 mt-2">
                    <h3 hidden className="text-primary text-center">
                      .......
                    </h3>
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between px-md-1">
                          <div
                            className="spinner-grow text-center pb-3"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="form-outline mb-4 mt-2">
                    <label>
                      Select Which Class/Classes will Study this subject: &nbsp;
                    </label>
                    {classList.map((classes) => (
                      <>
                        <br />
                        <input
                          type="checkbox"
                          name="classes"
                          autoComplete="off"
                          value={classes.classId}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          className="fs-3"
                        />
                        <label className="fs-5">
                          &nbsp; Class {classes.classId}
                        </label>
                        &nbsp;
                      </>
                    ))}
                  </div>
                )}

                {buttonLoader ? (
                  <button
                    className="btn btn-primary btn-block mt-4"
                    type="submit"
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Loading...</span>
                  </button>
                ) : (
                  <button type="submit">Add Subject?</button>
                )}
              </form>
            </div>
          ) : (
            <div className="col-4 mt-5">
              <div className="card mt-5">
                <div className="card-body ">
                  <h4 className="card-title">
                    The Following Subject Has Been Added
                  </h4>
                  <h5 className="card-text text-success">
                    Subject Name: {subjectName}
                  </h5>
                  <h5 className=" ">For the below mentioned classes:</h5>

                  {selectedClasses.map((selected) => (
                    <h5 className="text-warning" key={selected}>
                      Class {selected}
                    </h5>
                  ))}
                  <div className="">
                    <button
                      onClick={() => {
                        addMoreSubjectFunc();
                      }}
                      type="button"
                      className="btn btn-primary justify-content-center"
                    >
                      Add More?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!registeredSubjectsLoader ? (
            <div className="col-xl-4 col-sm-4 col-4 mx-4 mt-5">
              <h3 className="text-primary text-center">Total Subjects</h3>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between px-md-1">
                    <div>
                      <h3 className="text-info">{registeredSubjects}</h3>
                      <p className="mb-0">Total Registered Subjects </p>
                    </div>
                    <div className="align-self-center">
                      <i className="fas fa-book-open text-info fa-3x"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-xl-4 col-sm-4 col-4 mx-4 mt-4">
              <h3 hidden className="text-primary text-centermx-4 mt-4">
                .......
              </h3>
              <div className="card mx-4 mt-4">
                <div className="card-body mx-4 mt-4">
                  <div className="d-flex justify-content-between px-md-1mx-4 mt-4">
                    <div
                      className="spinner-grow text-center pb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default AddSubject;
