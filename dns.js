var dnsd = require('dnsd');

dnsd.createServer(function(req, res) {
  console.log("request " + JSON.stringify(req));
  res.end('10.0.1.210');
}).listen(53, '0.0.0.0');
console.log('Server running at 0.0.0.0:53');