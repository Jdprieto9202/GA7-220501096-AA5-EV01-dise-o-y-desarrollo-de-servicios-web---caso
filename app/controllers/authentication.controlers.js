// Definimos la lógica para el inicio de sesión y el registro de usuarios, utilizando bcryptjs para 
// el hashing de contraseñas y jsonwebtoken, para la creación de tokens JWT para la autenticación 
// basada en cookies. También utilizamos dotenv para cargar variables de entorno. El almacenamiento 
// de usuarios se realiza en memoria a través del array usuarios.
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";

dotenv.config();

const usuarios = [{
    user: "k",
    contrasena: "$2b$10$vscnsY/jgCAIsjKdTeF2H.ipGHYrodwMkwMmgYHEFZpsjw7UuYS1O",
    email: "a@correo"
}]

async function login(req, res) {
    console.log(req.body)
    const user = req.body.user;
    const contrasena = req.body.contrasena;
    if (!user || !contrasena) {
        return res.status(400).send({ status: "error", message: "Los campos estan incompletos" })
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if (!usuarioARevisar) {
        return res.status(400).send({ status: "error", message: "Error al iniciar sesión" })
    }
    const loginCorrecto = await bcryptjs.compare(contrasena, usuarioARevisar.contrasena);
    console.log(loginCorrecto)
    if(!loginCorrecto){
        return res.status(400).send({ status: "error", message: "Error al iniciar sesión" })
    }
    const token = jsonwebtoken.sign(
    {user:usuarioARevisar.user},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION});

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: "/"
    }
    res.cookie("jwt",token,cookieOption);
    res.send({status:"ok",message:"Usuario loggeado",redirect:"/admin.html"});

}


async function register(req, res) {
    const user = req.body.user;
    const email = req.body.email;
    const contrasena = req.body.contrasena;
    if (!user || !contrasena || !email) {
        return res.status(400).send({ status: "error", message: "Los campos estan incompletos" })
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if (usuarioARevisar) {
        return res.status(400).send({ status: "error", message: "Este usuario ya existe" })
    }
    const salt = await bcryptjs.genSalt(10);
    const hashContrasena = await bcryptjs.hash(contrasena, salt);
    const nuevoUsuario = {
        user, email, contrasena: hashContrasena
    }
    
    console.log(nuevoUsuario);
    usuarios.push(nuevoUsuario);
    return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.user}agregado`, redirect: "/" })
}

export const methods = {
    login,
    register
}
