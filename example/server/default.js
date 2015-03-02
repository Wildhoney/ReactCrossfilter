(function($process) {

    "use strict";

    var express = require('express'),
        app     = express(),
        server  = require('http').createServer(app),
        request = require('request'),
        agents  = require('user-agents'),
        tidy    = require('htmltidy').tidy,
        table   = '';

    app.use(express.static(__dirname + '/..'));
    server.listen($process.env.PORT || 5000);

    /**
     * @method eplTable
     * @param {String} tableHtml
     * @return {Object}
     */
    function eplTable(tableHtml) {

        var teams = tableHtml.match(/<tr data-team-slug(?:[\s\S]+?)<\/tr>/ig),
            table = [];
        
        teams.forEach(function forEach(teamHtml) {

            teamHtml = teamHtml.replace(/[\n\r]/g, '');

            var teamName = teamHtml.match(/<td class="team-name"><a href=\'.+?\'>(.+?)<\/a><\/td>/i)[1],
                points   = teamHtml.match(/<td class="points">(\d+)<\/td>/i)[1];

            table.push({ name: teamName, points: parseInt(points) });

        });

        return table;

    }

    var options = {
        url: 'http://www.bbc.co.uk/sport/football/tables',
        headers: {
            'User-Agent': agents.random()
        }
    };

    request(options, function response(error, response, body) {

        if (!error && response.statusCode == 200) {
            table = eplTable(body);
        }

    });

    app.get('/english-premier-league.json', function(request, response) {
        response.send(JSON.stringify(table));
    });

})(process);