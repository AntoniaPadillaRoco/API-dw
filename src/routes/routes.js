const express = require('express');
const esquemaUsuarios = require("../models/Usuarios");
const esquemaEventos = require("../models/Eventos");
require('dotenv').config();

const router = express.Router();

router.post('/usuarios/registrar', (req,res) => {
    const usuario = esquemaUsuarios(req.body);
    usuario.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}))
});

router.get('/eventos', (req, res) => {
    esquemaEventos.find()
        .then((data)=>res.json(data))
        .catch((error)=>res.json({message:error}));
})

router.get('/eventos/:name', (req, res) => {
    const name = req.params.name
    esquemaEventos.find({titulo:name})
        .then((data)=>res.json(data))
        .catch((error)=>res.json({message:error}));
})

router.post('/eventos/agregar', (req, res) => {
    const evento = esquemaEventos(req.body);
    console.log(evento);
    evento.save()
        .then((data)=>res.json(data))
        .catch(error =>res.json({message: error}));
})

module.exports = router;