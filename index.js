const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use(morgan('dev'));


// cone4xion a mongo

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('MongoDB conectado');
    app.listen(5000, () => console.log('Servidor corriendo en el puerto 5000'));
})

.catch(err => console.error(err));
