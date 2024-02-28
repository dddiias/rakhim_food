const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/order/:orderId', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const orderId = req.params.orderId;
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).send('Заказ не найден');
        }
        res.render('cart/order', { user: req.session.user, order });
    } catch (error) {
        console.error('Ошибка при загрузке страницы заказа:', error);
        res.status(500).send('Произошла ошибка при загрузке страницы заказа');
    }
});

router.post('/cancel-order', async (req, res) => {
    try {
        const orderId = req.body.orderId;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        order.status = 'Отменен';

        await order.save();

        res.redirect('/index');
    } catch (error) {
        console.error('Ошибка при отмене заказа:', error);
        res.status(500).json({ error: 'Ошибка при отмене заказа: ' + error.message });
    }
});

module.exports = router;
