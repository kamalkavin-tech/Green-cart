# Green-cart Backend

This folder contains the backend server for the Green-cart project.

Quick start:

1. From this folder install dependencies:

```powershell
cd backend
npm install
```

2. Start in development mode (nodemon required):

```powershell
npm run dev
```

3. Server will be available at http://localhost:5000

Available endpoints

- GET /_health — health check
- POST /api/calculator/calculate — calculate CO2 footprint

Notes

- This backend uses a small express app. The calculator route is implemented in `api/calculator.js`.
- If you add new routes, register them in `src/routes/index.js` (the router used by `server.js`).
