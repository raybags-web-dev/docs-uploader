const mongoose = require("mongoose");
// scrapped data object 
const Document_Model = {
    originalname: {
        type: String,
        trim: true,
        maxlength: 500,
        minlength: 1
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
    }
}


// scrapped data schema 
const Skynews1Schema = new mongoose.Schema(Document_Model, { timestamps: true });

module.exports = {
    Doc: mongoose.model('document', Skynews1Schema)
}