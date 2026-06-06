# 🚀 TECNOCAND - Guía de Setup

## 📋 Requisitos
- Node.js v14+
- MySQL activo en localhost
- Variables de entorno configuradas en `.env`

## 📦 Instalación

```bash
npm install
```

## ▶️ Comandos disponibles

### Desarrollo (con recarga automática)
```bash
npm run dev
```
Usa **nodemon** para reiniciar automáticamente el servidor cuando cambias archivos.

### Producción
```bash
npm run prod
```
Configura `NODE_ENV=production` y corre el servidor.

### Inicio rápido
```bash
npm start
```
Inicia el servidor directamente.

## ⚙️ Configuración (.env)

El archivo `.env` contiene:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Angie2025
DB_NAME=tecnocand
PORT=3000
NODE_ENV=development
```

⚠️ **NO COMMITEAR .env** - Protegido en `.gitignore`

## 🌐 API Endpoints

### Productos
- `GET /productos` - Obtener todos
- `POST /productos` - Crear
- `PUT /productos/:id` - Actualizar
- `DELETE /productos/:id` - Eliminar

### Login
- `POST /login` - Autenticar usuario

### Pedidos
- `GET /pedidos` - Listar
- `POST /pedidos` - Crear

### Usuarios
- `GET /usuarios` - Listar

## 📍 URL Base
```
http://localhost:3000
```

## ✅ Status
- Backend: ✅ Funcional
- CORS: ✅ Habilitado
- BD: ✅ Conectada
- Variables de entorno: ✅ Seguras
