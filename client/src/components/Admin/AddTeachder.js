import React, { useEffect } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
import { useState } from "react";
import storage from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
function AddTeachder() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [name, setName] = useState(null);
  const [phnumber, setPhNumber] = useState(null);
  const [address, setAddress] = useState(null);
  const [dob, setDob] = useState(null);
  const [email, setEmail] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
  );
  const [subjectsList, setSubjectsList] = useState([{}]);
  const [subjectId, setSubjectId] = useState();
  const [addMoreTeacher, setAddMoreTeacher] = useState(false);
  const [classList, setClassList] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);

  const uploadImage = async () => {
    if (imageUpload == null) return;
    setImageUploading(true);
    const imageName = await uuid();
    const imageRef = ref(storage, `images/${imageName}`);
    await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url);
        setImageUploading(false);
      });
    });
  };
  const addTeacher = async (e) => {
    e.preventDefault();

    const body = {
      name,
      email,
      phnumber,
      address,
      imageUrl,
      subjectId,
      dob,
      selectedClasses,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/add-teacher`,
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
        setAddMoreTeacher(true);
      } else {
        alert("something went wrong");
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      alert("something went wrong");
      console.log(error.message);
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };
  const getSubjectsList = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/subject-list`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setSubjectsList(gotList.List);
      } else {
        alert("Something Went Wrong");
        localStorage.removeItem("Token");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
      window.location.href = "/";
    }
  };
  const setIt = () => {
    setImageUpload(null);
    setSubjectId(null);
    setName(null);
    setPhNumber(null);
    setAddress(null);
    setDob(null);
    setEmail(null);
    setImageUrl(
      "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
    );
    setFetched(false);
    setAddMoreTeacher(false);
    setSelectedClasses([]);
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (checked) {
      setSelectedClasses([...selectedClasses, value]);
    } else {
      setSelectedClasses(selectedClasses.filter((e) => e !== value));
    }
  };
  const getClassesList = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/taught-in`,
        {
          method: "GET",
          headers: { token: localStorage.Token, subjectId: subjectId },
        }
      );
      const data = await response.json();
      console.log(data.Status);
      if (data.Status) {
        setClassList(data.List);
        setFetched(true);
        console.log("here 1");
        console.log(classList);
      } else {
        alert("something went wrong");
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      alert("something went wrong");
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };
  useEffect(() => {
    getSubjectsList();
  }, []);

  return (
    <>
      <AdminNavBar />
      <div className="row ">
        <div className="col-2"></div>
        <div className="col-10"></div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-10">
            {addMoreTeacher ? (
              <div>
                <div className="mb-4 mt-5">
                  <h4 className="text-success text-center mt-3 fs-4">
                    The Following Teacher Has Been Added
                  </h4>
                </div>
                <div>
                  <img
                    src={imageUrl}
                    className="rounded-circle mx-auto d-block mb-4"
                    alt="error"
                    height="250"
                  />
                </div>
                <form className="mt-5 pt-5 ">
                  <div className="mb-4">
                    <div className="form-outline">
                      <label>Full Name</label>
                      <input
                        disabled
                        type="text"
                        className="form-control bg-light"
                        required
                        autoComplete="off"
                        value={name}
                      />
                    </div>
                  </div>
                  <div className="form-outline mb-4">
                    <label>Ph No.</label>
                    <input
                      disabled
                      type="number"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      value={phnumber}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <label>Address</label>
                    <input
                      type="text"
                      disabled
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      value={address}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <label>Email</label>
                    <input
                      disabled
                      type="email"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      value={email}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label>DOB: </label>
                    <input
                      disabled
                      className="mx-3"
                      type="date"
                      required
                      autoComplete="off"
                      value={dob}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <label>Subject</label>

                    <select
                      className="form-select bg-light"
                      aria-label="Default select example"
                      autoComplete="off"
                      required
                      disabled
                      value={subjectId}
                    >
                      <option selected>Please Click To Select A Subject</option>
                      {subjectsList.map((subject) => (
                        <option key={subject.subjectId}>
                          {subject.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h5 className=" ">
                      The Teacher will teach in the following classes:
                    </h5>

                    {selectedClasses.map((selected) => (
                      <h5 className="text-warning" key={selected}>
                        Class {selected}
                      </h5>
                    ))}
                  </div>

                  <button disabled className="btn btn-primary btn-block mb-4">
                    Teacher Added !
                  </button>
                </form>
                <div className="text-center justify-content-center mb-4">
                  <button
                    onClick={() => {
                      setIt();
                    }}
                    className="btn btn-primary mb-5"
                  >
                    Add More ?
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  addTeacher(e);
                }}
                className="mt-5 pt-5 "
              >
                <div className="mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label className="form-label">Full Name</label>
                  </div>
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="number"
                    className="form-control bg-light"
                    required
                    autoComplete="off"
                    onChange={(e) => setPhNumber(e.target.value)}
                  />
                  <label className="form-label">Phone Number</label>
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    className="form-control bg-light"
                    required
                    autoComplete="off"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <label className="form-label">Address</label>
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="email"
                    className="form-control bg-light"
                    required
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="form-label">Email</label>
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label bg-light">Date of Birth</label>
                  <input
                    className="mx-3"
                    type="date"
                    min="1985-01-01"
                    max="2008-12-31"
                    required
                    autoComplete="off"
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div className="form-outline mb-4">
                  {fetched ? (
                    <>
                      <label>Subject</label>
                      <select
                        className="form-select bg-light"
                        aria-label="Default select example"
                        autoComplete="off"
                        required
                        disabled
                        value={subjectId}
                      >
                        <option selected>
                          Please Click To Select A Subject
                        </option>
                        {subjectsList.map((subject) => (
                          <option key={subject.subjectId}>
                            {subject.subjectName}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <div>
                      <select
                        className="form-select bg-light"
                        aria-label="Default select example"
                        autoComplete="off"
                        required
                        onChange={(e) => setSubjectId(e.target.value)}
                      >
                        <option selected>
                          Please Click To Select A Subject
                        </option>
                        {subjectsList.map((subject) => (
                          <option key={subject.subjectId}>
                            {subject.subjectName}
                          </option>
                        ))}
                      </select>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            getClassesList();
                          }}
                          className="btn btn-warning mt-5"
                        >
                          Confirm Subject?
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {fetched ? (
                  <>
                    <div className="form-outline mb-4 mt-2">
                      <label>
                        Select Which Class/Classes will this teacher teach:
                        &nbsp;
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
                    <div>
                      {imageUploading ? (
                        <div
                          className="spinner-border mx-auto d-block mb-4"
                          style={{ width: "3rem", height: "3rem" }}
                          role="status"
                        >
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <img
                          src={imageUrl}
                          className="rounded-circle mx-auto d-block mb-4"
                          alt="error"
                          height="250"
                        />
                      )}
                    </div>

                    <div className="form-outline mb-4">
                      <center>
                        <input
                          className=""
                          type="file"
                          onChange={(e) => {
                            setImageUpload(e.target.files[0]);
                          }}
                          required
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          className="btn btn-info"
                          onClick={uploadImage}
                        >
                          Upload
                        </button>
                      </center>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4"
                    >
                      Add Teacher
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default AddTeachder;
