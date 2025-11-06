require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./services/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');


// Routes
const userRouter = require('./routes/userRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
const waterRoutes = require('./routes/waterRoutes');
const financeRoutes = require('./routes/financeRoutes');
const healthRoutes = require('./routes/healthRoutes');
const fitnessRouter=require('./routes/fitnessRoute');

// Middlewares
const authenticateJWT = require('./middlewares/authentication');

const app = express();
const port = process.env.PORT;

// ==============================
// Database Connection
// ==============================
console.log("Connecting to database...");// Replace with your actual Atlas URI
connectDB();

// ==============================
// CORS Configuration
// ==============================
const allowedOrigins = [
  'http://localhost:5173',  // React local dev
  'http://127.0.0.1:5173',
  'http://0.0.0.0:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==============================
// Middlewares
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Routes
// ==============================
console.log("Setting up routes...");

app.use("/api/user", userRouter);
app.use('/api/carbon',authenticateJWT, carbonRoutes);
app.use('/api/water',authenticateJWT, waterRoutes);
app.use('/api/finance',authenticateJWT, financeRoutes);
app.use('/api/health',authenticateJWT, healthRoutes);
app.use('/api/fitness',authenticateJWT,fitnessRouter);

// ==============================
// Start Server
// ==============================
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
