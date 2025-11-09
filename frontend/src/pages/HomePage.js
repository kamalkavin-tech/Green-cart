import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calculator, Leaf, TrendingDown, Lightbulb, Package } from "lucide-react";

// Assuming this path is correctly set for your backend server.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [formData, setFormData] = useState({
    distance: "",
    weight: "",
    // FIX 1: Changed to camelCase to match backend
    vehicleType: "Petrol", // Changed initial value to match exact backend key
    // FIX 1: Changed to camelCase to match backend
    packagingType: "Single-Use", // Changed initial value to match exact backend key
    // FIX 1: Changed to camelCase to match backend
    loadEfficiency: "75",
    // FIX 1: Changed to camelCase to match backend
    productName: ""
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FIX 2: Check for camelCase keys in validation
    if (!formData.distance || !formData.weight || !formData.productName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    try {
      // API endpoint is correctly: ${API}/calculate
      const response = await axios.post(`${API}/calculate`, {
        distance: parseFloat(formData.distance),
        weight: parseFloat(formData.weight),
        
        // FIX 4: Send camelCase keys to match backend
        vehicleType: formData.vehicleType,
        packagingType: formData.packagingType,
        loadEfficiency: parseFloat(formData.loadEfficiency),
        productName: formData.productName
      });
      
      setResult(response.data);
      
      // Save order (Adjusted to match new state and response)
      await axios.post(`${API}/save_order`, {
        productName: formData.productName,
        distance: parseFloat(formData.distance),
        weight: parseFloat(formData.weight),
        vehicleType: formData.vehicleType,
        packagingType: formData.packagingType,
        // FIX 6: Use the correct key from the backend response
        co2_value: response.data.co2Footprint, 
        // NOTE: eco_score is still not provided by calculator.js, but included for the save_order endpoint
        eco_score: response.data.eco_score 
      });
      
      toast.success("CO₂ footprint calculated successfully!");
    } catch (error) {
      console.error(error);
      // Display the specific error message from the backend if available
      const errorMessage = error.response?.data?.error || "Failed to calculate CO₂ footprint";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // NOTE: This function is checking for badge properties that don't exist
  // in the response from calculator.js.
  const getBadgeClass = (badge) => {
    if (badge === "green") return "badge-green";
    if (badge === "yellow") return "badge-yellow";
    return "badge-red";
  };
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        {/* Placeholder for Hero Content */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          Measure & Offset Your Carbon Footprint
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Use our calculator to see the environmental impact of your e-commerce deliveries and choose greener options.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="w-6 h-6 text-green-600" />
              Calculate CO₂ Footprint
            </CardTitle>
            <CardDescription>Enter your delivery details to estimate emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  data-testid="product-name-input"
                  type="text"
                  placeholder="e.g., Organic Cotton T-Shirt"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="distance">Distance (km) *</Label>
                  <Input
                    id="distance"
                    data-testid="distance-input"
                    type="number"
                    placeholder="50"
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    data-testid="weight-input"
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => setFormData({...formData, vehicleType: value})}
                >
                  <SelectTrigger id="vehicleType" data-testid="vehicle-type-select" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electric Vehicle (EV)">Electric Vehicle (EV)</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem> 
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="packagingType">Packaging Type</Label>
                <Select
                  value={formData.packagingType}
                  onValueChange={(value) => setFormData({...formData, packagingType: value})}
                >
                  <SelectTrigger id="packagingType" data-testid="packaging-type-select" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single-Use">Single-Use</SelectItem>
                    <SelectItem value="Recyclable">Recyclable</SelectItem>
                    <SelectItem value="Reusable">Reusable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="loadEfficiency">Load Efficiency (%)</Label>
                <Input
                  id="loadEfficiency"
                  data-testid="load-efficiency-input"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.loadEfficiency}
                  onChange={(e) => setFormData({...formData, loadEfficiency: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <Button
                type="submit"
                data-testid="calculate-co2-button"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-green-500/30"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate CO₂ Footprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Results Section - Updated to use the correct response key */}
        <div className="space-y-6">
          {result ? (
            <>
              <Card className="eco-card animate-fade-in" data-testid="co2-result-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-green-600" />
                    CO₂ Emissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {/* Display the correct key from the backend */}
                    <div className="text-6xl font-bold text-gray-800 mb-4" data-testid="co2-value">
                      {result.co2Footprint} 
                      <span className="text-3xl text-gray-600 ml-2">kg</span>
                    </div>
                    {/* NOTE: eco-badge/score section might not work until backend is updated */}
                    <div className={getBadgeClass(result.eco_badge)} data-testid="eco-badge">
                      Eco Score: {result.eco_score}/100 
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* AI Sustainability Tips section */}
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    AI Sustainability Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {/* Placeholder for AI Advice */}
                    Based on your details, consider using a Hybrid vehicle for this route to reduce emissions by up to 50%!
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
             // FIX: Replaced the invalid comment with the actual JSX placeholder card
             <Card className="eco-card">
                <CardContent className="py-12">
                  <div className="text-center text-gray-400">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Fill the form to calculate your CO₂ footprint</p>
                  </div>
                </CardContent>
              </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;