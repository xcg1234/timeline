const router = require('express').Router();
const User = require('../models/User'); // import User model
const bcrypt = require('bcrypt');

//register route at /users/register

router.post('/register', async (req, res) => {
	try {
		//generate new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		//create new user

		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		//save user and send response

		const user = await newUser.save();
		res.status(200).json(user._id);
	} catch (error) {
		res.status(500).json(error);
	}
});

//login route at /users/login
router.post('/login', async (req, res) => {
	try {
		//find user
		const user = await User.findOne({
			//compare input username with database
			username: req.body.username,
		});
		!user && res.status(400).json('wrong user name or password');

		//validate
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		); //compare password input vs database
		!validPassword && res.status(400).json('wrong user name or password');

		//send response

		res.status(200).json({ _id: user._id, username: user.username });
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;