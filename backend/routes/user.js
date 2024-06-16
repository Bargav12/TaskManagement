const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// SIGN UP
router.post("/sign-up", async (req, res) => {
    try {
        
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be at least 4 characters" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashpass = await bcrypt.hash(req.body.password,10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashpass,
          });
        await newUser.save();

        return res.status(201).json({ message: "Sign up successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
});

// LOGIN
router.post("/log-in", async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [{ name: username }, { jti: jwt.sign({}, "mernTM") }];
        const token = jwt.sign({ authClaims }, "mernTM", { expiresIn: "2d" });
        res.status(200).json({ id: existingUser._id, token: token });
      } else {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
    });
  });


module.exports = router;