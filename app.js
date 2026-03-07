const express = require("express");
const exphbs = require("express-handlebars");
const { connectDB } = require("./db.js");
const app = express();

const { getAllEmployees, getEmployeeById, getShiftsForEmployee } = require("./business.js");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB().then(() => {
    console.log("Connected to MongoDB ");
    
    app.listen(3000, () => {
        console.log("Server on port 3000");
    });
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

app.get("/", async (req, res) => {
    try {
        const employees = await getAllEmployees();
        res.render("employees", { employees });
    } catch (err) {
        res.status(500).send("Error loading employees");
    }
});

app.get("/employee/:id", async (req, res) => {
    try {
        const employee = await getEmployeeById(req.params.id);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }
        const shifts = await getShiftsForEmployee(req.params.id);

        res.render("employeeDetails", {
            employee,
            shifts
        });
    } catch (err) {
        res.status(500).send("Error loading employee details");
    }
});

