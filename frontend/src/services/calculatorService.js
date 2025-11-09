import axios from 'axios';

// CO2 calculation service
const API_BASE_URL = 'http://localhost:5000/api';

export const calculateCO2Footprint = async (data) => {
    console.log('Sending calculation request:', data);
    try {
        // FIX APPLIED: Removed the redundant '/calculator' segment from the URL path.
        // The endpoint is now correctly: http://localhost:5000/api/calculate
        const response = await axios.post(`${API_BASE_URL}/calculate`, {
            productName: data.productName,
            distance: parseFloat(data.distance),
            weight: parseFloat(data.weight),
            vehicleType: data.vehicleType,
            packagingType: data.packagingType,
            loadEfficiency: parseFloat(data.loadEfficiency)
        });
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to calculate CO2 footprint');
    }
};