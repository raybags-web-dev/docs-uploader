const multer = require('multer');

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
            filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
        });
        const upload = multer({ storage: fileStorageEngine });

        app.post('/multiple/files', upload.array('images', 3), (req, res) => {
            const image_files = req.files;
            if (!image_files.length) return res.status(500).json({ status: 'failed', message: 'Something went wrong try again later!' });

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