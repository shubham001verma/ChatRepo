const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, email, password,mobile,DateofBirth,bio } = req.body;
    const uploadImage=  req.file ? req.file.path : null
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword,uploadImage,mobile,DateofBirth,bio });

        await user.save();
        const token = jwt.sign({id: user._id}, 'secretkey', { expiresIn: '1h' });

        res.json({ token, id: user.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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


exports.checkblock=async(req,res)=>{
     const { userId, selectedUserId } = req.params;

    try {
        const user = await User.findById(userId);
        const isBlocked = user.blockedUsers.includes(selectedUserId);
        res.status(200).json({ isBlocked });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
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
