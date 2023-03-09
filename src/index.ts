import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

// Deben ser datos de una cuenta personal/empresarial de AWS, 
// las cuentas de laboratorio no funcionan, indican error de que no existe el Access Key ID
const accessKeyId = process.env.AWS_ACCESS_KEY!;
const secretAccessKey = process.env.AWS_SECRET_KEY!;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

// Los nombres de los Buckets son unicos a nivel mundial
const BUCKET_NAME = process.env.BUCKET_NAME!;

const createBucket = (bucketName: string) => {
  // Create the parameters for calling createBucket
  const bucketParams = {
    Bucket: bucketName,
  };

  // call S3 to create the bucket
  s3.createBucket(bucketParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Location);
    }
  });
}

const listBuckets = (s3: AWS.S3) => {
  s3.listBuckets(function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Buckets);
    }
  });
}

const uploadFile = (filePath: string, bucketName: string, keyName: string) => {
  const fs = require('fs');
  const mime = require('mime-types')
  // Read the file
  const file = fs.readFileSync(filePath);
  const Type = mime.lookup(filePath);
  console.log(Type);

  // Setting up S3 upload parameters
  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: bucketName, // Bucket into which you want to upload file
    Key: keyName, // Name by which you want to save it
    Body: file, // Local file
    ContentType: Type
  };

  s3.putObject(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Upload Success", data);
    }
  });
};

const listObjectsInBucket = (bucketName: string) => {
  // Create the parameters for calling listObjects
  const bucketParams = {
    Bucket: bucketName,
  };

  // Call S3 to obtain a list of the objects in the bucket
  s3.listObjects(bucketParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}

const deleteBucket = (bucketName: string) => {
  // Create params for S3.deleteBucket
  const bucketParams = {
    Bucket: bucketName
  };

  // Call S3 to delete the bucket
  s3.deleteBucket(bucketParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}

function sleep(ms: number) {
  console.log('Wait...')
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('\nCreating bucket : ')
    createBucket(BUCKET_NAME)
    await sleep(5000)

    console.log('\nListing out all the buckets in your AWS S3: ')
    listBuckets(s3)
    await sleep(5000)

    console.log('\nUploading PDF to '+ BUCKET_NAME)
    uploadFile('AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations_Badge20230306-28-1ndz0kg.pdf',BUCKET_NAME,"AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations_Badge20230306-28-1ndz0kg.pdf")
    await sleep(5000)

    console.log('\nUploading image to '+ BUCKET_NAME)
    uploadFile('python.png',BUCKET_NAME,"python.png")
    await sleep(5000)

    console.log('\nUploading image to '+ BUCKET_NAME)
    uploadFile('github.png',BUCKET_NAME,"github.png")
    await sleep(5000)
    
    console.log('\nListing out all the files/objects in the bucket '+ BUCKET_NAME)
    listObjectsInBucket(BUCKET_NAME)
    await sleep(5000)
}
main();