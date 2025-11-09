const express = require('express');
const router = express.Router();

// Emission factors for different vehicle types (kg CO2 per km)
const EMISSION_FACTORS = {
    'Electric Vehicle (EV)': 0.0,
    'Hybrid': 0.089,
    'Petrol': 0.192,
    'Diesel': 0.171
};

// Emission factors for different packaging types (kg CO2 per kg of product)
const PACKAGING_FACTORS = {
    'Single-Use': 0.1,
    'Recyclable': 0.05,
    'Reusable': 0.02
};

// Calculate CO2 footprint
router.post('/calculate', (req, res) => {
    try {
        const { productName, distance, weight, vehicleType, packagingType, loadEfficiency } = req.body;

        // Validation - Check for missing fields first
        if (!productName || !distance || !weight || !vehicleType || !packagingType || !loadEfficiency) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Convert and validate inputs
        const distanceNum = parseFloat(distance);
        const weightNum = parseFloat(weight);
        const efficiencyNum = parseFloat(loadEfficiency); // Will be 75.0 if input is "75"

        // **CORRECTION 1: Check for NaN after parseFloat**
        if (isNaN(distanceNum) || isNaN(weightNum) || isNaN(efficiencyNum)) {
            return res.status(400).json({
                success: false,
                error: 'Distance, Weight, and Load Efficiency must be valid numbers.'
            });
        }
        
        // Validation - Check for business logic constraints (e.g., must be positive, efficiency must be reasonable)
        if (distanceNum <= 0 || weightNum <= 0 || efficiencyNum <= 0 || efficiencyNum > 100) {
            return res.status(400).json({
                success: false,
                error: 'Invalid numeric values. Distance and Weight must be positive. Load Efficiency must be between 1 and 100.'
            });
        }

        // Get emission factors
        const vehicleEmission = EMISSION_FACTORS[vehicleType] || EMISSION_FACTORS['Petrol'];
        const packagingEmission = PACKAGING_FACTORS[packagingType] || PACKAGING_FACTORS['Single-Use'];

        // Calculate emissions
        const transportEmissions = distanceNum * vehicleEmission;
        const packagingEmissions = weightNum * packagingEmission;
        
        // **CORRECTION 2: Prevent Division by Zero and ensure efficiencyFactor is correct**
        const efficiencyFactor = efficiencyNum / 100; // Will be 0.75 for 75%

        if (efficiencyFactor === 0) {
            // This case should be prevented by the validation efficiencyNum <= 0, but is a safe guard.
             return res.status(400).json({
                success: false,
                error: 'Load Efficiency cannot result in a zero efficiency factor.'
            });
        }
        
        // Calculate total with efficiency factor
        const totalEmissions = (transportEmissions + packagingEmissions) / efficiencyFactor;

        res.json({
            success: true,
            productName,
            co2Footprint: Number(totalEmissions.toFixed(2)),
            breakdown: {
                transport: Number(transportEmissions.toFixed(2)),
                packaging: Number(packagingEmissions.toFixed(2)),
                efficiencyImpact: Number((totalEmissions - (transportEmissions + packagingEmissions)).toFixed(2))
            },
            unit: 'kg CO₂'
        });

    } catch (error) {
        console.error('Calculation error:', error);
        // The 500 status means an unhandled server error occurred
        res.status(500).json({
            success: false,
            error: 'Failed to calculate CO2 footprint due to an internal server error.'
        });
    }
});

module.exports = router;