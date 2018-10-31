// IPv6 RegEx
var regexStringIPv6 = '(' +
    '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|' +          // 1:2:3:4:5:6:7:8
    '^([0-9a-fA-F]{1,4}:){1,7}:$|' +                         // 1::                              1:2:3:4:5:6:7::
    '^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|' +         // 1::8             1:2:3:4:5:6::8  1:2:3:4:5:6::8
    '^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|' +  // 1::7:8           1:2:3:4:5::7:8  1:2:3:4:5::8
    '^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|' +  // 1::6:7:8         1:2:3:4::6:7:8  1:2:3:4::8
    '^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|' +  // 1::5:6:7:8       1:2:3::5:6:7:8  1:2:3::8
    '^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|' +  // 1::4:5:6:7:8     1:2::4:5:6:7:8  1:2::8
    '^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|' +       // 1::3:4:5:6:7:8   1::3:4:5:6:7:8  1::8  
    '^:((:[0-9a-fA-F]{1,4}){1,7}|:)$' +                     // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8 ::8       ::     
    '^fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}$|' +     // fe80::7:8%eth0   fe80::7:8%1     (link-local IPv6 addresses with zone index)
    '^::(ffff(:0{1,4}){0,1}:){0,1}' +
    '((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}' +
    '(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$|' +          // ::255.255.255.255   ::ffff:255.255.255.255  ::ffff:0:255.255.255.255  (IPv4-mapped IPv6 addresses and IPv4-translated addresses)
    '^([0-9a-fA-F]{1,4}:){1,4}:' +
    '((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}' +
    '(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$' +           // 2001:db8:3:4::192.0.2.33  64:ff9b::192.0.2.33 (IPv4-Embedded IPv6 Address)
    ')';

// IPv4 RegEx
var regexStringIPv4 = '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';

flags = 'g';
var regexIPv6 = new RegExp(regexStringIPv6, flags);
var regexIPv4 = new RegExp(regexStringIPv4, flags);

exports.validateIP = function (ip) {
    regexIPv4.lastIndex = 0;
    regexIPv6.lastIndex = 0;
    return (regexIPv4.test(ip) || regexIPv6.test(ip));
};

exports.validateIPv4 = function (ip) {
    regexIPv4.lastIndex = 0;
    return regexIPv4.test(ip);
}

exports.validateIPv6 = function (ip) {
    regexIPv6.lastIndex = 0;
    return regexIPv6.test(ip);
}