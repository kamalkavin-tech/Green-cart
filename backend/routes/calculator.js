const express = require('express');
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log('Calculator Route Request:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    next();
});

// CO2 emission factors
const EMISSION_FACTORS = {
    'Electric Vehicle (EV)': 0.0,  // Zero direct emissions
    'Hybrid': 0.089,      // kg CO2 per km
    'Petrol': 0.192,      // kg CO2 per km
    'Diesel': 0.171       // kg CO2 per km
};

const PACKAGING_FACTORS = {
    'Single-Use': 0.1,    // Additional CO2 per kg
    'Recyclable': 0.05,   // Less impact for recyclable
    'Reusable': 0.02      // Least impact for reusable
};

// Calculate CO2 footprint
router.post('/calculate', (req, res) => {
    try {
        const { productName, distance, weight, vehicleType, packagingType, loadEfficiency } = req.body;
        
        // Validate inputs
        if (!distance || !weight || !vehicleType || !packagingType || !loadEfficiency) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        // Convert inputs to numbers
        const distanceNum = Number(distance);
        const weightNum = Number(weight);
        const loadEfficiencyNum = Number(loadEfficiency) / 100; // Convert percentage to decimal

        // Validate converted values
        if (isNaN(distanceNum) || isNaN(weightNum) || isNaN(loadEfficiencyNum)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid numeric values provided'
            });
        }

        // Basic validation
        if (distanceNum <= 0 || weightNum <= 0 || loadEfficiencyNum <= 0 || loadEfficiencyNum > 1) {
            return res.status(400).json({
                success: false,
                error: 'Values must be positive and load efficiency must be between 1 and 100'
            });
        }

        // Get emission factors
        const vehicleEmissionFactor = EMISSION_FACTORS[vehicleType] || EMISSION_FACTORS['Petrol'];
        const packagingEmissionFactor = PACKAGING_FACTORS[packagingType] || PACKAGING_FACTORS['Single-Use'];

        // Calculate emissions
        const transportEmissions = distanceNum * vehicleEmissionFactor;
        const packagingEmissions = weightNum * packagingEmissionFactor;
        const totalEmissions = (transportEmissions + packagingEmissions) / loadEfficiencyNum;

        // Return result
        res.json({
            success: true,
            productName,
            co2Footprint: Number(totalEmissions.toFixed(2)),
            breakdown: {
                transport: Number(transportEmissions.toFixed(2)),
                packaging: Number(packagingEmissions.toFixed(2)),
                efficiencyImpact: Number((totalEmissions - (transportEmissions + packagingEmissions)).toFixed(2))
            },
            unit: 'kg CO2'
        });
    } catch (error) {
        console.error('CO2 calculation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate CO2 footprint'
        });
    }
});

module.exports = router;