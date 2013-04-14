
// class basic
var Class = function (methods) {
    var klass = function () {
        this.initialize.apply(this, arguments);
    };
    for (var property in methods) {
        klass.prototype[property] = methods[property];
    }
    if (!klass.prototype.initialize)
        klass.prototype.initialize = function () {
        };
    return klass;
};

/*
 *
var universe = function(){
  var bang = "Big"; //private variable

  // defined private functions here

  return{  //return the singleton object
    everything : true,

    // public functions here (closures accessing private functions and private variables)
    getBang : function(){ return bang; }
  };
}();
alert(universe.everything); // true
alert(universe.getBang()); //true
alert(universe.bang); //Undefined property ! Cause private ;)

var TestClass = Class({
  initialize: function(name) {
    this.name = name;
  },
  toString: function() {
    return "My name is "+this.name;
  },
  log: function() {
    if(window.console) {
      console.log("My name is ", this.name);
    }
  }
});

var testClass = new TestClass();
testClass.initialize("testClass");
testClass.log();

*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/*!
 * A crc32 function that will produce the same result as PHP's crc32() function
 * (http://php.net/crc32).
 * 
 * The string used in PHP must be encoded in UTF-8 or the checksums will be
 * different. Use the following PHP to get the unsigned integer result:
 * 
 *     sprintf('%u', crc32($string));
 * 
 * Copyright 2010, Will Bond <will@wbond.net>
 * Released under the MIT license
 */
(function() {
	var table = [
    	0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F,
		0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988,
		0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2,
		0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
		0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9,
		0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172,
		0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C,
		0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59,
		0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423,
		0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
		0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106,
		0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
		0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D,
		0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E,
		0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950,
		0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65,
		0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7,
		0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0,
		0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA,
		0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
		0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81,
		0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A,
		0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84,
		0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1,
		0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB,
		0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC,
		0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E,
		0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B,
		0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55,
		0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
		0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28,
		0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D,
		0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F,
		0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38,
		0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242,
		0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777,
		0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69,
		0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2,
		0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC,
		0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
		0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693,
		0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94,
		0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D
	];

    crc32 = function(string) {
    	// This converts a unicode string to UTF-8 bytes
    	string = unescape(encodeURI(string));
    	var crc = 0 ^ (-1);
        var len = string.length;
        for (var i=0; i < len; i++) {
        	crc = (crc >>> 8) ^ table[
            	(crc ^ string.charCodeAt(i)) & 0xFF
            ];
        }
        crc = crc ^ (-1);
        // Turns the signed integer into an unsigned integer
        if (crc < 0) {
        	crc += 4294967296;
        }
        return crc;
    };
})();

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

/**
* jQuery.query - Query String Modification and Creation for jQuery
* Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
* Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
* Date: 2009/02/08
*
* @author Blair Mitchelmore
* @version 2.1.3
*
**/
new function(settings) {
    // Various Settings
    var $separator = settings.separator || '&';
    var $spaces = settings.spaces === false ? false : true;
    var $suffix = settings.suffix === false ? '' : '[]';
    var $prefix = settings.prefix === false ? false : true;
    var $hash = $prefix ? settings.hash === true ? "#" : "?" : "";
    var $numbers = settings.numbers === false ? false : true;

    jQuery.query = new function() {
        var is = function(o, t) {
            return o != undefined && o !== null && (!!t ? o.constructor == t : true);
        };
        var parse = function(path) {
            var m, rx = /\[([^[]*)\]/g, match = /^(\S+?)(\[\S*\])?$/.exec(path), base = match[1], tokens = [];
            while (m = rx.exec(match[2])) tokens.push(m[1]);
            return [base, tokens];
        };
        var set = function(target, tokens, value) {
            var o, token = tokens.shift();
            if (typeof target != 'object') target = null;
            if (token === "") {
                if (!target) target = [];
                if (is(target, Array)) {
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                } else if (is(target, Object)) {
                    var i = 0;
                    while (target[i++] != null);
                    target[--i] = tokens.length == 0 ? value : set(target[i], tokens.slice(0), value);
                } else {
                    target = [];
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                }
            } else if (token && token.match(/^\s*[0-9]+\s*$/)) {
                var index = parseInt(token, 10);
                if (!target) target = [];
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else if (token) {
                var index = token.replace(/^\s*|\s*$/g, "");
                if (!target) target = {};
                if (is(target, Array)) {
                    var temp = {};
                    for (var i = 0; i < target.length; ++i) {
                        temp[i] = target[i];
                    }
                    target = temp;
                }
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else {
                return value;
            }
            return target;
        };

        var queryObject = function(a) {
            var self = this;
            self.keys = {};

            if (a.queryObject) {
                jQuery.each(a.get(), function(key, val) {
                    self.SET(key, val);
                });
            } else {
                jQuery.each(arguments, function() {
                    var q = "" + this;
                    q = decodeURIComponent(q);
                    q = q.replace(/^[?#]/, ''); // remove any leading ? || #
                    q = q.replace(/[;&]$/, ''); // remove any trailing & || ;
                    if ($spaces) q = q.replace(/[+]/g, ' '); // replace +'s with spaces

                    jQuery.each(q.split(/[&;]/), function() {
                        var key = this.split('=')[0];
                        var val = this.split('=')[1];

                        if (!key) return;

                        if ($numbers) {
                            if (/^[+-]?[0-9]+\.[0-9]*$/.test(val)) // simple float regex
                                val = parseFloat(val);
                            else if (/^[+-]?[0-9]+$/.test(val)) // simple int regex
                                val = parseInt(val, 10);
                        }

                        val = (!val && val !== 0) ? true : val;

                        if (val !== false && val !== true && typeof val != 'number')
                            val = val;

                        self.SET(key, val);
                    });
                });
            }
            return self;
        };

        queryObject.prototype = {
            queryObject: true,
            has: function(key, type) {
                var value = this.get(key);
                return is(value, type);
            },
            GET: function(key) {
                if (!is(key)) return this.keys;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                while (target != null && tokens.length != 0) {
                    target = target[tokens.shift()];
                }
                return typeof target == 'number' ? target : target || "";
            },
            get: function(key) {
                var target = this.GET(key);
                if (is(target, Object))
                    return jQuery.extend(true, {}, target);
                else if (is(target, Array))
                    return target.slice(0);
                return target;
            },
            SET: function(key, val) {
                var value = !is(val) ? null : val;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                this.keys[base] = set(target, tokens.slice(0), value);
                return this;
            },
            set: function(key, val) {
                return this.copy().SET(key, val);
            },
            REMOVE: function(key) {
                return this.SET(key, null).COMPACT();
            },
            remove: function(key) {
                return this.copy().REMOVE(key);
            },
            EMPTY: function() {
                var self = this;
                jQuery.each(self.keys, function(key, value) {
                    delete self.keys[key];
                });
                return self;
            },
            load: function(url) {
                var hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
                var search = url.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
                return new queryObject(url.length == search.length ? '' : search, url.length == hash.length ? '' : hash);
            },
            empty: function() {
                return this.copy().EMPTY();
            },
            copy: function() {
                return new queryObject(this);
            },
            COMPACT: function() {
                function build(orig) {
                    var obj = typeof orig == "object" ? is(orig, Array) ? [] : {} : orig;
                    if (typeof orig == 'object') {
                        function add(o, key, value) {
                            if (is(o, Array))
                                o.push(value);
                            else
                                o[key] = value;
                        }
                        jQuery.each(orig, function(key, value) {
                            if (!is(value)) return true;
                            add(obj, key, build(value));
                        });
                    }
                    return obj;
                }
                this.keys = build(this.keys);
                return this;
            },
            compact: function() {
                return this.copy().COMPACT();
            },
            toString: function() {
                var i = 0, queryString = [], chunks = [], self = this;
                var addFields = function(arr, key, value) {
                    if (!is(value) || value === false) return;
                    var o = [encodeURIComponent(key)];
                    if (value !== true) {
                        o.push("=");
                        o.push(encodeURIComponent(value));
                    }
                    arr.push(o.join(""));
                };
                var build = function(obj, base) {
                    var newKey = function(key) {
                        return !base || base == "" ? [key].join("") : [base, "[", key, "]"].join("");
                    };
                    jQuery.each(obj, function(key, value) {
                        if (typeof value == 'object')
                            build(value, newKey(key));
                        else
                            addFields(chunks, newKey(key), value);
                    });
                };

                build(this.keys);

                if (chunks.length > 0) queryString.push($hash);
                queryString.push(chunks.join($separator));

                return queryString.join("");
            }
        };

        return new queryObject(location.search, location.hash);
    };
} (jQuery.query || {}); // Pass in jQuery.query as settings object

var Url = {
 
	// public method for url encoding
	encode : function (string) {
		return escape(this._utf8_encode(string));
	},
 
	// public method for url decoding
	decode : function (string) {
		return this._utf8_decode(unescape(string));
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

// LIBS
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

}

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)
  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e)
  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s)
{
  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var remainders = Array();
  var i, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */
  while(dividend.length > 0)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[remainders.length] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  /* Append leading zero equivalents */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)))
  for(i = output.length; i < full_length; i++)
    output = encoding[0] + output;

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

// UUID

/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * 
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

  Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
  // by minimizing calls to random()
  Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

  // A more compact, but less performant, RFC4122v4 solution:
  Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
  };
})();

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (root, factory) {
  if (typeof exports === "object" && exports) {
    module.exports = factory; // CommonJS
  } else if (typeof define === "function" && define.amd) {
    define(factory); // AMD
  } else {
    root.Mustache = factory; // <script>
  }
}(this, (function () {

  var exports = {};

  exports.name = "mustache.js";
  exports.version = "0.7.2";
  exports.tags = ["{{", "}}"];

  exports.Scanner = Scanner;
  exports.Context = Context;
  exports.Writer = Writer;

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var nonSpaceRe = /\S/;
  var eqRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  var _test = RegExp.prototype.test;
  var _toString = Object.prototype.toString;

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  function testRe(re, string) {
    return _test.call(re, string);
  }

  function isWhitespace(string) {
    return !testRe(nonSpaceRe, string);
  }

  var isArray = Array.isArray || function (obj) {
    return _toString.call(obj) === '[object Array]';
  };

  function escapeRe(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  exports.escape = escapeHtml;

  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (match && match.index === 0) {
      this.tail = this.tail.substring(match[0].length);
      this.pos += match[0].length;
      return match[0];
    }

    return "";
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var match, pos = this.tail.search(re);

    switch (pos) {
    case -1:
      match = this.tail;
      this.pos += this.tail.length;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, pos);
      this.tail = this.tail.substring(pos);
      this.pos += pos;
    }

    return match;
  };

  function Context(view, parent) {
    this.view = view;
    this.parent = parent;
    this._cache = {};
  }

  Context.make = function (view) {
    return (view instanceof Context) ? view : new Context(view);
  };

  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  Context.prototype.lookup = function (name) {
    var value = this._cache[name];

    if (!value) {
      if (name == '.') {
        value = this.view;
      } else {
        var context = this;

        while (context) {
          if (name.indexOf('.') > 0) {
            value = context.view;
            var names = name.split('.'), i = 0;
            while (value && i < names.length) {
              value = value[names[i++]];
            }
          } else {
            value = context.view[name];
          }

          if (value != null) break;

          context = context.parent;
        }
      }

      this._cache[name] = value;
    }

    if (typeof value === 'function') value = value.call(this.view);

    return value;
  };

  function Writer() {
    this.clearCache();
  }

  Writer.prototype.clearCache = function () {
    this._cache = {};
    this._partialCache = {};
  };

  Writer.prototype.compile = function (template, tags) {
    var fn = this._cache[template];

    if (!fn) {
      var tokens = exports.parse(template, tags);
      fn = this._cache[template] = this.compileTokens(tokens, template);
    }

    return fn;
  };

  Writer.prototype.compilePartial = function (name, template, tags) {
    var fn = this.compile(template, tags);
    this._partialCache[name] = fn;
    return fn;
  };

  Writer.prototype.getPartial = function (name) {
    if (!(name in this._partialCache) && this._loadPartial) {
      this.compilePartial(name, this._loadPartial(name));
    }

    return this._partialCache[name];
  };

  Writer.prototype.compileTokens = function (tokens, template) {
    var self = this;
    return function (view, partials) {
      if (partials) {
        if (typeof partials === 'function') {
          self._loadPartial = partials;
        } else {
          for (var name in partials) {
            self.compilePartial(name, partials[name]);
          }
        }
      }

      return renderTokens(tokens, self, Context.make(view), template);
    };
  };

  Writer.prototype.render = function (template, view, partials) {
    return this.compile(template)(view, partials);
  };

  /**
   * Low-level function that renders the given `tokens` using the given `writer`
   * and `context`. The `template` string is only needed for templates that use
   * higher-order sections to extract the portion of the original template that
   * was contained in that section.
   */
  function renderTokens(tokens, writer, context, template) {
    var buffer = '';

    var token, tokenValue, value;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      tokenValue = token[1];

      switch (token[0]) {
      case '#':
        value = context.lookup(tokenValue);

        if (typeof value === 'object') {
          if (isArray(value)) {
            for (var j = 0, jlen = value.length; j < jlen; ++j) {
              buffer += renderTokens(token[4], writer, context.push(value[j]), template);
            }
          } else if (value) {
            buffer += renderTokens(token[4], writer, context.push(value), template);
          }
        } else if (typeof value === 'function') {
          var text = template == null ? null : template.slice(token[3], token[5]);
          value = value.call(context.view, text, function (template) {
            return writer.render(template, context);
          });
          if (value != null) buffer += value;
        } else if (value) {
          buffer += renderTokens(token[4], writer, context, template);
        }

        break;
      case '^':
        value = context.lookup(tokenValue);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || (isArray(value) && value.length === 0)) {
          buffer += renderTokens(token[4], writer, context, template);
        }

        break;
      case '>':
        value = writer.getPartial(tokenValue);
        if (typeof value === 'function') buffer += value(context);
        break;
      case '&':
        value = context.lookup(tokenValue);
        if (value != null) buffer += value;
        break;
      case 'name':
        value = context.lookup(tokenValue);
        if (value != null) buffer += exports.escape(value);
        break;
      case 'text':
        buffer += tokenValue;
        break;
      }
    }

    return buffer;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var tree = [];
    var collector = tree;
    var sections = [];

    var token;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      switch (token[0]) {
      case '#':
      case '^':
        sections.push(token);
        collector.push(token);
        collector = token[4] = [];
        break;
      case '/':
        var section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : tree;
        break;
      default:
        collector.push(token);
      }
    }

    return tree;
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          lastToken = token;
          squashedTokens.push(token);
        }
      }
    }

    return squashedTokens;
  }

  function escapeTags(tags) {
    return [
      new RegExp(escapeRe(tags[0]) + "\\s*"),
      new RegExp("\\s*" + escapeRe(tags[1]))
    ];
  }

  /**
   * Breaks up the given `template` string into a tree of token objects. If
   * `tags` is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. ["<%", "%>"]). Of
   * course, the default is to use mustaches (i.e. Mustache.tags).
   */
  exports.parse = function (template, tags) {
    template = template || '';
    tags = tags || exports.tags;

    if (typeof tags === 'string') tags = tags.split(spaceRe);
    if (tags.length !== 2) throw new Error('Invalid tags: ' + tags.join(', '));

    var tagRes = escapeTags(tags);
    var scanner = new Scanner(template);

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) {
          delete tokens[spaces.pop()];
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var start, type, value, chr, token;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(tagRes[0]);
      if (value) {
        for (var i = 0, len = value.length; i < len; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push(['text', chr, start, start + 1]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr == '\n') stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(tagRes[0])) break;
      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(eqRe);
        scanner.scan(eqRe);
        scanner.scanUntil(tagRes[1]);
      } else if (type === '{') {
        value = scanner.scanUntil(new RegExp('\\s*' + escapeRe('}' + tags[1])));
        scanner.scan(curlyRe);
        scanner.scanUntil(tagRes[1]);
        type = '&';
      } else {
        value = scanner.scanUntil(tagRes[1]);
      }

      // Match the closing tag.
      if (!scanner.scan(tagRes[1])) throw new Error('Unclosed tag at ' + scanner.pos);

      token = [type, value, start, scanner.pos];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        if (sections.length === 0) throw new Error('Unopened section "' + value + '" at ' + start);
        var openSection = sections.pop();
        if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        tags = value.split(spaceRe);
        if (tags.length !== 2) throw new Error('Invalid tags at ' + start + ': ' + tags.join(', '));
        tagRes = escapeTags(tags);
      }
    }

    // Make sure there are no open sections when we're done.
    var openSection = sections.pop();
    if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    tokens = squashTokens(tokens);

    return nestTokens(tokens);
  };

  // All Mustache.* functions use this writer.
  var _writer = new Writer();

  /**
   * Clears all cached templates and partials in the default writer.
   */
  exports.clearCache = function () {
    return _writer.clearCache();
  };

  /**
   * Compiles the given `template` to a reusable function using the default
   * writer.
   */
  exports.compile = function (template, tags) {
    return _writer.compile(template, tags);
  };

  /**
   * Compiles the partial with the given `name` and `template` to a reusable
   * function using the default writer.
   */
  exports.compilePartial = function (name, template, tags) {
    return _writer.compilePartial(name, template, tags);
  };

  /**
   * Compiles the given array of tokens (the output of a parse) to a reusable
   * function using the default writer.
   */
  exports.compileTokens = function (tokens, template) {
    return _writer.compileTokens(tokens, template);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  exports.render = function (template, view, partials) {
    return _writer.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  exports.to_html = function (template, view, partials, send) {
    var result = exports.render(template, view, partials);

    if (typeof send === "function") {
      send(result);
    } else {
      return result;
    }
  };

  return exports;

}())));

/**
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/

/**
* Create a cookie with the given name and value and other optional parameters.
*
* @example $.cookie('the_cookie', 'the_value');
* @desc Set the value of a cookie.
* @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
* @desc Create a cookie with all available options.
* @example $.cookie('the_cookie', 'the_value');
* @desc Create a session cookie.
* @example $.cookie('the_cookie', null);
* @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
*       used when the cookie was set.
*
* @param String name The name of the cookie.
* @param String value The value of the cookie.
* @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
* @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
*                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
*                             If set to null or omitted, the cookie will be a session cookie and will not be retained
*                             when the the browser exits.
* @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
* @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
* @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
*                        require a secure protocol (like HTTPS).
* @type undefined
*
* @name $.cookie
* @cat Plugins/Cookie
* @author Klaus Hartl/klaus.hartl@stilbuero.de
*/

/**
* Get the value of a cookie with the given name.
*
* @example $.cookie('the_cookie');
* @desc Get the value of a cookie.
*
* @param String name The name of the cookie.
* @return The value of the cookie.
* @type String
*
* @name $.cookie
* @cat Plugins/Cookie
* @author Klaus Hartl/klaus.hartl@stilbuero.de
*/
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // NOTE Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


// SERVICE API

var serviceApi = null;

