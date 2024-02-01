var express = require('express');
const Sponsor = require('../models/Sponsor');
const Runner = require('../models/Runner');
const User = require('../models/User');
const Route = require('../models/Route');
const Status = require('../models/Status');
const Race = require('../models/Race');
var demoRouter = express.Router();

demoRouter.route('/crearDemoData')
    .get(async (req, res) => {
        try {

            // Eliminar todos los datos anteriores relacionados con la demo
            await Promise.all([
                Sponsor.deleteMany({ _id: { $in: ['A12345678', 'B87654321'] } }),
                Runner.deleteMany({ _id: { $in: ['12345678A', '87654321B'] } }),
                User.deleteMany({ _id: { $in: ['user1@example.com', 'user2@example.com', 'user3@example.com'] } }),
                Route.deleteMany({ race: { $in: ['Race1', 'Race2'] } }),
                Status.deleteMany({ carrera: { $in: ['Race1', 'Race2'] } }),
                Race.deleteMany({ _id: { $in: ['Race1', 'Race2'] } }),
            ]);

            // Crea demo data para SponsorSchema
            await Sponsor.create([
                {
                    _id: 'A12345678',
                    companyName: 'Empresa 1',
                    typeCompany: 'Tipo 1',
                },
                {
                    _id: 'B87654321',
                    companyName: 'Empresa 2',
                    typeCompany: 'Tipo 2',
                },
            ]);


            // Crea demo data para RunnerSchema
            await Runner.create([
                {
                    _id: '12345678A',
                    name: 'Corredor 1',
                    phone: '111111111',
                    details: 'Detalles del corredor 1',
                },
                {
                    _id: '87654321B',
                    name: 'Corredor 2',
                    phone: '222222222',
                    details: 'Detalles del corredor 2',
                },
            ]);


            // Crea demo data para UserSchema
            await User.create([
                {
                    _id: 'user1@example.com',
                    password: 'password1',
                    DNI: '12345678A',
                    name: 'Usuario 1',
                    phone: '123456789',
                    role: 'user',
                    runners: ['12345678A', '87654321B'],
                },
                {
                    _id: 'user2@example.com',
                    password: 'password2',
                    DNI: '87654321B',
                    name: 'Usuario 2',
                    phone: '987654321',
                    role: 'sponsor',
                    sponsor: 'A12345678',
                },
                {
                    _id: 'user3@example.com',
                    password: 'password3',
                    DNI: '87654321C',
                    name: 'Usuario 3',
                    phone: '987654322',
                    role: 'sponsor',
                    sponsor: 'B87654321',
                },
            ]);

            // Crea demo data para RouteSchema
            const route1 = await Route.create({
                race: 'Race1',
                checkpoint: 1,
                startPoint: 'Inicio1',
                goal: 'Meta1',
            });

            const route2 = await Route.create({
                race: 'Race2',
                checkpoint: 1,
                startPoint: 'Inicio2',
                goal: 'Meta2',
            });

            // Crea demo data para StatusSchema
            const status1 = await Status.create({
                carrera: 'Race1',
                statusAtTheMoment: 'No empezada',
            });

            const status2 = await Status.create({
                carrera: 'Race2',
                statusAtTheMoment: 'No empezada',
            });

            // Crea demo data para RaceSchema
            await Race.create([
                {
                    _id: 'Race1',
                    eventDate: new Date(),
                    city: 'Ciudad1',
                    length: '10',
                    route: route1._id,
                    status: status1._id,
                    runners: ['12345678A'],
                    sponsors: ['A12345678'],
                    filename: 'couple.jpg'
                },
                {
                    _id: 'Race2',
                    eventDate: new Date(),
                    city: 'Ciudad2',
                    length: '15',
                    route: route2._id,
                    status: status2._id,
                    runners: ['87654321B'],
                    sponsors: ['B87654321'],
                    filename: 'couple.jpg'
                },
            ]);

            res.send('Demo data creada correctamente');
        } catch (error) {
            console.error('Error al crear demo data:', error);
            res.status(500).send('Para crear otra demo debes borrar todos los datos previos de la demo');
        }
    });

module.exports = demoRouter;