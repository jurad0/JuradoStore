document.getElementById("RegisForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let emailPattern = /\S+@\S+\.\S+/;
    let passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (username === '' || email === '' || password === '') {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (!email.match(emailPattern)) {
        alert("Por favor, introduce un email válido.");
        return;
    }

    if (!password.match(passwordPattern)) {
        alert("La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
        return;
    }

    // Obtener la lista de usuarios existentes
    let registrosPrevios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Realizar solicitud a la API para verificar si el usuario ya existe
    fetch('https://fakestoreapi.com/users')
        .then(response => response.json())
        .then(users => {
            let userExists = users.some(user => user.username === username);

            if (userExists) {
                alert("Nombre de usuario ya registrado.");
                return;
            }

            // Si no existe, procede con el registro
            document.getElementById("RegisForm").reset();

            let nuevoId = 11;
            if (registrosPrevios.length > 0) {
                nuevoId = registrosPrevios[registrosPrevios.length - 1].id + 1;
            }

            // Crear el nuevo usuario con el ID autoincremental
            let nuevoUsuario = {
                id: nuevoId,
                username: username,
                password: password,
                email: email,
            };

            registrosPrevios.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(registrosPrevios));

            location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error al verificar usuario en la API:', error);
            alert('Error al verificar usuario. Por favor, inténtalo de nuevo.');
        });
});
