//require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

// const bucketName = process.env.AWS_BUCKET_NAME
// const region = process.env.AWS_BUCKET_REGION
// const accessKeyId = process.env.AWS_ACCESS_KEY
// const secretAccessKey = process.env.AWS_SECRET_KEY

const bucketName = "neuro-ads"
const region = "us-east-2"
const accessKeyId = "AKIAS7QUOL7WO7NF2UDU"
const secretAccessKey = "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"


const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file,path,filename) {
  const fileStream = fs.createReadStream(path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile