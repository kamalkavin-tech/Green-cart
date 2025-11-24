# Green Cart - Sustainable E-Commerce Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🌍 Overview

**Green Cart** is an eco-friendly e-commerce platform that helps businesses and consumers track and reduce their carbon footprint from product deliveries. The platform provides real-time CO₂ emission calculations, sustainability scoring, and actionable insights to promote environmentally conscious shopping.

### Key Objectives
- **Carbon Footprint Tracking**: Calculate CO₂ emissions for each delivery based on distance, weight, vehicle type, and packaging
- **Eco-Score System**: Rate deliveries on a 0-100 sustainability scale
- **Analytics Dashboard**: Visualize environmental impact with comprehensive metrics
- **Optimization Recommendations**: Provide suggestions to reduce emissions

---

## ✨ Features

### 1. **Analytics Dashboard**
- Real-time metrics display:
  - Total Orders
  - Total CO₂ Emissions (kg)
  - Average CO₂ per Order (kg)
  - Overall Eco Score
- Recent orders table with detailed breakdown

### 2. **CO₂ Calculator**
- Interactive form with the following inputs:
  - Product Name
  - Distance (km)
  - Weight (kg)
  - Vehicle Type (EV, Diesel Truck, Gasoline Car, Hybrid)
  - Packaging Type (Single-Use, Recycled, Biodegradable, Reusable)
  - Load Efficiency (%)
- Real-time calculation results with eco-score badge
- Color-coded scoring system:
  - 🟢 **85-100**: Excellent (Green)
  - 🟡 **70-84**: Good (Yellow)
  - 🔴 **0-69**: Fair (Red)

### 3. **Order Management**
- Track all delivery orders
- View historical emission data
- Monitor sustainability trends

### 4. **Optimizer Page** *(Coming Soon)*
- AI-powered route optimization
- Packaging recommendations
- Vehicle selection guidance

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI Framework |
| React Router DOM | 7.5.1 | Navigation |
| Axios | 1.8.4 | HTTP Client |
| Tailwind CSS | 3.4.17 | Styling |
| Shadcn/UI | Latest | Component Library |
| Lucide React | 0.507.0 | Icons |
| Chart.js | 4.5.1 | Data Visualization |
| React Hook Form | 7.56.2 | Form Management |
| Zod | 3.24.4 | Schema Validation |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.13.1 | Runtime |
| FastAPI | 0.110.1 | Web Framework |
| Motor | 3.3.1 | MongoDB Async Driver |
| PyMongo | 4.5.0 | MongoDB Driver |
| Uvicorn | 0.25.0 | ASGI Server |
| Pydantic | 2.12.3 | Data Validation |
| Scikit-learn | 1.7.2 | ML Predictions |
| NumPy | 2.3.4 | Numerical Computing |
| Pandas | 2.3.3 | Data Analysis |

### **Database**
- **MongoDB Atlas** (Cloud-hosted)
- Connection: `mongodb+srv://cluster0.eq96sdn.mongodb.net/`

### **Development Tools**
- **Package Managers**: Yarn (Frontend), Pip (Backend)
- **Code Quality**: Black, Flake8, MyPy, ESLint
- **Testing**: Pytest, React Testing Library

---

## 📁 Project Structure

```
Green-cart/
├── backend/
│   ├── server.py                 # FastAPI application
│   ├── requirements.txt          # Python dependencies
│   ├── start_server.py          # Server startup script
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── App.js               # Main React component
│   │   ├── App.css              # Global styles
│   │   ├── index.js             # React entry point
│   │   ├── index.css            # Tailwind imports
│   │   ├── components/
│   │   │   └── ui/              # Shadcn UI components
│   │   │       ├── card.jsx
│   │   │       ├── button.jsx
│   │   │       ├── input.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── alert.jsx
│   │   │       └── [30+ more components]
│   │   ├── hooks/
│   │   │   └── use-toast.js     # Toast notifications
│   │   ├── lib/
│   │   │   └── utils.js         # Utility functions
│   │   └── pages/
│   │       ├── HomePage.js      # Analytics & Calculator
│   │       ├── DashboardPage.js # Admin dashboard
│   │       └── OptimizerPage.js # Route optimizer
│   ├── plugins/
│   │   ├── health-check/        # Build health monitoring
│   │   └── visual-edits/        # Dev tools
│   ├── package.json             # Node dependencies
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── craco.config.js          # Create React App config
│   └── components.json          # Shadcn config
│
├── tests/
│   ├── __init__.py
│   └── backend_test.py          # API tests
│
├── test_reports/
│   └── iteration_1.json         # Test results
│
├── README.md                    # Basic instructions
└── PROJECT_DOCUMENTATION.md     # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** >= 18.x
- **Python** >= 3.10
- **Yarn** >= 1.22
- **MongoDB Atlas Account** (or local MongoDB)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/kamalkavin-tech/Green-cart.git
cd Green-cart
```

