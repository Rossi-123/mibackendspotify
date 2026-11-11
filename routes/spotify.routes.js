import { Router } from 'express';
import {
  getAllSpotifyCompanies,
  getSpotifyCompanyById,
  postSpotifyCompany,
  putSpotifyCompany,
  deleteSpotifyCompany,
  getSpotifyCompaniesByCountry
} from '../controllers/spotify.controllers.js';

const router = Router();

router.get('/', getAllSpotifyCompanies);
router.post('/', postSpotifyCompany);
router.get('/pais/:pais', getSpotifyCompaniesByCountry);
router.get('/:id', getSpotifyCompanyById);
router.put('/:id', putSpotifyCompany);
router.delete('/:id', deleteSpotifyCompany);

export default router;
