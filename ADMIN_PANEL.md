# 🛡️ Panel Administrativo - TECNOCAND

## 📍 Ubicación
- **Archivo HTML**: `admin-panel.html`
- **URL en navegador**: `http://localhost:3000/admin-panel.html`

---

## 🚀 Cómo Acceder

1. **Inicia el servidor**:
   ```bash
   node server.js
   ```
   O usa `iniciar.bat`

2. **Abre en el navegador**:
   ```
   http://localhost:3000/admin-panel.html
   ```

---

## 📊 Secciones del Panel

### 1. **Dashboard**
- Total de productos
- Total de usuarios
- Total de pedidos
- Ingresos totales

### 2. **Gestión de Productos**
- ✅ Ver todos los productos
- ✅ Crear nuevo producto
- 🔧 Editar (en desarrollo)
- ❌ Eliminar producto
- Campos: Nombre, Precio, Categoría, Imagen

### 3. **Gestión de Usuarios**
- ✅ Ver todos los usuarios
- ✅ Crear nuevo usuario
- 🔧 Editar (en desarrollo)
- ❌ Eliminar usuario
- Campos: Nombre, Email, Teléfono, Contraseña

### 4. **Gestión de Pedidos**
- ✅ Ver todos los pedidos
- 👁️ Ver detalles (en desarrollo)

---

## 🔧 Rutas API Implementadas

```
GET    /productos              → Obtener todos los productos
POST   /productos              → Crear producto
PUT    /productos/:id          → Actualizar producto
DELETE /productos/:id          → Eliminar producto

GET    /usuarios               → Obtener todos los usuarios
POST   /usuarios               → Crear usuario
PUT    /usuarios/:id           → Actualizar usuario
DELETE /usuarios/:id           → Eliminar usuario

GET    /pedidos                → Obtener todos los pedidos
POST   /pedidos                → Crear pedido
```

---

## 📁 Archivos Creados/Modificados

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `admin-panel.html` | ✨ Nuevo | Interfaz del panel admin |
| `css/admin-panel.css` | ✨ Nuevo | Estilos del panel |
| `js/admin-panel.js` | ✨ Nuevo | Lógica JavaScript |
| `server.js` | 🔄 Actualizado | Rutas CRUD agregadas |

---

## 🎨 Características

- ✅ Interfaz moderna y responsive
- ✅ Navegación entre secciones
- ✅ Modales para crear registros
- ✅ Tablas dinámicas
- ✅ CRUD completo (Create, Read, Delete, Update)
- ✅ Integración con API REST
- ✅ Diseño Bootstrap 5
- ✅ Iconos Font Awesome

---

## ⚙️ Próximas Mejoras

- [ ] Autenticación real (verificar admin)
- [ ] Edición completa de productos
- [ ] Edición completa de usuarios
- [ ] Detalles de pedidos
- [ ] Búsqueda y filtros
- [ ] Paginación
- [ ] Gráficos avanzados en dashboard

---

## 🗄️ Base de Datos Requerida

Asegúrate de que tu BD `tecnocand` tenga estas tablas:

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  password VARCHAR(100) NOT NULL
);

-- Tabla de productos
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50),
  imagen VARCHAR(255)
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  total DECIMAL(10,2),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalles de pedidos
CREATE TABLE detalle_pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  nombre VARCHAR(150),
  cantidad INT,
  precio DECIMAL(10,2),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```

---

## 🐛 Troubleshooting

**Problema**: No se cargan los datos
- **Solución**: Verifica que MySQL está corriendo y la BD existe

**Problema**: CORS error
- **Solución**: El servidor ya tiene CORS habilitado en `server.js`

**Problema**: Los modales no funcionan
- **Solución**: Asegúrate de incluir Bootstrap 5 (ya incluido)

---

## 📞 Soporte
Para más ayuda, revisa los archivos:
- `server.js` - Backend
- `js/admin-panel.js` - Frontend
- `css/admin-panel.css` - Estilos
