const router = require("express").Router();
const agron2 = require("argon2");
const db = require("../dbConnect");
const isAuth = require("../Middleware/isStudentAuth");
const tokenGenerator = require("../utils/tokenGenerator");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

//STUDENT LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await db.query(
      `select * from student where email=? `,
      [email],

      async (error, results) => {
        if (error) {
          console.log(error);
          res.json({
            code: 400,
            error: "An error has occured at the server side",
          });
        } else if (results.length > 0) {
          const valid = await agron2.verify(results[0].password, password);
          if (valid) {
            const Token = tokenGenerator(
              results[0].id,
              process.env.jwtStudentSecret
            );
            res.json({
              code: 200,
              Token,
              imageURL: results[0].imageURL,
              id: results[0].sid,
            });
          } else {
            res.json({
              code: 400,
              error: "Invalid credentials, Please try again !",
            });
          }
        } else if (results.length === 0) {
          res.json({
            code: 400,
            error: "Invalid credentials, Please try again !",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  let newPassword = await uuidv4();
  // console.log(newPassword);
  let hashpassword = await agron2.hash(newPassword);

  let query = `update student set password=? where email=?;`;

  try {
    await db.query(query, [hashpassword, email], (error, results) => {
      if (error) {
        res.json({ Status: false, message: "Error at server side" });
      } else if (results.length > 0) {
        //sending email to user with new password
        const LoginUrl = `${process.env.useraddedloginUrl}`;
        const userhtml = `<html>
                      <body>
                      <div style="margin-top:20px;">
                      <h4>Dear User,</h4>
                      <p style="margin-top:20px;"> Your password reset request is successful.
                      Here's your temporary password, use it to login into your account.
                      Kindly make sure that you change your password right after signing in. </p>
                      <br>
                      <p style="margin-top:20px;">Your current temporary password is: <span style="color:red;"> ${newPassword}</span></p>
                      <span style="margin-top:20px;">Please click on the link to login to your account, 
                      <a target="_blank" style="color:blue;" href=${LoginUrl}>Login Now</a>
                     </span>
                      </body>
                      </html>`;
        userAdded(email, "Password Recovery!", userhtml);
        res.json({
          Status: true,
          message: "Recovery email has been sent to your registered email.",
        });
      } else {
        res.json({
          Status: true,
          message: "Recovery email has been sent to your registered email.",
        });
      }
    });
  } catch (error) {
    res.json({ Status: false, message: "Error at server end" });
  }
});

//MY PROFILE
router.get("/my-profile", isAuth, async (req, res) => {
  let sid = req.header("id");
  // console.log("hi");
  let query = `select S.name, S.email, S.phoneNumber, S.address, S.classId from student S where S.sid=?`;

  try {
    await db.query(query, [sid], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        res.json({
          Status: true,
          name: results[0].name,
          email: results[0].email,
          address: results[0].address,
          phoneNumber: results[0].phoneNumber,
          classId: results[0].classId,
        });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

////////////////////////////////////////////////////////////////////////////////
//DASHBOARD CARDS

// total admin announcement
router.get("/total-admin-announcement", isAuth, async (req, res) => {
  let sqlQuery = `select count(*) as total from adminAnnouncement`;
  try {
    await db.query(sqlQuery, (error, results) => {
      if (error) {
        res.json({ total: 0 });
      } else {
        res.json({ total: results[0].total });
      }
    });
  } catch (error) {
    res.json({ total: 0 });
  }
});

// total teacher announcement
router.get("/total-teacher-announcement", isAuth, async (req, res) => {
  const sid = req.header("sid");
  let sqlQuery = `select count(*) as total from teacherAnnouncement where classId=(select classId from student where sid=?)`;
  try {
    await db.query(sqlQuery, [sid], (error, results) => {
      if (error) {
        res.json({ total: 0 });
      } else {
        res.json({ total: results[0].total });
      }
    });
  } catch (error) {
    res.json({ total: 0 });
  }
});

//navbar total
router.get("/navbar-total", isAuth, async (req, res) => {
  let sqlQuery1 = `select count(*) as total from adminAnnouncement`;
  const sid = req.header("id");
  let total = 0;
  let sqlQuery2 = `select count(*) as total from teacherAnnouncement where classId=(select classId from student where sid=?)`;
  try {
    await db.query(sqlQuery1, async (error, results) => {
      if (error) {
        res.json({ total: 0 });
      } else {
        total = results[0].total;
        await db.query(sqlQuery2, [sid], (error, results) => {
          if (error) {
            res.json({ total: 0 });
          } else {
            total = total + results[0].total;
            res.json({ total: total });
          }
        });
      }
    });
  } catch (error) {
    res.json({ total: 0 });
  }
});

//VIEW ADMIN ANNOUNCEMENTS
router.get("/admin-announcement", isAuth, async (req, res) => {
  console.log("hi");
  let query = `select * from announcement natural join adminAnnouncement order by dateOfAnnouncement desc`;

  try {
    await db.query(query, (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: [] });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

//GET CHALLAN LIST
router.get("/view-fee-challan", isAuth, async (req, res) => {
  console.log("incoming in student challan");
  let query = `select * from challan`;
  try {
    await db.query(query, (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

//VIEW TEACHER ANNOUNCEMENTS
router.get("/teacher-announcement", isAuth, async (req, res) => {
  const sid = req.header("sid");

  let query = `select A.announcementId, A.topic, A.content, A.dateOfAnnouncement, S.subjectName, T1.name from announcement A natural join teacherAnnouncement T, teacher T1, subject S where T.classId=(select classId from student where sid=?) and T1.tid=T.tid and T1.subjectId=S.subjectId order by A.dateOfAnnouncement desc;`;

  try {
    await db.query(query, [sid], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
        console.log(error.message);
      } else if (results.length > 0) {
        res.json({ Status: true, List: results });
        console.log(results);
      } else {
        console.log("Nothing here");

        res.json({ Status: true, List: [] });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ Status: false, List: null });
  }
});

//GET MINIMUM ATTENDANCE
router.get("/get-min-attendance", isAuth, async (req, res) => {
  const sid = req.header("sid");
  let query = `select min(totalLecturesAttended/totalLecturesByFaculty*100) as minAttendance from attendance where sid=?;`;
  try {
    await db.query(query, [sid], (error, results) => {
      if (error) {
        res.json({ Status: false, minAtt: 0 });
      } else {
        res.json({ Status: true, minAtt: results[0].minAttendance });
      }
    });
  } catch (error) {
    res.json({ Status: false, minAtt: 0 });
  }
});

//GET MINIMUM ATTENDANCE DETAILS
// router.get("/get-min-attendance-details", isAuth, async (req, res) => {
//   const sid = req.header("sid");
//   let query = `select S.subjectName, A.totalLecturesByFaculty, A.totalLecturesAttended from subject S, attendance A, where A.subjectId=S.subjectId and (totalLecturesAttended/totalLecturesByFaculty = (select min(totalLecturesAttended/totalLecturesByFaculty*100) as minAttendance from attendance where sid=?))`;
//   try {
//     await db.query(query, [sid], (error, results) => {
//       if (error) {
//         res.json({ Status: false, minAtt: 0 });
//       } else {
//         res.json({ Status: true, minAtt: results[0].minAttendance });
//       }
//     });
//   } catch (error) {
//     res.json({ Status: false, minAtt: 0 });
//   }
// });

///////////////////////////////////////////////////////////////////
//MY ACTIVITIES SECTION

//GRADE SHEET
router.get("/grade-sheet", isAuth, async (req, res) => {
  const sid = req.header("sid");
  const examType = req.header("examType");

  let query = `select M.obtainedMarks, M.maximumMarks, M.dateOfUpdatingMarks, S.subjectName from subject S, marks M where M.subjectId=S.subjectId and M.examType=(select examId from examTypes where examName=?) and M.sid=?`;

  try {
    await db.query(query, [examType, sid], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else {
        res.json({ Status: true, List: results });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

//MAX AND AVG MARKS
router.get("/analysis", isAuth, async (req, res) => {
  const sid = req.header("sid");
  const examType = req.header("examType");
  const subjectName = req.header("subjectName");

  let query = `select max(obtainedMarks) as max, avg(obtainedMarks) as avg from marks M where M.examType=(select examId from examTypes where examName=?) and M.subjectId = (select subjectId from subject where subjectName=?) and M.sid in(select sid from student where classId=(select classId from student where sid=?))`;

  try {
    await db.query(query, [examType, subjectName, sid], (error, results) => {
      if (error) {
        console.log(error.message);
        res.json({ Status: false });
      } else {
        res.json({ Status: true, max: results[0].max, avg: results[0].avg });
      }
    });
  } catch (error) {
    res.json({ Status: false });
  }
});

//GET ATTENDANCE
router.get("/get-attendance", isAuth, async (req, res) => {
  const sid = req.header("sid");
  let query = `select S.subjectName, A.totalLecturesAttended, A.totalLecturesByFaculty, (A.totalLecturesAttended/A.totalLecturesByFaculty*100) as yourAttendance from attendance A, subject S where A.subjectId=S.subjectId and sid=?;`;
  try {
    await db.query(query, [sid], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else {
        res.json({ Status: true, List: results });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

///////////////////////////////////////////////////////////////////
//REQUEST SECTION

//CREATE REQUEST FOR ADMIN
router.post("/admin-request", isAuth, async (req, res) => {
  const { topic, content } = req.body;
  const sid = req.header("id");
  // console.log(sid);
  let requestId = await uuidv4();
  let dateOfRequest = await new Date();
  let query1 = `insert into request(requestId, topic, content, dateOfRequest) values(?,?,?,?)`;
  let query2 = `insert into studentRequest(sid,requestId) values(?,?)`;

  try {
    await db.beginTransaction();
    await db.query(
      query1,
      [requestId, topic, content, dateOfRequest],
      async (error, results) => {
        if (error) {
          await db.rollback();
          res.json({
            Status: false,
            error: "Error at server end",
          });
        } else {
          await db.query(query2, [sid, requestId], async (error, results) => {
            if (error) {
              await db.rollback();
              res.json({
                Status: false,
                error: "Error at server end",
              });
            }
          });
          await db.commit();
          res.json({ Status: true });
        }
      }
    );
  } catch (error) {
    await db.rollback();
    res.json({
      Status: false,
      error: "Error at server end",
    });
  }
});

//CHECK PREVIOUS REQUESTS TO ADMIN
router.get("/check-requests-to-admin-by-student", isAuth, async (req, res) => {
  const sid = req.header("id");
  // console.log(sid);
  let getRequests = `select R.topic, R.content, R.dateOfRequest from (request R inner join studentRequest S on R.requestId=S.requestId) where sid=?`;
  try {
    await db.query(getRequests, [sid], async (error, results) => {
      if (error) {
        console.log(error);
        res.json({ Status: false, List: [] });
      } else if (results.length > 0) {
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: [] });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ Status: false, List: [] });
  }
});

//CREATE REQUEST FOR TEACHER
router.post("/teacher-request", isAuth, async (req, res) => {
  const { topic, content, teacherId } = req.body;
  console.log(teacherId);
  const tid = teacherId.slice(12, 48);
  const sid = req.header("id");
  console.log(tid);
  // console.log(sid);
  let requestId = await uuidv4();
  let dateOfRequest = await new Date();
  let query1 = `insert into request(requestId, topic, content, dateOfRequest) values(?,?,?,?)`;
  let query2 = `insert into studentTeacherRequest(sid,requestId,tid) values(?,?,?)`;

  try {
    await db.beginTransaction();
    await db.query(
      query1,
      [requestId, topic, content, dateOfRequest],
      async (error, results) => {
        if (error) {
          await db.rollback();
          res.json({
            Status: false,
            error: "Error at server end",
          });
        } else {
          await db.query(
            query2,
            [sid, requestId, tid],
            async (error, results) => {
              if (error) {
                await db.rollback();
                res.json({
                  Status: false,
                  error: "Error at server end",
                });
              } else {
                await db.commit();
                res.json({ Status: true });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    await db.rollback();
    res.json({
      Status: false,
      error: "Error at server end",
    });
  }
});

//CHECK PREVIOUS REQUESTS TO TEACHER
router.get("/check-requests", isAuth, async (req, res) => {
  const sid = req.header("id");
  console.log(sid);
  let getRequests = `select T.name, R.topic, R.content, R.dateOfRequest from request R, studentTeacherRequest S, teacher T where R.requestId=S.requestId and T.tid=S.tid and sid=?`;
  try {
    await db.query(getRequests, [sid], async (error, results) => {
      if (error) {
        console.log(error);
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        console.log(results);
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    // console.log(error);
    res.json({ Status: false, List: null });
  }
});

///////////////////////////////////////////////////////////////////////////////////
//TIME TABLE SECTION

//GET CLASS TIMETABLE
router.get("/get-class-timetable", isAuth, async (req, res) => {
  const sid = req.header("sid");
  // console.log(classId);
  let query = `select * from timetable where classId=(select classId from student where sid=?) order by day asc`;

  try {
    await db.query(query, [sid], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    console.log(error.message);

    res.json({ Status: false, List: null });
  }
});

//GET EXAM TYPE
router.get("/exam-type", isAuth, async (req, res) => {
  let query = `select examName from examTypes`;
  try {
    await db.query(query, (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

//GET EXAM TIME-TABLE
router.get("/exam-timetable", isAuth, async (req, res) => {
  let sid = req.header("sid");
  let examType = req.header("examType");
  let query = `select * from exam where classId=(select classId from student where sid=?) and examType=(select examId from examTypes where examName=?) order by day asc`;

  try {
    await db.query(query, [sid, examType], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        // console.log(results[0]);
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

//TEACHER LIST
router.get("/teacher-list", isAuth, async (req, res) => {
  const sid = req.header("sid");
  let query = `select S.subjectName, T.tid, T.name from subject S, studiesSubject S1, teacher T, teachesClass T1 where S1.subjectId=S.subjectId and T.subjectId=S.subjectId and S1.classId=T1.class and T.tid=T1.tid and S1.classId=(select classId from student where sid=?);`;

  try {
    await db.query(query, [sid], (error, results) => {
      if (error) {
        console.log(error.message);
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        // console.log(results[0]);
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

///////////////////////////////////////////////////////////////////////////////////
//CHANGE PASSWORD
router.post("/change-password", isAuth, async (req, res) => {
  const { sid, currentPassword, newPassword, confirmPassword } = req.body;
  let updateQuery = `update student set password=? where sid=?`;
  let checkQuery = `select password from student where sid=?`;
  try {
    await db.beginTransaction();
    await db.query(checkQuery, [sid], async (error, results) => {
      if (error) {
        await db.rollback();
        res.json({ Status: false, message: "Some error occured" });
      } else if (results.length > 0) {
        const valid = await agron2.verify(results[0].password, currentPassword);
        if (valid) {
          if (newPassword === confirmPassword) {
            let hashpassword = await agron2.hash(newPassword);
            await db.query(
              updateQuery,
              [hashpassword, sid],
              async (error, results) => {
                if (error) {
                  await db.rollback();
                  res.json({ Status: false, message: "Some error occured" });
                } else {
                  await db.commit();
                  res.json({
                    Status: true,
                    message: "Password changed successfuly",
                  });
                }
              }
            );
          } else {
            res.json({
              Status: false,
              message: "New Password and Confirm Password don't match",
            });
          }
        } else {
          res.json({ Status: false, message: "Incorrect current password" });
        }
      } else {
        res.json({ Status: false, message: "Error" });
      }
    });
  } catch (error) {
    await db.rollback();
    res.json({ Status: false, message: "Some error occured" });
  }
});

///////////////////////////////////////////////////////////////////
//FOR VALIDATING TOKEN
router.get("/auth", isAuth, async (req, res) => {
  try {
    return res.json({ Status: "student", message: "Auth User" });
  } catch (error) {
    console.log(error.message);

    return res.json({ Status: false, code: 400, message: "Server Error" });
  }
});

module.exports = router;
