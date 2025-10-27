import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, Package, Leaf, Award } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [ecoSummary, setEcoSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [ordersRes, summaryRes] = await Promise.all([
        axios.get(`${API}/orders`),
        axios.get(`${API}/eco_score`)
      ]);
      
      setOrders(ordersRes.data);
      setEcoSummary(summaryRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: orders.slice(-10).map((_, index) => `Order ${index + 1}`),
    datasets: [
      {
        label: 'CO₂ Emissions (kg)',
        data: orders.slice(-10).map(order => order.co2_value),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'CO₂ Emissions Per Order',
        font: {
          size: 16,
          family: 'Space Grotesk'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'CO₂ (kg)'
        }
      }
    }
  };
  
  const getEcoScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getEcoScoreBackground = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 50) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600" style={{fontFamily: 'Inter, sans-serif'}}>
          Track your environmental impact and sustainability progress
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="eco-card" data-testid="total-orders-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-800" data-testid="total-orders">
                {ecoSummary?.total_orders || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Orders</p>
          </CardContent>
        </Card>
        
        <Card className="eco-card" data-testid="total-co2-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-800" data-testid="total-co2">
                {ecoSummary?.total_co2 || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total CO₂ (kg)</p>
          </CardContent>
        </Card>
        
        <Card className="eco-card" data-testid="avg-co2-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-800" data-testid="avg-co2">
                {ecoSummary?.avg_co2_per_order || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Avg CO₂/Order (kg)</p>
          </CardContent>
        </Card>
        
        <Card className="eco-card" data-testid="eco-score-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-600" />
              <span className={`text-3xl font-bold ${getEcoScoreColor(ecoSummary?.eco_score || 0)}`} data-testid="overall-eco-score">
                {ecoSummary?.eco_score || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Eco Score</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Chart */}
        <Card className="eco-card lg:col-span-2" data-testid="co2-chart-card">
          <CardHeader>
            <CardTitle>CO₂ Emissions Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No orders yet. Start calculating CO₂ footprints!</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Eco Score Gauge */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle>Your Eco Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative inline-block">
                <svg className="w-48 h-48" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(ecoSummary?.eco_score || 0) * 2.51} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-4xl font-bold text-gray-800">{ecoSummary?.eco_score || 0}</p>
                    <p className="text-sm text-gray-600">out of 100</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className={`inline-block bg-gradient-to-r ${getEcoScoreBackground(ecoSummary?.eco_score || 0)} text-white px-6 py-3 rounded-full font-semibold shadow-lg`}>
                  {ecoSummary?.eco_score >= 80 ? "Excellent" : ecoSummary?.eco_score >= 50 ? "Good" : "Needs Improvement"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="orders-table">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Distance</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Packaging</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">CO₂ (kg)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Eco Score</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(-10).reverse().map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800">{order.product_name}</td>
                      <td className="py-3 px-4 text-gray-600">{order.distance} km</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{order.vehicle_type}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{order.packaging_type}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{order.co2_value}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${getEcoScoreColor(order.eco_score)}`}>
                          {order.eco_score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No orders yet. Start by calculating your first CO₂ footprint!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;