### 2. Backend Setup

#### a. Navigate to backend directory
```bash
cd backend
```

#### b. Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### c. Install Dependencies
```bash
pip install -r requirements.txt
```

#### d. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
MONGO_URL=mongodb+srv://username:password@cluster0.eq96sdn.mongodb.net/
DB_NAME=greencart_db
PORT=8000
```

#### e. Start Backend Server
```bash
# Option 1: Using start script
python start_server.py

# Option 2: Direct uvicorn command
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at: `http://localhost:8000`

### 3. Frontend Setup

#### a. Navigate to frontend directory
```bash
cd ../frontend
```

#### b. Install Dependencies
```bash
yarn install
```

#### c. Configure Environment (Optional)
Create a `.env` file in the `frontend/` directory:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

#### d. Start Development Server
```bash
yarn start
```

The frontend will open at: `http://localhost:3000`

### 4. Verify Installation
1. Backend health check: `http://localhost:8000/docs` (FastAPI Swagger UI)
2. Frontend: `http://localhost:3000` (Home Page)

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### 1. **POST /api/predict_co2**
Calculate CO₂ emissions for a delivery.

**Request Body:**
```json
{
  "distance": 50.0,
  "weight": 2.5,
  "vehicle_type": "ev",
  "packaging_type": "reusable",
  "load_efficiency": 75.0
}
```

**Vehicle Types:**
- `ev` - Electric Vehicle
- `diesel` - Diesel Truck
- `petrol` - Gasoline Car
- `bike` - Bicycle/Motorcycle

**Packaging Types:**
- `single-use` - Single-Use Plastic
- `reusable` - Reusable Containers
- `circular` - Circular Economy Packaging

**Response:**
```json
{
  "predicted_co2_kg": 1.25,
  "eco_score": 87,
  "advice": "Great choice! Your delivery is eco-friendly.",
  "eco_badge": "Excellent"
}
```

**Status Codes:**
- `200 OK` - Success
- `422 Unprocessable Entity` - Invalid input data

---

#### 2. **GET /api/eco_score**
Get overall sustainability metrics.

**Response:**
```json
{
  "eco_score": 90,
  "total_co2": 24.8,
  "total_orders": 10,
  "avg_co2_per_order": 2.48
}
```

**Calculation:**
- `eco_score` = 100 - (avg_co2_per_order * 10)
- Capped between 0-100

---

#### 3. **GET /api/orders**
Retrieve all delivery orders.

**Response:**
```json
[
  {
    "id": "uuid-1234",
    "product_name": "Eco-Friendly T-Shirt",
    "distance": 30,
    "weight": 0.5,
    "vehicle_type": "ev",
    "packaging_type": "reusable",
    "co2_emissions": 0.18,
    "eco_score": 95,
    "created_at": "2025-10-27T10:30:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database connection issue

---

#### 4. **POST /api/orders**
Create a new order (used internally after CO₂ calculation).

**Request Body:**
```json
{
  "product_name": "Organic Cotton Shirt",
  "distance": 45.0,
  "weight": 1.2,
  "vehicle_type": "ev",
  "packaging_type": "reusable",
  "co2_emissions": 0.85,
  "eco_score": 91
}
```

**Response:**
```json
{
  "id": "uuid-5678",
  "message": "Order created successfully"
}
```

---

## 🎨 Frontend Components

### Page Components

#### **HomePage.js**
Main landing page with three sections:

1. **Analytics Dashboard**
   - 4 metric cards with icons
   - Real-time data from API
   - Responsive grid layout

2. **CO₂ Calculator**
   - Left panel: Input form
   - Right panel: Results display
   - Form validation with required fields
   - Color-coded eco-score badges

3. **Recent Orders Table**
   - Paginated table with 6 columns
   - Hover effects on rows
   - Badge indicators for eco-scores

**State Management:**
```javascript
const [dashboardData, setDashboardData] = useState({
  totalOrders: 0,
  totalCO2: 0,
  avgCO2PerOrder: 0,
  ecoScore: 0,
  recentOrders: []
});

