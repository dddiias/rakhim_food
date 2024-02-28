const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const requireAdminAuth = require('../middleware/AdminAuth');

router.get('/admin/menu', requireAdminAuth, async (req, res) => {
    const products = await Product.find();
    res.render('admin/adminMenu', { products });
});

router.get('/admin/menu/new', requireAdminAuth, (req, res) => {
    res.render('admin/addProduct');
});

router.post('/admin/menu', requireAdminAuth, async (req, res) => {
    const { name, description, price, images } = req.body;
    const newProduct = new Product({ name, description, price, images });
    await newProduct.save();
    res.redirect('/admin/menu');
});

router.post('/admin/menu/delete/:id', requireAdminAuth, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/menu');
});

router.get('/admin/products/edit/:id', requireAdminAuth, async (req, res) => {
    console.log("Editing product with ID:", req.params.id);
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin/editProduct', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error accessing the product for editing');
    }
});

router.post('/admin/products/update/:id', requireAdminAuth, async (req, res) => {
    const { name, description, price, images } = req.body;
    try {
        await Product.findByIdAndUpdate(req.params.id, {
            name,
            description,
            price,
            images
        });
        res.redirect('/admin/menu');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating the product');
    }
});

router.get('/admin/orders', requireAdminAuth, async (req, res) => {
    try {
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const orders = await Order.find().sort({ total: sortDirection });
        res.render('admin/adminOrder', { orders: orders });
    } catch (error) {
        console.error('Ошибка при загрузке всех заказов:', error);
        res.status(500).json({ error: 'Ошибка при загрузке всех заказов' });
    }
});


router.get('/admin/orders/:orderId', requireAdminAuth, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send('Заказ не найден');
        }

        res.render('admin/adminOrderDetails', { order: order });
    } catch (error) {
        console.error('Ошибка при загрузке данных о заказе:', error);
        res.status(500).send('Произошла ошибка при загрузке данных о заказе');
    }
});

router.post('/admin/orders/:orderId/update-status', requireAdminAuth, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const newStatus = req.body.status;

        const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.redirect(`/admin/orders/${orderId}`);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Error updating order status');
    }
});

router.get('/admin/ordersByDay', requireAdminAuth, async (req, res) => {
    try {
        let query = {};
        const { startDate, endDate } = req.query;
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const orders = await Order.find(query);

        res.render('admin/adminOrder', { orders: orders });
    } catch (error) {
        console.error('Ошибка при загрузке всех заказов:', error);
        res.status(500).json({ error: 'Ошибка при загрузке всех заказов' });
    }
});


router.get('/admin', (req, res) => {
    res.render('admin/admin'); 
});

router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
        req.session.adminLoggedIn = true; 
        res.redirect('/admin/dashboard'); 
    } else {
        res.render('admin/admin', { error: 'Неверный логин или пароль' }); 
    }
});

router.get('/admin/dashboard', requireAdminAuth, (req, res) => {
    res.render('admin/dashboard'); 
});

router.get('/admin/logout', (req, res) => {
    req.session.adminLoggedIn = false; 
    res.redirect('/admin/login'); 
});


module.exports = router;
