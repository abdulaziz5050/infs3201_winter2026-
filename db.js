const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://qwwweeerrrt1212_db_user:01H6Lslrht3CcY0p@infs3201winter2026.v4ezdkt.mongodb.net/?appName=infs3201winter2026";
const client = new MongoClient(uri);

let database;

async function connectDB() {
    if (!database) {
        await client.connect();
        database = client.db("infs3201_winter2026");
    }
    return database;
}

function getDB() {
    return database;
}

module.exports = { connectDB, getDB };
