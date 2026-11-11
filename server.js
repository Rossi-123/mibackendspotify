import dotenv from 'dotenv';
import app from './app.js';
import { conectarMongoDB } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  await conectarMongoDB();

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
};

iniciarServidor();
