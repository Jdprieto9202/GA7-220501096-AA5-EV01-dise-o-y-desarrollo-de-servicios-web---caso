// Definimos la lógica para el inicio de sesión y el registro de usuarios.
import Usuario from '../public/Usuario.js';

async function login(req, res) {
    console.log(req.body);
    const { user, contrasena } = req.body;

    if (!user || !contrasena) {
        return res.status(400).send({ status: "error", message: "Los campos están incompletos" });
    }

    try {
        // Busca un usuario por nombre de usuario
        const usuarioARevisar = await Usuario.findOne({ user: user });

        if (!usuarioARevisar) {
            return res.status(400).send({ status: "error", message: "Error al iniciar sesión: Usuario no encontrado" });
        }

        // Compara la contraseña directamente 
        if (contrasena === usuarioARevisar.contrasena) {
            res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin.html" });
        } else {
            return res.status(400).send({ status: "error", message: "Error al iniciar sesión: Contraseña incorrecta" });
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        return res.status(500).send({ status: "error", message: "Error al iniciar sesión" });
    }
}

async function register(req, res) {
    const { user, email, contrasena } = req.body;

    if (!user || !contrasena || !email) {
        return res.status(400).send({ status: "error", message: "Los campos están incompletos" });
    }

    try {
        // Verifica si ya existe un usuario con ese nombre de usuario
        const usuarioExistente = await Usuario.findOne({ user: user });
        if (usuarioExistente) {
            return res.status(400).send({ status: "error", message: "Este usuario ya existe" });
        }

        // Crea un nuevo documento de usuario con la contraseña sin hashear (¡PELIGRO: esto es inseguro!)
        const nuevoUsuario = new Usuario({
            user,
            email,
            contrasena
        });

        // Guarda el nuevo usuario en la base de datos
        await nuevoUsuario.save();
        return res.status(201).send({ status: "ok", message: `Usuario ${user} registrado exitosamente`, redirect: "/" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).send({ status: "error", message: "Error al registrar el usuario" });
    }
}

export const methods = {
    login,
    register
};
