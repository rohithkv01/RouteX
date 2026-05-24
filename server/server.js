require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Import routes
const authRoutes    = require('./routes/auth');
const routeRoutes   = require('./routes/routes');
const bookingRoutes = require('./routes/bookings');
const couponRoutes  = require('./routes/coupons');
const paymentRoutes = require('./routes/payment');
const cityRoutes    = require('./routes/cities');

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/routes',   routeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/coupons',  couponRoutes);
app.use('/api/payment',  paymentRoutes);
app.use('/api/cities',   cityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RouteX API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 RouteX server running on port ${PORT}`);
});
