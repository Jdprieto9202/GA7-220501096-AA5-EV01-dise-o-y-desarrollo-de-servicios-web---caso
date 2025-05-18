import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  // Puedes agregar más campos como fecha de creación, etc.
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;