const mongoose = require("mongoose");
// scrapped data object 
const Document_Model = {
    originalname: {
        type: String,
        trim: true,
        maxlength: 500,
        minlength: 1,
        required: true
    },
    mimetype: {
        type: String,
        trim: true,
        maxlength: 500,
        minlength: 1
    },
    filename: {
        type: String,
        trim: true,
        maxlength: 500,
        minlength: 1
    },
    path: {
        type: String,
        trim: true,
        minlength: 1
    },
    size: {
        type: String,
        trim: true,
        maxlength: 500,
        minlength: 1,
    },
    encoding: {
        type: String,
        trim: true,
        maxlength: 100,
        minlength: 1,
        required: true
    }
}


// scrapped data schema 
const DocSchema = new mongoose.Schema(Document_Model, { timestamps: true });

module.exports = {
    Doc: mongoose.model('files', DocSchema)
}