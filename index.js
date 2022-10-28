const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// enable files upload
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const { singlefileEngine, multipleEngineUploader } = require('./src/engines');
singlefileEngine(app, './images');
multipleEngineUploader(app, './images');

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log('server running on port: ' + PORT);
})