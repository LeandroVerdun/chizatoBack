# 🛍️ Backend Sistema Integral de Gestión de Stock (Chisato Zone)

Este repositorio contiene la API RESTful que sirve como el cerebro del sistema web "Chisato Zone". Desarrollada con Node.js y Express.js, esta API se encarga de gestionar toda la lógica de negocio, la interacción con la base de datos y la seguridad del sistema, permitiendo la gestión de productos, usuarios, carritos de compra y órdenes.

## ⚙️ Tecnologías y Arquitectura

Tecnologías Principales

-Entorno de Ejecución: Node.js
-Framework Web: Express.js
-Base de Datos: MongoDB
-ODM (Object Data Modeling): Mongoose
-Autenticación: JSON Web Tokens (JWT)
-Hashing de Contraseñas: Bcrypt.js
-Middleware: Morgan (para logging), CORS

## Arquitectura de la API

La API sigue un patrón de diseño basado en la separación de responsabilidades, similar al patrón Modelo-Vista-Controlador (MVC), lo cual facilita la organización del código y el mantenimiento.

- **index.js**: El archivo principal que configura el servidor Express, establece la conexión a la base de datos MongoDB y define los middlewares y las rutas principales.

- **src/routes/**: Define los endpoints de la API. Cada archivo de ruta agrupa los endpoints por recurso (ej., userRouter.js para /api/users).

- **src/controllers/**: Contiene la lógica de negocio para cada endpoint. Recibe las peticiones, interactúa con los modelos y envía las respuestas.

- **src/models/**: Define los esquemas y modelos de Mongoose para cada entidad de la base de datos (Usuario, Producto, Orden, Carrito).

- **src/middleware/**: Almacena funciones que se ejecutan antes de que las peticiones lleguen a los controladores, como la verificación del token de autenticación (auth.js).

### 🗺️ Endpoints de la API

La API expone una serie de endpoints protegidos y públicos. Las rutas protegidas requieren un token JWT válido en el header Authorization. Las rutas de administrador requieren, además, que el token pertenezca a un usuario con rol isAdmin: true.

### 👤 Usuarios (/api/users)

Método Ruta Descripción Acceso

POST /register Registra un nuevo usuario. Público
POST /login Inicia sesión y devuelve un token JWT. Público
GET / Obtiene la lista de todos los usuarios. Admin
GET /:id Obtiene los datos de un usuario por su ID. Protegido
PUT /:id Actualiza la información de un usuario. Protegido
DELETE /:id Elimina un usuario por su ID. Protegido
POST /forgot-password Simula el proceso de recuperación de contraseña. Público

### 📦 Productos (/api/products)

Método Ruta Descripción Acceso

GET / Obtiene todos los productos. Público

GET /:id Obtiene un producto específico por su ID. Público

GET /search?q=... Busca productos por nombre, autor, descripción o categoría. Público

PATCH /adjust-stock/:productId Ajusta el stock de un producto. Protegido

POST /buy/:productId Simula la compra de un producto y actualiza el stock. Protegido

POST / Crea un nuevo producto. Admin

PUT /:id Actualiza un producto por su ID. Admin

DELETE /:id Elimina un producto.
Admin

### 🛒 Carrito de Compras (/api/cart)

Método Ruta Descripción Acceso

GET / Obtiene el carrito de compras del usuario autenticado. Protegido

POST / Agrega un nuevo producto o actualiza la cantidad de un producto en el carrito. Protegido

DELETE /:productId Elimina un producto del carrito. Protegido

DELETE / Vacía el carrito del usuario. Protegido

### 🛍️ Órdenes de Compra (/api/orders)

Método Ruta Descripción
Acceso

POST / Crea una nueva orden de compra. Válida el stock y vacía el carrito del usuario al completarse. Protegido

GET /myorders Obtiene todas las órdenes del usuario autenticado. Protegido

GET /:id Obtiene una orden específica por su ID. Protegido

GET / Obtiene la lista de todas las órdenes. Admin

PUT /:id/status Actualiza el estado de una orden. Admin
DELETE /:id Elimina una orden. Admin

### 🚀 Cómo Ejecutar el Backend

Requisitos Previos:

Node.js (versión 14 o superior)
npm (Node Package Manager) o Yarn
MongoDB (instancia local o remota, como MongoDB Atlas)

Pasos:
Clonar el repositorio:

Bash

git clone <https://github.com/LeandroVerdun/chizatoBack.git>

Instalar dependencias:

Bash

npm install

# o yarn install

Configurar variables de entorno:
Crea un archivo .env en la raíz del proyecto y añade las siguientes variables:

Fragmento de código

# Puerto del servidor

PORT=5000

# URI de conexión a MongoDB

MONGO_URI=mongodb://localhost:27017/xxxxxxx\*\*\*

# Clave secreta para firmar los tokens JWT

JWT_SECRET=tu_secreto_jwt_muy_seguro
Iniciar el servidor:

Bash

npm start

# o para desarrollo con reinicio automático:

# npm run dev

El servidor se iniciará en http://localhost:5000.
