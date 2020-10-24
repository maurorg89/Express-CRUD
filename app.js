/* En este entregable realizarán 2 formularios que implementen los métodos HTTP: GET, POST, PUT, DELETE en Express.js. Estos formlarios corresponden a las actividades desarrolladas en las actividades 10, 11 y 12.
Deberán subir los archivos correspondientes a los formularios a algún repositorio de GitHub, GitLab, SourfeForge, etc.
En el repositorio se debe incluir el anexo resuelto de la actividad 10 y un par de impresiones de pantalla de su página desplegando los formularios en Express.js y funcionando.
El entregable es el enlace al repositorio. */
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var hbs = require('express-handlebars');
const methodOverride = require('method-override')

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('view engine', 'hbs');
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultlayout: 'index',
  layoutsDir: `${__dirname}/views/layouts/`
  /* partialsDir: __dirname + '/views/partials/' */
}));
app.use(methodOverride('_method'))

let total = []
let basedeDatos = [];

app.get('/', (req, res) => {
    res.render('main', {layout : 'index'});
});

app.get('/hogar',function(req,res) { 
    anadirentrada(req.query);
    res.redirect("/info")
});

app.post('/hogar',(req,res) => { 
    anadirentrada(req.body);
    res.redirect("/info")
});

app.get('/info',(req,res) => { 
    total = calcular();
    let hombres = total[0];
    let mujeres = total[1];
    res.render('info', {layout : 'index',hombres,mujeres});
});

app.get('/registros',(req,res) => { 
    res.render('registros', {layout : 'index',basedeDatos});
});

app.get('/registros/:id/editar', (req, res) => {
    const registro = basedeDatos.find(x => x.id === parseInt(req.params.id));
    res.render('editar', {layout : 'index', registro});
});

app.put('/registros/:id', (req, res) => {
    const indice = basedeDatos.indexOf(basedeDatos.find(x => x.id === parseInt(req.params.id))) ;
    basedeDatos[indice].platos = req.body.platos;
    basedeDatos[indice].Cocinar = req.body.Cocinar;
    basedeDatos[indice].Barrer = req.body.Barrer;
    basedeDatos[indice].Planchar = req.body.Planchar;
    basedeDatos[indice].despensa = req.body.despensa;
    basedeDatos[indice].id = parseInt(req.params.id);
    res.redirect('/registros');
});

app.delete('/registros/:id',(req,res) => {
    basedeDatos.splice(basedeDatos.indexOf(basedeDatos.find(x => x.id === parseInt(req.params.id))),1);
    res.redirect("/registros")
});

function anadirentrada(entrada){
    if(basedeDatos.length == 0){
        entrada["id"] = 1;
        basedeDatos.push(entrada);
    } else {
        entrada["id"] = basedeDatos[basedeDatos.length-1].id + 1
        basedeDatos.push(entrada);
    }
    /* console.log(basedeDatos); */
}

function calcular(){
    let hombres = [
        {
            id : "platos",
            value : 0,
            style : 0
        },
        {
            id : "Cocinar",
            value : 0,
            style : 0
        },
        {
            id : "Barrer",
            value : 0,
            style : 0
        },
        {
            id : "Planchar",
            value : 0,
            style : 0
        },
        {
            id : "despensa",
            value : 0,
            style : 0
        }
    ];
    let mujeres = [
        {
            id : "platos",
            value : 0,
            style : 0
        },
        {
            id : "Cocinar",
            value : 0,
            style : 0
        },
        {
            id : "Barrer",
            value : 0,
            style : 0
        },
        {
            id : "Planchar",
            value : 0,
            style : 0
        },
        {
            id : "despensa",
            value : 0,
            style : 0
        }
    ];
    for(let entrada of basedeDatos){
        for(let item of hombres){
            if(entrada[item.id]=="male"){
                item.value = item.value + 1 ;
            }
        }
        for(let item of mujeres){
            if(entrada[item.id]=="female"){
                item.value = item.value + 1; 
            }
        }
        for (var i = 0; i < 5; i++) {
            if(hombres[i].value>mujeres[i].value){
                hombres[i].style = "rojo";
                mujeres[i].style = "normal";
            } else if (hombres[i].value < mujeres[i].value){
                hombres[i].style = "normal";
                mujeres[i].style = "rojo";
            } else {
                hombres[i].style = "verde";
                mujeres[i].style = "verde";
            }
        }
    }
    return [hombres,mujeres];
}

app.listen(3000, function() { console.log('App listening on port 3000!');});