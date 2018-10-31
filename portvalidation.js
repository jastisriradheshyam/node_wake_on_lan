var fs = require("fs");

function readPortFile() {
    try {
        var buffer = fs.readFileSync("./.port", { encoding: "UTF8" });
        var portObject = JSON.parse(buffer);
        function isNumber(value) {
            return !isNaN(value);
        }
        if (isNaN(portObject.maxPort)) { throw new Error("maxPort is not a number"); };
        if (isNaN(portObject.minPort)) { throw new Error("minPort is not a number"); };
        if (!Array.isArray(portObject.validPort) && !portObject.validPort.every(isNumber)) { throw new Error("validPort may not be array or array of numbers"); };
        if (!Array.isArray(portObject.invalidPort) && !portObject.invalidPort.every(isNumber)) { throw new Error("invalidPort may not be array or array of numbers"); };
        if (portObject.minPort > portObject.maxPort) { throw new Error("minPort is larger than maxPort"); };
        return portObject;
    } catch (error) {
        console.log("Port validation file is not correct -> ", error);
        process.exit(1);
    }
};

var portValidationObject = readPortFile();

exports.validatePort = function (port) {
    if (port < 0 && port > 65535) return false;
    if (portValidationObject.invalidPort.find((element) => { return element == port })) return false;
    if (portValidationObject.validPort.find((element) => { return element == port })) return true;
    if (port >= portValidationObject.minPort && port <= portValidationObject.maxPort) return true;
    return false;
};