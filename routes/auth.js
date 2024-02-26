const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
  });

router.post('/register', async (req, res) => {
  const { username, password, name, birthdate, address, phoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, name, birthdate, address, phoneNumber });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.redirect('/register');
  }
});

router.get('/login', (req, res) => {
    res.render('login');
  });

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id; 
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

module.exports = router;