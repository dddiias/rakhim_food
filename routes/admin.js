const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/admin/menu', async (req, res) => {
    const products = await Product.find();
    res.render('adminMenu', { products }); 
});

router.get('/admin/menu/new', (req, res) => {
    res.render('addProduct'); 
});

router.post('/admin/menu', async (req, res) => {
    const { name, description, price, images } = req.body;
    const newProduct = new Product({ name, description, price, images });
    await newProduct.save();
    res.redirect('/admin/menu');
});

router.post('/admin/menu/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/menu');
});

router.get('/admin/products/edit/:id', async (req, res) => {
    console.log("Editing product with ID:", req.params.id);
    try {
        const product = await Product.findById(req.params.id);
        res.render('editProduct', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error accessing the product for editing');
    }
});

router.post('/admin/products/update/:id', async (req, res) => {
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


module.exports = router;
