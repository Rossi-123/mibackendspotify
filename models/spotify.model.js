import mongoose from 'mongoose';

const spotifySchema = new mongoose.Schema(
  {
    nombreEmpresa: {
      type: String,
      required: [true, 'El nombre de la empresa es obligatorio'],
      trim: true,
      default: 'Spotify'
    },
    industria: {
      type: String,
      required: [true, 'La industria es obligatoria'],
      trim: true
    },
    sede: {
      type: String,
      required: [true, 'La sede es obligatoria'],
      trim: true
    },
    pais: {
      type: String,
      required: [true, 'El país es obligatorio'],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true
    },
    sitioWeb: {
      type: String,
      required: [true, 'El sitio web es obligatorio'],
      trim: true
    },
    numeroEmpleados: {
      type: Number,
      required: [true, 'El número de empleados es obligatorio'],
      min: [0, 'El número de empleados no puede ser negativo']
    },
    ingresosAnuales: {
      type: Number,
      required: [true, 'Los ingresos anuales son obligatorios'],
      min: [0, 'Los ingresos anuales no pueden ser negativos']
    },
    estado: {
      type: String,
      enum: ['Activa', 'Inactiva', 'En expansión'],
      default: 'Activa'
    },
    fechaFundacion: {
      type: Date,
      required: [true, 'La fecha de fundación es obligatoria']
    }
  },
  {
    timestamps: true
  }
);

const Spotify = mongoose.model('Spotify', spotifySchema);

export default Spotify;
