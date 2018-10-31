var http = require('http')
    , wakeonlan = require('./wake_on_lan')
    , url = require("url")
    , ip = require('./ipvalidation')
    , pv = require('./portvalidation');

// Handle POST requests
var POSTHandle = function (req, data, callback) {
    try {
        let reqParameters = JSON.parse(data);
        WOLHandle(reqParameters, callback);
    } catch (error) {
        callback("Wrong JSON Input ", error);
    }
};

// Handle GET requests
var GETHandle = function (req, callback) {
    try {
        let urlParameters = url.parse(req.url, true);
        WOLHandle(urlParameters.query, callback);
    } catch (error) {
        callback("Wrong query format ", error);
    }
};

// Handling WOL requests
var WOLHandle = function (reqParameters, callback) {

    let MACregExp = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/i
        , macAddress = "";

    // Validating MAC address
    if (MACregExp.test(reqParameters.macAddress)) {
        macAddress = reqParameters.macAddress;
    } else {
        return callback("Error : Send valid MAC address");
    }

    let options = {};
    (reqParameters.address) && ip.validateIP(reqParameters.address) && (options.address = reqParameters.address);
    (!isNaN(reqParameters.num_packets)) && (+reqParameters.num_packets > 0) && (options.num_packets = +reqParameters.num_packets);
    (!isNaN(reqParameters.port)) && pv.validatePort(+reqParameters.port) && (options.port = +reqParameters.port);
    (!isNaN(reqParameters.interval)) && (+reqParameters.interval > 0) && (options.interval = +reqParameters.interval);

    wakeonlan.wake(macAddress, options, function (error) {
        let response;
        if (error) {
            console.log("Wake on LAN Error :  " + error);
            response = error;
        } else {
            console.log('Done sending WoL packets');
            response = "Done sending WoL packets";
        }
        response += "\nWith valid options : \n" + JSON.stringify(options);
        return callback(response);
    });

};

// Server setup
var server = http.createServer(function (req, res) {
    let POSTbuffer = "";
    let response = "";

    if (req.method == "POST") { // Check for POST request
        req.on('data', function (data) {
            POSTbuffer += data;
        });

        req.on('end', function () {
            POSTHandle(req, POSTbuffer, function (response) {
                res.write(response);
                res.end();
            });
        });
    } else if (req.method == "GET") { // Check for GET request
        GETHandle(req, function (response) {
            res.write(response);
            res.end();
        });
    } else {
        response = "Not a POST or GET request";
        res.write(response);
        res.end();
    }

});

// Setting the port
var port = process.env.PORT || 3939;

// Start the server
server.listen(port, function () {
    console.log('Server is running on port ' + port);
});