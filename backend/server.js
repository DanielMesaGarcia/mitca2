// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const HTTPS = require("https");
const fs = require("fs");

const http = require('http');
const WebSocket = require('ws'); // Importa el módulo ws
const path = require('path');

require('dotenv').config();

// Importa tus modelos
const User = require('./models/User'); // Asegúrate de tener la ruta correcta

// Importa routers
const raceRouter = require('./routes/RaceRouter');
const runnerRouter = require('./routes/RunnerRouter');
const sponsorRouter = require('./routes/SponsorRouter');
const statusRouter = require('./routes/StatusRouter');
const userRouter = require('./routes/UserRouter');
const routeRouter = require('./routes/RouteRouter');
const demoRouter = require('./routes/DemoRouter');
const subscriptionRouter = require('./routes/SubscriptionRouter');
const MessageRouter = require('./routes/MessageRouter');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Crea una instancia de WebSocket

const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/mitca';

// Conecta a MongoDB
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASSWORD || '',
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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



const USING_HTTPS = process.env.USING_HTTPS === "true" ? true : false;
const APP = app;

let SERVER = null;

if (USING_HTTPS) {
  const CERTS = () => {
    try {
      return {
        key: fs.readFileSync(path.join(__dirname, ".cert/cert.key")),
        cert: fs.readFileSync(path.join(__dirname, ".cert/cert.crt")),
      };
    } catch (err) {
      console.log("No certificates found: " + err);
    }
  };
  SERVER = HTTPS.createServer(CERTS(), APP);
}

(USING_HTTPS ? SERVER : APP).listen(PORT, () =>
  console.log("App is running on port: " + PORT)
);

module.exports = app;
