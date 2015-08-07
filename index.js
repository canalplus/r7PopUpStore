var express = require('express');
var morgan = require('morgan');


var app = express();


app.use(morgan('dev'));
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


app.get('/r7/prodv2/dedr7/', function(req, res){
    res.status(200).sendFile('/r7/prodv2/dedr7/index.html', {root: '/var/www/html/public'});
});
         

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_selection', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg1.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg2.json');
});


app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_cinema', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_cinema.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_serie', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_serie.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_alheureus', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_alheureus.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_vacancesete', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_vacancesete.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_emissions', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_emissions.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_sport', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_sport.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_family', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_family.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_documentaire', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_documentaire.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_telefilms', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_telefilms.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_adulte', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_adulte.json');
});


app.use(express.static('/var/www/html/public'));
app.listen(80);