var Interjet = Interjet || {};

Interjet.Storage = function(){
    this._session = null;
    this._storage = null;
    this._cookies = null;

    this.version = '1.0.1';

    this.session = function(item, value){
        if(!this._session) return false;

        if(!value) {
            return JSON.parse(sessionStorage.getItem(item))
        } else {
            sessionStorage.setItem(item, JSON.stringify(value));
            return true;
        }
    }

    this.storage = function(item, value){
        if(!this._storage) return false;

        if(!value) {
            return JSON.parse(localStorage.getItem(item))
        } else {
            localStorage.setItem(item, JSON.stringify(value));
            return true;
        }
    }

    this.cookies = function() {
        var c = document.cookie, v = 0, cookies = {};
        if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
            c = RegExp.$1;
            v = 1;
        }
        if (v === 0) {
            c.split(/[,;]/).map(function(cookie) {
                var parts = cookie.split(/=/, 2),
                    name = decodeURIComponent(parts[0].trimLeft()),
                    value = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
                cookies[name] = value;
            });
        } else {
            c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function($0, $1) {
                var name = $0,
                    value = $1.charAt(0) === '"' ? $1.substr(1, -1).replace(/\\(.)/g, "$1") : $1;
                cookies[name] = value;
            });
        }
        return cookies;
    }

    this.cookie = function(key, value, o) {
        if(!this._cookies) return false;

        if(!value) {
            return this.cookies()[key];
        } else {
            var o = o || {},
                options = {
                    expires: false,
                    path: false,
                    domain: false
                };

            for(var i in o) {
                options[i] = o[i];
            }

            var cookie = key + "=" + encodeURIComponent(value) + ";";

            if (options.expires) {
                if(options.expires instanceof Date) {
                    if (isNaN(options.expires.getTime())) {
                        options.expires = new Date();
                    }
                } else {
                    options.expires = new Date(new Date().getTime() + parseInt(options.expires) * 1000 * 60 * 60 * 24);
                }

                cookie += "expires=" + options.expires.toUTCString() + ";";
            }

            if (options.path)
                cookie += "path=" + options.path + ";";
            if (options.domain)
                cookie += "domain=" + options.domain + ";";

            document.cookie = cookie;
        }
    }

    // Constructor

    // Define custom prototypes
    if (typeof String.prototype.trimLeft !== "function") {
        String.prototype.trimLeft = function() {
            return this.replace(/^\s+/, "");
        };
    }
    if (typeof String.prototype.trimRight !== "function") {
        String.prototype.trimRight = function() {
            return this.replace(/\s+$/, "");
        };
    }

    // sessionStorage support detection
    try {
        sessionStorage.setItem('__i__', '__i__');
        sessionStorage.removeItem('__i__');
        this._session = true;
    } catch(e) {
        this._session = false;
    }

    // localStorage support detection
    try {
        localStorage.setItem('__i__', '__i__');
        localStorage.removeItem('__i__');
        this._storage = true;
    } catch(e) {
        this._storage = false;
    }

    // cookies support detection
    try {
        document.cookie = 'interjet-cookie-test=1';
        this._cookies = document.cookie.indexOf('interjet-cookie-test=') != -1;
        document.cookie = 'interjet-cookie-test=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    } catch(e) {
        this._cookies = false;
    }
};