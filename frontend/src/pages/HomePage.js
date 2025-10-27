import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calculator, Leaf, TrendingDown, Lightbulb, Package } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [formData, setFormData] = useState({
    distance: "",
    weight: "",
    vehicle_type: "petrol",
    packaging_type: "single-use",
    load_efficiency: "75",
    product_name: ""
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.distance || !formData.weight || !formData.product_name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/predict_co2`, {
        distance: parseFloat(formData.distance),
        weight: parseFloat(formData.weight),
        vehicle_type: formData.vehicle_type,
        packaging_type: formData.packaging_type,
        load_efficiency: parseFloat(formData.load_efficiency)
      });
      
      setResult(response.data);
      
      // Save order
      await axios.post(`${API}/save_order`, {
        product_name: formData.product_name,
        distance: parseFloat(formData.distance),
        weight: parseFloat(formData.weight),
        vehicle_type: formData.vehicle_type,
        packaging_type: formData.packaging_type,
        co2_value: response.data.predicted_co2_kg,
        eco_score: response.data.eco_score
      });
      
      toast.success("CO₂ footprint calculated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to calculate CO₂ footprint");
    } finally {
      setLoading(false);
    }
  };
  
  const getBadgeClass = (badge) => {
    if (badge === "green") return "badge-green";
    if (badge === "yellow") return "badge-yellow";
    return "badge-red";
  };
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="hero-gradient rounded-3xl p-12 mb-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          Shop Greener, Ship Smarter
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{fontFamily: 'Inter, sans-serif'}}>
          Calculate and reduce your delivery carbon footprint with AI-powered insights.
          Every order matters in building a sustainable future.
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
                <Label htmlFor="product_name">Product Name *</Label>
                <Input
                  id="product_name"
                  data-testid="product-name-input"
                  type="text"
                  placeholder="e.g., Organic Cotton T-Shirt"
                  value={formData.product_name}
                  onChange={(e) => setFormData({...formData, product_name: e.target.value})}
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
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select
                  value={formData.vehicle_type}
                  onValueChange={(value) => setFormData({...formData, vehicle_type: value})}
                >
                  <SelectTrigger id="vehicle_type" data-testid="vehicle-type-select" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ev">Electric Vehicle (EV)</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="packaging_type">Packaging Type</Label>
                <Select
                  value={formData.packaging_type}
                  onValueChange={(value) => setFormData({...formData, packaging_type: value})}
                >
                  <SelectTrigger id="packaging_type" data-testid="packaging-type-select" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-use">Single-Use</SelectItem>
                    <SelectItem value="reusable">Reusable</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="load_efficiency">Load Efficiency (%)</Label>
                <Input
                  id="load_efficiency"
                  data-testid="load-efficiency-input"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.load_efficiency}
                  onChange={(e) => setFormData({...formData, load_efficiency: e.target.value})}
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
        
        {/* Results Section */}
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
                    <div className="text-6xl font-bold text-gray-800 mb-4" data-testid="co2-value">
                      {result.predicted_co2_kg}
                      <span className="text-3xl text-gray-600 ml-2">kg</span>
                    </div>
                    <div className={getBadgeClass(result.eco_badge)} data-testid="eco-badge">
                      Eco Score: {result.eco_score}/100
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="eco-card animate-fade-in" style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    AI Sustainability Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed" data-testid="ai-advice">{result.advice}</p>
                </CardContent>
              </Card>
            </>
          ) : (
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