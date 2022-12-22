const express = require('express');
const esquemaUsuarios = require("../models/Usuarios");
const esquemaEventos = require("../models/Eventos");
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
require('dotenv').config();

const router = express.Router();

const checkeoToken = (token) => {
    const verificacion = jwt.verify(token, process.env.GENERADOR_TOKEN)
    if (verificacion) return jwt_decode(token);
    else return null;
}

router.post('/', (req,res)=> {
    console.log(req.cookies)
    if (req.cookies.cookieToken !== undefined) {
        const id = checkeoToken(req.cookies.cookieToken).informacionToken.ID
        if (id === null) res.status(401).json({ message: 'Token invalido' });
        else {
            esquemaUsuarios
                .findById(id)
                .then((data) => res.json(data))
                .catch((error) => res.json({message: error}))
        }
    }
    else res.status(404).json({ message: 'Token no encontrado' });
});

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
            console.log(data)
            const informacionToken = {ID: data[0]._id}
            console.log(informacionToken)
            const token = jwt.sign({informacionToken}, process.env.GENERADOR_TOKEN);
            res.send({token: token, data: data})
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
                    })
                }
            }
        })
        .catch((error) => console.log(error));

    esquemaUsuarios
        .findById(idUsuario)
        .then((data) => {
            console.log(data)
            const asientosReservados = data.asientosReservados;
            asientosReservados.push({
                evento: tituloEvento,
                fecha: fechaEvento,
                hora: horaEvento,
                asientos: asientosUsuario
            })
            esquemaUsuarios.findOneAndUpdate({_id: idUsuario}, {asientosReservados: asientosReservados}, function(err,doc) {
                if (err) console.log(err)
            })
        })
        .catch((error) => console.log(error))

    res.json({message: 'Updated successfully'})
});

module.exports = router;