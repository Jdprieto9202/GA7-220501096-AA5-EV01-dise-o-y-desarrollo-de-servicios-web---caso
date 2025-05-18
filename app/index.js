import express from "express";
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
import mongoose from "mongoose";
import Usuario from './public/Usuario.js';

app.post('/api/register', async (req, res) => {
  try {
    const { user, email, contrasena } = req.body;

    // Crear una nueva instancia del modelo Usuario
    const nuevoUsuario = new Usuario({
      user,
      email,
      contrasena,
    });

    // Guardar el nuevo usuario en la base de datos
    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: usuarioGuardado });

  } catch (error) {
    console.error('Error al registrar usuario:', error);

    // Manejar errores de validación de Mongoose (por ejemplo, campos requeridos faltantes, duplicados)
    if (error.name === 'ValidationError') {
      const errors = {};
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
      return res.status(400).json({ message: 'Error de validación', errors });
    }

    // Otros errores del servidor
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url)); 
import { methods as authentication } from "./controllers/authentication.controlers.js";

//Server
app.set("port", 4000);
app.listen(app.get("port"));
console.log("Servidor corriendon en puerto", app.get("port"));

//Configuración 
app.use(express.static(__dirname + "/public"));
app.use(express.json());

//Rutas
app.get("/", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register.html", (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin.html", (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));
app.post("/api/register", authentication.register);
app.post("/api/login", authentication.login);

//conexión base de datos
const uri = 'mongodb+srv://root:root@cluster0.jbb8ayx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri)
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));