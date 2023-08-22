const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CARTS_FILE_PATH = path.join(__dirname, '../carritos.json');


 // Ruta POST /api/carts/
 router.post('/', (req, res) => {
  const cart = req.body;

  // Validación de campos obligatorios
  if (!cart.id || !cart.products) {
    res.status(400).json({ error: 'Campos id y products son obligatorios' });
    return;
  }

  const cartsData = fs.readFileSync(CARTS_FILE_PATH, 'utf8');
  const carts = JSON.parse(cartsData);

  carts.push(cart);
  fs.writeFileSync(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), 'utf8');

  res.status(201).json(cart);
});

// Ruta PUT /api/carts/:cid
router.put('/:cid', (req, res) => {
  const cid = req.params.cid;
  const updates = req.body;

  const cartsData = fs.readFileSync(CARTS_FILE_PATH, 'utf8');
  const carts = JSON.parse(cartsData);

  const cartIndex = carts.findIndex(c => c.id === cid);
  if (cartIndex === -1) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
  }

  carts[cartIndex] = {
    ...carts[cartIndex],
    ...updates,
    id: cid,
  };

  fs.writeFileSync(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), 'utf8');

  res.json(carts[cartIndex]);
});

// Ruta DELETE /api/carts/:cid
router.delete('/:cid', (req, res) => {
  const cid = req.params.cid;

  const cartsData = fs.readFileSync(CARTS_FILE_PATH, 'utf8');
  const carts = JSON.parse(cartsData);

  const cartIndex = carts.findIndex(c => c.id === cid);
  if (cartIndex === -1) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
  }

  const deletedCart = carts.splice(cartIndex, 1);
  fs.writeFileSync(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), 'utf8');

  res.json(deletedCart[0]);
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  const cartsData = fs.readFileSync(CARTS_FILE_PATH, 'utf8');
  const carts = JSON.parse(cartsData);
  const cart = carts.find(c => c.id === cid);

  if (!cart) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
  }

  res.json(cart);
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity || 1;

  const cartsData = fs.readFileSync(CARTS_FILE_PATH, 'utf8');
  const carts = JSON.parse(cartsData);

  const cartIndex = carts.findIndex(c => c.id === cid);
  if (cartIndex === -1) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
  }

  const cart = carts[cartIndex];
  const existingProduct = cart.products.find(p => p.product === pid);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ product: pid, quantity });
  }

  fs.writeFileSync(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), 'utf8');

  res.json(cart);
});



module.exports = router;