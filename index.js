var express = require('express');
var morgan = require('morgan');

var app = express();
/* Paramètres du serveur */
var routes = require('./routes.json');
var config = require('./config.json')
var counter = 0;


/* Définition des routes */
/* La sélection (l'accueil) CSATALD */
app.post(config.apiRoot + 'csatod/xtc/ws/content/csatald_selection', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    if (counter%2 == 0)
        {res.status(200).sendFile(config.staticRoot + 'csatald_content/csatald_selection.json');}
    if (counter%2 != 0)
        {res.status(200).sendFile(config.staticRoot + 'csatald_content/csatald_selection2.json');}
    counter++;
});
/* Explication variable `counter` :
Ici, on utilise un compteur car à chaque chargement de CANALSAT A LA DEMANDE,
pour une même route deux fichiers sont demandés. Le compteur permet donc de
fournir ces fichiers au bon moment. De plus, on utilise un modulo dans la
condition du if afin que cela fonctionne dans le casoù on recharge plusieurs
fois CANALSAT A LA DEMANDE sans interruption du serveur. */

/* Le reste */
for (var r in routes) {
    // console.log(r, "=>", routes[r])
    app.post(config.apiRoot + r, function(req, res){
        res.setHeader('Content-Type', 'application/json');
        res.status(200).sendFile(config.staticRoot + routes[r]);
    });
};


/* Configuring server ... */
app.use(morgan('dev'));
app.use(express.static(config.staticRoot));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    if( req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});



/* Starting server ... */
app.listen(80);
console.log("Listening on :80...")
