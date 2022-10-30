const multer = require('multer');
const { Doc } = require('./models/document.JS');
const { delete_doc, delete_all_docs } = require('./headyLifters/delete');
const asyncMiddleware = require('./middleware/async');
require('dotenv').config();
const { MY_PERMISSION_TOKEN } = process.env
const apicache = require('apicache');

// cache
let cache = apicache.middleware;

// single image upload engine
async function multipleEngineUploader(app, image_path) {
    try {
        // single file storage functionality
        const fileStorageEngine = multer.diskStorage({
            destination: (req, file, cb) => cb(null, image_path),
            filename: (req, file, cb) => cb(null, file.originalname)
        });

        const upload = multer({ storage: fileStorageEngine });

        app.post('/multiple/files', upload.array('images', 100), async(req, res) => {
            const image_files = req.files;
            if (!image_files.length) return res.status(500).json({ status: 'failed', message: 'Empty payload detected!' });

            for (let obj of image_files) {
                const { originalname, mimetype, filename, path, size, encoding } = obj

                let doc = await Doc.findOne({
                    originalname
                });

                if (doc) continue;

                await Doc.create({
                    originalname,
                    mimetype,
                    filename,
                    path,
                    size,
                    encoding
                })
            }

            res.status(200).json({ status: 'success', message: 'image upload was successful' });
        })

    } catch (e) {
        console.log(e.message)
    }
}
// delete one document
async function deleteDocHandler(app) {
    try {
        app.delete("/delete/:filename", asyncMiddleware(async(req, res) => {
            let file_name = req.params.filename

            if (!req.params.filename) return res.status(500).json({ status: 'failed', message: "filename required" });

            const doc_file = await Doc.findOne({ filename: file_name });
            if (!doc_file) return res.status(400).json('file could not be found!')

            // delete from database
            await doc_file.remove()

            if (!doc_file) return res.status(400).json({ status: 'failed', message: "could not find file" });

            // delete from file system
            await delete_doc('public/local_storage/', doc_file.filename);

            res.status(200).json({ status: 'success', file: file_name, message: 'file deleted successfully' });
        }))

    } catch (e) {
        console.log(e.message)
    }
}
// delete entire doc collection in db and locally
async function delete_all(app) {
    try {
        app.delete("/delete-all-documents/", asyncMiddleware(async(req, res) => {
            let token = req.query.token
            if (token != MY_PERMISSION_TOKEN) return res.status(400).json('Unauthorized operation')

            // delete docs locally
            await delete_all_docs();
            // delete from db
            await Doc.find({}).deleteMany();

            res.status(200).json({ status: 'success', message: 'all docs deleted successfully' });
        }))

    } catch (e) {
        console.log(e.message)
    }
}
async function get_all_handler(app) {
    try {
        app.get("/get-all/docs", asyncMiddleware(async(req, res) => {
            let alldocuments = await Doc.find({});
            if (alldocuments.length == 0 || !alldocuments) return res.status(404).json('nothing for now')
            res.status(200).json(alldocuments);
        }))

    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    multipleEngineUploader,
    deleteDocHandler,
    delete_all,
    get_all_handler
}