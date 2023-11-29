# JuradoStore

## Descripción 🛍️

Este código implementa una aplicación web de comercio electrónico, ofreciendo una experiencia completa para explorar, visualizar, y gestionar productos. Desde la autenticación del usuario hasta la gestión del carrito de compras, la aplicación proporciona diversas funcionalidades para una experiencia de usuario enriquecida.

## Funcionalidades ✨

### Autenticación de Usuario 🎫

La función `estaAutenticado()` verifica si el usuario ha iniciado sesión, utilizando sessionStorage para almacenar la información de la sesión.

### Navegación por Categorías 🗂️

- Los elementos del menú permiten filtrar y mostrar productos de diferentes categorías (electrónica, joyería, ropa para hombres y mujeres).
- Las URLs de las categorías se obtienen de la Fake Store API.

### Carga y Visualización de Productos 📦

- La función `allProductsFunc()` carga y muestra productos desde el localStorage y la Fake Store API.
- Cada producto se presenta en una tarjeta con imagen, título, descripción, precio y botón para agregar al carrito.
- La función `mostrarProductoEnDOM(item)` construye la estructura de la tarjeta para un producto.

### Detalles del Producto 🖼️

- La función `showProductDetails(product)` muestra un modal con información detallada de un producto.
- Se proporcionan botones para eliminar y actualizar el producto.

### Actualización de Productos 🔄

- La función `guardarCambios(product)` actualiza la información de un producto en localStorage y en el DOM.
- Se utiliza un modal de actualización para modificar los detalles del producto.

### Carrito de Compras 🛒

- La sección del carrito permite agregar productos, gestionar cantidades, y vaciar el carrito.
- Se muestra un resumen del carrito con imagen, nombre, precio unitario, cantidad, subtotal y opción para eliminar.
- La función `guardarCarrito()` guarda el carrito en localStorage asociado al usuario autenticado.

### Gestión de Sesiones 🔐

- La función `cerrarSesion()` cierra la sesión del usuario y recarga la página.

### Advertencia al Abandonar el Perfil ⚠️

- Al hacer clic en el enlace de perfil, se muestra una alerta para confirmar si el usuario desea abandonar la página.

## Requisitos 🚀

- Se espera que el usuario esté autenticado para utilizar algunas funciones; de lo contrario, se mostrarán alertas.
- El código utiliza la Fake Store API para obtener información de productos.

## Notas 📝

- Se recomienda manejar la seguridad y autenticación del lado del servidor en un entorno de producción.
- Las URLs de las categorías y detalles del producto están conectadas a la Fake Store API, asegúrese de tener una conexión a Internet para cargar datos.

---

**¡Gracias por revisar este código!** 🙌

