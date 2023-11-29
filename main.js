// HAY QUE PRIVAR DE VER LA PAGINA AL USUARIO SI ESTE MISMO NO HA INICIADO SESION

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


const contenedor = document.getElementById("appDiv");



const allProducts = document.querySelector('#productos');
allProducts.addEventListener('click', () => allProductsFunc());

const electronica = document.querySelector('#electronica');
electronica.addEventListener('click', () => electronicaFunc());

const joyeria = document.querySelector('#joyeria');
joyeria.addEventListener('click', () => joyeriaFunc());

const ropahombre = document.querySelector('#ropahombre');
ropahombre.addEventListener('click', () => ropaHombreFunc());

const ropamujer = document.querySelector('#ropamujer');
ropamujer.addEventListener('click', () => ropaMujerFunc());

//URLS
const allProductsUrl = `https://fakestoreapi.com/products`;
const urlElectronica = `https://fakestoreapi.com/products/category/electronics`
const urlJoyeria = `https://fakestoreapi.com/products/category/jewelery`
const urlRopaHombre = `https://fakestoreapi.com/products/category/men's clothing`
const urlRopaMujer = `https://fakestoreapi.com/products/category/women's clothing`


//SUPUESTAMENTE
async function allProductsFunc() {
  const contenedor = document.getElementById("appDiv");

  try {
    contenedor.innerHTML = '';

    // Cargar productos desde el localStorage
    const localStorageProducts = JSON.parse(localStorage.getItem('productos')) || [];

    // Obtener productos eliminados del localStorage
    const productosEliminados = JSON.parse(localStorage.getItem('productosEliminados')) || [];

    // Mostrar productos exclusivos del localStorage
    localStorageProducts.forEach(item => {
      if (!productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
      }
    });

    // Cargar productos desde la API que no estén en el localStorage
    const response = await fetch(allProductsUrl);
    const apiProducts = await response.json();

    apiProducts.forEach(item => {
      if (!localStorageProducts.some(localStorageProduct => localStorageProduct.id === item.id) && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
      }
    });

    console.log("Productos cargados con éxito");
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

function mostrarProductoEnDOM(item) {

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.style.width = "18rem";
  cardDiv.id = `producto-${item.id}`;


  // Crear elementos del DOM


  const imgElement = document.createElement("img");
  imgElement.classList.add("card-img-top");
  imgElement.src = item.image;

  const titleElement = document.createElement("h4");
  titleElement.classList.add("card-title");
  titleElement.textContent = item.title;

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("card-text");
  descriptionElement.classList.add("descripcion");
  descriptionElement.textContent = `${item.description}`;

  const priceElement = document.createElement("p");
  priceElement.classList.add("card-text");
  priceElement.classList.add("precio");
  priceElement.textContent = `${item.price}€`;

  const carritoButton = document.createElement("a");
  carritoButton.classList.add("btn");
  carritoButton.classList.add("btn-primary");
  carritoButton.classList.add("agregar-carrito");
  carritoButton.setAttribute("data-id", item.id);
  carritoButton.textContent = "Añadir al carrito";

  imgElement.addEventListener("click", () => showProductDetails(item));

  // Agregar elementos al cardDiv
  cardDiv.appendChild(imgElement);
  cardDiv.appendChild(titleElement);
  cardDiv.appendChild(descriptionElement);
  cardDiv.appendChild(priceElement);
  cardDiv.appendChild(carritoButton);

  // Agregar cardDiv al DOM
  contenedor.appendChild(cardDiv);
}



// Función para mostrar la información completa del producto
// Función para mostrar la información completa del producto en un modal
function showProductDetails(product) {
  // Eliminar el modal existente si hay alguno
  const modalExistente = document.querySelector(".modal");
  if (modalExistente) {
    document.body.removeChild(modalExistente);
  }

  // Crear elementos del DOM para el modal de detalles
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("role", "dialog");

  const modalDialog = document.createElement("div");
  modalDialog.classList.add("modal-dialog");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  const modalTitle = document.createElement("h5");
  modalTitle.classList.add("modal-title");
  modalTitle.textContent = product.title;

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  const productImage = document.createElement("img");
  productImage.classList.add("img-fluid");
  productImage.setAttribute("src", product.image);

  const productDescription = document.createElement("p");
  productDescription.textContent = product.description;

  // Crear el elemento para la categoría
  const productCategory = document.createElement("p");
  productCategory.textContent = product.category;

  // Crear botones para eliminar y abrir el modal de actualización
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", function () {
    eliminarProducto(product);
    $(modal).modal("hide");
  });

  const updateButton = document.createElement("button");
  updateButton.classList.add("btn", "btn-primary");
  updateButton.textContent = "Actualizar";
  updateButton.addEventListener("click", function () {
    // Llamamos a la función para abrir el modal de actualización

    $(modalUpdate).modal("show");
    $(modal).modal("hide");
    guardarCambios(product);
  });

  // Construir la estructura del modal de detalles
  modalHeader.appendChild(modalTitle);
  modalBody.appendChild(productImage);
  modalBody.appendChild(productDescription);
  modalBody.appendChild(productCategory);
  modalBody.appendChild(deleteButton);
  modalBody.appendChild(updateButton);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);

  modalDialog.appendChild(modalContent);

  modal.appendChild(modalDialog);

  // Agregar el modal de detalles al cuerpo del documento
  document.body.appendChild(modal);

  // Mostrar el modal de detalles
  $(modal).modal("show");

  // Eliminar el modal de detalles del DOM después de que se cierre
  $(modal).on("hidden.bs.modal", function () {
    document.body.removeChild(modal);
  });

  // Crear el modal de actualización
  const modalUpdate = document.createElement("div");
  modalUpdate.classList.add("modal", "fade");
  modalUpdate.setAttribute("tabindex", "-1");
  modalUpdate.setAttribute("role", "dialog");

  const modalUpdateDialog = document.createElement("div");
  modalUpdateDialog.classList.add("modal-dialog");

  const modalUpdateContent = document.createElement("div");
  modalUpdateContent.classList.add("modal-content");

  const modalUpdateHeader = document.createElement("div");
  modalUpdateHeader.classList.add("modal-header");

  const modalUpdateTitle = document.createElement("h5");
  modalUpdateTitle.classList.add("modal-title");
  modalUpdateTitle.textContent = "Actualizar Producto";

  const modalUpdateBody = document.createElement("div");
  modalUpdateBody.classList.add("modal-body");

  // Crear un formulario para la actualización del producto
  const updateForm = document.createElement("form");
  updateForm.id = "updateForm";

  // Campo para el nombre del producto
  const productNameInput = crearCampoFormulario("Nombre del Producto", "text", "updateProductName", product.title);

  // Campo para el precio del producto
  const productPriceInput = crearCampoFormulario("Precio del Producto", "number", "updateProductPrice", product.price);

  // Campo para la descripción del producto
  const productDescriptionInput = crearCampoFormulario("Descripción del Producto", "text", "updateProductDescription", product.description);

  // Campo para el enlace de la imagen del producto
  const productImageInput = crearCampoFormulario("Enlace de la Imagen", "url", "updateProductImage", product.image);

  // Campo para la categoría del producto (puedes ajustar según tus necesidades)
  const productCategoryInput = crearCampoFormulario("Categoría del Producto", "text", "updateProductCategory", product.category);

  // Agregar campos al formulario
  updateForm.appendChild(productNameInput);
  updateForm.appendChild(productPriceInput);
  updateForm.appendChild(productDescriptionInput);
  updateForm.appendChild(productImageInput);
  updateForm.appendChild(productCategoryInput);

  modalUpdateBody.appendChild(updateForm);

  const modalUpdateFooter = document.createElement("div");
  modalUpdateFooter.classList.add("modal-footer");

  const saveChangesButton = document.createElement("button");
  saveChangesButton.classList.add("btn", "btn-primary");
  saveChangesButton.textContent = "Guardar Cambios";
  saveChangesButton.addEventListener("click", function () {
    guardarCambios(product);
    $(modalUpdate).modal("hide");
  });

  // Construir la estructura del modal de actualización
  modalUpdateHeader.appendChild(modalUpdateTitle);
  modalUpdateContent.appendChild(modalUpdateBody);
  modalUpdateContent.appendChild(modalUpdateFooter);
  modalUpdateFooter.appendChild(saveChangesButton);

  modalUpdateDialog.appendChild(modalUpdateContent);

  modalUpdate.appendChild(modalUpdateDialog);

  // Agregar el modal de actualización al cuerpo del documento
  document.body.appendChild(modalUpdate);

  // Eliminar el modal de actualización del DOM después de que se cierre
  $(modalUpdate).on("hidden.bs.modal", function () {
    document.body.removeChild(modalUpdate);
  });
}