var ServiceAPI = Class({
    Instance: function () { return this; },
    services: null,
    controllers: null,
    profile: null,
    tracker: null,
    Profile: Class({
        geo: null,
        uuid: null,
        localAttributeCodes: {
            serviceApiAtts: "serviceApiAtts",
            geoLat: "geoLat",
            geoLong: "geoLong",
            colorBackgroundHighlight: "colorBackgroundHighlight",
            colorHighlight: "colorHighlight"
        },
        localAttributes: null, //{},
        getLocation: function () {
            /*
            if (!this.hasAttribute(this.localAttributeCodes.geoLat)
                || !this.hasAttribute(this.localAttributeCodes.geoLong)) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function (position) {
                            // Did we get the position correctly?
                            // alert (position.coords.latitude);
                            // To see everything available in the position.coords array:
                            // for (key in position.coords) {alert(key)}
                            //mapServiceProvider(position.coords.latitude,position.coords.longitude);
                            this.geo = position;
                            ServiceAPI.Instance.profile.setGeoLat(position.coords.latitude);
                            ServiceAPI.Instance.profile.setGeoLong(position.coords.longitude);
                        },
                        // next function is the error callback
                        function (error) {
                            switch (error.code) {
                                case error.TIMEOUT:
                                    ServiceAPI.Instance.util.log('Timeout');
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    ServiceAPI.Instance.util.log('Position unavailable');
                                    break;
                                case error.PERMISSION_DENIED:
                                    ServiceAPI.Instance.util.log('Permission denied');
                                    break;
                                case error.UNKNOWN_ERROR:
                                    ServiceAPI.Instance.util.log('Unknown error');
                                    break;
                            }
                        }
                    );
                } else {
                    // no loc
                }
            }
            */
        },
        initAttributes: function () {
            if (this.localAttributes == null) {
                this.localAttributes = JSON.parse($.cookie(this.localAttributeCodes.serviceApiAtts));
            }
            if (this.localAttributes == null) {
                this.localAttributes = {};
            }
        }
        ,
        hasAttribute: function (att) {
            this.initAttributes();
            if (this.localAttributes != null) {
                if (this.localAttributes[att] != null) {
                    if (!ServiceAPI.Instance.util.isNullOrEmptyString(att)) {
                        return true;
                    }
                }
            }
            return false;
        },
        getAttribute: function (att) {
            // get local attributes
            // get server attributes
            var attValue = null;
            this.initAttributes();
            if (this.hasAttribute(att)) {
                attValue = this.localAttributes[att];
            }
            return attValue;
        },
        setAttribute: function (att, val) {
            // set local cookies if client side needed
            // set on server.
            this.initAttributes();
            this.localAttributes[att] = val;
            $.cookie(this.localAttributeCodes.serviceApiAtts, JSON.stringify(this.localAttributes), { expires: 7, path: '/' });
        },

        setCustomColorHighlight: function (val) {
            this.setAttribute(this.localAttributeCodes.colorHighlight, val);
        },
        getCustomColorHighlight: function () {
            return this.getAttribute(this.localAttributeCodes.colorHighlight);
        },
        setCustomColorBackgroundHighlight: function (val) {
            this.setAttribute(this.localAttributeCodes.colorBackgroundHighlight, val);
        },
        getCustomColorBackgroundHighlight: function () {
            return this.getAttribute(this.localAttributeCodes.colorBackgroundHighlight);
        },

        setGeoLat: function (val) {
            this.setAttribute(this.localAttributeCodes.geoLat, val);
        },
        getGeoLat: function () {
            return this.getAttribute(this.localAttributeCodes.geoLat);
        },
        setGeoLong: function (val) {
            this.setAttribute(this.localAttributeCodes.geoLong, val);
        },
        getGeoLong: function () {
            return this.getAttribute(this.localAttributeCodes.geoLong);
        },

        loginFacebook: function () {
            /*
            FB.login(function (response) {
                if (response.authResponse) {
                    //console.log('Welcome!  Fetching your information.... ');
                    FB.api('/me', function (response) {
                        var name = response.name;
                        if (name) {
                            var namearr = name.split(' ');
                            var namefirst = namearr[0];
                            var namelast = "";
                            if (namearr.length > 1) {
                                namelast = namearr[1];
                            }

                            $("#name-first").html(namefirst);
                            $("#name-last").html(namelast);
                        }

                        //console.log('Good to see you, ' + response.name + '.');
                    });
                } else {
                    //console.log('User cancelled login or did not fully authorize.');
                }
            }, { scope: 'email,user_likes' });
        */
        }
    }),
    Tracker: Class({
        setAccount: function(account_id) {
	    try {
		if (ga) {
		    ga('create', account_id);  // Creates a tracker.
		}
	    }
	    catch(e) {
	    }
	    try {
		if (!ServiceAPI.Instance.util.isNullOrEmpty(_gaq)) {
		    _gaq.push(['_setAccount', account_id]);
		}
	    }
	    catch(e) {
	    }
        },  
        trackPageView: function(opt_url) {
	    try {
		if (ga) {
		    ga('send', 'pageview');
		}
	    }
	    catch(e) {
	    }
	    try {	    
		if (!ServiceAPI.Instance.util.isNullOrEmpty(_gaq)) {
		    _gaq.push(['_trackPageview', opt_url]);
		}
	    }
	    catch(e) {
	    }
        },        
        trackEvent: function(category, action, opt_label, opt_value) {
	    
	    try {
		if (ga) {
		    if (ServiceAPI.Instance.util.isNullOrEmptyString(opt_label)) {
			opt_label = 'default';
		    }
		    if (ServiceAPI.Instance.util.isNullOrEmptyString(opt_value)) {
			opt_value = 1;
		    }
		    ga('send', 'event', category, action, opt_label, opt_value);  // value is a number.
		    ServiceAPI.Instance.util.log('trackEvent:ga:',
						 ' category:' + category + 
						 ' action:' + action + 
						 ' opt_label:' + opt_label + 
						 ' opt_value:' + opt_value);
		}	
	    }
	    catch(e) {
	    }
	    try {
		if (!ServiceAPI.Instance.util.isNullOrEmpty(_gaq)) {
		    //_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
		    _gaq.push(['_trackEvent', category, action, opt_label, opt_value]);
		     ServiceAPI.Instance.util.log('trackEvent:gaq:',
						 ' category:' + category + 
						 ' action:' + action + 
						 ' opt_label:' + opt_label + 
						 ' opt_value:' + opt_value);
		}	
	    }
	    catch(e) {
	    }
        },
	trackEventCRM: function(action, label, val) {
	    ServiceAPI.Instance.tracker.trackEvent(
		"crm-number-campaign:" + action, action+":"+label, label, 1);	
	}
    }),
    Utility: Class({
        log: function (key, val) {
            if (window.console) {
                console.log(key, val);
            }
        },
        renderWrapTagStyles: function (tag, content, styles) {
            return '<' + tag + ' class="' + styles + '">' + content + '</' + tag + '>';
        },
        renderWrapTagStylesId: function (tag, content, styles, id) {
            return '<' + tag + ' id="' + id + '" class="' + styles + '">' + content + '</' + tag + '>';
        },
        renderWrapTag: function (tag, content) {
            return '<' + tag + '>' + content + '</' + tag + '>';
        },
        formatDatePrettyString: function (dt) {
            return moment(dt, 'YYYY-MM-DDTHH:mm:ss.SSS Z').fromNow();
        },
        isNullOrEmptyString: function (obj) {
            if (obj == null
                    || obj == ""
                    || obj == 'undefined') {
                return true;
            }
            return false;
        },
        isNullOrEmpty: function (obj) {
            if ((obj == null
                    || obj == ""
                    || obj == 'undefined')
                && obj != false) {
                return true;
            }
            return false;
        },
        stripToAlphanumerics: function (str) {
            str = str.replace(/[^\w\s]|/g, "");
            //.replace(/\s+/g, " ");
            return str;
        },
        toLower: function (str) {
            return str.toLowerCase();
        },
        filterToUrlFormat: function (str) {
            str = this.strip_to_alphanumerics(str);
            str = this.to_lower(str);
            str = str.replace("_", "-");
            str = str.replace(" ", "-");
            return str;
        },
        getObjectValue: function (obj, key) {
            if (!this.isNullOrEmpty(obj)) {
                if (!isNullOrEmpty(obj[key])) {
                    return obj[key];
                }
            }
            return "";
        },
        fillObjectValue: function (strtofill, obj, key, param) {
            if (!this.isNullOrEmpty(obj[key])) {
                if (key != "div")
                    strtofill += param + obj[key];
            }
            return strtofill;
        },
        getUrlParamValue: function (href, key) {
            var value = "";
            if (href.indexOf(key + "/") > -1) {
                var params = href.split("/");
                for (var i = 0; i < params.length; i++) {
                    if (params[i] == key) {
                        if (params[i + 1] != null) {
                            value = params[i + 1];
                        }
                    }
                }
            }
            return value;
        },
        changeUrlToState: function (href, param, paramvalue) {
            var _returnurl = "";
            if (href.indexOf(param) > -1) {
                // hash contains param, just update
                var _params = href.split(this.param_value_separator);
                for (var i = 0; i < _params.length; i++) {
                    if (_params[i] == param) {
                        _params[i + 1] = paramvalue;
                    }
                }
                _returnurl = _params.join(this.param_value_separator);
            } else {
                // has not present, append it
                if (href.indexOf(param + this.param_value_separator) == -1) {
                    if (href.lastIndexOf(this.param_value_separator) == href.length - 1)
                        href = href.substr(0, href.length - 1);
                    _returnurl = href + this.param_value_separator + param + this.param_value_separator + paramvalue;
                }
            }
            return _returnurl;
        },
        endsWithSlash: function (str) {
            return str.match(/\/$/);
        },
        isAbsoluteUrl: function (check) {
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            return this.regexMatch(check, expression);
        },
        regexMatch: function (check, expression) {
            var regex = new RegExp(expression);
            var t = check;
            if (t.match(regex)) {
                return true;
            }
            else {
                return false;
            }
        },
        baseEncode: function (str, radix) {
            return (str).toString(radix);
        },        
        baseDecode: function (str, radix) {
            return parseInt(str, radix);
        },
        base36Encode: function (str) {
            return this.baseEncode(str, 36);
        },
        base36Decode: function (str) {
            return this.baseEncode(str, 36);
        },
        base64Encode: function (str) {
            return this.baseEncode(str, 64);
        },
        shortCode: function (str) {	    
            return this.base36Encode(crc32(b64_sha1(str)+'='));
        },
        loadContent: function (div, url) {
            if ($(div) != null) {
                $(div).load(url, function () {
		
                    ServiceAPI.Instance.log('Content Loaded: ' + div + ' url:' + url);
                });
            }
        }
    }),
    Controllers: Class({
        uiController: null,
        apiController: null,
        UIController: Class({
            screenHeight: null,
            screenWidth: null,
            fpsLabel: null,
            offscreenLeft: -3500, // left css
            offscreenRight: -3500, // right css
            offscreenTop: -3500,
            offscreenBottom: 50000,

            profileBackground: "light",
            profilColor: "red",
            currentPanel: "",
            currentEffect: 'wave-top-left',
            currentViewData: {
                section: 'map',
                elevation: 'country',
                tileData: [],
                title: 'Select a Region',
                description: 'Select a Region',
                code: 'us',
                displayCode: 'US'
            },

            customBrandedBackgroundItems: [
                "#tile-settings",
                "#tile-overlay-info",
                ".panel-results-tile",
                "#panel-info-header",
                "#tile-search",
                "#tile-brand",
                "#tile-logo"
            ],
            customBrandedItems: [
                "#title-section"
            ],
            customColorBackgroundClasses: [
                "color-background-brand-red",
                "color-background-brand-pink",
                "color-background-brand-lightblue",
                "color-background-brand-darkblue",
                "color-background-brand-teal"
            ],
            customColorClasses: [
                "color-brand-red",
                "color-brand-pink",
                "color-brand-lightblue",
                "color-brand-darkblue",
                "color-brand-teal"
            ],
            initialize: function () {
                //this.initDev();
                //this.loadContentStart();
            },
            setContext: function (title, indicatorCode) {
                $('#title-section').text(title);
                $('#tile-indicator').text(indicatorCode);
            },
            togglePanel: function (div) {
                if ($(div).hasClass('closed-right')) {
                    hidePanel(div);
                }
                else {
                    showPanel(div);
                }
            },
            showPanel: function (div) {
                if ($(div).hasClass('closed-right')) {
                    $(div).removeClass('closed-right');
                }
            },
            hidePanel: function (div) {
                
                if (!$(div).hasClass('closed-right')) {
                    $(div).addClass('closed-right');
                }
            },
            presentPanel: function (name) {
                this.hidePanel("#panel-login");
                this.hidePanel("#panel-login");

                if (name != "settings")
                    this.hidePanel("#panel-settings");
                if (name != "login")
                    this.hidePanel("#panel-login");
                if (name != "info")
                    this.hidePanel("#panel-info");
                if (name != "results")
                    this.hidePanel("#panel-results");
                if (name != "filters")
                    this.hidePanel("#panel-filters");

                if (this.currentPanel == name) {
                    this.hidePanel("#panel-" + name);
                    this.currentPanel = "";
                    return;
                }

                ServiceAPI.Instance.log("presentPanel", "#panel-" + name);

                this.showPanel("#panel-" + name);
                this.currentPanel = name;
            },
            toggleSettings: function () {
                this.togglePanel("#panel-settings");
            },
            toggleResults: function () {
                this.togglePanel("#panel-results");
            },
            toggleInfo: function () {
                this.togglePanel("#panel-info");
            },
            toggleFilters: function () {
                this.togglePanel("#panel-filters");
            },
            showSettings: function () {
                this.showPanel("#panel-settings");
            },
            showResults: function () {
                this.showPanel("#panel-results");
            },
            showInfo: function () {
                this.showPanel("#panel-info");
            },
            showFilters: function () {
                this.showPanel("#panel-filters");
            },
            hideSettings: function () {
                this.hidePanel("#panel-settings");
            },
            hideResults: function () {
                this.hidePanel("#panel-results");
            },
            hideInfo: function () {
                this.hidePanel("#panel-info");
            },
            hideFilters: function () {
                this.hidePanel("#panel-filters");
            },
            adjustCurrentLayoutToScreen: function () {
                this.screenHeight = $(window).height();
                this.screenWidth = $(window).width();
            },
            applyClass: function (div, klass) {
                if (!$(div).hasClass(klass)) {
                    $(div).addClass(klass);
                }
            },
            removeClass: function (div, klass) {
                if ($(div).hasClass(klass)) {
                    $(div).removeClass(klass);
                }
            },
            changeCSS: function (myclass, element, value) {
                var CSSRules = null;
                if (document.getElementById) {
                    CSSRules = 'cssRules'
                }
                if (CSSRules) {
                    for (var i = 0; i < document.styleSheets[0][CSSRules].length; i++) {
                        if (document.styleSheets[0][CSSRules][i].selectorText == myclass) {
                            document.styleSheets[0][CSSRules][i].style[element] = value
                        }
                    }
                }
            },
            toggleLoginContainer: function () {
                if ($("#login-container .card").hasClass('flip')) {
                    $("#login-container .card").removeClass('flip');
                } else {
                    $("#login-container .card").addClass('flip');
                }
            },

            initColors: function () {
                // find all colored divs and apply colors
                ServiceAPI.Instance.log("initColors", "");

                this.applyClass("html", "color-background-light");
                this.applyClass("body", "color-background-light");

                //applyClass("#tile-settings", "color-background-highlight");
                this.applyClass("#tile-settings", "color-light");
                
                //applyClass("#tile-search", "color-background-highlight");
                this.applyClass("#tile-search", "color-light");

                //applyClass("#tile-brand", "color-background-highlight");
                this.applyClass("#tile-brand", "color-highlight");

                //applyClass("#tile-section h1", "color-highlight");

                //applyClass("#tile-logo", "color-background-highlight");

                this.applyClass("#tile-indicator", "color-background-black");
                this.applyClass("#tile-indicator", "color-light");

                this.applyClass(".panel-background", "color-background-dark");
                this.applyClass(".panel-background", "opacity90");


                this.applyClass(".panel-background-overlay", "color-background-light");
                this.applyClass(".panel-background-overlay", "opacity90");
                //opacity90

                this.profileColor = ServiceAPI.Instance.profile.getCustomColorHighlight();
                this.profileBackground = ServiceAPI.Instance.profile.getCustomColorBackgroundHighlight();

                if (this.profileColor == null) {
                    this.profileColor = "red";
                }

                if (this.profileBackground == null) {
                    this.profileBackground = "light";
                }

                this.changeBackground(this.profileBackground);
                this.changeHighlight(this.profileColor);
            },

            initDev: function () {
                // add a text object to output the current FPS:
                //this.fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#555");
                //this.fpsLabel.x = 10;
                //this.fpsLabel.y = 20;
            },

            initCustomElements: function () {
                // Handle user customize
                /*
                this.initColors();

                $('#button-accent-red').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("red");
                });

                $('#button-accent-pink').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("pink");
                });

                $('#button-accent-lightblue').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("lightblue");
                });

                $('#button-accent-darkblue').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("darkblue");
                });

                $('#button-accent-teal').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("teal");
                });

                $('#button-background-dark').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeBackground("dark");
                });

                $('#button-background-light').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeBackground("light");
                });
                */
            },

            changeSection: function (url, title, description, code, section, elevation, displayCode, tileData) {
                this.currentViewData.url = url;
                this.currentViewData.title = title;
                this.currentViewData.description = description;
                this.currentViewData.code = code;
                this.currentViewData.section = section;
                this.currentViewData.elevation = elevation;
                this.currentViewData.tileData = tileData;
                this.currentViewData.displayCode = displayCode;

                this.pushHistoryState(this.currentViewData, title, url);

                this.loadHistoryState(this.currentViewData);
            },
            loadHistoryState: function (viewData) {
                if (viewData != null) {
                    this.setContext(viewData.title, viewData.displayCode.toUpperCase());
                    ServiceAPI.Instance.controllers.templateController.currentMapLevel = viewData.elevation;
                    ServiceAPI.Instance.controllers.templateController.currentMapCode = viewData.code;
                }
                else {
                    ServiceAPI.Instance.log("viewData was null");
                }


                ServiceAPI.Instance.controllers.canvasController.drawMap();

                // loadContent(location.pathname);
            },
            pushHistoryState: function (data, title, url) {
                // HISTORY.PUSHSTATE
                if (Modernizr.history) {
                    // pushState is supported!
                    history.pushState(data, title, url);
                }
            },
            initHistoryState: function () {
                // $('a').click(function (e) {
                //    //$("#loading").show();
                //    href = $(this).attr("href");
                //loadContent(href);
                //    pushHistoryState(currentViewData, href, href);
                //window.history.pushState(data, "Title", "/new-url");
                //    e.preventDefault();
                //});

                window.onpopstate = function (event) {
                    ////S////////erviceAPI.Instance.controllers.uiController.loadHistoryState(event.state);

                    ///$("#loading").show();
                    ServiceAPI.Instance.log("pathname: " + location.pathname);
                };
            },
            initPlacement: function () {
                //var panelLogin = $("#panel-login");
                // TweenLite.from(panelLogin, 3, { css: { rotationY: .5 }, ease: Power3.easeOut });
                //TweenLite.to(panelLogin, 0, { css: { left: this.offscreenLeft }, ease: Power3.easeIn });
                //TweenLite.to(panelLogin, 2, { css: { left: 0, opacity: 1.0 }, ease: Power3.linear, delay: 0 });
                //TweenLite.to(panelLogin, 1, { css: { rotationY: 180 }, ease: Power3.linear, delay: 2 });

                //var tileLoader = $("#tile-loader");
                //TweenLite.to(tileLoader, 1, { css: { opacity: 0.0 }, ease: Power3.linear, delay: 2 });
                //TweenLite.to(tileLoader, 0, { css: { left: -5500 }, ease: Power3.easeIn, delay: 5 });

                //var holderAppTopLeftContainer = $("#holder-app-top-left-container");
                //TweenLite.to(holderAppTopLeftContainer, 0, { css: { left: -1000 }, ease: Power3.easeIn });
                //TweenLite.to(holderAppTopLeftContainer, 1, { css: { left: 0 }, ease: Power3.easeIn, delay: 3 });

                ///var holderAppTopRightContainer = $("#holder-app-top-right-container");
                //TweenLite.to(holderAppTopRightContainer, 0, { css: { right: -1000 }, ease: Power3.easeIn });
                //TweenLite.to(holderAppTopRightContainer, 1, { css: { right: 0 }, ease: Power3.easeIn, delay: 3 });
                //TweenLite.to(holderAppTopRightContainer, 1, { css: { right: 0 }, ease: Power3.easeIn, delay: 4, onComplete: this.toggleLoginContainer });

                //TweenLite.to(panelLogin, 1, { css: { scaleX: 1.5, scaleY: 1.5 }, ease: Power3.easeIn, delay: 6});

                //setTimeout(toggleLoginContainer, 9000);
            },

            changeBackground: function (profileTo) {
                ServiceAPI.Instance.log("changing highlight to:" + profileTo);
                ServiceAPI.Instance.profile.setCustomColorBackgroundHighlight(profileTo);
                this.profileBackground = profileTo;

                if (profileTo == "light") {
                    // do white

                    // remove

                    this.removeClass("html", "color-background-highlight");
                    this.removeClass("body", "color-background-highlight");

                    this.removeClass("#tile-indicator", "color-background-light");
                    this.removeClass("#tile-indicator", "color-dark");


                    this.removeClass("#panel-results-header", "color-background-light");
                    this.removeClass("#panel-results-header", "color-dark");

                    // apply

                    this.applyClass("html", "color-background-light");
                    this.applyClass("body", "color-background-light");

                    // indicator

                    this.applyClass("#tile-indicator", "color-background-black");
                    this.applyClass("#tile-indicator", "color-light");


                    this.applyClass("#panel-results-header", "color-background-black");
                    this.applyClass("#panel-results-header", "color-light");
                }
                else {
                    // do dark

                    // remove

                    this.removeClass("html", "color-background-light");
                    this.removeClass("body", "color-background-light");

                    this.removeClass("#tile-indicator", "color-background-black");
                    this.removeClass("#tile-indicator", "color-light");


                    this.removeClass("#panel-results-header", "color-background-black");
                    this.removeClass("#panel-results-header", "color-light");


                    // apply

                    this.applyClass("html", "color-background-dark");
                    this.applyClass("body", "color-background-dark");

                    // indicator

                    this.applyClass("#tile-indicator", "color-background-light");
                    this.applyClass("#tile-indicator", "color-dark");

                    this.applyClass("#panel-results-header", "color-background-light");
                    this.applyClass("#panel-results-header", "color-dark");
                }

                //ServiceAPI.Instance.controllers.canvasController.drawMap();
            },
            removeCurrentBackgroundHighlights: function () {
                for (var i = 0; i < this.customBrandedBackgroundItems.length; i++) {
                    ServiceAPI.Instance.log("customBrandedBackgroundItems:", this.customBrandedBackgroundItems[i]);
                    for (var j = 0; j < this.customColorBackgroundClasses.length; j++) {
                        ServiceAPI.Instance.log("customColorBackgroundClasses:", this.customColorBackgroundClasses[j]);
                        this.removeClass(this.customBrandedBackgroundItems[i], this.customColorBackgroundClasses[j]);
                    }
                }
            },

            removeCurrentColorHighlights: function () {
                for (var i = 0; i < this.customBrandedItems.length; i++) {
                    ServiceAPI.Instance.log("customBrandedItems:", this.customBrandedItems[i]);
                    for (var j = 0; j < this.customColorClasses.length; j++) {
                        ServiceAPI.Instance.log("customColorClasses:", this.customColorClasses[j]);
                        this.removeClass(this.customBrandedItems[i], this.customColorClasses[j]);
                    }
                }
            },
            applyBackgroundHighlights: function (colorTo) {
                for (var i = 0; i < this.customBrandedBackgroundItems.length; i++) {
                    var colorToClass = "color-background-brand-" + colorTo;
                    ServiceAPI.Instance.log("colorToClass:", colorToClass);
                    ServiceAPI.Instance.log("customBrandedBackgroundItems[i]:", this.customBrandedBackgroundItems[i]);
                    this.applyClass(this.customBrandedBackgroundItems[i], colorToClass);
                }
            },
            applyColorHighlights: function (colorTo) {
                for (var i = 0; i < this.customBrandedItems.length; i++) {
                    var colorToClass = "color-brand-" + colorTo;
                    ServiceAPI.Instance.log("colorToClass:", colorToClass);
                    ServiceAPI.Instance.log("customBrandedItems[i]:", this.customBrandedItems[i]);
                    this.applyClass(this.customBrandedItems[i], colorToClass);
                }
            },
            changeHighlight: function (profileTo) {
                if (profileTo == "red"
                    || profileTo == "lightblue"
                    || profileTo == "darkblue"
                    || profileTo == "pink"
                    || profileTo == "teal") {
                    ServiceAPI.Instance.log("changing highlight to:", profileTo);
                    this.removeCurrentColorHighlights();
                    this.removeCurrentBackgroundHighlights();

                    this.applyBackgroundHighlights(profileTo);
                    this.applyColorHighlights(profileTo);
                    ServiceAPI.Instance.profile.setCustomColorHighlight(profileTo);
                }
            },

            loadContentAll: function (url) {
                // USES JQUERY TO LOAD THE CONTENT
                $.getJSON(url, { cid: url, format: 'json' }, function (json) {
                    // THIS LOOP PUTS ALL THE CONTENT INTO THE RIGHT PLACES
                    $.each(json, function (key, value) {
                        $(key).html(value);
                    });
                    $("#loading").hide();
                });
            },
            loadContentStart: function () {
                ServiceAPI.Instance.util.loadContent('#tile-login', '/account/loginstart');
                //loadContent('#tile-login-extra', '/account/manage');
            },

            changeSectionData: function (level, code) {
                var tileData = ServiceAPI.Instance.controllers.templateController.getTemplateDataItem(level, code);
                this.changeSection(tileData.url, tileData.displayName, tileData.displayName, tileData.code, 'map', level, tileData.displayCode, tileData);
            },

            initTempTemplateButtons: function () {
                
                $('.transition-effect').on("click", function (e) {
                    ServiceAPI.Instance.log("click", this.id);
                    ServiceAPI.Instance.controllers.uiController.currentEffect = this.id.replace("transition-", "");
                    ServiceAPI.Instance.controllers.uiController.changeSectionData(
                        ServiceAPI.Instance.controllers.templateController.currentMapLevel,
                        ServiceAPI.Instance.controllers.templateController.currentMapCode);
                    e.preventDefault();
                });
            },
            adjustCurrentLayout: function () {
               // clearTimeout(this.adjustCurrentLayoutDelayed);
                setTimeout(this.adjustCurrentLayoutDelayed, 2000);
            },
            adjustCurrentLayoutDelayed: function () {
                this.adjustCurrentLayout();
                if (ServiceAPI.Instance.controllers.canvasController.stage)
                    ServiceAPI.Instance.controllers.canvasController.stage.clear();
                ServiceAPI.Instance.controllers.canvasController.resizeCanvas();
            },

            // --------------------------------------------------------
            // INPUT HANDLERS

            eventHandlerClick: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerClick:", evt);
            },
            eventHandlerTapOne: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerTapOne:", evt);
            },
            eventHandlerTapTwo: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerTapTwo:", evt);
            },
            eventHandlerTapThree: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerTapThree:", evt);
            },
            eventHandlertapFour: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlertapFour:", evt);
            },
            eventHandlerSwipeOne: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeOne:", evt);
            },
            eventHandlerSwipeTwo: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeTwo:", evt);
            },
            eventHandlerSwipeThree: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeThree:", evt);
            },
            eventHandlerSwipeFour: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeFour:", evt);
            },
            eventHandlerSwipeUp: function (evt) {
               // ServiceAPI.Instance.util.log("eventHandlerSwipeUp:", evt);
            },
            eventHandlerSwipeRightUp: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeRightUp:", evt);
            },
            eventHandlerSwipeRight: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeRight:", evt);
            },
            eventHandlerSwipeDown: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeDown:", evt);
            },
            eventHandlerSwipeLeftDown: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeLeftDown:", evt);
            },
            eventHandlerSwipeLeft: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeLeft:", evt);
            },
            eventHandlerSwipeLeftUp: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeLeftUp:", evt);
            },
            eventHandler: function (evt) {
               // ServiceAPI.Instance.util.log("eventHandler:", evt);
            },

            eventHandlerPinchOpen: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerPinchOpen:", evt);
            },
            eventHandlerPinchClose: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerPinchClose:", evt);
            },
            eventHandlerRotateCW: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerRotateCW:", evt);
            },
            eventHandlerRotateCCW: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerRotateCCW:", evt);
            },
            eventHandlerSwipeMove: function (evt) {
                // ServiceAPI.Instance.util.log("eventHandlerSwipeMove:", evt);
            },
            eventHandlerPinch: function (evt) {
               // ServiceAPI.Instance.util.log("eventHandlerPinch:", evt);
            },
            eventHandlerRotate: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerRotate:", evt);
            }
        })
    }),
    Services: Class({
        apiUrlRoot: "/api/api",
        profileService: null,
        platformService: null,
        crmService: null,
        initialize: function () {
            ServiceAPI.Instance.util.log("initialized services", true);
        },
        log: function (key, val) {
            if (window.console) {
                console.log(key, val);
            }
        },

        ProfileService: Class({
            initialize: function () {
                ServiceAPI.Instance.log("initialized profile", true);
            },
            render: function (filter) {
                this.getProfile(filter);
            },
            renderResponse: function (filter, data) {
                var rangeType = 'all';
                var page = 1;
                var pageSize = 200;

                if (filter.rangeType) {
                    rangeType = filter.rangeType;
                }
                if (filter.page) {
                    page = filter.page;
                }
                if (filter.pageSize) {
                    pageSize = filter.pageSize;
                }

                var templateHeader = '';
                var templateLayout = '';
                var templateItem = '';

                templateLayout += '<table id="item-container" class="table">';
                templateLayout += ' <tr>';
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Value', 'head-item item-head-value');
                templateLayout += ' </tr>';
                for (i = 0; i < data.data.length; i++) {
                    templateLayout += ' <tr>';
                    templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', data.data[i].value_formatted, 'item item-value');
                    templateLayout += ' </tr>';
                }
                templateLayout += '</table>';

                var view = {
                    profileType: { code: 'user', type: 'string' },
                    formatted: function () {
                        return this.profileType.type;
                    },
                    view_data: data
                };

                var output = Mustache.render(templateLayout, view);
                $(filter.div).html(output);
            },
            getProfile: function (filter) {
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/profile/" + filter.code;
                serviceUrl += "?range=" + filter.rangeType;
                serviceUrl += "&page=" + filter.page;
                serviceUrl += "&page-size=" + filter.pageSize;
                if (filter.username)
                    serviceUrl += "&username=" + filter.username;
                serviceUrl += "&format=json&callback=?";

                this.filter = filter;

                ServiceAPI.Instance.log("serviceUrl:", serviceUrl);
                $.get(serviceUrl,
                    null, this.getProfileCallback, "json");
            },
            getProfileCallback: function (data) {
                var obj = ServiceAPI.Instance.services.profile;
                var log = ServiceAPI.Instance.util.log;
                log("data", data);
                log("data.msg", data.msg);
                log("data.code", data.code);
                log("data.data", data.data);
                log("data.info", data.info);
                log("data.action", data.action);

                if (data.code > 0 || data.code.length > 1) {
                    ServiceAPI.Instance.log("ERRORS:getProfileCallback", true);
                } else {
                    ServiceAPI.Instance.log("SUCCESS:getProfileCallback", false);
                    obj.renderResponse(obj.filter, data.data);
                }
            }
        }),
        
        CRMService: Class({
            filter: null,
            initialize: function () {
                ServiceAPI.Instance.log("initialized crm", true);
            },
            showVal: function (val) {
                if (!ServiceAPI.Instance.util.isNullOrEmpty(val)) {
                    return val;
                }
                return '';
            },  
            showValBool: function (val) {
		//ServiceAPI.Instance.log('val', val);
		
		if (val == undefined || val == null) {
		    return false;
		}
		
		if (val == true
		    || val == 'true'
		    || val == 1
		    || val == '1') {
                    return true;
                }
                return false;
            },
	    getPlaceholderText: function(name) {
		var placeholder = "Type something...";
		if (name.indexOf("number") > -1) {
		    placeholder = "Phone Number";
		}
		else if (name.indexOf("referrer") > -1) {
		    placeholder = "Campaign code";
		}
		else if (name.indexOf("display_name") > -1) {
		    placeholder = "Description";
		}
		return placeholder;
	    },
	    blurEventRow: function(id) {
		this.setShortCode(id);
	    },
	    changeEventRow: function(id) {
		ServiceAPI.Instance.util.log('changeEventRow:id', id);
		$('#save-' + id).show();
		ServiceAPI.Instance.services.crmService.setShortCode(id);
		ServiceAPI.Instance.services.crmService.submitCRMNumberCampaignForm(id);
	    },
	    setShortCode: function(id) {
		var referrer = $('#referrer-' + id).val();
		//ServiceAPI.Instance.util.log('setShortCode:id', id);
		//ServiceAPI.Instance.util.log('setShortCode:referrer', referrer);
		if (ServiceAPI.Instance.util.isNullOrEmptyString(referrer)) {
		    referrer = '0';
		}
		var code = ServiceAPI.Instance.util.shortCode(referrer);
		//ServiceAPI.Instance.util.log('setShortCode:code', code);
		$('#code-' + id).html(code);
	    },
	    getChangeEvent: function(id, name) {
		var changeEvt = "ServiceAPI.Instance.services.crmService.changeEventRow('" + id + "')";

		if (name.indexOf("number") > -1) {
		}
		else if (name.indexOf("referrer") > -1) {
		}
		else if (name.indexOf("display_name") > -1) {
		}
		return changeEvt;
	    },
	    /*
	    handleTextInputEvents: function(id, name) {
		var blurEvt = this.blurEventRow();
		var changeEvt = this.changeEventRow();
                var placeholder = this.getPlaceholderText(name);
		$(name).on(function() {
		    ServiceAPI.Instance.services.crmService.getPlaceholderText(name)
		});
	    },
	    */
            showValCheckbox: function (id, name, val) {
		//ServiceAPI.Instance.log('name', val);
		var checked = '';
                if (this.showValBool(val)) {
                    checked = 'checked';
                }
		var changeEvt = this.getChangeEvent(id, name);
		var placeholder = this.getPlaceholderText(name);
		
                return '<input placeholder="' + placeholder + '" onchange="' + changeEvt + '" type="checkbox" id="' + name + '" name="' + name + '" ' + checked + '>';
            },    
            showValInput: function (id, name, val) {
		//ServiceAPI.Instance.log('name', val);
		var blurEvt = this.blurEventRow(id);
		var changeEvt = this.getChangeEvent(id, name);
                var placeholder = this.getPlaceholderText(name);
		return '<input type="text" placeholder="' + placeholder + '" onchange="' + changeEvt + '"  onblur="' + blurEvt + '" class="table-cell-input" id="' + name + '" name="' + name + '" value="' + val + '">';
            },   
            showValText: function (id, name, val) {
		var blurEvt = this.blurEventRow(id);
		var changeEvt = this.getChangeEvent(id, name);
                var placeholder = this.getPlaceholderText(name);
		return '<textarea  placeholder="' + placeholder + '" onchange="' + changeEvt + '"  onblur="' + blurEvt + '" class="table-cell-text" id="' + name + '" name="' + name + '" >' + val + '</textarea>';
            },  
            render: function (filter) {
                this.getCrmCampaignNumberMeta(filter);
            },
	    renderRow: function (id, code, referrer, display_name, phoneNumber, active) {
		var formId = id;
		var templateLayout = '';// <form name="'+ formId +'" id="'+formId+'">';
		//templateLayout += ' <input type="hidden" name="'+formId+'" id="'+formId+'">';
		templateLayout += ' <tr>';//submitCRMNumberCampaignForm
		//templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showVal(data.data[i].id), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showValInput(formId, 'referrer-' + formId, referrer), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showValText(formId, 'display_name-' + formId, display_name), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showValInput(formId, 'number-' + formId, phoneNumber), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showValCheckbox(formId, 'active-' + formId, active), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', '<code><span id="code-' + formId + '">'+this.showVal(code)+'</span></code>', 'item item-value no-edit');
		
		var toolsSave =  ' <a style="display:none;" id="save-';
		toolsSave += formId
		toolsSave += '" class="btn btn-success" href="javascript:void(0);" onclick="ServiceAPI.Instance.services.crmService.submitCRMNumberCampaignForm(\''+formId+'\');">Save</a>';
		
		var toolsDelete =  ' <a id="delete-';
		toolsDelete += formId
		toolsDelete += '" class="btn btn-danger" href="javascript:void(0);" onclick="ServiceAPI.Instance.services.crmService.deleteCRMNumberCampaignDialog(\''+formId+'\');">Delete</a>';
		
		
		var toolsTest = ' <a  class="btn btn-info" href="javascript:void(0);" onclick="ServiceAPI.Instance.services.crmService.testCRMNumberCampaign(\''+formId+'\');">Test</a>';
		
		var tools = toolsTest + toolsDelete + toolsSave;
		
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', tools , 'item item-value no-edit span3');
		templateLayout += ' </tr>';
		//templateLayout += ' </form>';
		return templateLayout;
	    },
            renderResponse: function (filter, data) {
                var rangeType = 'all';
                var page = 1;
                var pageSize = 200;

                if (filter.rangeType) {
                    rangeType = filter.rangeType;
                }
                if (filter.page) {
                    page = filter.page;
                }
                if (filter.pageSize) {
                    pageSize = filter.pageSize;
                }

                var templateHeader = '';
                var templateLayout = '';
                var templateItem = '';

                templateLayout += '<table id="crm-number-campaign-meta" class="table table-hover">';
                templateLayout += ' <thead>';
                templateLayout += ' <tr>';
                //templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Id', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Campaign (URL Code)', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Source', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Phone Number', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Active', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Short Code', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Actions', 'head-item item-head-value');
                templateLayout += ' </tr>';
                templateLayout += ' </thead>';
                templateLayout += ' <tbody>';
                for (i = 0; i < data.data.length; i++) {
                    var id = data.data[i].id;
                    var code = data.data[i].code;
                    var referrer = data.data[i].referrer;
                    var display_name = data.data[i].display_name;
                    var phoneNumber = data.data[i].number;
                    var active = data.data[i].active;
		    		    
		    templateLayout += this.renderRow(id, code, referrer, display_name, phoneNumber, active);
                }
                templateLayout += ' </tbody>';
                templateLayout += '</table>';
                $(filter.div).html(templateLayout);
                
                $(filter.div + " table tr td").bind("click", function dataClick(e) {
                    //console.log(e);
                    //if (e.currentTarget.innerHTML != "") return;
                    if (!$(e.currentTarget).hasClass('no-edit')) {                        
                        if(e.currentTarget.contentEditable != null){
                           // $(e.currentTarget).attr("contentEditable",true);
                        }
                        else{
                           // $(e.currentTarget).append("<input type='text'>");
                        } 
                    }   
                });
            },
	    adminAddNew: function() {
		var id = Math.uuid().toLowerCase();
		var tbl = '#crm-number-campaign-meta tbody';
		ServiceAPI.Instance.util.log('id', id);
		ServiceAPI.Instance.util.log('tbl', tbl);
		this.adminAddTemplateRow(tbl, id);
	    },
	    adminAddTemplateRow: function(tbl, id) {
		var rowTemplate = this.renderRow(id, '', '', '', '', false);
		ServiceAPI.Instance.util.log('rowTemplate', rowTemplate);
		$(tbl).prepend(rowTemplate);
	    },
	    currentDeleteId: null,
	    deleteCRMNumberCampaignAction: function() {
		
		var id = ServiceAPI.Instance.services.crmService.currentDeleteId;
		ServiceAPI.Instance.util.log('modalDelete',id);
		ServiceAPI.Instance.services.crmService.deleteCRMNumberCampaign(id);
		$('#modalDelete').modal({
		    show: false
		  });
	    },
	    testCRMNumberCampaign: function (id) {
		var referrer = $('#referrer-'+id).val();
		document.location = '/api/admin/test/?utm_content=' + referrer;
	    },
	    deleteCRMNumberCampaignDialog: function (id) {
		this.currentDeleteId = id;
		// show modal
		// delete on success
		$('#modalDelete').modal({
		    show: true
		  });
		$('#modal-delete-confirm').off('click',
				      ServiceAPI.Instance.services.crmService.deleteCRMNumberCampaignAction);
		$('#modal-delete-confirm').on('click',
				     ServiceAPI.Instance.services.crmService.deleteCRMNumberCampaignAction);
	    },
	    submitCRMNumberCampaignForm: function(fid) {
		var activeVal = $('#active-' + fid).is(":checked");
		if (activeVal) {
		    activeVal = '1';
		}
		else {
		    activeVal = '0';
		}
		var filter = {
		    code: fid,
		    values : {
			id: fid,
			active: activeVal,
			number: $('#number-' + fid).val(),
			referrer: $('#referrer-' + fid).val(),
			display_name:$('#display_name-' + fid).val()//submitCRMNumberCampaignForm
			
		    }
		};
		ServiceAPI.Instance.log('filter',filter);//$('save-" + id + "').show()
		this.setCRMNumberCampaign(filter);
	    },
	    setCRMNumberCampaign: function (filter) {		
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "" + filter.code;
                serviceUrl += "?format=json&callback=?";	
		ServiceAPI.Instance.util.log('serviceUrl', serviceUrl);
              
                $.post(serviceUrl,
                    filter.values,
		    function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.msg", data.msg);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
			
			$('#save-' + filter.code).hide();
                        ServiceAPI.Instance.util.log("ERRORS:setCRMNumberCampaign", true);
                    }
		    else {
			$('#save-' + filter.code).hide();
                        ServiceAPI.Instance.util.log("SUCCESS:setCRMNumberCampaign", false);
                        //var phoneNumber = data.data.number;
                        //if (!ServiceAPI.Instance.util.isNullOrEmptyString(phoneNumber)) {
                        //    $(filter.div).html(phoneNumber);
                        //}
                    }
                  }, "json")
		/*
                  .done(function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.message", data.message);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
                        ServiceAPI.Instance.util.log("ERRORS:getCRMNumberByCampaignReferrer", true);
                    } else {
                        ServiceAPI.Instance.util.log("SUCCESS:getCRMNumberByCampaignReferrer", false);
                        var phoneNumber = data.data.number;
                        if (!ServiceAPI.Instance.util.isNullOrEmptyString(phoneNumber)) {
                            $(filter.div).html(phoneNumber);
                        }
                    }
                  });
                  */
	    },
	    deleteCRMNumberCampaign: function (id) {		
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "" + id + "/delete/";
                serviceUrl += "?format=json&callback=?";	
		ServiceAPI.Instance.util.log('serviceUrl', serviceUrl);
		
		var auth = 'deleteCRMNumberCampaign';		
		var shortCodePrep = auth+'-'+id+'-delete-crmauth';
		ServiceAPI.Instance.util.log('shortCodePrep', shortCodePrep);
		var shortCode = ServiceAPI.Instance.util.shortCode(shortCodePrep);
		ServiceAPI.Instance.util.log('shortCode', shortCode);
		var values = {
		    shortCode: shortCode,
		    auth: auth
		};
		ServiceAPI.Instance.util.log('values', values);
              
                $.post(serviceUrl,
                    values,
		    function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.msg", data.msg);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
                        ServiceAPI.Instance.util.log("ERRORS:deleteCRMNumberCampaign", true);
                    }
		    else {
                        ServiceAPI.Instance.util.log("SUCCESS:deleteCRMNumberCampaign", false);
			crm.crmAdmin();
                    }
                  }, "json")
	    },
            getCRMNumberByCampaignReferrer: function (filter) {
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "referrer/" + filter.referrer;
                serviceUrl += "?format=json&callback=?";
				
		ServiceAPI.Instance.util.log('serviceUrl', serviceUrl);
              
                $.get(serviceUrl,
                    null,
		    function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.msg", data.msg);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
                        ServiceAPI.Instance.util.log("ERRORS:getCRMNumberByCampaignReferrer", true);
                    } else {
                        ServiceAPI.Instance.util.log("SUCCESS:getCRMNumberByCampaignReferrer", false);
                        if (data.data) {			    
			    var phoneNumber = data.data.number;
			    var active = data.data.active;
			    
			    ServiceAPI.Instance.tracker.trackEventCRM(
				"phonenumber-get", phoneNumber, 1);	    
			    
			    if (ServiceAPI.Instance.services.crmService.showValBool(active)) {
				
				if (!ServiceAPI.Instance.util.isNullOrEmptyString(phoneNumber)) {
				    $(filter.el).html(phoneNumber);
				    				
				    if (!$(filter.el).hasClass('crm-fade-in')) {
					$(filter.el).addClass('crm-fade-in');
				    }
				    
				    ServiceAPI.Instance.tracker.trackEventCRM(
					"phonenumber-get-active", phoneNumber, 1);
				}	
			    }	
			}
                    }
                  }, "json");
            },
            getCRMNumberByCampaignCode: function (filter) {
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "code/" + filter.code;
                serviceUrl += "?format=json&callback=?";
				
		ServiceAPI.Instance.util.log('serviceUrl', serviceUrl);
              
                $.get(serviceUrl,
                    null,
		    function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.msg", data.msg);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
                        ServiceAPI.Instance.util.log("ERRORS:getCRMNumberByCampaignCode", true);
                    } else {
                        ServiceAPI.Instance.util.log("SUCCESS:getCRMNumberByCampaignCode", false);
			if (data.data) {	
			    var phoneNumber = data.data.number;
			    var active = data.data.active;
			    ServiceAPI.Instance.tracker.trackEventCRM(
					"phonenumber-get", phoneNumber, 1);	
			    if (ServiceAPI.Instance.services.crmService.showValBool(active)) {			
				if (!ServiceAPI.Instance.util.isNullOrEmptyString(phoneNumber)) {
				    $(filter.el).html(phoneNumber);
				    if (!$(filter.el).hasClass('crm-fade-in')) {
					$(filter.el).addClass('crm-fade-in');
				    }
				    ServiceAPI.Instance.tracker.trackEventCRM(
					"phonenumber-get-active", phoneNumber, 1);
				}	
			    }
			}
                    }
                  }, "json");
            },
            getCRMNumberCampaignMeta: function (filter) {
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "?range=" + filter.rangeType;
                serviceUrl += "&page=" + filter.page;
                serviceUrl += "&page-size=" + filter.pageSize;
                if (filter.username)
                    serviceUrl += "&code=" + filter.code;
                serviceUrl += "&format=json&callback=?";

                this.filter = filter;

                ServiceAPI.Instance.log("serviceUrl:", serviceUrl);
                $.get(serviceUrl,                    
                    null, this.getCRMNumberCampaignMetaCallback, "json");
            },
            getCRMNumberCampaignMetaCallback: function (data) {
                var obj = ServiceAPI.Instance.services.crmService;
                var log = ServiceAPI.Instance.util.log;
                log("data", data);
                log("data.msg", data.msg);
                log("data.code", data.code);
                log("data.data", data.data);
                log("data.info", data.info);
                log("data.action", data.action);

                if (data.code > 0 || data.code.length > 1) {
                    ServiceAPI.Instance.log("ERRORS:getCRMNumberCampaignMetaCallback", true);
                } else {
                    ServiceAPI.Instance.log("SUCCESS:getCRMNumberCampaignMetaCallback", false);
                    obj.renderResponse(obj.filter, data);
                }
            }
        })
    }),
    initialize: function () {
        ServiceAPI.Instance = this;
        this.Instance = this;
        
        this.initLibs();

        this.util = new this.Utility();
        this.profile = new this.Profile();
        this.profile.initAttributes();
        
        this.tracker = new this.Tracker();

        this.services = new this.Services();
        this.services.profileService = new this.services.ProfileService();
        this.services.crmService = new this.services.CRMService();

        this.controllers = new this.Controllers();
        this.controllers.uiController = new this.controllers.UIController();

        //this.log("initialized ServiceAPI", true);

        this.startUp();

        this.log("started up ServiceAPI");
    },
    startUp: function () {
        
        //var generalbrand = 'generalbrand';
        //ServiceAPI.Instance.util.log('generalbrand:', ServiceAPI.Instance.util.shortCode(generalbrand));
        
        //var weightloss = 'weightloss';
        //ServiceAPI.Instance.util.log('weightloss:', ServiceAPI.Instance.util.shortCode(weightloss));
        
        //var tucsonlenoxunbranded = 'tucsonlenoxunbranded';
        //ServiceAPI.Instance.util.log('tucsonlenoxunbranded:', ServiceAPI.Instance.util.shortCode(tucsonlenoxunbranded));
        
        //$(window).bind("resize", this.controllers.uiController.adjustCurrentLayout);
        // init user/geo
        //this.profile.getLocation();
        /*
        // social client - to use in javascript if needed
        FB_APP_ID = "461074897268600056";
        window.fbAsyncInit = function () {
            FB.init({
                appId: FB_APP_ID, // App ID
                channelUrl: '/channel.html', // Channel File
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                oauth: true, // enable OAuth 2.0
                xfbml: true  // parse XFBML
            });

            FB.api('/me', function (response) {
                var name = response.name;
                if (name) {
                    var namearr = name.split(' ');
                    var namefirst = namearr[0];
                    var namelast = "";
                    if (namearr.length > 1) {
                        namelast = namearr[1];
                    }

                    $("#name-first").html(namefirst);
                    $("#name-last").html(namelast);
                }
            });

            // Additional initialization code here

            var info = document.getElementById('profile-info'),
                update = function (response) {
                    if (info) {
                        info.innerHTML = "";
                    }
                    if (response.status != 'connected') {
                        $('#login-button').show();
                        return;
                    }

                    //facebook_login();

                    FB.api(
                        {
                            method: 'fql.query',
                            query: 'SELECT name, pic_square FROM user WHERE uid=' + response.authResponse.userID
                        },
                        function (response) {
                            if (info) {
                                info.innerHTML = '<span><img id="profile-image-icon" src="' + response[0].pic_square + '"></span><span id="profile-name">' + response[0].name + '<span id="profile-logout">(<a href="#" id="profile-logout-link">logout</a>)</span></span>';
                            }

                            $('#login-button').hide();
                            // onLoggedIn();
                        }
                    );
                };

            comment_created = function (response) {
                ServiceAPI.Instance.util.log("comment_created_response:", response);
                //updateLiveConversations();
                //updateLatestComments();
                //loadCommentCounts();
            }; // update on login, logout, and once on page load
            FB.Event.subscribe('auth.login', update);
            FB.Event.subscribe('auth.logout', update);
            FB.Event.subscribe('comment.create', comment_created);
            FB.getLoginStatus(update);

            ServiceAPI.Instance.util.log("fb prep:", 1);
        };
            */
        /*
        // Load the SDK's source Asynchronously
        (function (d, debug) {
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
            ref.parentNode.insertBefore(js, ref);
        }(document, false));
        */

        $('html').bind('tapone', this.controllers.uiController.eventHandlerTapOne);
        $('html').bind('taptwo', this.controllers.uiController.eventHandlerTapTwo);
        $('html').bind('tapthree', this.controllers.uiController.eventHandlerTapThree);
        $('html').bind('tapfour', this.controllers.uiController.eventHandlerTapFour);

        $('html').bind('swipeone', this.controllers.uiController.eventHandlerSwipeOne);
        $('html').bind('swipetwo', this.controllers.uiController.eventHandlerSwipeOne);
        $('html').bind('swipethree', this.controllers.uiController.eventHandlerSwipeOne);
        $('html').bind('swipefour', this.controllers.uiController.eventHandlerSwipeOne);

        $('html').bind('swipeup', this.controllers.uiController.eventHandlerSwipeUp);
        $('html').bind('swiperightup', this.controllers.uiController.eventHandlerSwipeRightUp);
        $('html').bind('swiperight', this.controllers.uiController.eventHandlerSwipeRight);
        $('html').bind('swiperightdown', this.controllers.uiController.eventHandlerSwipeRightDown);

        $('html').bind('swipedown', this.controllers.uiController.eventHandlerSwipeDown);
        $('html').bind('swipeleftdown', this.controllers.uiController.eventHandlerSwipeLeftDown);
        $('html').bind('swipeleft', this.controllers.uiController.eventHandlerSwipeLeft);
        $('html').bind('swipeleftup', this.controllers.uiController.eventHandlerSwipeLeftUp);

        $('html').bind('pinchopen', this.controllers.uiController.eventHandlerPinchOpen);
        $('html').bind('pinchclose', this.controllers.uiController.eventHandlerPinchClose);
        $('html').bind('rotatecw', this.controllers.uiController.eventHandlerRotateCW);
        $('html').bind('rotateccw', this.controllers.uiController.eventHandlerRotateCCW);
        $('html').bind('swipeone', this.controllers.uiController.eventHandlerSwipeOne);
        $('html').bind('swipemove', this.controllers.uiController.eventHandlerSwipeMove);
        $('html').bind('pinch', this.controllers.uiController.eventHandlerPinch);
        $('html').bind('rotate', this.controllers.uiController.eventHandlerRotate);

        /* CARD FLIP
     /////////////////////////////////////////////////////////////////*/
        $('.card .front').append('<span class="flip_back"></span>');
        $('.card .back').append('<span class="flip_front"></span>');

        this.controllers.uiController.initHistoryState();
    },
    log: function (key, val) {
        if (window.console) {
            console.log(key, val);
        }
    },
    // CUSTOM
    hasProfileAttribute: function(code) {
        return ServiceAPI.Instance.profile.hasAttribute(code);
    },
    getProfileAttribute: function(code) {
        return ServiceAPI.Instance.profile.getAttribute(code);        
    },
    setProfileAttribute: function(code, val) {
        return ServiceAPI.Instance.profile.setAttribute(code, val);        
    },
    syncCRMReferrer: function() {
      var referrer = $.query.get('utm_content');
      if (ServiceAPI.Instance.util.isNullOrEmptyString(referrer)) {
          referrer = '';
	  
	    ServiceAPI.Instance.tracker.trackEventCRM(
					"referrer", "no-referrer-or-inner-page", 1);
	    
	    var previousReferrer = this.getProfileAttribute('utm_content');
	    if (ServiceAPI.Instance.util.isNullOrEmptyString(previousReferrer)) {
		ServiceAPI.Instance.tracker.trackEventCRM(
		    "referrer-return", previousReferrer, 1);		
	    }	
      }
      else {
          ServiceAPI.Instance.log('updatingReferrer:', referrer);  
	    
          var shortCode = ServiceAPI.Instance.util.shortCode(referrer);	  
	    
          this.setProfileAttribute('crm-code', shortCode);
          this.setProfileAttribute('utm_content', referrer);
	  
	    ServiceAPI.Instance.tracker.trackEventCRM(
					"shortCode", shortCode, 1);
	    ServiceAPI.Instance.tracker.trackEventCRM(
					"referrer-landed", referrer, 1);
      }
      return referrer;
    },
    updateCRMNumberCampaigns: function() {
        var crmTags= ['.crm-number'];
	this.updateCRMNumberCampaignTags(crmTags);
    },
    updateCRMNumberCampaignTags: function(crmClassTags) {
      // for each placholder, update number by campaign if exists
      
	//var crmTags = {
	//  tagsDynamicNumberNames: ['.crm-number']
	// };
	//serviceApi.updateCRMNumberCampaigns(crmTags);
      
      // TURNING ON/OFF CRM DYNAMIC NUMBER REPLACEMENT in HTML/BLOCKS
      // The class 'crm-number' is the switch to turn on/off crm services on a placeholder
      // By default if no cookies found it keeps the existing placeholder number
      // If there are cookies it swaps out the placeholder if the campaign is still active
      // Adding data-crm-type="dynamic" is not required as it is the default.
      // Both tags below would be updated dynamically with the cookie/campaign if exists on a
      // page with the services api javascript library (it's on every page on drupal at the bottom
      // after google analytics).
      // <span class="crm-number" data-crm-type="dynamic">888-555-9000</span>
      // <span class="crm-number">888-555-9000</span>
      //
      // OVERRIDES DEFAULT DYNAMIC NUMBER AND SHUTS IT OFF, KEEPING EXISTING NUMBER
      // Not using the class or applying the class 'crm-number' and 'data-crm-type' equal to 'override'
      // prevents this placeholder from being updated by the default dynamic replacement
      // for inner sections of the site.
      // <span class="someotherclass">888-555-9000</span>
      // <span class="crm-number" data-crm-type="override">888-555-9000</span>
      //
      // CALLS CRM NUMBER SERVICE BUT OVERRIDES WITH A SPECIFIC CODE OR REFERRER
      // Calling a specific code and overriding the default dyanmic replacement by cookie is easy.
      // Turn on the services by adding class='crm-number'
      // Change 'data-crm-type' to 'override' to override and turn off default behavior.
      // Then add 'data-crm-code' to the html with a code found on the manager to replace with that
      // specific campaign instead of the previous cookie.
      // Using data-crm-code is recommended for privacy, you can also use 'data-crm-referrer' and
      // use a code like 'socialmedia'.  Both examples below pull the number for social media
      // campaign if that campaign is active in the manager (not required in google to be active).

      // <span class="crm-number" data-crm-type="override" data-crm-code="j5ateh">888-555-9000</span>
      // <span class="crm-number" data-crm-type="override" data-crm-referrer="socialmedia">888-555-9000</span>
      
      
      var crmDataTypeKey = 'data-crm-type';
      var crmDataCodeKey = 'data-crm-code';
      var crmDataReferrerKey = 'data-crm-referrer';
      var crmCodeKey = 'crm-code';
      
      var currentCode = '';
      var currentReferrer = '';
      var referrer = this.syncCRMReferrer();
      currentReferrer = referrer;
      
      if (this.hasProfileAttribute(crmCodeKey)) {
	// get saved code
        currentCode = this.getProfileAttribute(crmCodeKey);
	
	ServiceAPI.Instance.tracker.trackEventCRM(
			"return-user-code", currentCode, 1);
	ServiceAPI.Instance.tracker.trackEventCRM(
			"return-user-referrer", referrer, 1);
	
	// log event with return code
      }
      else {
	// log event with new code	
	ServiceAPI.Instance.tracker.trackEventCRM(
			"new-user-code", "none", 1);
	ServiceAPI.Instance.tracker.trackEventCRM(
			"new-user-referrer", referrer, 1);
      }
         
      for (var i = 0; i < crmClassTags.length; i++) {
	// loop all dynamic tags to lookup
        //ServiceAPI.Instance.log('i', i);
        //ServiceAPI.Instance.log('crmClassTags[i]', crmClassTags[i]);
        $(crmClassTags[i]).each(function(index) {
	    
	    var currentCrmClassTag = crmClassTags[i];
	    var currentDataNumber = $(this).html();
	    var currentDataType = $(this).attr(crmDataTypeKey);
	    var currentDataCode = $(this).attr(crmDataCodeKey);
	    var currentDataReferrer = $(this).attr(crmDataReferrerKey);
	    
	    ServiceAPI.Instance.tracker.trackEventCRM("dynamic-tag-update", currentCrmClassTag, 1);
	    
	    ServiceAPI.Instance.log('crm:----------------', "");
	    ServiceAPI.Instance.log('crm:currentDataNumber', currentDataNumber);
	    ServiceAPI.Instance.log('crm:currentDataType', currentDataType);
	    ServiceAPI.Instance.log('crm:currentDataCode', currentDataCode);
	    ServiceAPI.Instance.log('crm:currentDataReferrer', currentDataReferrer);
          
	    var isOverride = false;
	    var doUpdateCode = false;
	    var doUpdateReferrer = false;
	    
	    if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentDataType)) {
		if(currentDataType.toLowerCase() == 'override') {
		    isOverride = true;
		}		
	    }
	    
	    ServiceAPI.Instance.log('crm:isOverride', isOverride);
	    
	    if (!isOverride) {
		// do default behavior
		doUpdateCode = true;
	    }
	    else {
		// do special cases
		
		if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentDataCode)) {
		    currentCode = currentDataCode;
		    doUpdateCode = true;
		}
		else if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentDataReferrer)) {
		    currentReferrer = currentDataReferrer;
		    doUpdateReferrer = true;
		}
	    }
	    
	    if (!doUpdateCode) {
		if (!$(currentCrmClassTag).hasClass('crm-fade-in')) {
		    $(currentCrmClassTag).addClass('crm-fade-in');
		}
	    }
	  
	    if (doUpdateCode) {
		if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentCode)) {
		    
		    ServiceAPI.Instance.log('crm:updatingNumber:currentCode:', currentCode);
		    var numberFilter = { code: currentCode, el: this};
		    ServiceAPI.Instance.log('crm:numberFilter', numberFilter);
		    ServiceAPI.Instance.services.crmService.getCRMNumberByCampaignCode(numberFilter);	
		}
	    }
	    if (doUpdateReferrer) {
		if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentReferrer)) {
		    ServiceAPI.Instance.log('crm:updatingNumber:currentReferrer:', currentReferrer);
		    var numberFilter = { referrer: currentReferrer, el: this};
		    ServiceAPI.Instance.log('crm:numberFilter', numberFilter);
		    ServiceAPI.Instance.services.crmService.getCRMNumberByCampaignReferrer(numberFilter);
		}
	    }
       });  
      }
    },
    jQueryLoaded: function() {
      // Only do anything if jQuery isn't defined
      if (typeof jQuery == 'undefined') {      
       if (typeof $ == 'function') {
        return true;
       }
      }
      else {
        return true;
      }
      return false;
    },
    getScript: function(url, success) {       
      var script = document.createElement('script');
      script.src = url;
      
      var head = document.getElementsByTagName('head')[0],
      done = false;
      
      // Attach handlers for all browsers
      script.onload = script.onreadystatechange = function() {        
        if (!done && (!this.readyState
                    || this.readyState == 'loaded'
                    || this.readyState == 'complete')) {         
          done = true;          
          // callback function provided as param
          success();          
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);          
        };        
      };        
      head.appendChild(script);       
    },
    initLibs: function() {
      
      if(this.jQueryLoaded()) {
        return true;
      }
      
      var success = false;
      
      this.getScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function() {       
        if (typeof jQuery=='undefined') {        
          // failed
          success = false;
        }
        else {
          // loaded
          success = true;
        }
      });
      
      this.getScript('//code.jquery.com/jquery-migrate-1.1.0.min.js', function() {       
        if (typeof jQuery=='undefined') {        
          // failed
          success = false;
        }
        else {
          // loaded
          success = true;
        }
      });
      
      return success;
    }
});


