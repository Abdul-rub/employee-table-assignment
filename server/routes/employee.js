
const express = require("express")
const authMiddleware = require('../middleware/Authentication')
const { getEmployeeData, addEmployee, updateEmployee, getSingleEmployee, deleteEmployee } = require("../controller/EmployeeController")

const router = express.Router()




router.get('/employees', authMiddleware ,getEmployeeData)
router.post('/add/employees', authMiddleware ,addEmployee)
router.put('/update/employees/:id', authMiddleware, updateEmployee);
router.get('/single/employees/:id',authMiddleware, getSingleEmployee)
router.delete("/employees/:id", authMiddleware, deleteEmployee);


module.exports= router
