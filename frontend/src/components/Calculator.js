import React, { useState } from 'react';
import { calculateCO2Footprint } from '../services/calculatorService';

const Calculator = () => {
    const [formData, setFormData] = useState({
        productName: '',
        distance: '',
        weight: '',
        vehicleType: 'Electric Vehicle (EV)',
        packagingType: 'Single-Use',
        loadEfficiency: ''
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null); // Clear error when user makes changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log('Submitting form data:', formData);

        // Basic validation
        if (!formData.productName || !formData.distance || !formData.weight || !formData.loadEfficiency) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        // Validate numeric fields
        const distance = parseFloat(formData.distance);
        const weight = parseFloat(formData.weight);
        const efficiency = parseFloat(formData.loadEfficiency);

        if (isNaN(distance) || distance <= 0) {
            setError('Distance must be a positive number');
            setLoading(false);
            return;
        }
        if (isNaN(weight) || weight <= 0) {
            setError('Weight must be a positive number');
            setLoading(false);
            return;
        }
        if (isNaN(efficiency) || efficiency <= 0 || efficiency > 100) {
            setError('Load efficiency must be between 1 and 100');
            setLoading(false);
            return;
        }

        try {
            const response = await calculateCO2Footprint(formData);
            setResult(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Calculate CO₂ Footprint</h1>
            <p className="text-gray-600 mb-8">Enter your delivery details to estimate emissions</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">Product Name *</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Distance (km) *</label>
                        <input
                            type="number"
                            name="distance"
                            value={formData.distance}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            min="0"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Weight (kg) *</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            min="0"
                            step="0.1"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Vehicle Type</label>
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option>Electric Vehicle (EV)</option>
                        <option>Hybrid</option>
                        <option>Petrol</option>
                        <option>Diesel</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Packaging Type</label>
                    <select
                        name="packagingType"
                        value={formData.packagingType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option>Single-Use</option>
                        <option>Recyclable</option>
                        <option>Reusable</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Load Efficiency (%) *</label>
                    <input
                        type="number"
                        name="loadEfficiency"
                        value={formData.loadEfficiency}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        min="1"
                        max="100"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Calculating...' : 'Calculate CO₂ Footprint'}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 p-6 bg-green-50 rounded">
                    <h2 className="text-2xl font-bold mb-4">Results</h2>
                    <div className="space-y-2">
                        <p>Product: {result.productName}</p>
                        <p>Total CO₂ Footprint: {result.co2Footprint} {result.unit}</p>
                        <h3 className="font-semibold mt-4">Breakdown:</h3>
                        <ul className="list-disc pl-5">
                            <li>Transport Emissions: {result.breakdown.transport} kg CO₂</li>
                            <li>Packaging Impact: {result.breakdown.packaging} kg CO₂</li>
                            <li>Efficiency Impact: {result.breakdown.efficiencyImpact} kg CO₂</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calculator;