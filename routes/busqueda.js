var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ====================================
// Búsqueda específica o por colección
// ====================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regexp_ = new RegExp(busqueda, 'i'); // convertir el valor de la variable busqueda en regexp_ ... expresión regular 

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regexp_);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regexp_);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regexp_);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda sólo son: usuarios, hospitales y médicos',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }

    promesa.then(data => {

        res.status(400).json({
            ok: true,
            [tabla]: data
        });

    });

});



// =============================
// Búsqueda general
// =============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp_ = new RegExp(busqueda, 'i'); // convertir el valor de la variable busqueda en regexp_ ... expresión regular

    Promise.all([
            buscarHospitales('busqueda', regexp_),
            buscarMedicos('busqueda', regexp_),
            buscarUsuarios('busqueda', regexp_)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });

});

function buscarHospitales(busqueda, regexp_) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regexp_ })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });

    });

}

function buscarMedicos(busqueda, regexp_) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regexp_ })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre email')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar médicos', err);
                } else {
                    resolve(medicos);
                }

            });

    });

}

function buscarUsuarios(busqueda, regexp_) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regexp_ }, { 'email': regexp_ }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });

    });

}
module.exports = app;