
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const PRODUCTS_FILE_PATH = path.join(__dirname, '../productos.json');

router.get('/', (req, res) => {
  const productsData = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
  const products = JSON.parse(productsData);
  res.json(products);
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  const productsData = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
  const products = JSON.parse(productsData);
  const product = products.find(p => p.id === pid);

  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  res.json(product);
});

// Ruta POST /api/products/
router.post('/', (req, res) => {
  const product = req.body;

  // Validación de campos obligatorios
  if (!product.title || !product.description || !product.code || !product.price ||
      !product.status || !product.stock || !product.category) {
    res.status(400).json({ error: 'Campos obligatorios faltantes' });
    return;
  }

  const productsData = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
  const products = JSON.parse(productsData);

  const existingProduct = products.find(p => p.code === product.code);
  if (existingProduct) {
    res.status(400).json({ error: 'Ya existe un producto con el mismo código' });
    return;
  }

  const newProduct = {
    id: generateId(),
    ...product,
    thumbnails: product.thumbnails || [],
  };

  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');

  res.status(201).json(newProduct);
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const updates = req.body;

  const productsData = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
  const products = JSON.parse(productsData);

  const productIndex = products.findIndex(p => p.id === pid);
  if (productIndex === -1) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  products[productIndex] = {
    ...products[productIndex],
    ...updates,
    id: pid,
  };

  fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');

  res.json(products[productIndex]);
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;

  const productsData = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
  const products = JSON.parse(productsData);

  const productIndex = products.findIndex(p => p.id === pid);
  if (productIndex === -1) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  const deletedProduct = products.splice(productIndex, 1);
  fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');

  res.json(deletedProduct[0]);
});

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = router;