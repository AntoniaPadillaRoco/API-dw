const mongoose = require("mongoose");

const esquemaEventos = mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    fechas: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Eventos', esquemaEventos);