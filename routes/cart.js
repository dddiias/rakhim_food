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

router.post('/cart/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });
        if (cart) {
            const updatedItems = cart.items.filter(item => item._id.toString() !== productId);
            cart.items = updatedItems;
            cart.total = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            res.status(200).json({ message: 'Товар успешно удален из корзины', cart });
        } else {
            res.status(404).json({ message: 'Корзина не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при удалении товара из корзины:', error);
        res.status(500).json({ error: 'Ошибка при удалении товара из корзины: ' + error.message });
    }
});


router.get('/cart/view', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const cart = await Cart.findOne({ userId });
        if (cart) {
            res.render('cart', { user: req.session.user, cartItems: cart.items, cartTotal: cart.total });
        } else {
            res.status(404).json({ message: 'Корзина не найдена' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении содержимого корзины: ' + error });
    }
});

router.post('/create-order', async (req, res) => {
    try {
        const { userId, phone, address, paymentMethod } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(400).send('Корзина не найдена');
        }

        const order = new Order({
            userId,
            items: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            total: cart.items.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0),
            phone,
            address,
            paymentMethod,
            status: 'Новый'
        });

        await order.save();

        await Cart.findOneAndDelete({ userId });

        res.redirect('/order');
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).send('Ошибка на сервере при создании заказа');
    }
});

router.get('/checkout', (req, res) => {
    res.render('checkout', { user: req.user });
});





module.exports = router;
