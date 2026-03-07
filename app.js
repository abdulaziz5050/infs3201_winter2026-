const express = require("express");
const exphbs = require("express-handlebars");
const { connectDB } = require("./db.js");
const app = express();

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

app.get("/", (req, res) => {
    res.send("Server is Running");
});
