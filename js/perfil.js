const logout = document.querySelector('#logout');
logout.addEventListener('click', () => cerrarSesion());

function cerrarSesion() {
  sessionStorage.clear("sesiones")
  window.location.reload();
}


function estaAutenticado() {
  // Verificar si existe la clave "usuario" en el LocalStorage
  return sessionStorage.getItem("sesiones") !== null;
}

// Ejemplo de uso
if (estaAutenticado()) {
  console.log("El usuario ha iniciado sesión.");
  // Aquí puedes realizar acciones específicas para usuarios autenticados.
} else {
  console.log("El usuario no ha iniciado sesión.");
  alert("El usuario no ha iniciado sesión");
  window.location.href = "login.html";
}

// PERFIL
const perfil = JSON.parse(sessionStorage.getItem("sesiones"));
const contenedor = document.getElementById("perfil");

const cardDiv = document.createElement("div");
cardDiv.classList.add("card");



const username = document.createElement("h4");
username.classList.add("card-title");
username.textContent = perfil.username;

const email = document.createElement("p");
email.classList.add("card-text");
email.textContent = perfil.email;


cardDiv.appendChild(username);
cardDiv.appendChild(email);
contenedor.appendChild(cardDiv);


//CARRITOS
const verHistorialBtn = document.getElementById("ver-historial-btn");

verHistorialBtn.addEventListener("click", mostrarHistorialCompras);

function mostrarHistorialCompras() {


  const usuarioActual = JSON.parse(sessionStorage.getItem('sesiones'));

  if (!usuarioActual) {
    alert("Usuario no autenticado.");
    return;
  }

  // Obtener el historial de compras del localStorage asociado al usuario
  const historialCompras = localStorage.getItem(`carritoItems_${usuarioActual.id}`);

  if (!historialCompras) {
    alert("No hay historial de compras para este usuario.");
    return;
  }

  // Convertir la cadena JSON a un array de historial de compras
  const historialArray = JSON.parse(historialCompras);

  // Mostrar el historial de compras en la interfaz de usuario (puedes ajustar según tu estructura HTML)
  const historialContainer = document.getElementById("historial-compras");
  historialContainer.innerHTML = '';

  historialArray.forEach((carrito, index) => {
    const historialItem = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.textContent = `Compra ${index + 1}`;
    historialItem.appendChild(h3);

    carrito.forEach(curso => {
      const p = document.createElement("p");
      p.textContent = `Curso: ${curso.nombre}, Cantidad: ${curso.cantidad}, Precio: ${curso.precio}`;
      historialItem.appendChild(p);
    });

    historialContainer.appendChild(historialItem);
  });

}


//CREAR PRODUCTO
document.getElementById("productForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  let productName = document.getElementById("productName").value;
  let productPrice = document.getElementById("productPrice").value;
  let productDescription = document.getElementById("productDescription").value;
  let productImage = document.getElementById("productImage").value;
  let productCategory = document.getElementById("productCategory").value;

  if (productName === '' || productPrice === '' || productDescription === '' || productImage === '' || productCategory === '') {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    // Obtener la lista de productos existentes en el localStorage
    const localStorageProducts = JSON.parse(localStorage.getItem('productos')) || [];

    // Obtener la última ID del localStorage
    let lastProductId = 19; // Valor inicial, si no hay productos

    if (localStorageProducts.length > 0) {
      lastProductId = localStorageProducts[localStorageProducts.length - 1].id;
    }

    // Incrementar la última ID para obtener la nueva ID del producto
    let nuevoId = lastProductId + 1;

    // Asegurarse de que la nueva ID sea mayor o igual a 20
    if (nuevoId < 21) {
      nuevoId = 21;
    }

    // Crear el nuevo producto con la nueva ID
    let nuevoProducto = {
      id: nuevoId,
      title: productName,
      price: parseFloat(productPrice),
      description: productDescription,
      image: productImage,
      category: productCategory,
    };

    // Actualizar la lista de productos en el localStorage
    const updatedProducts = [...localStorageProducts, nuevoProducto];
    localStorage.setItem('productos', JSON.stringify(updatedProducts));

    alert("Producto registrado exitosamente con ID: " + nuevoId);

    // Puedes redirigir a donde necesites después de registrar el producto
    // location.href = 'index.html';
  } catch (error) {
    console.error('Error al verificar producto en el localStorage:', error);
    alert('Error al verificar producto. Por favor, inténtalo de nuevo.');
  }
});