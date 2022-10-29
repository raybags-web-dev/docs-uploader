const fs = require('fs');

const DIR = '../../local_storage';

async function deleteDoc(app, image_name) {
    app.delete(`/api/v1/delete/:${image_name}`, async(req, res) => {
        if (!req.params.imagename) {
            console.log("No file received");
            return res.status(500).json('error in delete');

        } else {
            console.log(req.params.imagename);
            fs.unlinkSync(DIR + '/' + req.params.imagename);
            return res.status(200).send('Successfully! Image has been Deleted');

        }
    });
}

module.exports = {
    deleteDoc
}