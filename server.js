require('dotenv').config();
const express = require('express');
const mySql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// RUTAS PROTEGIDAS (ANTES DE express.static)
// ============================================

// Login Admin - Credenciales hardcodeadas por seguridad
app.post('/admin/login', (req, res) => {
  const { nombre, password } = req.body;
  
  // Credenciales admin (en producción usar BD)
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
  
  if (nombre === ADMIN_USER && password === ADMIN_PASS) {
    const token = Math.random().toString(36).substr(2, 9);
    res.json({ 
      ok: true, 
      token: token,
      user: nombre,
      mensaje: 'Login exitoso'
    });
  } else {
    res.status(401).json({ 
      ok: false, 
      mensaje: 'Usuario o contraseña incorrectos' 
    });
  }
});

// ============================================
// ARCHIVOS ESTÁTICOS
// ============================================
app.use(express.static(__dirname));

const db = mySql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



db.connect((err) => {
  if (err) {
    console.error('Error conectando a MYSQL:', err);
    return;
    }
    console.log('Conectado a MYSQL ');
});

app.get('/productos', (req, res) => {
    const sql = 'SELECT id, nombre, precio, categoria, imagen FROM productos';
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al obtener productos' });
      res.json(result);
    });
  });
  
app.post('/login', (req, res) => {
    const { nombre, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE nombre = ? AND password = ?';
    db.query(sql, [nombre, password], (err, result) => {
      if (err) return res.status(500).json({ ok: false, mensaje: 'Error al servidor' });
      if (result.length > 0) {
        res.json({ ok: true });
      } else {
         res.json({ ok: false, mensaje: 'Usuario o contraseña incorrectos' });
      }
    });
});

// Login Admin - Credenciales hardcodeadas por seguridad
// NOTA: Ruta movida al inicio del archivo ANTES de express.static
// No eliminar, solo comentada la duplicada

app.post('/pedidos', (req, res) => {
  const { usuario_id, total, productos } = req.body;

  const sqlPedido = 'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)';
  db.query(sqlPedido, [usuario_id, total], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear pedido' });

    const pedido_id = result.insertId;

    const detalles = productos.map(p => [pedido_id, p.id, p.nombre, p.cantidad, p.precio]);
    const sqlDetalle = 'INSERT INTO detalle_pedidos (pedido_id, producto_id, nombre, cantidad, precio) VALUES ?';

    db.query(sqlDetalle, [detalles], (err2) => {
      if (err2) return res.status(500).json({ error: 'Error al guardar detalle' });
      res.json({ ok: true, pedido_id });
    });
  });
});
// CRUD productos
app.post('/productos', (req, res) => {
  const { nombre, precio, categoria, imagen } = req.body;
  db.query('INSERT INTO productos (nombre, precio, categoria, imagen) VALUES (?, ?, ?, ?)',
    [nombre, precio, categoria, imagen], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true, id: result.insertId });
    });
});

app.put('/productos/:id', (req, res) => {
  const { nombre, precio, categoria, imagen } = req.body;
  db.query('UPDATE productos SET nombre = ?, precio = ?, categoria = ?, imagen = ? WHERE id = ?',
    [nombre, precio, categoria, imagen, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    });
});

app.delete('/productos/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

app.get('/pedidos', (req, res) => {
  db.query('SELECT * FROM pedidos ORDER BY fecha DESC', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/usuarios', (req, res) => {
  db.query('SELECT id, nombre, email, telefono FROM usuarios', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post('/usuarios', (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  db.query('INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)',
    [nombre, email, telefono, password], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true, id: result.insertId });
    });
});

app.put('/usuarios/:id', (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  db.query('UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, password = ? WHERE id = ?',
    [nombre, email, telefono, password, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    });
});

app.delete('/usuarios/:id', (req, res) => {
  db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
});
