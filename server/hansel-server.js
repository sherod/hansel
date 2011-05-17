var http = require('http');
var fs = require('fs');
var url = require('url');
var staticResource = require('./handler');
var hansel = require('./lib/hansel');
var mongoose = require('mongoose');

var handler = staticResource.createHandler(fs.realpathSync('../client'));
var browserMessage;




var server = http.createServer(function(request, response) {
    var path = url.parse(request.url).pathname;
    if(!handler.handle(path, request, response)) {
        
		if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
          
            browserMessage = JSON.parse(body);
       		console.log(browserMessage);

        	response.writeHead(200, {'Content-Type': 'text/javascript'});
        	response.write(JSON.stringify(hansel.handle(mongoose,browserMessage,request)));
        	response.end();     

        });
    }

//    			
    }
});
server.listen(1337);


