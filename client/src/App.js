import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "./components/GeneralPages/LoginPage";
import ForgotPassword from "./components/GeneralPages/ForgotPassword";
import AdminDashboard from "./components/Admin/AdminDashboard";
import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import StudentDashboard from "./components/Student/StudentDashboard";
import AddTeacher from "./components/Admin/AddTeachder";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from "react";
import AddSubject from "./components/Admin/AddSubject";
import DeleteTeacher from "./components/Admin/DeleteTeacher";
import EditTeacher from "./components/Admin/EditTeacher";
import AddStudent from "./components/Admin/AddStudent";
import DeleteStudent from "./components/Admin/DeleteStudent";
import EditStudent from "./components/Admin/EditStudent";
import CreateAnc from "./components/Admin/CreateAnc";
import CheckAnnc from "./components/Admin/CheckAnnc";
import FeeChallan from "./components/Admin/FeeChallan";
import ViewFeeChallan from "./components/Admin/ViewFeeChallan";
import ChangeAdminPassword from "./components/Admin/ChangeAdminPassword";
import ChangeStudentPassword from "./components/Student/ChangeStudentPassword";
import ChangeTeacherPassword from "./components/Teacher/ChangeTeacherPassword";
import TeachersRequest from "./components/Admin/TeachersRequest";
import StudentRequest from "./components/Admin/StudentRequest";
import ClassTimeTable from "./components/Teacher/ClassTimeTable";
import EditClassTimeTable from "./components/Admin/EditClassTimeTable";
import EditExamTimeTable from "./components/Admin/EditExamTimeTable";
import ExamTimeTable from "./components/Teacher/ExamTimeTable";
import CreateTeacherAnn from "./components/Teacher/CreateTeacherAnn";
import UpdateMarks from "./components/Teacher/UpdateMarks";
import CheckTeacherAnn from "./components/Teacher/CheckTeacherAnn";
import CreateRequest from "./components/Teacher/CreateRequest";
import CheckPrevRequest from "./components/Teacher/CheckPrevRequest";
import GiveAttendance from "./components/Teacher/GiveAttendance";
import StudentRequestToTeacher from "./components/Teacher/StudentRequestToTeacher";
import AdminAnnouncTeacher from "./components/Teacher/AdminAnnouncTeacher";
import ViewStuds from "./components/Teacher/ViewStuds";
import ViewClassTimeTableStud from "./components/Student/ViewClassTimeTableStud";
import ViewExamTimeTableStud from "./components/Student/ViewExamTimeTableStud";
import ViewGradeSheet from "./components/Student/ViewGradeSheet";
import ViewAttendance from "./components/Student/ViewAttendance";
import AdminAnncToStud from "./components/Student/AdminAnncToStud";
import TeacherAnnc from "./components/Student/TeacherAnnc";
import ViewFeeChallanToStud from "./components/Student/ViewFeeChallanToStud";
import CreateReqToAdmin from "./components/Student/CreateReqToAdmin";
import CreateReqToTeacher from "./components/Student/CreateReqToTeacher";
import CheckPrevRequests from "./components/Student/CheckPrevRequests";
import NotFound from "./components/GeneralPages/NotFound";
import ViewSubject from "./components/Admin/ViewSubject";
function App() {
  const [userAuth, setUserAuth] = useState("");
  const [loading, setLoading] = useState(true);
  const handleUserAuth = (role) => {
    // console.log("Func exec")
    // console.log(role)
    setUserAuth(role);
  };
  const isAuth = async () => {
    if (localStorage.User === undefined || localStorage.Token === undefined) {
      setLoading(false);

      return;
    }
    try {
      const Auth = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/${localStorage.User}/auth`,
        {
          method: "GET",
          headers: { token: localStorage.Token },
        }
      );
      const response = await Auth.json();
      if (response.Status) {
        setUserAuth(response.Status);
      } else {
        setUserAuth("");
        localStorage.removeItem("User");
        localStorage.removeItem("Token");
        window.location.href = "/";
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    isAuth();
  }, []);

  return (
    <>
      {loading ? (
        <div className="container-fluid my-5 py-5 px-5 mx-5">
          <h4 className="text-dark text-center">Loading....</h4>
        </div>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) =>
                userAuth === "admin" ? (
                  <Redirect to="/admin-dashboard" />
                ) : userAuth === "student" ? (
                  <Redirect to="/student-dashboard" />
                ) : userAuth === "teacher" ? (
                  <Redirect to="/teacher-dashboard" />
                ) : (
                  <LoginPage handleUserAuth={handleUserAuth} />
                )
              }
            />
            <Route
              exact
              path="/forgot-password"
              render={(props) =>
                userAuth === "admin" ? (
                  <Redirect to="/admin-password" />
                ) : userAuth === "student" ? (
                  <Redirect to="/student-password" />
                ) : userAuth === "teacher" ? (
                  <Redirect to="/teacher-password" />
                ) : (
                  <ForgotPassword />
                )
              }
            />
            <Route
              exact
              path="/admin-password"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <ChangeAdminPassword {...props} />
                )
              }
            />
            <Route
              exact
              path="/student-password"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <ChangeStudentPassword {...props} />
                )
              }
            />
            <Route
              exact
              path="/teacher-password"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <ChangeTeacherPassword {...props} />
                )
              }
            />
            <Route
              exact
              path="/admin-dashboard"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <AdminDashboard {...props} />
                )
              }
            />
            <Route
              exact
              path="/teacher-requests"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <TeachersRequest {...props} />
                )
              }
            />
            <Route
              exact
              path="/student-requests"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <StudentRequest {...props} />
                )
              }
            />
            <Route
              exact
              path="/exam-time-table"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <EditExamTimeTable {...props} />
                )
              }
            />
            <Route
              exact
              path="/edit-class-time-table"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <EditClassTimeTable {...props} />
                )
              }
            />
            <Route
              exact
              path="/add-announcement"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <CreateAnc {...props} />
                )
              }
            />
            <Route
              exact
              path="/check-announcements"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <CheckAnnc {...props} />
                )
              }
            />
            <Route
              exact
              path="/check-teacher-announcements"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <CheckTeacherAnn {...props} />
                )
              }
            />
            <Route
              exact
              path="/create-request-to-admin-from-teacher"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <CreateRequest {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-request-senttoadmin-by-teacher"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <CheckPrevRequest {...props} />
                )
              }
            />
            <Route
              exact
              path="/fee-challan"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <FeeChallan {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-challan"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <ViewFeeChallan {...props} />
                )
              }
            />
            <Route
              exact
              path="/teacher-dashboard"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <TeacherDashboard {...props} />
                )
              }
            />
            <Route
              exact
              path="/mark-attendance"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <GiveAttendance {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-request-to-teacher"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <StudentRequestToTeacher {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-admin-announcement-to-teacher"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <AdminAnnouncTeacher {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-students-to-teacher"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <ViewStuds {...props} />
                )
              }
            />
            <Route
              exact
              path="/get-class-time-table"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <ClassTimeTable {...props} />
                )
              }
            />
            <Route
              exact
              path="/get-exam-timetable"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <ExamTimeTable {...props} />
                )
              }
            />
            <Route
              exact
              path="/add-teacher-announcement"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <CreateTeacherAnn {...props} />
                )
              }
            />
            <Route
              exact
              path="/update-marks"
              render={(props) =>
                userAuth !== "teacher" ? (
                  <Redirect to="/" />
                ) : (
                  <UpdateMarks {...props} />
                )
              }
            />

            <Route
              exact
              path="/prev-requests"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <CheckPrevRequests {...props} />
                )
              }
            />
            <Route
              exact
              path="/check-challans"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <ViewFeeChallanToStud {...props} />
                )
              }
            />
            <Route
              exact
              path="/create-req-to-admin"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <CreateReqToAdmin {...props} />
                )
              }
            />
            <Route
              exact
              path="/create-req-to-teacher"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <CreateReqToTeacher {...props} />
                )
              }
            />
            <Route
              exact
              path="/student-dashboard"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <StudentDashboard {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-teacher-annc"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <TeacherAnnc {...props} />
                )
              }
            />
            <Route
              exact
              path="/student-time-table"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <ViewClassTimeTableStud {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-attendance"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <ViewAttendance {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-admin-annc-to-student"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <AdminAnncToStud {...props} />
                )
              }
            />
            <Route
              exact
              path="/student-exam-time-table"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <ViewExamTimeTableStud {...props} />
                )
              }
            />

            <Route
              exact
              path="/student-grade-sheet"
              render={(props) =>
                userAuth !== "student" ? (
                  <Redirect to="/" />
                ) : (
                  <ViewGradeSheet {...props} />
                )
              }
            />
            <Route
              exact
              path="/add-teacher"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <AddTeacher {...props} />
                )
              }
            />
            <Route
              exact
              path="/delete-teacher"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <DeleteTeacher {...props} />
                )
              }
            />
            <Route
              exact
              path="/delete-student"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <DeleteStudent {...props} />
                )
              }
            />
            <Route
              exact
              path="/edit-teacher"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <EditTeacher {...props} />
                )
              }
            />
            <Route
              exact
              path="/view-subjects"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <ViewSubject {...props} />
                )
              }
            />
            <Route
              exact
              path="/edit-student"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <EditStudent {...props} />
                )
              }
            />
            <Route
              exact
              path="/add-subject"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <AddSubject {...props} />
                )
              }
            />
            <Route
              exact
              path="/add-student"
              render={(props) =>
                userAuth !== "admin" ? (
                  <Redirect to="/" />
                ) : (
                  <AddStudent {...props} />
                )
              }
            />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
