import React, { useEffect, useState } from "react";
import TeacherNavBar from "./NavBar/TeacherNavBar";

function CreateTeacherAnn() {
  const [fetching, setFetching] = useState(false);
  const [added, setAdded] = useState(false);
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState(null);
  const handleClick = () => {
    setAdded(false);
    setTopic("");
    setContent("");
    setFetching(false);
    setClassId(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFetching(true);
    const body = { topic, content, classId };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/add-announcement`,
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

  const getClassList = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/teaches-in`,
        {
          method: "GET",
          headers: { token: localStorage.Token, tid: localStorage.id },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setClassList([...gotList.List]);
      } else {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
    }
  };
  useEffect(() => {
    getClassList();
  }, []);

  return (
    <>
      <TeacherNavBar />

      <div className="row">
        <div className="col-2"></div>
        <div className="col-10">
          <div className="row content-justify-center">
            <div className="col-2"></div>
            <div className="col-7">
              {added ? (
                <>
                  <h5 className="text-center text-success mt-3 pt-4 mb-3">
                    The Following Announcement Was Added For{" "}
                    <span className="text-danger">Class {classId}</span>
                  </h5>

                  <div className="form-outline mb-4">
                    <label>Topic</label>
                    <input
                      disabled
                      type="text"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      value={topic}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <label>Content</label>
                    <textarea
                      disabled
                      className="form-control bg-light"
                      id="exampleFormControlTextarea1"
                      rows="10"
                      value={content}
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
                  <div className="row mt-5 pt-5 justify-content-center">
                    <div className="col-2"></div>
                    <div className="col-1"></div>

                    <div className="col-11 ">
                      <h4 className="text-info text-center mb-3">
                        Please Select A Class To Create Announcement
                      </h4>
                      <div className="form-outline mb-3">
                        <select
                          className="form-select bg-light"
                          aria-label="Default select example"
                          autoComplete="off"
                          required
                          value={classId}
                          onChange={(e) => setClassId(e.target.value)}
                        >
                          <option selected>
                            Please Click To Select A Class
                          </option>
                          {classList.map((classes) => (
                            <option key={classes.classId}>
                              {" "}
                              {classes.class}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <h5 className="text-center text-info mt-5 pt-5 mb-2">
                    Enter Details Of The Announcement
                  </h5>
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <div className="form-outline mb-4">
                      <label>Topic</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        required
                        autoComplete="off"
                        onChange={(e) => {
                          setTopic(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-outline mb-4">
                      <label>Content</label>
                      <textarea
                        required
                        className="form-control bg-light"
                        id="exampleFormControlTextarea1"
                        rows="10"
                        onChange={(e) => {
                          setContent(e.target.value);
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
      </div>
    </>
  );
}
export default CreateTeacherAnn;
