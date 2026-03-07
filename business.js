const persistence = require('./Persistence.js');


async function getAllEmployees() {
    return await persistence.getEmployeeData();
}

async function getEmployeeById(id) {
    return await persistence.getEmployeeById(id);
}

async function createNewEmployee(name, phoneNumber) {
    return await persistence.addNewEmployee(name, phoneNumber);
}

async function getShiftsForEmployee(id) {
    const shifts = await persistence.getShiftsForEmployee(id);
    
    shifts.forEach(shift => {
        shift.isMorning = shift.startTime < "12:00";
    });

    shifts.sort((a, b) => {
        if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
    });

    return shifts;
}

async function updateEmployee(id, name, phone) {
    return await persistence.updateEmployee(id, name, phone);
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createNewEmployee,
    getShiftsForEmployee,
    updateEmployee
};