var LoaderHelper = Class({
    Instance: function () { return this; },
    log: function (key, val) {
        if (window.console) {
            console.log(key, val);
        }
    },
    initialize: function(callbackSuccess) {
      this.log("started up LoaderHelper");
      this.initLibs(callbackSuccess);
    },
    jQueryLoaded: function() {
      // Only do anything if jQuery isn't defined
      this.log("initLibs: jQueryLoaded");
      if (typeof jQuery == 'undefined') {  
        this.log("initLibs: jQuery undefined");    
        if (typeof $ == 'function') {
          this.log("initLibs: $ exists");  
          this.log("initLibs: jQueryLoaded true");    
          return true;
        }
        else {     
          this.log("initLibs: jQueryLoaded false");
          return false;
        }
      }
      else {
        this.log("initLibs: jQueryLoaded true");    
        if (typeof $ == 'function') {
          this.log("initLibs: $ exists");  
          this.log("initLibs: jQueryLoaded true");    
          return true;
        }
        else {          
          this.log("initLibs: $ updated");  
          $ = jQuery; 
          return true;
        }
      }
      this.log("initLibs: jQueryLoaded false");  
      return false;
    },
    getScript: function(url, success) {       
      var script = document.createElement('script');
      script.src = url;
      
      var head = document.getElementsByTagName('head')[0],
      done = false;
      
      // Attach handlers for all browsers
      script.onload = script.onreadystatechange = function() {        
        if (!done && (!this.readyState
                    || this.readyState == 'loaded'
                    || this.readyState == 'complete')) {         
          done = true;          
          // callback function provided as param
          success();          
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);          
        };        
      };        
      head.appendChild(script);       
    },
    initLibs: function(callbackSuccess) {
      
      if(this.jQueryLoaded()) {
        
        this.log("initLibs: jquery IS loaded");
        callbackSuccess();
        return true;
      }
      
      this.log("initLibs: jquery not loaded");
        
      var success = false;
      
      this.getScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function() {       
        if (typeof jQuery=='undefined') {        
          // failed
          success = false;
        }
        else {
          // loaded
          success = true;
          
          this.log("initLibs: jquery load:" + success);          
           
          this.getScript('//code.jquery.com/jquery-migrate-1.1.0.min.js', function() {       
            if (typeof jQuery=='undefined') {        
              // failed
              success = false;
            }
            else {
              // loaded
              success = true;
              callbackSuccess();
            }
          });
        this.log("initLibs: jquery migrate load:" + success);
        }
      });
      
      return success;
    }
});


