const multer = require('multer');

const { Doc } = require('./models/document.JS');

const { delete_doc, delete_all_docs } = require('./headyLifters/delete');

const { checkBucketExists, createBucket, uploadFileHandler, getAllDocsInS3 } = require('./aws-storage/helpers');

const asyncMiddleware = require('./middleware/async');

require('dotenv').config();
const { MY_PERMISSION_TOKEN, AWS_S3_BUCKET_NAME } = process.env

// single image upload engine
async function multipleEngineUploader(app) {
    try {
        app.post('/multiple/files', multer({ storage: multer.memoryStorage() }).array("images"), asyncMiddleware(async(req, res) => {
            let uploaded_files = req.files;
            if (!uploaded_files.length) return res.status(500).json({ status: 'failed', message: 'Empty payload detected!' });
            //let bucket_exists = await checkBucketExists(AWS_S3_BUCKET_NAME);
            //if (!bucket_exists) await createBucket();
            uploaded_files.forEach(async(doc) => {
                try {
                    const params = {
                        Bucket: AWS_S3_BUCKET_NAME,
                        Key: doc.originalname,
                        Body: doc.buffer,
                        ContentType: doc.mimetype,
                    }
                    await uploadFileHandler(params);
                } catch (e) {
                    console.log(e.message)
                }

            })
            res.status(200).json({ status: 'success', message: 'image uploaded to aws successful' });
        }))

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


            // const doc_file = await Doc.findOne({ filename: file_name });
            // if (!doc_file) return res.status(400).json('file could not be found!')
            // // delete from database
            // await doc_file.remove()
            // if (!doc_file) return res.status(400).json({ status: 'failed', message: "could not find file" });
            // // delete from file system
            // await delete_doc('public/local_storage/', doc_file.filename);

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






            // // delete docs locally
            // await delete_all_docs();
            // // delete from db
            // await Doc.find({}).deleteMany();

            res.status(200).json({ status: 'success', message: 'all docs deleted successfully' });
        }))

    } catch (e) {
        console.log(e.message)
    }
}

async function get_all_handler(app) {
    try {
        app.get("/get-all/docs", asyncMiddleware(async(req, res) => {

            // let alldocuments = await Doc.find({});
            // if (alldocuments.length == 0 || !alldocuments) return res.status(404).json('nothing for now')
            getAllDocsInS3()

            let alldocuments = '';
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