'use strict';

// import deps
var os = require('os');
var fs = require('fs');
var swig  = require('swig');

// get IP addr
var ipNuc = require('underscore')
  .chain(require('os').networkInterfaces())
  .values()
  .flatten()
  .find(function(iface) { return iface.family === 'IPv4' && iface.internal === false; })
  .value()
  .address;

// render template
var fileNTPConf = swig.renderFile('ntp.conf.tpl', {ip: ipNuc});

// write file to fs
fs.writeFile("test", fileNTPConf, function(err) {
  if(err) {return console.log(err);}
  console.log("/etc/ntp.conf saved with ip addr = "+ ipNuc);
});

// render template
var fileNTPConf = swig.renderFile('app.js', {ip: ipNuc});

// write file to fs
fs.writeFile("/home/wilfried/Documents/app.js", fileNTPConf, function(err) {
  if(err) {return console.log(err);}
  console.log("app.js saved with ip addr = "+ ipNuc);
});
