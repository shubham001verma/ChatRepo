const multer = require("multer");
const fs = require("fs/promises"); // For file handling (image deletion)
const path = require("path");

// Image storage configuration
const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() +'_'+ file.fieldname +  path.extname(file.originalname));
    }
});

// Create the multer upload middleware
const upload = multer({
    storage: imgconfig,
});

// Export the middleware for use in routes
module.exports = upload;