function crearCampoFormulario(labelText, tipo, id, valor) {
  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = tipo;
  input.id = id;
  input.value = valor;

  const divCampo = document.createElement("div");
  divCampo.appendChild(label);
  divCampo.appendChild(input);

  return divCampo;
}

function eliminarProducto(product) {
  // Lógica para eliminar el producto (puedes usar el ID u otra identificación única)
  let productosAlmacenados = JSON.parse(localStorage.getItem('productos')) || [];
  productosAlmacenados = productosAlmacenados.filter(p => p.id !== product.id);

  // Crear una copia idéntica del producto eliminado en productosEliminados
  let productosEliminados = JSON.parse(localStorage.getItem('productosEliminados')) || [];
  productosEliminados.push(product);

  // Actualizar localStorage con los productos actualizados y la copia del producto eliminado
  localStorage.setItem('productos', JSON.stringify(productosAlmacenados));
  localStorage.setItem('productosEliminados', JSON.stringify(productosEliminados));
  window.location.reload();
}


function guardarCambios(product) {
  let productosAlmacenados = JSON.parse(localStorage.getItem('productos')) || [];
  const updatedProductIndex = productosAlmacenados.findIndex(p => p.id === product.id);

  // Obtener los valores actualizados de los elementos del formulario
  const updatedTitle = document.getElementById("updateProductName").value;
  const updatedPrice = document.getElementById("updateProductPrice").value;
  const updatedDescription = document.getElementById("updateProductDescription").value;
  const updatedImage = document.getElementById("updateProductImage").value;
  const updatedCategory = document.getElementById("updateProductCategory").value;

  if (updatedProductIndex !== -1) {
    // Actualizar el producto existente
    const updatedProduct = {
      id: product.id,
      title: updatedTitle,
      price: updatedPrice,
      description: updatedDescription,
      image: updatedImage,
      category: updatedCategory,
    };

    // Verificar si el producto actualizado existe en el array antes de realizar la actualización
    if (productosAlmacenados[updatedProductIndex]) {
      productosAlmacenados[updatedProductIndex] = {
        ...productosAlmacenados[updatedProductIndex],
        ...updatedProduct,
      };
    } else {
      // Si el producto no existe en el array, agregarlo
      productosAlmacenados.push(updatedProduct);
    }
  } else {
    // El producto no está presente, agregarlo con el mismo ID de la API
    const nuevoProducto = {
      id: product.id,
      title: updatedTitle,
      price: updatedPrice,
      description: updatedDescription,
      image: updatedImage,
      category: updatedCategory,
    };
    productosAlmacenados.push(nuevoProducto);
  }

  localStorage.setItem('productos', JSON.stringify(productosAlmacenados));

  // Actualizar el elemento en el DOM
  const elementoExistente = document.getElementById(`producto-${product.id}`);
  if (elementoExistente) {
    const titleElement = elementoExistente.querySelector(".card-title");
    const imageElement = elementoExistente.querySelector(".card-img-top");
    const priceElement = elementoExistente.querySelector(".precio");
    const descriptionElement = elementoExistente.querySelector(".descripcion");

    if (titleElement) titleElement.textContent = updatedTitle;
    if (imageElement) imageElement.src = updatedImage;
    if (priceElement) priceElement.textContent = `${updatedPrice}`;
    if (descriptionElement) descriptionElement.textContent = updatedDescription;
  }

  // Actualizar el modal si está abierto
  const modalExistente = document.querySelector(".modal.show");
  if (modalExistente) {
    // Esperar hasta que el modal se haya mostrado completamente
    $(modalExistente).on('shown.bs.modal', function () {
      // Obtener el producto actualizado del localStorage
      const productoActualizado = productosAlmacenados[updatedProductIndex] || productosAlmacenados[productosAlmacenados.length - 1];

      // Actualizar elementos dentro del modal
      const modalTitleElement = modalExistente.querySelector(".modal-title");
      const modalImageElement = modalExistente.querySelector(".img-fluid");
      const modalPriceElement = modalExistente.querySelector(".precio");

      if (modalTitleElement) modalTitleElement.textContent = productoActualizado.title;
      if (modalImageElement) modalImageElement.src = productoActualizado.image;
      if (modalPriceElement) modalPriceElement.textContent = `${productoActualizado.price}`;
      // Puedes actualizar otros campos en el modal según sea necesario
    });
  }

  console.log('Producto actualizado o creado:', productosAlmacenados[updatedProductIndex] || productosAlmacenados[productosAlmacenados.length - 1]);
}




