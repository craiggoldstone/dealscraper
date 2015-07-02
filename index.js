"use strict";
var Hapi = require('hapi');
var https = require('https');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {

        var options = {
            host: 'groups.freecycle.org',
            path: '/group/HavantFreecycle/posts/offer'
        };

        https.request(options, function(response) {
            var str = '';
            response.on('data', function(chunk) {
                str += chunk;
            });
            response.on('end', function() {
                var matches = str.match(/<table(.|\n)*<\/table/)[0].match(/posts\/[0-9]+\/[^']*/g);
                console.log(matches ? matches[0] : 'none');

                //reply(matches ? matches[0] : 'none');
            })

        }).end();


    }
});

// Start the server
server.start();


var groupName = 'HavantFreecycle';
var options = {
    host: 'groups.freecycle.org',
    path: '/group/' + groupName + '/posts/offer'
};


var getPostDetails = function getPostDetails(id) {
    https.request(options, function(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });
        response.on('end', function() {
            console.log('got details for post...' + id + ' - ' + str.length);
        });
    });
};

https.request(options, function(response) {
    var str = '';
    response.on('data', function(chunk) {
        str += chunk;
    });
    response.on('end', function() {
        var matches = str.match(/<table(.|\n)*<\/table/)[0].match(/posts\/[0-9]+\/[^']*/g);

        var URLs = matches.filter(function(value, index, self){
            return self.indexOf(value) === index;
        });

        var IDs = URLs.map(function(e) {
            var matches = e.match(/[0-9]+/);
            return (matches ? matches[0] : undefined);
        });
        var titles = URLs.map(function(e) {
            return decodeURIComponent(e.replace(/posts\/[0-9]+\//, ''));
        });


        

        console.log(URLs ? URLs : 'none');
        

        //reply(matches ? matches[0] : 'none');
    })

}).end();