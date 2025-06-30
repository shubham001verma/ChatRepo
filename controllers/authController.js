const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const otpStore = new Map();
const pendingUsers = new Map(); // Temporarily store user data


const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Replace with your SMTP server host (e.g., smtp.sendgrid.net, smtp.mailgun.org)
    port: 465, // Common ports: 465 (for SMTPS/SSL) or 587 (for STARTTLS)
    secure: false, // Use true for port 465 (SSL), false for port 587 (STARTTLS).
                    // If using secure: false and port 587, ensure 'requireTLS: true' might be needed
                    // depending on your server's configuration.
    auth: {
        user: 'support@webitof.com', // Your email address
        pass: 'w2k-Em8Q:c3zDRi', // Your email password or app-specific password
    },
    // Optional: Add TLS options if needed for self-signed certificates or specific TLS versions
    // tls: {
    //     rejectUnauthorized: false // Set to true for production, false only for development with self-signed certs
    // }
});


exports.signup = async (req, res) => {
    const { name, email, password, mobile, DateofBirth, bio } = req.body;
    const uploadImage = req.file ? req.file.path : null;

    try {
        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ msg: 'All fields are required.' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = { name, email, password: hashedPassword, uploadImage, mobile, DateofBirth, bio };

        const OTP = Math.floor(1000 + Math.random() * 9000).toString();

        // Send OTP via email
        const mailOptions = {
            from: 'support@webitof.com', // Sender address
            to: email, // Recipient address
            subject: 'Your OTP for Signup Verification',
            text: `Your OTP is ${OTP}. It is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        // Store OTP and user data temporarily
        otpStore.set(email.toLowerCase(), { otp: OTP, expiresAt: Date.now() + 5 * 60 * 1000 });
        pendingUsers.set(email.toLowerCase(), userData);

        console.log('Stored OTP:', otpStore.get(email.toLowerCase()));

        res.status(200).json({ msg: 'OTP sent to your email successfully.' });
    } catch (err) {
        console.error('Error in signup:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Verify OTP endpoint
exports.verifyOTP = async (req, res) => {
    const { otp, email } = req.body;

    if (!otp || !email) {
        return res.status(400).json({ msg: 'Email and OTP are required.' });
    }

    try {
        const trimmedEmail = email.trim().toLowerCase();
        console.log('Verifying OTP for email:', trimmedEmail);

        const storedData = otpStore.get(trimmedEmail);
        if (!storedData) {
            return res.status(400).json({ msg: 'OTP has expired or is invalid.' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP.' });
        ;
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(trimmedEmail);
            pendingUsers.delete(trimmedEmail);
            return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
        }

        // OTP is valid, clear it from store
        otpStore.delete(trimmedEmail);

        const userData = pendingUsers.get(trimmedEmail);
        if (!userData) {
            return res.status(400).json({ msg: 'User data not found. Please sign up again.' });
        }

        // Save user to database
        const newUser = new User(userData);
        await newUser.save();

        // Clear pending user data after successful registration
        pendingUsers.delete(trimmedEmail);

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || 'defaultsecretkey',
            { expiresIn: '1h' }
        );

        res.status(200).json({ msg: 'OTP verified successfully. User registered.', token, userId: newUser._id });
    } catch (err) {
        console.error('Error in verifyOTP:', err.message);
        res.status(500).json({ msg: 'Server Error. Please try again later.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        
        const token = jwt.sign({id: user._id}, 'secretkey', { expiresIn: '1h' });

        res.json({ token, id: user.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User with this email does not exist.' });
        }

        const OTP = Math.floor(1000 + Math.random() * 9000).toString();

        // Send OTP via email
        const mailOptions = {
            from: 'sshubham123verma@gmail.com',
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP for resetting your password is ${OTP}. It is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        // Store OTP with expiry
        otpStore.set(email.toLowerCase(), { otp: OTP, expiresAt: Date.now() + 5 * 60 * 1000 });

        console.log('Stored OTP for password reset:', otpStore.get(email.toLowerCase()));

        res.status(200).json({ msg: 'OTP sent to your email for password reset.' });
    } catch (err) {
        console.error('Error in forgetPassword:', err.message);
        res.status(500).json({ msg: 'Server Error. Please try again later.' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ msg: 'Email, OTP, and new password are required.' });
    }

    try {
        const trimmedEmail = email.trim().toLowerCase();

        const storedData = otpStore.get(trimmedEmail);
        if (!storedData) {
            return res.status(400).json({ msg: 'OTP has expired or is invalid.' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP.' });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(trimmedEmail);
            return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
        }

        otpStore.delete(trimmedEmail);

        const user = await User.findOne({ email: trimmedEmail });
        if (!user) {
            return res.status(404).json({ msg: 'User with this email does not exist.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: 'Password reset successfully. You can now log in with your new password.' });
    } catch (err) {
        console.error('Error in resetPassword:', err.message);
        res.status(500).json({ msg: 'Server Error. Please try again later.' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
       
        const users = await User.find(); 
        res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Get user by ID
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Exclude password
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
      const { name, email,mobile,DateofBirth ,bio } = req.body;
  
      // Fetch the existing user before updating
      const existingUser = await User.findById(req.params.id);
      if (!existingUser) return res.status(404).json({ message: 'User not found' });
  
      // Check for file upload and assign image path, otherwise keep the existing image
      const uploadImage = req.file ? req.file.path : existingUser.uploadImage;
  
      // Update the user with new values
      const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, uploadImage,mobile,DateofBirth,bio }, { new: true });
      
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error); // Log the error for debugging
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}
exports.block =async(req,res)=>{
     const { userId, blockUserId } = req.body;
    
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.blockedUsers.includes(blockUserId)) {
            user.blockedUsers.push(blockUserId);
            await user.save();
            return res.status(200).json({ message: 'User blocked successfully' });
        } else {
            return res.status(400).json({ message: 'User is already blocked' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}


exports.unblock=async(req,res)=>{
     const { userId, unblockUserId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== unblockUserId);
        await user.save();
        
        return res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}


exports.checkblockuser=async(req,res)=>{
     const { userId, selectedUserId } = req.params;

    try {
        const user = await User.findById(userId);
        const isBlocked = user.blockedUsers.includes(selectedUserId);
        res.status(200).json({ isBlocked });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
exports.checkblock=async(req,res)=>{
     const { userId, selectedUserId } = req.params;

    try {
        const user = await User.findById(selectedUserId);
        const isBlocked = user.blockedUsers.includes(userId);
        res.status(200).json({ isBlocked });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
exports.isblock=async(req,res)=>{
     const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ isBlocked: user.isBlocked });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.remove();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.logoutUser = async (req, res) => {
    try {
     
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error });
    }
  };
