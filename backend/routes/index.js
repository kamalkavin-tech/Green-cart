const express = require('express');
const router = express.Router();

// Example route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Add more routes here
router.get('/products', (req, res) => {
    res.json([
        { id: 1, name: 'Organic Apples', price: 2.99, category: 'Fruits' },
        { id: 2, name: 'Fresh Spinach', price: 1.99, category: 'Vegetables' },
        { id: 3, name: 'Whole Grain Bread', price: 3.49, category: 'Bakery' }
    ]);
});

module.exports = router;