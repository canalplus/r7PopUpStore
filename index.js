'use scrict';

var express = require('express');
var morgan = require('morgan');
var fs = require('fs');

var app = express();
var compteur = 0;
var port = 80;
var staticDir = '/var/www/html/public';
var std169    = '/mycanal/img/STD169/JPG/200X112/';
var gen169    = '/mycanal/img/GEN169/JPG/200X112/';
var mea       = '/mycanal/img/MEASOIR/JPG/474X209/';

var stdList = fs.readdirSync(staticDir+std169);
var genList = fs.readdirSync(staticDir+gen169);
var meaList = fs.readdirSync(staticDir+mea);

app.use(morgan('dev'));
app.use(function (req, res, next) {
//console.log("REQUEST HEADERS :" + JSON.stringify(req.headers));
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

/*---------------------*/
/* MYCANAL PICS        */
/*---------------------*/
app.get(std169+':picture', function(req, res){
    var rndIndex = Math.floor(Math.random() * stdList.length);
    res.setHeader('Content-Type', 'image/jpeg');
    res.status(200).sendFile(staticDir+std169+stdList[rndIndex]);
});

app.get(gen169+':picture', function(req, res){
    var rndIndex = Math.floor(Math.random() * genList.length);
    res.setHeader('Content-Type', 'application/image/jpeg');
    res.status(200).sendFile(staticDir+gen169+genList[rndIndex]);
});

app.get(mea+':picture', function(req, res){
    var rndIndex = Math.floor(Math.random() * meaList.length);
    res.setHeader('Content-Type', 'application/image/jpeg');
    res.status(200).sendFile(staticDir+mea+meaList[rndIndex]);
});

/*---------------------*/
/* CANAL+ A LA DEMANDE */
/*---------------------*/

/* La sélection (l'accueil) */
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_selection', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg1.json');
});

app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg2.json');
});


/* Les différents onglets */
//CINEMA
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_cinema', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_cinema.json');
});

//SERIE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_serie', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_serie.json');
});

//A L'HEURE US
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_alheureus', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_alheureus.json');
});

//VACANCES D'ETE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_vacancesete', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_vacancesete.json');
});

//EMISSIONS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_emissions', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_emissions.json');
});

//SPORT
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_sport', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_sport.json');
});

//FAMILY
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_family', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_family.json');
});

//DOCUMENTAIRE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_documentaire', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_documentaire.json');
});

//TELEFILMS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_telefilms', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_telefilms.json');
});

//ADULTE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/cplusald_them_adulte', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/c+ald_content/atg_adulte.json');
});

//CONTENT
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/:prodId', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/GNCPF/vod/cplusod/ctx/json/g5r7t/cplusod/xtc/ws/content/'+req.params.prodId+'.json');
});



/*-----------------------*/
/* CANALSAT A LA DEMANDE */
/*-----------------------*/


/* La sélection (l'accueil) */
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_selection', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    if (compteur%2 == 0)
        {
        res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_selection.json');
        }
    if (compteur%2 != 0)
        {
        res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_selection2.json');
        }
    compteur++;
    //console.log(compteur);
});
/* Explication variable compteur :
ici, on utilise un compteur car à chaque chargement de CANALSAT A LA DEMANDE, pour une même route deux fichiers sont demandés;
Le compteur permet donc de fournir ces fichiers au bon moment. De plus, on utilise un modulo dans la condition du if afin que cela 
fonctionne dans le cas on recharge plusieurs fois CANALSAT A LA DEMANDE sans interruption du serveur. */


/* Eureka */
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/perso', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_eureka_perso.json');
});


/* Thématiques */

    /* CINEMA */
//SELECTION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_selection', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_selection.json');
});  

//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_tous.json');
});

//ACTION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_action', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_action.json');
});

//COMEDIE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_comedie', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_comedie.json');
});

//EMOTION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_emotion', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_emotion.json');
})

//POLICIER
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_policier', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_policier.json');
});

//FANTASTIQUE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_fantastique', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_fantastique.json');
});

//JEUNESSE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_jeunesse', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_jeunesse.json');
});

//SUSPENSE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_suspens', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_suspens.json');
});

//DOCS-MAGS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_cinephile', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_cinephile.json');
});

//COURT METRAGE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_cinema_courtmtrage', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_cinema_courtmtrage.json');
});


    /* SERIES */
//SELECTION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_serie_selection', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_serie_selection.json');
});

//TOUTES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_serie_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_serie_tous.json');
});

//ACTION-AVENTURE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_serie_action', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_serie_action.json');
});

//HUMOUR
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_serie_humour', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_serie_humour.json');
});

//DRAME
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_serie_drame', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_serie_drame.json');
});

//POLICIER
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_serie_policier', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_serie_policier.json');
});

//FANTASTIQUE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_serie_fantastique', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_serie_fantastique.json');
});

//SAISON INTEGRALE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_serie_integrale', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_serie_integrale.json');
});


    /* JEUNESSE */
//SELECTION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_jeunesse_selection', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_jeunesse_selection.json');
});

//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_jeunesse_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_jeunesse_tous.json');
});

//TOUT-PETITS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_jeunesse_toutpetits', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_jeunesse_toutpetits.json');
});

//KIDS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_jeunesse_kids', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_jeunesse_kids.json');
});

//ADOS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_jeunesse_ado', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_jeunesse_ado.json');
});


    /* TELEFILMS */
