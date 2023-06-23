const router = require("express").Router();
const agron2 = require("argon2");
const { v4: uuidv4 } = require("uuid");
const db = require("../dbConnect");
const isAuth = require("../Middleware/isAdminAuth");
const tokenGenerator = require("../utils/tokenGenerator");
const userAdded = require("../emails/adminEmails/userAdded");
const forgotPassword = require("../emails/password/forgotPassword");
const e = require("express");
const createMobilePhoneNumber = require("random-mobile-numbers");
const DateGenerator = require("random-date-generator");
require("dotenv").config();

////////////////////////////////////////////////////////////////////////////////////
// Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await db.query(
      `select * from admin where email=? `,
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
              process.env.jwtAdminSecret
            );
            res.json({
              code: 200,
              Token,
              imageURL: results[0].imageURL,
              id: results[0].adminId,
            });
          } else {
            res.json({
              code: 400,
              error: "Invalid credentials, Please try again  !",
            });
          }
        } else if (results.length === 0) {
          res.json({
            code: 400,
            error: "Invalid credentials, Please try again  !",
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

  let query = `update admin set password=? where email=?;`;

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
  let adminId = req.header("id");
  let query = `select name, email, phoneNumber, address from admin where adminId=?`;

  try {
    await db.query(query, [adminId], (error, results) => {
      if (error) {
        res.json({ Status: false, List: null });
      } else if (results.length > 0) {
        res.json({
          Status: true,
          name: results[0].name,
          email: results[0].email,
          address: results[0].address,
          phoneNumber: results[0].phoneNumber,
        });
      } else {
        res.json({ Status: false, List: null });
      }
    });
  } catch (error) {
    res.json({ Status: false, List: null });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
// Subjects Section

//CHECK FOR EXISTING SUBJECT
router.get("/check-subject", isAuth, async (req, res) => {
  const subjectName = req.header("subjectName");
  let selectQuery = `select subjectId from subject where subjectName=?`;
  try {
    await db.query(selectQuery, [subjectName], (error, results) => {
      if (error) {
        console.log(error);
        res.json({
          Status: false,
          error: "Error at server end",
        });
      } else if (results.length > 0) {
        res.json({
          Status: false,
          error: "Subject already exists",
        });
      } else {
        res.json({ Status: true });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      Status: false,
      error: "Error at server end",
    });
  }
});

// Add Subject Route
router.post("/add-subject", isAuth, async (req, res) => {
  const { subjectName, selectedClasses } = req.body;
  const subjectId = await uuidv4();
  // console.log(selectedClasses);
  let sqlQuery = `insert into subject (subjectId,subjectName) values (?,?);`;
  let addClass = `insert into studiesSubject (classId, subjectId) values(?,?)`;
  let marksQuery = `insert into marks (sid, subjectId, examType, dateOfUpdatingMarks) values(?,?,?,?)`;
  let attendanceQuery = `insert into attendance (sid, subjectId) values (?,?)`;
  let studentList = `select S.sid from student S, studiesSubject T where S.classId=T.classId and T.subjectId=?`;
  try {
    await db.beginTransaction();
    await db.query(
      sqlQuery,
      [subjectId, subjectName],

      async (error, results) => {
        if (error) {
          await db.rollback();
          // console.log(error);
          res.json({
            Status: false,
            code: 400,
            error: "An error has occured at the server side",
          });
        } else {
          // console.log({ results });
          for (i = 0; i < selectedClasses.length; i++) {
            let cid = selectedClasses[i];
            await db.query(addClass, [cid, subjectId]);
          }

          await db.query(studentList, [subjectId], async (error, results) => {
            if (error) {
              console.log("could not get student list");
              await db.rollback();
              res.json({ Status: false });
            } else {
              let date1 = await new Date();
              for (i = 0; i < results.length; i++) {
                let sid = results[i].sid;
                for (j = 1; j <= 6; j++) {
                  await db.query(
                    marksQuery,
                    [sid, subjectId, j, date1],
                    async (error, results) => {
                      if (error) {
                        console.log("could not add marks");
                        await db.rollback();
                        res.json({ Status: false });
                      }
                    }
                  );
                }

                await db.query(
                  attendanceQuery,
                  [sid, subjectId],
                  async (error, results) => {
                    if (error) {
                      console.log("could not add attendance");
                      await db.rollback();
                      res.json({ Status: false });
                    }
                  }
                );
              }
              await db.commit();
              res.json({ Status: true });
            }
          });
        }
      }
    );
  } catch (error) {
    await db.rollback();
    console.log(error.message);

    return res.json({ Status: false, code: 400, message: "Server Error" });
  }
});

// Total count of registered subjects routes
router.get("/total-subjects", isAuth, (req, res) => {
  let sqlQuery = `select count(subjectName) as total from subject where subjectName is not null;`;
  try {
    db.query(sqlQuery, (error, results) => {
      if (error) {
        res.json({ Status: false, total: 0 });
      } else if (results.length > 0) {
        res.json({ Status: true, total: results[0].total });
      } else {
        res.json({ Status: false, total: 0 });
      }
    });
  } catch (error) {
    res.json({ Status: false, total: 0 });
  }
});
/////////////////////////////////////////////////////////////////////////////////////

// router.get("/makeadmin", async (req, res) => {
//   const email = "seprojecttest18@gmail.com";
//   const passWord = "admin@123";
//   const hashpassword = await agron2.hash(passWord);
//   const id = uuidv4();
//   const imageUrl =
//     "https://firebasestorage.googleapis.com/v0/b/seimagedb.appspot.com/o/images%2FIMG_20221006_003510_583.jpg?alt=media&token=48eef876-402a-466d-b83b-1af126862fbe";
//   const sqlQuery = `insert into admin (adminId,email,password,imageUrl) values (?,?,?,?) ;`;
//   try {
//     db.query(
//       sqlQuery,
//       [id, email, hashpassword, imageUrl],
//       (error, results) => {
//         if (error) {
//           console.log(error.message);
//           res.json({
//             Status: false,
//             message: "An error has occuered at the server",
//           });
//         } else {
//           res.json({ Status: true });
//         }
//       }
//     );
//   } catch (error) {}
// });

/////////////////////////////////////////////////////////////////////////////
// Sending subject list to the frontend
router.get("/subject-list", isAuth, (req, res) => {
  let sqlQuery = `Select * from subject;`;
  try {
    db.query(sqlQuery, (error, results) => {
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

//GET LIST OF ALL CLASSES
router.get("/class-list", isAuth, async (req, res) => {
  let query = `select classId from class`;
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
    res.send({ error });
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

///////////////////////////////////////////////////////////////////////////
//TEACHER SECTION

//ADD TEACHER
router.post("/add-teacher", isAuth, async (req, res) => {
  const {
    name,
    email,
    phnumber,
    address,
    imageUrl,
    subjectId,
    dob,
    selectedClasses,
  } = req.body;
  // console.log(selectedClasses);
  const teacherId = await uuidv4();
  const hashpassword = await agron2.hash(email);

  let addTeacherQuery = `insert into teacher (tid, name, email, phoneNumber, address, imageURL, subjectId, dob, password) values(?,?,?,?,?,?,(select subjectId from subject where subjectName=?),?,?)`;
  let addClass = `insert into teachesClass (class, tid) values(?,?)`;

  try {
    await db.beginTransaction();
    await db.query(
      addTeacherQuery,
      [
        teacherId,
        name,
        email,
        phnumber,
        address,
        imageUrl,
        subjectId,
        dob,
        hashpassword,
      ],

      async (error, results) => {
        if (error) {
          await db.rollback();
          console.log(error);
          res.json({
            Status: false,
            code: 400,
            error: "An error has occured at the server side",
          });
        } else {
          console.log({ results });
          for (i = 0; i < selectedClasses.length; i++) {
            let cid = selectedClasses[i];
            await db.query(addClass, [cid, teacherId]);
          }
          await db.commit();
          res.json({ Status: true });
          //sending email to teacher after account creation
          const LoginUrl = `${process.env.useraddedloginUrl}`;
          const userhtml = `<html>
                        <body>
                        <div style="margin-top:20px;">
                        <img src=${imageUrl} alt="Your Picture" width="200" height="200" style="margin-top:20px, margin-bottom:20px;">
                        <h4>Dear ${name},</h4>
                        <p style="margin-top:20px;"> Your account has been created by the Admin, you may please sign into your account and use it.
                        Kindly make sure that you change your password right after signing. </p>
                        <br>
                        <p style="margin-top:20px;">Your current temporary password is: <span style="color:red;"> ${email}</span></p>
                        <span style="margin-top:20px;">Please click on the link to login to your account, 
                        <a target="_blank" style="color:blue;" href=${LoginUrl}>Login Now</a>
                       </span>
                        </body>
                        </html>`;
          userAdded(email, "Account Created", userhtml);
          //sending email to admin after teacher account creation
          const adminhtml = `<html>
                        <body>
                        <div style="margin-top:20px;">
                        <h4>Dear Admin,</h4>
                        <p style="margin-top:20px;"> You have created the account of the following teacher, 
                        Name: ${name}, Email: ${email} and PhNumber: ${phnumber} </p>
                        <br>
                        <img src=${imageUrl} alt="Their Picture" width="200" height="200" style="margin-top:20px, margin-bottom:20px;">
                        </body>
                        </html>`;
          userAdded(`${process.env.adminEmail}`, "Account Created", adminhtml);
        }
      }
    );
  } catch (error) {
    await db.rollback();
    console.log(error.message);
    res.json({ Status: false });
  }
});

//GET CLASS LIST BASED ON SUBJECT
router.get("/taught-in", isAuth, async (req, res) => {
  const subjectId = req.header("subjectId");
  let query = `select classId from studiesSubject where subjectId=(select subjectId from subject where subjectName=?);`;
  try {
    await db.query(query, [subjectId], (error, results) => {
      if (error) {
        res.json({
          Status: false,
          List: null,
        });
      } else if (results.length > 0) {
        res.json({
          Status: true,
          List: results,
        });
      } else {
        res.json({
          Status: false,
          List: null,
        });
      }
    });
  } catch (error) {
    res.json({
      Status: false,
      List: null,
    });
  }
});

//GET TEACHER LIST
// router.get("/teacher-list", isAuth, (req, res) => {
//   let sqlQuery = `Select t.tid,t.address, t.name, t.email, t.phoneNumber, s.subjectName, t.imageURL from teacher t,subject s where t.subjectId=s.subjectId order by t.name asc;`;
//   try {
//     db.query(sqlQuery, (error, results) => {
//       if (error) {
//         res.json({ Status: false, List: null });
//       } else if (results.length > 0) {
//         res.json({ Status: true, List: results });
//       } else {
//         res.json({ Status: false, List: null });
//       }
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ Status: false, List: null });
//   }
// });

//GET TEACHER LIST BASED ON CLASS
router.get("/teacher-list-class", isAuth, (req, res) => {
  let classId = req.header("classId");

  let sqlQuery = `Select t.tid, t.address, t.name, t.email, t.phoneNumber, s.subjectName, t.imageURL from teacher t,subject s,teachesClass r where t.subjectId=s.subjectId and r.tid=t.tid and r.class=?;`;
  try {
    db.query(sqlQuery, [classId], (error, results) => {
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

//GET TEACHER LIST BASED ON SUBJECT
router.get("/teacher-list-subject", isAuth, (req, res) => {
  let subjectName = req.header("subjectName");
  let sqlQuery = `Select t.tid, t.address, t.name, t.email, t.phoneNumber, t.imageURL from teacher t where t.subjectId=(select subjectId from subject where subjectName=?);`;
  try {
    db.query(sqlQuery, [subjectName], (error, results) => {
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

//UPDATE TEACHER
router.post("/edit-teacher", isAuth, async (req, res) => {
  const { tid, newName, newPhoneNumber, newEmail, newAddress } = req.body;
  let editQuery = `update teacher set name=?, phoneNumber=?, email=?, address=? where tid=?`;
  try {
    await db.query(
      editQuery,
      [newName, newPhoneNumber, newEmail, newAddress, tid],
      (error, results) => {
        if (error) {
          res.json({ Status: false });
        } else {
          res.json({ Status: true });
        }
      }
    );
  } catch (error) {
    res.json({ Status: false });
  }
});

//DELETE TEACHER
router.post("/delete-teacher", isAuth, async (req, res) => {
  const { tid } = req.body;
  let deleteQuery = `delete from teacher where tid=?`;
  try {
    await db.query(deleteQuery, [tid], (error, results) => {
      if (error) {
        res.json({ Status: false });
      } else {
        // console.log(results);
        res.json({ Status: true });
      }
    });
  } catch (error) {
    res.json({ Status: false });
  }
});

// Total Teachers

router.get("/total-teachers", isAuth, async (req, res) => {
  let sqlQuery = `select count(*) as total from teacher`;
  try {
    await db.query(sqlQuery, (error, results) => {
      if (error) {
        res.json({ Status: true, total: 0 });
      } else {
        res.json({ Status: true, total: results[0].total });
      }
    });
  } catch (error) {
    res.json({ Status: true, total: 0 });
  }
});

////////////////////////////////////////////////////////////////
//STUDENT SECTION

//ADD STUDENT
router.post("/add-student", isAuth, async (req, res) => {
  const {
    name,
    phnumber,
    address,
    dob,
    fatherName,
    motherName,
    email,
    imageUrl,
    classId,
  } = req.body;

  const studentId = await uuidv4();
  const hashpassword = await agron2.hash(email);
  let date1 = await new Date();

  let addQuery = `insert into student(sid, name, phoneNumber, address, dob, fatherName, motherName, email, imageURL, classId, password) values(?,?,?,?,?,?,?,?,?,?,?)`;
  let updateCount = `update class set totalNoOfStudents=totalNoOfStudents+1 where classId=?`;
  let marksQuery = `insert into marks (sid, subjectId, examType, dateOfUpdatingMarks) values(?,?,?,?)`;
  let attendanceQuery = `insert into attendance(sid,subjectId) values(?,?)`;
  let subjectQuery = `select subjectId from studiesSubject where classId=?`;

  try {
    await db.beginTransaction();
    await db.query(
      addQuery,
      [
        studentId,
        name,
        phnumber,
        address,
        dob,
        fatherName,
        motherName,
        email,
        imageUrl,
        classId,
        hashpassword,
      ],

      async (error, results) => {
        if (error) {
          await db.rollback();
          res.json({
            Status: false,
            code: 400,
            error: "An error has occured at the server side",
          });
        } else {
          await db.query(updateCount, [classId], async (error, results) => {
            if (error) {
              await db.rollback();
              console.log("could not update count");
              res.json({ Status: false });
              // return;
            }
          });

          await db.query(subjectQuery, [classId], async (error, results) => {
            if (error) {
              console.log("could not fetch subjects");
              res.json({ Status: false });
            } else if (results.length > 0) {
              // console.log(results);
              for (i = 0; i < results.length; i++) {
                let subjectId = results[i].subjectId;
                for (j = 1; j <= 6; j++) {
                  await db.query(
                    marksQuery,
                    [studentId, subjectId, j, date1],
                    async (error, results) => {
                      if (error) {
                        console.log(error);
                        await db.rollback();
                        res.json({ Status: false });
                        return;
                      } else {
                        // console.log("Marks " + j);
                      }
                    }
                  );
                }

                await db.query(
                  attendanceQuery,
                  [studentId, subjectId],
                  async (error, results) => {
                    if (error) {
                      await db.rollback();
                      console.log("could not add into attendance table");
                      res.json({ Status: false });
                    } else {
                      // console.log("Attendance " + i);
                    }
                  }
                );
              }
            }
          });
          await db.commit();
          res.json({ Status: true });
        }
      }
    );
  } catch (error) {
    await db.rollback();
    console.log(error.message);

    return res.json({ Status: false, code: 400, message: "Server Error" });
  }
});

//UPDATE STUDENT
router.post("/edit-student", isAuth, async (req, res) => {
  const { sid, newName, newPhoneNumber, newEmail, newAddress } = req.body;

  let editQuery = `update student set name=?, phoneNumber=?, email=?, address=? where sid=?;`;

  try {
    db.query(
      editQuery,

      [newName, newPhoneNumber, newEmail, newAddress, sid],
      (error, results) => {
        if (error) {
          res.json({ Status: false });
        } else {
          res.json({ Status: true });
        }
      }
    );
  } catch (error) {
    res.json({ Status: false });
  }
});

//GET STUDENT LIST
router.get("/student-list", isAuth, (req, res) => {
  let sqlQuery = `Select sid, classId, name, email, phoneNumber, fatherName, imageURL, address, motherName from student;`;
  try {
    db.query(sqlQuery, (error, results) => {
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

//GET STUDENT LIST BASED ON CLASS
router.get("/get-student-list", isAuth, (req, res) => {
  let classId = req.header("classId");
  let sqlQuery = `Select sid, name, email, phoneNumber, fatherName, imageURL, address, motherName from student where classId=?;`;
  try {
    db.query(sqlQuery, [classId], (error, results) => {
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

//DELETE STUDENT
router.post("/delete-student", isAuth, async (req, res) => {
  const { sid } = req.body;
  // console.log("hi");
  let deleteQuery = `delete from student where sid=?`;
  let updateCountQuery = `update class set totalNoOfStudents=(totalNoOfStudents-1) where classId=(select classId from student where sid=?)`;
  try {
    await db.beginTransaction();
    await db.query(updateCountQuery, [sid], async (error, results) => {
      if (error) {
        await db.rollback();
        res.json({ Status: false });
      } else {
        await db.query(deleteQuery, [sid], async (error, results) => {
          if (error) {
            await db.rollback();
            res.json({ Status: false });
          } else {
            await db.commit();
            res.json({ Status: true });
          }
        });
      }
    });
  } catch (error) {
    await db.rollback();
    res.json({ Status: false });
  }
});

// Total Students
router.get("/total-students", isAuth, async (req, res) => {
  let sqlQuery = `select count(*) as total from student`;
  try {
    await db.query(sqlQuery, (error, results) => {
      if (error) {
        res.json({ Status: true, total: 0 });
      } else {
        res.json({ Status: true, total: results[0].total });
      }
    });
  } catch (error) {
    res.json({ Status: true, total: 0 });
  }
});

//////////////////////////////////////////////////////////////////////////////////
//FEE CHALLAN SECTION

//CREATE CHALLAN
router.post("/create-fee-challan", isAuth, async (req, res) => {
  const { description, session, amount } = req.body;
  let challanNo = await uuidv4();
  let dateOfChallan = await new Date();

  let query = `insert into challan (challanNo, description, session, amount, dateOfChallan) values(?,?,?,?,?)`;

  try {
    await db.query(
      query,
      [challanNo, description, session, amount, dateOfChallan],
      (error, results) => {
        if (error) {
          res.json({ Status: false });
        } else {
          res.json({ Status: true });
        }
      }
    );
  } catch (error) {
    res.json({ Status: false });
  }
});

//GET CHALLAN LIST
router.get("/view-fee-challan", isAuth, async (req, res) => {
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

//////////////////////////////////////////////////////////////////////////////////
//ANNOUNCEMENTS SECTION

//CREATE ANNOUNCEMENT
router.post("/add-announcement", isAuth, async (req, res) => {
  const { topic, content } = req.body;
  const adminId = req.header("id");
  let dateOfAnnouncement = new Date();
  let announcementId = await uuidv4();

  let query1 = `insert into announcement(announcementId, topic, content, dateOfAnnouncement) values(?,?,?,?)`;
  let query2 = `insert into adminAnnouncement(adminId,announcementId) values(?,?)`;

  try {
    await db.beginTransaction();
    await db.query(
      query1,
      [announcementId, topic, content, dateOfAnnouncement],
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
            [adminId, announcementId],
            async (error, results) => {
              if (error) {
                await db.rollback();
                res.json({
                  Status: false,
                  error: "Error at server end",
                });
              }
            }
          );
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

//CHECK ANNOUNCEMENTS
router.get("/check-announcements", isAuth, async (req, res) => {
  const adminId = req.header("id");
  let getAnnouncements = `select A.topic, A.content, A.dateOfAnnouncement, A.announcementId from (announcement A inner join adminAnnouncement B on A.announcementId=B.announcementId) where adminId=? order by A.dateOfAnnouncement desc`;
  try {
    await db.query(getAnnouncements, [adminId], async (error, results) => {
      if (error) {
        // console.log(error);
        res.json({ Status: false, List: [] });
      } else if (results.length > 0) {
        // console.log(results);
        res.json({ Status: true, List: results });
      } else {
        res.json({ Status: false, List: [] });
      }
    });
  } catch (error) {
    // console.log(error);
    res.json({ Status: false, List: [] });
  }
});

// Delete Announcement
router.post("/delete-announcement", isAuth, async (req, res) => {
  const { announcementId } = req.body;
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
///////////////////////////////////////////////////////////////////////////////////
//REQUESTS SECTION

//CHECK TEACHER REQUESTS
router.get("/teacher-requests", isAuth, async (req, res) => {
  let query = `select R.requestId, R.topic, R.content, R.dateOfRequest, T.name, T.phoneNumber, S.subjectName from request R, teacherRequest TR, teacher T, subject S where R.requestId=TR.requestId and T.tid=TR.tid and T.subjectId = S.subjectId order by R.dateOfRequest desc`;
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

//CHECK STUDENT REQUEST
router.get("/student-requests", isAuth, async (req, res) => {
  let query = `select R.requestId, R.topic, R.content, R.dateOfRequest, S.name, S.phoneNumber, S.classId from request R, student S, studentRequest SR where R.requestId=SR.requestId and SR.sid=S.sid order by R.dateOfRequest desc`;

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

//NUMBER OF TEACHER REQUESTS
router.get("/total-teacher-requests", isAuth, async (req, res) => {
  let query = `select count(*) as total from teacherRequest`;
  try {
    await db.query(query, (error, results) => {
      if (error) {
        res.json({ Status: false, total: 0 });
      } else if (results.length > 0) {
        res.json({ Status: true, total: results[0].total });
      } else {
        res.json({ Status: false, total: 0 });
      }
    });
  } catch (error) {
    res.json({ Status: false, total: 0 });
  }
});

//NUMBER OF STUDENT REQUESTS
router.get("/total-student-requests", isAuth, async (req, res) => {
  let query = `select count(*) as total from studentRequest`;
  try {
    await db.query(query, (error, results) => {
      if (error) {
        res.json({ Status: false, total: 0 });
      } else if (results.length > 0) {
        res.json({ Status: true, total: results[0].total });
      } else {
        res.json({ Status: false, total: 0 });
      }
    });
  } catch (error) {
    res.json({ Status: false, total: 0 });
  }
});

//TOTAL NUMBER OF REQUESTS
router.get("/total-request", isAuth, async (req, res) => {
  let teacherQuery = `select count(*) as total from teacherRequest`;
  let studentQuery = `select count(*) as total from studentRequest`;
  let total;
  try {
    await db.query(teacherQuery, async (error, results) => {
      if (error) {
        total = 0;
        res.json({ Status: false, total: total });
      } else if (results.length > 0) {
        total = results[0].total;
        await db.query(studentQuery, (error, results) => {
          if (error) {
            total = 0;
            res.json({ Status: false, total: total });
          } else if (results.length > 0) {
            total = total + results[0].total;
            res.json({ Status: true, total: total });
          } else {
            res.json({ Status: false, total: total });
          }
        });
      } else {
        res.json({ Status: false, total: total });
      }
    });
  } catch (error) {
    res.json({ Status: false, total: 0 });
  }
});

///////////////////////////////////////////////////////////////////////////////////
//TIME TABLE SECTION

//GET TIMETABLE
router.get("/get-timetable", isAuth, async (req, res) => {
  const classId = req.header("classId");
  // console.log(classId);
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

//UPDATE TIMETABLE
router.post("/edit-timetable", isAuth, async (req, res) => {
  const {
    classId,
    day,
    newPeriod1,
    newPeriod2,
    newPeriod3,
    period4,
    newPeriod5,
    newPeriod6,
    newPeriod7,
  } = req.body;
  let query = `update timetable set period1=?, period2=?, period3=?, period4=?, period5=?, period6=?, period7=? where classId=? and day=?`;

  try {
    await db.query(
      query,
      [
        newPeriod1,
        newPeriod2,
        newPeriod3,
        period4,
        newPeriod5,
        newPeriod6,
        newPeriod7,
        classId,
        day,
      ],
      (error, results) => {
        if (error) {
          res.json({ Status: false });
        } else {
          res.json({ Status: true });
        }
      }
    );
  } catch (error) {
    res.json({ Status: false });
  }
});

//GET SUBJECT LIST BASED ON CLASS
router.get("/studies-subjects", isAuth, async (req, res) => {
  const classId = req.header("classId");
  let query = `select subjectName from (studiesSubject natural join subject) where classId=?`;

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
  let query = `select * from exam where classId=? and examType=(select examId from examTypes where examName=?) order by day asc`;

  try {
    await db.query(query, [classId, examType], (error, results) => {
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

//UPDATE EXAM TIME-TABLE
router.post("/edit-exam-timetable", isAuth, async (req, res) => {
  const { day, subjectName1, newDateOfExam, classId, examType } = req.body;
  let query = `update exam set subjectName=?, dateOfExam=? where classId=? and examType=? and day=?`;
  console.log(newDateOfExam);
  try {
    await db.query(
      query,
      [subjectName1, newDateOfExam, classId, examType, day],
      (error, results) => {
        if (error) {
          res.json({ Status: false });
        } else {
          res.json({ Status: true });
        }
      }
    );
  } catch (error) {
    res.json({ Status: false });
  }
});

//MAKE TIME TABLE , do not touch
router.post("/make-exam", isAuth, async (req, res) => {
  const { classId, dateOfExam } = req.body;
  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let query = `insert into exam (classId, examType, day, dateOfExam, subjectName) values(?,?,?,?,?)`;
  let subjectName = "ughh";
  // let dateOfExam = 2022 - 03 - 12;
  try {
    for (j = 1; j <= 6; j++) {
      for (i = 0; i < 6; i++) {
        let day = days[i];
        // console.log(day);
        await db.query(query, [classId, j, day, dateOfExam, subjectName]);
      }
    }
    res.json(true);
  } catch (error) {}
});

///////////////////////////////////////////////////////////////////////////////////
//CHANGE PASSWORD
router.post("/change-password", isAuth, async (req, res) => {
  const { adminId, currentPassword, newPassword, confirmPassword } = req.body;
  let updateQuery = `update admin set password=? where adminId=?`;
  let checkQuery = `select password from admin where adminId=?`;
  try {
    await db.beginTransaction();
    await db.query(checkQuery, [adminId], async (error, results) => {
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
              [hashpassword, adminId],
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
          res.json({
            Status: false,
            message: "Incorrect current password",
          });
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

///////////////////////////////////////////////////////////////////////////////////
// For validating the token

router.get("/auth", isAuth, async (req, res) => {
  try {
    return res.json({ Status: "admin", message: "Auth User" });
  } catch (error) {
    console.log(error.message);

    return res.json({ Status: false, code: 400, message: "Server Error" });
  }
});

module.exports = router;

//ADD STUDENTS
// router.post("/add-student-dummy", async (req, res) => {
//   const { classId } = req.body;
//   let img = [
//     "https://firebasestorage.googleapis.com/v0/b/seimagedb.appspot.com/o/images%2Fcb753e87-ea64-4696-8fe1-dbf6f8943563?alt=media&token=68c4d2af-7e73-48c5-8939-4e9434c621c7",
//     "https://firebasestorage.googleapis.com/v0/b/seimagedb.appspot.com/o/images%2F3a0b6090-77e2-4fe3-9dd0-d7b5bf80a90c?alt=media&token=183d2b5e-3be6-46cc-bc1a-65d87c055221",
//     "https://firebasestorage.googleapis.com/v0/b/seimagedb.appspot.com/o/images%2Fd8439415-cc19-4926-90de-99e8635ee543?alt=media&token=29c90eb3-206f-46e1-9938-4ed96cc673b5",
//     "https://firebasestorage.googleapis.com/v0/b/seimagedb.appspot.com/o/images%2F29e382d6-0b5b-481f-b4bd-34ce71225ae7?alt=media&token=7827e65a-1558-4aa6-af3d-cf05dee90f81",
//   ];
//   let address1 = ["Jaipur", "Jodhpur", "Kota", "Nabha", "Hyderabad"];
//   let year = 2017 - classId;
//   let k = 0;
//   let j = 0;
//   let addQuery = `insert into student(sid, name, phoneNumber, address, dob, fatherName, motherName, email, imageURL, classId, password) values(?,?,?,?,?,?,?,?,?,?,?)`;

//   let updateCount = `update class set totalNoOfStudents=totalNoOfStudents+1 where classId=?`;

//   try {
//     for (i = 10 * (classId - 1) + 1; i <= 10 * classId; i++) {
//       let startDate = new Date(year, 1, 1);
//       let endDate = new Date(year, 12, 31);
//       let dob = await DateGenerator.getRandomDateInRange(startDate, endDate);
//       let phoneNumber = createMobilePhoneNumber("TR");
//       let name = "Student " + i;
//       let fatherName = "Father " + i;
//       let motherName = "Mother " + i;
//       let email = "student" + i + "@abc.com";
//       let imageUrl = img[k];
//       let address = "Student " + i + " address, " + address1[j];
//       const studentId = await uuidv4();
//       const hashpassword = await agron2.hash(email);
//       await db.beginTransaction();
//       await db.query(
//         addQuery,
//         [
//           studentId,
//           name,
//           phoneNumber,
//           address,
//           dob,
//           fatherName,
//           motherName,
//           email,
//           imageUrl,
//           classId,
//           hashpassword,
//         ],

//         async (error, results) => {
//           if (error) {
//             await db.rollback();
//             res.json({
//               Status: false,
//               code: 400,
//               error: "An error has occured at the server side",
//             });
//           } else {
//             await db.query(updateCount, [classId], async (error, results) => {
//               if (error) {
//                 await db.rollback();
//                 res.json({ Status: false });
//                 return;
//               }
//             });
//           }
//         }
//       );
//       j = (j + 1) % 5;
//       k = (k + 1) % 4;
//     }
//     await db.commit();
//     res.json({ Status: true });
//   } catch (error) {
//     await db.rollback();
//     console.log(error.message);
//     return res.json({ Status: false, code: 400, message: "Server Error" });
//   }
// });
