const express = require('express')
const dbConnect = require('./config/dbConnect');
const router = require('./router');
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();
app.use(router)

//========== Database connection
dbConnect();

//========== Create server
app.listen(8000, () => {
    console.log("Server is running");
})