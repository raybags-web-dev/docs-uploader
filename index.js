const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const asyncMiddleware = require('./src/middleware/async');
// enable files upload
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));


const connectDB = require("./src/DB/db");
//env variables
require("dotenv").config();
const { DB_CONNECTION_STRING, } = process.env;

const { multipleEngineUploader, deleteDocHandler, delete_all } = require('./src/engines');

multipleEngineUploader(app, './local_storage');
deleteDocHandler(app);
delete_all(app);

(asyncMiddleware(async() => {
    console.log("initializing connection  to server...");
    connectDB(DB_CONNECTION_STRING);
    console.log("======= CONNECTED TO DB ========");
    // Port set-up and start server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`app is listening on port ${ PORT }`));
}))();