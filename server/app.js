import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import pdfRoutes from './routes/pdfRoutes.js';
import qaRoutes from './routes/qaRoutes.js';
import prev from './routes/prevRoutes.js';
import year from './routes/yearRoutes.js';
import errorHandler from './middleware/errorHandler.js';


config(); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/prev',prev)
app.use('/api/year',year)

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error Handler
app.use(errorHandler);

export default app;