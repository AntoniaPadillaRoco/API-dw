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

router.post('/usuarios/inicioSesion', (req, res) => {
    const {correoElectronico, contrasena} = req.body;

    esquemaUsuarios.find({correoElectronico: correoElectronico, contrasena: contrasena})
        .then((data) => {
            //const informacionToken = {ID: data[0]._id}
            //const token = jwt.sign({aux}, process.env.TOKEN_SECRET);
            res.send({/*token: token, */data: data})
        })
        .catch((error) => res.json({message: error}));
});

router.get('/usuarios/:id', (req,res) => {
    const {id} = req.params;
    esquemaUsuarios
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}))
});

router.get('/eventos', (req, res) => {
    esquemaEventos.find()
        .then((data)=>res.json(data))
        .catch((error)=>res.json({message:error}));
});

router.get('/eventos/:name', (req, res) => {
    const name = req.params.name
    esquemaEventos.find({titulo:name})
        .then((data)=>res.json(data))
        .catch((error)=>res.json({message:error}));
});

router.post('/eventos/agregar', (req, res) => {
    const evento = esquemaEventos(req.body);
    console.log(evento);
    evento.save()
        .then((data)=>res.json(data))
        .catch(error =>res.json({message: error}));
})

router.put('/reservas', (req, res) => {
    const {idUsuario, asientosUsuario, tituloEvento, fechaEvento, horaEvento, asientosEvento} = req.body
    let response1, response2, error1, error2;

    esquemaEventos.find({titulo: tituloEvento})
        .then((data) => {
            const fechas = data[0].fechas;
            for (let i = 0; i < fechas.length; i++) {
                if (fechas[i].fecha === fechaEvento && fechas[i].hora === horaEvento) {
                    fechas[i] = {
                        fecha: fechaEvento,
                        hora: horaEvento,
                        asientos: asientosEvento
                    }
                    esquemaEventos.findOneAndUpdate({titulo: tituloEvento}, {fechas: fechas}, function(err,doc) {
                        if (err) console.log(err)
                        else response1 = doc;
                        console.log(doc)
                    })
                }
            }
        })
        .catch((error) => error1 = error);

    esquemaUsuarios
        .findById(idUsuario)
        .then((data) => {
            const asientosReservados = data[0].asientosReservados;
            asientosReservados.push({
                evento: tituloEvento,
                fecha: fechaEvento,
                hora: horaEvento,
                asientos: asientosUsuario
            })
            esquemaUsuarios.findOneAndUpdate({_id: idUsuario}, {asientosReservados: asientosReservados}, function(err,doc) {
                if (err) console.log(err)
                else response2 = doc;
                console.log(doc)
            })
        })
        .catch((error) => error2 = error)

    if (response1 !== undefined && response2 !== undefined) res.json({responseEventos: response1, responseUsuarios: response2, message: 'Reservation successful'})
    else if (error1 !== undefined) res.status(500).json({message: error1})
    else if (error2 !== undefined) res.status(500).json({message: error2})
});

module.exports = router;