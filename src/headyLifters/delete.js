const fs = require('fs');
const path = require('path')

//delete file
async function delete_doc(directoryPath, fileName) {
    try {
        fs.unlink(directoryPath + fileName, (err) => {
            if (err) return console.log("Operation failed: " + err.message)
            console.log("File is deleted.")
        });

    } catch (e) {
        console.log(e.message)
    }
}

//delete file

async function delete_all_docs() {
    let doc_folder_path = path.resolve('local_storage');
    try {
        let files = fs.readdirSync(doc_folder_path);
        if (files.length == 0) return console.log('nothing to delete!!')

        if (files.length > 0)
            for (let i = 0; i < files.length; i++) {
                let filePath = doc_folder_path + '/' + files[i];
                if (fs.statSync(filePath).isFile())
                    fs.unlinkSync(filePath);
                else
                    rmDir(filePath);
            }

    } catch (e) {
        return;
    }
};



module.exports = {
    delete_doc,
    delete_all_docs
}