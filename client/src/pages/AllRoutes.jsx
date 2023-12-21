
import { Route, Routes } from "react-router-dom"
import Login from "../components/Login";
import { useAuth } from "../context/authContext";
import EmployeeTable from "./EmployeeTable";
import AddUsers from "../components/AddUsers";
import UpdateUser from "../components/UpdateUser";
import DeleteUser from "../components/DeleteUser";




const Allroutes = () => {
  const { state } = useAuth();
  const isAuthenticated = localStorage.getItem('isAuthenticated');






  return (
      <div>
          <Routes>

          
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<EmployeeTable />} />
              <Route path="/add" element={<AddUsers />} />
              <Route path="/update" element={<UpdateUser />} />
              <Route path="/delete" element={<DeleteUser />} />

            
          </Routes>
      </div>
  );
}

export default Allroutes;