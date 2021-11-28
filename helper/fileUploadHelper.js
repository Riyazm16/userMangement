const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const slug = require("slug");
const { extname } = require("path");

// Configuration of S3
const s3Config = new aws.S3({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  region: process.env.AWS_BUCKET_REGION,
});

// Generate fileName
const fileName = (req, file, callback) => {
  if (req.params.id) {
    const randomStringForNameURL = Math.floor(Date.now() * Math.random());
    let ext = extname(file.originalname);
    if (!ext) {
      ext = ".jpg";
    }
    callback(null, `${slug(req.params.id)}-${randomStringForNameURL}${ext}`);
  } else {
    callback(new Error("invalid file"), false);
  }
};

// Chech file type
const fileFilter = (req, file, callback) => {
  const fileTypeArray = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  console.log(file.mimetype);
  if (fileTypeArray.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("invalid file"), false);
  }
};

// Create multer-s3 function for storage
const multerS3Config = multerS3({
  s3: s3Config,
  acl: "public-read",
  bucket: `${process.env.AWS_BUCKET_NAME}/images`,
  cacheControl: "max-age=31536000",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, Object.assign({}, req.body));
  },
  key: fileName,
});

exports.upload = multer({
  storage: multerS3Config,
  limits: {
    fileSize: 1024 * 1024 * 5, // We are allowing only 5 MB files
  },
  fileFilter: fileFilter,
});
