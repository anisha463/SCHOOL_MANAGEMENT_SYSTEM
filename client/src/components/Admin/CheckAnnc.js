import React, { useEffect, useState } from "react";
import AdminNavBar from "./NavBar/AdminNavBar";
import ViewAnnounDetails from "./ViewAnnounDetails";

function CheckAnnc() {
  const [fetching, setFetching] = useState(true);
  const [announcementsList, setAnnouncementsList] = useState([{}]);

  const getAnnouncements = async () => {
    setFetching(true);
    try {
      const list = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/check-announcements`,
        {
          method: "GET",
          headers: { token: localStorage.Token, id: localStorage.id },
        }
      );
      const gotList = await list.json();
      if (gotList.Status) {
        setAnnouncementsList([...gotList.List]);

        setTimeout(() => {
          setFetching(false);
        }, 1000);
      } else {
        setAnnouncementsList([]);
        setFetching(false);
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      setAnnouncementsList([]);
      setFetching(false);
      alert("Something went wrong");
      localStorage.removeItem("Token");
      window.location.href = "/";
    }
  };

  const deleteAnnoucement = async (announcementId) => {
    const body = { announcementId };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/admin/delete-announcement`,
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
      if (res) {
        alert("The Announcement Was Deleted");
        getAnnouncements();
      } else {
        // localStorage.removeItem("Token");
        // localStorage.removeItem("User");
        // window.location.href = "/";
      }
    } catch (error) {
      alert(`Something Went Wrong in Catch Block ${error.message}`);
      // localStorage.removeItem("Token");
      // localStorage.removeItem("User");
      // window.location.href = "/";
    }
  };
  useEffect(() => {
    getAnnouncements();
  }, []);

  return (
    <>
      <AdminNavBar />
      <div>
        <div className="row mt-5 pt-5">
          <div className="col-2"></div>
          <div className="col-10">
            <div>
              <h4 className="text-info text-center">Announcements List</h4>
            </div>

            {fetching ? (
              <div
                className="spinner-border m-5 justify-content-center"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
                {announcementsList.length === 0 ? (
                  <>
                    <div className="my-3 text-center">
                      <h5 className="text-danger">
                        No Announcements Available
                      </h5>
                    </div>
                  </>
                ) : (
                  <div>
                    <table className="text-dark table  text-center mb-5 ">
                      <thead className="bg-dark text-light">
                        <tr>
                          <th>Topic</th>
                          <th>Date</th>
                          <th>View Details</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcementsList.map((announcement) => {
                          const { topic, dateOfAnnouncement, announcementId } =
                            announcement;
                          return (
                            <tr key={announcementId}>
                              <td>{topic}</td>
                              <td>{dateOfAnnouncement.slice(0, 10)}</td>
                              <td>
                                <ViewAnnounDetails
                                  announcement={announcement}
                                />
                              </td>
                              <td>
                                <button
                                  onClick={() =>
                                    deleteAnnoucement(announcementId)
                                  }
                                  className="btn btn-danger"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default CheckAnnc;
