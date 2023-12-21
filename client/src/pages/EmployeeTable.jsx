import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BASE_URL } from "../App"


import { useNavigate } from "react-router-dom";
import AddUsers from "../components/AddUsers";
import UpdateUser from "../components/UpdateUser";
import Loader from "../components/Loader";



const EmployeeTable = () => {
    const [employeeData, setEmployeeData] = useState([])
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedEmployeeId, setSelectedEmployeeId]=useState(null)

    const token = localStorage.getItem('token');






    //FETCH EMPLOYEE DATA 
    const fetchEmployeeData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/employees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status}`);
            }
            const data = await response.json();
            // console.log(data, "PRODUCTS")
            setEmployeeData(data)
            setLoading(false)

        } catch (error) {
            console.error('Error fetching products:', error);

        }
    }


    useEffect(() => {
        fetchEmployeeData()
    }, [])












    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };




    const openEditModal = (id) => {
        setIsEditModalOpen(true);
        setSelectedEmployeeId({id})

    };

    const openDeleteModal = (id) => {
        // Show the delete modal and pass the employee ID
        setIsDeleteModalOpen(true);
        setSelectedEmployeeId(id);
      };


    const handleLogout = () => {
        localStorage.clear()
        window.location.reload()
    }


    
  const updateEmployeeData = (updatedEmployee) => {
    setEmployeeData((prevEmployeeData) => {
      const updatedData = prevEmployeeData.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee
      );
      return updatedData;
    });
  };





    return (
        <div>
            <div className="">
                <h1 className="text-xl">Employee List</h1>
                <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
                    <div>

                        <button
                            className="px-5 py-2 text-white rounded-full bg-blue-600"
                            onClick={openModal}
                        >Add Employee</button>



                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">

                        </div>
                        <button className="px-5 py-2 text-white rounded-full bg-red-600"
                            onClick={handleLogout}
                        >Logout</button>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    {loading ? (
                        <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
                            <Loader />
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Phone
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Designation
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Salary
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Edit
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeData.map((employee) => (
                                    <tr
                                        key={employee._id}
                                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                                    >
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {employee.name}
                                        </th>
                                        <td className="px-6 py-4">{employee.email}</td>
                                        <td className="px-6 py-4">{employee.phone}</td>
                                        <td className="px-6 py-4">{employee.designation}</td>
                                        <td className="px-6 py-4">{employee.salary}</td>
                                        <td className="px-6 py-4">
                                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                onClick={() => openEditModal(employee._id)}
                                            >
                                                <FaEdit />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                              onClick={() => openDeleteModal(employee._id)}
                                            >
                                                <MdDelete />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>

                {isModalOpen && <AddUsers closeModal={closeModal} fetchEmployeeData={fetchEmployeeData} />}
                {isEditModalOpen && (
                    <UpdateUser
                        employeeId={selectedEmployeeId}  
                        closeModal={() => {
                            setIsEditModalOpen(false);
                            setSelectedEmployeeId(null);
                        }}
                        updateEmployeeData={updateEmployeeData}
                    />
                )}
            </div>

        </div>
    )
}

export default EmployeeTable