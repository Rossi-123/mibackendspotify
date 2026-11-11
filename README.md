# Mi Backend - Sistema CRUD Spotify

## Descripción

Sistema de gestión CRUD basado en Spotify. El proyecto integra un backend REST con Node.js, Express, MongoDB Atlas y Mongoose, junto con un frontend personalizado servido desde `public/` usando HTML, CSS, JavaScript, Bootstrap y Fetch API.

El backend y el frontend conviven en el mismo proyecto, pero cada parte mantiene su responsabilidad: Express expone la API y sirve archivos estáticos, mientras que el cliente web consume `/api/spotify` y manipula el DOM para mostrar los cambios del CRUD.

## Tecnologías Utilizadas

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- cors

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap por CDN
- Fetch API con `async/await`
- Manipulación dinámica del DOM

## Estructura Del Proyecto

```txt
mi-backend/
├── config/
│   └── database.js
├── controllers/
│   └── spotify.controllers.js
├── models/
│   └── spotify.model.js
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── routes/
│   ├── index.routes.js
│   └── spotify.routes.js
├── .env
├── app.js
├── package-lock.json
├── package.json
├── README.md
├── REPORTE_FRONTEND_SPOTIFY_RUBRICA.md
├── REPORTE_FORMULARIO_SPOTIFY_PERSONALIZADO.md
└── server.js
```

## Backend Integrado

- `server.js`: carga variables de entorno, conecta MongoDB e inicia el servidor.
- `app.js`: configura Express, CORS, JSON, URL encoded, carpeta `public/`, ruta `/health` y rutas de API.
- `config/database.js`: conecta con MongoDB usando `MONGO_URI`.
- `models/spotify.model.js`: define el esquema de registros corporativos de Spotify.
- `controllers/spotify.controllers.js`: contiene la lógica CRUD y los códigos HTTP.
- `routes/index.routes.js`: centraliza la ruta base `/api`.
- `routes/spotify.routes.js`: define las rutas de `/api/spotify`.

## Frontend Integrado

El proyecto incluye un frontend desarrollado con HTML, CSS, JavaScript y Bootstrap dentro de la carpeta `public/`.

El formulario fue personalizado para verse más original y se organizó en secciones visuales:

- Identidad empresarial.
- Ubicación y presencia.
- Métricas corporativas.
- Resumen corporativo.

Desde la interfaz se pueden realizar las operaciones CRUD completas:

- Crear registros.
- Consultar registros.
- Editar registros.
- Eliminar registros.

El consumo de la API se realiza con `fetch` y `async/await`, manipulando dinámicamente el DOM para mostrar datos, mensajes y acciones. Los textos visibles, botones, placeholders y secciones fueron ajustados sin cambiar los nombres internos de los campos que requiere el backend.

## Variables De Entorno

El archivo `.env` debe incluir:

```env
PORT=3000
MONGO_URI=tu_uri_de_mongodb_atlas
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

También se puede usar el modo de desarrollo:

```bash
npm run dev
```

## Acceso Al Frontend

Con el puerto configurado por defecto:

```txt
http://localhost:3000
```

Durante la verificación local de esta entrega se usó `http://localhost:3001` porque el puerto `3000` ya estaba ocupado por otro backend local. No se modificó el `.env`.

## Ruta Base De La API

```txt
/api/spotify
```

## Rutas De La API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/spotify` | Lista todos los registros |
| GET | `/api/spotify/:id` | Consulta un registro por ID |
| GET | `/api/spotify/pais/:pais` | Filtra registros por país |
| POST | `/api/spotify` | Crea un registro |
| PUT | `/api/spotify/:id` | Actualiza un registro |
| DELETE | `/api/spotify/:id` | Elimina un registro |

## Campos Del Modelo

- `nombreEmpresa`
- `industria`
- `sede`
- `pais`
- `descripcion`
- `sitioWeb`
- `numeroEmpleados`
- `ingresosAnuales`
- `estado`
- `fechaFundacion`

## Pruebas CRUD Realizadas

Se probaron operaciones CRUD con registros académicos personalizados:

| Método | Resultado |
|---|---|
| POST | 3 registros creados con código `201` |
| GET | Listado general con código `200` |
| GET por ID | Consulta específica con código `200` |
| PUT | Registro actualizado con código `200` |
| DELETE | Registro eliminado con código `200` |
| POST adicional | Registro adicional creado con código `201` para dejar 3 fichas finales |

## Cumplimiento De La Rúbrica

- Backend CRUD completo con estructura modular de modelo, controlador y rutas.
- Conexión a MongoDB Atlas mediante `MONGO_URI`.
- Códigos HTTP revisados para éxito, validación, no encontrado y error interno.
- Frontend integrado en `public/` sin React, Angular, Vue ni Vite.
- Bootstrap usado por CDN para diseño responsivo.
- Formulario personalizado en bloques visuales.
- JavaScript con `async/await`, `fetch`, `try/catch` y manipulación del DOM.
- README actualizado y reportes finales creados.

