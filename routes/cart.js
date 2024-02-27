const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post('/cart/add', async (req, res) => {
    const { userId, productId, productName, quantity, price } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Требуется авторизация для добавления товара в корзину' });
    }

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, productName, quantity, price }],
                total: price * quantity
            });
        } else {
            let itemIndex = cart.items.findIndex(item => item.productId == productId);

            if (itemIndex > -1) {
                let cartItem = cart.items[itemIndex];
                cartItem.quantity += quantity;
                cartItem.price = price;
                cart.items[itemIndex] = cartItem;
            } else {
                cart.items.push({ productId, productName, quantity, price });
            }
            cart.total += price * quantity;
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при добавлении товара в корзину: " + error });
    }
});


router.get('/cart/view', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ userId });
        if (cart) {
            res.render('cart', { cartItems: cart.items, cartTotal: cart.total });
        } else {
            res.status(404).json({ message: 'Корзина не найдена' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении содержимого корзины: ' + error });
    }
});

router.post('/remove', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { foodItemId } = req.body;
        const cart = await Cart.findOne({ userId });
        if (cart) {
            const updatedItems = cart.items.filter(item => item.foodItemId !== foodItemId);
            cart.items = updatedItems;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Корзина не найдена' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении товара из корзины: ' + error });
    }
});

router.post('/checkout', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ userId });
        if (cart && cart.items.length > 0) {
            const order = new Order({
                userId: cart.userId,
                items: cart.items,
                total: cart.total,
            });
            await order.save();
            cart.items = [];
            cart.total = 0;
            await cart.save();
            res.status(200).json({ message: 'Заказ успешно оформлен' });
        } else {
            res.status(400).json({ message: 'Невозможно оформить заказ: корзина пуста или не найдена' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при оформлении заказа: ' + error });
    }
});

module.exports = router;
