const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); 
        const user = req.session.user || null; 
        res.render('index', { products, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});
router.get('/index', async (req, res) => {
    try {
        const products = await Product.find(); 
        const user = req.session.user || null; 
        res.render('index', { products, user }); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;