// class basic
var Class = function (methods) {
    var klass = function () {
        this.initialize.apply(this, arguments);
    };
    for (var property in methods) {
        klass.prototype[property] = methods[property];
    }
    if (!klass.prototype.initialize)
        klass.prototype.initialize = function () {
        };
    return klass;
};

/*
 *
var universe = function(){
  var bang = "Big"; //private variable

  // defined private functions here

  return{  //return the singleton object
    everything : true,

    // public functions here (closures accessing private functions and private variables)
    getBang : function(){ return bang; }
  };
}();
alert(universe.everything); // true
alert(universe.getBang()); //true
alert(universe.bang); //Undefined property ! Cause private ;)

var TestClass = Class({
  initialize: function(name) {
    this.name = name;
  },
  toString: function() {
    return "My name is "+this.name;
  },
  log: function() {
    if(window.console) {
      console.log("My name is ", this.name);
    }
  }
});

var testClass = new TestClass();
testClass.initialize("testClass");
testClass.log();

*/

/*!
 * A crc32 function that will produce the same result as PHP's crc32() function
 * (http://php.net/crc32).
 * 
 * The string used in PHP must be encoded in UTF-8 or the checksums will be
 * different. Use the following PHP to get the unsigned integer result:
 * 
 *     sprintf('%u', crc32($string));
 * 
 * Copyright 2010, Will Bond <will@wbond.net>
 * Released under the MIT license
 */
