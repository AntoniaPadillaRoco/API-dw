const mongoose = require("mongoose");

const esquemaUsuarios = mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correoElectronico: {
        type: String,
        required: true
    },
    contrasena: {
        type: String,
        required: true
    },
    asientosReservados: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Usuarios', esquemaUsuarios);