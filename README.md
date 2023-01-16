# README.md

## Descripción
Este es un backend desarrollado en Node.js utilizando Express, jsonwebtoken, bcrypt, dotenv y una base de datos sqlite. Las rutas disponibles son:

- `GET /api/users/`: Obtiene todos los usuarios.
- `GET /api/users/:id`: Obtiene un usuario específico por su id.
- `GET /api/users/byname/:name`: Obtiene un usuario específico por su nombre.
- `POST /api/users/create`: Crea un nuevo usuario.

## Instrucciones de uso
1. Descargar el repositorio.
2. Instalar las dependencias necesarias con `npm install`.
3. Iniciar el servidor con `npm run start`.
