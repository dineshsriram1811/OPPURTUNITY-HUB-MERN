const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');
const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const { ensureAdminExists } = require('./utils/createAdmin');
const { generateDemoOpportunities } = require('./utils/seedData');


// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/auth.routes');
const userRoutes        = require('./routes/user.routes');
const adminRoutes       = require('./routes/admin.routes');
const opportunityRoutes = require('./routes/opportunity.routes');
const applicationRoutes = require('./routes/application.routes');
const notificationRoutes= require('./routes/notification.routes');
const publicRoutes      = require('./routes/public.routes');
const jobRoutes = require('./routes/job.routes');
const internshipRoutes = require("./routes/internship.routes");
const freelancingRoutes = require("./routes/freelancing.routes");
const hackathonRoutes = require("./routes/hackathon.routes");
const scholarshipRoutes = require("./routes/scholarship.routes");

const app    = express();
const server = http.createServer(app);

// ── CORS & Origin Resolution ──────────────────────────────────────────────────
const parseAllowedOrigins = () => {
  const rawOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.ALLOWED_ORIGINS,
  ];

  const origins = [];

  for (const raw of rawOrigins) {
    if (!raw) continue;
    const parts = raw.split(',');
    for (const part of parts) {
      const trimmed = part.trim().replace(/\/+$/, '');
      if (trimmed) {
        origins.push(trimmed);
      }
    }
  }

  const defaultDevOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4173',
  ];

  for (const dev of defaultDevOrigins) {
    if (!origins.includes(dev)) {
      origins.push(dev);
    }
  }

  return origins;
};

const isOriginAllowed = (origin) => {
  if (!origin) return true; // allow non-browser or same-origin requests (e.g. server-to-server, curl)
  const normalized = origin.trim().replace(/\/+$/, '');
  const allowed = parseAllowedOrigins();
  return allowed.includes(normalized);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`));
});

// ── Security & Preflight Middleware ───────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Apply CORS middleware and handle OPTIONS preflight immediately
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api/', generalLimiter);

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Static Files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Root & Health Check ───────────────────────────────────────────────────────
const rootHandler = (req, res) => {
  res.json({
    status: 'OK',
    message: 'Opportunity Hub API Server is running',
    health: '/api/health',
    version: '2.0.0',
  });
};

const healthHandler = (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbStatus = mongoose.connection ? (dbStates[mongoose.connection.readyState] || 'unknown') : 'unknown';

  res.json({
    status: 'OK',
    message: 'Opportunity Hub API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
    database: dbStatus,
    version: '2.0.0',
  });
};

app.get('/', rootHandler);
app.get('/api', rootHandler);
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// ── Database Initialization (Serverless & Warm Instance Support) ─────────────
let isInitialized = false;
let initPromise = null;

const initDB = async () => {
  if (isInitialized && mongoose.connection.readyState === 1) {
    return;
  }

  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();

      try {
        await ensureAdminExists();
      } catch (err) {
        console.error('⚠️  Admin ensure failed:', err.message);
      }

      try {
        const res = await generateDemoOpportunities();
        console.log(`✅  Demo opportunities verified (${res.count} items)`);
      } catch (err) {
        console.error('⚠️  Demo seed failed:', err.message);
      }

      isInitialized = true;
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }

  await initPromise;
};

// Middleware: ensure DB is connected before processing API requests
app.use(async (req, res, next) => {
  // Preflight requests, health check, root, and static files respond without DB wait
  if (
    req.method === 'OPTIONS' ||
    req.path === '/api/health' ||
    req.path === '/health' ||
    req.path === '/' ||
    req.path === '/api' ||
    req.path.startsWith('/uploads')
  ) {
    return next();
  }

  try {
    await initDB();
    next();
  } catch (error) {
    console.error('Database initialization error:', error.message);
    next(error);
  }
});

// ── API Routes (mounted with /api prefix and root prefix for baseURL compatibility) ──
app.use('/api/public',        publicRoutes);       // Public — no auth required
app.use('/public',            publicRoutes);

app.use('/api/auth',          authRoutes);
app.use('/auth',              authRoutes);

app.use('/api/users',         userRoutes);
app.use('/users',             userRoutes);

app.use('/api/opportunities', opportunityRoutes);
app.use('/opportunities',     opportunityRoutes);

app.use('/api/applications',  applicationRoutes);
app.use('/applications',      applicationRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/notifications',     notificationRoutes);

app.use('/api/admin',         adminRoutes);
app.use('/admin',             adminRoutes);

app.use('/api/jobs',          jobRoutes);
app.use('/jobs',              jobRoutes);

app.use('/api/internships',   internshipRoutes);
app.use('/internships',       internshipRoutes);

app.use('/api/freelancing',   freelancingRoutes);
app.use('/freelancing',       freelancingRoutes);

app.use('/api/hackathons',    hackathonRoutes);
app.use('/hackathons',        hackathonRoutes);

app.use('/api/scholarships',  scholarshipRoutes);
app.use('/scholarships',      scholarshipRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server (Local Development) ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// In Vercel serverless functions, Vercel invokes the exported app directly.
// Only bind to a network port when running outside of Vercel (local dev or traditional VPS).
if (!process.env.VERCEL && require.main === module) {
  const startServer = async () => {
    try {
      await initDB();

      server.listen(PORT, () => {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🚀  Opportunity Hub Server`);
        console.log(`📡  Port    : ${PORT}`);
        console.log(`🌍  Mode    : ${process.env.NODE_ENV || 'development'}`);
        console.log(`🏥  Health  : http://localhost:${PORT}/api/health`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      });
    } catch (error) {
      console.error('🛑  Application startup failed due to database connection error:', error.message);
      process.exit(1);
    }
  };

  startServer();
}

// ── Module Exports ────────────────────────────────────────────────────────────
// Vercel Serverless Functions require the default export to be a function or server.
// Exporting `app` directly satisfies Vercel's handler contract while named properties
// preserve backward compatibility for any consumers expecting { app, io, server }.
app.io = io;
app.server = server;

module.exports = app;
module.exports.app = app;
module.exports.io = io;
module.exports.server = server;
module.exports.default = app;


