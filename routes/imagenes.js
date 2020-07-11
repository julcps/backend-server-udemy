var express = require('express');
var fs = require('fs');

var app = express();

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    // var path = `./uploads/${ tipo }/${ img }`;
    var path = `${process.cwd()}/uploads/${ tipo }/${ img }`;
    // console.log(path);

    if (fs.existsSync(path)) {
        console.log("El archivo EXISTE!  " + path);
        // console.log("El archivo EXISTE!  ");
    } else {
        path = `${process.cwd()}/assets/no-img.jpg`;
        // console.log("El archivo NO EXISTE!  " + path);
    }

    res.sendFile(path);

});

module.exports = app;