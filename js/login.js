document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Obtener los valores de los campos
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Verificar si los campos están vacíos
    if (username === '' || password === '') {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Obtener los datos almacenados en el localStorage
    let usuariosLocalStorage = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar el usuario en el localStorage
    let usuarioLocalStorageEncontrado = usuariosLocalStorage.find(function (usuario) {
        return usuario.username === username && usuario.password === password;
    });

    if (usuarioLocalStorageEncontrado) {
        // Guardar en el sessionStorage
        sessionStorage.setItem('sesiones', JSON.stringify(usuarioLocalStorageEncontrado));
        window.location.href = "index.html";
    } else {
        // Si el usuario no está en el localStorage, realizar solicitud a la API
        fetch('https://fakestoreapi.com/users')
            .then(response => response.json())
            .then(users => {
                let usuarioApiEncontrado = users.find(user => user.username === username && user.password === password);

                if (usuarioApiEncontrado) {
                    // Guardar en el sessionStorage
                    sessionStorage.setItem('sesiones', JSON.stringify(usuarioApiEncontrado));
                    window.location.href = "index.html";
                } else {
                    alert("Nombre de usuario o contraseña incorrectos.");
                }
            })
            .catch(error => {
                console.error('Error al verificar usuario en la API:', error);
                alert('Error al verificar usuario. Por favor, inténtalo de nuevo.');
            });
    }
});
