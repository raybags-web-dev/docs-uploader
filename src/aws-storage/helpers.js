const AWS = require('aws-sdk');
const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3');

require('dotenv').config();
const {
    AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME
} = process.env

// check if bucket exists 
const checkBucketExists = async bucket => {
    const client = new S3Client();
    try {
        const options = { Bucket: bucket };
        await client.send(new HeadBucketCommand(options));
        return true;
    } catch (error) {
        if (error["$metadata"].httpStatusCode === 404) {
            return false;
        }
        throw error;
    }
};
// create s3 bucket handler
const createBucket = async function() {
    try {
        const s3 = new AWS.S3({
                accessKeyId: AWS_S3_ACCESS_KEY_ID,
                secretAccessKey: AWS_S3_SECRET_ACCESS_KEY
            })
            // creating bucket
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            CreateBucketConfiguration: { LocationConstraint: "eu-central-1" }
        };

        s3.createBucket(params, function(err, data) {
            if (err.code == 'BucketAlreadyOwnedByYou') return;
            console.log('Bucket Created Successfully', data.Location);
        });
    } catch (e) { console.log(e.message) }
}


// AWS file uploader
async function uploadFileHandler(params) {
    try {
        const s3 = new AWS.S3({ accessKeyId: AWS_S3_ACCESS_KEY_ID, secretAccessKey: AWS_S3_SECRET_ACCESS_KEY })

        s3.upload(params, (err, data) => {
            if (err) { throw err.message };
            console.log(`File uploaded to aws-s3 successfully. ${data.Location}`);
        });
    } catch (e) { console.log(e.message) };
};
// get all documents from s3
async function getAllDocsInS3() {
    try {
        AWS.config.update({ accessKeyId: AWS_S3_ACCESS_KEY_ID, secretAccessKey: AWS_S3_SECRET_ACCESS_KEY });
        let s3 = new AWS.S3();

        const encode = (data) => {
            let buf = Buffer.from(data);
            let base64 = buf.toString("base64");
            return base64;
        }

        const getImage = async() => {
            const data = await s3.getObject({ Bucket: AWS_S3_BUCKET_NAME, Key: "js_advanced_cert.jpeg" }).promise();
            return data;
        }

        let all_imgs = getImage().then((img) => {
            let image = "<img src='data:image/jpeg;base64," + encode(img.Body) + "'" + "/>";
            return image;
        }).catch((e) => {
            console.log(e.message)
        });


        console.log(all_imgs)



    } catch (e) { console.log(e.message) };
};

module.exports = {
    checkBucketExists,
    createBucket,
    uploadFileHandler,
    getAllDocsInS3
}