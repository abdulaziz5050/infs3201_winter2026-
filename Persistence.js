'use strict';

const { connectDB, getDB } = require('./db.js');



async function getEmployeeData() {
    const database = await connectDB();
    return await database.collection('employees').find({}).toArray();
}


async function getEmployeeById(employeeId) {
    const database = await connectDB();
    return await database.collection('employees').findOne({ employeeId: employeeId });
}

/**
 * Retrieves all shift documents from the shifts collection.
 * @returns {Promise<Array<{shiftId: string, date: string, startTime: string, endTime: string}>>} Array of all shift objects.
 */
async function getShiftData() {
    const database = await connectDB();
    return await database.collection('shifts').find({}).toArray();
}


async function updateEmployee(employeeId, name, phone) {
    const database = await connectDB();
    await database.collection('employees').updateOne(
        { employeeId: employeeId },
        { $set: { name: name, phone: phone } }
    );
}


async function addNewEmployee(name, phone) {
    const database = await connectDB();
    const employees = await getEmployeeData();
    let highestId = 0;

    for (let emp of employees) {
        let idNumber = parseInt(emp.employeeId.substring(1));
        if (idNumber > highestId) {
            highestId = idNumber;
        }
    }

    let newId = 'E' + String(highestId + 1).padStart(3, '0');

    await database.collection('employees').insertOne({
        employeeId: newId,
        name: name,
        phone: phone
    });
}


module.exports = {
    connectDB,
    getEmployeeData,
    getEmployeeById,
    getShiftData,
    updateEmployee,
    addNewEmployee
};
