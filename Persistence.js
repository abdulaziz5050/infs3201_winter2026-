'use strict';

const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://qwwweeerrrt1212_db_user:01H6Lslrht3CcY0p@infs3201winter2026.v4ezdkt.mongodb.net/?appName=infs3201winter2026';
const client = new MongoClient(url);
const dbName = 'infs3201_winter2026';

let db;

/**
 * Establishes a connection to the MongoDB database.
 * If already connected, returns the existing database instance.
 * @returns {Promise<import('mongodb').Db>} The connected database instance.
 */
async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}

/**
 * Retrieves all employee documents from the employees collection.
 * @returns {Promise<Array<{employeeId: string, name: string, phone: string}>>} Array of all employee objects.
 */
async function getEmployeeData() {
    const database = await connectDB();
    return await database.collection('employees').find({}).toArray();
}

/**
 * Retrieves a single employee document by their unique employee ID.
 * Uses findOne so only one document is fetched from the database.
 * @param {string} employeeId The unique ID of the employee to retrieve (e.g. "E001").
 * @returns {Promise<{employeeId: string, name: string, phone: string}|null>} The employee document, or null if not found.
 */
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

/**
 * Retrieves all assignment documents from the assignments collection.
 * @returns {Promise<Array<{employeeId: string, shiftId: string}>>} Array of all assignment objects.
 */
async function getAssignmentData() {
    const database = await connectDB();
    return await database.collection('assignments').find({}).toArray();
}

/**
 * Updates an existing employee's name and phone number in the database.
 * Uses updateOne so only the matching document is modified.
 * @param {string} employeeId The unique ID of the employee to update.
 * @param {string} name The new name value to set.
 * @param {string} phone The new phone number value to set.
 * @returns {Promise<void>} Resolves when the update operation completes.
 */
async function updateEmployee(employeeId, name, phone) {
    const database = await connectDB();
    await database.collection('employees').updateOne(
        { employeeId: employeeId },
        { $set: { name: name, phone: phone } }
    );
}

/**
 * Adds a new employee to the employees collection with an auto-generated ID.
 * The ID follows the format "E###", where ### is one greater than the current highest ID number.
 * @param {string} name The full name of the new employee.
 * @param {string} phone The phone number of the new employee.
 * @returns {Promise<void>} Resolves when the new employee document has been inserted.
 */
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

/**
 * Retrieves all shifts assigned to a specific employee using a MongoDB aggregation pipeline.
 * Joins the assignments collection with the shifts collection to produce shift detail documents.
 * @param {string} empID The unique ID of the employee whose shifts to retrieve.
 * @returns {Promise<Array<{date: string, startTime: string, endTime: string}>>} Array of shift detail objects for the employee.
 */
async function getEmployeeSchedule(empID) {
    const database = await connectDB();

    const schedule = await database.collection('assignments').aggregate([
        { $match: { employeeId: empID } },
        {
            $lookup: {
                from: 'shifts',
                localField: 'shiftId',
                foreignField: 'shiftId',
                as: 'shiftDetails'
            }
        },
        { $unwind: '$shiftDetails' },
        {
            $project: {
                _id: 0,
                date: '$shiftDetails.date',
                startTime: '$shiftDetails.startTime',
                endTime: '$shiftDetails.endTime'
            }
        }
    ]).toArray();

    return schedule;
}

module.exports = {
    connectDB,
    getEmployeeData,
    getEmployeeById,
    getShiftData,
    getAssignmentData,
    updateEmployee,
    addNewEmployee,
    getEmployeeSchedule
};
