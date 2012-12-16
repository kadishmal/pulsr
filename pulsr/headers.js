/*
 headers.js
 A module to read request header and return requested values.
 */
define(function() {
    var osList = ['Linux', 'Mac OS X', 'Windows'];

    return {
        getOS: function (userAgent) {
            if (userAgent && userAgent.length) {
                for (var i = osList.length - 1; i > -1; --i) {
                    if (userAgent.indexOf(osList[i]) > -1) {
                        return osList[i];
                    }
                }
            }

            return null;
        },
        getOSArch: function (userAgent) {
            // On Windows and Linux platforms
            if (/(WOW64|x86_64)/.test(userAgent)) {
                return 'x64';
            }
//            else if (/86/.test(userAgent)) {
//                return 'x86';
//            }

            // Mac OS X browsers don't display architecture info.
            // Perhaps because they are mostly 64 bit.
            // So if this is Mac OS X, return 64 bit
            if (this.getOS(userAgent) == 'Mac OS X') {
                return 'x64';
            }

            return null;
        }
    };
});