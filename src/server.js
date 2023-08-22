const express = require('express');
const productsRouter = require('./routes/products.js');
const cartsRouter = require('./routes/carts.js');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);


app.listen(8080, () => {
  console.log(`Servidor escuchando en el puerto 8080`);
});

