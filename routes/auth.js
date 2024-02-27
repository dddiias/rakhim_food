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

      const newCart = new Cart({
          userId: newUser._id,
          items: [],
          total: 0
      });
      await newCart.save();

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
    req.session.isAuthenticated = true;
    req.session.user = {
        id: user.id, 
        name: user.name, 
        username: user.username
    };
    
    res.redirect('/');
  } else {
    req.flash('error_msg', 'Invalid username or password');
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Ошибка при попытке выхода из системы:', err);
          return res.redirect('/');
      }

      res.clearCookie('connect.sid'); 
      res.redirect('/index');
  });
});


module.exports = router;