(function() {
	var table = [
    	0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F,
		0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988,
		0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2,
		0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
		0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9,
		0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172,
		0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C,
		0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59,
		0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423,
		0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
		0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106,
		0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
		0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D,
		0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E,
		0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950,
		0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65,
		0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7,
		0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0,
		0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA,
		0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
		0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81,
		0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A,
		0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84,
		0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1,
		0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB,
		0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC,
		0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E,
		0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B,
		0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55,
		0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
		0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28,
		0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D,
		0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F,
		0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38,
		0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242,
		0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777,
		0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69,
		0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2,
		0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC,
		0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
		0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693,
		0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94,
		0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D
	];

    crc32 = function(string) {
    	// This converts a unicode string to UTF-8 bytes
    	string = unescape(encodeURI(string));
    	var crc = 0 ^ (-1);
        var len = string.length;
        for (var i=0; i < len; i++) {
        	crc = (crc >>> 8) ^ table[
            	(crc ^ string.charCodeAt(i)) & 0xFF
            ];
        }
        crc = crc ^ (-1);
        // Turns the signed integer into an unsigned integer
        if (crc < 0) {
        	crc += 4294967296;
        }
        return crc;
    };
})();

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

/**
* jQuery.query - Query String Modification and Creation for jQuery
* Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
* Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
* Date: 2009/02/08
*
* @author Blair Mitchelmore
* @version 2.1.3
*
**/
new function(settings) {
    // Various Settings
    var $separator = settings.separator || '&';
    var $spaces = settings.spaces === false ? false : true;
    var $suffix = settings.suffix === false ? '' : '[]';
    var $prefix = settings.prefix === false ? false : true;
    var $hash = $prefix ? settings.hash === true ? "#" : "?" : "";
    var $numbers = settings.numbers === false ? false : true;

    jQuery.query = new function() {
        var is = function(o, t) {
            return o != undefined && o !== null && (!!t ? o.constructor == t : true);
        };
        var parse = function(path) {
            var m, rx = /\[([^[]*)\]/g, match = /^(\S+?)(\[\S*\])?$/.exec(path), base = match[1], tokens = [];
            while (m = rx.exec(match[2])) tokens.push(m[1]);
            return [base, tokens];
        };
        var set = function(target, tokens, value) {
            var o, token = tokens.shift();
            if (typeof target != 'object') target = null;
            if (token === "") {
                if (!target) target = [];
                if (is(target, Array)) {
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                } else if (is(target, Object)) {
                    var i = 0;
                    while (target[i++] != null);
                    target[--i] = tokens.length == 0 ? value : set(target[i], tokens.slice(0), value);
                } else {
                    target = [];
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                }
            } else if (token && token.match(/^\s*[0-9]+\s*$/)) {
                var index = parseInt(token, 10);
                if (!target) target = [];
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else if (token) {
                var index = token.replace(/^\s*|\s*$/g, "");
                if (!target) target = {};
                if (is(target, Array)) {
                    var temp = {};
                    for (var i = 0; i < target.length; ++i) {
                        temp[i] = target[i];
                    }
                    target = temp;
                }
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else {
                return value;
            }
            return target;
        };

        var queryObject = function(a) {
            var self = this;
            self.keys = {};

            if (a.queryObject) {
                jQuery.each(a.get(), function(key, val) {
                    self.SET(key, val);
                });
            } else {
                jQuery.each(arguments, function() {
                    var q = "" + this;
                    q = decodeURIComponent(q);
                    q = q.replace(/^[?#]/, ''); // remove any leading ? || #
                    q = q.replace(/[;&]$/, ''); // remove any trailing & || ;
                    if ($spaces) q = q.replace(/[+]/g, ' '); // replace +'s with spaces

                    jQuery.each(q.split(/[&;]/), function() {
                        var key = this.split('=')[0];
                        var val = this.split('=')[1];

                        if (!key) return;

                        if ($numbers) {
                            if (/^[+-]?[0-9]+\.[0-9]*$/.test(val)) // simple float regex
                                val = parseFloat(val);
                            else if (/^[+-]?[0-9]+$/.test(val)) // simple int regex
                                val = parseInt(val, 10);
                        }

                        val = (!val && val !== 0) ? true : val;

                        if (val !== false && val !== true && typeof val != 'number')
                            val = val;

                        self.SET(key, val);
                    });
                });
            }
            return self;
        };

        queryObject.prototype = {
            queryObject: true,
            has: function(key, type) {
                var value = this.get(key);
                return is(value, type);
            },
            GET: function(key) {
                if (!is(key)) return this.keys;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                while (target != null && tokens.length != 0) {
                    target = target[tokens.shift()];
                }
                return typeof target == 'number' ? target : target || "";
            },
            get: function(key) {
                var target = this.GET(key);
                if (is(target, Object))
                    return jQuery.extend(true, {}, target);
                else if (is(target, Array))
                    return target.slice(0);
                return target;
            },
            SET: function(key, val) {
                var value = !is(val) ? null : val;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                this.keys[base] = set(target, tokens.slice(0), value);
                return this;
            },
            set: function(key, val) {
                return this.copy().SET(key, val);
            },
            REMOVE: function(key) {
                return this.SET(key, null).COMPACT();
            },
            remove: function(key) {
                return this.copy().REMOVE(key);
            },
            EMPTY: function() {
                var self = this;
                jQuery.each(self.keys, function(key, value) {
                    delete self.keys[key];
                });
                return self;
            },
            load: function(url) {
                var hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
                var search = url.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
                return new queryObject(url.length == search.length ? '' : search, url.length == hash.length ? '' : hash);
            },
            empty: function() {
                return this.copy().EMPTY();
            },
            copy: function() {
                return new queryObject(this);
            },
            COMPACT: function() {
                function build(orig) {
                    var obj = typeof orig == "object" ? is(orig, Array) ? [] : {} : orig;
                    if (typeof orig == 'object') {
                        function add(o, key, value) {
                            if (is(o, Array))
                                o.push(value);
                            else
                                o[key] = value;
                        }
                        jQuery.each(orig, function(key, value) {
                            if (!is(value)) return true;
                            add(obj, key, build(value));
                        });
                    }
                    return obj;
                }
                this.keys = build(this.keys);
                return this;
            },
            compact: function() {
                return this.copy().COMPACT();
            },
            toString: function() {
                var i = 0, queryString = [], chunks = [], self = this;
                var addFields = function(arr, key, value) {
                    if (!is(value) || value === false) return;
                    var o = [encodeURIComponent(key)];
                    if (value !== true) {
                        o.push("=");
                        o.push(encodeURIComponent(value));
                    }
                    arr.push(o.join(""));
                };
                var build = function(obj, base) {
                    var newKey = function(key) {
                        return !base || base == "" ? [key].join("") : [base, "[", key, "]"].join("");
                    };
                    jQuery.each(obj, function(key, value) {
                        if (typeof value == 'object')
                            build(value, newKey(key));
                        else
                            addFields(chunks, newKey(key), value);
                    });
                };

                build(this.keys);

                if (chunks.length > 0) queryString.push($hash);
                queryString.push(chunks.join($separator));

                return queryString.join("");
            }
        };

        return new queryObject(location.search, location.hash);
    };
} (jQuery.query || {}); // Pass in jQuery.query as settings object

var Url = {
 
	// public method for url encoding
	encode : function (string) {
		return escape(this._utf8_encode(string));
	},
 
	// public method for url decoding
	decode : function (string) {
		return this._utf8_decode(unescape(string));
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

// LIBS
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

}

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)
  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e)
  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s)
{
  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var remainders = Array();
  var i, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */
  while(dividend.length > 0)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[remainders.length] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  /* Append leading zero equivalents */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)))
  for(i = output.length; i < full_length; i++)
    output = encoding[0] + output;

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

// UUID

/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * 
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

  Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
  // by minimizing calls to random()
  Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

  // A more compact, but less performant, RFC4122v4 solution:
  Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
  };
})();

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (root, factory) {
  if (typeof exports === "object" && exports) {
    module.exports = factory; // CommonJS
  } else if (typeof define === "function" && define.amd) {
    define(factory); // AMD
  } else {
    root.Mustache = factory; // <script>
  }
}(this, (function () {

  var exports = {};

  exports.name = "mustache.js";
  exports.version = "0.7.2";
  exports.tags = ["{{", "}}"];

  exports.Scanner = Scanner;
  exports.Context = Context;
  exports.Writer = Writer;

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var nonSpaceRe = /\S/;
  var eqRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  var _test = RegExp.prototype.test;
  var _toString = Object.prototype.toString;

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  function testRe(re, string) {
    return _test.call(re, string);
  }

  function isWhitespace(string) {
    return !testRe(nonSpaceRe, string);
  }

  var isArray = Array.isArray || function (obj) {
    return _toString.call(obj) === '[object Array]';
  };

  function escapeRe(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  exports.escape = escapeHtml;

  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (match && match.index === 0) {
      this.tail = this.tail.substring(match[0].length);
      this.pos += match[0].length;
      return match[0];
    }

    return "";
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var match, pos = this.tail.search(re);

    switch (pos) {
    case -1:
      match = this.tail;
      this.pos += this.tail.length;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, pos);
      this.tail = this.tail.substring(pos);
      this.pos += pos;
    }

    return match;
  };

  function Context(view, parent) {
    this.view = view;
    this.parent = parent;
    this._cache = {};
  }

  Context.make = function (view) {
    return (view instanceof Context) ? view : new Context(view);
  };

  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  Context.prototype.lookup = function (name) {
    var value = this._cache[name];

    if (!value) {
      if (name == '.') {
        value = this.view;
      } else {
        var context = this;

        while (context) {
          if (name.indexOf('.') > 0) {
            value = context.view;
            var names = name.split('.'), i = 0;
            while (value && i < names.length) {
              value = value[names[i++]];
            }
          } else {
            value = context.view[name];
          }

          if (value != null) break;

          context = context.parent;
        }
      }

      this._cache[name] = value;
    }

    if (typeof value === 'function') value = value.call(this.view);

    return value;
  };

  function Writer() {
    this.clearCache();
  }

  Writer.prototype.clearCache = function () {
    this._cache = {};
    this._partialCache = {};
  };

  Writer.prototype.compile = function (template, tags) {
    var fn = this._cache[template];

    if (!fn) {
      var tokens = exports.parse(template, tags);
      fn = this._cache[template] = this.compileTokens(tokens, template);
    }

    return fn;
  };

  Writer.prototype.compilePartial = function (name, template, tags) {
    var fn = this.compile(template, tags);
    this._partialCache[name] = fn;
    return fn;
  };

  Writer.prototype.getPartial = function (name) {
    if (!(name in this._partialCache) && this._loadPartial) {
      this.compilePartial(name, this._loadPartial(name));
    }

    return this._partialCache[name];
  };

  Writer.prototype.compileTokens = function (tokens, template) {
    var self = this;
    return function (view, partials) {
      if (partials) {
        if (typeof partials === 'function') {
          self._loadPartial = partials;
        } else {
          for (var name in partials) {
            self.compilePartial(name, partials[name]);
          }
        }
      }

      return renderTokens(tokens, self, Context.make(view), template);
    };
  };

  Writer.prototype.render = function (template, view, partials) {
    return this.compile(template)(view, partials);
  };

  /**
   * Low-level function that renders the given `tokens` using the given `writer`
   * and `context`. The `template` string is only needed for templates that use
   * higher-order sections to extract the portion of the original template that
   * was contained in that section.
   */
  function renderTokens(tokens, writer, context, template) {
    var buffer = '';

    var token, tokenValue, value;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      tokenValue = token[1];

      switch (token[0]) {
      case '#':
        value = context.lookup(tokenValue);

        if (typeof value === 'object') {
          if (isArray(value)) {
            for (var j = 0, jlen = value.length; j < jlen; ++j) {
              buffer += renderTokens(token[4], writer, context.push(value[j]), template);
            }
          } else if (value) {
            buffer += renderTokens(token[4], writer, context.push(value), template);
          }
        } else if (typeof value === 'function') {
          var text = template == null ? null : template.slice(token[3], token[5]);
          value = value.call(context.view, text, function (template) {
            return writer.render(template, context);
          });
          if (value != null) buffer += value;
        } else if (value) {
          buffer += renderTokens(token[4], writer, context, template);
        }

        break;
      case '^':
        value = context.lookup(tokenValue);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || (isArray(value) && value.length === 0)) {
          buffer += renderTokens(token[4], writer, context, template);
        }

        break;
      case '>':
        value = writer.getPartial(tokenValue);
        if (typeof value === 'function') buffer += value(context);
        break;
      case '&':
        value = context.lookup(tokenValue);
        if (value != null) buffer += value;
        break;
      case 'name':
        value = context.lookup(tokenValue);
        if (value != null) buffer += exports.escape(value);
        break;
      case 'text':
        buffer += tokenValue;
        break;
      }
    }

    return buffer;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var tree = [];
    var collector = tree;
    var sections = [];

    var token;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      switch (token[0]) {
      case '#':
      case '^':
        sections.push(token);
        collector.push(token);
        collector = token[4] = [];
        break;
      case '/':
        var section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : tree;
        break;
      default:
        collector.push(token);
      }
    }

    return tree;
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];
      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          lastToken = token;
          squashedTokens.push(token);
        }
      }
    }

    return squashedTokens;
  }

  function escapeTags(tags) {
    return [
      new RegExp(escapeRe(tags[0]) + "\\s*"),
      new RegExp("\\s*" + escapeRe(tags[1]))
    ];
  }

  /**
   * Breaks up the given `template` string into a tree of token objects. If
   * `tags` is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. ["<%", "%>"]). Of
   * course, the default is to use mustaches (i.e. Mustache.tags).
   */
  exports.parse = function (template, tags) {
    template = template || '';
    tags = tags || exports.tags;

    if (typeof tags === 'string') tags = tags.split(spaceRe);
    if (tags.length !== 2) throw new Error('Invalid tags: ' + tags.join(', '));

    var tagRes = escapeTags(tags);
    var scanner = new Scanner(template);

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) {
          delete tokens[spaces.pop()];
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var start, type, value, chr, token;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(tagRes[0]);
      if (value) {
        for (var i = 0, len = value.length; i < len; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push(['text', chr, start, start + 1]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr == '\n') stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(tagRes[0])) break;
      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(eqRe);
        scanner.scan(eqRe);
        scanner.scanUntil(tagRes[1]);
      } else if (type === '{') {
        value = scanner.scanUntil(new RegExp('\\s*' + escapeRe('}' + tags[1])));
        scanner.scan(curlyRe);
        scanner.scanUntil(tagRes[1]);
        type = '&';
      } else {
        value = scanner.scanUntil(tagRes[1]);
      }

      // Match the closing tag.
      if (!scanner.scan(tagRes[1])) throw new Error('Unclosed tag at ' + scanner.pos);

      token = [type, value, start, scanner.pos];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        if (sections.length === 0) throw new Error('Unopened section "' + value + '" at ' + start);
        var openSection = sections.pop();
        if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        tags = value.split(spaceRe);
        if (tags.length !== 2) throw new Error('Invalid tags at ' + start + ': ' + tags.join(', '));
        tagRes = escapeTags(tags);
      }
    }

    // Make sure there are no open sections when we're done.
    var openSection = sections.pop();
    if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    tokens = squashTokens(tokens);

    return nestTokens(tokens);
  };

  // All Mustache.* functions use this writer.
  var _writer = new Writer();

  /**
   * Clears all cached templates and partials in the default writer.
   */
  exports.clearCache = function () {
    return _writer.clearCache();
  };

  /**
   * Compiles the given `template` to a reusable function using the default
   * writer.
   */
  exports.compile = function (template, tags) {
    return _writer.compile(template, tags);
  };

  /**
   * Compiles the partial with the given `name` and `template` to a reusable
   * function using the default writer.
   */
  exports.compilePartial = function (name, template, tags) {
    return _writer.compilePartial(name, template, tags);
  };

  /**
   * Compiles the given array of tokens (the output of a parse) to a reusable
   * function using the default writer.
   */
  exports.compileTokens = function (tokens, template) {
    return _writer.compileTokens(tokens, template);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  exports.render = function (template, view, partials) {
    return _writer.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  exports.to_html = function (template, view, partials, send) {
    var result = exports.render(template, view, partials);

    if (typeof send === "function") {
      send(result);
    } else {
      return result;
    }
  };

  return exports;

}())));

/**
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/

/**
* Create a cookie with the given name and value and other optional parameters.
*
* @example $.cookie('the_cookie', 'the_value');
* @desc Set the value of a cookie.
* @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
* @desc Create a cookie with all available options.
* @example $.cookie('the_cookie', 'the_value');
* @desc Create a session cookie.
* @example $.cookie('the_cookie', null);
* @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
*       used when the cookie was set.
*
* @param String name The name of the cookie.
* @param String value The value of the cookie.
* @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
* @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
*                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
*                             If set to null or omitted, the cookie will be a session cookie and will not be retained
*                             when the the browser exits.
* @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
* @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
* @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
*                        require a secure protocol (like HTTPS).
* @type undefined
*
* @name $.cookie
* @cat Plugins/Cookie
* @author Klaus Hartl/klaus.hartl@stilbuero.de
*/

/**
* Get the value of a cookie with the given name.
*
* @example $.cookie('the_cookie');
* @desc Get the value of a cookie.
*
* @param String name The name of the cookie.
* @return The value of the cookie.
* @type String
*
* @name $.cookie
* @cat Plugins/Cookie
* @author Klaus Hartl/klaus.hartl@stilbuero.de
*/
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // NOTE Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


// SERVICE API

var serviceApi = null;

