const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const https = require('https');
const fs = require('fs');

const WebSocket = require('ws');
const path = require('path');

require('dotenv').config();

const app = express();
const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert/cert.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert/cert.crt')),
}, app);

const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/mitca';

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASSWORD || '',
});

const corsOptions = {
  origin: (origin, callback) => {
    if (origin && origin.startsWith('https://')) {
      // Permitir solicitudes desde cualquier origen con HTTPS
      callback(null, true);
    } else if (origin && origin.startsWith('http://')) {
      // Permitir solicitudes desde cualquier origen con HTTP
      callback(null, true);
    } else {
      // Restringir otros orígenes
      callback(null, false);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importa routers
const User = require('./models/User');
const raceRouter = require('./routes/RaceRouter');
const runnerRouter = require('./routes/RunnerRouter');
const sponsorRouter = require('./routes/SponsorRouter');
const statusRouter = require('./routes/StatusRouter');
const userRouter = require('./routes/UserRouter');
const routeRouter = require('./routes/RouteRouter');
const demoRouter = require('./routes/DemoRouter');
const subscriptionRouter = require('./routes/SubscriptionRouter');
const MessageRouter = require('./routes/MessageRouter');

// Rutas
app.use('/races', raceRouter);
app.use('/runners', runnerRouter);
app.use('/sponsors', sponsorRouter);
app.use('/status', statusRouter);
app.use('/users', userRouter);
app.use('/routes', routeRouter);
app.use('/demo', demoRouter);
app.use('/subscriptions', subscriptionRouter);
app.use('/messages', MessageRouter);


// Lógica de inicialización
const db = mongoose.connection;
db.once('open', async () => {
  console.log('Conexión exitosa a MongoDB');

  // Crea el usuario admin si no existe
  const adminUser = await User.findOne({ _id: 'admin@admin.com' });

  if (!adminUser) {
    await User.create({
      _id: 'admin@admin.com',
      password: 'admin1',
      DNI: '99999999z',
      name: 'admin',
      phone: '999999999',
      role: 'admin',
    });
    console.log('Usuario admin creado correctamente.');
  }
});

// Implementa la lógica de chat en otro archivo (chatSocket.js)
require('./chatSocket')(wss);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

server.listen(PORT, () => console.log(`App is running on port: ${PORT}`));

module.exports = app;
