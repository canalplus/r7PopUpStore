'use strict';

// import deps
var os    = require('os');
var fs    = require('fs');
var swig  = require('swig');

// get IP addr
var ipNuc = require('underscore')
  .chain(require('os').networkInterfaces())
  .values()
  .flatten()
  .find(function(iface) { return iface.family === 'IPv4' && iface.internal === false; })
  .value()
  .address;

fs.readdir('bind', function(err, items) {
    for (var i=0; i<items.length; i++) {
        if( 'named.conf.local' !== items[i] ) {
            console.log('[ip.js] installing ' + items[i]);
            // render template
            var bindConf = swig.renderFile('./bind/'+items[i], {ip: ipNuc});
            // write file to fs
            fs.writeFile("/etc/bind/"+items[i], bindConf, function(err) {
              if(err) {return console.log(err);}
              console.log('[ip.js] bind db installed');
            });
        }
    }
});