var ServiceAPI = Class({
    Instance: function () { return this; },
    services: null,
    controllers: null,
    profile: null,
    tracker: null,
    Profile: Class({
        geo: null,
        uuid: null,
        localAttributeCodes: {
            serviceApiAtts: "serviceApiAtts",
            geoLat: "geoLat",
            geoLong: "geoLong",
            colorBackgroundHighlight: "colorBackgroundHighlight",
            colorHighlight: "colorHighlight"
        },
        localAttributes: null, //{},
        getLocation: function () {
            /*
            if (!this.hasAttribute(this.localAttributeCodes.geoLat)
                || !this.hasAttribute(this.localAttributeCodes.geoLong)) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function (position) {
                            // Did we get the position correctly?
                            // alert (position.coords.latitude);
                            // To see everything available in the position.coords array:
                            // for (key in position.coords) {alert(key)}
                            //mapServiceProvider(position.coords.latitude,position.coords.longitude);
                            this.geo = position;
                            ServiceAPI.Instance.profile.setGeoLat(position.coords.latitude);
                            ServiceAPI.Instance.profile.setGeoLong(position.coords.longitude);
                        },
                        // next function is the error callback
                        function (error) {
                            switch (error.code) {
                                case error.TIMEOUT:
                                    ServiceAPI.Instance.util.log('Timeout');
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    ServiceAPI.Instance.util.log('Position unavailable');
                                    break;
                                case error.PERMISSION_DENIED:
                                    ServiceAPI.Instance.util.log('Permission denied');
                                    break;
                                case error.UNKNOWN_ERROR:
                                    ServiceAPI.Instance.util.log('Unknown error');
                                    break;
                            }
                        }
                    );
                } else {
                    // no loc
                }
            }
            */
        },
        initAttributes: function () {
            if (this.localAttributes == null) {
                this.localAttributes = JSON.parse($.cookie(this.localAttributeCodes.serviceApiAtts));
            }
            if (this.localAttributes == null) {
                this.localAttributes = {};
            }
        }
        ,
        hasAttribute: function (att) {
            this.initAttributes();
            if (this.localAttributes != null) {
                if (this.localAttributes[att] != null) {
                    if (!ServiceAPI.Instance.util.isNullOrEmptyString(att)) {
                        return true;
                    }
                }
            }
            return false;
        },
        getAttribute: function (att) {
            // get local attributes
            // get server attributes
            var attValue = null;
            this.initAttributes();
            if (this.hasAttribute(att)) {
                attValue = this.localAttributes[att];
            }
            return attValue;
        },
        setAttribute: function (att, val) {
            // set local cookies if client side needed
            // set on server.
            this.initAttributes();
            this.localAttributes[att] = val;
            $.cookie(this.localAttributeCodes.serviceApiAtts, JSON.stringify(this.localAttributes), { expires: 7, path: '/' });
        },

        setCustomColorHighlight: function (val) {
            this.setAttribute(this.localAttributeCodes.colorHighlight, val);
        },
        getCustomColorHighlight: function () {
            return this.getAttribute(this.localAttributeCodes.colorHighlight);
        },
        setCustomColorBackgroundHighlight: function (val) {
            this.setAttribute(this.localAttributeCodes.colorBackgroundHighlight, val);
        },
        getCustomColorBackgroundHighlight: function () {
            return this.getAttribute(this.localAttributeCodes.colorBackgroundHighlight);
        },

        setGeoLat: function (val) {
            this.setAttribute(this.localAttributeCodes.geoLat, val);
        },
        getGeoLat: function () {
            return this.getAttribute(this.localAttributeCodes.geoLat);
        },
        setGeoLong: function (val) {
            this.setAttribute(this.localAttributeCodes.geoLong, val);
        },
        getGeoLong: function () {
            return this.getAttribute(this.localAttributeCodes.geoLong);
        },

        loginFacebook: function () {
            /*
            FB.login(function (response) {
                if (response.authResponse) {
                    //console.log('Welcome!  Fetching your information.... ');
                    FB.api('/me', function (response) {
                        var name = response.name;
                        if (name) {
                            var namearr = name.split(' ');
                            var namefirst = namearr[0];
                            var namelast = "";
                            if (namearr.length > 1) {
                                namelast = namearr[1];
                            }

                            $("#name-first").html(namefirst);
                            $("#name-last").html(namelast);
                        }

                        //console.log('Good to see you, ' + response.name + '.');
                    });
                } else {
                    //console.log('User cancelled login or did not fully authorize.');
                }
            }, { scope: 'email,user_likes' });
        */
        }
    }),
    Tracker: Class({
        setAccount: function(account_id) {
	    try {
		if (ga) {
		    ga('create', account_id);  // Creates a tracker.
		}
	    }
	    catch(e) {
	    }
	    try {
		if (!ServiceAPI.Instance.util.isNullOrEmpty(_gaq)) {
		    _gaq.push(['_setAccount', account_id]);
		}
	    }
	    catch(e) {
	    }
        },  
        trackPageView: function(opt_url) {
	    try {
		if (ga) {
		    ga('send', 'pageview');
		}
	    }
	    catch(e) {
	    }
	    try {	    
		if (!ServiceAPI.Instance.util.isNullOrEmpty(_gaq)) {
		    _gaq.push(['_trackPageview', opt_url]);
		}
	    }
	    catch(e) {
	    }
        },        
        trackEvent: function(category, action, opt_label, opt_value) {
	    
	    try {
		if (ga) {
		    if (ServiceAPI.Instance.util.isNullOrEmptyString(opt_label)) {
			opt_label = 'default';
		    }
		    if (ServiceAPI.Instance.util.isNullOrEmptyString(opt_value)) {
			opt_value = 1;
		    }
		    ga('send', 'event', category, action, opt_label, opt_value);  // value is a number.
		    ServiceAPI.Instance.util.log('trackEvent:ga:',
						 ' category:' + category + 
						 ' action:' + action + 
						 ' opt_label:' + opt_label + 
						 ' opt_value:' + opt_value);
		}	
	    }
	    catch(e) {
	    }
	    try {
		if (!ServiceAPI.Instance.util.isNullOrEmpty(_gaq)) {
		    //_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
		    _gaq.push(['_trackEvent', category, action, opt_label, opt_value]);
		     ServiceAPI.Instance.util.log('trackEvent:gaq:',
						 ' category:' + category + 
						 ' action:' + action + 
						 ' opt_label:' + opt_label + 
						 ' opt_value:' + opt_value);
		}	
	    }
	    catch(e) {
	    }
        },
	trackEventCRM: function(action, label, val) {
	    ServiceAPI.Instance.tracker.trackEvent(
		"crm-number-campaign:" + action, action+":"+label, label, 1);	
	}
    }),
    Utility: Class({
        log: function (key, val) {
            if (window.console) {
                console.log(key, val);
            }
        },
        renderWrapTagStyles: function (tag, content, styles) {
            return '<' + tag + ' class="' + styles + '">' + content + '</' + tag + '>';
        },
        renderWrapTagStylesId: function (tag, content, styles, id) {
            return '<' + tag + ' id="' + id + '" class="' + styles + '">' + content + '</' + tag + '>';
        },
        renderWrapTag: function (tag, content) {
            return '<' + tag + '>' + content + '</' + tag + '>';
        },
        formatDatePrettyString: function (dt) {
            return moment(dt, 'YYYY-MM-DDTHH:mm:ss.SSS Z').fromNow();
        },
        isNullOrEmptyString: function (obj) {
            if (obj == null
                    || obj == ""
                    || obj == 'undefined') {
                return true;
            }
            return false;
        },
        isNullOrEmpty: function (obj) {
            if ((obj == null
                    || obj == ""
                    || obj == 'undefined')
                && obj != false) {
                return true;
            }
            return false;
        },
        stripToAlphanumerics: function (str) {
            str = str.replace(/[^\w\s]|/g, "");
            //.replace(/\s+/g, " ");
            return str;
        },
        toLower: function (str) {
            return str.toLowerCase();
        },
        filterToUrlFormat: function (str) {
            str = this.strip_to_alphanumerics(str);
            str = this.to_lower(str);
            str = str.replace("_", "-");
            str = str.replace(" ", "-");
            return str;
        },
        getObjectValue: function (obj, key) {
            if (!this.isNullOrEmpty(obj)) {
                if (!isNullOrEmpty(obj[key])) {
                    return obj[key];
                }
            }
            return "";
        },
        fillObjectValue: function (strtofill, obj, key, param) {
            if (!this.isNullOrEmpty(obj[key])) {
                if (key != "div")
                    strtofill += param + obj[key];
            }
            return strtofill;
        },
        getUrlParamValue: function (href, key) {
            var value = "";
            if (href.indexOf(key + "/") > -1) {
                var params = href.split("/");
                for (var i = 0; i < params.length; i++) {
                    if (params[i] == key) {
                        if (params[i + 1] != null) {
                            value = params[i + 1];
                        }
                    }
                }
            }
            return value;
        },
        changeUrlToState: function (href, param, paramvalue) {
            var _returnurl = "";
            if (href.indexOf(param) > -1) {
                // hash contains param, just update
                var _params = href.split(this.param_value_separator);
                for (var i = 0; i < _params.length; i++) {
                    if (_params[i] == param) {
                        _params[i + 1] = paramvalue;
                    }
                }
                _returnurl = _params.join(this.param_value_separator);
            } else {
                // has not present, append it
                if (href.indexOf(param + this.param_value_separator) == -1) {
                    if (href.lastIndexOf(this.param_value_separator) == href.length - 1)
                        href = href.substr(0, href.length - 1);
                    _returnurl = href + this.param_value_separator + param + this.param_value_separator + paramvalue;
                }
            }
            return _returnurl;
        },
        endsWithSlash: function (str) {
            return str.match(/\/$/);
        },
        isAbsoluteUrl: function (check) {
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            return this.regexMatch(check, expression);
        },
        regexMatch: function (check, expression) {
            var regex = new RegExp(expression);
            var t = check;
            if (t.match(regex)) {
                return true;
            }
            else {
                return false;
            }
        },
        baseEncode: function (str, radix) {
            return (str).toString(radix);
        },        
        baseDecode: function (str, radix) {
            return parseInt(str, radix);
        },
        base36Encode: function (str) {
            return this.baseEncode(str, 36);
        },
        base36Decode: function (str) {
            return this.baseEncode(str, 36);
        },
        base64Encode: function (str) {
            return this.baseEncode(str, 64);
        },
        shortCode: function (str) {	    
            return this.base36Encode(crc32(b64_sha1(str)+'='));
        },
        loadContent: function (div, url) {
            if ($(div) != null) {
                $(div).load(url, function () {
		
                    ServiceAPI.Instance.log('Content Loaded: ' + div + ' url:' + url);
                });
            }
        }
    }),
    Controllers: Class({
        uiController: null,
        apiController: null,
        UIController: Class({
            screenHeight: null,
            screenWidth: null,
            fpsLabel: null,
            offscreenLeft: -3500, // left css
            offscreenRight: -3500, // right css
            offscreenTop: -3500,
            offscreenBottom: 50000,

            profileBackground: "light",
            profilColor: "red",
            currentPanel: "",
            currentEffect: 'wave-top-left',
            currentViewData: {
                section: 'map',
                elevation: 'country',
                tileData: [],
                title: 'Select a Region',
                description: 'Select a Region',
                code: 'us',
                displayCode: 'US'
            },

            customBrandedBackgroundItems: [
                "#tile-settings",
                "#tile-overlay-info",
                ".panel-results-tile",
                "#panel-info-header",
                "#tile-search",
                "#tile-brand",
                "#tile-logo"
            ],
            customBrandedItems: [
                "#title-section"
            ],
            customColorBackgroundClasses: [
                "color-background-brand-red",
                "color-background-brand-pink",
                "color-background-brand-lightblue",
                "color-background-brand-darkblue",
                "color-background-brand-teal"
            ],
            customColorClasses: [
                "color-brand-red",
                "color-brand-pink",
                "color-brand-lightblue",
                "color-brand-darkblue",
                "color-brand-teal"
            ],
            initialize: function () {
                //this.initDev();
                //this.loadContentStart();
            },
            setContext: function (title, indicatorCode) {
                $('#title-section').text(title);
                $('#tile-indicator').text(indicatorCode);
            },
            togglePanel: function (div) {
                if ($(div).hasClass('closed-right')) {
                    hidePanel(div);
                }
                else {
                    showPanel(div);
                }
            },
            showPanel: function (div) {
                if ($(div).hasClass('closed-right')) {
                    $(div).removeClass('closed-right');
                }
            },
            hidePanel: function (div) {
                
                if (!$(div).hasClass('closed-right')) {
                    $(div).addClass('closed-right');
                }
            },
            presentPanel: function (name) {
                this.hidePanel("#panel-login");
                this.hidePanel("#panel-login");

                if (name != "settings")
                    this.hidePanel("#panel-settings");
                if (name != "login")
                    this.hidePanel("#panel-login");
                if (name != "info")
                    this.hidePanel("#panel-info");
                if (name != "results")
                    this.hidePanel("#panel-results");
                if (name != "filters")
                    this.hidePanel("#panel-filters");

                if (this.currentPanel == name) {
                    this.hidePanel("#panel-" + name);
                    this.currentPanel = "";
                    return;
                }

                ServiceAPI.Instance.log("presentPanel", "#panel-" + name);

                this.showPanel("#panel-" + name);
                this.currentPanel = name;
            },
            toggleSettings: function () {
                this.togglePanel("#panel-settings");
            },
            toggleResults: function () {
                this.togglePanel("#panel-results");
            },
            toggleInfo: function () {
                this.togglePanel("#panel-info");
            },
            toggleFilters: function () {
                this.togglePanel("#panel-filters");
            },
            showSettings: function () {
                this.showPanel("#panel-settings");
            },
            showResults: function () {
                this.showPanel("#panel-results");
            },
            showInfo: function () {
                this.showPanel("#panel-info");
            },
            showFilters: function () {
                this.showPanel("#panel-filters");
            },
            hideSettings: function () {
                this.hidePanel("#panel-settings");
            },
            hideResults: function () {
                this.hidePanel("#panel-results");
            },
            hideInfo: function () {
                this.hidePanel("#panel-info");
            },
            hideFilters: function () {
                this.hidePanel("#panel-filters");
            },
            adjustCurrentLayoutToScreen: function () {
                this.screenHeight = $(window).height();
                this.screenWidth = $(window).width();
            },
            applyClass: function (div, klass) {
                if (!$(div).hasClass(klass)) {
                    $(div).addClass(klass);
                }
            },
            removeClass: function (div, klass) {
                if ($(div).hasClass(klass)) {
                    $(div).removeClass(klass);
                }
            },
            changeCSS: function (myclass, element, value) {
                var CSSRules = null;
                if (document.getElementById) {
                    CSSRules = 'cssRules'
                }
                if (CSSRules) {
                    for (var i = 0; i < document.styleSheets[0][CSSRules].length; i++) {
                        if (document.styleSheets[0][CSSRules][i].selectorText == myclass) {
                            document.styleSheets[0][CSSRules][i].style[element] = value
                        }
                    }
                }
            },
            toggleLoginContainer: function () {
                if ($("#login-container .card").hasClass('flip')) {
                    $("#login-container .card").removeClass('flip');
                } else {
                    $("#login-container .card").addClass('flip');
                }
            },

            initColors: function () {
                // find all colored divs and apply colors
                ServiceAPI.Instance.log("initColors", "");

                this.applyClass("html", "color-background-light");
                this.applyClass("body", "color-background-light");

                //applyClass("#tile-settings", "color-background-highlight");
                this.applyClass("#tile-settings", "color-light");
                
                //applyClass("#tile-search", "color-background-highlight");
                this.applyClass("#tile-search", "color-light");

                //applyClass("#tile-brand", "color-background-highlight");
                this.applyClass("#tile-brand", "color-highlight");

                //applyClass("#tile-section h1", "color-highlight");

                //applyClass("#tile-logo", "color-background-highlight");

                this.applyClass("#tile-indicator", "color-background-black");
                this.applyClass("#tile-indicator", "color-light");

                this.applyClass(".panel-background", "color-background-dark");
                this.applyClass(".panel-background", "opacity90");


                this.applyClass(".panel-background-overlay", "color-background-light");
                this.applyClass(".panel-background-overlay", "opacity90");
                //opacity90

                this.profileColor = ServiceAPI.Instance.profile.getCustomColorHighlight();
                this.profileBackground = ServiceAPI.Instance.profile.getCustomColorBackgroundHighlight();

                if (this.profileColor == null) {
                    this.profileColor = "red";
                }

                if (this.profileBackground == null) {
                    this.profileBackground = "light";
                }

                this.changeBackground(this.profileBackground);
                this.changeHighlight(this.profileColor);
            },

            initDev: function () {
                // add a text object to output the current FPS:
                //this.fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#555");
                //this.fpsLabel.x = 10;
                //this.fpsLabel.y = 20;
            },

            initCustomElements: function () {
                // Handle user customize
                /*
                this.initColors();

                $('#button-accent-red').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("red");
                });

                $('#button-accent-pink').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("pink");
                });

                $('#button-accent-lightblue').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("lightblue");
                });

                $('#button-accent-darkblue').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("darkblue");
                });

                $('#button-accent-teal').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeHighlight("teal");
                });

                $('#button-background-dark').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeBackground("dark");
                });

                $('#button-background-light').on("click", function (e) {
                    ServiceAPI.Instance.controllers.uiController.changeBackground("light");
                });
                */
            },

            changeSection: function (url, title, description, code, section, elevation, displayCode, tileData) {
                this.currentViewData.url = url;
                this.currentViewData.title = title;
                this.currentViewData.description = description;
                this.currentViewData.code = code;
                this.currentViewData.section = section;
                this.currentViewData.elevation = elevation;
                this.currentViewData.tileData = tileData;
                this.currentViewData.displayCode = displayCode;

                this.pushHistoryState(this.currentViewData, title, url);

                this.loadHistoryState(this.currentViewData);
            },
            loadHistoryState: function (viewData) {
                if (viewData != null) {
                    this.setContext(viewData.title, viewData.displayCode.toUpperCase());
                    ServiceAPI.Instance.controllers.templateController.currentMapLevel = viewData.elevation;
                    ServiceAPI.Instance.controllers.templateController.currentMapCode = viewData.code;
                }
                else {
                    ServiceAPI.Instance.log("viewData was null");
                }


                ServiceAPI.Instance.controllers.canvasController.drawMap();

                // loadContent(location.pathname);
            },
            pushHistoryState: function (data, title, url) {
                // HISTORY.PUSHSTATE
                if (Modernizr.history) {
                    // pushState is supported!
                    history.pushState(data, title, url);
                }
            },
            initHistoryState: function () {
                // $('a').click(function (e) {
                //    //$("#loading").show();
                //    href = $(this).attr("href");
                //loadContent(href);
                //    pushHistoryState(currentViewData, href, href);
                //window.history.pushState(data, "Title", "/new-url");
                //    e.preventDefault();
                //});

                window.onpopstate = function (event) {
                    ////S////////erviceAPI.Instance.controllers.uiController.loadHistoryState(event.state);

                    ///$("#loading").show();
                    ServiceAPI.Instance.log("pathname: " + location.pathname);
                };
            },
            initPlacement: function () {
                //var panelLogin = $("#panel-login");
                // TweenLite.from(panelLogin, 3, { css: { rotationY: .5 }, ease: Power3.easeOut });
                //TweenLite.to(panelLogin, 0, { css: { left: this.offscreenLeft }, ease: Power3.easeIn });
                //TweenLite.to(panelLogin, 2, { css: { left: 0, opacity: 1.0 }, ease: Power3.linear, delay: 0 });
                //TweenLite.to(panelLogin, 1, { css: { rotationY: 180 }, ease: Power3.linear, delay: 2 });

                //var tileLoader = $("#tile-loader");
                //TweenLite.to(tileLoader, 1, { css: { opacity: 0.0 }, ease: Power3.linear, delay: 2 });
                //TweenLite.to(tileLoader, 0, { css: { left: -5500 }, ease: Power3.easeIn, delay: 5 });

                //var holderAppTopLeftContainer = $("#holder-app-top-left-container");
                //TweenLite.to(holderAppTopLeftContainer, 0, { css: { left: -1000 }, ease: Power3.easeIn });
                //TweenLite.to(holderAppTopLeftContainer, 1, { css: { left: 0 }, ease: Power3.easeIn, delay: 3 });

                ///var holderAppTopRightContainer = $("#holder-app-top-right-container");
                //TweenLite.to(holderAppTopRightContainer, 0, { css: { right: -1000 }, ease: Power3.easeIn });
                //TweenLite.to(holderAppTopRightContainer, 1, { css: { right: 0 }, ease: Power3.easeIn, delay: 3 });
                //TweenLite.to(holderAppTopRightContainer, 1, { css: { right: 0 }, ease: Power3.easeIn, delay: 4, onComplete: this.toggleLoginContainer });

                //TweenLite.to(panelLogin, 1, { css: { scaleX: 1.5, scaleY: 1.5 }, ease: Power3.easeIn, delay: 6});

                //setTimeout(toggleLoginContainer, 9000);
            },

            changeBackground: function (profileTo) {
                ServiceAPI.Instance.log("changing highlight to:" + profileTo);
                ServiceAPI.Instance.profile.setCustomColorBackgroundHighlight(profileTo);
                this.profileBackground = profileTo;

                if (profileTo == "light") {
                    // do white

                    // remove

                    this.removeClass("html", "color-background-highlight");
                    this.removeClass("body", "color-background-highlight");

                    this.removeClass("#tile-indicator", "color-background-light");
                    this.removeClass("#tile-indicator", "color-dark");


                    this.removeClass("#panel-results-header", "color-background-light");
                    this.removeClass("#panel-results-header", "color-dark");

                    // apply

                    this.applyClass("html", "color-background-light");
                    this.applyClass("body", "color-background-light");

                    // indicator

                    this.applyClass("#tile-indicator", "color-background-black");
                    this.applyClass("#tile-indicator", "color-light");


                    this.applyClass("#panel-results-header", "color-background-black");
                    this.applyClass("#panel-results-header", "color-light");
                }
                else {
                    // do dark

                    // remove

                    this.removeClass("html", "color-background-light");
                    this.removeClass("body", "color-background-light");

                    this.removeClass("#tile-indicator", "color-background-black");
                    this.removeClass("#tile-indicator", "color-light");


                    this.removeClass("#panel-results-header", "color-background-black");
                    this.removeClass("#panel-results-header", "color-light");


                    // apply

                    this.applyClass("html", "color-background-dark");
                    this.applyClass("body", "color-background-dark");

                    // indicator

                    this.applyClass("#tile-indicator", "color-background-light");
                    this.applyClass("#tile-indicator", "color-dark");

                    this.applyClass("#panel-results-header", "color-background-light");
                    this.applyClass("#panel-results-header", "color-dark");
                }

                //ServiceAPI.Instance.controllers.canvasController.drawMap();
            },
            removeCurrentBackgroundHighlights: function () {
                for (var i = 0; i < this.customBrandedBackgroundItems.length; i++) {
                    ServiceAPI.Instance.log("customBrandedBackgroundItems:", this.customBrandedBackgroundItems[i]);
                    for (var j = 0; j < this.customColorBackgroundClasses.length; j++) {
                        ServiceAPI.Instance.log("customColorBackgroundClasses:", this.customColorBackgroundClasses[j]);
                        this.removeClass(this.customBrandedBackgroundItems[i], this.customColorBackgroundClasses[j]);
                    }
                }
            },

            removeCurrentColorHighlights: function () {
                for (var i = 0; i < this.customBrandedItems.length; i++) {
                    ServiceAPI.Instance.log("customBrandedItems:", this.customBrandedItems[i]);
                    for (var j = 0; j < this.customColorClasses.length; j++) {
                        ServiceAPI.Instance.log("customColorClasses:", this.customColorClasses[j]);
                        this.removeClass(this.customBrandedItems[i], this.customColorClasses[j]);
                    }
                }
            },
            applyBackgroundHighlights: function (colorTo) {
                for (var i = 0; i < this.customBrandedBackgroundItems.length; i++) {
                    var colorToClass = "color-background-brand-" + colorTo;
                    ServiceAPI.Instance.log("colorToClass:", colorToClass);
                    ServiceAPI.Instance.log("customBrandedBackgroundItems[i]:", this.customBrandedBackgroundItems[i]);
                    this.applyClass(this.customBrandedBackgroundItems[i], colorToClass);
                }
            },
            applyColorHighlights: function (colorTo) {
                for (var i = 0; i < this.customBrandedItems.length; i++) {
                    var colorToClass = "color-brand-" + colorTo;
                    ServiceAPI.Instance.log("colorToClass:", colorToClass);
                    ServiceAPI.Instance.log("customBrandedItems[i]:", this.customBrandedItems[i]);
                    this.applyClass(this.customBrandedItems[i], colorToClass);
                }
            },
            changeHighlight: function (profileTo) {
                if (profileTo == "red"
                    || profileTo == "lightblue"
                    || profileTo == "darkblue"
                    || profileTo == "pink"
                    || profileTo == "teal") {
                    ServiceAPI.Instance.log("changing highlight to:", profileTo);
                    this.removeCurrentColorHighlights();
                    this.removeCurrentBackgroundHighlights();

                    this.applyBackgroundHighlights(profileTo);
                    this.applyColorHighlights(profileTo);
                    ServiceAPI.Instance.profile.setCustomColorHighlight(profileTo);
                }
            },

            loadContentAll: function (url) {
                // USES JQUERY TO LOAD THE CONTENT
                $.getJSON(url, { cid: url, format: 'json' }, function (json) {
                    // THIS LOOP PUTS ALL THE CONTENT INTO THE RIGHT PLACES
                    $.each(json, function (key, value) {
                        $(key).html(value);
                    });
                    $("#loading").hide();
                });
            },
            loadContentStart: function () {
                ServiceAPI.Instance.util.loadContent('#tile-login', '/account/loginstart');
                //loadContent('#tile-login-extra', '/account/manage');
            },

            changeSectionData: function (level, code) {
                var tileData = ServiceAPI.Instance.controllers.templateController.getTemplateDataItem(level, code);
                this.changeSection(tileData.url, tileData.displayName, tileData.displayName, tileData.code, 'map', level, tileData.displayCode, tileData);
            },

            initTempTemplateButtons: function () {
                
                $('.transition-effect').on("click", function (e) {
                    ServiceAPI.Instance.log("click", this.id);
                    ServiceAPI.Instance.controllers.uiController.currentEffect = this.id.replace("transition-", "");
                    ServiceAPI.Instance.controllers.uiController.changeSectionData(
                        ServiceAPI.Instance.controllers.templateController.currentMapLevel,
                        ServiceAPI.Instance.controllers.templateController.currentMapCode);
                    e.preventDefault();
                });
            },
            adjustCurrentLayout: function () {
               // clearTimeout(this.adjustCurrentLayoutDelayed);
                setTimeout(this.adjustCurrentLayoutDelayed, 2000);
            },
            adjustCurrentLayoutDelayed: function () {
                this.adjustCurrentLayout();
                if (ServiceAPI.Instance.controllers.canvasController.stage)
                    ServiceAPI.Instance.controllers.canvasController.stage.clear();
                ServiceAPI.Instance.controllers.canvasController.resizeCanvas();
            },

            // --------------------------------------------------------
            // INPUT HANDLERS

            eventHandlerClick: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerClick:", evt);
            },
            eventHandlerTapOne: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerTapOne:", evt);
            },
            eventHandlerTapTwo: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerTapTwo:", evt);
            },
            eventHandlerTapThree: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerTapThree:", evt);
            },
            eventHandlertapFour: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlertapFour:", evt);
            },
            eventHandlerSwipeOne: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeOne:", evt);
            },
            eventHandlerSwipeTwo: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeTwo:", evt);
            },
            eventHandlerSwipeThree: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeThree:", evt);
            },
            eventHandlerSwipeFour: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeFour:", evt);
            },
            eventHandlerSwipeUp: function (evt) {
               // ServiceAPI.Instance.util.log("eventHandlerSwipeUp:", evt);
            },
            eventHandlerSwipeRightUp: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeRightUp:", evt);
            },
            eventHandlerSwipeRight: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeRight:", evt);
            },
            eventHandlerSwipeDown: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeDown:", evt);
            },
            eventHandlerSwipeLeftDown: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeLeftDown:", evt);
            },
            eventHandlerSwipeLeft: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeLeft:", evt);
            },
            eventHandlerSwipeLeftUp: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerSwipeLeftUp:", evt);
            },
            eventHandler: function (evt) {
               // ServiceAPI.Instance.util.log("eventHandler:", evt);
            },

            eventHandlerPinchOpen: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerPinchOpen:", evt);
            },
            eventHandlerPinchClose: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerPinchClose:", evt);
            },
            eventHandlerRotateCW: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerRotateCW:", evt);
            },
            eventHandlerRotateCCW: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerRotateCCW:", evt);
            },
            eventHandlerSwipeMove: function (evt) {
                // ServiceAPI.Instance.util.log("eventHandlerSwipeMove:", evt);
            },
            eventHandlerPinch: function (evt) {
               // ServiceAPI.Instance.util.log("eventHandlerPinch:", evt);
            },
            eventHandlerRotate: function (evt) {
                //ServiceAPI.Instance.util.log("eventHandlerRotate:", evt);
            }
        })
    }),
    Services: Class({
        apiUrlRoot: "/api/api",
        profileService: null,
        platformService: null,
        crmService: null,
        initialize: function () {
            ServiceAPI.Instance.util.log("initialized services", true);
        },
        log: function (key, val) {
            if (window.console) {
                console.log(key, val);
            }
        },

        ProfileService: Class({
            initialize: function () {
                ServiceAPI.Instance.log("initialized profile", true);
            },
            render: function (filter) {
                this.getProfile(filter);
            },
            renderResponse: function (filter, data) {
                var rangeType = 'all';
                var page = 1;
                var pageSize = 200;

                if (filter.rangeType) {
                    rangeType = filter.rangeType;
                }
                if (filter.page) {
                    page = filter.page;
                }
                if (filter.pageSize) {
                    pageSize = filter.pageSize;
                }

                var templateHeader = '';
                var templateLayout = '';
                var templateItem = '';

                templateLayout += '<table id="item-container" class="table">';
                templateLayout += ' <tr>';
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Value', 'head-item item-head-value');
                templateLayout += ' </tr>';
                for (i = 0; i < data.data.length; i++) {
                    templateLayout += ' <tr>';
                    templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', data.data[i].value_formatted, 'item item-value');
                    templateLayout += ' </tr>';
                }
                templateLayout += '</table>';

                var view = {
                    profileType: { code: 'user', type: 'string' },
                    formatted: function () {
                        return this.profileType.type;
                    },
                    view_data: data
                };

                var output = Mustache.render(templateLayout, view);
                $(filter.div).html(output);
            },
            getProfile: function (filter) {
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/profile/" + filter.code;
                serviceUrl += "?range=" + filter.rangeType;
                serviceUrl += "&page=" + filter.page;
                serviceUrl += "&page-size=" + filter.pageSize;
                if (filter.username)
                    serviceUrl += "&username=" + filter.username;
                serviceUrl += "&format=json&callback=?";

                this.filter = filter;

                ServiceAPI.Instance.log("serviceUrl:", serviceUrl);
                $.get(serviceUrl,
                    null, this.getProfileCallback, "json");
            },
            getProfileCallback: function (data) {
                var obj = ServiceAPI.Instance.services.profile;
                var log = ServiceAPI.Instance.util.log;
                log("data", data);
                log("data.msg", data.msg);
                log("data.code", data.code);
                log("data.data", data.data);
                log("data.info", data.info);
                log("data.action", data.action);

                if (data.code > 0 || data.code.length > 1) {
                    ServiceAPI.Instance.log("ERRORS:getProfileCallback", true);
                } else {
                    ServiceAPI.Instance.log("SUCCESS:getProfileCallback", false);
                    obj.renderResponse(obj.filter, data.data);
                }
            }
        }),
        
        CRMService: Class({
            filter: null,
            initialize: function () {
                ServiceAPI.Instance.log("initialized crm", true);
            },
            showVal: function (val) {
                if (!ServiceAPI.Instance.util.isNullOrEmpty(val)) {
                    return val;
                }
                return '';
            },  
            showValBool: function (val) {
		//ServiceAPI.Instance.log('val', val);
		
		if (val == undefined || val == null) {
		    return false;
		}
		
		if (val == true
		    || val == 'true'
		    || val == 1
		    || val == '1') {
                    return true;
                }
                return false;
            },
	    getPlaceholderText: function(name) {
		var placeholder = "Type something...";
		if (name.indexOf("number") > -1) {
		    placeholder = "Phone Number";
		}
		else if (name.indexOf("referrer") > -1) {
		    placeholder = "Campaign code";
		}
		else if (name.indexOf("display_name") > -1) {
		    placeholder = "Description";
		}
		return placeholder;
	    },
	    blurEventRow: function(id) {
		this.setShortCode(id);
	    },
	    changeEventRow: function(id) {
		ServiceAPI.Instance.util.log('changeEventRow:id', id);
		$('#save-' + id).show();
		ServiceAPI.Instance.services.crmService.setShortCode(id);
		ServiceAPI.Instance.services.crmService.submitCRMNumberCampaignForm(id);
	    },
	    setShortCode: function(id) {
		var referrer = $('#referrer-' + id).val();
		//ServiceAPI.Instance.util.log('setShortCode:id', id);
		//ServiceAPI.Instance.util.log('setShortCode:referrer', referrer);
		if (ServiceAPI.Instance.util.isNullOrEmptyString(referrer)) {
		    referrer = '0';
		}
		var code = ServiceAPI.Instance.util.shortCode(referrer);
		//ServiceAPI.Instance.util.log('setShortCode:code', code);
		$('#code-' + id).html(code);
	    },
	    getChangeEvent: function(id, name) {
		var changeEvt = "ServiceAPI.Instance.services.crmService.changeEventRow('" + id + "')";

		if (name.indexOf("number") > -1) {
		}
		else if (name.indexOf("referrer") > -1) {
		}
		else if (name.indexOf("display_name") > -1) {
		}
		return changeEvt;
	    },
	    /*
	    handleTextInputEvents: function(id, name) {
		var blurEvt = this.blurEventRow();
		var changeEvt = this.changeEventRow();
                var placeholder = this.getPlaceholderText(name);
		$(name).on(function() {
		    ServiceAPI.Instance.services.crmService.getPlaceholderText(name)
		});
	    },
	    */
            showValCheckbox: function (id, name, val) {
		//ServiceAPI.Instance.log('name', val);
		var checked = '';
                if (this.showValBool(val)) {
                    checked = 'checked';
                }
		var changeEvt = this.getChangeEvent(id, name);
		var placeholder = this.getPlaceholderText(name);
		
                return '<input placeholder="' + placeholder + '" onchange="' + changeEvt + '" type="checkbox" id="' + name + '" name="' + name + '" ' + checked + '>';
            },    
            showValInput: function (id, name, val) {
		//ServiceAPI.Instance.log('name', val);
		var blurEvt = this.blurEventRow(id);
		var changeEvt = this.getChangeEvent(id, name);
                var placeholder = this.getPlaceholderText(name);
		return '<input type="text" placeholder="' + placeholder + '" onchange="' + changeEvt + '"  onblur="' + blurEvt + '" class="table-cell-input" id="' + name + '" name="' + name + '" value="' + val + '">';
            },   
            showValText: function (id, name, val) {
		var blurEvt = this.blurEventRow(id);
		var changeEvt = this.getChangeEvent(id, name);
                var placeholder = this.getPlaceholderText(name);
		return '<textarea  placeholder="' + placeholder + '" onchange="' + changeEvt + '"  onblur="' + blurEvt + '" class="table-cell-text" id="' + name + '" name="' + name + '" >' + val + '</textarea>';
            },  
            render: function (filter) {
                this.getCrmCampaignNumberMeta(filter);
            },
	    renderRow: function (id, code, referrer, display_name, phoneNumber, active) {
		var formId = id;
		var templateLayout = '';// <form name="'+ formId +'" id="'+formId+'">';
		//templateLayout += ' <input type="hidden" name="'+formId+'" id="'+formId+'">';
		templateLayout += ' <tr>';//submitCRMNumberCampaignForm
		//templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showVal(data.data[i].id), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showValInput(formId, 'referrer-' + formId, referrer), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showValText(formId, 'display_name-' + formId, display_name), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showValInput(formId, 'number-' + formId, phoneNumber), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', this.showValCheckbox(formId, 'active-' + formId, active), 'item item-value');
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', '<code><span id="code-' + formId + '">'+this.showVal(code)+'</span></code>', 'item item-value no-edit');
		
		var toolsSave =  ' <a style="display:none;" id="save-';
		toolsSave += formId
		toolsSave += '" class="btn btn-success" href="javascript:void(0);" onclick="ServiceAPI.Instance.services.crmService.submitCRMNumberCampaignForm(\''+formId+'\');">Save</a>';
		
		var toolsDelete =  ' <a id="delete-';
		toolsDelete += formId
		toolsDelete += '" class="btn btn-danger" href="javascript:void(0);" onclick="ServiceAPI.Instance.services.crmService.deleteCRMNumberCampaignDialog(\''+formId+'\');">Delete</a>';
		
		
		var toolsTest = ' <a  class="btn btn-info" href="javascript:void(0);" onclick="ServiceAPI.Instance.services.crmService.testCRMNumberCampaign(\''+formId+'\');">Test</a>';
		
		var tools = toolsTest + toolsDelete + toolsSave;
		
		templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('td', tools , 'item item-value no-edit span3');
		templateLayout += ' </tr>';
		//templateLayout += ' </form>';
		return templateLayout;
	    },
            renderResponse: function (filter, data) {
                var rangeType = 'all';
                var page = 1;
                var pageSize = 200;

                if (filter.rangeType) {
                    rangeType = filter.rangeType;
                }
                if (filter.page) {
                    page = filter.page;
                }
                if (filter.pageSize) {
                    pageSize = filter.pageSize;
                }

                var templateHeader = '';
                var templateLayout = '';
                var templateItem = '';

                templateLayout += '<table id="crm-number-campaign-meta" class="table table-hover">';
                templateLayout += ' <thead>';
                templateLayout += ' <tr>';
                //templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Id', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Campaign (URL Code)', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Source', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Phone Number', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Active', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Short Code', 'head-item item-head-value');
                templateLayout += ServiceAPI.Instance.util.renderWrapTagStyles('th', 'Actions', 'head-item item-head-value');
                templateLayout += ' </tr>';
                templateLayout += ' </thead>';
                templateLayout += ' <tbody>';
                for (i = 0; i < data.data.length; i++) {
                    var id = data.data[i].id;
                    var code = data.data[i].code;
                    var referrer = data.data[i].referrer;
                    var display_name = data.data[i].display_name;
                    var phoneNumber = data.data[i].number;
                    var active = data.data[i].active;
		    		    
		    templateLayout += this.renderRow(id, code, referrer, display_name, phoneNumber, active);
                }
                templateLayout += ' </tbody>';
                templateLayout += '</table>';
                $(filter.div).html(templateLayout);
                
                $(filter.div + " table tr td").bind("click", function dataClick(e) {
                    //console.log(e);
                    //if (e.currentTarget.innerHTML != "") return;
                    if (!$(e.currentTarget).hasClass('no-edit')) {                        
                        if(e.currentTarget.contentEditable != null){
                           // $(e.currentTarget).attr("contentEditable",true);
                        }
                        else{
                           // $(e.currentTarget).append("<input type='text'>");
                        } 
                    }   
                });
            },
	    adminAddNew: function() {
		var id = Math.uuid().toLowerCase();
		var tbl = '#crm-number-campaign-meta tbody';
		ServiceAPI.Instance.util.log('id', id);
		ServiceAPI.Instance.util.log('tbl', tbl);
		this.adminAddTemplateRow(tbl, id);
	    },
	    adminAddTemplateRow: function(tbl, id) {
		var rowTemplate = this.renderRow(id, '', '', '', '', false);
		ServiceAPI.Instance.util.log('rowTemplate', rowTemplate);
		$(tbl).prepend(rowTemplate);
	    },
	    currentDeleteId: null,
	    deleteCRMNumberCampaignAction: function() {
		
		var id = ServiceAPI.Instance.services.crmService.currentDeleteId;
		ServiceAPI.Instance.util.log('modalDelete',id);
		ServiceAPI.Instance.services.crmService.deleteCRMNumberCampaign(id);
		$('#modalDelete').modal({
		    show: false
		  });
	    },
	    testCRMNumberCampaign: function (id) {
		var referrer = $('#referrer-'+id).val();
		document.location = '/api/admin/test/?utm_content=' + referrer;
	    },
	    deleteCRMNumberCampaignDialog: function (id) {
		this.currentDeleteId = id;
		// show modal
		// delete on success
		$('#modalDelete').modal({
		    show: true
		  });
		$('#modal-delete-confirm').off('click',
				      ServiceAPI.Instance.services.crmService.deleteCRMNumberCampaignAction);
		$('#modal-delete-confirm').on('click',
				     ServiceAPI.Instance.services.crmService.deleteCRMNumberCampaignAction);
	    },
	    submitCRMNumberCampaignForm: function(fid) {
		var activeVal = $('#active-' + fid).is(":checked");
		if (activeVal) {
		    activeVal = '1';
		}
		else {
		    activeVal = '0';
		}
		var filter = {
		    code: fid,
		    values : {
			id: fid,
			active: activeVal,
			number: $('#number-' + fid).val(),
			referrer: $('#referrer-' + fid).val(),
			display_name:$('#display_name-' + fid).val()//submitCRMNumberCampaignForm
			
		    }
		};
		ServiceAPI.Instance.log('filter',filter);//$('save-" + id + "').show()
		this.setCRMNumberCampaign(filter);
	    },
	    setCRMNumberCampaign: function (filter) {		
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "" + filter.code;
                serviceUrl += "?format=json&callback=?";	
		ServiceAPI.Instance.util.log('serviceUrl', serviceUrl);
              
                $.post(serviceUrl,
                    filter.values,
		    function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.msg", data.msg);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
			
			$('#save-' + filter.code).hide();
                        ServiceAPI.Instance.util.log("ERRORS:setCRMNumberCampaign", true);
                    }
		    else {
			$('#save-' + filter.code).hide();
                        ServiceAPI.Instance.util.log("SUCCESS:setCRMNumberCampaign", false);
                        //var phoneNumber = data.data.number;
                        //if (!ServiceAPI.Instance.util.isNullOrEmptyString(phoneNumber)) {
                        //    $(filter.div).html(phoneNumber);
                        //}
                    }
                  }, "json")
		/*
                  .done(function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.message", data.message);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
                        ServiceAPI.Instance.util.log("ERRORS:getCRMNumberByCampaignReferrer", true);
                    } else {
                        ServiceAPI.Instance.util.log("SUCCESS:getCRMNumberByCampaignReferrer", false);
                        var phoneNumber = data.data.number;
                        if (!ServiceAPI.Instance.util.isNullOrEmptyString(phoneNumber)) {
                            $(filter.div).html(phoneNumber);
                        }
                    }
                  });
                  */
	    },
	    deleteCRMNumberCampaign: function (id) {		
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "" + id + "/delete/";
                serviceUrl += "?format=json&callback=?";	
		ServiceAPI.Instance.util.log('serviceUrl', serviceUrl);
		
		var auth = 'deleteCRMNumberCampaign';		
		var shortCodePrep = auth+'-'+id+'-delete-crmauth';
		ServiceAPI.Instance.util.log('shortCodePrep', shortCodePrep);
		var shortCode = ServiceAPI.Instance.util.shortCode(shortCodePrep);
		ServiceAPI.Instance.util.log('shortCode', shortCode);
		var values = {
		    shortCode: shortCode,
		    auth: auth
		};
		ServiceAPI.Instance.util.log('values', values);
              
                $.post(serviceUrl,
                    values,
		    function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.msg", data.msg);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
                        ServiceAPI.Instance.util.log("ERRORS:deleteCRMNumberCampaign", true);
                    }
		    else {
                        ServiceAPI.Instance.util.log("SUCCESS:deleteCRMNumberCampaign", false);
			crm.crmAdmin();
                    }
                  }, "json")
	    },
            getCRMNumberByCampaignReferrer: function (filter) {
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "referrer/" + filter.referrer;
                serviceUrl += "?format=json&callback=?";
				
		ServiceAPI.Instance.util.log('serviceUrl', serviceUrl);
              
                $.get(serviceUrl,
                    null,
		    function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.msg", data.msg);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
                        ServiceAPI.Instance.util.log("ERRORS:getCRMNumberByCampaignReferrer", true);
                    } else {
                        ServiceAPI.Instance.util.log("SUCCESS:getCRMNumberByCampaignReferrer", false);
                        if (data.data) {			    
			    var phoneNumber = data.data.number;
			    var active = data.data.active;
			    
			    ServiceAPI.Instance.tracker.trackEventCRM(
				"phonenumber-get", phoneNumber, 1);	    
			    
			    if (ServiceAPI.Instance.services.crmService.showValBool(active)) {
				
				if (!ServiceAPI.Instance.util.isNullOrEmptyString(phoneNumber)) {
				    $(filter.el).html(phoneNumber);
				    				
				    if (!$(filter.el).hasClass('crm-fade-in')) {
					$(filter.el).addClass('crm-fade-in');
				    }
				    
				    ServiceAPI.Instance.tracker.trackEventCRM(
					"phonenumber-get-active", phoneNumber, 1);
				}	
			    }	
			}
                    }
                  }, "json");
            },
            getCRMNumberByCampaignCode: function (filter) {
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "code/" + filter.code;
                serviceUrl += "?format=json&callback=?";
				
		ServiceAPI.Instance.util.log('serviceUrl', serviceUrl);
              
                $.get(serviceUrl,
                    null,
		    function( data ) {
                    ServiceAPI.Instance.util.log("data", data);
                    ServiceAPI.Instance.util.log("data.msg", data.msg);
                    ServiceAPI.Instance.util.log("data.code", data.code);
                    ServiceAPI.Instance.util.log("data.data", data.data);
                    ServiceAPI.Instance.util.log("data.info", data.info);
                    ServiceAPI.Instance.util.log("data.action", data.action);
    
                    if (data.code > 0 || data.code.length > 1) {
                        ServiceAPI.Instance.util.log("ERRORS:getCRMNumberByCampaignCode", true);
                    } else {
                        ServiceAPI.Instance.util.log("SUCCESS:getCRMNumberByCampaignCode", false);
			if (data.data) {	
			    var phoneNumber = data.data.number;
			    var active = data.data.active;
			    ServiceAPI.Instance.tracker.trackEventCRM(
					"phonenumber-get", phoneNumber, 1);	
			    if (ServiceAPI.Instance.services.crmService.showValBool(active)) {			
				if (!ServiceAPI.Instance.util.isNullOrEmptyString(phoneNumber)) {
				    $(filter.el).html(phoneNumber);
				    if (!$(filter.el).hasClass('crm-fade-in')) {
					$(filter.el).addClass('crm-fade-in');
				    }
				    ServiceAPI.Instance.tracker.trackEventCRM(
					"phonenumber-get-active", phoneNumber, 1);
				}	
			    }
			}
                    }
                  }, "json");
            },
            getCRMNumberCampaignMeta: function (filter) {
                var serviceUrl = ServiceAPI.Instance.services.apiUrlRoot;
                serviceUrl += "/crm/crm-number-campaign-meta/";
                serviceUrl += "?range=" + filter.rangeType;
                serviceUrl += "&page=" + filter.page;
                serviceUrl += "&page-size=" + filter.pageSize;
                if (filter.username)
                    serviceUrl += "&code=" + filter.code;
                serviceUrl += "&format=json&callback=?";

                this.filter = filter;

                ServiceAPI.Instance.log("serviceUrl:", serviceUrl);
                $.get(serviceUrl,                    
                    null, this.getCRMNumberCampaignMetaCallback, "json");
            },
            getCRMNumberCampaignMetaCallback: function (data) {
                var obj = ServiceAPI.Instance.services.crmService;
                var log = ServiceAPI.Instance.util.log;
                log("data", data);
                log("data.msg", data.msg);
                log("data.code", data.code);
                log("data.data", data.data);
                log("data.info", data.info);
                log("data.action", data.action);

                if (data.code > 0 || data.code.length > 1) {
                    ServiceAPI.Instance.log("ERRORS:getCRMNumberCampaignMetaCallback", true);
                } else {
                    ServiceAPI.Instance.log("SUCCESS:getCRMNumberCampaignMetaCallback", false);
                    obj.renderResponse(obj.filter, data);
                }
            }
        })
    }),
    initialize: function () {
        ServiceAPI.Instance = this;
        this.Instance = this;
        
        this.initLibs();

        this.util = new this.Utility();
        this.profile = new this.Profile();
        this.profile.initAttributes();
        
        this.tracker = new this.Tracker();

        this.services = new this.Services();
        this.services.profileService = new this.services.ProfileService();
        this.services.crmService = new this.services.CRMService();

        this.controllers = new this.Controllers();
        this.controllers.uiController = new this.controllers.UIController();

        //this.log("initialized ServiceAPI", true);

        this.startUp();

        this.log("started up ServiceAPI");
    },
    startUp: function () {
        
        //var generalbrand = 'generalbrand';
        //ServiceAPI.Instance.util.log('generalbrand:', ServiceAPI.Instance.util.shortCode(generalbrand));
        
        //var weightloss = 'weightloss';
        //ServiceAPI.Instance.util.log('weightloss:', ServiceAPI.Instance.util.shortCode(weightloss));
        
        //var tucsonlenoxunbranded = 'tucsonlenoxunbranded';
        //ServiceAPI.Instance.util.log('tucsonlenoxunbranded:', ServiceAPI.Instance.util.shortCode(tucsonlenoxunbranded));
        
        //$(window).bind("resize", this.controllers.uiController.adjustCurrentLayout);
        // init user/geo
        //this.profile.getLocation();
        /*
        // social client - to use in javascript if needed
        FB_APP_ID = "461074897268600056";
        window.fbAsyncInit = function () {
            FB.init({
                appId: FB_APP_ID, // App ID
                channelUrl: '/channel.html', // Channel File
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                oauth: true, // enable OAuth 2.0
                xfbml: true  // parse XFBML
            });

            FB.api('/me', function (response) {
                var name = response.name;
                if (name) {
                    var namearr = name.split(' ');
                    var namefirst = namearr[0];
                    var namelast = "";
                    if (namearr.length > 1) {
                        namelast = namearr[1];
                    }

                    $("#name-first").html(namefirst);
                    $("#name-last").html(namelast);
                }
            });

            // Additional initialization code here

            var info = document.getElementById('profile-info'),
                update = function (response) {
                    if (info) {
                        info.innerHTML = "";
                    }
                    if (response.status != 'connected') {
                        $('#login-button').show();
                        return;
                    }

                    //facebook_login();

                    FB.api(
                        {
                            method: 'fql.query',
                            query: 'SELECT name, pic_square FROM user WHERE uid=' + response.authResponse.userID
                        },
                        function (response) {
                            if (info) {
                                info.innerHTML = '<span><img id="profile-image-icon" src="' + response[0].pic_square + '"></span><span id="profile-name">' + response[0].name + '<span id="profile-logout">(<a href="#" id="profile-logout-link">logout</a>)</span></span>';
                            }

                            $('#login-button').hide();
                            // onLoggedIn();
                        }
                    );
                };

            comment_created = function (response) {
                ServiceAPI.Instance.util.log("comment_created_response:", response);
                //updateLiveConversations();
                //updateLatestComments();
                //loadCommentCounts();
            }; // update on login, logout, and once on page load
            FB.Event.subscribe('auth.login', update);
            FB.Event.subscribe('auth.logout', update);
            FB.Event.subscribe('comment.create', comment_created);
            FB.getLoginStatus(update);

            ServiceAPI.Instance.util.log("fb prep:", 1);
        };
            */
        /*
        // Load the SDK's source Asynchronously
        (function (d, debug) {
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
            ref.parentNode.insertBefore(js, ref);
        }(document, false));
        */

        $('html').bind('tapone', this.controllers.uiController.eventHandlerTapOne);
        $('html').bind('taptwo', this.controllers.uiController.eventHandlerTapTwo);
        $('html').bind('tapthree', this.controllers.uiController.eventHandlerTapThree);
        $('html').bind('tapfour', this.controllers.uiController.eventHandlerTapFour);

        $('html').bind('swipeone', this.controllers.uiController.eventHandlerSwipeOne);
        $('html').bind('swipetwo', this.controllers.uiController.eventHandlerSwipeOne);
        $('html').bind('swipethree', this.controllers.uiController.eventHandlerSwipeOne);
        $('html').bind('swipefour', this.controllers.uiController.eventHandlerSwipeOne);

        $('html').bind('swipeup', this.controllers.uiController.eventHandlerSwipeUp);
        $('html').bind('swiperightup', this.controllers.uiController.eventHandlerSwipeRightUp);
        $('html').bind('swiperight', this.controllers.uiController.eventHandlerSwipeRight);
        $('html').bind('swiperightdown', this.controllers.uiController.eventHandlerSwipeRightDown);

        $('html').bind('swipedown', this.controllers.uiController.eventHandlerSwipeDown);
        $('html').bind('swipeleftdown', this.controllers.uiController.eventHandlerSwipeLeftDown);
        $('html').bind('swipeleft', this.controllers.uiController.eventHandlerSwipeLeft);
        $('html').bind('swipeleftup', this.controllers.uiController.eventHandlerSwipeLeftUp);

        $('html').bind('pinchopen', this.controllers.uiController.eventHandlerPinchOpen);
        $('html').bind('pinchclose', this.controllers.uiController.eventHandlerPinchClose);
        $('html').bind('rotatecw', this.controllers.uiController.eventHandlerRotateCW);
        $('html').bind('rotateccw', this.controllers.uiController.eventHandlerRotateCCW);
        $('html').bind('swipeone', this.controllers.uiController.eventHandlerSwipeOne);
        $('html').bind('swipemove', this.controllers.uiController.eventHandlerSwipeMove);
        $('html').bind('pinch', this.controllers.uiController.eventHandlerPinch);
        $('html').bind('rotate', this.controllers.uiController.eventHandlerRotate);

        /* CARD FLIP
     /////////////////////////////////////////////////////////////////*/
        $('.card .front').append('<span class="flip_back"></span>');
        $('.card .back').append('<span class="flip_front"></span>');

        this.controllers.uiController.initHistoryState();
    },
    log: function (key, val) {
        if (window.console) {
            console.log(key, val);
        }
    },
    // CUSTOM
    hasProfileAttribute: function(code) {
        return ServiceAPI.Instance.profile.hasAttribute(code);
    },
    getProfileAttribute: function(code) {
        return ServiceAPI.Instance.profile.getAttribute(code);        
    },
    setProfileAttribute: function(code, val) {
        return ServiceAPI.Instance.profile.setAttribute(code, val);        
    },
    syncCRMReferrer: function() {
      var referrer = $.query.get('utm_content');
      if (ServiceAPI.Instance.util.isNullOrEmptyString(referrer)) {
          referrer = '';
	  
	    ServiceAPI.Instance.tracker.trackEventCRM(
					"referrer", "no-referrer-or-inner-page", 1);
	    
	    var previousReferrer = this.getProfileAttribute('utm_content');
	    if (ServiceAPI.Instance.util.isNullOrEmptyString(previousReferrer)) {
		ServiceAPI.Instance.tracker.trackEventCRM(
		    "referrer-return", previousReferrer, 1);		
	    }	
      }
      else {
          ServiceAPI.Instance.log('updatingReferrer:', referrer);  
	    
          var shortCode = ServiceAPI.Instance.util.shortCode(referrer);	  
	    
          this.setProfileAttribute('crm-code', shortCode);
          this.setProfileAttribute('utm_content', referrer);
	  
	    ServiceAPI.Instance.tracker.trackEventCRM(
					"shortCode", shortCode, 1);
	    ServiceAPI.Instance.tracker.trackEventCRM(
					"referrer-landed", referrer, 1);
      }
      return referrer;
    },
    updateCRMNumberCampaigns: function() {
        var crmTags= ['.crm-number'];
	this.updateCRMNumberCampaignTags(crmTags);
    },
    updateCRMNumberCampaignTags: function(crmClassTags) {
      // for each placholder, update number by campaign if exists
      
	//var crmTags = {
	//  tagsDynamicNumberNames: ['.crm-number']
	// };
	//serviceApi.updateCRMNumberCampaigns(crmTags);
      
      // TURNING ON/OFF CRM DYNAMIC NUMBER REPLACEMENT in HTML/BLOCKS
      // The class 'crm-number' is the switch to turn on/off crm services on a placeholder
      // By default if no cookies found it keeps the existing placeholder number
      // If there are cookies it swaps out the placeholder if the campaign is still active
      // Adding data-crm-type="dynamic" is not required as it is the default.
      // Both tags below would be updated dynamically with the cookie/campaign if exists on a
      // page with the services api javascript library (it's on every page on drupal at the bottom
      // after google analytics).
      // <span class="crm-number" data-crm-type="dynamic">888-555-9000</span>
      // <span class="crm-number">888-555-9000</span>
      //
      // OVERRIDES DEFAULT DYNAMIC NUMBER AND SHUTS IT OFF, KEEPING EXISTING NUMBER
      // Not using the class or applying the class 'crm-number' and 'data-crm-type' equal to 'override'
      // prevents this placeholder from being updated by the default dynamic replacement
      // for inner sections of the site.
      // <span class="someotherclass">888-555-9000</span>
      // <span class="crm-number" data-crm-type="override">888-555-9000</span>
      //
      // CALLS CRM NUMBER SERVICE BUT OVERRIDES WITH A SPECIFIC CODE OR REFERRER
      // Calling a specific code and overriding the default dyanmic replacement by cookie is easy.
      // Turn on the services by adding class='crm-number'
      // Change 'data-crm-type' to 'override' to override and turn off default behavior.
      // Then add 'data-crm-code' to the html with a code found on the manager to replace with that
      // specific campaign instead of the previous cookie.
      // Using data-crm-code is recommended for privacy, you can also use 'data-crm-referrer' and
      // use a code like 'socialmedia'.  Both examples below pull the number for social media
      // campaign if that campaign is active in the manager (not required in google to be active).

      // <span class="crm-number" data-crm-type="override" data-crm-code="j5ateh">888-555-9000</span>
      // <span class="crm-number" data-crm-type="override" data-crm-referrer="socialmedia">888-555-9000</span>
      
      
      var crmDataTypeKey = 'data-crm-type';
      var crmDataCodeKey = 'data-crm-code';
      var crmDataReferrerKey = 'data-crm-referrer';
      var crmCodeKey = 'crm-code';
      
      var currentCode = '';
      var currentReferrer = '';
      var referrer = this.syncCRMReferrer();
      currentReferrer = referrer;
      
      if (this.hasProfileAttribute(crmCodeKey)) {
	// get saved code
        currentCode = this.getProfileAttribute(crmCodeKey);
	
	ServiceAPI.Instance.tracker.trackEventCRM(
			"return-user-code", currentCode, 1);
	ServiceAPI.Instance.tracker.trackEventCRM(
			"return-user-referrer", referrer, 1);
	
	// log event with return code
      }
      else {
	// log event with new code	
	ServiceAPI.Instance.tracker.trackEventCRM(
			"new-user-code", "none", 1);
	ServiceAPI.Instance.tracker.trackEventCRM(
			"new-user-referrer", referrer, 1);
      }
         
      for (var i = 0; i < crmClassTags.length; i++) {
	// loop all dynamic tags to lookup
        //ServiceAPI.Instance.log('i', i);
        //ServiceAPI.Instance.log('crmClassTags[i]', crmClassTags[i]);
        $(crmClassTags[i]).each(function(index) {
	    
	    var currentCrmClassTag = crmClassTags[i];
	    var currentDataNumber = $(this).html();
	    var currentDataType = $(this).attr(crmDataTypeKey);
	    var currentDataCode = $(this).attr(crmDataCodeKey);
	    var currentDataReferrer = $(this).attr(crmDataReferrerKey);
	    
	    ServiceAPI.Instance.tracker.trackEventCRM("dynamic-tag-update", currentCrmClassTag, 1);
	    
	    ServiceAPI.Instance.log('crm:----------------', "");
	    ServiceAPI.Instance.log('crm:currentDataNumber', currentDataNumber);
	    ServiceAPI.Instance.log('crm:currentDataType', currentDataType);
	    ServiceAPI.Instance.log('crm:currentDataCode', currentDataCode);
	    ServiceAPI.Instance.log('crm:currentDataReferrer', currentDataReferrer);
          
	    var isOverride = false;
	    var doUpdateCode = false;
	    var doUpdateReferrer = false;
	    
	    if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentDataType)) {
		if(currentDataType.toLowerCase() == 'override') {
		    isOverride = true;
		}		
	    }
	    
	    ServiceAPI.Instance.log('crm:isOverride', isOverride);
	    
	    if (!isOverride) {
		// do default behavior
		doUpdateCode = true;
	    }
	    else {
		// do special cases
		
		if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentDataCode)) {
		    currentCode = currentDataCode;
		    doUpdateCode = true;
		}
		else if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentDataReferrer)) {
		    currentReferrer = currentDataReferrer;
		    doUpdateReferrer = true;
		}
	    }
	    
	    if (!doUpdateCode) {
		if (!$(currentCrmClassTag).hasClass('crm-fade-in')) {
		    $(currentCrmClassTag).addClass('crm-fade-in');
		}
	    }
	  
	    if (doUpdateCode) {
		if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentCode)) {
		    
		    ServiceAPI.Instance.log('crm:updatingNumber:currentCode:', currentCode);
		    var numberFilter = { code: currentCode, el: this};
		    ServiceAPI.Instance.log('crm:numberFilter', numberFilter);
		    ServiceAPI.Instance.services.crmService.getCRMNumberByCampaignCode(numberFilter);	
		}
	    }
	    if (doUpdateReferrer) {
		if (!ServiceAPI.Instance.util.isNullOrEmptyString(currentReferrer)) {
		    ServiceAPI.Instance.log('crm:updatingNumber:currentReferrer:', currentReferrer);
		    var numberFilter = { referrer: currentReferrer, el: this};
		    ServiceAPI.Instance.log('crm:numberFilter', numberFilter);
		    ServiceAPI.Instance.services.crmService.getCRMNumberByCampaignReferrer(numberFilter);
		}
	    }
       });  
      }
    },
    jQueryLoaded: function() {
      // Only do anything if jQuery isn't defined
      if (typeof jQuery == 'undefined') {      
       if (typeof $ == 'function') {
        return true;
       }
      }
      else {
        return true;
      }
      return false;
    },
    getScript: function(url, success) {       
      var script = document.createElement('script');
      script.src = url;
      
      var head = document.getElementsByTagName('head')[0],
      done = false;
      
      // Attach handlers for all browsers
      script.onload = script.onreadystatechange = function() {        
        if (!done && (!this.readyState
                    || this.readyState == 'loaded'
                    || this.readyState == 'complete')) {         
          done = true;          
          // callback function provided as param
          success();          
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);          
        };        
      };        
      head.appendChild(script);       
    },
    initLibs: function() {
      
      if(this.jQueryLoaded()) {
        return true;
      }
      
      var success = false;
      
      this.getScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function() {       
        if (typeof jQuery=='undefined') {        
          // failed
          success = false;
        }
        else {
          // loaded
          success = true;
        }
      });
      
      this.getScript('//code.jquery.com/jquery-migrate-1.1.0.min.js', function() {       
        if (typeof jQuery=='undefined') {        
          // failed
          success = false;
        }
        else {
          // loaded
          success = true;
        }
      });
      
      return success;
    }
});


