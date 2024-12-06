//user controllers
//[Dependencies and modules]
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

const {errorHandler} = require("../auth");

/*
    *** functions will be placed here ***
*/

// User Registration
module.exports.registerUser = async (req, res) => {
    try {
        if (!req.body.email.includes("@")) {
            return res.status(400).send({ error: 'Email invalid' });
        }

        if (req.body.mobileNo.length !== 11) {
            return res.status(400).send({ error: 'Mobile number invalid' });
        }

        if (req.body.password.length < 8) {
            return res.status(400).send({ error: 'Password must be at least 8 characters' });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already in use' });
        }

        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        });

        await newUser.save();
        return res.status(201).send({ message: 'Registered Successfully' });
        
    } catch (error) {
       return res.status(500).send({details: error});
    }
};


// Login User
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.includes("@")) {
            return res.status(400).send({ error: 'Invalid email' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ error: 'No Email found' });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (isPasswordCorrect) {
            return res.status(200).send({ 
                access: auth.createAccessToken(user)
            });
        } else {
            return res.status(401).send({ error: 'Email and password do not match' });
        }
        
    } catch (error) {
        return res.status(500).send({details: error});
    }
};


// Retrieve User Details
module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { password: 0 });

        if (user) {
            return res.status(200).send({ user });
        } else {
            return res.status(404).send({ error: 'User not found' });
        }
    } catch (error) {
        return res.status(500).send({details: error});
    }
};


// Retrieve all users
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false });

        if(users && users.length > 0){
            return res.status(200).send({users});
        } else {
            return res.status(404).send({ error: 'No users found'});
        }
    } catch (error) {
        return res.status(500).send({details: error});
    }
};


// Route to set a user as Admin
module.exports.updateUserAsAdmin = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true });

        if (user) {
            res.status(200).send({ updatedUser: user });
        } else {
            return res.status(404).send({ error: 'User not found' });
        }
 
    } catch (error) {
        return res.status(500).send({ error: 'Failed in Find', details: error });
    }
};



// Reset Password
module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; 

   
    const hashedPassword = await bcrypt.hash(newPassword, 10);

   
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    
    return res.status(201).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Failed in Find', details: error});
  }
};

// Update Profile
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, mobileNo } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,  // Correct usage
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.status(200).json( updatedUser );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
