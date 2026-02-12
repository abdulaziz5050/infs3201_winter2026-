const persistence = require('./Persistence.js');

/**
 * Gets the full list of employees.
 * Forwards the request to the persistence layer to get the data.
 * @returns {Promise<Array<{employeeId: string, name: string, phone: string}>>}
 */
async function getEmployeeList() {
    return await persistence.getEmployeeData();  // Fixed to use the correct function
}

/**
 * Adds a new employee with the given name and phone number.
 * @param {string} name The employee's name.
 * @param {string} phoneNumber The employee's phone number.
 * @returns {Promise<void>}
 */
async function createNewEmployee(name, phoneNumber) {
    return await persistence.addNewEmployee(name, phoneNumber);
}

/**
 * Calculates how long the shift is between start and end time.
 * @param {string} startTime The start time of the shift (format: HH:MM).
 * @param {string} endTime The end time of the shift (format: HH:MM).
 * @returns {number} The shift duration in hours.
 */
function calculateShiftDuration(startTime, endTime) {
    return persistence.calculateShiftDuration(startTime, endTime);  // Calls the function from persistence
}

/**
 * Assigns an employee to a shift after all checks.
 * @param {string} empID The employee's ID.
 * @param {string} shiftID The shift's ID.
 * @returns {Promise<string>} The result of the assignment ("OK" or error message).
 */
async function assignEmployeeToShift(empID, shiftID) {
    let result = await persistence.getAllAssignShiftData();

    let employees = result.employees;
    let shifts = result.shifts;
    let assignments = result.assignments;
    let maxHoursPerDay = result.config.maxDailyHours;

    // Check if the employee exists
    let employeeExists = employees.some(emp => emp.employeeId === empID);
    if (!employeeExists) {
        return "EMP_NOT_FOUND";
    }

    // Check if the shift exists
    let shiftExists = shifts.some(shift => shift.shiftId === shiftID);
    if (!shiftExists) {
        return "SHIFT_NOT_FOUND";
    }

    // Check if the employee is already assigned to the shift
    let isDuplicate = assignments.some(a => a.employeeId === empID && a.shiftId === shiftID);
    if (isDuplicate) {
        return "DUPLICATE";
    }

    // Calculate the shift's duration
    let selectedShift = shifts.find(shift => shift.shiftId === shiftID);
    let shiftDuration = calculateShiftDuration(selectedShift.startTime, selectedShift.endTime);
    if (isNaN(shiftDuration)) {
        return "INVALID_SHIFT_TIME";
    }

    // Check if the employee exceeds the max allowed working hours for the day
    let totalHoursForDay = 0;
    for (let assignment of assignments) {
        if (assignment.employeeId === empID) {
            let assignedShift = shifts.find(shift => shift.shiftId === assignment.shiftId);
            if (assignedShift.date === selectedShift.date) {
                let hours = calculateShiftDuration(assignedShift.startTime, assignedShift.endTime);
                if (!isNaN(hours)) {
                    totalHoursForDay += hours;
                }
            }
        }
    }

    // Check if adding this shift will exceed the max hours
    if (totalHoursForDay + shiftDuration > maxHoursPerDay) {
        return "MAX_HOURS";
    }

    // Save the shift assignment
    await persistence.saveShiftAssignment(empID, shiftID);
    return "OK";
}

/**
 * Gets the schedule for a specific employee.
 * @param {string} empID The employee's ID.
 * @returns {Promise<Array<{date: string, startTime: string, endTime: string}>>}
 */
async function getEmployeeSchedule(empID) {
    return await persistence.getEmployeeSchedule(empID);
}

module.exports = {
    getEmployeeList,
    createNewEmployee,
    assignEmployeeToShift,
    getEmployeeSchedule
};
