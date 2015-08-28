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
fs.writeFile("/etc/ntp.conf", fileNTPConf, function(err) {
  if(err) {return console.log(err);}
  console.log("/etc/ntp.conf saved with ip addr = "+ ipNuc);
});

var ipG6 = '192.168.0.16' //!!CHANGEME
var fileDNS = swig.renderFile('db.canalplus.com.tpl', {ip: ipNuc});

// write file to fs
fs.writeFile("/etc/bind/db.canalplus.com", fileDNS, function(err) {
  if(err) {return console.log(err);}
  console.log("/etc/bind/db.canalplus.com saved with ip addr = "+ ipG6);
});
