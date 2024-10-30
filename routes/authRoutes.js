
const express = require('express');
const upload = require('../middleware/Multer')
const {
    signup,
    login,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    logoutUser
} = require('../controllers/authController')

const router = express.Router();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Assuming decoded.user contains the user object
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
router.post('/signup',upload.single("uploadImage"), signup);
router.post('/login', login);
router.get('/users',authMiddleware, getAllUsers); 
router.get('/users/:id', getUser); 
router.put('/update/:id',upload.single("uploadImage"), updateUser); 
router.delete('/users/:id', deleteUser); 
router.get('/logout', logoutUser);

module.exports = router;
