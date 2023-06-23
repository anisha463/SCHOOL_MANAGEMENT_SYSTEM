const router = require("express").Router();
const agron2 = require("argon2");
const db = require("../dbConnect");
const isAuth = require("../Middleware/isTeacherAuth");
const tokenGenerator = require("../utils/tokenGenerator");
const { v4: uuidv4 } = require("uuid");
const { Router } = require("express");
require("dotenv").config();

//TEACHER LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await db.query(
      `select * from teacher where email=? `,
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
              process.env.jwtTeacherSecret
            );
            res.json({
              code: 200,
              Token,
              imageURL: results[0].imageURL,
              id: results[0].tid,
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

  let query = `update teacher set password=? where email=?;`;

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
  let tid = req.header("id");
  let query = `select T.name, T.email, T.phoneNumber, T.address, S.subjectName from teacher T, subject S where T.subjectId=S.subjectId and T.tid=?`;

  try {
    await db.query(query, [tid], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        res.json({
          Status: true,
          name: results[0].name,
          email: results[0].email,
          address: results[0].address,
          phoneNumber: results[0].phoneNumber,
          subjectName: results[0].subjectName,
        });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

///////////////////////////////////////////////////////////////////
//CREATE REQUEST FOR ADMIN
router.post("/admin-request", isAuth, async (req, res) => {
  const { topic, content } = req.body;
  const tid = req.header("id");
  let requestId = await uuidv4();
  let dateOfRequest = await new Date();

  let query1 = `insert into request(requestId, topic, content, dateOfRequest) values(?,?,?,?)`;
  let query2 = `insert into teacherRequest(tid,requestId) values(?,?)`;

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
          await db.query(query2, [tid, requestId], async (error, results) => {
            if (error) {
              console.log(error);
              await db.rollback();
              res.json({
                Status: false,
                error: "Error at server end",
              });
            } else {
              await db.commit();
              res.json({ Status: true });
            }
          });
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

router.get("/check-requests", isAuth, async (req, res) => {
  const tid = req.header("id");
  let getRequests = `select R.requestId, R.topic, R.content, R.dateOfRequest from (request R inner join teacherRequest T on R.requestId=T.requestId) where T.tid=?`;
  try {
    await db.query(getRequests, [tid], async (error, results) => {
      if (error) {
        console.log(error.message);
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        console.log(results);
        res.json({ Status: true, List: results });
      } else {
        console.log("no requests");
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ Status: false, List: null });
  }
});

///////////////////////////////////////////////////////////////////
//DASHBOARD CARDS
router.get("/student-requests", isAuth, async (req, res) => {
  const tid = req.header("tid");
  //  requestId,
  //   topic,
  //   content,
  //   dateOfRequest,
  //   name,
  //   phoneNumber,
  //   classId,
  let query = `select R.requestId, R.topic, R.content, R.dateOfRequest, S.name, S.phoneNumber, S.classId from request R, student S, teacher T, studentTeacherRequest ST where ST.sid=S.sid and ST.tid=T.tid and T.tid=? and ST.requestId=R.requestId`;

  try {
    await db.query(query, [tid], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: true, List: [] });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

router.get("/admin-annc", isAuth, async (req, res) => {
  let query = `select * from announcement where announcementId in (select announcementId from adminAnnouncement)`;
  try {
    await db.query(query, (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        console.log(results);
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: true, List: [] });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

///////////////////////////////////////////////////////////////////
//UPDATE MARKS
router.post("/update-marks", isAuth, async (req, res) => {
  const { sid, subjectName, examType, obtainedMarks, maximumMarks, classId } =
    req.body;
  let dateOfUpdatingMarks = await new Date();
  let query = `update marks set obtainedMarks=?, dateOfUpdatingMarks=? where sid=? and subjectId=(select subjectId from subject where subjectName=?) and examType=(select examId from examTypes where examName=?)`;
  let query2 = `update marks set maximumMarks=? where sid in(select sid from student where classId=?) and subjectId=(select subjectId from subject where subjectName=?) and examType=(select examId from examTypes where examName=?)`;
  try {
    await db.beginTransaction();
    await db.query(
      query,
      [obtainedMarks, dateOfUpdatingMarks, sid, subjectName, examType],
      async (error, results) => {
        if (error) {
          await db.rollback();
          console.log(error.message);
          res.json({ Status: false });
        } else {
          await db.query(
            query2,
            [maximumMarks, classId, subjectName, examType],
            async (error, results) => {
              if (error) {
                await db.rollback();
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
    res.json({ Status: false });
  }
});

// send max marks for selected class and examtype
router.get("/max-marks", isAuth, async (req, res) => {
  const classId = req.header("classId");
  const tid = req.header("tid");
  const examType = req.header("examType");
  let query = `select distinct M.maximumMarks from marks M, teacher T, studiesSubject S, student S1 where M.subjectId=T.subjectId and T.subjectId=S.subjectId and S.classId=? and M.sid=S1.sid and S1.classId=S.classId and T.tid=? and M.examType=(select examId from examTypes where examName=?);`;

  try {
    await db.query(query, [classId, tid, examType], (error, results) => {
      if (error) {
        res.json({ Status: true, maximumMarks: 0 });
      } else {
        console.log(results[0].maximumMarks);
        res.json({ Status: true, maximumMarks: results[0].maximumMarks });
      }
    });
  } catch (error) {
    res.json({ Status: true, maximumMarks: 0 });
  }
});

//SEND STUDENT LIST FOR UPDATING MARKS
router.get("/get-student-marks", isAuth, async (req, res) => {
  const classId = req.header("classId");
  const tid = req.header("tid");
  const examType = req.header("examType");
  let query = `select S.sid, S.name, S1.subjectName, M.obtainedMarks, M.dateOfUpdatingMarks from student S, marks M, subject S1, teacher T where M.sid=S.sid and S.classId=? and M.subjectId= T.subjectId and S1.subjectId=T.subjectId and T.tid=? and M.examType=(select examId from examTypes where examName=?)`;

  try {
    await db.query(query, [classId, tid, examType], async (error, results) => {
      if (error) {
        console.log(error.message);
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

//////////////////////////////////////////////////////////////////////////
//ATTENDANCE SECTION

//SEND STUDENT LIST FOR UPDATING ATTENDANCE
router.get("/get-student-attendance", isAuth, async (req, res) => {
  const classId = req.header("classId");
  const tid = req.header("tid");
  let query = `select A.sid, S.name, A.totalLecturesByFaculty from attendance A, student S, studiesSubject S1, teacher T where S.sid=A.sid and S.classId=S1.classId and T.tid=? and T.subjectId=S1.subjectId and S1.classId=? and A.subjectId=T.subjectId`;

  try {
    await db.query(query, [tid, classId], async (error, results) => {
      if (error) {
        console.log(error.message);
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

//UPDATE STUDENT ATTENDANCE
router.post("/update-attendance", isAuth, async (req, res) => {
  const { students, tid, classId } = req.body;

  let query = `update attendance set totalLecturesAttended=totalLecturesAttended+1 where sid=? and subjectId=(select subjectId from teacher where tid=?)`;
  let query2 = `update attendance set totalLecturesByFaculty=totalLecturesByFaculty+1 where sid in(select sid from student where classId=?) and subjectId=(select subjectId from teacher where tid=?)`;

  try {
    await db.beginTransaction();
    for (i = 0; i < students.length; i++) {
      let sid = students[i];
      await db.query(query, [sid, tid], async (error, results) => {
        if (error) {
          await db.rollback();
          res.json({ Status: false, message: error });
          return;
        } else {
          // console.log("added");
        }
      });
    }
    await db.query(query2, [classId, tid]);
    await db.commit();
    res.json({ Status: true, message: "Attendance updated successfuly" });
  } catch (error) {
    res.json({ Status: false, message: error });
  }
});

///////////////////////////////////////////////////////////////////////////////////
//TIME TABLE SECTION

//GET TIMETABLE
router.get("/get-timetable", isAuth, async (req, res) => {
  const classId = req.header("classId");
  let query = `select * from timetable where classId=? order by day asc`;

  try {
    await db.query(query, [classId], (error, results) => {
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

//GET SUBJECT OF TEACHER
router.get("/teaches-subject", isAuth, async (req, res) => {
  const tid = req.header("tid");
  let query = `select S.subjectName from teacher T, subject S where T.subjectId=S.subjectId and T.tid=?`;

  try {
    await db.query(query, [tid], (error, results) => {
      if (error) {
        res.json({ Status: false, subjectName: null });
      } else if (results.length > 0) {
        res.json({ Status: true, subjectName: results[0].subjectName });
      } else {
        res.json({ Status: false, subjectName: null });
      }
    });
  } catch (error) {
    res.json({ Status: false, subjectName: null });
  }
});

//GET LIST OF CLASSES BASED ON TEACHER
router.get("/teaches-in", isAuth, async (req, res) => {
  const tid = req.header("tid");
  let query = `select class from teachesClass where tid=?`;
  try {
    await db.query(query, [tid], (error, results) => {
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
  let classId = req.header("classId");
  let examType = req.header("examType");
  console.log(classId, examType);
  let query = `select * from exam where classId=? and examType=(select examId from examTypes where examName=?) order by day asc`;

  try {
    await db.query(query, [classId, examType], (error, results) => {
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

//////////////////////////////////////////////////////////////////////////////////
//ANNOUNCEMENTS SECTION

//CREATE ANNOUNCEMENT
router.post("/add-announcement", isAuth, async (req, res) => {
  const { topic, content, classId } = req.body;
  const tid = req.header("id");
  let dateOfAnnouncement = new Date();
  let announcementId = await uuidv4();

  let query1 = `insert into announcement(announcementId, topic, content, dateOfAnnouncement) values(?,?,?,?)`;
  let query2 = `insert into teacherAnnouncement(tid,announcementId, classId) values(?,?,?)`;

  try {
    await db.beginTransaction();
    await db.query(
      query1,
      [announcementId, topic, content, dateOfAnnouncement],
      async (error, results) => {
        if (error) {
          console.log("hi from error1");
          await db.rollback();
          res.json({
            Status: false,
            error: "Error at server end",
          });
        } else {
          await db.query(
            query2,
            [tid, announcementId, classId],
            async (error, results) => {
              if (error) {
                console.log(error);
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

//CHECK ANNOUNCEMENTS
router.get("/check-announcements", isAuth, async (req, res) => {
  const tid = req.header("tid");
  const classId = req.header("classId");
  let getAnnouncements = `select A.topic, A.content, A.dateOfAnnouncement, A.announcementId from (announcement A inner join teacherAnnouncement B on A.announcementId=B.announcementId) where tid=? and classId=? order by A.dateOfAnnouncement desc`;
  try {
    await db.query(getAnnouncements, [tid, classId], async (error, results) => {
      if (error) {
        // console.log(error);
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

// Delete Announcement
router.post("/delete-announcement", isAuth, async (req, res) => {
  const { announcementId } = req.body;
  console.log(announcementId);
  let sqlQuery = `delete from announcement where announcementId=?`;
  try {
    await db.query(sqlQuery, [announcementId], (error, results) => {
      if (error) {
        console.log(error.message);
        res.json({ Status: false });
      } else {
        res.json({ Status: true });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ Status: false });
  }
});

///////////////////////////////////////////////////////////////////////////
// Dashboard cards

// total student requests
router.get("/total-requests", isAuth, async (req, res) => {
  const tid = req.header("id");
  let sqlQuery = `select count(*) as total from studentTeacherRequest where tid=?`;
  try {
    await db.query(sqlQuery, [tid], (error, results) => {
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

// total students
router.get("/total-students", isAuth, async (req, res) => {
  const tid = req.header("id");
  console.log("aya");
  let sqlQuery = `select count(*) as total from student s, teachesClass T  where T.tid=? and s.classId=T.class`;
  try {
    await db.query(sqlQuery, [tid], (error, results) => {
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
///////////////////////////////////////////////////////////////////////////////////
//CHANGE PASSWORD
router.post("/change-password", isAuth, async (req, res) => {
  const { tid, currentPassword, newPassword, confirmPassword } = req.body;
  let updateQuery = `update teacher set password=? where tid=?`;
  let checkQuery = `select password from teacher where tid=?`;
  try {
    await db.beginTransaction();
    await db.query(checkQuery, [tid], async (error, results) => {
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
              [hashpassword, tid],
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

//GET STUDENT LIST BASED ON CLASS
router.get("/get-student-list", isAuth, (req, res) => {
  let classId = req.header("classId");
  let tid = req.header("tid");
  let sqlQuery = `Select s.sid, name, email, phoneNumber, address, fatherName, motherName, imageURL, (totalLecturesAttended/totalLecturesByFaculty *100) as attendance from student s, attendance a where s.sid=a.sid and s.classId=? and a.subjectId=(select subjectId from teacher where tid=?);`;
  try {
    db.query(sqlQuery, [classId, tid], (error, results) => {
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

//////////////////////////////////////////////////////////////
// NavBar total
router.get("/get-navbar-total", isAuth, async (req, res) => {
  let sqlQuery1 = `select count(*) as total from adminAnnouncement`;
  const tid = req.header("id");
  let total = 0;
  let sqlQuery2 = `select count(*) as total from studentTeacherRequest where tid=?`;
  try {
    await db.query(sqlQuery1, async (error, results) => {
      if (error) {
        res.json({ total: 0 });
      } else {
        total = results[0].total;
        await db.query(sqlQuery2, [tid], (error, results) => {
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

////////////////////////////////////////////////////////////////
//VALIDATE TOKEN
router.get("/auth", isAuth, async (req, res) => {
  try {
    return res.json({ Status: "teacher", message: "Auth User" });
  } catch (error) {
    console.log(error.message);

    return res.json({ Status: false, code: 400, message: "Server Error" });
  }
});

module.exports = router;

//ADD STUDENTS IN MARKS TABLE
// router.post("/add-student-dummy", async (req, res) => {
//   const { subjectName } = req.body;
//   let studentList = `select sid from student S, studiesSubject T where S.classId=T.classId and T.subjectId=(select subjectId from subject where subjectName=?)`;
//   let insertQuery = `insert into marks (sid, subjectId, examType, dateOfUpdatingMarks) values(?,(select subjectId from subject where subjectName=?),?,?)`;
//   let date1 = await new Date();
//   try {
//     await db.beginTransaction();
//     await db.query(studentList, [subjectName], async (error, results) => {
//       if (error) {
//         await db.rollback();
//         res.json({ Status: false, error: "error in query" });
//       } else if (results.length > 0) {
//         for (i = 0; i < results.length; i++) {
//           for (k = 1; k <= 6; k++) {
//             let studentId = results[i].sid;
//             await db.query(
//               insertQuery,
//               [studentId, subjectName, k, date1],
//               async (error, rseults) => {
//                 if (error) {
//                   console.log(error.message);
//                 } else {
//                   console.log("student inserted");
//                 }
//               }
//             );
//           }
//         }
//         await db.commit();
//         res.json({ Status: true });
//       }
//     });
//   } catch (error) {
//     await db.rollback();
//     res.json({ Status: false, error: "error in query" });
//   }
// });

//ADD STUDENTS IN ATTENDANCE TABLE
// router.post("/add-student-dummy2", async (req, res) => {
//   let studentList = `select sid from student S, studiesSubject T where S.classId=T.classId and T.subjectId=(select subjectId from subject where subjectName=?)`;
//   let insertQuery = `insert into attendance(sid, subjectId) values(?,(select subjectId from subject where subjectName=?))`;

//   let subject = [
//     "S.S.T",
//     "Computer",
//     "Hindi",
//     "Math",
//     "Physics",
//     "EVS",
//     "Science",
//     "English",
//     "Chemistry",
//     "P.E",
//     "GK",
//     "Biology",
//   ];

//   try {
//     await db.beginTransaction();
//     for (j = 0; j < 12; j++) {
//       let subjectName = subject[j];
//       await db.query(studentList, [subjectName], async (error, results) => {
//         if (error) {
//           await db.rollback();
//           res.json({ Status: false, error: "error in query" });
//         } else if (results.length > 0) {
//           for (i = 0; i < results.length; i++) {
//             let studentId = results[i].sid;
//             await db.query(
//               insertQuery,
//               [studentId, subjectName],
//               async (error, rseults) => {
//                 if (error) {
//                   console.log(error.message);
//                 } else {
//                   console.log("student inserted");
//                 }
//               }
//             );
//           }
//         }
//       });
//     }
//     await db.commit();
//     res.json({ Status: true });
//   } catch (error) {
//     await db.rollback();
//     res.json({ Status: false, error: "error in query" });
//   }
// });