async function electronicaFunc() {
  const contenedor = document.getElementById("appDiv");

  try {
    contenedor.innerHTML = '';

    // Cargar productos desde el localStorage
    const localStorageProducts = JSON.parse(localStorage.getItem('productos')) || [];

    // Obtener productos eliminados del localStorage
    const productosEliminados = JSON.parse(localStorage.getItem('productosEliminados')) || [];

    // Mostrar productos exclusivos del localStorage de la categoría 'electronics'
    localStorageProducts.forEach(item => {
      if (item.category === 'electronics' && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
      }
    });

    // Cargar productos desde la API que no estén en el localStorage
    const response = await fetch(urlElectronica);
    const apiProducts = await response.json();

    apiProducts.forEach(item => {
      if (!localStorageProducts.some(localStorageProduct => localStorageProduct.id === item.id) && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
        actualizarProductoEnLocalStorage(item);
      }
    });

    console.log("Productos de electrónica cargados con éxito");
  } catch (error) {
    console.error("Error al cargar los productos de electrónica:", error);
  }
}

async function joyeriaFunc() {
  const contenedor = document.getElementById("appDiv");

  try {
    contenedor.innerHTML = '';

    // Cargar productos desde el localStorage
    const localStorageProducts = JSON.parse(localStorage.getItem('productos')) || [];

    // Obtener productos eliminados del localStorage
    const productosEliminados = JSON.parse(localStorage.getItem('productosEliminados')) || [];

    // Mostrar productos exclusivos del localStorage de la categoría 'jewelery'
    localStorageProducts.forEach(item => {
      if (item.category === 'jewelery' && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
      }
    });

    // Cargar productos desde la API que no estén en el localStorage
    const response = await fetch(urlJoyeria);
    const apiProducts = await response.json();

    apiProducts.forEach(item => {
      if (!localStorageProducts.some(localStorageProduct => localStorageProduct.id === item.id) && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
        actualizarProductoEnLocalStorage(item);
      }
    });

    console.log("Productos de joyería cargados con éxito");
  } catch (error) {
    console.error("Error al cargar los productos de joyería:", error);
  }
}

