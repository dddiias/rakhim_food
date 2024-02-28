const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { loadUser } = require('../middleware/user');

router.get('/profile', loadUser, async (req, res) => {
    try {
        const userId = req.session.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const orders = await Order.find({ userId: userId });

        res.render('profile', { user: user, orders: orders });

    } catch (error) {
        console.error('Ошибка при загрузке профиля пользователя:', error);
        res.status(500).json({ error: 'Ошибка при загрузке профиля пользователя' });
    }
});

router.get('/edit', loadUser, (req, res) => {
    res.render('editProfile', { user: req.user });
});

router.post('/update', loadUser, async (req, res) => {
    try {
        const { name, password, birthdate, address, phoneNumber } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        user.name = name;
        user.birthdate = birthdate;
        user.address = address;
        user.phoneNumber = phoneNumber;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.redirect('/profile');

    } catch (error) {
        console.error('Ошибка при обновлении данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка при обновлении данных пользователя' });
    }
});


module.exports = router;
