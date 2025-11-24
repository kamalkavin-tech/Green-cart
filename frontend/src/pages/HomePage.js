import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { AlertCircle, Package, Leaf, Award, TrendingUp, ArrowDownCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const sampleOrders = [{
        id: "1",
        product_name: "Eco-Friendly T-Shirt",
        distance: 30,
        vehicle_type: "ev",
        packaging_type: "reusable",
        co2_emissions: 0.18,
        eco_score: 95
    },
    {
        id: "2",
        product_name: "Test Product",
        distance: 25,
        vehicle_type: "ev",
        packaging_type: "reusable",
        co2_emissions: 2.3,
        eco_score: 85
    }
];

function HomePage() {
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 2,
        totalCO2: 2.48,
        avgCO2PerOrder: 1.24,
        ecoScore: 90,
        recentOrders: sampleOrders
    });
    const [loading, setLoading] = useState(false);
    const [co2Result, setCo2Result] = useState(null);
    const [formData, setFormData] = useState({
        product_name: "",
        weight: "",
        distance: "",
        vehicle_type: "Electric Vehicle (EV)",
        packaging_type: "Single-Use",
        load_efficiency: "75"
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async() => {
        try {
            setLoading(true);
            const [ecoScoreResponse, ordersResponse] = await Promise.all([
                axios.get(`${API_URL}/api/eco_score`).catch(() => null),
                axios.get(`${API_URL}/api/orders`).catch(() => null)
            ]);

            const orders = ordersResponse ? .data || sampleOrders;

            setDashboardData({
                totalOrders: ecoScoreResponse ? .data.total_orders || orders.length,
                totalCO2: ecoScoreResponse ? .data.total_co2 || 2.48,
                avgCO2PerOrder: ecoScoreResponse ? .data.avg_co2_per_order || 1.24,
                ecoScore: ecoScoreResponse ? .data.eco_score || 90,
                recentOrders: orders
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setDashboardData({
                totalOrders: sampleOrders.length,
                totalCO2: 2.48,
                avgCO2PerOrder: 1.24,
                ecoScore: 90,
                recentOrders: sampleOrders
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const vehicleTypeMap = {
                'Electric Vehicle (EV)': 'ev',
                'Diesel Truck': 'diesel',
                'Gasoline Car': 'petrol',
                'Hybrid Vehicle': 'ev'
            };

            const packagingTypeMap = {
                'Single-Use': 'single-use',
                'Recycled': 'reusable',
                'Biodegradable': 'reusable',
                'Reusable': 'reusable'
            };

            const response = await axios.post(`${API_URL}/api/predict_co2`, {
                distance: parseFloat(formData.distance),
                weight: parseFloat(formData.weight),
                vehicle_type: vehicleTypeMap[formData.vehicle_type] || 'ev',
                packaging_type: packagingTypeMap[formData.packaging_type] || 'single-use',
                load_efficiency: parseFloat(formData.load_efficiency)
            });

            setCo2Result({
                co2_emissions: response.data.predicted_co2_kg ? .toFixed(2) || response.data.co2_emissions,
                eco_score: response.data.eco_score,
                advice: response.data.advice,
                eco_badge: response.data.eco_badge
            });

            fetchDashboardData();
        } catch (error) {
            console.error("Error calculating CO2:", error);
            console.error("Error details:", error.response ? .data);
            setCo2Result({
                co2_emissions: "N/A",
                eco_score: "N/A",
                error: "Failed to calculate. Please try again."
            });
        }
    };

    const getEcoScoreColor = (score) => {
        const numScore = typeof score === 'number' ? score : parseInt(score);
        if (numScore >= 85) return "text-green-600";
        if (numScore >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const getEcoScoreBadgeClass = (score) => {
        const numScore = typeof score === 'number' ? score : parseInt(score);
        if (numScore >= 85) return "bg-green-100 text-green-800";
        if (numScore >= 70) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return ( <
            div className = "min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50" >
            <
            div className = "container mx-auto px-4 py-8 max-w-7xl" >
            <
            div className = "mb-12" >
            <
            div className = "text-left mb-8" >
            <
            h1 className = "text-4xl font-bold text-gray-900 mb-2" > Analytics Dashboard < /h1> <
            p className = "text-lg text-gray-600" > Track your environmental impact and sustainability progress < /p> < /
            div >

            <
            div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" >
            <
            Card className = "bg-white hover:shadow-lg transition-shadow border-0 shadow-md" >
            <
            CardContent className = "pt-6" >
            <
            div className = "flex items-center justify-between mb-2" >
            <
            div className = "p-3 bg-blue-100 rounded-lg" >
            <
            Package className = "h-6 w-6 text-blue-600" / >
            <
            /div> < /
            div > <
            div className = "mt-4" >
            <
            p className = "text-sm font-medium text-gray-600" > Total Orders < /p> <
            p className = "text-3xl font-bold text-gray-900 mt-1" > { dashboardData.totalOrders } < /p> < /
            div > <
            /CardContent> < /
            Card >

            <
            Card className = "bg-white hover:shadow-lg transition-shadow border-0 shadow-md" >
            <
            CardContent className = "pt-6" >
            <
            div className = "flex items-center justify-between mb-2" >
            <
            div className = "p-3 bg-orange-100 rounded-lg" >
            <
            TrendingUp className = "h-6 w-6 text-orange-600" / >
            <
            /div> < /
            div > <
            div className = "mt-4" >
            <
            p className = "text-sm font-medium text-gray-600" > Total CO₂(kg) < /p> <
            p className = "text-3xl font-bold text-gray-900 mt-1" > { dashboardData.totalCO2.toFixed(2) } < /p> < /
            div > <
            /CardContent> < /
            Card >

            <
            Card className = "bg-white hover:shadow-lg transition-shadow border-0 shadow-md" >
            <
            CardContent className = "pt-6" >
            <
            div className = "flex items-center justify-between mb-2" >
            <
            div className = "p-3 bg-green-100 rounded-lg" >
            <
            Leaf className = "h-6 w-6 text-green-600" / >
            <
            /div> < /
            div > <
            div className = "mt-4" >
            <
            p className = "text-sm font-medium text-gray-600" > Avg CO₂ / Order(kg) < /p> <
            p className = "text-3xl font-bold text-gray-900 mt-1" > { dashboardData.avgCO2PerOrder } < /p> < /
            div > <
            /CardContent> < /
            Card >

            <
            Card className = "bg-white hover:shadow-lg transition-shadow border-0 shadow-md" >
            <
            CardContent className = "pt-6" >
            <
            div className = "flex items-center justify-between mb-2" >
            <
            div className = "p-3 bg-purple-100 rounded-lg" >
            <
            Award className = "h-6 w-6 text-purple-600" / >
            <
            /div> < /
            div > <
            div className = "mt-4" >
            <
            p className = "text-sm font-medium text-gray-600" > Eco Score < /p> <
            p className = "text-3xl font-bold text-gray-900 mt-1" > { dashboardData.ecoScore } < /p> < /
            div > <
            /CardContent> < /
            Card > <
            /div> < /
            div >

            <
            div className = "mb-12" >
            <
            div className = "grid grid-cols-1 lg:grid-cols-2 gap-8" >
            <
            Card className = "bg-white border-0 shadow-md" >
            <
            CardHeader className = "bg-gradient-to-r from-green-50 to-blue-50 border-b" >
            <
            CardTitle className = "text-xl" > Calculate Your Carbon Footprint < /CardTitle> <
            CardDescription className = "text-gray-600" > Enter your delivery details to estimate emissions < /CardDescription> < /
            CardHeader > <
            CardContent className = "pt-6" >
            <
            form onSubmit = { handleSubmit }
            className = "space-y-5" >
            <
            div className = "space-y-2" >
            <
            Label htmlFor = "product_name"
            className = "text-sm font-semibold" > Product Name < span className = "text-red-500" > * < /span></Label >
            <
            Input id = "product_name"
            placeholder = "e.g., Organic Cotton T-Shirt"
            value = { formData.product_name }
            onChange = {
                (e) => setFormData({...formData, product_name: e.target.value })
            }
            required className = "border-gray-300" / >
            <
            /div> <
            div className = "grid grid-cols-2 gap-4" >
            <
            div className = "space-y-2" >
            <
            Label htmlFor = "distance"
            className = "text-sm font-semibold" > Distance(km) < span className = "text-red-500" > * < /span></Label >
            <
            Input id = "distance"
            type = "number"
            step = "0.1"
            placeholder = "50"
            value = { formData.distance }
            onChange = {
                (e) => setFormData({...formData, distance: e.target.value })
            }
            required className = "border-gray-300" / >
            <
            /div> <
            div className = "space-y-2" >
            <
            Label htmlFor = "weight"
            className = "text-sm font-semibold" > Weight(kg) < span className = "text-red-500" > * < /span></Label >
            <
            Input id = "weight"
            type = "number"
            step = "0.1"
            placeholder = "2.5"
            value = { formData.weight }
            onChange = {
                (e) => setFormData({...formData, weight: e.target.value })
            }
            required className = "border-gray-300" / >
            <
            /div> < /
            div > <
            div className = "space-y-2" >
            <
            Label htmlFor = "vehicle_type"
            className = "text-sm font-semibold" > Vehicle Type < /Label> <
            select id = "vehicle_type"
            className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value = { formData.vehicle_type }
            onChange = {
                (e) => setFormData({...formData, vehicle_type: e.target.value })
            } >
            <
            option value = "Electric Vehicle (EV)" > Electric Vehicle(EV) < /option> <
            option value = "Diesel Truck" > Diesel Truck < /option> <
            option value = "Gasoline Car" > Gasoline Car < /option> <
            option value = "Hybrid Vehicle" > Hybrid Vehicle < /option> < /
            select > <
            /div> <
            div className = "space-y-2" >
            <
            Label htmlFor = "packaging_type"
            className = "text-sm font-semibold" > Packaging Type < /Label> <
            select id = "packaging_type"
            className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value = { formData.packaging_type }
            onChange = {
                (e) => setFormData({...formData, packaging_type: e.target.value })
            } >
            <
            option value = "Single-Use" > Single - Use < /option> <
            option value = "Recycled" > Recycled < /option> <
            option value = "Biodegradable" > Biodegradable < /option> <
            option value = "Reusable" > Reusable < /option> < /
            select > <
            /div> <
            div className = "space-y-2" >
            <
            Label htmlFor = "load_efficiency"
            className = "text-sm font-semibold" > Load Efficiency( % ) < /Label> <
            Input id = "load_efficiency"
            type = "number"
            min = "1"
            max = "100"
            placeholder = "75"
            value = { formData.load_efficiency }
            onChange = {
                (e) => setFormData({...formData, load_efficiency: e.target.value })
            }
            className = "border-gray-300" / >
            <
            /div> <
            Button type = "submit"
            className = "w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-base" > Calculate CO₂ Footprint < /Button> < /
            form > <
            /CardContent> < /
            Card >

            <
            div className = "flex items-center justify-center" > {
                co2Result ? ( <
                    Card className = "w-full bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-md" >
                    <
                    CardContent className = "pt-8 pb-8" >
                    <
                    div className = "text-center space-y-6" >
                    <
                    div className = "flex justify-center" >
                    <
                    div className = "p-4 bg-white rounded-full shadow-lg" >
                    <
                    ArrowDownCircle className = "h-16 w-16 text-green-600" / >
                    <
                    /div> < /
                    div > <
                    div >
                    <
                    p className = "text-gray-600 text-lg mb-2" > Estimated CO₂ Emissions < /p> <
                    p className = "text-5xl font-bold text-gray-900" > { co2Result.co2_emissions } < span className = "text-2xl ml-2" > kg < /span></p >
                    <
                    /div> <
                    div className = "pt-4 border-t border-gray-200" >
                    <
                    p className = "text-gray-600 text-lg mb-2" > Eco Score < /p> <
                    div className = "flex items-center justify-center gap-3" >
                    <
                    p className = { `text-4xl font-bold ${getEcoScoreColor(co2Result.eco_score)}` } > { co2Result.eco_score } < /p> <
                    Badge className = { `text-lg px-4 py-1 ${getEcoScoreBadgeClass(co2Result.eco_score)}` } > { co2Result.eco_score >= 85 ? "Excellent" : co2Result.eco_score >= 70 ? "Good" : "Fair" } <
                    /Badge> < /
                    div > <
                    /div> {
                    co2Result.error && ( <
                        Alert className = "mt-4 bg-red-50 border-red-200" >
                        <
                        AlertCircle className = "h-4 w-4 text-red-600" / >
                        <
                        AlertDescription className = "text-red-800" > { co2Result.error } < /AlertDescription> < /
                        Alert >
                    )
                } <
                /div> < /
                CardContent > <
                /Card>
            ): ( <
                div className = "text-center space-y-4 p-8" >
                <
                div className = "flex justify-center" >
                <
                div className = "p-6 bg-gray-100 rounded-full" >
                <
                ArrowDownCircle className = "h-20 w-20 text-gray-400" / >
                <
                /div> < /
                div > <
                p className = "text-xl text-gray-400 font-medium" > Fill the form to calculate your CO₂ footprint < /p> < /
                div >
            )
        } <
        /div> < /
    div > <
        /div>

    <
    div >
        <
        Card className = "bg-white border-0 shadow-md" >
        <
        CardHeader className = "bg-gradient-to-r from-green-50 to-blue-50 border-b" >
        <
        CardTitle className = "text-2xl" > Recent Orders < /CardTitle> < /
    CardHeader > <
        CardContent className = "p-0" >
        <
        div className = "overflow-x-auto" >
        <
        table className = "w-full" >
        <
        thead className = "bg-gray-50 border-b" >
        <
        tr >
        <
        th className = "px-6 py-4 text-left text-sm font-semibold text-gray-700" > Product < /th> <
    th className = "px-6 py-4 text-left text-sm font-semibold text-gray-700" > Distance < /th> <
    th className = "px-6 py-4 text-left text-sm font-semibold text-gray-700" > Vehicle < /th> <
    th className = "px-6 py-4 text-left text-sm font-semibold text-gray-700" > Packaging < /th> <
    th className = "px-6 py-4 text-left text-sm font-semibold text-gray-700" > CO₂(kg) < /th> <
    th className = "px-6 py-4 text-left text-sm font-semibold text-gray-700" > Eco Score < /th> < /
    tr > <
        /thead> <
    tbody className = "divide-y divide-gray-200" > {
            dashboardData.recentOrders.map((order, index) => ( <
                tr key = { order.id || index }
                className = "hover:bg-gray-50 transition-colors" >
                <
                td className = "px-6 py-4 text-sm text-gray-900 font-medium" > { order.product_name || order.product || "N/A" } < /td> <
                td className = "px-6 py-4 text-sm text-gray-600" > { order.distance ? `${order.distance} km` : "N/A" } < /td> <
                td className = "px-6 py-4 text-sm text-gray-600" > { order.vehicle_type || order.vehicle || "Ev" } < /td> <
                td className = "px-6 py-4 text-sm text-gray-600" > { order.packaging_type || order.packaging || "Reusable" } < /td> <
                td className = "px-6 py-4 text-sm font-semibold text-gray-900" > { order.co2_emissions || order.co2 || "N/A" } < /td> <
                td className = "px-6 py-4" >
                <
                Badge className = { `text-sm font-semibold ${getEcoScoreBadgeClass(order.eco_score || order.ecoScore || 90)}` } > { order.eco_score || order.ecoScore || "90" } <
                /Badge> < /
                td > <
                /tr>
            ))
        } <
        /tbody> < /
    table > <
        /div> < /
    CardContent > <
        /Card> < /
    div >

        <
        /div> < /
    div >
);
}

export default HomePage;