const express = require("express");
const { connectDB } = require("./db.js");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize MongoDB connection before starting the server
connectDB().then(() => {
    console.log("Connected to MongoDB strongly");
    
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

// Basic route to check if server is working
app.get("/", (req, res) => {
    res.send("INFS3201 Winter 2026 Server is Running");
});
