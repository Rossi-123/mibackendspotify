import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from './routes/index.routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor Spotify Backend activo',
    api: '/api'
  });
});

app.use('/api', indexRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

export default app;
