import requests
import sys
import json
from datetime import datetime

class GreenerCartAPITester:
    def __init__(self, base_url="https://eco-commerce-8.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_fields=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            response_data = {}
            
            if success:
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    
                    # Check expected fields if provided
                    if expected_fields:
                        for field in expected_fields:
                            if field not in response_data:
                                success = False
                                print(f"   ❌ Missing expected field: {field}")
                                break
                        
                    if success:
                        self.tests_passed += 1
                        print(f"   ✅ Passed")
                    
                except json.JSONDecodeError:
                    print(f"   ❌ Invalid JSON response")
                    success = False
            else:
                print(f"   ❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")

            self.test_results.append({
                "name": name,
                "success": success,
                "status_code": response.status_code,
                "expected_status": expected_status,
                "response_data": response_data
            })

            return success, response_data

        except Exception as e:
            print(f"   ❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200,
            expected_fields=["message"]
        )

    def test_predict_co2(self):
        """Test CO2 prediction endpoint"""
        test_data = {
            "distance": 50.0,
            "weight": 2.5,
            "vehicle_type": "petrol",
            "packaging_type": "single-use",
            "load_efficiency": 75.0
        }
        
        return self.run_test(
            "CO2 Prediction",
            "POST",
            "predict_co2",
            200,
            data=test_data,
            expected_fields=["predicted_co2_kg", "eco_score", "advice", "eco_badge"]
        )

    def test_optimize_packaging(self):
        """Test packaging optimization endpoint"""
        test_data = {
            "product_weight": 3.0,
            "volume": 1500.0,
            "fragile": True
        }
        
        return self.run_test(
            "Packaging Optimization",
            "POST",
            "optimize_packaging",
            200,
            data=test_data,
            expected_fields=["best_packaging_type", "co2_saved_estimate", "reasoning"]
        )

    def test_save_order(self):
        """Test order saving endpoint"""
        test_data = {
            "product_name": "Test Product",
            "distance": 25.0,
            "weight": 1.5,
            "vehicle_type": "ev",
            "packaging_type": "reusable",
            "co2_value": 2.3,
            "eco_score": 85
        }
        
        success, response_data = self.run_test(
            "Save Order",
            "POST",
            "save_order",
            200,
            data=test_data,
            expected_fields=["id", "product_name", "eco_badge", "timestamp"]
        )
        
        return success, response_data

    def test_get_orders(self):
        """Test get orders endpoint"""
        return self.run_test(
            "Get Orders",
            "GET",
            "orders",
            200
        )

    def test_eco_score_summary(self):
        """Test eco score summary endpoint"""
        return self.run_test(
            "Eco Score Summary",
            "GET",
            "eco_score",
            200,
            expected_fields=["eco_score", "total_co2", "total_orders"]
        )

    def test_invalid_co2_prediction(self):
        """Test CO2 prediction with invalid data"""
        test_data = {
            "distance": "invalid",
            "weight": -1,
            "vehicle_type": "unknown",
            "packaging_type": "invalid",
            "load_efficiency": 150
        }
        
        return self.run_test(
            "Invalid CO2 Prediction",
            "POST",
            "predict_co2",
            422,  # Validation error
            data=test_data
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting GreenerCart API Tests")
        print("=" * 50)
        
        # Test basic endpoints
        self.test_root_endpoint()
        
        # Test CO2 prediction
        self.test_predict_co2()
        
        # Test packaging optimization
        self.test_optimize_packaging()
        
        # Test order operations
        order_success, order_data = self.test_save_order()
        self.test_get_orders()
        
        # Test analytics
        self.test_eco_score_summary()
        
        # Test error handling
        self.test_invalid_co2_prediction()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed!")
            return 1

def main():
    tester = GreenerCartAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())