var LoaderHelper = Class({
    Instance: function () { return this; },
    log: function (key, val) {
        if (window.console) {
            console.log(key, val);
        }
    },
    initialize: function(callbackSuccess) {
      this.log("started up LoaderHelper");
      this.initLibs(callbackSuccess);
    },
    jQueryLoaded: function() {
      // Only do anything if jQuery isn't defined
      this.log("initLibs: jQueryLoaded");
      if (typeof jQuery == 'undefined') {  
        this.log("initLibs: jQuery undefined");    
        if (typeof $ == 'function') {
          this.log("initLibs: $ exists");  
          this.log("initLibs: jQueryLoaded true");    
          return true;
        }
        else {     
          this.log("initLibs: jQueryLoaded false");
          return false;
        }
      }
      else {
        this.log("initLibs: jQueryLoaded true");    
        if (typeof $ == 'function') {
          this.log("initLibs: $ exists");  
          this.log("initLibs: jQueryLoaded true");    
          return true;
        }
        else {          
          this.log("initLibs: $ updated");  
          $ = jQuery; 
          return true;
        }
      }
      this.log("initLibs: jQueryLoaded false");  
      return false;
    },
    getScript: function(url, success) {       
      var script = document.createElement('script');
      script.src = url;
      
      var head = document.getElementsByTagName('head')[0],
      done = false;
      
      // Attach handlers for all browsers
      script.onload = script.onreadystatechange = function() {        
        if (!done && (!this.readyState
                    || this.readyState == 'loaded'
                    || this.readyState == 'complete')) {         
          done = true;          
          // callback function provided as param
          success();          
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);          
        };        
      };        
      head.appendChild(script);       
    },
    initLibs: function(callbackSuccess) {
      
      if(this.jQueryLoaded()) {
        
        this.log("initLibs: jquery IS loaded");
        callbackSuccess();
        return true;
      }
      
      this.log("initLibs: jquery not loaded");
        
      var success = false;
      
      this.getScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function() {       
        if (typeof jQuery=='undefined') {        
          // failed
          success = false;
        }
        else {
          // loaded
          success = true;
          
          this.log("initLibs: jquery load:" + success);          
           
          this.getScript('//code.jquery.com/jquery-migrate-1.1.0.min.js', function() {       
            if (typeof jQuery=='undefined') {        
              // failed
              success = false;
            }
            else {
              // loaded
              success = true;
              callbackSuccess();
            }
          });
        this.log("initLibs: jquery migrate load:" + success);
        }
      });
      
      return success;
    }
});

if(!window.crm) {
  window.crm = function(){
      var serviceApi = null;
      return {
   failsafeId: null, 
   failsafe: function() {
       this.failsafeId = setTimeout(this.failsafeFadeIn, 670);
   },
   failsafeFadeIn: function() {
       if (!$('.crm-number').hasClass('crm-fade-in')) {
    $('.crm-number').addClass('crm-fade-in');
       }	    
       clearInterval(this.failsafeId);
   },
   crm: function(){
       this.failsafe();	    
       var loaderHelper = new LoaderHelper(
       function() {
      jQuery(function () {
        crm.serviceApi = new ServiceAPI();
        crm.serviceApi.updateCRMNumberCampaigns();
      });
    }
       ); // load or use current jquery
   },
   crmAdmin: function() {    
       var crmNumberCampaignMetaFilter = {
         div: '#crm-number-campaign-meta', 
         code: '', 
         rangeType: 'all',
         page: 1,
         pageSize: 200
       };
       crm.serviceApi.services.crmService.getCRMNumberCampaignMeta(crmNumberCampaignMetaFilter, '');
   }
      };
  }();
}