async function ropaHombreFunc() {
  const contenedor = document.getElementById("appDiv");

  try {
    contenedor.innerHTML = '';

    // Cargar productos desde el localStorage
    const localStorageProducts = JSON.parse(localStorage.getItem('productos')) || [];

    // Obtener productos eliminados del localStorage
    const productosEliminados = JSON.parse(localStorage.getItem('productosEliminados')) || [];

    // Mostrar productos exclusivos del localStorage de la categoría "men's clothing"
    localStorageProducts.forEach(item => {
      if (item.category === "men's clothing" && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
      }
    });

    // Cargar productos desde la API que no estén en el localStorage
    const response = await fetch(urlRopaHombre);
    const apiProducts = await response.json();

    apiProducts.forEach(item => {
      if (!localStorageProducts.some(localStorageProduct => localStorageProduct.id === item.id) && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
        actualizarProductoEnLocalStorage(item);
      }
    });

    console.log("Productos de ropa de hombre cargados con éxito");
  } catch (error) {
    console.error("Error al cargar los productos de ropa de hombre:", error);
  }
}

async function ropaMujerFunc() {
  const contenedor = document.getElementById("appDiv");

  try {
    contenedor.innerHTML = '';

    // Cargar productos desde el localStorage
    const localStorageProducts = JSON.parse(localStorage.getItem('productos')) || [];

    // Obtener productos eliminados del localStorage
    const productosEliminados = JSON.parse(localStorage.getItem('productosEliminados')) || [];

    // Mostrar productos exclusivos del localStorage de la categoría "women's clothing"
    localStorageProducts.forEach(item => {
      if (item.category === "women's clothing" && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
      }
    });

    // Cargar productos desde la API que no estén en el localStorage
    const response = await fetch(urlRopaMujer);
    const apiProducts = await response.json();

    apiProducts.forEach(item => {
      if (!localStorageProducts.some(localStorageProduct => localStorageProduct.id === item.id) && !productosEliminados.some(eliminado => eliminado.id === item.id)) {
        mostrarProductoEnDOM(item);
        actualizarProductoEnLocalStorage(item);
      }
    });

    console.log("Productos de ropa de mujer cargados con éxito");
  } catch (error) {
    console.error("Error al cargar los productos de ropa de mujer:", error);
  }
}

const logout = document.querySelector('#logout');
logout.addEventListener('click', () => cerrarSesion());

function cerrarSesion() {
  sessionStorage.clear("sesiones")
  window.location.reload();
}

function actualizarProductoEnLocalStorage(nuevoProducto) {
  // Obtener productos del Local Storage
  const localStorageProducts = JSON.parse(localStorage.getItem('productos')) || [];

  // Actualizar el producto existente si ya está en el Local Storage
  const productosActualizados = localStorageProducts.map(producto => {
    if (producto.id === nuevoProducto.id) {
      return nuevoProducto;
    }
    return producto;
  });

  // Guardar los productos actualizados en el Local Storage
  localStorage.setItem('productos', JSON.stringify(productosActualizados));
}


const alertaPerfil = document.querySelector('#perfilNav');
alertaPerfil.addEventListener('click', () => {
  const confirmacion = confirm("Si abandonas esta página se perderá tu compra. Asegúrate de finalizarla.");

  if (confirmacion) {
    // Aquí puedes agregar la redirección u otras acciones si el usuario confirma (presiona OK)
    console.log("Usuario confirmó. Redirigiendo...");
    window.location.href = 'perfil.html'; // Reemplaza 'nueva_pagina.html' con la URL a la que deseas redirigir.
  } else {
    // Aquí puedes agregar acciones adicionales si el usuario cancela (presiona Cancelar)
    console.log("Usuario canceló. Permaneciendo en la misma página.");
  }
});
