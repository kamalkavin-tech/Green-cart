import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Calculator from "../components/Calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Package, Sparkles, CheckCircle2, TrendingDown } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OptimizerPage = () => {
  const [formData, setFormData] = useState({
    product_weight: "",
    volume: "",
    fragile: false
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product_weight || !formData.volume) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/optimize_packaging`, {
        product_weight: parseFloat(formData.product_weight),
        volume: parseFloat(formData.volume),
        fragile: formData.fragile
      });
      
      setResult(response.data);
      toast.success("Packaging optimized successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to optimize packaging");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          Smart Packaging Optimizer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{fontFamily: 'Inter, sans-serif'}}>
          Get AI-powered recommendations for the most sustainable packaging option
        </p>
      </div>
      
      {/* CO2 Calculator Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Calculate CO₂ Footprint</h2>
        <Calculator />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Product Details
            </CardTitle>
            <CardDescription>Tell us about your product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="product_weight">Product Weight (kg) *</Label>
                <Input
                  id="product_weight"
                  data-testid="optimizer-weight-input"
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  value={formData.product_weight}
                  onChange={(e) => setFormData({...formData, product_weight: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="volume">Volume (cm³) *</Label>
                <Input
                  id="volume"
                  data-testid="optimizer-volume-input"
                  type="number"
                  placeholder="1000"
                  value={formData.volume}
                  onChange={(e) => setFormData({...formData, volume: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="fragile" className="text-base font-semibold">Fragile Item</Label>
                  <p className="text-sm text-gray-500">Requires extra protection</p>
                </div>
                <Switch
                  id="fragile"
                  data-testid="optimizer-fragile-switch"
                  checked={formData.fragile}
                  onCheckedChange={(checked) => setFormData({...formData, fragile: checked})}
                />
              </div>
              
              <Button
                type="submit"
                data-testid="optimize-packaging-button"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-emerald-500/30"
                disabled={loading}
              >
                {loading ? "Optimizing..." : "Optimize Packaging"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Results Section */}
        <div>
          {result ? (
            <div className="space-y-6">
              <Card className="eco-card animate-fade-in" data-testid="optimizer-result-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    Recommended Packaging
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="inline-block bg-gradient-to-br from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-lg shadow-green-500/30">
                      <p className="text-sm font-medium mb-1">Best Option</p>
                      <p className="text-3xl font-bold capitalize" data-testid="packaging-recommendation">
                        {result.best_packaging_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">CO₂ Savings</p>
                        <p className="text-2xl font-bold text-green-600" data-testid="co2-savings">
                          {result.co2_saved_estimate} kg
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-gray-800 mb-2">Why this option?</p>
                      <p className="text-gray-700" data-testid="packaging-reasoning">{result.reasoning}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="eco-card animate-fade-in" style={{animationDelay: '0.1s'}}>
                <CardContent className="py-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Packaging Types Explained</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-gray-800">Reusable</p>
                        <p className="text-gray-600">Durable packaging that can be returned and reused</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-gray-800">Circular</p>
                        <p className="text-gray-600">Part of a closed-loop system with return logistics</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-gray-800">Single-Use</p>
                        <p className="text-gray-600">Traditional disposable packaging</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="eco-card">
              <CardContent className="py-20">
                <div className="text-center text-gray-400">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Enter product details to get packaging recommendations</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizerPage;