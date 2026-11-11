import mongoose from 'mongoose';
import Spotify from '../models/spotify.model.js';

const getAllSpotifyCompanies = async (req, res) => {
  try {
    const registros = await Spotify.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los registros de Spotify'
    });
  }
};

const getSpotifyCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const registro = await Spotify.findById(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro de Spotify no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: registro
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el registro de Spotify'
    });
  }
};

const postSpotifyCompany = async (req, res) => {
  try {
    const nuevoRegistro = new Spotify(req.body);
    const registroGuardado = await nuevoRegistro.save();

    return res.status(201).json({
      success: true,
      message: 'Registro de Spotify creado correctamente',
      data: registroGuardado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear el registro de Spotify'
    });
  }
};

const putSpotifyCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se recibieron datos para actualizar'
      });
    }

    const registroActualizado = await Spotify.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: 'after',
        runValidators: true
      }
    );

    if (!registroActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Registro de Spotify no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro de Spotify actualizado correctamente',
      data: registroActualizado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el registro de Spotify'
    });
  }
};

const deleteSpotifyCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const registroEliminado = await Spotify.findByIdAndDelete(id);

    if (!registroEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Registro de Spotify no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro de Spotify eliminado correctamente',
      data: registroEliminado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el registro de Spotify'
    });
  }
};

const getSpotifyCompaniesByCountry = async (req, res) => {
  try {
    const { pais } = req.params;

    const registros = await Spotify.find({
      pais: { $regex: pais, $options: 'i' }
    });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al filtrar registros de Spotify por país'
    });
  }
};

export {
  getAllSpotifyCompanies,
  getSpotifyCompanyById,
  postSpotifyCompany,
  putSpotifyCompany,
  deleteSpotifyCompany,
  getSpotifyCompaniesByCountry
};
