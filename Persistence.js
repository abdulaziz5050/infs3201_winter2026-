'use strict';

const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://qwwweeerrrt1212_db_user:01H6Lslrht3CcY0p@infs3201winter2026.v4ezdkt.mongodb.net/?appName=infs3201winter2026';
const client = new MongoClient(url);
const dbName = 'infs3201_winter2026';

let db;


async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}


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
