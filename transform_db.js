'use strict';

const { connectDB, getDB } = require('./db.js');

/**
 * Stage 1: Add empty employees array to all shifts
 */
async function createEmployeesArray() {
    const db = getDB();
    const shifts = db.collection("shifts");

    console.log("Adding empty employees array to all shifts...");
    await shifts.updateMany(
        {},
        { $set: { employees: [] } }
    );
}

/**
 * Stage 2: Embed employee ObjectIds into shifts based on assignments collection
 */
async function embedEmployees() {
    const db = getDB();
    const assignments = await db.collection("assignments").find().toArray();

    console.log(`Processing ${assignments.length} assignments...`);

    for (let i = 0; i < assignments.length; i++) {
        let assignment = assignments[i];

        let employee = await db.collection("employees")
            .findOne({ employeeId: assignment.employeeId });

        let shift = await db.collection("shifts")
            .findOne({ shiftId: assignment.shiftId });

        if (employee && shift) {
            await db.collection("shifts").updateOne(
                { _id: shift._id },
                { $addToSet: { employees: employee._id } }
            );
        }
    }
}

/**
 * Stage 3: Cleanup legacy fields and collections
 */
async function cleanupLegacyData() {
    const db = getDB();

    console.log("Cleaning up legacy fields and collections...");

    // Remove employeeId from employees
    await db.collection("employees").updateMany(
        {},
        { $unset: { employeeId: "" } }
    );

    // Remove shiftId from shifts
    await db.collection("shifts").updateMany(
        {},
        { $unset: { shiftId: "" } }
    );

    // Drop assignments collection
    try {
        await db.collection("assignments").drop();
        console.log("Collection 'assignments' dropped.");
    } catch (e) {
        console.log("Collection 'assignments' already gone or error dropping.");
    }
}

async function runMigration() {
    try {
        await connectDB();
        await createEmployeesArray();
        await embedEmployees();
        await cleanupLegacyData();
        console.log("Migration completed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        process.exit(0);
    }
}

runMigration();
