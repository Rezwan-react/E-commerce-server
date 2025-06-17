const express = require('express')
const dbConnect = require('./config/dbConnect');
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();

// Database connection
dbConnect();

// Create server
app.listen(8000, () => {
    console.log("Server is running")
})