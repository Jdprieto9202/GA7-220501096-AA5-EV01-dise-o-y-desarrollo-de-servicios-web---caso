
const mensajeError = document.getElementsByClassName("error")[0]
//Escuchar el inicio del envío del formulario de inicio de sesión y envíar la recarga de la página predeterminada del formulario
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    //Obtener usuario y contraseña de los campos del formiulario
    const user = e.target.children.user.value;
    const contrasena = e.target.children.contrasena.value;
    //Enviar una solicitud HTTP POST asíncrona a la url /api/login en el servidor local con credenciales en formato Json
    const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user, contrasena
        })
    });
    //Muestra un mensaje de error si lo hay
    if (!res.ok) return mensajeError.classList.toggle("escondido", false);
    const resJson = await res.json();
    if(resJson.redirect){
        //Si la respuesta es correcta direcciona a la url especifica
        window.location.href = resJson.redirect;
    }
})