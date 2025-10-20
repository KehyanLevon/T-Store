import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import likeRoutes from './routes/likes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/likes', likeRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request Entity Too Large' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  },
);

export default app;
