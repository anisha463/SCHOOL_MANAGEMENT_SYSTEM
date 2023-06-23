import React, { useState } from "react";

export default function GiveMarksTable({
  student,
  examTypeKey1,
  maxMarks,
  classId,
}) {
  const { name, sid, obtainedMarks, dateOfUpdatingMarks, subjectName } =
    student;
  const [marks, setMarks] = useState(obtainedMarks);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateMarks = async () => {
    setIsUpdating(true);

    const body = {
      sid: sid,
      subjectName: subjectName,
      examType: examTypeKey1,
      obtainedMarks: marks,
      maximumMarks: maxMarks,
      classId,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/teacher/update-marks`,
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
        setIsUpdating(false);
      } else {
        alert("Some error occured on the server side, marks werent updated");
        setIsUpdating(false);
      }
    } catch (error) {
      alert("Some error occured, in catch block of the frontend");
      setIsUpdating(false);
    }
  };
  return (
    <>
      <td className="bg-warning text-dark">{sid}</td>
      <td>{name}</td>
      <td>
        <input
          type="number"
          onChange={(e) => setMarks(e.target.value)}
          value={marks}
        />
      </td>
      <td>{maxMarks}</td>
      <td>{dateOfUpdatingMarks.slice(0, 10)}</td>
      <td>
        {isUpdating ? (
          <p>
            <button class="btn btn-primary " disabled>
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            </button>
          </p>
        ) : (
          <button onClick={updateMarks} className="btn btn-primary">
            Update
          </button>
        )}
      </td>
    </>
  );
}
