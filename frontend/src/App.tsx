import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { Navigate } from "react-router";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import UtilsContext from "./layout/utils.context";
import ForgotPassword from "./pages/forgotPassword";
import DepartmentsDashboard from "./pages/home/DepartmentsDashboard/DepartmentsDashboard";
import EditDepartment from "./pages/home/editDepartment/EditDepartment";
import GraphDashboard from "./pages/home/GraphsDashboard/GraphsDashboard";
import Home from "./pages/home/Home";
import MetricsDashboard from "./pages/home/MetricsDashboard/MetricsDashboard";
import MyDepartmentsDashboard from "./pages/home/MyDepartmentDashboard.tsx/MyDepartmentDashboard";
import Notifications from "./pages/home/notifications/Notifications";
import Login from "./pages/login/Login";
import SignUp from "./pages/signUp/SignUp";
import VerificationCode from "./pages/verificationCode/VerificationCode";
function App() {
  const auth = useAuth();

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <UtilsContext isLoaderShow={false}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                !auth ? <Login /> : <Navigate to="/home/my-department" />
              }
            />
            <Route path="/home" element={!auth ? <Login /> : <Home />}>
              <Route
                path="/home/my-department"
                element={!auth ? <Login /> : <MyDepartmentsDashboard />}
              />
              <Route
                path="/home/departments"
                element={!auth ? <Login /> : <DepartmentsDashboard />}
              />
              <Route
                path="/home/graphs"
                element={!auth ? <Login /> : <GraphDashboard />}
              />
              <Route
                path="/home/metrics"
                element={!auth ? <Login /> : <MetricsDashboard />}
              />
              <Route
                path="/home/editDepartment/:departmentId"
                element={!auth ? <Login /> : <EditDepartment />}
              />
              <Route
                path="/home/editDepartment"
                element={!auth ? <Login /> : <EditDepartment />}
              />
              <Route
                path="/home/notifications"
                element={!auth ? <Login /> : <Notifications />}
              />
            </Route>

            <Route
              path="/signUp"
              element={!auth ? <SignUp /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/verificationCode"
              element={
                !auth ? <VerificationCode /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/forgotPassword"
              element={
                !auth ? <ForgotPassword /> : <Navigate to="/dashboard" />
              }
            />
          </Routes>
        </Router>
      </UtilsContext>
    </LocalizationProvider>
  );
}

export default App;
