const express = require('express');
const router = express.Router();

// Import existing API routes
const calculator = require('../../api/calculator');

// Mount calculator under /calculator (so server.js can mount this router at /api)
router.use('/calculator', calculator);

module.exports = router;
