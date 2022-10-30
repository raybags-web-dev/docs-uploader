const multer = require('multer');
const { Doc } = require('./models/document.JS');

// single image upload engine
async function singlefileEngine(app, image_path, ) {
    try {
        // single file storage functionality
        const fileStorageEngine = multer.diskStorage({
            destination: (req, file, cb) => cb(null, image_path),
            filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
        });
        const upload = multer({ storage: fileStorageEngine });

        app.post('/single/file', upload.single('image'), (req, res) => {
            const image_file = req.file;
            if (image_file == undefined) return res.status(500).json({ status: 'failed', message: 'Something went wrong try again later!' });
            console.log(image_file)

            res.status(200).json({ status: 'success', message: 'image upload was successful' });
        })

    } catch (e) {
        console.log(e.message)
    }
}
// ===========================
// single image upload engine
async function multipleEngineUploader(app, image_path, ) {
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
            // console.log(image_files)

            for (let obj of image_files) {
                const { originalname, mimetype, filename, path, size, encoding } = obj

                let doc = await Doc.findOne({
                    originalname
                });

                if (doc) return res.status(400).json({
                    status: "Failed",
                    reason: "duplicate files detected",
                    objec: doc,
                    message: "this document already exists in database"
                });

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
module.exports = {
    singlefileEngine,
    multipleEngineUploader
}