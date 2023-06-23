import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Chart from "react-apexcharts";

function ViewAnalysis({ grades, examTypeKey1 }) {
  const { subjectName, obtainedMarks, maximumMarks } = grades;
  const [highest, setHighest] = useState(0);
  const [avg, setAvg] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setFetching(true);
  };
  const handleShow = () => setShow(true);
  const analysis = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/student/analysis`,
        {
          method: "GET",
          headers: {
            token: localStorage.Token,
            sid: localStorage.id,
            examType: examTypeKey1,
            subjectName: subjectName,
          },
        }
      );
      const res = await response.json();
      if (res.Status) {
        setHighest(res.max);
        setAvg(res.avg);
        setFetching(false);
      } else {
        alert("something went wrong, can't create analysis report");
        setFetching(true);
      }
    } catch (error) {
      alert("Something went wrong, you are being logged out");
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      window.location.reload();
    }
  };

  return (
    <>
      <Button className="btn-warning" onClick={handleShow}>
        View Analysis
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Score Analysis Of {subjectName} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fetching ? (
            <>
              <div className="text-center mt-3 mb-3">
                <button onClick={analysis} className="btn btn-primary">
                  Create Report?
                </button>
              </div>
            </>
          ) : (
            <>
              <Chart
                type="bar"
                width={770}
                height={550}
                series={[
                  {
                    name: "Marks",
                    data: [obtainedMarks, avg, highest, maximumMarks],
                  },
                ]}
                options={{
                  bar: { distributed: true },
                  colors: ["#ffa500", "#000", "#938", "#938"],
                  theme: { mode: "light" },

                  xaxis: {
                    tickPlacement: "on",
                    categories: [
                      "Your Marks",
                      "Class Average",
                      "Class Highest",
                      "Max Achievable Marks",
                    ],
                  },

                  yaxis: {
                    labels: {
                      formatter: (val) => {
                        return `${val}`;
                      },
                      style: { fontSize: "15", colors: ["#000"] },
                    },
                    title: {
                      text: "Marks ",
                      style: { color: "#000", fontSize: 15 },
                    },
                  },

                  legend: {
                    show: false,
                    position: "left",
                  },

                  dataLabels: {
                    formatter: (val) => {
                      return `${val}`;
                    },
                    style: {
                      colors: ["#000"],
                      fontSize: 15,
                    },
                  },
                }}
              ></Chart>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger my-2" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewAnalysis;
