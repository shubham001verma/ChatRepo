const multer = require("multer");
const fs = require("fs/promises"); // For file handling (image deletion)
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});



const upload = multer({ storage });


// Export the middleware for use in routes
module.exports = upload;

