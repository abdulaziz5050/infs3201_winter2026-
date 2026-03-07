const persistence = require('./Persistence.js');


async function getEmployeeList() {
    return await persistence.getEmployeeData();  // Fixed to use the correct function
}

async function createNewEmployee(name, phoneNumber) {
    return await persistence.addNewEmployee(name, phoneNumber);
}



module.exports = {
    getEmployeeList,
    createNewEmployee,
};

