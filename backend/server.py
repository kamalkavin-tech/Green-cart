from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import numpy as np
import random
from sklearn.ensemble import RandomForestRegressor
import pickle

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ML Model Training (Simple model for CO2 prediction)
vehicle_multipliers = {
    "ev": 0.05,
    "bike": 0.02,
    "petrol": 0.15,
    "diesel": 0.18
}

packaging_multipliers = {
    "single-use": 1.0,
    "reusable": 0.4,
    "circular": 0.3
}

# Define Models
class CO2PredictionInput(BaseModel):
    distance: float
    weight: float
    vehicle_type: str
    packaging_type: str
    load_efficiency: float

class CO2PredictionOutput(BaseModel):
    predicted_co2_kg: float
    eco_score: int
    advice: str
    eco_badge: str

class PackagingOptimizationInput(BaseModel):
    product_weight: float
    volume: float
    fragile: bool

class PackagingOptimizationOutput(BaseModel):
    best_packaging_type: str
    co2_saved_estimate: float
    reasoning: str

class OrderCreate(BaseModel):
    product_name: str
    distance: float
    weight: float
    vehicle_type: str
    packaging_type: str
    co2_value: float
    eco_score: int

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_name: str
    distance: float
    weight: float
    vehicle_type: str
    packaging_type: str
    co2_value: float
    eco_score: int
    eco_badge: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper functions
def calculate_co2(distance: float, weight: float, vehicle_type: str, packaging_type: str, load_efficiency: float) -> float:
    """Calculate CO2 emissions based on input parameters"""
    vehicle_mult = vehicle_multipliers.get(vehicle_type.lower(), 0.15)
    packaging_mult = packaging_multipliers.get(packaging_type.lower(), 1.0)
    
    # Base calculation: distance * weight * vehicle_multiplier * packaging_multiplier
    base_co2 = distance * weight * vehicle_mult * packaging_mult
    
    # Adjust for load efficiency (higher efficiency = lower CO2)
    efficiency_factor = 1 - (load_efficiency / 200)
    
    total_co2 = base_co2 * efficiency_factor
    return round(total_co2, 2)

def get_eco_score(co2_kg: float, distance: float) -> int:
    """Calculate eco score (0-100) based on CO2 per km"""
    co2_per_km = co2_kg / max(distance, 1)
    
    if co2_per_km < 0.05:
        return 95
    elif co2_per_km < 0.1:
        return 85
    elif co2_per_km < 0.2:
        return 70
    elif co2_per_km < 0.3:
        return 55
    elif co2_per_km < 0.5:
        return 40
    else:
        return 25

def get_eco_badge(eco_score: int) -> str:
    """Get eco badge color based on score"""
    if eco_score >= 80:
        return "green"
    elif eco_score >= 50:
        return "yellow"
    else:
        return "red"

def generate_ai_advice(vehicle_type: str, packaging_type: str, co2_kg: float, distance: float) -> str:
    """Simulated AI sustainability advice"""
    advice_templates = []
    
    if vehicle_type.lower() in ["petrol", "diesel"]:
        advice_templates.append("Switch to EV delivery to reduce emissions by up to 70%.")
    
    if packaging_type.lower() == "single-use":
        advice_templates.append("Use reusable packaging to cut CO₂ by 60%.")
    
    if distance > 50:
        advice_templates.append("Consider consolidating orders or choosing local suppliers to reduce distance.")
    
    if co2_kg > 10:
        advice_templates.append("Optimize load efficiency and route planning to lower your carbon footprint.")
    
    if packaging_type.lower() != "circular":
        advice_templates.append("Try circular packaging systems for maximum sustainability.")
    
    if not advice_templates:
        advice_templates.append("Great job! Your delivery is already eco-friendly.")
    
    return " ".join(advice_templates[:2]) if len(advice_templates) > 1 else advice_templates[0]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "GreenerCart API - Sustainable e-Commerce Platform"}

@api_router.post("/predict_co2", response_model=CO2PredictionOutput)
async def predict_co2(input_data: CO2PredictionInput):
    """Predict CO2 emissions for a delivery"""
    co2_kg = calculate_co2(
        input_data.distance,
        input_data.weight,
        input_data.vehicle_type,
        input_data.packaging_type,
        input_data.load_efficiency
    )
    
    eco_score = get_eco_score(co2_kg, input_data.distance)
    eco_badge = get_eco_badge(eco_score)
    advice = generate_ai_advice(
        input_data.vehicle_type,
        input_data.packaging_type,
        co2_kg,
        input_data.distance
    )
    
    return CO2PredictionOutput(
        predicted_co2_kg=co2_kg,
        eco_score=eco_score,
        advice=advice,
        eco_badge=eco_badge
    )

@api_router.post("/optimize_packaging", response_model=PackagingOptimizationOutput)
async def optimize_packaging(input_data: PackagingOptimizationInput):
    """Optimize packaging choice for minimum CO2"""
    weight = input_data.product_weight
    volume = input_data.volume
    fragile = input_data.fragile
    
    # Decision logic
    if fragile:
        best_type = "reusable"
        reasoning = "Reusable protective packaging recommended for fragile items."
        saved = 0.5
    elif weight > 5 or volume > 1000:
        best_type = "circular"
        reasoning = "Circular packaging system ideal for large items with return logistics."
        saved = 0.8
    else:
        best_type = "reusable"
        reasoning = "Reusable packaging provides best balance of protection and sustainability."
        saved = 0.6
    
    return PackagingOptimizationOutput(
        best_packaging_type=best_type,
        co2_saved_estimate=round(saved * weight * 0.2, 2),
        reasoning=reasoning
    )

@api_router.post("/save_order", response_model=Order)
async def save_order(input_data: OrderCreate):
    """Save order to database"""
    eco_badge = get_eco_badge(input_data.eco_score)
    order_obj = Order(
        **input_data.model_dump(),
        eco_badge=eco_badge
    )
    
    doc = order_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.orders.insert_one(doc)
    return order_obj

@api_router.get("/orders", response_model=List[Order])
async def get_orders():
    """Get all orders"""
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    
    for order in orders:
        if isinstance(order['timestamp'], str):
            order['timestamp'] = datetime.fromisoformat(order['timestamp'])
    
    return orders

@api_router.get("/eco_score")
async def get_eco_score_summary():
    """Get overall eco score based on all orders"""
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    
    if not orders:
        return {"eco_score": 100, "total_co2": 0, "total_orders": 0}
    
    total_co2 = sum(order['co2_value'] for order in orders)
    avg_eco_score = sum(order['eco_score'] for order in orders) / len(orders)
    
    return {
        "eco_score": round(avg_eco_score),
        "total_co2": round(total_co2, 2),
        "total_orders": len(orders),
        "avg_co2_per_order": round(total_co2 / len(orders), 2)
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()