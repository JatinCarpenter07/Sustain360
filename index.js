require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./services/database');
const cookieParser = require('cookie-parser');

// Routes
const userRouter = require('./routes/userRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
const waterRoutes = require('./routes/waterRoutes');
const financeRoutes = require('./routes/financeRoutes');
const healthRoutes = require('./routes/healthRoutes');

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

// ==============================
// Start Server
// ==============================
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