//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_telefilms_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_telefilms_tous.json');
});

//ACTION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_telefilms_action', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_telefilms_action.json');
});

//COMEDIE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_telefilms_comedie', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_telefilms_comedie.json');
});

//EMOTION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_telefilms_emotion', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_telefilms_emotion.json');
});

//POLICIER
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_telefilms_policier', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_telefilms_policier.json');
});

//FANTASTIQUE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_telefilms_fantastique', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_telefilms_fantastique.json');
});

//JEUNESSE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_telefilms_jeunesse', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_telefilms_jeunesse.json');
});

//SUSPENSE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_telefilms_suspens', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_telefilms_suspens.json');
});


    /* DECOUVERTE */
//SELECTION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_decouverte_selection', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_decouverte_selection.json');
});

//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_decouverte_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_decouverte_tous.json');
});

//ANIMAUX ET NATURE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_decouverte_animauxnature', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_decouverte_animauxnature.json');
});

//CULTURE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_decouverte_culture', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_decouverte_culture.json');
});

//EVASION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_decouverte_evasion', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_decouverte_evasion.json');
});

//HISTOIRE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_decouverte_histoire', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_decouverte_histoire.json');
});

//SCIENCES ET TECHNIQUES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_decouverte_sciencetechnique', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_decouverte_sciencetechnique.json');
});

//SOCIETE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_decouverte_societe', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_decouverte_societe.json');
});


    /* DIVERTISSEMENT */
//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_tous.json');
});

//HUMOUR
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_humour', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_humour.json');
});

//LOISIRS ET CULTURE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_loisirsetculture', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_loisirsetculture.json');
});

//JEU
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_jeu', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_jeu.json');
});

//CUISINE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_cuisine', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_cuisine.json');
});

//SPECTACLE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_spectacle', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_spectacle.json');
});

//TALKSHOW
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_talkshow', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_talkshow.json');
});

//TELEREALITE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_telerealite', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_telerealite.json');
});

//VARIETES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_variete', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_variete.json');
});

//AUTRES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_divertissement_autre', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_divertissement_autre.json');
});


    /* SPORT */
//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_tous.json');
});

//ATHLETISME
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_athletisme', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_athletisme.json');
});

//COMBAT
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_combat', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_combat.json');
});

//CYCLISME
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_cyclisme', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_cyclisme.json');
});

//EQUITATION
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_equitation', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_equitation.json');
});

//FOOTBALL
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_football', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_football.json');
});

//HAND
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_hand', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_hand.json');
});

//RUGBY
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_rugby', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_rugby.json');
});

//TENNIS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_tennis', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_tennis.json');
});

//DOCS-MAGS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_docsport', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_docsport.json');
});

//AUTRES SPORTS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_sport_autresport', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_sport_autresport.json');
});


    /* MUSIQUE */
//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_musique_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_musique_tous.json');
});

//CONCERTS ET SPECTACLES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_musique_concerts', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_musique_concerts.json');
});

//CLIPS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_musique_clips', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_musique_clips.json');
});

//MAGAZINES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_musique_magmusical', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_musique_magmusical.json');
});


    /* CAMPUS */
//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_tous.json');
});

//6EME
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_6eme', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_6eme.json');
});

//5EME
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_5eme', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_5eme.json');
});

//4EME
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_4eme', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_4eme.json');
});

//3EME
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_3eme', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_3eme.json');
});

//2NDE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_2nde', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_2nde.json');
});

//1ERE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_1ere', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_1ere.json');
});

//TERMINALE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_terminale', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_terminale.json');
});

//BACCALAUREAT
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_bac_contenus', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_bac_contenus.json');
});

//BREVET
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_brevet_contenus', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_brevet_contenus.json');
});

//ANGLAIS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_langues_vivantes', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_langues_vivantes.json');
});

//PARTENAIRES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_campus_partenaires', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_campus_partenaires.json');
});


    /* TOUT PUBLIC */
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_toutpublic', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_toutpublic.json');
});

    /* ACTU */
//TOUS
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_info_tous', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_info_tous.json');
});

//JOURNAL
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_info_infoJT', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_info_infoJT.json');
});

//MAGAZINES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_info_magazines', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_info_magazines.json');
});

//POLITIQUE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_them_info_politique', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_them_info_politique.json');
});


/* Chaînes */
//TOUTES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_chaines_toutes', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_chaines_toutes.json');
});

//GENERALISTES
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_chaines_generalistes', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_chaines_generalistes.json');
});

//CINEMA
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_chaines_cinema', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_chaines_cinema.json');
});

//SERIES ET DIVERTISSEMENT
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_chaines_divertsissement_series', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_chaines_divertsissement_series.json');
});

//DECOUVERTE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_chaines_decouverte', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_chaines_decouverte.json');
});

//SPORT
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_chaines_sport', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_chaines_sport.json');
});

//JEUNESSE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_chaines_jeunesse', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_chaines_jeunesse.json');
});

//MUSIQUE
app.post('/GNCPF/vod/cplusod/ctx/json/g5r7t/csatod/xtc/ws/content/csatald_chaines_musique', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.status(200).sendFile('/var/www/html/public/csatald_content/csatald_chaines_musique.json');
});


app.use(express.static(staticDir));

console.log("Listen incoming requests on port %s", port);
app.listen(port);
