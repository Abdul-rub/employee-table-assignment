import { useEffect, useState } from "react";
import { FaEdit, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BASE_URL } from "../App"

import AddUsers from "../components/AddUsers";
import UpdateUser from "../components/UpdateUser";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';
import usePaginate from "../components/usePaginate";




const EmployeeTable = () => {
    const [employeeData, setEmployeeData] = useState([])
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
    const [searchQuery, setSearchQuery] = useState("");
    const [searchClicked, setSearchClicked] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const {
        currentPage,
        maxPage,
        startIndex,
        endIndex,
        handlePrevPage,
        handleNextPage
    } = usePaginate(employeeData.length, itemsPerPage);


    const [sortBySalary, setSortBySalary] = useState({
        ascending: true,
        arrowIcon: <FaLongArrowAltDown />,
    });


    const token = localStorage.getItem('token');







    //FETCH EMPLOYEE DATA 
    const fetchEmployeeData = async () => {
        try {
            if (!searchClicked) {
                setLoading(false);
                return;
            }

            const apiUrl = searchQuery
                ? `${BASE_URL}/api/search/employees?name=${encodeURIComponent(searchQuery)}`
                : `${BASE_URL}/api/employees`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch employees: ${response.status}`);
            }

            const data = await response.json();
            setEmployeeData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };


    useEffect(() => {
        fetchEmployeeData();
    }, [searchQuery, currentPage, itemsPerPage]);

    useEffect(() => {
        const newMaxPage = Math.ceil(employeeData.length / itemsPerPage);
    }, [employeeData, itemsPerPage]);



    //Search Feature 
    const handleSearch = () => {
        setSearchClicked(true);
        fetchEmployeeData();
    };


    //DELETE DATA
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/delete/employees/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Deleted")

            if (!response.ok) {
                throw new Error(`Failed to delete employee: ${response.status}`);
            }
            fetchEmployeeData();
        } catch (error) {
            console.error('Error deleting employee:', error);

            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Failed to delete employee. Please try again.');
            }
        }
    };











    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };




    const openEditModal = (id) => {
        setIsEditModalOpen(true);
        setSelectedEmployeeId({ id })

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



    //Sort Salary 
    const handleSortBySalary = () => {
        const newSortBySalary = {
            ascending: !sortBySalary.ascending,
            arrowIcon: sortBySalary.ascending ? <FaLongArrowAltUp /> : <FaLongArrowAltDown />,
        };
        setSortBySalary(newSortBySalary);
        const sortedData = [...employeeData].sort((a, b) => {
            const salaryA = parseFloat(a.salary);
            const salaryB = parseFloat(b.salary);

            if (newSortBySalary.ascending) {
                return salaryA - salaryB;
            } else {
                return salaryB - salaryA;
            }
        });

        setEmployeeData(sortedData);
    };






    return (
        <div>
            <div className="">
                <h1 className="text-2xl">Employee List</h1>
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
                        <>
                            <div className="flex items-center space-x-2 mb-4">
                                <label htmlFor="searchInput" className="text-gray-600 dark:text-gray-300 font-bold ">Search with Name</label>
                                <div className="relative">
                                    <input
                                        id="searchInput"
                                        className="border px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 rounded-md "
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Enter name..."
                                    />
                                    {/* <button
      className="absolute inset-y-0 right-0 px-4 py-2 bg-blue-600 text-white rounded-md"
      onClick={handleSearch}
    >
      Search
    </button> */}
                                </div>
                            </div>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                                {employeeData.length === 0 && searchClicked && (
                                    <div className="text-red-500 text-center my-4 text-4xl">No data found</div>
                                )}
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

                                        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={handleSortBySalary}>
                                            <div className="flex items-center">
                                                <span className="mr-1">Salary</span>
                                                {sortBySalary.arrowIcon}
                                            </div>
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


                                    {employeeData.slice(startIndex, endIndex + 1).map((employee) => (
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
                                                    onClick={() => handleDelete(employee._id)}
                                                >
                                                    <MdDelete />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                            {/* Pagination */}
                            {employeeData.length > 0 && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={handlePrevPage}
                                        className={`px-3 py-1 mx-1 ${currentPage === 1 ? 'bg-white text-blue-500 cursor-not-allowed' : 'bg-blue-500 text-white'
                                            } border`}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        className={`px-3 py-1 mx-1 ${currentPage === maxPage ? 'bg-white text-blue-500 cursor-not-allowed' : 'bg-blue-500 text-white'
                                            } border`}
                                        disabled={currentPage === maxPage}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                        </>
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