const [formData, setFormData] = useState({
  product_name: "",
  weight: "",
  distance: "",
  vehicle_type: "Electric Vehicle (EV)",
  packaging_type: "Single-Use",
  load_efficiency: "75"
});

const [co2Result, setCo2Result] = useState(null);
```

**Key Functions:**
- `fetchDashboardData()` - Load metrics and orders
- `handleSubmit(e)` - Calculate CO₂ emissions
- `getEcoScoreColor(score)` - Dynamic text color
- `getEcoScoreBadgeClass(score)` - Badge styling

---

### UI Component Library (Shadcn/UI)

**Available Components:**
```
✓ accordion        ✓ alert-dialog     ✓ alert
✓ aspect-ratio     ✓ avatar           ✓ badge
✓ breadcrumb       ✓ button           ✓ calendar
✓ card             ✓ carousel         ✓ checkbox
✓ collapsible      ✓ command          ✓ context-menu
✓ dialog           ✓ drawer           ✓ dropdown-menu
✓ form             ✓ hover-card       ✓ input-otp
✓ input            ✓ label            ✓ menubar
✓ navigation-menu  ✓ pagination       ✓ popover
✓ progress         ✓ radio-group      ✓ resizable
✓ scroll-area      ✓ select           ✓ separator
✓ sheet            ✓ skeleton         ✓ slider
✓ sonner           ✓ switch           ✓ table
✓ tabs             ✓ textarea         ✓ toast
✓ toaster          ✓ toggle-group     ✓ toggle
✓ tooltip
```

**Usage Example:**
```jsx
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

<Card>
  <CardHeader>
    <CardTitle>CO₂ Calculator</CardTitle>
  </CardHeader>
  <CardContent>
    <Button className="w-full">Calculate</Button>
    <Badge className="bg-green-100">Excellent</Badge>
  </CardContent>
</Card>
```

---

## 🗄️ Database Schema

### Collection: `orders`

```javascript
{
  _id: ObjectId,
  id: String,              // UUID v4
  product_name: String,    // Product identifier
  distance: Number,        // Delivery distance in km
  weight: Number,          // Package weight in kg
  vehicle_type: String,    // ev | diesel | petrol | bike
  packaging_type: String,  // single-use | reusable | circular
  load_efficiency: Number, // 0-100 percentage
  co2_emissions: Number,   // Calculated CO₂ in kg
  eco_score: Number,       // 0-100 rating
  created_at: ISODate,     // Timestamp
  updated_at: ISODate      // Timestamp
}
```

### Indexes
```javascript
db.orders.createIndex({ "created_at": -1 });
db.orders.createIndex({ "eco_score": -1 });
db.orders.createIndex({ "id": 1 }, { unique: true });
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# MongoDB Configuration
MONGO_URL=mongodb+srv://username:password@cluster0.mongodb.net/
DB_NAME=greencart_db

# Server Configuration
PORT=8000
HOST=0.0.0.0

# Security (Optional)
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256

# CORS (Optional)
ALLOWED_ORIGINS=http://localhost:3000,https://greencart.com
```

### Frontend (.env)
```env
# API Configuration
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000

# Feature Flags (Optional)
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_OPTIMIZER=false
```

---

## 📖 Usage Guide

### Calculating CO₂ Emissions

1. **Open the Home Page** at `http://localhost:3000`

2. **Fill out the calculator form:**
   - **Product Name**: Enter a descriptive name (e.g., "Organic Cotton T-Shirt")
   - **Distance**: Delivery distance in kilometers (e.g., 50)
   - **Weight**: Package weight in kilograms (e.g., 2.5)
   - **Vehicle Type**: Select from dropdown
     - Electric Vehicle (EV) - Lowest emissions
     - Hybrid Vehicle
     - Gasoline Car
     - Diesel Truck - Highest emissions
   - **Packaging Type**: Choose sustainable option
     - Reusable - Best option
     - Biodegradable
     - Recycled
     - Single-Use - Highest impact
   - **Load Efficiency**: Percentage (1-100)
     - Higher = Better utilization = Lower per-item emissions

3. **Click "Calculate CO₂ Footprint"**

4. **View Results:**
   - CO₂ emissions in kilograms
   - Eco Score (0-100)
   - Color-coded badge (Excellent/Good/Fair)

5. **Check Dashboard:**
   - Metrics update automatically
   - New order appears in Recent Orders table

### Interpreting Eco Scores

