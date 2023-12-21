import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../components/Login";
import { useAuth } from "../context/authContext";
import EmployeeTable from "./EmployeeTable";
import NotFound from "./NotFound";

const Allroutes = () => {
  const { state } = useAuth();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <EmployeeTable /> : <Navigate to="/login" replace />}
        />
         <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default Allroutes;
