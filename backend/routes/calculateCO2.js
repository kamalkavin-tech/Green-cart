const express = require('express');
const router = express.Router();

// CO2 emission factors (example values, adjust based on actual data)
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
function calculateCO2Footprint(distance, weight, vehicleType, packagingType, loadEfficiency) {
    try {
        // Validate inputs
        if (!distance || !weight || !vehicleType || !packagingType || !loadEfficiency) {
            throw new Error('Missing required parameters');
        }

        // Convert inputs to numbers
        distance = Number(distance);
        weight = Number(weight);
        loadEfficiency = Number(loadEfficiency) / 100; // Convert percentage to decimal

        // Basic validation
        if (distance <= 0 || weight <= 0 || loadEfficiency <= 0 || loadEfficiency > 1) {
            throw new Error('Invalid input values');
        }

        // Get emission factors
        const vehicleEmissionFactor = EMISSION_FACTORS[vehicleType] || EMISSION_FACTORS['Petrol'];
        const packagingEmissionFactor = PACKAGING_FACTORS[packagingType] || PACKAGING_FACTORS['Single-Use'];

        // Calculate base emissions from transport
        const transportEmissions = distance * vehicleEmissionFactor;

        // Calculate packaging emissions
        const packagingEmissions = weight * packagingEmissionFactor;

        // Apply load efficiency factor (less efficient = more emissions per unit)
        const totalEmissions = (transportEmissions + packagingEmissions) / loadEfficiency;

        return {
            success: true,
            co2Footprint: Number(totalEmissions.toFixed(2)),
            breakdown: {
                transport: Number(transportEmissions.toFixed(2)),
                packaging: Number(packagingEmissions.toFixed(2)),
                efficiencyImpact: Number((totalEmissions - (transportEmissions + packagingEmissions)).toFixed(2))
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// API endpoint for CO2 calculation
router.post('/calculate', (req, res) => {
    const { productName, distance, weight, vehicleType, packagingType, loadEfficiency } = req.body;

    const result = calculateCO2Footprint(
        distance,
        weight,
        vehicleType,
        packagingType,
        loadEfficiency
    );

    if (result.success) {
        res.json({
            success: true,
            productName,
            co2Footprint: result.co2Footprint,
            breakdown: result.breakdown,
            unit: 'kg CO2'
        });
    } else {
        res.status(400).json({
            success: false,
            error: result.error
        });
    }
});

module.exports = router;