| Score Range | Rating | Color | Meaning |
|-------------|--------|-------|---------|
| 85-100 | Excellent | 🟢 Green | Highly sustainable delivery |
| 70-84 | Good | 🟡 Yellow | Moderate environmental impact |
| 0-69 | Fair | 🔴 Red | High emissions, needs optimization |

### Optimization Tips

**To improve your eco score:**
1. ✅ Use Electric Vehicles (EVs)
2. ✅ Choose reusable packaging
3. ✅ Maximize load efficiency (>80%)
4. ✅ Reduce delivery distances (local sourcing)
5. ✅ Consolidate shipments (batch orders)

---

## 🧪 Testing

### Backend Tests

Run all tests:
```bash
cd backend
pytest tests/ -v
```

Run specific test file:
```bash
pytest backend_test.py -v
```

### Frontend Tests

```bash
cd frontend
yarn test
```

### Manual API Testing

Use the interactive API docs:
```
http://localhost:8000/docs
```

Or use curl:
```bash
# Test CO₂ calculation
curl -X POST http://localhost:8000/api/predict_co2 \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 50,
    "weight": 2.5,
    "vehicle_type": "ev",
    "packaging_type": "reusable",
    "load_efficiency": 75
  }'

# Get eco score
curl http://localhost:8000/api/eco_score

# Get all orders
curl http://localhost:8000/api/orders
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Port 3000 Already in Use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### 2. **Port 8000 Already in Use**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

#### 3. **MongoDB Connection Timeout**
- Check MongoDB Atlas IP whitelist
- Verify credentials in `.env`
- Test connection string:
```bash
mongosh "mongodb+srv://username:password@cluster0.mongodb.net/greencart_db"
```

#### 4. **CORS Errors**
Add to `server.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 5. **Module Not Found Errors**
```bash
# Backend
pip install -r requirements.txt --upgrade

# Frontend
yarn install --force
```

#### 6. **"Failed to Calculate" Error**
- Ensure backend is running (`http://localhost:8000`)
- Check browser console for detailed errors
- Verify API URL in form submission code

#### 7. **Empty Dashboard Data**
- Check MongoDB connection
- Verify sample data is loaded
- Check browser console for API errors

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and commit**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Standards

**Python (Backend):**
- Follow PEP 8
- Use Black for formatting: `black .`
- Run Flake8: `flake8 .`
- Type hints with MyPy: `mypy server.py`

**JavaScript (Frontend):**
- Use ESLint: `yarn lint`
- Format with Prettier (if configured)
- Follow React best practices

### Commit Message Convention
```
feat: Add new feature
fix: Fix bug in calculator
docs: Update README
style: Format code
refactor: Refactor component
test: Add tests
chore: Update dependencies
```

---

## 📊 Performance Considerations

### Backend Optimization
- **Database Indexing**: Index frequently queried fields
- **Connection Pooling**: Motor handles async connections efficiently
- **Caching**: Consider Redis for frequently accessed data
- **Rate Limiting**: Implement to prevent abuse

### Frontend Optimization
- **Code Splitting**: React.lazy() for route-based splitting
- **Memoization**: Use React.memo() for expensive components
- **Image Optimization**: Compress icons and images
- **Bundle Size**: Analyze with `yarn build` and webpack-bundle-analyzer

---

## 🔮 Future Enhancements

- [ ] **User Authentication** (JWT-based)
- [ ] **Admin Dashboard** with analytics
- [ ] **Route Optimizer** with AI recommendations
- [ ] **Real-time Notifications** (WebSockets)
- [ ] **Mobile App** (React Native)
- [ ] **Multi-language Support** (i18n)
- [ ] **CSV Export** of orders and reports
- [ ] **API Rate Limiting**
- [ ] **Advanced ML Models** for predictions
- [ ] **Carbon Offset Marketplace Integration**

---

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/kamalkavin-tech/Green-cart/issues)
- **Email**: kamalkavin.tech@example.com
- **Documentation**: This file

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Shadcn/UI** for beautiful React components
- **FastAPI** for the excellent Python framework
- **MongoDB Atlas** for cloud database hosting
- **Lucide** for comprehensive icon library
- **Tailwind CSS** for utility-first styling

---

## 📈 Project Statistics

- **Total Files**: 100+
- **Lines of Code**: ~15,000
- **Dependencies**: 80+ packages
- **API Endpoints**: 4
- **UI Components**: 35+
- **Test Coverage**: In Progress

---

**Built with 💚 for a sustainable future**

*Last Updated: October 27, 2025*
