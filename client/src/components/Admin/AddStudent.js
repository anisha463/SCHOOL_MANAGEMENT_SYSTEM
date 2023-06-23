import React, { useEffect } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
import { useState } from "react";
import storage from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
function AddStudent() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [name, setName] = useState(null);
  const [fatherName, setFatherName] = useState(null);
  const [motherName, setMotherName] = useState(null);
  const [phnumber, setPhNumber] = useState(null);
  const [address, setAddress] = useState(null);
  const [dob, setDob] = useState(null);
  const [email, setEmail] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
  );
  const [classList, setClassList] = useState([{}]);
  const [classId, setClassId] = useState();
  const [addMoreStudent, setaddMoreStudent] = useState(false);
  //   const [classList, setClassList] = useState([]);

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
  const addStudent = async (e) => {
    e.preventDefault();

    const body = {
      name,
      phnumber,
      address,
      dob,
      fatherName,
      motherName,
      email,
      imageUrl,
      classId,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/add-student`,
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
        setaddMoreStudent(true);
      } else {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.href = "/";
    }
  };
  const getClassList = async () => {
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/class-list`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setClassList(gotList.List);
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
  const setIt = () => {
    setImageUpload(null);
    setClassId(null);
    setName(null);
    setFatherName(null);
    setMotherName(null);
    setPhNumber(null);
    setAddress(null);
    setDob(null);
    setEmail(null);
    setImageUrl(
      "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
    );

    setaddMoreStudent(false);
  };
  useEffect(() => {
    getClassList();
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
            {addMoreStudent ? (
              <div>
                <div className="mb-4 mt-5">
                  <h4 className="text-success text-center mt-3 fs-4">
                    The Following Student Has Been Added
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
                  <div className="mb-4">
                    <div className="form-outline">
                      <label>Father's Name</label>
                      <input
                        disabled
                        type="text"
                        className="form-control bg-light"
                        required
                        autoComplete="off"
                        value={fatherName}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="form-outline">
                      <label>Mother's Name</label>
                      <input
                        disabled
                        type="text"
                        className="form-control bg-light"
                        required
                        autoComplete="off"
                        value={motherName}
                      />
                    </div>
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
                    <label>Class</label>
                    <select
                      className="form-select bg-light"
                      aria-label="Default select example"
                      autoComplete="off"
                      required
                      disabled
                      value={classId}
                    >
                      <option selected>Please Click To Select A Class</option>
                      {classList.map((classes) => (
                        <option key={classes.classId}>{classes.classId}</option>
                      ))}
                    </select>
                  </div>

                  <button disabled className="btn btn-primary btn-block mb-4">
                    Student Added !
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
                  addStudent(e);
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
                      value={name}
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
                    value={phnumber}
                    onChange={(e) => setPhNumber(e.target.value)}
                  />
                  <label className="form-label">Phone Number</label>
                </div>
                <div className="mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                    />
                    <label className="form-label">Father's Name</label>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      className="form-control bg-light"
                      required
                      autoComplete="off"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                    />
                    <label className="form-label">Mother's Name</label>
                  </div>
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    className="form-control bg-light"
                    required
                    autoComplete="off"
                    value={address}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="form-label">Email</label>
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label bg-light">Date of Birth</label>
                  <input
                    className="mx-3"
                    type="date"
                    min="2004-01-01"
                    max="2021-12-31"
                    required
                    autoComplete="off"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="form-outline mb-4">
                  <select
                    className="form-select bg-light"
                    aria-label="Default select example"
                    autoComplete="off"
                    required
                    onChange={(e) => setClassId(e.target.value)}
                  >
                    <option selected>Please Click To Select A Class</option>
                    {classList.map((classes) => (
                      <option key={classes.classId}>{classes.classId}</option>
                    ))}
                  </select>
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
                  Add Student
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default AddStudent;
