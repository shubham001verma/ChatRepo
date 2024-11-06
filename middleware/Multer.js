const multer = require("multer");
const fs = require("fs/promises"); // For file handling (image deletion)
const path = require("path");

// Image storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

// File filter based on type
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images, videos, and PDFs are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Export the middleware for use in routes
module.exports = upload;
