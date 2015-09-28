var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var dns = require("dns");
var time_server_domain = "time.windows.com";
var time_diff = 60*18; 
var client_pool = [];
server.on("message", function(msg, rinfo) {
	var handler = function(err, time_server_ip, ipv){
		if(err){
			console.log(err);
			return
		}
		console.log(new Date());
		console.log(["  message from ",rinfo.address,":",rinfo.port].join(''));
		if(rinfo.address != time_server_ip){ //time sync request from client
			client_pool.push({address:rinfo.address,port:rinfo.port});
			server.send(msg, 0, msg.length, 123, time_server_ip, function(err, bytes) {
				if (err) throw err;
				console.log(new Date());
				console.log('  ask to sent to time.windows.com');
			});
		} else {
			var time_standard = msg.readUInt32BE(32);
			msg.writeUInt32BE( time_standard + time_diff, msg.length-16);
			msg.writeUInt32BE( time_standard + time_diff, msg.length-8);
			while(client_pool.length != 0){
				(function(to_ip, to_port){
                                        /* Modification de l'heure actuelle : 24 Aout 2015 à la même heure */
                                        var now = new Date();
                                        var epoch = new Date("Jan 01 1900 GMT");
                                        var origin = new Date(0);
                                        now.setDate(24);
                                        now.setMonth(7);
                                        now.setYear(2015);

                                        var ts = new Date(now.getTime()+(origin.getTime()-epoch.getTime()));

                                        ts=Math.floor(ts.getTime()/1000);
                                        msg[32] = Math.floor(ts/256/256/256);
                                        msg[33] = Math.floor(ts/256/256) - Math.floor(ts/256/256/256)*256;
                                        msg[34] = Math.floor(ts/256) - Math.floor(ts/256/256)*256;
                                        msg[35] = ts - Math.floor(ts/256)*256;
                                        msg[40] = Math.floor(ts/256/256/256);
                                        msg[41] = Math.floor(ts/256/256) - Math.floor(ts/256/256/256)*256;
                                        msg[42] = Math.floor(ts/256) - Math.floor(ts/256/256)*256;
                                        msg[43] = ts - Math.floor(ts/256)*256;

					server.send(msg, 0, msg.length, to_port, to_ip, function(err, bytes) {
						if (err) throw err;
						console.log(new Date());
						console.log('  response to ' + to_ip +':' + to_port);
					});
				})(client_pool[0].address, client_pool[0].port);
				client_pool.splice(0, 1);
			}
		}
	}
	dns.lookup(time_server_domain, 4, handler);
});

server.on("listening", function() {
	var address = server.address();
	console.log("server listening " + address.address + ":" + address.port);
});

server.bind(123);
