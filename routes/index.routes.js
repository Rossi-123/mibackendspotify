import { Router } from 'express';
import spotifyRoutes from './spotify.routes.js';

const indexRoutes = Router();

indexRoutes.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Spotify Backend funcionando correctamente',
    endpoints: {
      spotify: '/api/spotify'
    }
  });
});

indexRoutes.use('/spotify', spotifyRoutes);

export default indexRoutes;
