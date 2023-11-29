(function () {

  try {
    const carritoContainer = document.querySelector("#carrito");
    const listaCarrito = document.querySelector("#lista-carrito tbody");
    const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
    const listaCursos = document.querySelector("#appDiv");
    const precioTotal = document.querySelector("#precio-total");
    const guardarCarritoBtn = document.querySelector("#guardar-carrito");

    let carritoItems = [];

    listaCursos.addEventListener("click", agregarCurso);
    carritoContainer.addEventListener("click", gestionarCantidad);
    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
    guardarCarritoBtn.addEventListener("click", guardarCarrito);

    function agregarCurso(event) {
      event.preventDefault();
      const elementoClickeado = event.target;

      if (elementoClickeado.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = obtenerDatosCurso(elementoClickeado.parentElement);
        agregarCursoAlCarrito(cursoSeleccionado);
      }
    }

    function obtenerDatosCurso(cursoElemento) {
      const imagenCurso = cursoElemento.querySelector("img").src;
      const nombreCurso = cursoElemento.querySelector("h4").textContent;
      const precioCurso = cursoElemento.querySelector(".precio").textContent;
      const idCurso = cursoElemento.querySelector("a").dataset.id;

      return {
        imagen: imagenCurso,
        nombre: nombreCurso,
        precio: precioCurso,
        id: idCurso,
        cantidad: 1
      };
    }

    function agregarCursoAlCarrito(curso) {
      const usuarioActual = JSON.parse(sessionStorage.getItem('sesiones'));

      if (!usuarioActual) {
        alert("Usuario no autenticado.");
        return;
      }

      const cursoExistente = carritoItems.find(item => item.id === curso.id && item.userId === usuarioActual.id);

      if (cursoExistente) {
        cursoExistente.cantidad++;
      } else {
        curso.userId = usuarioActual.id; // Asociar al usuario actual
        carritoItems.push(curso);
      }

      actualizarCarrito();
    }

    function gestionarCantidad(event) {
      if (event.target.classList.contains("borrar-curso")) {
        const cursoId = event.target.dataset.id;
        carritoItems = carritoItems.filter(item => item.id !== cursoId);
      } else if (event.target.classList.contains("restar-curso")) {
        const cursoId = event.target.dataset.id;
        const cursoExistente = carritoItems.find(item => item.id === cursoId);

        if (cursoExistente && cursoExistente.cantidad > 1) {
          cursoExistente.cantidad--;
        }
      } else if (event.target.classList.contains("sumar-curso")) {
        const cursoId = event.target.dataset.id;
        const cursoExistente = carritoItems.find(item => item.id === cursoId);

        if (cursoExistente) {
          cursoExistente.cantidad++;
        }
      }

      actualizarCarrito();
    }

    function vaciarCarrito() {
      carritoItems = [];
      actualizarCarrito();
    }

    function actualizarCarrito() {
      listaCarrito.innerHTML = "";

      let totalPrecio = 0;

      carritoItems.forEach(curso => {
        const filaCarrito = document.createElement("tr");
        const precioPorUnidad = parseFloat(curso.precio.replace("$", ""));
        const subtotal = precioPorUnidad * curso.cantidad;

        const columnaImagen = document.createElement("td");
        const imagen = document.createElement("img");
        imagen.src = curso.imagen;
        imagen.width = 100;
        imagen.alt = curso.nombre;
        columnaImagen.appendChild(imagen);
        filaCarrito.appendChild(columnaImagen);

        const columnaNombre = document.createElement("td");
        columnaNombre.textContent = curso.nombre;
        filaCarrito.appendChild(columnaNombre);

        const columnaPrecioUnidad = document.createElement("td");
        columnaPrecioUnidad.textContent = `${precioPorUnidad.toFixed(2)}€`;
        filaCarrito.appendChild(columnaPrecioUnidad);

        const columnaCantidad = document.createElement("td");
        const restarButton = document.createElement("button");
        restarButton.classList.add("restar-curso");
        restarButton.dataset.id = curso.id;
        restarButton.textContent = "-";
        columnaCantidad.appendChild(restarButton);
        columnaCantidad.appendChild(document.createTextNode(` ${curso.cantidad} `));
        const sumarButton = document.createElement("button");
        sumarButton.classList.add("sumar-curso");
        sumarButton.dataset.id = curso.id;
        sumarButton.textContent = "+";
        columnaCantidad.appendChild(sumarButton);
        filaCarrito.appendChild(columnaCantidad);

        const columnaSubtotal = document.createElement("td");
        columnaSubtotal.textContent = `${subtotal.toFixed(2)}€`;
        filaCarrito.appendChild(columnaSubtotal);

        const columnaBorrar = document.createElement("td");
        const borrarLink = document.createElement("a");
        borrarLink.href = "#";
        borrarLink.classList.add("borrar-curso");
        borrarLink.dataset.id = curso.id;
        borrarLink.textContent = "X";
        columnaBorrar.appendChild(borrarLink);
        filaCarrito.appendChild(columnaBorrar);

        listaCarrito.appendChild(filaCarrito);

        totalPrecio += subtotal;
      });

      precioTotal.textContent = `${totalPrecio.toFixed(2)}€`;
    }

    function guardarCarrito() {
      const usuarioActual = JSON.parse(sessionStorage.getItem('sesiones'));

      if (!usuarioActual) {
        alert("Usuario no autenticado.");
        return;
      }

      // Obtener los carritos guardados del localStorage asociados al usuario
      const carritosGuardados = localStorage.getItem(`carritoItems_${usuarioActual.id}`);

      // Si hay carritos guardados, convertir la cadena JSON a un array
      const carritos = carritosGuardados ? JSON.parse(carritosGuardados) : [];

      // Agregar el carrito actual al array de carritos
      carritos.push(carritoItems);

      // Convertir el array de objetos carritoItems a una cadena JSON
      const carritosGuardadosActualizados = JSON.stringify(carritos);

      // Guardar la cadena JSON en el localStorage con la clave específica asociada al usuario
      localStorage.setItem(`carritoItems_${usuarioActual.id}`, carritosGuardadosActualizados);

      vaciarCarrito();
      console.log("Carrito guardado en localStorage asociado al usuario:", usuarioActual.id);
    }
  } catch {
    console.log("cosas de carrito")
  }
})();
