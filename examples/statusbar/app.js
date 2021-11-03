(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

},{}],2:[function(require,module,exports){
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],3:[function(require,module,exports){
(function (global){(function (){
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.6.4";
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa && typeof global.btoa == 'function'
        ? function(b){ return global.btoa(b) } : function(b) {
        if (b.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        return btoa(utob(String(u)));
    };
    var mkUriSafe = function (b64) {
        return b64.replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encode = function(u, urisafe) {
        return urisafe ? mkUriSafe(_encode(u)) : _encode(u);
    };
    var encodeURI = function(u) { return encode(u, true) };
    var fromUint8Array;
    if (global.Uint8Array) fromUint8Array = function(a, urisafe) {
        // return btoa(fromCharCode.apply(null, a));
        var b64 = '';
        for (var i = 0, l = a.length; i < l; i += 3) {
            var a0 = a[i], a1 = a[i+1], a2 = a[i+2];
            var ord = a0 << 16 | a1 << 8 | a2;
            b64 +=    b64chars.charAt( ord >>> 18)
                +     b64chars.charAt((ord >>> 12) & 63)
                + ( typeof a1 != 'undefined'
                    ? b64chars.charAt((ord >>>  6) & 63) : '=')
                + ( typeof a2 != 'undefined'
                    ? b64chars.charAt( ord         & 63) : '=');
        }
        return urisafe ? mkUriSafe(b64) : b64;
    };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob && typeof global.atob == 'function'
        ? function(a){ return global.atob(a) } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = function(a) { return btou(_atob(a)) };
    var _fromURI = function(a) {
        return String(a).replace(/[-_]/g, function(m0) {
            return m0 == '-' ? '+' : '/'
        }).replace(/[^A-Za-z0-9\+\/]/g, '');
    };
    var decode = function(a){
        return _decode(_fromURI(a));
    };
    var toUint8Array;
    if (global.Uint8Array) toUint8Array = function(a) {
        return Uint8Array.from(atob(_fromURI(a)), function(c) {
            return c.charCodeAt(0);
        });
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
var wildcard = require('wildcard');
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

},{"wildcard":6}],6:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

},{}],7:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],8:[function(require,module,exports){
(function (process){(function (){
let { urlAlphabet } = require('./url-alphabet/index.cjs')
if (process.env.NODE_ENV !== 'production') {
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    typeof crypto === 'undefined'
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
        'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
        'For secure IDs, import `react-native-get-random-values` ' +
        'before Nano ID.'
    )
  }
  if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
    throw new Error(
      'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
        ' before importing Nano ID to fix IE 11 support'
    )
  }
  if (typeof crypto === 'undefined') {
    throw new Error(
      'Your browser does not have secure random generator. ' +
        'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}
let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, size, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * size) / alphabet.length)
  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)
let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))
  while (size--) {
    let byte = bytes[size] & 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}
module.exports = { nanoid, customAlphabet, customRandom, urlAlphabet, random }

}).call(this)}).call(this,require('_process'))

},{"./url-alphabet/index.cjs":9,"_process":11}],9:[function(require,module,exports){
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
module.exports = { urlAlphabet }

},{}],10:[function(require,module,exports){
var n,l,u,t,i,r,o,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n)}function h(l,u,t){var i,r,o,f={};for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:f[o]=u[o];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps)void 0===f[o]&&(f[o]=l.defaultProps[o]);return p(l,f,i,r,null)}function p(n,t,i,r,o){var f={type:n,props:t,key:i,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++u:o};return null==o&&null!=l.vnode&&l.vnode(f),f}function y(n){return n.children}function d(n,l){this.props=n,this.context=l}function _(n,l){if(null==l)return n.__?_(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?_(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k(n)}}function x(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!b.__r++||o!==l.debounceRendering)&&((o=l.debounceRendering)||r)(b)}function b(){for(var n;b.__r=i.length;)n=i.sort(function(n,l){return n.__v.__b-l.__v.__b}),i=[],n.some(function(n){var l,u,t,i,r,o;n.__d&&(r=(i=(l=n).__v).__e,(o=l.__P)&&(u=[],(t=a({},i)).__v=i.__v+1,I(o,i,t,l.__n,void 0!==o.ownerSVGElement,null!=i.__h?[r]:null,u,null==r?_(i):r,i.__h),T(u,i),i.__e!=r&&k(i)))})}function m(n,l,u,t,i,r,o,f,s,a){var v,h,d,k,x,b,m,A=t&&t.__k||c,P=A.length;for(u.__k=[],v=0;v<l.length;v++)if(null!=(k=u.__k[v]=null==(k=l[v])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k||"bigint"==typeof k?p(null,k,null,null,k):Array.isArray(k)?p(y,{children:k},null,null,null):k.__b>0?p(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(d=A[v])||d&&k.key==d.key&&k.type===d.type)A[v]=void 0;else for(h=0;h<P;h++){if((d=A[h])&&k.key==d.key&&k.type===d.type){A[h]=void 0;break}d=null}I(n,k,d=d||e,i,r,o,f,s,a),x=k.__e,(h=k.ref)&&d.ref!=h&&(m||(m=[]),d.ref&&m.push(d.ref,null,k),m.push(h,k.__c||x,k)),null!=x?(null==b&&(b=x),"function"==typeof k.type&&k.__k===d.__k?k.__d=s=g(k,s,n):s=w(n,k,d,A,x,s),"function"==typeof u.type&&(u.__d=s)):s&&d.__e==s&&s.parentNode!=n&&(s=_(d))}for(u.__e=b,v=P;v--;)null!=A[v]&&("function"==typeof u.type&&null!=A[v].__e&&A[v].__e==u.__d&&(u.__d=_(t,v+1)),L(A[v],A[v]));if(m)for(v=0;v<m.length;v++)z(m[v],m[++v],m[++v])}function g(n,l,u){for(var t,i=n.__k,r=0;i&&r<i.length;r++)(t=i[r])&&(t.__=n,l="function"==typeof t.type?g(t,l,u):w(u,t,t,i,t.__e,l));return l}function w(n,l,u,t,i,r){var o,f,e;if(void 0!==l.__d)o=l.__d,l.__d=void 0;else if(null==u||i!=r||null==i.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(i),o=null;else{for(f=r,e=0;(f=f.nextSibling)&&e<t.length;e+=2)if(f==i)break n;n.insertBefore(i,r),o=r}return void 0!==o?o:i.nextSibling}function A(n,l,u,t,i){var r;for(r in u)"children"===r||"key"===r||r in l||C(n,r,null,u[r],t);for(r in l)i&&"function"!=typeof l[r]||"children"===r||"key"===r||"value"===r||"checked"===r||u[r]===l[r]||C(n,r,l[r],u[r],t)}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px"}function C(n,l,u,t,i){var r;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||P(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||P(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])r=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?t||n.addEventListener(l,r?H:$,r):n.removeEventListener(l,r?H:$,r);else if("dangerouslySetInnerHTML"!==l){if(i)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l))}}function $(n){this.l[n.type+!1](l.event?l.event(n):n)}function H(n){this.l[n.type+!0](l.event?l.event(n):n)}function I(n,u,t,i,r,o,f,e,c){var s,v,h,p,_,k,x,b,g,w,A,P=u.type;if(void 0!==u.constructor)return null;null!=t.__h&&(c=t.__h,e=u.__e=t.__e,u.__h=null,o=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(b=u.props,g=(s=P.contextType)&&i[s.__c],w=s?g?g.props.value:s.__:i,t.__c?x=(v=u.__c=t.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(b,w):(u.__c=v=new d(b,w),v.constructor=P,v.render=M),g&&g.sub(v),v.props=b,v.state||(v.state={}),v.context=w,v.__n=i,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=a({},v.__s)),a(v.__s,P.getDerivedStateFromProps(b,v.__s))),p=v.props,_=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else{if(null==P.getDerivedStateFromProps&&b!==p&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(b,w),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(b,v.__s,w)||u.__v===t.__v){v.props=b,v.state=v.__s,u.__v!==t.__v&&(v.__d=!1),v.__v=u,u.__e=t.__e,u.__k=t.__k,u.__k.forEach(function(n){n&&(n.__=u)}),v.__h.length&&f.push(v);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(b,v.__s,w),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(p,_,k)})}v.context=w,v.props=b,v.state=v.__s,(s=l.__r)&&s(u),v.__d=!1,v.__v=u,v.__P=n,s=v.render(v.props,v.state,v.context),v.state=v.__s,null!=v.getChildContext&&(i=a(a({},i),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(k=v.getSnapshotBeforeUpdate(p,_)),A=null!=s&&s.type===y&&null==s.key?s.props.children:s,m(n,Array.isArray(A)?A:[A],u,t,i,r,o,f,e,c),v.base=u.__e,u.__h=null,v.__h.length&&f.push(v),x&&(v.__E=v.__=null),v.__e=!1}else null==o&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=j(t.__e,u,t,i,r,o,f,c);(s=l.diffed)&&s(u)}catch(n){u.__v=null,(c||null!=o)&&(u.__e=e,u.__h=!!c,o[o.indexOf(e)]=null),l.__e(n,u,t)}}function T(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function j(l,u,t,i,r,o,f,c){var s,a,h,p=t.props,y=u.props,d=u.type,k=0;if("svg"===d&&(r=!0),null!=o)for(;k<o.length;k++)if((s=o[k])&&(s===l||(d?s.localName==d:3==s.nodeType))){l=s,o[k]=null;break}if(null==l){if(null===d)return document.createTextNode(y);l=r?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,y.is&&y),o=null,c=!1}if(null===d)p===y||c&&l.data===y||(l.data=y);else{if(o=o&&n.call(l.childNodes),a=(p=t.props||e).dangerouslySetInnerHTML,h=y.dangerouslySetInnerHTML,!c){if(null!=o)for(p={},k=0;k<l.attributes.length;k++)p[l.attributes[k].name]=l.attributes[k].value;(h||a)&&(h&&(a&&h.__html==a.__html||h.__html===l.innerHTML)||(l.innerHTML=h&&h.__html||""))}if(A(l,y,p,r,c),h)u.__k=[];else if(k=u.props.children,m(l,Array.isArray(k)?k:[k],u,t,i,r&&"foreignObject"!==d,o,f,o?o[0]:t.__k&&_(t,0),c),null!=o)for(k=o.length;k--;)null!=o[k]&&v(o[k]);c||("value"in y&&void 0!==(k=y.value)&&(k!==l.value||"progress"===d&&!k)&&C(l,"value",k,p.value,!1),"checked"in y&&void 0!==(k=y.checked)&&k!==l.checked&&C(l,"checked",k,p.checked,!1))}return l}function z(n,u,t){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,t)}}function L(n,u,t){var i,r;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||z(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null}if(i=n.__k)for(r=0;r<i.length;r++)i[r]&&L(i[r],u,"function"!=typeof n.type);t||null==n.__e||v(n.__e),n.__e=n.__d=void 0}function M(n,l,u){return this.constructor(n,u)}function N(u,t,i){var r,o,f;l.__&&l.__(u,t),o=(r="function"==typeof i)?null:i&&i.__k||t.__k,f=[],I(t,u=(!r&&i||t).__k=h(y,null,[u]),o||e,e,void 0!==t.ownerSVGElement,!r&&i?[i]:o?null:t.firstChild?n.call(t.childNodes):null,f,!r&&i?i:o?o.__e:t.firstChild,r),T(f,u)}n=c.slice,l={__e:function(n,l){for(var u,t,i;l=l.__;)if((u=l.__c)&&!u.__)try{if((t=u.constructor)&&null!=t.getDerivedStateFromError&&(u.setState(t.getDerivedStateFromError(n)),i=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),i=u.__d),i)return u.__E=u}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&void 0===n.constructor},d.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),x(this))},d.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),x(this))},d.prototype.render=y,i=[],r="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,b.__r=0,f=0,exports.render=N,exports.hydrate=function n(l,u){N(l,u,n)},exports.createElement=h,exports.h=h,exports.Fragment=y,exports.createRef=function(){return{current:null}},exports.isValidElement=t,exports.Component=d,exports.cloneElement=function(l,u,t){var i,r,o,f=a({},l.props);for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:f[o]=u[o];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),p(l.type,f,i||l.key,r||l.ref,null)},exports.createContext=function(n,l){var u={__c:l="__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(x)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u},exports.toChildArray=function n(l,u){return u=u||[],null==l||"boolean"==typeof l||(Array.isArray(l)?l.some(function(l){n(l,u)}):u.push(l)),u},exports.options=l;


},{}],11:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],13:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

var _uriToBlob = _interopRequireDefault(require("./uriToBlob"));

var _isCordova = _interopRequireDefault(require("./isCordova"));

var _readAsByteArray = _interopRequireDefault(require("./readAsByteArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var FileSource = /*#__PURE__*/function () {
  // Make this.size a method
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      // In Apache Cordova applications, a File must be resolved using
      // FileReader instances, see
      // https://cordova.apache.org/docs/en/8.x/reference/cordova-plugin-file/index.html#read-a-file
      if ((0, _isCordova.default)()) {
        return (0, _readAsByteArray.default)(this._file.slice(start, end));
      }

      var value = this._file.slice(start, end);

      return Promise.resolve({
        value: value
      });
    }
  }, {
    key: "close",
    value: function close() {// Nothing to do here since we don't need to release any resources.
    }
  }]);

  return FileSource;
}();

var StreamSource = /*#__PURE__*/function () {
  function StreamSource(reader, chunkSize) {
    _classCallCheck(this, StreamSource);

    this._chunkSize = chunkSize;
    this._buffer = undefined;
    this._bufferOffset = 0;
    this._reader = reader;
    this._done = false;
  }

  _createClass(StreamSource, [{
    key: "slice",
    value: function slice(start, end) {
      if (start < this._bufferOffset) {
        return Promise.reject(new Error("Requested data is before the reader's current offset"));
      }

      return this._readUntilEnoughDataOrDone(start, end);
    }
  }, {
    key: "_readUntilEnoughDataOrDone",
    value: function _readUntilEnoughDataOrDone(start, end) {
      var _this = this;

      var hasEnoughData = end <= this._bufferOffset + len(this._buffer);

      if (this._done || hasEnoughData) {
        var value = this._getDataFromBuffer(start, end);

        var done = value == null ? this._done : false;
        return Promise.resolve({
          value: value,
          done: done
        });
      }

      return this._reader.read().then(function (_ref) {
        var value = _ref.value,
            done = _ref.done;

        if (done) {
          _this._done = true;
        } else if (_this._buffer === undefined) {
          _this._buffer = value;
        } else {
          _this._buffer = concat(_this._buffer, value);
        }

        return _this._readUntilEnoughDataOrDone(start, end);
      });
    }
  }, {
    key: "_getDataFromBuffer",
    value: function _getDataFromBuffer(start, end) {
      // Remove data from buffer before `start`.
      // Data might be reread from the buffer if an upload fails, so we can only
      // safely delete data when it comes *before* what is currently being read.
      if (start > this._bufferOffset) {
        this._buffer = this._buffer.slice(start - this._bufferOffset);
        this._bufferOffset = start;
      } // If the buffer is empty after removing old data, all data has been read.


      var hasAllDataBeenRead = len(this._buffer) === 0;

      if (this._done && hasAllDataBeenRead) {
        return null;
      } // We already removed data before `start`, so we just return the first
      // chunk from the buffer.


      return this._buffer.slice(0, end - start);
    }
  }, {
    key: "close",
    value: function close() {
      if (this._reader.cancel) {
        this._reader.cancel();
      }
    }
  }]);

  return StreamSource;
}();

function len(blobOrArray) {
  if (blobOrArray === undefined) return 0;
  if (blobOrArray.size !== undefined) return blobOrArray.size;
  return blobOrArray.length;
}
/*
  Typed arrays and blobs don't have a concat method.
  This function helps StreamSource accumulate data to reach chunkSize.
*/


function concat(a, b) {
  if (a.concat) {
    // Is `a` an Array?
    return a.concat(b);
  }

  if (a instanceof Blob) {
    return new Blob([a, b], {
      type: a.type
    });
  }

  if (a.set) {
    // Is `a` a typed array?
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  throw new Error('Unknown data type');
}

var FileReader = /*#__PURE__*/function () {
  function FileReader() {
    _classCallCheck(this, FileReader);
  }

  _createClass(FileReader, [{
    key: "openFile",
    value: function openFile(input, chunkSize) {
      // In React Native, when user selects a file, instead of a File or Blob,
      // you usually get a file object {} with a uri property that contains
      // a local path to the file. We use XMLHttpRequest to fetch
      // the file blob, before uploading with tus.
      if ((0, _isReactNative.default)() && input && typeof input.uri !== 'undefined') {
        return (0, _uriToBlob.default)(input.uri).then(function (blob) {
          return new FileSource(blob);
        })["catch"](function (err) {
          throw new Error("tus: cannot fetch `file.uri` as Blob, make sure the uri is correct and accessible. ".concat(err));
        });
      } // Since we emulate the Blob type in our tests (not all target browsers
      // support it), we cannot use `instanceof` for testing whether the input value
      // can be handled. Instead, we simply check is the slice() function and the
      // size property are available.


      if (typeof input.slice === 'function' && typeof input.size !== 'undefined') {
        return Promise.resolve(new FileSource(input));
      }

      if (typeof input.read === 'function') {
        chunkSize = +chunkSize;

        if (!isFinite(chunkSize)) {
          return Promise.reject(new Error('cannot create source for stream without a finite value for the `chunkSize` option'));
        }

        return Promise.resolve(new StreamSource(input, chunkSize));
      }

      return Promise.reject(new Error('source object may only be an instance of File, Blob, or Reader in this environment'));
    }
  }]);

  return FileReader;
}();

exports.default = FileReader;
},{"./isCordova":18,"./isReactNative":19,"./readAsByteArray":20,"./uriToBlob":21}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fingerprint;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Differenciate between input types

/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @param {Object} options
 * @param {Function} callback
 */
function fingerprint(file, options) {
  if ((0, _isReactNative.default)()) {
    return Promise.resolve(reactNativeFingerprint(file, options));
  }

  return Promise.resolve(['tus-br', file.name, file.type, file.size, file.lastModified, options.endpoint].join('-'));
}

function reactNativeFingerprint(file, options) {
  var exifHash = file.exif ? hashCode(JSON.stringify(file.exif)) : 'noexif';
  return ['tus-rn', file.name || 'noname', file.size || 'nosize', exifHash, options.endpoint].join('/');
}

function hashCode(str) {
  // from https://stackoverflow.com/a/8831937/151666
  var hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    var _char = str.charCodeAt(i);

    hash = (hash << 5) - hash + _char;
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
}
},{"./isReactNative":19}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window */


var XHRHttpStack = /*#__PURE__*/function () {
  function XHRHttpStack() {
    _classCallCheck(this, XHRHttpStack);
  }

  _createClass(XHRHttpStack, [{
    key: "createRequest",
    value: function createRequest(method, url) {
      return new Request(method, url);
    }
  }, {
    key: "getName",
    value: function getName() {
      return 'XHRHttpStack';
    }
  }]);

  return XHRHttpStack;
}();

exports.default = XHRHttpStack;

var Request = /*#__PURE__*/function () {
  function Request(method, url) {
    _classCallCheck(this, Request);

    this._xhr = new XMLHttpRequest();

    this._xhr.open(method, url, true);

    this._method = method;
    this._url = url;
    this._headers = {};
  }

  _createClass(Request, [{
    key: "getMethod",
    value: function getMethod() {
      return this._method;
    }
  }, {
    key: "getURL",
    value: function getURL() {
      return this._url;
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this._xhr.setRequestHeader(header, value);

      this._headers[header] = value;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._headers[header];
    }
  }, {
    key: "setProgressHandler",
    value: function setProgressHandler(progressHandler) {
      // Test support for progress events before attaching an event listener
      if (!('upload' in this._xhr)) {
        return;
      }

      this._xhr.upload.onprogress = function (e) {
        if (!e.lengthComputable) {
          return;
        }

        progressHandler(e.loaded);
      };
    }
  }, {
    key: "send",
    value: function send() {
      var _this = this;

      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return new Promise(function (resolve, reject) {
        _this._xhr.onload = function () {
          resolve(new Response(_this._xhr));
        };

        _this._xhr.onerror = function (err) {
          reject(err);
        };

        _this._xhr.send(body);
      });
    }
  }, {
    key: "abort",
    value: function abort() {
      this._xhr.abort();

      return Promise.resolve();
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Request;
}();

var Response = /*#__PURE__*/function () {
  function Response(xhr) {
    _classCallCheck(this, Response);

    this._xhr = xhr;
  }

  _createClass(Response, [{
    key: "getStatus",
    value: function getStatus() {
      return this._xhr.status;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._xhr.getResponseHeader(header);
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this._xhr.responseText;
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Response;
}();
},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "enableDebugLog", {
  enumerable: true,
  get: function () {
    return _logger.enableDebugLog;
  }
});
Object.defineProperty(exports, "canStoreURLs", {
  enumerable: true,
  get: function () {
    return _urlStorage.canStoreURLs;
  }
});
Object.defineProperty(exports, "HttpStack", {
  enumerable: true,
  get: function () {
    return _httpStack.default;
  }
});
exports.isSupported = exports.defaultOptions = exports.Upload = void 0;

var _upload = _interopRequireDefault(require("../upload"));

var _noopUrlStorage = _interopRequireDefault(require("../noopUrlStorage"));

var _logger = require("../logger");

var _urlStorage = require("./urlStorage");

var _httpStack = _interopRequireDefault(require("./httpStack"));

var _fileReader = _interopRequireDefault(require("./fileReader"));

var _fingerprint = _interopRequireDefault(require("./fingerprint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/* global window */


var defaultOptions = _objectSpread({}, _upload.default.defaultOptions, {
  httpStack: new _httpStack.default(),
  fileReader: new _fileReader.default(),
  urlStorage: _urlStorage.canStoreURLs ? new _urlStorage.WebStorageUrlStorage() : new _noopUrlStorage.default(),
  fingerprint: _fingerprint.default
});

exports.defaultOptions = defaultOptions;

var Upload = /*#__PURE__*/function (_BaseUpload) {
  _inherits(Upload, _BaseUpload);

  var _super = _createSuper(Upload);

  function Upload() {
    var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Upload);

    options = _objectSpread({}, defaultOptions, {}, options);
    return _super.call(this, file, options);
  }

  _createClass(Upload, null, [{
    key: "terminate",
    value: function terminate(url, options, cb) {
      options = _objectSpread({}, defaultOptions, {}, options);
      return _upload.default.terminate(url, options, cb);
    }
  }]);

  return Upload;
}(_upload.default);

exports.Upload = Upload;
var _window = window,
    XMLHttpRequest = _window.XMLHttpRequest,
    Blob = _window.Blob;
var isSupported = XMLHttpRequest && Blob && typeof Blob.prototype.slice === 'function';
exports.isSupported = isSupported;
},{"../logger":24,"../noopUrlStorage":25,"../upload":26,"./fileReader":14,"./fingerprint":15,"./httpStack":16,"./urlStorage":22}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isCordova = function isCordova() {
  return typeof window != 'undefined' && (typeof window.PhoneGap != 'undefined' || typeof window.Cordova != 'undefined' || typeof window.cordova != 'undefined');
};

var _default = isCordova;
exports.default = _default;
},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isReactNative = function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
};

var _default = isReactNative;
exports.default = _default;
},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readAsByteArray;

/**
 * readAsByteArray converts a File object to a Uint8Array.
 * This function is only used on the Apache Cordova platform.
 * See https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html#read-a-file
 */
function readAsByteArray(chunk) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();

    reader.onload = function () {
      var value = new Uint8Array(reader.result);
      resolve({
        value: value
      });
    };

    reader.onerror = function (err) {
      reject(err);
    };

    reader.readAsArrayBuffer(chunk);
  });
}
},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uriToBlob;

/**
 * uriToBlob resolves a URI to a Blob object. This is used for
 * React Native to retrieve a file (identified by a file://
 * URI) as a blob.
 */
function uriToBlob(uri) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onload = function () {
      var blob = xhr.response;
      resolve(blob);
    };

    xhr.onerror = function (err) {
      reject(err);
    };

    xhr.open('GET', uri);
    xhr.send();
  });
}
},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebStorageUrlStorage = exports.canStoreURLs = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window, localStorage */


var hasStorage = false;

try {
  hasStorage = 'localStorage' in window; // Attempt to store and read entries from the local storage to detect Private
  // Mode on Safari on iOS (see #49)

  var key = 'tusSupport';
  localStorage.setItem(key, localStorage.getItem(key));
} catch (e) {
  // If we try to access localStorage inside a sandboxed iframe, a SecurityError
  // is thrown. When in private mode on iOS Safari, a QuotaExceededError is
  // thrown (see #49)
  if (e.code === e.SECURITY_ERR || e.code === e.QUOTA_EXCEEDED_ERR) {
    hasStorage = false;
  } else {
    throw e;
  }
}

var canStoreURLs = hasStorage;
exports.canStoreURLs = canStoreURLs;

var WebStorageUrlStorage = /*#__PURE__*/function () {
  function WebStorageUrlStorage() {
    _classCallCheck(this, WebStorageUrlStorage);
  }

  _createClass(WebStorageUrlStorage, [{
    key: "findAllUploads",
    value: function findAllUploads() {
      var results = this._findEntries('tus::');

      return Promise.resolve(results);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      var results = this._findEntries("tus::".concat(fingerprint, "::"));

      return Promise.resolve(results);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      localStorage.removeItem(urlStorageKey);
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      var id = Math.round(Math.random() * 1e12);
      var key = "tus::".concat(fingerprint, "::").concat(id);
      localStorage.setItem(key, JSON.stringify(upload));
      return Promise.resolve(key);
    }
  }, {
    key: "_findEntries",
    value: function _findEntries(prefix) {
      var results = [];

      for (var i = 0; i < localStorage.length; i++) {
        var _key = localStorage.key(i);

        if (_key.indexOf(prefix) !== 0) continue;

        try {
          var upload = JSON.parse(localStorage.getItem(_key));
          upload.urlStorageKey = _key;
          results.push(upload);
        } catch (e) {// The JSON parse error is intentionally ignored here, so a malformed
          // entry in the storage cannot prevent an upload.
        }
      }

      return results;
    }
  }]);

  return WebStorageUrlStorage;
}();

exports.WebStorageUrlStorage = WebStorageUrlStorage;
},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

var DetailedError = /*#__PURE__*/function (_Error) {
  _inherits(DetailedError, _Error);

  var _super = _createSuper(DetailedError);

  function DetailedError(message) {
    var _this;

    var causingErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var req = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var res = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, DetailedError);

    _this = _super.call(this, message);
    _this.originalRequest = req;
    _this.originalResponse = res;
    _this.causingError = causingErr;

    if (causingErr != null) {
      message += ", caused by ".concat(causingErr.toString());
    }

    if (req != null) {
      var requestId = req.getHeader('X-Request-ID') || 'n/a';
      var method = req.getMethod();
      var url = req.getURL();
      var status = res ? res.getStatus() : 'n/a';
      var body = res ? res.getBody() || '' : 'n/a';
      message += ", originated from request (method: ".concat(method, ", url: ").concat(url, ", response code: ").concat(status, ", response text: ").concat(body, ", request id: ").concat(requestId, ")");
    }

    _this.message = message;
    return _this;
  }

  return DetailedError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var _default = DetailedError;
exports.default = _default;
},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableDebugLog = enableDebugLog;
exports.log = log;

/* eslint no-console: "off" */
var isEnabled = false;

function enableDebugLog() {
  isEnabled = true;
}

function log(msg) {
  if (!isEnabled) return;
  console.log(msg);
}
},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* eslint no-unused-vars: "off" */


var NoopUrlStorage = /*#__PURE__*/function () {
  function NoopUrlStorage() {
    _classCallCheck(this, NoopUrlStorage);
  }

  _createClass(NoopUrlStorage, [{
    key: "listAllUploads",
    value: function listAllUploads() {
      return Promise.resolve([]);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      return Promise.resolve([]);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      return Promise.resolve(null);
    }
  }]);

  return NoopUrlStorage;
}();

exports.default = NoopUrlStorage;
},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsBase = require("js-base64");

var _urlParse = _interopRequireDefault(require("url-parse"));

var _error = _interopRequireDefault(require("./error"));

var _logger = require("./logger");

var _uuid = _interopRequireDefault(require("./uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window */


var defaultOptions = {
  endpoint: null,
  uploadUrl: null,
  metadata: {},
  fingerprint: null,
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  _onUploadUrlAvailable: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  onBeforeRequest: null,
  onAfterResponse: null,
  onShouldRetry: null,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false,
  urlStorage: null,
  fileReader: null,
  httpStack: null
};

var BaseUpload = /*#__PURE__*/function () {
  function BaseUpload(file, options) {
    _classCallCheck(this, BaseUpload); // Warn about removed options from previous versions


    if ('resume' in options) {
      console.log('tus: The `resume` option has been removed in tus-js-client v2. Please use the URL storage API instead.'); // eslint-disable-line no-console
    } // The default options will already be added from the wrapper classes.


    this.options = options; // The storage module used to store URLs

    this._urlStorage = this.options.urlStorage; // The underlying File/Blob object

    this.file = file; // The URL against which the file will be uploaded

    this.url = null; // The underlying request object for the current PATCH request

    this._req = null; // The fingerpinrt for the current file (set after start())

    this._fingerprint = null; // The key that the URL storage returned when saving an URL with a fingerprint,

    this._urlStorageKey = null; // The offset used in the current PATCH request

    this._offset = null; // True if the current PATCH request has been aborted

    this._aborted = false; // The file's size in bytes

    this._size = null; // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.

    this._source = null; // The current count of attempts which have been made. Zero indicates none.

    this._retryAttempt = 0; // The timeout's ID which is used to delay the next retry

    this._retryTimeout = null; // The offset of the remote upload before the latest attempt was started.

    this._offsetBeforeRetry = 0; // An array of BaseUpload instances which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploads = null; // An array of upload URLs which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploadUrls = null;
  }
  /**
   * Use the Termination extension to delete an upload from the server by sending a DELETE
   * request to the specified upload URL. This is only possible if the server supports the
   * Termination extension. If the `options.retryDelays` property is set, the method will
   * also retry if an error ocurrs.
   *
   * @param {String} url The upload's URL which will be terminated.
   * @param {object} options Optional options for influencing HTTP requests.
   * @return {Promise} The Promise will be resolved/rejected when the requests finish.
   */


  _createClass(BaseUpload, [{
    key: "findPreviousUploads",
    value: function findPreviousUploads() {
      var _this = this;

      return this.options.fingerprint(this.file, this.options).then(function (fingerprint) {
        return _this._urlStorage.findUploadsByFingerprint(fingerprint);
      });
    }
  }, {
    key: "resumeFromPreviousUpload",
    value: function resumeFromPreviousUpload(previousUpload) {
      this.url = previousUpload.uploadUrl || null;
      this._parallelUploadUrls = previousUpload.parallelUploadUrls || null;
      this._urlStorageKey = previousUpload.urlStorageKey;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      var file = this.file;

      if (!file) {
        this._emitError(new Error('tus: no file or stream to upload provided'));

        return;
      }

      if (!this.options.endpoint && !this.options.uploadUrl) {
        this._emitError(new Error('tus: neither an endpoint or an upload URL is provided'));

        return;
      }

      var retryDelays = this.options.retryDelays;

      if (retryDelays != null && Object.prototype.toString.call(retryDelays) !== '[object Array]') {
        this._emitError(new Error('tus: the `retryDelays` option must either be an array or null'));

        return;
      }

      if (this.options.parallelUploads > 1) {
        // Test which options are incompatible with parallel uploads.
        ['uploadUrl', 'uploadSize', 'uploadLengthDeferred'].forEach(function (optionName) {
          if (_this2.options[optionName]) {
            _this2._emitError(new Error("tus: cannot use the ".concat(optionName, " option when parallelUploads is enabled")));
          }
        });
      }

      this.options.fingerprint(file, this.options).then(function (fingerprint) {
        if (fingerprint == null) {
          (0, _logger.log)('No fingerprint was calculated meaning that the upload cannot be stored in the URL storage.');
        } else {
          (0, _logger.log)("Calculated fingerprint: ".concat(fingerprint));
        }

        _this2._fingerprint = fingerprint;

        if (_this2._source) {
          return _this2._source;
        }

        return _this2.options.fileReader.openFile(file, _this2.options.chunkSize);
      }).then(function (source) {
        _this2._source = source; // If the upload was configured to use multiple requests or if we resume from
        // an upload which used multiple requests, we start a parallel upload.

        if (_this2.options.parallelUploads > 1 || _this2._parallelUploadUrls != null) {
          _this2._startParallelUpload();
        } else {
          _this2._startSingleUpload();
        }
      })["catch"](function (err) {
        _this2._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a parallelized upload, where one file is split into
     * multiple request which are run in parallel.
     *
     * @api private
     */

  }, {
    key: "_startParallelUpload",
    value: function _startParallelUpload() {
      var _this3 = this;

      var totalSize = this._size = this._source.size;
      var totalProgress = 0;
      this._parallelUploads = [];
      var partCount = this._parallelUploadUrls != null ? this._parallelUploadUrls.length : this.options.parallelUploads; // The input file will be split into multiple slices which are uploaded in separate
      // requests. Here we generate the start and end position for the slices.

      var parts = splitSizeIntoParts(this._source.size, partCount, this._parallelUploadUrls); // Create an empty list for storing the upload URLs

      this._parallelUploadUrls = new Array(parts.length); // Generate a promise for each slice that will be resolve if the respective
      // upload is completed.

      var uploads = parts.map(function (part, index) {
        var lastPartProgress = 0;
        return _this3._source.slice(part.start, part.end).then(function (_ref) {
          var value = _ref.value;
          return new Promise(function (resolve, reject) {
            // Merge with the user supplied options but overwrite some values.
            var options = _objectSpread({}, _this3.options, {
              // If available, the partial upload should be resumed from a previous URL.
              uploadUrl: part.uploadUrl || null,
              // We take manually care of resuming for partial uploads, so they should
              // not be stored in the URL storage.
              storeFingerprintForResuming: false,
              removeFingerprintOnSuccess: false,
              // Reset the parallelUploads option to not cause recursion.
              parallelUploads: 1,
              metadata: {},
              // Add the header to indicate the this is a partial upload.
              headers: _objectSpread({}, _this3.options.headers, {
                'Upload-Concat': 'partial'
              }),
              // Reject or resolve the promise if the upload errors or completes.
              onSuccess: resolve,
              onError: reject,
              // Based in the progress for this partial upload, calculate the progress
              // for the entire final upload.
              onProgress: function onProgress(newPartProgress) {
                totalProgress = totalProgress - lastPartProgress + newPartProgress;
                lastPartProgress = newPartProgress;

                _this3._emitProgress(totalProgress, totalSize);
              },
              // Wait until every partial upload has an upload URL, so we can add
              // them to the URL storage.
              _onUploadUrlAvailable: function _onUploadUrlAvailable() {
                _this3._parallelUploadUrls[index] = upload.url; // Test if all uploads have received an URL

                if (_this3._parallelUploadUrls.filter(function (u) {
                  return !!u;
                }).length === parts.length) {
                  _this3._saveUploadInUrlStorage();
                }
              }
            });

            var upload = new BaseUpload(value, options);
            upload.start(); // Store the upload in an array, so we can later abort them if necessary.

            _this3._parallelUploads.push(upload);
          });
        });
      });
      var req; // Wait until all partial uploads are finished and we can send the POST request for
      // creating the final upload.

      Promise.all(uploads).then(function () {
        req = _this3._openRequest('POST', _this3.options.endpoint);
        req.setHeader('Upload-Concat', "final;".concat(_this3._parallelUploadUrls.join(' '))); // Add metadata if values have been added

        var metadata = encodeMetadata(_this3.options.metadata);

        if (metadata !== '') {
          req.setHeader('Upload-Metadata', metadata);
        }

        return _this3._sendRequest(req, null);
      }).then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this3._emitHttpError(req, res, 'tus: unexpected response while creating upload');

          return;
        }

        var location = res.getHeader('Location');

        if (location == null) {
          _this3._emitHttpError(req, res, 'tus: invalid or missing Location header');

          return;
        }

        _this3.url = resolveUrl(_this3.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this3.url));

        _this3._emitSuccess();
      })["catch"](function (err) {
        _this3._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a non-parallel upload. Here the entire file is
     * uploaded in a sequential matter.
     *
     * @api private
     */

  }, {
    key: "_startSingleUpload",
    value: function _startSingleUpload() {
      // First, we look at the uploadLengthDeferred option.
      // Next, we check if the caller has supplied a manual upload size.
      // Finally, we try to use the calculated size from the source object.
      if (this.options.uploadLengthDeferred) {
        this._size = null;
      } else if (this.options.uploadSize != null) {
        this._size = +this.options.uploadSize;

        if (isNaN(this._size)) {
          this._emitError(new Error('tus: cannot convert `uploadSize` option into a number'));

          return;
        }
      } else {
        this._size = this._source.size;

        if (this._size == null) {
          this._emitError(new Error("tus: cannot automatically derive upload's size from input and must be specified manually using the `uploadSize` option"));

          return;
        }
      } // Reset the aborted flag when the upload is started or else the
      // _performUpload will stop before sending a request if the upload has been
      // aborted previously.


      this._aborted = false; // The upload had been started previously and we should reuse this URL.

      if (this.url != null) {
        (0, _logger.log)("Resuming upload from previous URL: ".concat(this.url));

        this._resumeUpload();

        return;
      } // A URL has manually been specified, so we try to resume


      if (this.options.uploadUrl != null) {
        (0, _logger.log)("Resuming upload from provided URL: ".concat(this.options.url));
        this.url = this.options.uploadUrl;

        this._resumeUpload();

        return;
      } // An upload has not started for the file yet, so we start a new one


      (0, _logger.log)('Creating a new upload');

      this._createUpload();
    }
    /**
     * Abort any running request and stop the current upload. After abort is called, no event
     * handler will be invoked anymore. You can use the `start` method to resume the upload
     * again.
     * If `shouldTerminate` is true, the `terminate` function will be called to remove the
     * current upload from the server.
     *
     * @param {boolean} shouldTerminate True if the upload should be deleted from the server.
     * @return {Promise} The Promise will be resolved/rejected when the requests finish.
     */

  }, {
    key: "abort",
    value: function abort(shouldTerminate) {
      var _this4 = this; // Count the number of arguments to see if a callback is being provided in the old style required by tus-js-client 1.x, then throw an error if it is.
      // `arguments` is a JavaScript built-in variable that contains all of the function's arguments.


      if (arguments.length > 1 && typeof arguments[1] === 'function') {
        throw new Error('tus: the abort function does not accept a callback since v2 anymore; please use the returned Promise instead');
      } // Stop any parallel partial uploads, that have been started in _startParallelUploads.


      if (this._parallelUploads != null) {
        this._parallelUploads.forEach(function (upload) {
          upload.abort(shouldTerminate);
        });
      } // Stop any current running request.


      if (this._req !== null) {
        this._req.abort();

        this._source.close();
      }

      this._aborted = true; // Stop any timeout used for initiating a retry.

      if (this._retryTimeout != null) {
        clearTimeout(this._retryTimeout);
        this._retryTimeout = null;
      }

      if (!shouldTerminate || this.url == null) {
        return Promise.resolve();
      }

      return BaseUpload.terminate(this.url, this.options) // Remove entry from the URL storage since the upload URL is no longer valid.
      .then(function () {
        return _this4._removeFromUrlStorage();
      });
    }
  }, {
    key: "_emitHttpError",
    value: function _emitHttpError(req, res, message, causingErr) {
      this._emitError(new _error.default(message, causingErr, req, res));
    }
  }, {
    key: "_emitError",
    value: function _emitError(err) {
      var _this5 = this; // Do not emit errors, e.g. from aborted HTTP requests, if the upload has been stopped.


      if (this._aborted) return; // Check if we should retry, when enabled, before sending the error to the user.

      if (this.options.retryDelays != null) {
        // We will reset the attempt counter if
        // - we were already able to connect to the server (offset != null) and
        // - we were able to upload a small chunk of data to the server
        var shouldResetDelays = this._offset != null && this._offset > this._offsetBeforeRetry;

        if (shouldResetDelays) {
          this._retryAttempt = 0;
        }

        if (shouldRetry(err, this._retryAttempt, this.options)) {
          var delay = this.options.retryDelays[this._retryAttempt++];
          this._offsetBeforeRetry = this._offset;
          this._retryTimeout = setTimeout(function () {
            _this5.start();
          }, delay);
          return;
        }
      }

      if (typeof this.options.onError === 'function') {
        this.options.onError(err);
      } else {
        throw err;
      }
    }
    /**
     * Publishes notification if the upload has been successfully completed.
     *
     * @api private
     */

  }, {
    key: "_emitSuccess",
    value: function _emitSuccess() {
      if (this.options.removeFingerprintOnSuccess) {
        // Remove stored fingerprint and corresponding endpoint. This causes
        // new uploads of the same file to be treated as a different file.
        this._removeFromUrlStorage();
      }

      if (typeof this.options.onSuccess === 'function') {
        this.options.onSuccess();
      }
    }
    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     *
     * @param {number} bytesSent  Number of bytes sent to the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitProgress",
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === 'function') {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }
    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param {number} chunkSize  Size of the chunk that was accepted by the server.
     * @param {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitChunkComplete",
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === 'function') {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }
    /**
     * Create a new upload using the creation extension by sending a POST
     * request to the endpoint. After successful creation the file will be
     * uploaded
     *
     * @api private
     */

  }, {
    key: "_createUpload",
    value: function _createUpload() {
      var _this6 = this;

      if (!this.options.endpoint) {
        this._emitError(new Error('tus: unable to create upload because no endpoint is provided'));

        return;
      }

      var req = this._openRequest('POST', this.options.endpoint);

      if (this.options.uploadLengthDeferred) {
        req.setHeader('Upload-Defer-Length', 1);
      } else {
        req.setHeader('Upload-Length', this._size);
      } // Add metadata if values have been added


      var metadata = encodeMetadata(this.options.metadata);

      if (metadata !== '') {
        req.setHeader('Upload-Metadata', metadata);
      }

      var promise;

      if (this.options.uploadDataDuringCreation && !this.options.uploadLengthDeferred) {
        this._offset = 0;
        promise = this._addChunkToRequest(req);
      } else {
        promise = this._sendRequest(req, null);
      }

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this6._emitHttpError(req, res, 'tus: unexpected response while creating upload');

          return;
        }

        var location = res.getHeader('Location');

        if (location == null) {
          _this6._emitHttpError(req, res, 'tus: invalid or missing Location header');

          return;
        }

        _this6.url = resolveUrl(_this6.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this6.url));

        if (typeof _this6.options._onUploadUrlAvailable === 'function') {
          _this6.options._onUploadUrlAvailable();
        }

        if (_this6._size === 0) {
          // Nothing to upload and file was successfully created
          _this6._emitSuccess();

          _this6._source.close();

          return;
        }

        _this6._saveUploadInUrlStorage();

        if (_this6.options.uploadDataDuringCreation) {
          _this6._handleUploadResponse(req, res);
        } else {
          _this6._offset = 0;

          _this6._performUpload();
        }
      })["catch"](function (err) {
        _this6._emitHttpError(req, null, 'tus: failed to create upload', err);
      });
    }
    /*
     * Try to resume an existing upload. First a HEAD request will be sent
     * to retrieve the offset. If the request fails a new upload will be
     * created. In the case of a successful response the file will be uploaded.
     *
     * @api private
     */

  }, {
    key: "_resumeUpload",
    value: function _resumeUpload() {
      var _this7 = this;

      var req = this._openRequest('HEAD', this.url);

      var promise = this._sendRequest(req, null);

      promise.then(function (res) {
        var status = res.getStatus();

        if (!inStatusCategory(status, 200)) {
          if (inStatusCategory(status, 400)) {
            // Remove stored fingerprint and corresponding endpoint,
            // on client errors since the file can not be found
            _this7._removeFromUrlStorage();
          } // If the upload is locked (indicated by the 423 Locked status code), we
          // emit an error instead of directly starting a new upload. This way the
          // retry logic can catch the error and will retry the upload. An upload
          // is usually locked for a short period of time and will be available
          // afterwards.


          if (status === 423) {
            _this7._emitHttpError(req, res, 'tus: upload is currently locked; retry later');

            return;
          }

          if (!_this7.options.endpoint) {
            // Don't attempt to create a new upload if no endpoint is provided.
            _this7._emitHttpError(req, res, 'tus: unable to resume upload (new upload cannot be created without an endpoint)');

            return;
          } // Try to create a new upload


          _this7.url = null;

          _this7._createUpload();

          return;
        }

        var offset = parseInt(res.getHeader('Upload-Offset'), 10);

        if (isNaN(offset)) {
          _this7._emitHttpError(req, res, 'tus: invalid or missing offset value');

          return;
        }

        var length = parseInt(res.getHeader('Upload-Length'), 10);

        if (isNaN(length) && !_this7.options.uploadLengthDeferred) {
          _this7._emitHttpError(req, res, 'tus: invalid or missing length value');

          return;
        }

        if (typeof _this7.options._onUploadUrlAvailable === 'function') {
          _this7.options._onUploadUrlAvailable();
        } // Upload has already been completed and we do not need to send additional
        // data to the server


        if (offset === length) {
          _this7._emitProgress(length, length);

          _this7._emitSuccess();

          return;
        }

        _this7._offset = offset;

        _this7._performUpload();
      })["catch"](function (err) {
        _this7._emitHttpError(req, null, 'tus: failed to resume upload', err);
      });
    }
    /**
     * Start uploading the file using PATCH requests. The file will be divided
     * into chunks as specified in the chunkSize option. During the upload
     * the onProgress event handler may be invoked multiple times.
     *
     * @api private
     */

  }, {
    key: "_performUpload",
    value: function _performUpload() {
      var _this8 = this; // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.


      if (this._aborted) {
        return;
      }

      var req; // Some browser and servers may not support the PATCH method. For those
      // cases, you can tell tus-js-client to use a POST request with the
      // X-HTTP-Method-Override header for simulating a PATCH request.

      if (this.options.overridePatchMethod) {
        req = this._openRequest('POST', this.url);
        req.setHeader('X-HTTP-Method-Override', 'PATCH');
      } else {
        req = this._openRequest('PATCH', this.url);
      }

      req.setHeader('Upload-Offset', this._offset);

      var promise = this._addChunkToRequest(req);

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this8._emitHttpError(req, res, 'tus: unexpected response while uploading chunk');

          return;
        }

        _this8._handleUploadResponse(req, res);
      })["catch"](function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this8._aborted) {
          return;
        }

        _this8._emitHttpError(req, null, "tus: failed to upload chunk at offset ".concat(_this8._offset), err);
      });
    }
    /**
     * _addChunktoRequest reads a chunk from the source and sends it using the
     * supplied request object. It will not handle the response.
     *
     * @api private
     */

  }, {
    key: "_addChunkToRequest",
    value: function _addChunkToRequest(req) {
      var _this9 = this;

      var start = this._offset;
      var end = this._offset + this.options.chunkSize;
      req.setProgressHandler(function (bytesSent) {
        _this9._emitProgress(start + bytesSent, _this9._size);
      });
      req.setHeader('Content-Type', 'application/offset+octet-stream'); // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.

      if ((end === Infinity || end > this._size) && !this.options.uploadLengthDeferred) {
        end = this._size;
      }

      return this._source.slice(start, end).then(function (_ref2) {
        var value = _ref2.value,
            done = _ref2.done; // If the upload length is deferred, the upload size was not specified during
        // upload creation. So, if the file reader is done reading, we know the total
        // upload size and can tell the tus server.

        if (_this9.options.uploadLengthDeferred && done) {
          _this9._size = _this9._offset + (value && value.size ? value.size : 0);
          req.setHeader('Upload-Length', _this9._size);
        }

        if (value === null) {
          return _this9._sendRequest(req);
        }

        _this9._emitProgress(_this9._offset, _this9._size);

        return _this9._sendRequest(req, value);
      });
    }
    /**
     * _handleUploadResponse is used by requests that haven been sent using _addChunkToRequest
     * and already have received a response.
     *
     * @api private
     */

  }, {
    key: "_handleUploadResponse",
    value: function _handleUploadResponse(req, res) {
      var offset = parseInt(res.getHeader('Upload-Offset'), 10);

      if (isNaN(offset)) {
        this._emitHttpError(req, res, 'tus: invalid or missing offset value');

        return;
      }

      this._emitProgress(offset, this._size);

      this._emitChunkComplete(offset - this._offset, offset, this._size);

      this._offset = offset;

      if (offset == this._size) {
        // Yay, finally done :)
        this._emitSuccess();

        this._source.close();

        return;
      }

      this._performUpload();
    }
    /**
     * Create a new HTTP request object with the given method and URL.
     *
     * @api private
     */

  }, {
    key: "_openRequest",
    value: function _openRequest(method, url) {
      var req = openRequest(method, url, this.options);
      this._req = req;
      return req;
    }
    /**
     * Remove the entry in the URL storage, if it has been saved before.
     *
     * @api private
     */

  }, {
    key: "_removeFromUrlStorage",
    value: function _removeFromUrlStorage() {
      var _this10 = this;

      if (!this._urlStorageKey) return;

      this._urlStorage.removeUpload(this._urlStorageKey)["catch"](function (err) {
        _this10._emitError(err);
      });

      this._urlStorageKey = null;
    }
    /**
     * Add the upload URL to the URL storage, if possible.
     *
     * @api private
     */

  }, {
    key: "_saveUploadInUrlStorage",
    value: function _saveUploadInUrlStorage() {
      var _this11 = this; // Only if a fingerprint was calculated for the input (i.e. not a stream), we can store the upload URL.


      if (!this.options.storeFingerprintForResuming || !this._fingerprint) {
        return;
      }

      var storedUpload = {
        size: this._size,
        metadata: this.options.metadata,
        creationTime: new Date().toString()
      };

      if (this._parallelUploads) {
        // Save multiple URLs if the parallelUploads option is used ...
        storedUpload.parallelUploadUrls = this._parallelUploadUrls;
      } else {
        // ... otherwise we just save the one available URL.
        storedUpload.uploadUrl = this.url;
      }

      this._urlStorage.addUpload(this._fingerprint, storedUpload).then(function (urlStorageKey) {
        return _this11._urlStorageKey = urlStorageKey;
      })["catch"](function (err) {
        _this11._emitError(err);
      });
    }
    /**
     * Send a request with the provided body.
     *
     * @api private
     */

  }, {
    key: "_sendRequest",
    value: function _sendRequest(req) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return sendRequest(req, body, this.options);
    }
  }], [{
    key: "terminate",
    value: function terminate(url, options) {
      // Count the number of arguments to see if a callback is being provided as the last
      // argument in the old style required by tus-js-client 1.x, then throw an error if it is.
      // `arguments` is a JavaScript built-in variable that contains all of the function's arguments.
      if (arguments.length > 1 && typeof arguments[arguments.length - 1] === 'function') {
        throw new Error('tus: the terminate function does not accept a callback since v2 anymore; please use the returned Promise instead');
      } // Note that in order for the trick above to work, a default value cannot be set for `options`,
      // so the check below replaces the old default `{}`.


      if (options === undefined) {
        options = {};
      }

      var req = openRequest('DELETE', url, options);
      return sendRequest(req, null, options).then(function (res) {
        // A 204 response indicates a successfull request
        if (res.getStatus() === 204) {
          return;
        }

        throw new _error.default('tus: unexpected response while terminating upload', null, req, res);
      })["catch"](function (err) {
        if (!(err instanceof _error.default)) {
          err = new _error.default('tus: failed to terminate upload', err, req, null);
        }

        if (!shouldRetry(err, 0, options)) {
          throw err;
        } // Instead of keeping track of the retry attempts, we remove the first element from the delays
        // array. If the array is empty, all retry attempts are used up and we will bubble up the error.
        // We recursively call the terminate function will removing elements from the retryDelays array.


        var delay = options.retryDelays[0];
        var remainingDelays = options.retryDelays.slice(1);

        var newOptions = _objectSpread({}, options, {
          retryDelays: remainingDelays
        });

        return new Promise(function (resolve) {
          return setTimeout(resolve, delay);
        }).then(function () {
          return BaseUpload.terminate(url, newOptions);
        });
      });
    }
  }]);

  return BaseUpload;
}();

function encodeMetadata(metadata) {
  var encoded = [];

  for (var key in metadata) {
    encoded.push("".concat(key, " ").concat(_jsBase.Base64.encode(metadata[key])));
  }

  return encoded.join(',');
}
/**
 * Checks whether a given status is in the range of the expected category.
 * For example, only a status between 200 and 299 will satisfy the category 200.
 *
 * @api private
 */


function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}
/**
 * Create a new HTTP request with the specified method and URL.
 * The necessary headers that are included in every request
 * will be added, including the request ID.
 *
 * @api private
 */


function openRequest(method, url, options) {
  var req = options.httpStack.createRequest(method, url);
  req.setHeader('Tus-Resumable', '1.0.0');
  var headers = options.headers || {};

  for (var name in headers) {
    req.setHeader(name, headers[name]);
  }

  if (options.addRequestId) {
    var requestId = (0, _uuid.default)();
    req.setHeader('X-Request-ID', requestId);
  }

  return req;
}
/**
 * Send a request with the provided body while invoking the onBeforeRequest
 * and onAfterResponse callbacks.
 *
 * @api private
 */


function sendRequest(req, body, options) {
  var onBeforeRequestPromise = typeof options.onBeforeRequest === 'function' ? Promise.resolve(options.onBeforeRequest(req)) : Promise.resolve();
  return onBeforeRequestPromise.then(function () {
    return req.send(body).then(function (res) {
      var onAfterResponsePromise = typeof options.onAfterResponse === 'function' ? Promise.resolve(options.onAfterResponse(req, res)) : Promise.resolve();
      return onAfterResponsePromise.then(function () {
        return res;
      });
    });
  });
}
/**
 * Checks whether the browser running this code has internet access.
 * This function will always return true in the node.js environment
 *
 * @api private
 */


function isOnline() {
  var online = true;

  if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.onLine === false) {
    online = false;
  }

  return online;
}
/**
 * Checks whether or not it is ok to retry a request.
 * @param {Error} err the error returned from the last request
 * @param {number} retryAttempt the number of times the request has already been retried
 * @param {object} options tus Upload options
 *
 * @api private
 */


function shouldRetry(err, retryAttempt, options) {
  // We only attempt a retry if
  // - retryDelays option is set
  // - we didn't exceed the maxium number of retries, yet, and
  // - this error was caused by a request or it's response and
  // - the error is server error (i.e. not a status 4xx except a 409 or 423) or
  // a onShouldRetry is specified and returns true
  // - the browser does not indicate that we are offline
  if (options.retryDelays == null || retryAttempt >= options.retryDelays.length || err.originalRequest == null) {
    return false;
  }

  if (options && typeof options.onShouldRetry === 'function') {
    return options.onShouldRetry(err, retryAttempt, options);
  }

  var status = err.originalResponse ? err.originalResponse.getStatus() : 0;
  return (!inStatusCategory(status, 400) || status === 409 || status === 423) && isOnline();
}
/**
 * Resolve a relative link given the origin as source. For example,
 * if a HTTP request to http://example.com/files/ returns a Location
 * header with the value /upload/abc, the resolved URL will be:
 * http://example.com/upload/abc
 */


function resolveUrl(origin, link) {
  return new _urlParse.default(link, origin).toString();
}
/**
 * Calculate the start and end positions for the parts if an upload
 * is split into multiple parallel requests.
 *
 * @param {number} totalSize The byte size of the upload, which will be split.
 * @param {number} partCount The number in how many parts the upload will be split.
 * @param {string[]} previousUrls The upload URLs for previous parts.
 * @return {object[]}
 * @api private
 */


function splitSizeIntoParts(totalSize, partCount, previousUrls) {
  var partSize = Math.floor(totalSize / partCount);
  var parts = [];

  for (var i = 0; i < partCount; i++) {
    parts.push({
      start: partSize * i,
      end: partSize * (i + 1)
    });
  }

  parts[partCount - 1].end = totalSize; // Attach URLs from previous uploads, if available.

  if (previousUrls) {
    parts.forEach(function (part, index) {
      part.uploadUrl = previousUrls[index] || null;
    });
  }

  return parts;
}

BaseUpload.defaultOptions = defaultOptions;
var _default = BaseUpload;
exports.default = _default;
},{"./error":23,"./logger":24,"./uuid":27,"js-base64":3,"url-parse":28}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;

/**
 * Generate a UUID v4 based on random numbers. We intentioanlly use the less
 * secure Math.random function here since the more secure crypto.getRandomNumbers
 * is not available on all platforms.
 * This is not a problem for us since we use the UUID only for generating a
 * request ID, so we can correlate server logs to client errors.
 *
 * This function is taken from following site:
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @return {string} The generate UUID
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
},{}],28:[function(require,module,exports){
(function (global){(function (){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address, url) {     // Sanitize what is left of the address
    return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */
function isSpecial(scheme) {
  return (
    scheme === 'file:' ||
    scheme === 'ftp:' ||
    scheme === 'http:' ||
    scheme === 'https:' ||
    scheme === 'ws:' ||
    scheme === 'wss:'
  );
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address, location) {
  address = trimLeft(address);
  location = location || {};

  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4]
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (
    extracted.protocol === 'file:' && (
      extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
    (!extracted.slashes &&
      (extracted.protocol ||
        extracted.slashesCount < 2 ||
        !isSpecial(url.protocol)))
  ) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"querystringify":12,"requires-port":13}],29:[function(require,module,exports){
'use strict';

class AuthError extends Error {
  constructor() {
    super('Authorization required');
    this.name = 'AuthError';
    this.isAuthError = true;
  }

}

module.exports = AuthError;

},{}],30:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const tokenStorage = require('./tokenStorage');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class Provider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
    this.tokenKey = `companion-${this.pluginId}-auth-token`;
    this.companionKeysParams = this.opts.companionKeysParams;
    this.preAuthToken = null;
  }

  headers() {
    return Promise.all([super.headers(), this.getAuthToken()]).then(([headers, token]) => {
      const authHeaders = {};

      if (token) {
        authHeaders['uppy-auth-token'] = token;
      }

      if (this.companionKeysParams) {
        authHeaders['uppy-credentials-params'] = btoa(JSON.stringify({
          params: this.companionKeysParams
        }));
      }

      return { ...headers,
        ...authHeaders
      };
    });
  }

  onReceiveResponse(response) {
    response = super.onReceiveResponse(response);
    const plugin = this.uppy.getPlugin(this.pluginId);
    const oldAuthenticated = plugin.getPluginState().authenticated;
    const authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated
    });
    return response;
  }

  setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  }

  getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  }

  authUrl(queries = {}) {
    if (this.preAuthToken) {
      queries.uppyPreAuthToken = this.preAuthToken;
    }

    return `${this.hostname}/${this.id}/connect?${new URLSearchParams(queries)}`;
  }

  fileUrl(id) {
    return `${this.hostname}/${this.id}/get/${id}`;
  }

  fetchPreAuthToken() {
    if (!this.companionKeysParams) {
      return Promise.resolve();
    }

    return this.post(`${this.id}/preauth/`, {
      params: this.companionKeysParams
    }).then(res => {
      this.preAuthToken = res.token;
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to fetch preAuthToken ${err}`, 'warning');
    });
  }

  list(directory) {
    return this.get(`${this.id}/list/${directory || ''}`);
  }

  logout() {
    return this.get(`${this.id}/logout`).then(response => Promise.all([response, this.uppy.getPlugin(this.pluginId).storage.removeItem(this.tokenKey)])).then(([response]) => response);
  }

  static initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = { ...defaultOpts,
        ...opts
      };
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      const pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(`${plugin.id}: the option "companionAllowedHosts" must be one of string, Array, RegExp`);
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
      // does not start with https://
      plugin.opts.companionAllowedHosts = `https://${opts.companionUrl.replace(/^\/\//, '')}`;
    } else {
      plugin.opts.companionAllowedHosts = new URL(opts.companionUrl).origin;
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  }

};

},{"./RequestClient":31,"./tokenStorage":35}],31:[function(require,module,exports){
'use strict';

var _class, _getPostResponseFunc, _getUrl, _errorHandler, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const fetchWithNetworkError = require('./../../utils/lib/fetchWithNetworkError');

const AuthError = require('./AuthError'); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

async function handleJSONResponse(res) {
  if (res.status === 401) {
    throw new AuthError();
  }

  const jsonPromise = res.json();

  if (res.status < 200 || res.status > 300) {
    let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;

    try {
      const errData = await jsonPromise;
      errMsg = errData.message ? `${errMsg} message: ${errData.message}` : errMsg;
      errMsg = errData.requestId ? `${errMsg} request-Id: ${errData.requestId}` : errMsg;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errMsg);
    }
  }

  return jsonPromise;
}

module.exports = (_temp = (_getPostResponseFunc = /*#__PURE__*/_classPrivateFieldLooseKey("getPostResponseFunc"), _getUrl = /*#__PURE__*/_classPrivateFieldLooseKey("getUrl"), _errorHandler = /*#__PURE__*/_classPrivateFieldLooseKey("errorHandler"), _class = class RequestClient {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    Object.defineProperty(this, _errorHandler, {
      value: _errorHandler2
    });
    Object.defineProperty(this, _getUrl, {
      value: _getUrl2
    });
    Object.defineProperty(this, _getPostResponseFunc, {
      writable: true,
      value: skip => response => skip ? response : this.onReceiveResponse(response)
    });
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  get hostname() {
    const {
      companion
    } = this.uppy.getState();
    const host = this.opts.companionUrl;
    return stripSlash(companion && companion[host] ? companion[host] : host);
  }

  headers() {
    const userHeaders = this.opts.companionHeaders || {};
    return Promise.resolve({ ...RequestClient.defaultHeaders,
      ...userHeaders
    });
  }

  onReceiveResponse(response) {
    const state = this.uppy.getState();
    const companion = state.companion || {};
    const host = this.opts.companionUrl;
    const {
      headers
    } = response; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      this.uppy.setState({
        companion: { ...companion,
          [host]: headers.get('i-am')
        }
      });
    }

    return response;
  }

  preflight(path) {
    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method: 'OPTIONS'
    }).then(response => {
      if (response.headers.has('access-control-allow-headers')) {
        this.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(headerName => headerName.trim().toLowerCase());
      }

      this.preflightDone = true;
      return this.allowedHeaders.slice();
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to make preflight request ${err}`, 'warning');
      this.preflightDone = true;
      return this.allowedHeaders.slice();
    });
  }

  preflightAndHeaders(path) {
    return Promise.all([this.preflight(path), this.headers()]).then(([allowedHeaders, headers]) => {
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(header => {
        if (!allowedHeaders.includes(header.toLowerCase())) {
          this.uppy.log(`[CompanionClient] excluding disallowed header ${header}`);
          delete headers[header]; // eslint-disable-line no-param-reassign
        }
      });
      return headers;
    });
  }

  get(path, skipPostResponse) {
    const method = 'get';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin'
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  post(path, data, skipPostResponse) {
    const method = 'post';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: JSON.stringify(data)
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  delete(path, data, skipPostResponse) {
    const method = 'delete';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(`${this.hostname}/${path}`, {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: data ? JSON.stringify(data) : null
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

}), _class.VERSION = "2.0.3", _class.defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Uppy-Versions': `@uppy/companion-client=${_class.VERSION}`
}, _temp);

function _getUrl2(url) {
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  return `${this.hostname}/${url}`;
}

function _errorHandler2(method, path) {
  return err => {
    var _err;

    if (!((_err = err) != null && _err.isAuthError)) {
      const error = new Error(`Could not ${method} ${_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path)}`);
      error.cause = err;
      err = error; // eslint-disable-line no-param-reassign
    }

    return Promise.reject(err);
  };
}

},{"./../../utils/lib/fetchWithNetworkError":57,"./AuthError":29}],32:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class SearchProvider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
  }

  fileUrl(id) {
    return `${this.hostname}/search/${this.id}/get/${id}`;
  }

  search(text, queries) {
    queries = queries ? `&${queries}` : '';
    return this.get(`search/${this.id}/list?q=${encodeURIComponent(text)}${queries}`);
  }

};

},{"./RequestClient":31}],33:[function(require,module,exports){
"use strict";

var _queued, _emitter, _isOpen, _socket, _handleMessage;

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const ee = require('namespace-emitter');

module.exports = (_queued = /*#__PURE__*/_classPrivateFieldLooseKey("queued"), _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _isOpen = /*#__PURE__*/_classPrivateFieldLooseKey("isOpen"), _socket = /*#__PURE__*/_classPrivateFieldLooseKey("socket"), _handleMessage = /*#__PURE__*/_classPrivateFieldLooseKey("handleMessage"), _Symbol$for = Symbol.for('uppy test: getSocket'), _Symbol$for2 = Symbol.for('uppy test: getQueued'), class UppySocket {
  constructor(opts) {
    Object.defineProperty(this, _queued, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _isOpen, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _socket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleMessage, {
      writable: true,
      value: e => {
        try {
          const message = JSON.parse(e.data);
          this.emit(message.action, message.payload);
        } catch (err) {
          // TODO: use a more robust error handler.
          console.log(err); // eslint-disable-line no-console
        }
      }
    });
    this.opts = opts;

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  get isOpen() {
    return _classPrivateFieldLooseBase(this, _isOpen)[_isOpen];
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _socket)[_socket];
  }

  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _queued)[_queued];
  }

  open() {
    _classPrivateFieldLooseBase(this, _socket)[_socket] = new WebSocket(this.opts.target);

    _classPrivateFieldLooseBase(this, _socket)[_socket].onopen = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = true;

      while (_classPrivateFieldLooseBase(this, _queued)[_queued].length > 0 && _classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
        const first = _classPrivateFieldLooseBase(this, _queued)[_queued].shift();

        this.send(first.action, first.payload);
      }
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onclose = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = false;
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onmessage = _classPrivateFieldLooseBase(this, _handleMessage)[_handleMessage];
  }

  close() {
    var _classPrivateFieldLoo;

    (_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _socket)[_socket]) == null ? void 0 : _classPrivateFieldLoo.close();
  }

  send(action, payload) {
    // attach uuid
    if (!_classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
      _classPrivateFieldLooseBase(this, _queued)[_queued].push({
        action,
        payload
      });

      return;
    }

    _classPrivateFieldLooseBase(this, _socket)[_socket].send(JSON.stringify({
      action,
      payload
    }));
  }

  on(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(action, handler);
  }

  emit(action, payload) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(action, payload);
  }

  once(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(action, handler);
  }

});

},{"namespace-emitter":7}],34:[function(require,module,exports){
'use strict';
/**
 * Manages communications with Companion
 */

const RequestClient = require('./RequestClient');

const Provider = require('./Provider');

const SearchProvider = require('./SearchProvider');

const Socket = require('./Socket');

module.exports = {
  RequestClient,
  Provider,
  SearchProvider,
  Socket
};

},{"./Provider":30,"./RequestClient":31,"./SearchProvider":32,"./Socket":33}],35:[function(require,module,exports){
'use strict';
/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = (key, value) => {
  return new Promise(resolve => {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = key => {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = key => {
  return new Promise(resolve => {
    localStorage.removeItem(key);
    resolve();
  });
};

},{}],36:[function(require,module,exports){
"use strict";

/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */
const Translator = require('./../../utils/lib/Translator');

module.exports = class BasePlugin {
  constructor(uppy, opts = {}) {
    this.uppy = uppy;
    this.opts = opts;
  }

  getPluginState() {
    const {
      plugins
    } = this.uppy.getState();
    return plugins[this.id] || {};
  }

  setPluginState(update) {
    const {
      plugins
    } = this.uppy.getState();
    this.uppy.setState({
      plugins: { ...plugins,
        [this.id]: { ...plugins[this.id],
          ...update
        }
      }
    });
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts
    };
    this.setPluginState(); // so that UI re-renders with new options

    this.i18nInit();
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  }
  /**
   * Extendable methods
   * ==================
   * These methods are here to serve as an overview of the extendable methods as well as
   * making them not conditional in use, such as `if (this.afterUpdate)`.
   */
  // eslint-disable-next-line class-methods-use-this


  addTarget() {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  } // eslint-disable-next-line class-methods-use-this


  install() {} // eslint-disable-next-line class-methods-use-this


  uninstall() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */


  render() {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  } // eslint-disable-next-line class-methods-use-this


  update() {} // Called after every state update, after everything's mounted. Debounced.
  // eslint-disable-next-line class-methods-use-this


  afterUpdate() {}

};

},{"./../../utils/lib/Translator":55}],37:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  render
} = require('preact');

const findDOMElement = require('./../../utils/lib/findDOMElement');

const BasePlugin = require('./BasePlugin');
/**
 * Defer a frequent call to the microtask queue.
 *
 * @param {() => T} fn
 * @returns {Promise<T>}
 */


function debounce(fn) {
  let calling = null;
  let latestArgs = null;
  return (...args) => {
    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(() => {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn(...latestArgs);
      });
    }

    return calling;
  };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */


var _updateUI = /*#__PURE__*/_classPrivateFieldLooseKey("updateUI");

class UIPlugin extends BasePlugin {
  constructor(...args) {
    super(...args);
    Object.defineProperty(this, _updateUI, {
      writable: true,
      value: void 0
    });
  }

  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   */
  mount(target, plugin) {
    const callerPluginName = plugin.id;
    const targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // When target is <body> with a single <div> element,
      // Preact thinks it’s the Uppy root element in there when doing a diff,
      // and destroys it. So we are creating a fragment (could be empty div)

      const uppyRootElement = document.createDocumentFragment(); // API for plugins that require a synchronous rerender.

      _classPrivateFieldLooseBase(this, _updateUI)[_updateUI] = debounce(state => {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!this.uppy.getPlugin(this.id)) return;
        render(this.render(state), uppyRootElement);
        this.afterUpdate();
      });
      this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);

      if (this.opts.replaceTargetContent) {
        // Doing render(h(null), targetElement), which should have been
        // a better way, since because the component might need to do additional cleanup when it is removed,
        // stopped working — Preact just adds null into target, not replacing
        targetElement.innerHTML = '';
      }

      render(this.render(this.uppy.getState()), uppyRootElement);
      this.el = uppyRootElement.firstElementChild;
      targetElement.appendChild(uppyRootElement);
      this.onMount();
      return this.el;
    }

    let targetPlugin;

    if (typeof target === 'object' && target instanceof UIPlugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      const Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(p => {
        if (p instanceof Target) {
          targetPlugin = p;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log(`Not installing ${callerPluginName}`);
    let message = `Invalid target option given to ${callerPluginName}.`;

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  }

  update(state) {
    if (this.el != null) {
      var _classPrivateFieldLoo, _classPrivateFieldLoo2;

      (_classPrivateFieldLoo = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _updateUI))[_updateUI]) == null ? void 0 : _classPrivateFieldLoo.call(_classPrivateFieldLoo2, state);
    }
  }

  unmount() {
    if (this.isTargetDOMEl) {
      var _this$el;

      (_this$el = this.el) == null ? void 0 : _this$el.remove();
    }

    this.onUnmount();
  } // eslint-disable-next-line class-methods-use-this


  onMount() {} // eslint-disable-next-line class-methods-use-this


  onUnmount() {}

}

module.exports = UIPlugin;

},{"./../../utils/lib/findDOMElement":58,"./BasePlugin":36,"preact":10}],38:[function(require,module,exports){
/* global AggregateError */
'use strict';

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const Translator = require('./../../utils/lib/Translator');

const ee = require('namespace-emitter');

const {
  nanoid
} = require('nanoid');

const throttle = require('lodash.throttle');

const prettierBytes = require('@transloadit/prettier-bytes');

const match = require('mime-match');

const DefaultStore = require('./../../store-default');

const getFileType = require('./../../utils/lib/getFileType');

const getFileNameAndExtension = require('./../../utils/lib/getFileNameAndExtension');

const generateFileID = require('./../../utils/lib/generateFileID');

const supportsUploadProgress = require('./supportsUploadProgress');

const getFileName = require('./getFileName');

const {
  justErrorsLogger,
  debugLogger
} = require('./loggers'); // Exported from here.


class RestrictionError extends Error {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}

if (typeof AggregateError === 'undefined') {
  // eslint-disable-next-line no-global-assign
  globalThis.AggregateError = class AggregateError extends Error {
    constructor(message, errors) {
      super(message);
      this.errors = errors;
    }

  };
}

class AggregateRestrictionError extends AggregateError {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var _plugins = /*#__PURE__*/_classPrivateFieldLooseKey("plugins");

var _storeUnsubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("storeUnsubscribe");

var _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter");

var _preProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("preProcessors");

var _uploaders = /*#__PURE__*/_classPrivateFieldLooseKey("uploaders");

var _postProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("postProcessors");

var _checkRestrictions = /*#__PURE__*/_classPrivateFieldLooseKey("checkRestrictions");

var _checkMinNumberOfFiles = /*#__PURE__*/_classPrivateFieldLooseKey("checkMinNumberOfFiles");

var _checkRequiredMetaFields = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFields");

var _showOrLogErrorAndThrow = /*#__PURE__*/_classPrivateFieldLooseKey("showOrLogErrorAndThrow");

var _assertNewUploadAllowed = /*#__PURE__*/_classPrivateFieldLooseKey("assertNewUploadAllowed");

var _checkAndCreateFileStateObject = /*#__PURE__*/_classPrivateFieldLooseKey("checkAndCreateFileStateObject");

var _startIfAutoProceed = /*#__PURE__*/_classPrivateFieldLooseKey("startIfAutoProceed");

var _addListeners = /*#__PURE__*/_classPrivateFieldLooseKey("addListeners");

var _updateOnlineStatus = /*#__PURE__*/_classPrivateFieldLooseKey("updateOnlineStatus");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _getUpload = /*#__PURE__*/_classPrivateFieldLooseKey("getUpload");

var _removeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("removeUpload");

var _runUpload = /*#__PURE__*/_classPrivateFieldLooseKey("runUpload");

_Symbol$for = Symbol.for('uppy test: getPlugins');
_Symbol$for2 = Symbol.for('uppy test: createUpload');

class Uppy {
  // eslint-disable-next-line global-require

  /** @type {Record<string, BasePlugin[]>} */

  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  constructor(_opts) {
    Object.defineProperty(this, _runUpload, {
      value: _runUpload2
    });
    Object.defineProperty(this, _removeUpload, {
      value: _removeUpload2
    });
    Object.defineProperty(this, _getUpload, {
      value: _getUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _addListeners, {
      value: _addListeners2
    });
    Object.defineProperty(this, _startIfAutoProceed, {
      value: _startIfAutoProceed2
    });
    Object.defineProperty(this, _checkAndCreateFileStateObject, {
      value: _checkAndCreateFileStateObject2
    });
    Object.defineProperty(this, _assertNewUploadAllowed, {
      value: _assertNewUploadAllowed2
    });
    Object.defineProperty(this, _showOrLogErrorAndThrow, {
      value: _showOrLogErrorAndThrow2
    });
    Object.defineProperty(this, _checkRequiredMetaFields, {
      value: _checkRequiredMetaFields2
    });
    Object.defineProperty(this, _checkMinNumberOfFiles, {
      value: _checkMinNumberOfFiles2
    });
    Object.defineProperty(this, _checkRestrictions, {
      value: _checkRestrictions2
    });
    Object.defineProperty(this, _plugins, {
      writable: true,
      value: Object.create(null)
    });
    Object.defineProperty(this, _storeUnsubscribe, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _preProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _uploaders, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _postProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _updateOnlineStatus, {
      writable: true,
      value: this.updateOnlineStatus.bind(this)
    });
    this.defaultLocale = {
      strings: {
        addBulkFilesFailed: {
          0: 'Failed to add %{smart_count} file due to an internal error',
          1: 'Failed to add %{smart_count} files due to internal errors'
        },
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files'
        },
        exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
        missingRequiredMetaField: 'Missing required meta fields',
        missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noMoreFilesAllowed: 'Cannot add more files',
        noDuplicates: 'Cannot add the duplicate file \'%{fileName}\', it already exists',
        companionError: 'Connection with Companion failed',
        authAborted: 'Authentication aborted',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        selectX: {
          0: 'Select %{smart_count}',
          1: 'Select %{smart_count}'
        },
        allFilesFromFolderNamed: 'All files from folder %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        signInWithGoogle: 'Sign in with Google',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        backToSearch: 'Back to Search',
        emptyFolderAdded: 'No files were added from empty folder',
        folderAlreadyAdded: 'The folder "%{folder}" was already added',
        folderAdded: {
          0: 'Added %{smart_count} file from %{folder}',
          1: 'Added %{smart_count} files from %{folder}'
        }
      }
    };
    const defaultOptions = {
      id: 'uppy',
      autoProceed: false,

      /**
       * @deprecated The method should not be used
       */
      allowMultipleUploads: true,
      allowMultipleUploadBatches: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        minFileSize: null,
        maxTotalFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null,
        requiredMetaFields: []
      },
      meta: {},
      onBeforeFileAdded: currentFile => currentFile,
      onBeforeUpload: files => files,
      store: DefaultStore(),
      logger: justErrorsLogger,
      infoTimeout: 5000
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = { ...defaultOptions,
      ..._opts,
      restrictions: { ...defaultOptions.restrictions,
        ...(_opts && _opts.restrictions)
      }
    }; // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (_opts && _opts.logger && _opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (_opts && _opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log(`Using Core v${this.constructor.VERSION}`);

    if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
      throw new TypeError('`restrictions.allowedFileTypes` must be an array');
    }

    this.i18nInit(); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this.calculateProgress = throttle(this.calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: { ...this.opts.meta
      },
      info: [],
      recoveredState: null
    });
    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe] = this.store.subscribe((prevState, nextState, patch) => {
      this.emit('state-update', prevState, nextState, patch);
      this.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    _classPrivateFieldLooseBase(this, _addListeners)[_addListeners]();
  }

  emit(event, ...args) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(event, ...args);
  }

  on(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, callback);

    return this;
  }

  once(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(event, callback);

    return this;
  }

  off(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, callback);

    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */


  updateAll(state) {
    this.iteratePlugins(plugin => {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */


  setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */


  getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   *
   * @deprecated
   */


  get state() {
    // Here, state is a non-enumerable property.
    return this.getState();
  }
  /**
   * Shorthand to set state for a specific file.
   */


  setFileState(fileID, state) {
    if (!this.getState().files[fileID]) {
      throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
    }

    this.setState({
      files: { ...this.getState().files,
        [fileID]: { ...this.getState().files[fileID],
          ...state
        }
      }
    });
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.locale = translator.locale;
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts,
      restrictions: { ...this.opts.restrictions,
        ...(newOpts && newOpts.restrictions)
      }
    };

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(plugin => {
        plugin.setOptions();
      });
    } // Note: this is not the preact `setState`, it's an internal function that has the same name.


    this.setState(); // so that UI re-renders with new options
  }

  resetProgress() {
    const defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };
    const files = { ...this.getState().files
    };
    const updatedFiles = {};
    Object.keys(files).forEach(fileID => {
      const updatedFile = { ...files[fileID]
      };
      updatedFile.progress = { ...updatedFile.progress,
        ...defaultProgress
      };
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  }

  addPreProcessor(fn) {
    _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].add(fn);
  }

  removePreProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].delete(fn);
  }

  addPostProcessor(fn) {
    _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].add(fn);
  }

  removePostProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].delete(fn);
  }

  addUploader(fn) {
    _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].add(fn);
  }

  removeUploader(fn) {
    return _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].delete(fn);
  }

  setMeta(data) {
    const updatedMeta = { ...this.getState().meta,
      ...data
    };
    const updatedFiles = { ...this.getState().files
    };
    Object.keys(updatedFiles).forEach(fileID => {
      updatedFiles[fileID] = { ...updatedFiles[fileID],
        meta: { ...updatedFiles[fileID].meta,
          ...data
        }
      };
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  }

  setFileMeta(fileID, data) {
    const updatedFiles = { ...this.getState().files
    };

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    const newMeta = { ...updatedFiles[fileID].meta,
      ...data
    };
    updatedFiles[fileID] = { ...updatedFiles[fileID],
      meta: newMeta
    };
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */


  getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */


  getFiles() {
    const {
      files
    } = this.getState();
    return Object.values(files);
  }

  getObjectOfFilesPerState() {
    const {
      files: filesObject,
      totalProgress,
      error
    } = this.getState();
    const files = Object.values(filesObject);
    const inProgressFiles = files.filter(({
      progress
    }) => !progress.uploadComplete && progress.uploadStarted);
    const newFiles = files.filter(file => !file.progress.uploadStarted);
    const startedFiles = files.filter(file => file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess);
    const uploadStartedFiles = files.filter(file => file.progress.uploadStarted);
    const pausedFiles = files.filter(file => file.isPaused);
    const completeFiles = files.filter(file => file.progress.uploadComplete);
    const erroredFiles = files.filter(file => file.error);
    const inProgressNotPausedFiles = inProgressFiles.filter(file => !file.isPaused);
    const processingFiles = files.filter(file => file.progress.preprocess || file.progress.postprocess);
    return {
      newFiles,
      startedFiles,
      uploadStartedFiles,
      pausedFiles,
      completeFiles,
      erroredFiles,
      inProgressFiles,
      inProgressNotPausedFiles,
      processingFiles,
      isUploadStarted: uploadStartedFiles.length > 0,
      isAllComplete: totalProgress === 100 && completeFiles.length === files.length && processingFiles.length === 0,
      isAllErrored: !!error && erroredFiles.length === files.length,
      isAllPaused: inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length,
      isUploadInProgress: inProgressFiles.length > 0,
      isSomeGhost: files.some(file => file.isGhost)
    };
  }
  /**
   * A public wrapper for _checkRestrictions — checks if a file passes a set of restrictions.
   * For use in UI pluigins (like Providers), to disallow selecting files that won’t pass restrictions.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @returns {object} { result: true/false, reason: why file didn’t pass restrictions }
   */


  validateRestrictions(file, files) {
    try {
      _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](file, files);

      return {
        result: true
      };
    } catch (err) {
      return {
        result: false,
        reason: err.message
      };
    }
  }
  /**
   * Check if file passes a set of restrictions set in options: maxFileSize, minFileSize,
   * maxNumberOfFiles and allowedFileTypes.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @private
   */


  checkIfFileAlreadyExists(fileID) {
    const {
      files
    } = this.getState();

    if (files[fileID] && !files[fileID].isGhost) {
      return true;
    }

    return false;
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object
   * will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */


  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  addFile(file) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](file);

    const {
      files
    } = this.getState();

    let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, file); // Users are asked to re-select recovered files without data,
    // and to keep the progress, meta and everthing else, we only replace said data


    if (files[newFile.id] && files[newFile.id].isGhost) {
      newFile = { ...files[newFile.id],
        data: file.data,
        isGhost: false
      };
      this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
    }

    this.setState({
      files: { ...files,
        [newFile.id]: newFile
      }
    });
    this.emit('file-added', newFile);
    this.emit('files-added', [newFile]);
    this.log(`Added file: ${newFile.name}, ${newFile.id}, mime type: ${newFile.type}`);

    _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * If an error occurs while adding a file, it is logged and the user is notified.
   * This is good for UI plugins, but not for programmatic use.
   * Programmatic users should usually still use `addFile()` on individual files.
   */


  addFiles(fileDescriptors) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](); // create a copy of the files object only once


    const files = { ...this.getState().files
    };
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < fileDescriptors.length; i++) {
      try {
        let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, fileDescriptors[i]); // Users are asked to re-select recovered files without data,
        // and to keep the progress, meta and everthing else, we only replace said data


        if (files[newFile.id] && files[newFile.id].isGhost) {
          newFile = { ...files[newFile.id],
            data: fileDescriptors[i].data,
            isGhost: false
          };
          this.log(`Replaced blob in a ghost file: ${newFile.name}, ${newFile.id}`);
        }

        files[newFile.id] = newFile;
        newFiles.push(newFile);
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files
    });
    newFiles.forEach(newFile => {
      this.emit('file-added', newFile);
    });
    this.emit('files-added', newFiles);

    if (newFiles.length > 5) {
      this.log(`Added batch of ${newFiles.length} files`);
    } else {
      Object.keys(newFiles).forEach(fileID => {
        this.log(`Added file: ${newFiles[fileID].name}\n id: ${newFiles[fileID].id}\n type: ${newFiles[fileID].type}`);
      });
    }

    if (newFiles.length > 0) {
      _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();
    }

    if (errors.length > 0) {
      let message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(subError => {
        message += `\n * ${subError.message}`;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', this.opts.infoTimeout);

      if (typeof AggregateError === 'function') {
        throw new AggregateError(errors, message);
      } else {
        const err = new Error(message);
        err.errors = errors;
        throw err;
      }
    }
  }

  removeFiles(fileIDs, reason) {
    const {
      files,
      currentUploads
    } = this.getState();
    const updatedFiles = { ...files
    };
    const updatedUploads = { ...currentUploads
    };
    const removedFiles = Object.create(null);
    fileIDs.forEach(fileID => {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    Object.keys(updatedUploads).forEach(uploadID => {
      const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        delete updatedUploads[uploadID];
        return;
      }

      updatedUploads[uploadID] = { ...currentUploads[uploadID],
        fileIDs: newFileIDs
      };
    });
    const stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads,
    // and clear recoveredState

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
      stateUpdate.recoveredState = null;
    }

    this.setState(stateUpdate);
    this.calculateTotalProgress();
    const removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(fileID => {
      this.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log(`Removed ${removedFileIDs.length} files`);
    } else {
      this.log(`Removed files: ${removedFileIDs.join(', ')}`);
    }
  }

  removeFile(fileID, reason = null) {
    this.removeFiles([fileID], reason);
  }

  pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return undefined;
    }

    const wasPaused = this.getFile(fileID).isPaused || false;
    const isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  }

  pauseAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: true
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  }

  resumeAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  }

  retryAll() {
    const updatedFiles = { ...this.getState().files
    };
    const filesToRetry = Object.keys(updatedFiles).filter(file => {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  cancelAll() {
    this.emit('cancel-all');
    const {
      files
    } = this.getState();
    const fileIDs = Object.keys(files);

    if (fileIDs.length) {
      this.removeFiles(fileIDs, 'cancel-all');
    }

    this.setState({
      totalProgress: 0,
      error: null,
      recoveredState: null
    });
  }

  retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  reset() {
    this.cancelAll();
  }

  logout() {
    this.iteratePlugins(plugin => {
      if (plugin.provider && plugin.provider.logout) {
        plugin.provider.logout();
      }
    });
  }

  calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    const canHavePercentage = Number.isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      }
    });
    this.calculateTotalProgress();
  }

  calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    const files = this.getFiles();
    const inProgress = files.filter(file => {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    const sizedFiles = inProgress.filter(file => file.progress.bytesTotal != null);
    const unsizedFiles = inProgress.filter(file => file.progress.bytesTotal == null);

    if (sizedFiles.length === 0) {
      const progressMax = inProgress.length * 100;
      const currentProgress = unsizedFiles.reduce((acc, file) => {
        return acc + file.progress.percentage;
      }, 0);
      const totalProgress = Math.round(currentProgress / progressMax * 100);
      this.setState({
        totalProgress
      });
      return;
    }

    let totalSize = sizedFiles.reduce((acc, file) => {
      return acc + file.progress.bytesTotal;
    }, 0);
    const averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    let uploadedSize = 0;
    sizedFiles.forEach(file => {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(file => {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    let totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */


  updateOnlineStatus() {
    const online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  }

  getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  // eslint-disable-next-line no-shadow


  use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    const plugin = new Plugin(this, opts);
    const pluginId = plugin.id;

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    const existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` + `Tried to use: '${pluginId}'.\n` + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';
      throw new Error(msg);
    }

    if (Plugin.VERSION) {
      this.log(`Using ${pluginId} v${Plugin.VERSION}`);
    }

    if (plugin.type in _classPrivateFieldLooseBase(this, _plugins)[_plugins]) {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type].push(plugin);
    } else {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type] = [plugin];
    }

    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {BasePlugin|undefined}
   */


  getPlugin(id) {
    for (const plugins of Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins])) {
      const foundPlugin = plugins.find(plugin => plugin.id === id);
      if (foundPlugin != null) return foundPlugin;
    }

    return undefined;
  }

  [_Symbol$for](type) {
    return _classPrivateFieldLooseBase(this, _plugins)[_plugins][type];
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */


  iteratePlugins(method) {
    Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins]).flat(1).forEach(method);
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */


  removePlugin(instance) {
    this.log(`Removing plugin ${instance.id}`);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    const list = _classPrivateFieldLooseBase(this, _plugins)[_plugins][instance.type]; // list.indexOf failed here, because Vue3 converted the plugin instance
    // to a Proxy object, which failed the strict comparison test:
    // obj !== objProxy


    const index = list.findIndex(item => item.id === instance.id);

    if (index !== -1) {
      list.splice(index, 1);
    }

    const state = this.getState();
    const updatedState = {
      plugins: { ...state.plugins,
        [instance.id]: undefined
      }
    };
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */


  close() {
    this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
    this.reset();

    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe]();

    this.iteratePlugins(plugin => {
      this.removePlugin(plugin);
    });

    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
      window.removeEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    }
  }

  hideInfo() {
    const {
      info
    } = this.getState();
    this.setState({
      info: info.slice(1)
    });
    this.emit('info-hidden');
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */


  info(message, type = 'info', duration = 3000) {
    const isComplexMessage = typeof message === 'object';
    this.setState({
      info: [...this.getState().info, {
        type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }]
    });
    setTimeout(() => this.hideInfo(), duration);
    this.emit('info-visible');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */


  log(message, type) {
    const {
      logger
    } = this.opts;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Restore an upload by its ID.
   */


  restore(uploadID) {
    this.log(`Core: attempting to restore upload "${uploadID}"`);

    if (!this.getState().currentUploads[uploadID]) {
      _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */


  [_Symbol$for2](...args) {
    return _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](...args);
  }

  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  addResultData(uploadID, data) {
    if (!_classPrivateFieldLooseBase(this, _getUpload)[_getUpload](uploadID)) {
      this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
      return;
    }

    const {
      currentUploads
    } = this.getState();
    const currentUpload = { ...currentUploads[uploadID],
      result: { ...currentUploads[uploadID].result,
        ...data
      }
    };
    this.setState({
      currentUploads: { ...currentUploads,
        [uploadID]: currentUpload
      }
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */


  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  upload() {
    var _classPrivateFieldLoo;

    if (!((_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _plugins)[_plugins].uploader) != null && _classPrivateFieldLoo.length)) {
      this.log('No uploader type plugins are used', 'warning');
    }

    let {
      files
    } = this.getState();
    const onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files
      });
    }

    return Promise.resolve().then(() => {
      _classPrivateFieldLooseBase(this, _checkMinNumberOfFiles)[_checkMinNumberOfFiles](files);

      _classPrivateFieldLooseBase(this, _checkRequiredMetaFields)[_checkRequiredMetaFields](files);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err);
    }).then(() => {
      const {
        currentUploads
      } = this.getState(); // get a list of files that are currently assigned to uploads

      const currentlyUploadingFiles = Object.values(currentUploads).flatMap(curr => curr.fileIDs);
      const waitingFileIDs = [];
      Object.keys(files).forEach(fileID => {
        const file = this.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..

        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](waitingFileIDs);

      return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
        showInformer: false
      });
    });
  }

}

function _checkRestrictions2(file, files = this.getFiles()) {
  const {
    maxFileSize,
    minFileSize,
    maxTotalFileSize,
    maxNumberOfFiles,
    allowedFileTypes
  } = this.opts.restrictions;

  if (maxNumberOfFiles) {
    if (files.length + 1 > maxNumberOfFiles) {
      throw new RestrictionError(`${this.i18n('youCanOnlyUploadX', {
        smart_count: maxNumberOfFiles
      })}`);
    }
  }

  if (allowedFileTypes) {
    const isCorrectFileType = allowedFileTypes.some(type => {
      // check if this is a mime-type
      if (type.indexOf('/') > -1) {
        if (!file.type) return false;
        return match(file.type.replace(/;.*?$/, ''), type);
      } // otherwise this is likely an extension


      if (type[0] === '.' && file.extension) {
        return file.extension.toLowerCase() === type.substr(1).toLowerCase();
      }

      return false;
    });

    if (!isCorrectFileType) {
      const allowedFileTypesString = allowedFileTypes.join(', ');
      throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
        types: allowedFileTypesString
      }));
    }
  } // We can't check maxTotalFileSize if the size is unknown.


  if (maxTotalFileSize && file.size != null) {
    let totalFilesSize = 0;
    totalFilesSize += file.size;
    files.forEach(f => {
      totalFilesSize += f.size;
    });

    if (totalFilesSize > maxTotalFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxTotalFileSize),
        file: file.name
      }));
    }
  } // We can't check maxFileSize if the size is unknown.


  if (maxFileSize && file.size != null) {
    if (file.size > maxFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxFileSize),
        file: file.name
      }));
    }
  } // We can't check minFileSize if the size is unknown.


  if (minFileSize && file.size != null) {
    if (file.size < minFileSize) {
      throw new RestrictionError(this.i18n('inferiorSize', {
        size: prettierBytes(minFileSize)
      }));
    }
  }
}

function _checkMinNumberOfFiles2(files) {
  const {
    minNumberOfFiles
  } = this.opts.restrictions;

  if (Object.keys(files).length < minNumberOfFiles) {
    throw new RestrictionError(`${this.i18n('youHaveToAtLeastSelectX', {
      smart_count: minNumberOfFiles
    })}`);
  }
}

function _checkRequiredMetaFields2(files) {
  const {
    requiredMetaFields
  } = this.opts.restrictions;
  const {
    hasOwnProperty
  } = Object.prototype;
  const errors = [];

  for (const fileID of Object.keys(files)) {
    const file = this.getFile(fileID);

    for (let i = 0; i < requiredMetaFields.length; i++) {
      if (!hasOwnProperty.call(file.meta, requiredMetaFields[i]) || file.meta[requiredMetaFields[i]] === '') {
        const err = new RestrictionError(`${this.i18n('missingRequiredMetaFieldOnFile', {
          fileName: file.name
        })}`);
        errors.push(err);

        _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
          file,
          showInformer: false,
          throwErr: false
        });
      }
    }
  }

  if (errors.length) {
    throw new AggregateRestrictionError(`${this.i18n('missingRequiredMetaField')}`, errors);
  }
}

function _showOrLogErrorAndThrow2(err, {
  showInformer = true,
  file = null,
  throwErr = true
} = {}) {
  const message = typeof err === 'object' ? err.message : err;
  const details = typeof err === 'object' && err.details ? err.details : ''; // Restriction errors should be logged, but not as errors,
  // as they are expected and shown in the UI.

  let logMessageWithDetails = message;

  if (details) {
    logMessageWithDetails += ` ${details}`;
  }

  if (err.isRestriction) {
    this.log(logMessageWithDetails);
    this.emit('restriction-failed', file, err);
  } else {
    this.log(logMessageWithDetails, 'error');
  } // Sometimes informer has to be shown manually by the developer,
  // for example, in `onBeforeFileAdded`.


  if (showInformer) {
    this.info({
      message,
      details
    }, 'error', this.opts.infoTimeout);
  }

  if (throwErr) {
    throw typeof err === 'object' ? err : new Error(err);
  }
}

function _assertNewUploadAllowed2(file) {
  const {
    allowNewUpload
  } = this.getState();

  if (allowNewUpload === false) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError(this.i18n('noMoreFilesAllowed')), {
      file
    });
  }
}

function _checkAndCreateFileStateObject2(files, fileDescriptor) {
  const fileType = getFileType(fileDescriptor);
  const fileName = getFileName(fileType, fileDescriptor);
  const fileExtension = getFileNameAndExtension(fileName).extension;
  const isRemote = Boolean(fileDescriptor.isRemote);
  const fileID = generateFileID({ ...fileDescriptor,
    type: fileType
  });

  if (this.checkIfFileAlreadyExists(fileID)) {
    const error = new RestrictionError(this.i18n('noDuplicates', {
      fileName
    }));

    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
      file: fileDescriptor
    });
  }

  const meta = fileDescriptor.meta || {};
  meta.name = fileName;
  meta.type = fileType; // `null` means the size is unknown.

  const size = Number.isFinite(fileDescriptor.data.size) ? fileDescriptor.data.size : null;
  let newFile = {
    source: fileDescriptor.source || '',
    id: fileID,
    name: fileName,
    extension: fileExtension || '',
    meta: { ...this.getState().meta,
      ...meta
    },
    type: fileType,
    data: fileDescriptor.data,
    progress: {
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: size,
      uploadComplete: false,
      uploadStarted: null
    },
    size,
    isRemote,
    remote: fileDescriptor.remote || '',
    preview: fileDescriptor.preview
  };
  const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, files);

  if (onBeforeFileAddedResult === false) {
    // Don’t show UI info for this error, as it should be done by the developer
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.'), {
      showInformer: false,
      fileDescriptor
    });
  } else if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult !== null) {
    newFile = onBeforeFileAddedResult;
  }

  try {
    const filesArray = Object.keys(files).map(i => files[i]);

    _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](newFile, filesArray);
  } catch (err) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
      file: newFile
    });
  }

  return newFile;
}

function _startIfAutoProceed2() {
  if (this.opts.autoProceed && !this.scheduledAutoProceed) {
    this.scheduledAutoProceed = setTimeout(() => {
      this.scheduledAutoProceed = null;
      this.upload().catch(err => {
        if (!err.isRestriction) {
          this.log(err.stack || err.message || err);
        }
      });
    }, 4);
  }
}

function _addListeners2() {
  /**
   * @param {Error} error
   * @param {object} [file]
   * @param {object} [response]
   */
  const errorHandler = (error, file, response) => {
    let errorMsg = error.message || 'Unknown error';

    if (error.details) {
      errorMsg += ` ${error.details}`;
    }

    this.setState({
      error: errorMsg
    });

    if (file != null && file.id in this.getState().files) {
      this.setFileState(file.id, {
        error: errorMsg,
        response
      });
    }
  };

  this.on('error', errorHandler);
  this.on('upload-error', (file, error, response) => {
    errorHandler(error, file, response);

    if (typeof error === 'object' && error.message) {
      const newError = new Error(error.message);
      newError.details = error.message;

      if (error.details) {
        newError.details += ` ${error.details}`;
      }

      newError.message = this.i18n('failedToUpload', {
        file: file.name
      });

      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](newError, {
        throwErr: false
      });
    } else {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
        throwErr: false
      });
    }
  });
  this.on('upload', () => {
    this.setState({
      error: null
    });
  });
  this.on('upload-started', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: {
        uploadStarted: Date.now(),
        uploadComplete: false,
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: file.size
      }
    });
  });
  this.on('upload-progress', this.calculateProgress);
  this.on('upload-success', (file, uploadResp) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const currentProgress = this.getFile(file.id).progress;
    this.setFileState(file.id, {
      progress: { ...currentProgress,
        postprocess: _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].size > 0 ? {
          mode: 'indeterminate'
        } : null,
        uploadComplete: true,
        percentage: 100,
        bytesUploaded: currentProgress.bytesTotal
      },
      response: uploadResp,
      uploadURL: uploadResp.uploadURL,
      isPaused: false
    }); // Remote providers sometimes don't tell us the file size,
    // but we can know how many bytes we uploaded once the upload is complete.

    if (file.size == null) {
      this.setFileState(file.id, {
        size: uploadResp.bytesUploaded || currentProgress.bytesTotal
      });
    }

    this.calculateTotalProgress();
  });
  this.on('preprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        preprocess: progress
      }
    });
  });
  this.on('preprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.preprocess;
    this.setState({
      files
    });
  });
  this.on('postprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getState().files[file.id].progress,
        postprocess: progress
      }
    });
  });
  this.on('postprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.postprocess;
    this.setState({
      files
    });
  });
  this.on('restored', () => {
    // Files may have changed--ensure progress is still accurate.
    this.calculateTotalProgress();
  }); // show informer if offline

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    window.addEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    setTimeout(_classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus], 3000);
  }
}

function _createUpload2(fileIDs, opts = {}) {
  // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
  const {
    forceAllowNewUpload = false
  } = opts;
  const {
    allowNewUpload,
    currentUploads
  } = this.getState();

  if (!allowNewUpload && !forceAllowNewUpload) {
    throw new Error('Cannot create a new upload: already uploading.');
  }

  const uploadID = nanoid();
  this.emit('upload', {
    id: uploadID,
    fileIDs
  });
  this.setState({
    allowNewUpload: this.opts.allowMultipleUploadBatches !== false && this.opts.allowMultipleUploads !== false,
    currentUploads: { ...currentUploads,
      [uploadID]: {
        fileIDs,
        step: 0,
        result: {}
      }
    }
  });
  return uploadID;
}

function _getUpload2(uploadID) {
  const {
    currentUploads
  } = this.getState();
  return currentUploads[uploadID];
}

function _removeUpload2(uploadID) {
  const currentUploads = { ...this.getState().currentUploads
  };
  delete currentUploads[uploadID];
  this.setState({
    currentUploads
  });
}

async function _runUpload2(uploadID) {
  let {
    currentUploads
  } = this.getState();
  let currentUpload = currentUploads[uploadID];
  const restoreStep = currentUpload.step || 0;
  const steps = [..._classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors], ..._classPrivateFieldLooseBase(this, _uploaders)[_uploaders], ..._classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors]];

  try {
    for (let step = restoreStep; step < steps.length; step++) {
      if (!currentUpload) {
        break;
      }

      const fn = steps[step];
      const updatedUpload = { ...currentUpload,
        step
      };
      this.setState({
        currentUploads: { ...currentUploads,
          [uploadID]: updatedUpload
        }
      }); // TODO give this the `updatedUpload` object as its only parameter maybe?
      // Otherwise when more metadata may be added to the upload this would keep getting more parameters

      await fn(updatedUpload.fileIDs, uploadID); // Update currentUpload value in case it was modified asynchronously.

      currentUploads = this.getState().currentUploads;
      currentUpload = currentUploads[uploadID];
    }
  } catch (err) {
    this.emit('error', err);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

    throw err;
  } // Set result data.


  if (currentUpload) {
    // Mark postprocessing step as complete if necessary; this addresses a case where we might get
    // stuck in the postprocessing UI while the upload is fully complete.
    // If the postprocessing steps do not do any work, they may not emit postprocessing events at
    // all, and never mark the postprocessing as complete. This is fine on its own but we
    // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
    // state if any postprocessors are registered. That is to avoid a "flash of completed state"
    // before the postprocessing plugins can emit events.
    //
    // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
    // postprocessing completion, we do it instead.
    currentUpload.fileIDs.forEach(fileID => {
      const file = this.getFile(fileID);

      if (file && file.progress.postprocess) {
        this.emit('postprocess-complete', file);
      }
    });
    const files = currentUpload.fileIDs.map(fileID => this.getFile(fileID));
    const successful = files.filter(file => !file.error);
    const failed = files.filter(file => file.error);
    await this.addResultData(uploadID, {
      successful,
      failed,
      uploadID
    }); // Update currentUpload value in case it was modified asynchronously.

    currentUploads = this.getState().currentUploads;
    currentUpload = currentUploads[uploadID];
  } // Emit completion events.
  // This is in a separate function so that the `currentUploads` variable
  // always refers to the latest state. In the handler right above it refers
  // to an outdated object without the `.result` property.


  let result;

  if (currentUpload) {
    result = currentUpload.result;
    this.emit('complete', result);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);
  }

  if (result == null) {
    this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
  }

  return result;
}

Uppy.VERSION = "2.1.1";
module.exports = Uppy;

},{"./../../store-default":49,"./../../utils/lib/Translator":55,"./../../utils/lib/generateFileID":59,"./../../utils/lib/getFileNameAndExtension":61,"./../../utils/lib/getFileType":62,"./getFileName":39,"./loggers":41,"./supportsUploadProgress":42,"@transloadit/prettier-bytes":1,"lodash.throttle":4,"mime-match":5,"namespace-emitter":7,"nanoid":8}],39:[function(require,module,exports){
"use strict";

module.exports = function getFileName(fileType, fileDescriptor) {
  if (fileDescriptor.name) {
    return fileDescriptor.name;
  }

  if (fileType.split('/')[0] === 'image') {
    return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
  }

  return 'noname';
};

},{}],40:[function(require,module,exports){
'use strict';

const Uppy = require('./Uppy');

const UIPlugin = require('./UIPlugin');

const BasePlugin = require('./BasePlugin');

const {
  debugLogger
} = require('./loggers');

module.exports = Uppy;
module.exports.Uppy = Uppy;
module.exports.UIPlugin = UIPlugin;
module.exports.BasePlugin = BasePlugin;
module.exports.debugLogger = debugLogger;

},{"./BasePlugin":36,"./UIPlugin":37,"./Uppy":38,"./loggers":41}],41:[function(require,module,exports){
"use strict";

/* eslint-disable no-console */
const getTimeStamp = require('./../../utils/lib/getTimeStamp'); // Swallow all logs, except errors.
// default if logger is not set or debug: false


const justErrorsLogger = {
  debug: () => {},
  warn: () => {},
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

const debugLogger = {
  debug: (...args) => console.debug(`[Uppy] [${getTimeStamp()}]`, ...args),
  warn: (...args) => console.warn(`[Uppy] [${getTimeStamp()}]`, ...args),
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
};
module.exports = {
  justErrorsLogger,
  debugLogger
};

},{"./../../utils/lib/getTimeStamp":66}],42:[function(require,module,exports){
"use strict";

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  const edgeVersion = m[1];
  let [major, minor] = edgeVersion.split('.');
  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

},{}],43:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const toArray = require('./../../utils/lib/toArray');

const {
  h
} = require('preact');

module.exports = (_temp = _class = class FileInput extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'FileInput';
    this.title = 'File Input';
    this.type = 'acquirer';
    this.defaultLocale = {
      strings: {
        // The same key is used for the same purpose by @uppy/robodog's `form()` API, but our
        // locale pack scripts can't access it in Robodog. If it is updated here, it should
        // also be updated there!
        chooseFiles: 'Choose files'
      }
    }; // Default options

    const defaultOptions = {
      target: null,
      pretty: true,
      inputName: 'files[]'
    }; // Merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  addFiles(files) {
    const descriptors = files.map(file => ({
      source: this.id,
      name: file.name,
      type: file.type,
      data: file
    }));

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  }

  handleInputChange(event) {
    this.uppy.log('[FileInput] Something selected through input...');
    const files = toArray(event.target.files);
    this.addFiles(files); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

    event.target.value = null;
  }

  handleClick() {
    this.input.click();
  }

  render() {
    /* http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */
    const hiddenInputStyle = {
      width: '0.1px',
      height: '0.1px',
      opacity: 0,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: -1
    };
    const {
      restrictions
    } = this.uppy.opts;
    const accept = restrictions.allowedFileTypes ? restrictions.allowedFileTypes.join(',') : null;
    return h("div", {
      className: "uppy-Root uppy-FileInput-container"
    }, h("input", {
      className: "uppy-FileInput-input",
      style: this.opts.pretty && hiddenInputStyle,
      type: "file",
      name: this.opts.inputName,
      onChange: this.handleInputChange,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: accept,
      ref: input => {
        this.input = input;
      }
    }), this.opts.pretty && h("button", {
      className: "uppy-FileInput-btn",
      type: "button",
      onClick: this.handleClick
    }, this.i18n('chooseFiles')));
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.0.4", _temp);

},{"./../../core":40,"./../../utils/lib/toArray":74,"preact":10}],44:[function(require,module,exports){
"use strict";

const classNames = require('classnames');

const throttle = require('lodash.throttle');

const prettierBytes = require('@transloadit/prettier-bytes');

const prettyETA = require('./../../utils/lib/prettyETA');

const {
  h
} = require('preact');

const statusBarStates = require('./StatusBarStates');

const DOT = `\u00B7`;

const renderDot = () => ` ${DOT} `;

function UploadBtn(props) {
  const {
    newFiles,
    isUploadStarted,
    recoveredState,
    i18n,
    uploadState,
    isSomeGhost,
    startUpload
  } = props;
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
    'uppy-c-btn-primary': uploadState === statusBarStates.STATE_WAITING
  }, {
    'uppy-StatusBar-actionBtn--disabled': isSomeGhost
  });
  const uploadBtnText = newFiles && isUploadStarted && !recoveredState ? i18n('uploadXNewFiles', {
    smart_count: newFiles
  }) : i18n('uploadXFiles', {
    smart_count: newFiles
  });
  return h("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": i18n('uploadXFiles', {
      smart_count: newFiles
    }),
    onClick: startUpload,
    disabled: isSomeGhost,
    "data-uppy-super-focusable": true
  }, uploadBtnText);
}

function RetryBtn(props) {
  const {
    i18n,
    uppy
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
    "aria-label": i18n('retryUpload'),
    onClick: () => uppy.retryAll(),
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "8",
    height: "10",
    viewBox: "0 0 8 10"
  }, h("path", {
    d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z"
  })), i18n('retry'));
}

function CancelBtn(props) {
  const {
    i18n,
    uppy
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    title: i18n('cancel'),
    "aria-label": i18n('cancel'),
    onClick: () => uppy.cancelAll(),
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z"
  }))));
}

function PauseResumeButton(props) {
  const {
    isAllPaused,
    i18n,
    isAllComplete,
    resumableUploads,
    uppy
  } = props;
  const title = isAllPaused ? i18n('resume') : i18n('pause');

  function togglePauseResume() {
    if (isAllComplete) return null;

    if (!resumableUploads) {
      return uppy.cancelAll();
    }

    if (isAllPaused) {
      return uppy.resumeAll();
    }

    return uppy.pauseAll();
  }

  return h("button", {
    title: title,
    "aria-label": title,
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    type: "button",
    onClick: togglePauseResume,
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: isAllPaused ? 'M6 4.25L11.5 8 6 11.75z' : 'M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z'
  }))));
}

function DoneBtn(props) {
  const {
    i18n,
    doneButtonHandler
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done",
    onClick: doneButtonHandler,
    "data-uppy-super-focusable": true
  }, i18n('done'));
}

function LoadingSpinner() {
  return h("svg", {
    className: "uppy-StatusBar-spinner",
    "aria-hidden": "true",
    focusable: "false",
    width: "14",
    height: "14"
  }, h("path", {
    d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
    fillRule: "evenodd"
  }));
}

function ProgressBarProcessing(props) {
  const {
    progress
  } = props;
  const {
    value,
    mode,
    message
  } = progress;
  const roundedValue = Math.round(value * 100);
  const dot = `\u00B7`;
  return h("div", {
    className: "uppy-StatusBar-content"
  }, h(LoadingSpinner, null), mode === 'determinate' ? `${roundedValue}% ${dot} ` : '', message);
}

function ProgressDetails(props) {
  const {
    numUploads,
    complete,
    totalUploadedSize,
    totalSize,
    totalETA,
    i18n
  } = props;
  const ifShowFilesUploadedOfTotal = numUploads > 1;
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, ifShowFilesUploadedOfTotal && i18n('filesUploadedOfTotal', {
    complete,
    smart_count: numUploads
  }), h("span", {
    className: "uppy-StatusBar-additionalInfo"
  }, ifShowFilesUploadedOfTotal && renderDot(), i18n('dataUploadedOfTotal', {
    complete: prettierBytes(totalUploadedSize),
    total: prettierBytes(totalSize)
  }), renderDot(), i18n('xTimeLeft', {
    time: prettyETA(totalETA)
  })));
}

function UnknownProgressDetails(props) {
  const {
    i18n,
    complete,
    numUploads
  } = props;
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, i18n('filesUploadedOfTotal', {
    complete,
    smart_count: numUploads
  }));
}

function UploadNewlyAddedFiles(props) {
  const {
    i18n,
    newFiles,
    startUpload
  } = props;
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, h("div", {
    className: "uppy-StatusBar-statusSecondaryHint"
  }, i18n('xMoreFilesAdded', {
    smart_count: newFiles
  })), h("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": i18n('uploadXFiles', {
      smart_count: newFiles
    }),
    onClick: startUpload
  }, i18n('upload')));
}

const ThrottledProgressDetails = throttle(ProgressDetails, 500, {
  leading: true,
  trailing: true
});

function ProgressBarUploading(props) {
  const {
    i18n,
    supportsUploadProgress,
    totalProgress,
    showProgressDetails,
    isUploadStarted,
    isAllComplete,
    isAllPaused,
    newFiles,
    numUploads,
    complete,
    totalUploadedSize,
    totalSize,
    totalETA,
    startUpload
  } = props;
  const showUploadNewlyAddedFiles = newFiles && isUploadStarted;

  if (!isUploadStarted || isAllComplete) {
    return null;
  }

  const title = isAllPaused ? i18n('paused') : i18n('uploading');

  function renderProgressDetails() {
    if (!isAllPaused && !showUploadNewlyAddedFiles && showProgressDetails) {
      if (supportsUploadProgress) {
        return h(ThrottledProgressDetails, {
          numUploads: numUploads,
          complete: complete,
          totalUploadedSize: totalUploadedSize,
          totalSize: totalSize,
          totalETA: totalETA,
          i18n: i18n
        });
      }

      return h(UnknownProgressDetails, {
        i18n: i18n,
        complete: complete,
        numUploads: numUploads
      });
    }

    return null;
  }

  return h("div", {
    className: "uppy-StatusBar-content",
    "aria-label": title,
    title: title
  }, !isAllPaused ? h(LoadingSpinner, null) : null, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, supportsUploadProgress ? `${title}: ${totalProgress}%` : title), renderProgressDetails(), showUploadNewlyAddedFiles ? h(UploadNewlyAddedFiles, {
    i18n: i18n,
    newFiles: newFiles,
    startUpload: startUpload
  }) : null));
}

function ProgressBarComplete(props) {
  const {
    i18n
  } = props;
  return h("div", {
    className: "uppy-StatusBar-content",
    role: "status",
    title: i18n('complete')
  }, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "15",
    height: "11",
    viewBox: "0 0 15 11"
  }, h("path", {
    d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z"
  })), i18n('complete'))));
}

function ProgressBarError(props) {
  const {
    error,
    i18n
  } = props;

  function displayErrorAlert() {
    const errorMessage = `${i18n('uploadFailed')} \n\n ${error}`; // eslint-disable-next-line no-alert

    alert(errorMessage); // TODO: move to custom alert implementation
  }

  return h("div", {
    className: "uppy-StatusBar-content",
    role: "alert",
    title: i18n('uploadFailed')
  }, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "11",
    height: "11",
    viewBox: "0 0 11 11"
  }, h("path", {
    d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z"
  })), i18n('uploadFailed'))), h("button", {
    className: "uppy-StatusBar-details",
    "aria-label": error,
    "data-microtip-position": "top-right",
    "data-microtip-size": "medium",
    onClick: displayErrorAlert,
    type: "button"
  }, "?"));
}

module.exports = {
  UploadBtn,
  RetryBtn,
  CancelBtn,
  PauseResumeButton,
  DoneBtn,
  LoadingSpinner,
  ProgressDetails,
  ProgressBarProcessing,
  ProgressBarError,
  ProgressBarUploading,
  ProgressBarComplete
};

},{"./../../utils/lib/prettyETA":71,"./StatusBarStates":46,"@transloadit/prettier-bytes":1,"classnames":2,"lodash.throttle":4,"preact":10}],45:[function(require,module,exports){
"use strict";

const {
  h
} = require('preact');

const classNames = require('classnames');

const statusBarStates = require('./StatusBarStates');

const calculateProcessingProgress = require('./calculateProcessingProgress');

const {
  UploadBtn,
  RetryBtn,
  CancelBtn,
  PauseResumeButton,
  DoneBtn,
  ProgressBarProcessing,
  ProgressBarError,
  ProgressBarUploading,
  ProgressBarComplete
} = require('./Components');

const {
  STATE_ERROR,
  STATE_WAITING,
  STATE_PREPROCESSING,
  STATE_UPLOADING,
  STATE_POSTPROCESSING,
  STATE_COMPLETE
} = statusBarStates;
module.exports = StatusBar;

function StatusBar(props) {
  const {
    newFiles,
    allowNewUpload,
    isUploadInProgress,
    isAllPaused,
    resumableUploads,
    error,
    hideUploadButton,
    hidePauseResumeButton,
    hideCancelButton,
    hideRetryButton,
    recoveredState,
    uploadState,
    totalProgress,
    files,
    supportsUploadProgress,
    hideAfterFinish,
    isSomeGhost,
    isTargetDOMEl,
    doneButtonHandler,
    isUploadStarted,
    i18n,
    startUpload,
    uppy,
    isAllComplete,
    showProgressDetails,
    numUploads,
    complete,
    totalSize,
    totalETA,
    totalUploadedSize
  } = props;

  function getProgressValue() {
    switch (uploadState) {
      case STATE_POSTPROCESSING:
      case STATE_PREPROCESSING:
        {
          const progress = calculateProcessingProgress(files);

          if (progress.mode === 'determinate') {
            return progress.value * 100;
          }

          return totalProgress;
        }

      case STATE_ERROR:
        {
          return null;
        }

      case STATE_UPLOADING:
        {
          if (!supportsUploadProgress) {
            return null;
          }

          return totalProgress;
        }

      default:
        return totalProgress;
    }
  }

  function getIsIndeterminate() {
    switch (uploadState) {
      case STATE_POSTPROCESSING:
      case STATE_PREPROCESSING:
        {
          const {
            mode
          } = calculateProcessingProgress(files);
          return mode === 'indeterminate';
        }

      case STATE_UPLOADING:
        {
          if (!supportsUploadProgress) {
            return true;
          }

          return false;
        }

      default:
        return false;
    }
  }

  function getIsHidden() {
    if (recoveredState) {
      return false;
    }

    switch (uploadState) {
      case STATE_WAITING:
        return hideUploadButton || newFiles === 0;

      case STATE_COMPLETE:
        return hideAfterFinish;

      default:
        return false;
    }
  }

  const progressValue = getProgressValue();
  const isHidden = getIsHidden();
  const width = progressValue != null ? progressValue : 100;
  const showUploadBtn = !error && newFiles && !isUploadInProgress && !isAllPaused && allowNewUpload && !hideUploadButton;
  const showCancelBtn = !hideCancelButton && uploadState !== STATE_WAITING && uploadState !== STATE_COMPLETE;
  const showPauseResumeBtn = resumableUploads && !hidePauseResumeButton && uploadState === STATE_UPLOADING;
  const showRetryBtn = error && !hideRetryButton;
  const showDoneBtn = doneButtonHandler && uploadState === STATE_COMPLETE;
  const progressClassNames = classNames('uppy-StatusBar-progress', {
    'is-indeterminate': getIsIndeterminate()
  });
  const statusBarClassNames = classNames({
    'uppy-Root': isTargetDOMEl
  }, 'uppy-StatusBar', `is-${uploadState}`, {
    'has-ghosts': isSomeGhost
  });
  return h("div", {
    className: statusBarClassNames,
    "aria-hidden": isHidden
  }, h("div", {
    className: progressClassNames,
    style: {
      width: `${width}%`
    },
    role: "progressbar",
    "aria-label": `${width}%`,
    "aria-valuetext": `${width}%`,
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": progressValue
  }), (() => {
    switch (uploadState) {
      case STATE_PREPROCESSING:
      case STATE_POSTPROCESSING:
        return h(ProgressBarProcessing, {
          progress: calculateProcessingProgress(files)
        });

      case STATE_COMPLETE:
        return h(ProgressBarComplete, {
          i18n: i18n
        });

      case STATE_ERROR:
        return h(ProgressBarError, {
          error: error,
          i18n: i18n
        });

      case STATE_UPLOADING:
        return h(ProgressBarUploading, {
          i18n: i18n,
          supportsUploadProgress: supportsUploadProgress,
          totalProgress: totalProgress,
          showProgressDetails: showProgressDetails,
          isUploadStarted: isUploadStarted,
          isAllComplete: isAllComplete,
          isAllPaused: isAllPaused,
          newFiles: newFiles,
          numUploads: numUploads,
          complete: complete,
          totalUploadedSize: totalUploadedSize,
          totalSize: totalSize,
          totalETA: totalETA,
          startUpload: startUpload
        });

      default:
        return null;
    }
  })(), h("div", {
    className: "uppy-StatusBar-actions"
  }, recoveredState || showUploadBtn ? h(UploadBtn, {
    newFiles: newFiles,
    isUploadStarted: isUploadStarted,
    recoveredState: recoveredState,
    i18n: i18n,
    isSomeGhost: isSomeGhost,
    startUpload: startUpload,
    uploadState: uploadState
  }) : null, showRetryBtn ? h(RetryBtn, {
    i18n: i18n,
    uppy: uppy
  }) : null, showPauseResumeBtn ? h(PauseResumeButton, {
    isAllPaused: isAllPaused,
    i18n: i18n,
    isAllComplete: isAllComplete,
    resumableUploads: resumableUploads,
    uppy: uppy
  }) : null, showCancelBtn ? h(CancelBtn, {
    i18n: i18n,
    uppy: uppy
  }) : null, showDoneBtn ? h(DoneBtn, {
    i18n: i18n,
    doneButtonHandler: doneButtonHandler
  }) : null));
}

},{"./Components":44,"./StatusBarStates":46,"./calculateProcessingProgress":47,"classnames":2,"preact":10}],46:[function(require,module,exports){
"use strict";

module.exports = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete'
};

},{}],47:[function(require,module,exports){
"use strict";

module.exports = function calculateProcessingProgress(files) {
  const values = [];
  let mode;
  let message;

  for (const {
    progress
  } of Object.values(files)) {
    const {
      preprocess,
      postprocess
    } = progress; // In the future we should probably do this differently. For now we'll take the
    // mode and message from the first file…

    if (message == null && (preprocess || postprocess)) {
      ({
        mode,
        message
      } = preprocess || postprocess);
    }

    if ((preprocess == null ? void 0 : preprocess.mode) === 'determinate') values.push(preprocess.value);
    if ((postprocess == null ? void 0 : postprocess.mode) === 'determinate') values.push(postprocess.value);
  }

  const value = values.reduce((total, progressValue) => {
    return total + progressValue / values.length;
  }, 0);
  return {
    mode,
    message,
    value
  };
};

},{}],48:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const getSpeed = require('./../../utils/lib/getSpeed');

const getBytesRemaining = require('./../../utils/lib/getBytesRemaining');

const getTextDirection = require('./../../utils/lib/getTextDirection');

const statusBarStates = require('./StatusBarStates');

const StatusBarUI = require('./StatusBar');
/**
 * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
 * progress percentage and time remaining.
 */


module.exports = (_temp = _class = class StatusBar extends UIPlugin {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    super(uppy, opts);

    this.startUpload = () => {
      const {
        recoveredState
      } = this.uppy.getState();

      if (recoveredState) {
        this.uppy.emit('restore-confirmed');
        return undefined;
      }

      return this.uppy.upload().catch(() => {// Error logged in Core
      });
    };

    this.id = this.opts.id || 'StatusBar';
    this.title = 'StatusBar';
    this.type = 'progressindicator';
    this.defaultLocale = {
      strings: {
        uploading: 'Uploading',
        upload: 'Upload',
        complete: 'Complete',
        uploadFailed: 'Upload failed',
        paused: 'Paused',
        retry: 'Retry',
        retryUpload: 'Retry upload',
        cancel: 'Cancel',
        pause: 'Pause',
        resume: 'Resume',
        done: 'Done',
        filesUploadedOfTotal: {
          0: '%{complete} of %{smart_count} file uploaded',
          1: '%{complete} of %{smart_count} files uploaded'
        },
        dataUploadedOfTotal: '%{complete} of %{total}',
        xTimeLeft: '%{time} left',
        uploadXFiles: {
          0: 'Upload %{smart_count} file',
          1: 'Upload %{smart_count} files'
        },
        uploadXNewFiles: {
          0: 'Upload +%{smart_count} file',
          1: 'Upload +%{smart_count} files'
        },
        xMoreFilesAdded: {
          0: '%{smart_count} more file added',
          1: '%{smart_count} more files added'
        }
      }
    }; // set default options

    const defaultOptions = {
      target: 'body',
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      showProgressDetails: false,
      hideAfterFinish: true,
      doneButtonHandler: null
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.install = this.install.bind(this);
  }

  render(state) {
    const {
      capabilities,
      files,
      allowNewUpload,
      totalProgress,
      error,
      recoveredState
    } = state;
    const {
      newFiles,
      startedFiles,
      completeFiles,
      inProgressNotPausedFiles,
      isUploadStarted,
      isAllComplete,
      isAllErrored,
      isAllPaused,
      isUploadInProgress,
      isSomeGhost
    } = this.uppy.getObjectOfFilesPerState(); // If some state was recovered, we want to show Upload button/counter
    // for all the files, because in this case it’s not an Upload button,
    // but “Confirm Restore Button”

    const newFilesOrRecovered = recoveredState ? Object.values(files) : newFiles;
    const totalETA = getTotalETA(inProgressNotPausedFiles);
    const resumableUploads = !!capabilities.resumableUploads;
    const supportsUploadProgress = capabilities.uploadProgress !== false;
    let totalSize = 0;
    let totalUploadedSize = 0;
    startedFiles.forEach(file => {
      totalSize += file.progress.bytesTotal || 0;
      totalUploadedSize += file.progress.bytesUploaded || 0;
    });
    return StatusBarUI({
      error,
      uploadState: getUploadingState(isAllErrored, isAllComplete, recoveredState, state.files || {}),
      allowNewUpload,
      totalProgress,
      totalSize,
      totalUploadedSize,
      isAllComplete: false,
      isAllPaused,
      isAllErrored,
      isUploadStarted,
      isUploadInProgress,
      isSomeGhost,
      recoveredState,
      complete: completeFiles.length,
      newFiles: newFilesOrRecovered.length,
      numUploads: startedFiles.length,
      totalETA,
      files,
      i18n: this.i18n,
      uppy: this.uppy,
      startUpload: this.startUpload,
      doneButtonHandler: this.opts.doneButtonHandler,
      resumableUploads,
      supportsUploadProgress,
      showProgressDetails: this.opts.showProgressDetails,
      hideUploadButton: this.opts.hideUploadButton,
      hideRetryButton: this.opts.hideRetryButton,
      hidePauseResumeButton: this.opts.hidePauseResumeButton,
      hideCancelButton: this.opts.hideCancelButton,
      hideAfterFinish: this.opts.hideAfterFinish,
      isTargetDOMEl: this.isTargetDOMEl
    });
  }

  onMount() {
    // Set the text direction if the page has not defined one.
    const element = this.el;
    const direction = getTextDirection(element);

    if (!direction) {
      element.dir = 'ltr';
    }
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.1.1", _temp);

function getTotalSpeed(files) {
  let totalSpeed = 0;
  files.forEach(file => {
    totalSpeed += getSpeed(file.progress);
  });
  return totalSpeed;
}

function getTotalETA(files) {
  const totalSpeed = getTotalSpeed(files);

  if (totalSpeed === 0) {
    return 0;
  }

  const totalBytesRemaining = files.reduce((total, file) => {
    return total + getBytesRemaining(file.progress);
  }, 0);
  return Math.round(totalBytesRemaining / totalSpeed * 10) / 10;
}

function getUploadingState(isAllErrored, isAllComplete, recoveredState, files) {
  if (isAllErrored) {
    return statusBarStates.STATE_ERROR;
  }

  if (isAllComplete) {
    return statusBarStates.STATE_COMPLETE;
  }

  if (recoveredState) {
    return statusBarStates.STATE_WAITING;
  }

  let state = statusBarStates.STATE_WAITING;
  const fileIDs = Object.keys(files);

  for (let i = 0; i < fileIDs.length; i++) {
    const {
      progress
    } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

    if (progress.uploadStarted && !progress.uploadComplete) {
      return statusBarStates.STATE_UPLOADING;
    } // If files are being preprocessed AND postprocessed at this time, we show the
    // preprocess state. If any files are being uploaded we show uploading.


    if (progress.preprocess && state !== statusBarStates.STATE_UPLOADING) {
      state = statusBarStates.STATE_PREPROCESSING;
    } // If NO files are being preprocessed or uploaded right now, but some files are
    // being postprocessed, show the postprocess state.


    if (progress.postprocess && state !== statusBarStates.STATE_UPLOADING && state !== statusBarStates.STATE_PREPROCESSING) {
      state = statusBarStates.STATE_POSTPROCESSING;
    }
  }

  return state;
}

},{"./../../core":40,"./../../utils/lib/getBytesRemaining":60,"./../../utils/lib/getSpeed":64,"./../../utils/lib/getTextDirection":65,"./StatusBar":45,"./StatusBarStates":46}],49:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _publish = /*#__PURE__*/_classPrivateFieldLooseKey("publish");

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
  constructor() {
    Object.defineProperty(this, _publish, {
      value: _publish2
    });
    this.state = {};
    this.callbacks = [];
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    const prevState = { ...this.state
    };
    const nextState = { ...this.state,
      ...patch
    };
    this.state = nextState;

    _classPrivateFieldLooseBase(this, _publish)[_publish](prevState, nextState, patch);
  }

  subscribe(listener) {
    this.callbacks.push(listener);
    return () => {
      // Remove the listener.
      this.callbacks.splice(this.callbacks.indexOf(listener), 1);
    };
  }

}

function _publish2(...args) {
  this.callbacks.forEach(listener => {
    listener(...args);
  });
}

DefaultStore.VERSION = "2.0.2";

module.exports = function defaultStore() {
  return new DefaultStore();
};

},{}],50:[function(require,module,exports){
"use strict";

const tus = require('tus-js-client');

function isCordova() {
  return typeof window !== 'undefined' && (typeof window.PhoneGap !== 'undefined' || typeof window.Cordova !== 'undefined' || typeof window.cordova !== 'undefined');
}

function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
} // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
// now also includes `relativePath` for files added from folders.
// This means you can add 2 identical files, if one is in folder a,
// the other in folder b — `a/file.jpg` and `b/file.jpg`, when added
// together with a folder, will be treated as 2 separate files.
//
// For React Native and Cordova, we let tus-js-client’s default
// fingerprint handling take charge.


module.exports = function getFingerprint(uppyFileObj) {
  return (file, options) => {
    if (isCordova() || isReactNative()) {
      return tus.defaultOptions.fingerprint(file, options);
    }

    const uppyFingerprint = ['tus', uppyFileObj.id, options.endpoint].join('-');
    return Promise.resolve(uppyFingerprint);
  };
};

},{"tus-js-client":17}],51:[function(require,module,exports){
"use strict";

var _class, _temp;

const BasePlugin = require('./../../core/lib/BasePlugin');

const tus = require('tus-js-client');

const {
  Provider,
  RequestClient,
  Socket
} = require('./../../companion-client');

const emitSocketProgress = require('./../../utils/lib/emitSocketProgress');

const getSocketHost = require('./../../utils/lib/getSocketHost');

const settle = require('./../../utils/lib/settle');

const EventTracker = require('./../../utils/lib/EventTracker');

const NetworkError = require('./../../utils/lib/NetworkError');

const isNetworkError = require('./../../utils/lib/isNetworkError');

const {
  RateLimitedQueue
} = require('./../../utils/lib/RateLimitedQueue');

const hasProperty = require('./../../utils/lib/hasProperty');

const getFingerprint = require('./getFingerprint');
/** @typedef {import('..').TusOptions} TusOptions */

/** @typedef {import('tus-js-client').UploadOptions} RawTusOptions */

/** @typedef {import('@uppy/core').Uppy} Uppy */

/** @typedef {import('@uppy/core').UppyFile} UppyFile */

/** @typedef {import('@uppy/core').FailedUppyFile<{}>} FailedUppyFile */

/**
 * Extracted from https://github.com/tus/tus-js-client/blob/master/lib/upload.js#L13
 * excepted we removed 'fingerprint' key to avoid adding more dependencies
 *
 * @type {RawTusOptions}
 */


const tusDefaultOptions = {
  endpoint: '',
  uploadUrl: null,
  metadata: {},
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false
};
/**
 * Tus resumable file uploader
 */

module.exports = (_temp = _class = class Tus extends BasePlugin {
  /**
   * @param {Uppy} uppy
   * @param {TusOptions} opts
   */
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'uploader';
    this.id = this.opts.id || 'Tus';
    this.title = 'Tus'; // set default options

    const defaultOptions = {
      useFastRemoteRetry: true,
      limit: 5,
      retryDelays: [0, 1000, 3000, 5000],
      withCredentials: false
    }; // merge default options with the ones set by user

    /** @type {import("..").TusOptions} */

    this.opts = { ...defaultOptions,
      ...opts
    };

    if ('autoRetry' in opts) {
      throw new Error('The `autoRetry` option was deprecated and has been removed.');
    }
    /**
     * Simultaneous upload limiting is shared across all uploads with this plugin.
     *
     * @type {RateLimitedQueue}
     */


    this.requests = new RateLimitedQueue(this.opts.limit);
    this.uploaders = Object.create(null);
    this.uploaderEvents = Object.create(null);
    this.uploaderSockets = Object.create(null);
    this.handleResetProgress = this.handleResetProgress.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleResetProgress() {
    const files = { ...this.uppy.getState().files
    };
    Object.keys(files).forEach(fileID => {
      // Only clone the file object if it has a Tus `uploadUrl` attached.
      if (files[fileID].tus && files[fileID].tus.uploadUrl) {
        const tusState = { ...files[fileID].tus
        };
        delete tusState.uploadUrl;
        files[fileID] = { ...files[fileID],
          tus: tusState
        };
      }
    });
    this.uppy.setState({
      files
    });
  }
  /**
   * Clean up all references for a file's upload: the tus.Upload instance,
   * any events related to the file, and the Companion WebSocket connection.
   *
   * @param {string} fileID
   */


  resetUploaderReferences(fileID, opts = {}) {
    if (this.uploaders[fileID]) {
      const uploader = this.uploaders[fileID];
      uploader.abort();

      if (opts.abort) {
        uploader.abort(true);
      }

      this.uploaders[fileID] = null;
    }

    if (this.uploaderEvents[fileID]) {
      this.uploaderEvents[fileID].remove();
      this.uploaderEvents[fileID] = null;
    }

    if (this.uploaderSockets[fileID]) {
      this.uploaderSockets[fileID].close();
      this.uploaderSockets[fileID] = null;
    }
  }
  /**
   * Create a new Tus upload.
   *
   * A lot can happen during an upload, so this is quite hard to follow!
   * - First, the upload is started. If the file was already paused by the time the upload starts, nothing should happen.
   *   If the `limit` option is used, the upload must be queued onto the `this.requests` queue.
   *   When an upload starts, we store the tus.Upload instance, and an EventTracker instance that manages the event listeners
   *   for pausing, cancellation, removal, etc.
   * - While the upload is in progress, it may be paused or cancelled.
   *   Pausing aborts the underlying tus.Upload, and removes the upload from the `this.requests` queue. All other state is
   *   maintained.
   *   Cancelling removes the upload from the `this.requests` queue, and completely aborts the upload-- the `tus.Upload`
   *   instance is aborted and discarded, the EventTracker instance is destroyed (removing all listeners).
   *   Resuming the upload uses the `this.requests` queue as well, to prevent selectively pausing and resuming uploads from
   *   bypassing the limit.
   * - After completing an upload, the tus.Upload and EventTracker instances are cleaned up, and the upload is marked as done
   *   in the `this.requests` queue.
   * - When an upload completed with an error, the same happens as on successful completion, but the `upload()` promise is
   *   rejected.
   *
   * When working on this function, keep in mind:
   *  - When an upload is completed or cancelled for any reason, the tus.Upload and EventTracker instances need to be cleaned
   *    up using this.resetUploaderReferences().
   *  - When an upload is cancelled or paused, for any reason, it needs to be removed from the `this.requests` queue using
   *    `queuedRequest.abort()`.
   *  - When an upload is completed for any reason, including errors, it needs to be marked as such using
   *    `queuedRequest.done()`.
   *  - When an upload is started or resumed, it needs to go through the `this.requests` queue. The `queuedRequest` variable
   *    must be updated so the other uses of it are valid.
   *  - Before replacing the `queuedRequest` variable, the previous `queuedRequest` must be aborted, else it will keep taking
   *    up a spot in the queue.
   *
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */


  upload(file) {
    this.resetUploaderReferences(file.id); // Create a new tus upload

    return new Promise((resolve, reject) => {
      this.uppy.emit('upload-started', file);
      const opts = { ...this.opts,
        ...(file.tus || {})
      };

      if (typeof opts.headers === 'function') {
        opts.headers = opts.headers(file);
      }
      /** @type {RawTusOptions} */


      const uploadOptions = { ...tusDefaultOptions,
        ...opts
      }; // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
      // now also includes `relativePath` for files added from folders.
      // This means you can add 2 identical files, if one is in folder a,
      // the other in folder b.

      uploadOptions.fingerprint = getFingerprint(file);

      uploadOptions.onBeforeRequest = req => {
        const xhr = req.getUnderlyingObject();
        xhr.withCredentials = !!opts.withCredentials;

        if (typeof opts.onBeforeRequest === 'function') {
          opts.onBeforeRequest(req);
        }
      };

      uploadOptions.onError = err => {
        this.uppy.log(err);
        const xhr = err.originalRequest ? err.originalRequest.getUnderlyingObject() : null;

        if (isNetworkError(xhr)) {
          err = new NetworkError(err, xhr);
        }

        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        this.uppy.emit('upload-error', file, err);
        reject(err);
      };

      uploadOptions.onProgress = (bytesUploaded, bytesTotal) => {
        this.onReceiveUploadUrl(file, upload.url);
        this.uppy.emit('upload-progress', file, {
          uploader: this,
          bytesUploaded,
          bytesTotal
        });
      };

      uploadOptions.onSuccess = () => {
        const uploadResp = {
          uploadURL: upload.url
        };
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        this.uppy.emit('upload-success', file, uploadResp);

        if (upload.url) {
          this.uppy.log(`Download ${upload.file.name} from ${upload.url}`);
        }

        resolve(upload);
      };

      const copyProp = (obj, srcProp, destProp) => {
        if (hasProperty(obj, srcProp) && !hasProperty(obj, destProp)) {
          obj[destProp] = obj[srcProp];
        }
      };
      /** @type {Record<string, string>} */


      const meta = {};
      const metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(item => {
        meta[item] = file.meta[item];
      }); // tusd uses metadata fields 'filetype' and 'filename'

      copyProp(meta, 'type', 'filetype');
      copyProp(meta, 'name', 'filename');
      uploadOptions.metadata = meta;
      const upload = new tus.Upload(file.data, uploadOptions);
      this.uploaders[file.id] = upload;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      upload.findPreviousUploads().then(previousUploads => {
        const previousUpload = previousUploads[0];

        if (previousUpload) {
          this.uppy.log(`[Tus] Resuming upload of ${file.id} started at ${previousUpload.creationTime}`);
          upload.resumeFromPreviousUpload(previousUpload);
        }
      });
      let queuedRequest = this.requests.run(() => {
        if (!file.isPaused) {
          upload.start();
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return () => {};
      });
      this.onFileRemove(file.id, targetFileID => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });
        resolve(`upload ${targetFileID} was removed`);
      });
      this.onPause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          upload.abort();
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            upload.start();
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        upload.abort();
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });
        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          upload.abort();
        }

        queuedRequest = this.requests.run(() => {
          upload.start();
          return () => {};
        });
      });
    }).catch(err => {
      this.uppy.emit('upload-error', file, err);
      throw err;
    });
  }
  /**
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */


  uploadRemote(file) {
    this.resetUploaderReferences(file.id);
    const opts = { ...this.opts
    };

    if (file.tus) {
      // Install file-specific upload overrides.
      Object.assign(opts, file.tus);
    }

    this.uppy.emit('upload-started', file);
    this.uppy.log(file.remote.url);

    if (file.serverToken) {
      return this.connectToServerSocket(file);
    }

    return new Promise((resolve, reject) => {
      const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      const client = new Client(this.uppy, file.remote.providerOptions); // !! cancellation is NOT supported at this stage yet

      client.post(file.remote.url, { ...file.remote.body,
        endpoint: opts.endpoint,
        uploadUrl: opts.uploadUrl,
        protocol: 'tus',
        size: file.data.size,
        headers: opts.headers,
        metadata: file.meta
      }).then(res => {
        this.uppy.setFileState(file.id, {
          serverToken: res.token
        });
        file = this.uppy.getFile(file.id);
        return this.connectToServerSocket(file);
      }).then(() => {
        resolve();
      }).catch(err => {
        this.uppy.emit('upload-error', file, err);
        reject(err);
      });
    });
  }
  /**
   * See the comment on the upload() method.
   *
   * Additionally, when an upload is removed, completed, or cancelled, we need to close the WebSocket connection. This is
   * handled by the resetUploaderReferences() function, so the same guidelines apply as in upload().
   *
   * @param {UppyFile} file
   */


  connectToServerSocket(file) {
    return new Promise((resolve, reject) => {
      const token = file.serverToken;
      const host = getSocketHost(file.remote.companionUrl);
      const socket = new Socket({
        target: `${host}/api/${token}`,
        autoOpen: false
      });
      this.uploaderSockets[file.id] = socket;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      this.onFileRemove(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id);
        resolve(`upload ${file.id} was removed`);
      });
      this.onPause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          socket.send('pause', {});
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            socket.send('resume', {});
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        socket.send('pause', {});
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id);
        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          socket.send('pause', {});
        }

        queuedRequest = this.requests.run(() => {
          socket.send('resume', {});
          return () => {};
        });
      });
      this.onRetry(file.id, () => {
        // Only do the retry if the upload is actually in progress;
        // else we could try to send these messages when the upload is still queued.
        // We may need a better check for this since the socket may also be closed
        // for other reasons, like network failures.
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      this.onRetryAll(file.id, () => {
        // See the comment in the onRetry() call
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
      socket.on('error', errData => {
        const {
          message
        } = errData.error;
        const error = Object.assign(new Error(message), {
          cause: errData.error
        }); // If the remote retry optimisation should not be used,
        // close the socket—this will tell companion to clear state and delete the file.

        if (!this.opts.useFastRemoteRetry) {
          this.resetUploaderReferences(file.id); // Remove the serverToken so that a new one will be created for the retry.

          this.uppy.setFileState(file.id, {
            serverToken: null
          });
        } else {
          socket.close();
        }

        this.uppy.emit('upload-error', file, error);
        queuedRequest.done();
        reject(error);
      });
      socket.on('success', data => {
        const uploadResp = {
          uploadURL: data.url
        };
        this.uppy.emit('upload-success', file, uploadResp);
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        resolve();
      });
      let queuedRequest = this.requests.run(() => {
        socket.open();

        if (file.isPaused) {
          socket.send('pause', {});
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return () => {};
      });
    });
  }
  /**
   * Store the uploadUrl on the file options, so that when Golden Retriever
   * restores state, we will continue uploading to the correct URL.
   *
   * @param {UppyFile} file
   * @param {string} uploadURL
   */


  onReceiveUploadUrl(file, uploadURL) {
    const currentFile = this.uppy.getFile(file.id);
    if (!currentFile) return; // Only do the update if we didn't have an upload URL yet.

    if (!currentFile.tus || currentFile.tus.uploadUrl !== uploadURL) {
      this.uppy.log('[Tus] Storing upload url');
      this.uppy.setFileState(currentFile.id, {
        tus: { ...currentFile.tus,
          uploadUrl: uploadURL
        }
      });
    }
  }
  /**
   * @param {string} fileID
   * @param {function(string): void} cb
   */


  onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', file => {
      if (fileID === file.id) cb(file.id);
    });
  }
  /**
   * @param {string} fileID
   * @param {function(boolean): void} cb
   */


  onPause(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-pause', (targetFileID, isPaused) => {
      if (fileID === targetFileID) {
        // const isPaused = this.uppy.pauseResume(fileID)
        cb(isPaused);
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', targetFileID => {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onRetryAll(fileID, cb) {
    this.uploaderEvents[fileID].on('retry-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onPauseAll(fileID, cb) {
    this.uploaderEvents[fileID].on('pause-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onCancelAll(fileID, cb) {
    this.uploaderEvents[fileID].on('cancel-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onResumeAll(fileID, cb) {
    this.uploaderEvents[fileID].on('resume-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {(UppyFile | FailedUppyFile)[]} files
   */


  uploadFiles(files) {
    const promises = files.map((file, i) => {
      const current = i + 1;
      const total = files.length;

      if ('error' in file && file.error) {
        return Promise.reject(new Error(file.error));
      }

      if (file.isRemote) {
        // We emit upload-started here, so that it's also emitted for files
        // that have to wait due to the `limit` option.
        // Don't double-emit upload-started for Golden Retriever-restored files that were already started
        if (!file.progress.uploadStarted || !file.isRestored) {
          this.uppy.emit('upload-started', file);
        }

        return this.uploadRemote(file, current, total);
      } // Don't double-emit upload-started for Golden Retriever-restored files that were already started


      if (!file.progress.uploadStarted || !file.isRestored) {
        this.uppy.emit('upload-started', file);
      }

      return this.upload(file, current, total);
    });
    return settle(promises);
  }
  /**
   * @param {string[]} fileIDs
   */


  handleUpload(fileIDs) {
    if (fileIDs.length === 0) {
      this.uppy.log('[Tus] No files to upload');
      return Promise.resolve();
    }

    if (this.opts.limit === 0) {
      this.uppy.log('[Tus] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/tus/#limit-0', 'warning');
    }

    this.uppy.log('[Tus] Uploading...');
    const filesToUpload = fileIDs.map(fileID => this.uppy.getFile(fileID));
    return this.uploadFiles(filesToUpload).then(() => null);
  }

  install() {
    this.uppy.setState({
      capabilities: { ...this.uppy.getState().capabilities,
        resumableUploads: true
      }
    });
    this.uppy.addUploader(this.handleUpload);
    this.uppy.on('reset-progress', this.handleResetProgress);
  }

  uninstall() {
    this.uppy.setState({
      capabilities: { ...this.uppy.getState().capabilities,
        resumableUploads: false
      }
    });
    this.uppy.removeUploader(this.handleUpload);
  }

}, _class.VERSION = "2.1.1", _temp);

},{"./../../companion-client":34,"./../../core/lib/BasePlugin":36,"./../../utils/lib/EventTracker":52,"./../../utils/lib/NetworkError":53,"./../../utils/lib/RateLimitedQueue":54,"./../../utils/lib/emitSocketProgress":56,"./../../utils/lib/getSocketHost":63,"./../../utils/lib/hasProperty":67,"./../../utils/lib/isNetworkError":69,"./../../utils/lib/settle":73,"./getFingerprint":50,"tus-js-client":17}],52:[function(require,module,exports){
"use strict";

var _emitter, _events;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = (_emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _events = /*#__PURE__*/_classPrivateFieldLooseKey("events"), class EventTracker {
  constructor(emitter) {
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _events, {
      writable: true,
      value: []
    });
    _classPrivateFieldLooseBase(this, _emitter)[_emitter] = emitter;
  }

  on(event, fn) {
    _classPrivateFieldLooseBase(this, _events)[_events].push([event, fn]);

    return _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, fn);
  }

  remove() {
    for (const [event, fn] of _classPrivateFieldLooseBase(this, _events)[_events].splice(0)) {
      _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, fn);
    }
  }

});

},{}],53:[function(require,module,exports){
"use strict";

class NetworkError extends Error {
  constructor(error, xhr = null) {
    super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
    this.cause = error;
    this.isNetworkError = true;
    this.request = xhr;
  }

}

module.exports = NetworkError;

},{}],54:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function createCancelError() {
  return new Error('Cancelled');
}

var _activeRequests = /*#__PURE__*/_classPrivateFieldLooseKey("activeRequests");

var _queuedHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("queuedHandlers");

var _call = /*#__PURE__*/_classPrivateFieldLooseKey("call");

var _queueNext = /*#__PURE__*/_classPrivateFieldLooseKey("queueNext");

var _next = /*#__PURE__*/_classPrivateFieldLooseKey("next");

var _queue = /*#__PURE__*/_classPrivateFieldLooseKey("queue");

var _dequeue = /*#__PURE__*/_classPrivateFieldLooseKey("dequeue");

class RateLimitedQueue {
  constructor(limit) {
    Object.defineProperty(this, _dequeue, {
      value: _dequeue2
    });
    Object.defineProperty(this, _queue, {
      value: _queue2
    });
    Object.defineProperty(this, _next, {
      value: _next2
    });
    Object.defineProperty(this, _queueNext, {
      value: _queueNext2
    });
    Object.defineProperty(this, _call, {
      value: _call2
    });
    Object.defineProperty(this, _activeRequests, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _queuedHandlers, {
      writable: true,
      value: []
    });

    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }
  }

  run(fn, queueOptions) {
    if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] < this.limit) {
      return _classPrivateFieldLooseBase(this, _call)[_call](fn);
    }

    return _classPrivateFieldLooseBase(this, _queue)[_queue](fn, queueOptions);
  }

  wrapPromiseFunction(fn, queueOptions) {
    return (...args) => {
      let queuedRequest;
      const outerPromise = new Promise((resolve, reject) => {
        queuedRequest = this.run(() => {
          let cancelError;
          let innerPromise;

          try {
            innerPromise = Promise.resolve(fn(...args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(result => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, err => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return () => {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = () => {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  }

}

function _call2(fn) {
  _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] += 1;
  let done = false;
  let cancelActive;

  try {
    cancelActive = fn();
  } catch (err) {
    _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
    throw err;
  }

  return {
    abort: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
      cancelActive();

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    },
    done: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  };
}

function _queueNext2() {
  // Do it soon but not immediately, this allows clearing out the entire queue synchronously
  // one by one without continuously _advancing_ it (and starting new tasks before immediately
  // aborting them)
  queueMicrotask(() => _classPrivateFieldLooseBase(this, _next)[_next]());
}

function _next2() {
  if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] >= this.limit) {
    return;
  }

  if (_classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].length === 0) {
    return;
  } // Dispatch the next request, and update the abort/done handlers
  // so that cancelling it does the Right Thing (and doesn't just try
  // to dequeue an already-running request).


  const next = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].shift();

  const handler = _classPrivateFieldLooseBase(this, _call)[_call](next.fn);

  next.abort = handler.abort;
  next.done = handler.done;
}

function _queue2(fn, options = {}) {
  const handler = {
    fn,
    priority: options.priority || 0,
    abort: () => {
      _classPrivateFieldLooseBase(this, _dequeue)[_dequeue](handler);
    },
    done: () => {
      throw new Error('Cannot mark a queued request as done: this indicates a bug');
    }
  };

  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].findIndex(other => {
    return handler.priority > other.priority;
  });

  if (index === -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].push(handler);
  } else {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 0, handler);
  }

  return handler;
}

function _dequeue2(handler) {
  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].indexOf(handler);

  if (index !== -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 1);
  }
}

module.exports = {
  RateLimitedQueue,
  internalRateLimitedQueue: Symbol('__queue')
};

},{}],55:[function(require,module,exports){
"use strict";

var _apply;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const has = require('./hasProperty');

function insertReplacement(source, rx, replacement) {
  const newParts = [];
  source.forEach(chunk => {
    // When the source contains multiple placeholders for interpolation,
    // we should ignore chunks that are not strings, because those
    // can be JSX objects and will be otherwise incorrectly turned into strings.
    // Without this condition we’d get this: [object Object] hello [object Object] my <button>
    if (typeof chunk !== 'string') {
      return newParts.push(chunk);
    }

    return rx[Symbol.split](chunk).forEach((raw, i, list) => {
      if (raw !== '') {
        newParts.push(raw);
      } // Interlace with the `replacement` value


      if (i < list.length - 1) {
        newParts.push(replacement);
      }
    });
  });
  return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param {string} phrase that needs interpolation, with placeholders
 * @param {object} options with values that will be used to replace placeholders
 * @returns {any[]} interpolated
 */


function interpolate(phrase, options) {
  const dollarRegex = /\$/g;
  const dollarBillsYall = '$$$$';
  let interpolated = [phrase];
  if (options == null) return interpolated;

  for (const arg of Object.keys(options)) {
    if (arg !== '_') {
      // Ensure replacement value is escaped to prevent special $-prefixed
      // regex replace tokens. the "$$$$" is needed because each "$" needs to
      // be escaped with "$" itself, and we need two in the resulting output.
      let replacement = options[arg];

      if (typeof replacement === 'string') {
        replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
      } // We create a new `RegExp` each time instead of using a more-efficient
      // string replace so that the same argument can be replaced multiple times
      // in the same phrase.


      interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
    }
  }

  return interpolated;
}
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = (_apply = /*#__PURE__*/_classPrivateFieldLooseKey("apply"), class Translator {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  constructor(locales) {
    Object.defineProperty(this, _apply, {
      value: _apply2
    });
    this.locale = {
      strings: {},

      pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }

    };

    if (Array.isArray(locales)) {
      locales.forEach(_classPrivateFieldLooseBase(this, _apply)[_apply], this);
    } else {
      _classPrivateFieldLooseBase(this, _apply)[_apply](locales);
    }
  }

  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */


  translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error(`missing string: ${key}`);
    }

    const string = this.locale.strings[key];
    const hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        const plural = this.locale.pluralize(options.smart_count);
        return interpolate(string[plural], options);
      }

      throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
    }

    return interpolate(string, options);
  }

});

function _apply2(locale) {
  if (!(locale != null && locale.strings)) {
    return;
  }

  const prevLocale = this.locale;
  this.locale = { ...prevLocale,
    strings: { ...prevLocale.strings,
      ...locale.strings
    }
  };
  this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
}

},{"./hasProperty":67}],56:[function(require,module,exports){
"use strict";

const throttle = require('lodash.throttle');

function emitSocketProgress(uploader, progressData, file) {
  const {
    progress,
    bytesUploaded,
    bytesTotal
  } = progressData;

  if (progress) {
    uploader.uppy.log(`Upload progress: ${progress}`);
    uploader.uppy.emit('upload-progress', file, {
      uploader,
      bytesUploaded,
      bytesTotal
    });
  }
}

module.exports = throttle(emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

},{"lodash.throttle":4}],57:[function(require,module,exports){
"use strict";

const NetworkError = require('./NetworkError');
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError(...options) {
  return fetch(...options).catch(err => {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

},{"./NetworkError":53}],58:[function(require,module,exports){
"use strict";

const isDOMElement = require('./isDOMElement');
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context = document) {
  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }

  return null;
};

},{"./isDOMElement":68}],59:[function(require,module,exports){
"use strict";

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

function encodeFilename(name) {
  let suffix = '';
  return name.replace(/[^A-Z0-9]/ig, character => {
    suffix += `-${encodeCharacter(character)}`;
    return '/';
  }) + suffix;
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */


module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  let id = 'uppy';

  if (typeof file.name === 'string') {
    id += `-${encodeFilename(file.name.toLowerCase())}`;
  }

  if (file.type !== undefined) {
    id += `-${file.type}`;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
  }

  if (file.data.size !== undefined) {
    id += `-${file.data.size}`;
  }

  if (file.data.lastModified !== undefined) {
    id += `-${file.data.lastModified}`;
  }

  return id;
};

},{}],60:[function(require,module,exports){
"use strict";

module.exports = function getBytesRemaining(fileProgress) {
  return fileProgress.bytesTotal - fileProgress.bytesUploaded;
};

},{}],61:[function(require,module,exports){
"use strict";

/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  const lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  }

  return {
    name: fullFileName.slice(0, lastDot),
    extension: fullFileName.slice(lastDot + 1)
  };
};

},{}],62:[function(require,module,exports){
"use strict";

const getFileNameAndExtension = require('./getFileNameAndExtension');

const mimeTypes = require('./mimeTypes');

module.exports = function getFileType(file) {
  var _getFileNameAndExtens;

  if (file.type) return file.type;
  const fileExtension = file.name ? (_getFileNameAndExtens = getFileNameAndExtension(file.name).extension) == null ? void 0 : _getFileNameAndExtens.toLowerCase() : null;

  if (fileExtension && fileExtension in mimeTypes) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } // if all fails, fall back to a generic byte stream type


  return 'application/octet-stream';
};

},{"./getFileNameAndExtension":61,"./mimeTypes":70}],63:[function(require,module,exports){
"use strict";

module.exports = function getSocketHost(url) {
  // get the host domain
  const regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  const host = regex.exec(url)[1];
  const socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return `${socketProtocol}://${host}`;
};

},{}],64:[function(require,module,exports){
"use strict";

module.exports = function getSpeed(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;
  const timeElapsed = Date.now() - fileProgress.uploadStarted;
  const uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
  return uploadSpeed;
};

},{}],65:[function(require,module,exports){
"use strict";

/**
 * Get the declared text direction for an element.
 *
 * @param {Node} element
 * @returns {string|undefined}
 */
function getTextDirection(element) {
  var _element;

  // There is another way to determine text direction using getComputedStyle(), as done here:
  // https://github.com/pencil-js/text-direction/blob/2a235ce95089b3185acec3b51313cbba921b3811/text-direction.js
  //
  // We do not use that approach because we are interested specifically in the _declared_ text direction.
  // If no text direction is declared, we have to provide our own explicit text direction so our
  // bidirectional CSS style sheets work.
  while (element && !element.dir) {
    // eslint-disable-next-line no-param-reassign
    element = element.parentNode;
  }

  return (_element = element) == null ? void 0 : _element.dir;
}

module.exports = getTextDirection;

},{}],66:[function(require,module,exports){
"use strict";

/**
 * Adds zero to strings shorter than two characters.
 *
 * @param {number} number
 * @returns {string}
 */
function pad(number) {
  return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */


module.exports = function getTimeStamp() {
  const date = new Date();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

},{}],67:[function(require,module,exports){
"use strict";

module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

},{}],68:[function(require,module,exports){
"use strict";

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return (obj == null ? void 0 : obj.nodeType) === Node.ELEMENT_NODE;
};

},{}],69:[function(require,module,exports){
"use strict";

function isNetworkError(xhr) {
  if (!xhr) {
    return false;
  }

  return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
}

module.exports = isNetworkError;

},{}],70:[function(require,module,exports){
"use strict";

// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf',
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  dmg: 'application/x-apple-diskimage'
};

},{}],71:[function(require,module,exports){
"use strict";

const secondsToTime = require('./secondsToTime');

module.exports = function prettyETA(seconds) {
  const time = secondsToTime(seconds); // Only display hours and minutes if they are greater than 0 but always
  // display minutes if hours is being displayed
  // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s

  const hoursStr = time.hours === 0 ? '' : `${time.hours}h`;
  const minutesStr = time.minutes === 0 ? '' : `${time.hours === 0 ? time.minutes : ` ${time.minutes.toString(10).padStart(2, '0')}`}m`;
  const secondsStr = time.hours !== 0 ? '' : `${time.minutes === 0 ? time.seconds : ` ${time.seconds.toString(10).padStart(2, '0')}`}s`;
  return `${hoursStr}${minutesStr}${secondsStr}`;
};

},{"./secondsToTime":72}],72:[function(require,module,exports){
"use strict";

module.exports = function secondsToTime(rawSeconds) {
  const hours = Math.floor(rawSeconds / 3600) % 24;
  const minutes = Math.floor(rawSeconds / 60) % 60;
  const seconds = Math.floor(rawSeconds % 60);
  return {
    hours,
    minutes,
    seconds
  };
};

},{}],73:[function(require,module,exports){
"use strict";

module.exports = function settle(promises) {
  const resolutions = [];
  const rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  const wait = Promise.all(promises.map(promise => promise.then(resolved, rejected)));
  return wait.then(() => {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};

},{}],74:[function(require,module,exports){
"use strict";

/**
 * Converts list into array
 */
module.exports = Array.from;

},{}],75:[function(require,module,exports){
"use strict";

const Uppy = require('./../../../../packages/@uppy/core');

const FileInput = require('./../../../../packages/@uppy/file-input');

const StatusBar = require('./../../../../packages/@uppy/status-bar');

const Tus = require('./../../../../packages/@uppy/tus');

const uppyOne = new Uppy({
  debug: true,
  autoProceed: true
});
uppyOne.use(FileInput, {
  target: '.UppyInput',
  pretty: false
}).use(Tus, {
  endpoint: 'https://tusd.tusdemo.net/files/'
}).use(StatusBar, {
  target: '.UppyInput-Progress',
  hideUploadButton: true,
  hideAfterFinish: false
});

},{"./../../../../packages/@uppy/core":40,"./../../../../packages/@uppy/file-input":43,"./../../../../packages/@uppy/status-bar":48,"./../../../../packages/@uppy/tus":51}]},{},[75])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQHRyYW5zbG9hZGl0L3ByZXR0aWVyLWJ5dGVzL3ByZXR0aWVyQnl0ZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9qcy1iYXNlNjQvYmFzZTY0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9taW1lLW1hdGNoL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL21pbWUtbWF0Y2gvbm9kZV9tb2R1bGVzL3dpbGRjYXJkL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL25hbWVzcGFjZS1lbWl0dGVyL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmNqcyIsIi4uL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmNqcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvZmlsZVJlYWRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9maW5nZXJwcmludC5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9odHRwU3RhY2suanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvaXNDb3Jkb3ZhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL2lzUmVhY3ROYXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvcmVhZEFzQnl0ZUFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL3VyaVRvQmxvYi5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci91cmxTdG9yYWdlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9lcnJvci5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvbG9nZ2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9ub29wVXJsU3RvcmFnZS5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvdXBsb2FkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS91dWlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3VybC1wYXJzZS9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL0F1dGhFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL1Byb3ZpZGVyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvUmVxdWVzdENsaWVudC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL1NlYXJjaFByb3ZpZGVyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvU29ja2V0LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy90b2tlblN0b3JhZ2UuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9CYXNlUGx1Z2luLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvVUlQbHVnaW4uanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9VcHB5LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvZ2V0RmlsZU5hbWUuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL2xvZ2dlcnMuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9zdXBwb3J0c1VwbG9hZFByb2dyZXNzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvZmlsZS1pbnB1dC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9zdGF0dXMtYmFyL3NyYy9Db21wb25lbnRzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RhdHVzLWJhci9zcmMvU3RhdHVzQmFyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RhdHVzLWJhci9zcmMvU3RhdHVzQmFyU3RhdGVzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RhdHVzLWJhci9zcmMvY2FsY3VsYXRlUHJvY2Vzc2luZ1Byb2dyZXNzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RhdHVzLWJhci9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9zdG9yZS1kZWZhdWx0L3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3R1cy9zcmMvZ2V0RmluZ2VycHJpbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS90dXMvc3JjL2luZGV4LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL0V2ZW50VHJhY2tlci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9OZXR3b3JrRXJyb3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvUmF0ZUxpbWl0ZWRRdWV1ZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9UcmFuc2xhdG9yLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2VtaXRTb2NrZXRQcm9ncmVzcy5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9mZXRjaFdpdGhOZXR3b3JrRXJyb3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZmluZERPTUVsZW1lbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2VuZXJhdGVGaWxlSUQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0Qnl0ZXNSZW1haW5pbmcuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24uanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0RmlsZVR5cGUuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0U29ja2V0SG9zdC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRTcGVlZC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRUZXh0RGlyZWN0aW9uLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2dldFRpbWVTdGFtcC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9oYXNQcm9wZXJ0eS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9pc0RPTUVsZW1lbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvaXNOZXR3b3JrRXJyb3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvbWltZVR5cGVzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL3ByZXR0eUVUQS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9zZWNvbmRzVG9UaW1lLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL3NldHRsZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy90b0FycmF5LmpzIiwic3JjL2V4YW1wbGVzL3N0YXR1c2Jhci9hcHAuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0cENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOWdCQTs7QUFFQSxNQUFNLFNBQU4sU0FBd0IsS0FBeEIsQ0FBOEI7QUFDNUIsRUFBQSxXQUFXLEdBQUk7QUFDYixVQUFNLHdCQUFOO0FBQ0EsU0FBSyxJQUFMLEdBQVksV0FBWjtBQUNBLFNBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNEOztBQUwyQjs7QUFROUIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBakI7OztBQ1ZBOztBQUVBLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxpQkFBRCxDQUE3Qjs7QUFDQSxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQUQsQ0FBNUI7O0FBRUEsTUFBTSxPQUFPLEdBQUksRUFBRCxJQUFRO0FBQ3RCLFNBQU8sRUFBRSxDQUFDLEtBQUgsQ0FBUyxHQUFULEVBQWMsR0FBZCxDQUFtQixDQUFELElBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFULEVBQVksV0FBWixLQUE0QixDQUFDLENBQUMsS0FBRixDQUFRLENBQVIsQ0FBckQsRUFBaUUsSUFBakUsQ0FBc0UsR0FBdEUsQ0FBUDtBQUNELENBRkQ7O0FBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxRQUFOLFNBQXVCLGFBQXZCLENBQXFDO0FBQ3BELEVBQUEsV0FBVyxDQUFFLElBQUYsRUFBUSxJQUFSLEVBQWM7QUFDdkIsVUFBTSxJQUFOLEVBQVksSUFBWjtBQUNBLFNBQUssUUFBTCxHQUFnQixJQUFJLENBQUMsUUFBckI7QUFDQSxTQUFLLEVBQUwsR0FBVSxLQUFLLFFBQWY7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLElBQWtCLE9BQU8sQ0FBQyxLQUFLLEVBQU4sQ0FBckM7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxJQUFMLENBQVUsUUFBMUI7QUFDQSxTQUFLLFFBQUwsR0FBaUIsYUFBWSxLQUFLLFFBQVMsYUFBM0M7QUFDQSxTQUFLLG1CQUFMLEdBQTJCLEtBQUssSUFBTCxDQUFVLG1CQUFyQztBQUNBLFNBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNEOztBQUVELEVBQUEsT0FBTyxHQUFJO0FBQ1QsV0FBTyxPQUFPLENBQUMsR0FBUixDQUFZLENBQUMsTUFBTSxPQUFOLEVBQUQsRUFBa0IsS0FBSyxZQUFMLEVBQWxCLENBQVosRUFDSixJQURJLENBQ0MsQ0FBQyxDQUFDLE9BQUQsRUFBVSxLQUFWLENBQUQsS0FBc0I7QUFDMUIsWUFBTSxXQUFXLEdBQUcsRUFBcEI7O0FBQ0EsVUFBSSxLQUFKLEVBQVc7QUFDVCxRQUFBLFdBQVcsQ0FBQyxpQkFBRCxDQUFYLEdBQWlDLEtBQWpDO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLG1CQUFULEVBQThCO0FBQzVCLFFBQUEsV0FBVyxDQUFDLHlCQUFELENBQVgsR0FBeUMsSUFBSSxDQUMzQyxJQUFJLENBQUMsU0FBTCxDQUFlO0FBQUUsVUFBQSxNQUFNLEVBQUUsS0FBSztBQUFmLFNBQWYsQ0FEMkMsQ0FBN0M7QUFHRDs7QUFDRCxhQUFPLEVBQUUsR0FBRyxPQUFMO0FBQWMsV0FBRztBQUFqQixPQUFQO0FBQ0QsS0FiSSxDQUFQO0FBY0Q7O0FBRUQsRUFBQSxpQkFBaUIsQ0FBRSxRQUFGLEVBQVk7QUFDM0IsSUFBQSxRQUFRLEdBQUcsTUFBTSxpQkFBTixDQUF3QixRQUF4QixDQUFYO0FBQ0EsVUFBTSxNQUFNLEdBQUcsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixLQUFLLFFBQXpCLENBQWY7QUFDQSxVQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxjQUFQLEdBQXdCLGFBQWpEO0FBQ0EsVUFBTSxhQUFhLEdBQUcsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLE1BQVQsS0FBb0IsR0FBdkIsR0FBNkIsUUFBUSxDQUFDLE1BQVQsR0FBa0IsR0FBckY7QUFDQSxJQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCO0FBQUUsTUFBQTtBQUFGLEtBQXRCO0FBQ0EsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsRUFBQSxZQUFZLENBQUUsS0FBRixFQUFTO0FBQ25CLFdBQU8sS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixLQUFLLFFBQXpCLEVBQW1DLE9BQW5DLENBQTJDLE9BQTNDLENBQW1ELEtBQUssUUFBeEQsRUFBa0UsS0FBbEUsQ0FBUDtBQUNEOztBQUVELEVBQUEsWUFBWSxHQUFJO0FBQ2QsV0FBTyxLQUFLLElBQUwsQ0FBVSxTQUFWLENBQW9CLEtBQUssUUFBekIsRUFBbUMsT0FBbkMsQ0FBMkMsT0FBM0MsQ0FBbUQsS0FBSyxRQUF4RCxDQUFQO0FBQ0Q7O0FBRUQsRUFBQSxPQUFPLENBQUUsT0FBTyxHQUFHLEVBQVosRUFBZ0I7QUFDckIsUUFBSSxLQUFLLFlBQVQsRUFBdUI7QUFDckIsTUFBQSxPQUFPLENBQUMsZ0JBQVIsR0FBMkIsS0FBSyxZQUFoQztBQUNEOztBQUVELFdBQVEsR0FBRSxLQUFLLFFBQVMsSUFBRyxLQUFLLEVBQUcsWUFBVyxJQUFJLGVBQUosQ0FBb0IsT0FBcEIsQ0FBNkIsRUFBM0U7QUFDRDs7QUFFRCxFQUFBLE9BQU8sQ0FBRSxFQUFGLEVBQU07QUFDWCxXQUFRLEdBQUUsS0FBSyxRQUFTLElBQUcsS0FBSyxFQUFHLFFBQU8sRUFBRyxFQUE3QztBQUNEOztBQUVELEVBQUEsaUJBQWlCLEdBQUk7QUFDbkIsUUFBSSxDQUFDLEtBQUssbUJBQVYsRUFBK0I7QUFDN0IsYUFBTyxPQUFPLENBQUMsT0FBUixFQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLLElBQUwsQ0FBVyxHQUFFLEtBQUssRUFBRyxXQUFyQixFQUFpQztBQUFFLE1BQUEsTUFBTSxFQUFFLEtBQUs7QUFBZixLQUFqQyxFQUNKLElBREksQ0FDRSxHQUFELElBQVM7QUFDYixXQUFLLFlBQUwsR0FBb0IsR0FBRyxDQUFDLEtBQXhCO0FBQ0QsS0FISSxFQUdGLEtBSEUsQ0FHSyxHQUFELElBQVM7QUFDaEIsV0FBSyxJQUFMLENBQVUsR0FBVixDQUFlLGtEQUFpRCxHQUFJLEVBQXBFLEVBQXVFLFNBQXZFO0FBQ0QsS0FMSSxDQUFQO0FBTUQ7O0FBRUQsRUFBQSxJQUFJLENBQUUsU0FBRixFQUFhO0FBQ2YsV0FBTyxLQUFLLEdBQUwsQ0FBVSxHQUFFLEtBQUssRUFBRyxTQUFRLFNBQVMsSUFBSSxFQUFHLEVBQTVDLENBQVA7QUFDRDs7QUFFRCxFQUFBLE1BQU0sR0FBSTtBQUNSLFdBQU8sS0FBSyxHQUFMLENBQVUsR0FBRSxLQUFLLEVBQUcsU0FBcEIsRUFDSixJQURJLENBQ0UsUUFBRCxJQUFjLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FDOUIsUUFEOEIsRUFFOUIsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixLQUFLLFFBQXpCLEVBQW1DLE9BQW5DLENBQTJDLFVBQTNDLENBQXNELEtBQUssUUFBM0QsQ0FGOEIsQ0FBWixDQURmLEVBSUQsSUFKQyxDQUlJLENBQUMsQ0FBQyxRQUFELENBQUQsS0FBZ0IsUUFKcEIsQ0FBUDtBQUtEOztBQUVnQixTQUFWLFVBQVUsQ0FBRSxNQUFGLEVBQVUsSUFBVixFQUFnQixXQUFoQixFQUE2QjtBQUM1QyxJQUFBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsVUFBZDtBQUNBLElBQUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxFQUFmOztBQUNBLFFBQUksV0FBSixFQUFpQjtBQUNmLE1BQUEsTUFBTSxDQUFDLElBQVAsR0FBYyxFQUFFLEdBQUcsV0FBTDtBQUFrQixXQUFHO0FBQXJCLE9BQWQ7QUFDRDs7QUFFRCxRQUFJLElBQUksQ0FBQyxTQUFMLElBQWtCLElBQUksQ0FBQyxhQUEzQixFQUEwQztBQUN4QyxZQUFNLElBQUksS0FBSixDQUFVLG1RQUFWLENBQU47QUFDRDs7QUFFRCxRQUFJLElBQUksQ0FBQyxxQkFBVCxFQUFnQztBQUM5QixZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMscUJBQXJCLENBRDhCLENBRTlCOztBQUNBLFVBQUksT0FBTyxPQUFQLEtBQW1CLFFBQW5CLElBQStCLENBQUMsS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFkLENBQWhDLElBQTBELEVBQUUsT0FBTyxZQUFZLE1BQXJCLENBQTlELEVBQTRGO0FBQzFGLGNBQU0sSUFBSSxTQUFKLENBQWUsR0FBRSxNQUFNLENBQUMsRUFBRywyRUFBM0IsQ0FBTjtBQUNEOztBQUNELE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxxQkFBWixHQUFvQyxPQUFwQztBQUNELEtBUEQsTUFPTyxJQUFJLHVCQUF1QixJQUF2QixDQUE0QixJQUFJLENBQUMsWUFBakMsQ0FBSixFQUFvRDtBQUN6RDtBQUNBLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxxQkFBWixHQUFxQyxXQUFVLElBQUksQ0FBQyxZQUFMLENBQWtCLE9BQWxCLENBQTBCLE9BQTFCLEVBQW1DLEVBQW5DLENBQXVDLEVBQXRGO0FBQ0QsS0FITSxNQUdBO0FBQ0wsTUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLHFCQUFaLEdBQW9DLElBQUksR0FBSixDQUFRLElBQUksQ0FBQyxZQUFiLEVBQTJCLE1BQS9EO0FBQ0Q7O0FBRUQsSUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosSUFBdUIsWUFBeEM7QUFDRDs7QUE3R21ELENBQXREOzs7QUNUQTs7Ozs7Ozs7OztBQUVBLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLHVDQUFELENBQXJDOztBQUNBLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFELENBQXpCLEMsQ0FFQTs7O0FBQ0EsU0FBUyxVQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQ3hCLFNBQU8sR0FBRyxDQUFDLE9BQUosQ0FBWSxLQUFaLEVBQW1CLEVBQW5CLENBQVA7QUFDRDs7QUFFRCxlQUFlLGtCQUFmLENBQW1DLEdBQW5DLEVBQXdDO0FBQ3RDLE1BQUksR0FBRyxDQUFDLE1BQUosS0FBZSxHQUFuQixFQUF3QjtBQUN0QixVQUFNLElBQUksU0FBSixFQUFOO0FBQ0Q7O0FBRUQsUUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUosRUFBcEI7O0FBRUEsTUFBSSxHQUFHLENBQUMsTUFBSixHQUFhLEdBQWIsSUFBb0IsR0FBRyxDQUFDLE1BQUosR0FBYSxHQUFyQyxFQUEwQztBQUN4QyxRQUFJLE1BQU0sR0FBSSwrQkFBOEIsR0FBRyxDQUFDLE1BQU8sS0FBSSxHQUFHLENBQUMsVUFBVyxFQUExRTs7QUFDQSxRQUFJO0FBQ0YsWUFBTSxPQUFPLEdBQUcsTUFBTSxXQUF0QjtBQUNBLE1BQUEsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFSLEdBQW1CLEdBQUUsTUFBTyxhQUFZLE9BQU8sQ0FBQyxPQUFRLEVBQXhELEdBQTRELE1BQXJFO0FBQ0EsTUFBQSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVIsR0FBcUIsR0FBRSxNQUFPLGdCQUFlLE9BQU8sQ0FBQyxTQUFVLEVBQS9ELEdBQW1FLE1BQTVFO0FBQ0QsS0FKRCxTQUlVO0FBQ1I7QUFDQSxZQUFNLElBQUksS0FBSixDQUFVLE1BQVYsQ0FBTjtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxXQUFQO0FBQ0Q7O0FBRUQsTUFBTSxDQUFDLE9BQVAsbVBBQWlCLE1BQU0sYUFBTixDQUFvQjtBQUNuQztBQUtBLEVBQUEsV0FBVyxDQUFFLElBQUYsRUFBUSxJQUFSLEVBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFGRixJQUFJLElBQUksUUFBUSxJQUFLLElBQUksR0FBRyxRQUFILEdBQWMsS0FBSyxpQkFBTCxDQUF1QixRQUF2QjtBQUVyQztBQUN2QixTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssaUJBQUwsR0FBeUIsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUF6QjtBQUNBLFNBQUssY0FBTCxHQUFzQixDQUFDLFFBQUQsRUFBVyxjQUFYLEVBQTJCLGlCQUEzQixDQUF0QjtBQUNBLFNBQUssYUFBTCxHQUFxQixLQUFyQjtBQUNEOztBQUVXLE1BQVIsUUFBUSxHQUFJO0FBQ2QsVUFBTTtBQUFFLE1BQUE7QUFBRixRQUFnQixLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQXRCO0FBQ0EsVUFBTSxJQUFJLEdBQUcsS0FBSyxJQUFMLENBQVUsWUFBdkI7QUFDQSxXQUFPLFVBQVUsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLElBQUQsQ0FBdEIsR0FBK0IsU0FBUyxDQUFDLElBQUQsQ0FBeEMsR0FBaUQsSUFBbEQsQ0FBakI7QUFDRDs7QUFRRCxFQUFBLE9BQU8sR0FBSTtBQUNULFVBQU0sV0FBVyxHQUFHLEtBQUssSUFBTCxDQUFVLGdCQUFWLElBQThCLEVBQWxEO0FBQ0EsV0FBTyxPQUFPLENBQUMsT0FBUixDQUFnQixFQUNyQixHQUFHLGFBQWEsQ0FBQyxjQURJO0FBRXJCLFNBQUc7QUFGa0IsS0FBaEIsQ0FBUDtBQUlEOztBQUVELEVBQUEsaUJBQWlCLENBQUUsUUFBRixFQUFZO0FBQzNCLFVBQU0sS0FBSyxHQUFHLEtBQUssSUFBTCxDQUFVLFFBQVYsRUFBZDtBQUNBLFVBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFOLElBQW1CLEVBQXJDO0FBQ0EsVUFBTSxJQUFJLEdBQUcsS0FBSyxJQUFMLENBQVUsWUFBdkI7QUFDQSxVQUFNO0FBQUUsTUFBQTtBQUFGLFFBQWMsUUFBcEIsQ0FKMkIsQ0FLM0I7O0FBQ0EsUUFBSSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosS0FBdUIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLE1BQXdCLFNBQVMsQ0FBQyxJQUFELENBQTVELEVBQW9FO0FBQ2xFLFdBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUI7QUFDakIsUUFBQSxTQUFTLEVBQUUsRUFBRSxHQUFHLFNBQUw7QUFBZ0IsV0FBQyxJQUFELEdBQVEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaO0FBQXhCO0FBRE0sT0FBbkI7QUFHRDs7QUFDRCxXQUFPLFFBQVA7QUFDRDs7QUFvQkQsRUFBQSxTQUFTLENBQUUsSUFBRixFQUFRO0FBQ2YsUUFBSSxLQUFLLGFBQVQsRUFBd0I7QUFDdEIsYUFBTyxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsRUFBaEIsQ0FBUDtBQUNEOztBQUVELFdBQU8sS0FBSyw2QkFBQyxJQUFELG9CQUFjLElBQWQsR0FBcUI7QUFDL0IsTUFBQSxNQUFNLEVBQUU7QUFEdUIsS0FBckIsQ0FBTCxDQUdKLElBSEksQ0FHRSxRQUFELElBQWM7QUFDbEIsVUFBSSxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixDQUFxQiw4QkFBckIsQ0FBSixFQUEwRDtBQUN4RCxhQUFLLGNBQUwsR0FBc0IsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsR0FBakIsQ0FBcUIsOEJBQXJCLEVBQ25CLEtBRG1CLENBQ2IsR0FEYSxFQUNSLEdBRFEsQ0FDSCxVQUFELElBQWdCLFVBQVUsQ0FBQyxJQUFYLEdBQWtCLFdBQWxCLEVBRFosQ0FBdEI7QUFFRDs7QUFDRCxXQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxhQUFPLEtBQUssY0FBTCxDQUFvQixLQUFwQixFQUFQO0FBQ0QsS0FWSSxFQVdKLEtBWEksQ0FXRyxHQUFELElBQVM7QUFDZCxXQUFLLElBQUwsQ0FBVSxHQUFWLENBQWUsc0RBQXFELEdBQUksRUFBeEUsRUFBMkUsU0FBM0U7QUFDQSxXQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxhQUFPLEtBQUssY0FBTCxDQUFvQixLQUFwQixFQUFQO0FBQ0QsS0FmSSxDQUFQO0FBZ0JEOztBQUVELEVBQUEsbUJBQW1CLENBQUUsSUFBRixFQUFRO0FBQ3pCLFdBQU8sT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFDLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBRCxFQUF1QixLQUFLLE9BQUwsRUFBdkIsQ0FBWixFQUNKLElBREksQ0FDQyxDQUFDLENBQUMsY0FBRCxFQUFpQixPQUFqQixDQUFELEtBQStCO0FBQ25DO0FBQ0EsTUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosRUFBcUIsT0FBckIsQ0FBOEIsTUFBRCxJQUFZO0FBQ3ZDLFlBQUksQ0FBQyxjQUFjLENBQUMsUUFBZixDQUF3QixNQUFNLENBQUMsV0FBUCxFQUF4QixDQUFMLEVBQW9EO0FBQ2xELGVBQUssSUFBTCxDQUFVLEdBQVYsQ0FBZSxpREFBZ0QsTUFBTyxFQUF0RTtBQUNBLGlCQUFPLE9BQU8sQ0FBQyxNQUFELENBQWQsQ0FGa0QsQ0FFM0I7QUFDeEI7QUFDRixPQUxEO0FBT0EsYUFBTyxPQUFQO0FBQ0QsS0FYSSxDQUFQO0FBWUQ7O0FBRUQsRUFBQSxHQUFHLENBQUUsSUFBRixFQUFRLGdCQUFSLEVBQTBCO0FBQzNCLFVBQU0sTUFBTSxHQUFHLEtBQWY7QUFDQSxXQUFPLEtBQUssbUJBQUwsQ0FBeUIsSUFBekIsRUFDSixJQURJLENBQ0UsT0FBRCxJQUFhLHFCQUFxQiw2QkFBQyxJQUFELG9CQUFjLElBQWQsR0FBcUI7QUFDM0QsTUFBQSxNQUQyRDtBQUUzRCxNQUFBLE9BRjJEO0FBRzNELE1BQUEsV0FBVyxFQUFFLEtBQUssSUFBTCxDQUFVLG9CQUFWLElBQWtDO0FBSFksS0FBckIsQ0FEbkMsRUFNSixJQU5JLDZCQU1DLElBTkQsOENBTTJCLGdCQU4zQixHQU9KLElBUEksQ0FPQyxrQkFQRCxFQVFKLEtBUkksNkJBUUUsSUFSRixnQ0FRcUIsTUFSckIsRUFRNkIsSUFSN0IsRUFBUDtBQVNEOztBQUVELEVBQUEsSUFBSSxDQUFFLElBQUYsRUFBUSxJQUFSLEVBQWMsZ0JBQWQsRUFBZ0M7QUFDbEMsVUFBTSxNQUFNLEdBQUcsTUFBZjtBQUNBLFdBQU8sS0FBSyxtQkFBTCxDQUF5QixJQUF6QixFQUNKLElBREksQ0FDRSxPQUFELElBQWEscUJBQXFCLDZCQUFDLElBQUQsb0JBQWMsSUFBZCxHQUFxQjtBQUMzRCxNQUFBLE1BRDJEO0FBRTNELE1BQUEsT0FGMkQ7QUFHM0QsTUFBQSxXQUFXLEVBQUUsS0FBSyxJQUFMLENBQVUsb0JBQVYsSUFBa0MsYUFIWTtBQUkzRCxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLElBQWY7QUFKcUQsS0FBckIsQ0FEbkMsRUFPSixJQVBJLDZCQU9DLElBUEQsOENBTzJCLGdCQVAzQixHQVFKLElBUkksQ0FRQyxrQkFSRCxFQVNKLEtBVEksNkJBU0UsSUFURixnQ0FTcUIsTUFUckIsRUFTNkIsSUFUN0IsRUFBUDtBQVVEOztBQUVELEVBQUEsTUFBTSxDQUFFLElBQUYsRUFBUSxJQUFSLEVBQWMsZ0JBQWQsRUFBZ0M7QUFDcEMsVUFBTSxNQUFNLEdBQUcsUUFBZjtBQUNBLFdBQU8sS0FBSyxtQkFBTCxDQUF5QixJQUF6QixFQUNKLElBREksQ0FDRSxPQUFELElBQWEscUJBQXFCLENBQUUsR0FBRSxLQUFLLFFBQVMsSUFBRyxJQUFLLEVBQTFCLEVBQTZCO0FBQ25FLE1BQUEsTUFEbUU7QUFFbkUsTUFBQSxPQUZtRTtBQUduRSxNQUFBLFdBQVcsRUFBRSxLQUFLLElBQUwsQ0FBVSxvQkFBVixJQUFrQyxhQUhvQjtBQUluRSxNQUFBLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLENBQUgsR0FBMEI7QUFKK0IsS0FBN0IsQ0FEbkMsRUFPSixJQVBJLDZCQU9DLElBUEQsOENBTzJCLGdCQVAzQixHQVFKLElBUkksQ0FRQyxrQkFSRCxFQVNKLEtBVEksNkJBU0UsSUFURixnQ0FTcUIsTUFUckIsRUFTNkIsSUFUN0IsRUFBUDtBQVVEOztBQS9Ja0MsQ0FBckMsVUFFUyxPQUZULG1CQW9CUyxjQXBCVCxHQW9CeUI7QUFDckIsRUFBQSxNQUFNLEVBQUUsa0JBRGE7QUFFckIsa0JBQWdCLGtCQUZLO0FBR3JCLG1CQUFrQiwwQkFBeUIsTUFBYSxDQUFDLE9BQVE7QUFINUMsQ0FwQnpCOztrQkFnRFcsRyxFQUFLO0FBQ1osTUFBSSxrQkFBa0IsSUFBbEIsQ0FBdUIsR0FBdkIsQ0FBSixFQUFpQztBQUMvQixXQUFPLEdBQVA7QUFDRDs7QUFDRCxTQUFRLEdBQUUsS0FBSyxRQUFTLElBQUcsR0FBSSxFQUEvQjtBQUNEOzt3QkFFYyxNLEVBQVEsSSxFQUFNO0FBQzNCLFNBQVEsR0FBRCxJQUFTO0FBQUE7O0FBQ2QsUUFBSSxVQUFDLEdBQUQsYUFBQyxLQUFLLFdBQU4sQ0FBSixFQUF1QjtBQUNyQixZQUFNLEtBQUssR0FBRyxJQUFJLEtBQUosQ0FBVyxhQUFZLE1BQU8sSUFBcEIsNEJBQXVCLElBQXZCLG9CQUFvQyxJQUFwQyxDQUEwQyxFQUFwRCxDQUFkO0FBQ0EsTUFBQSxLQUFLLENBQUMsS0FBTixHQUFjLEdBQWQ7QUFDQSxNQUFBLEdBQUcsR0FBRyxLQUFOLENBSHFCLENBR1Q7QUFDYjs7QUFDRCxXQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsR0FBZixDQUFQO0FBQ0QsR0FQRDtBQVFEOzs7QUMvRkg7O0FBRUEsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFELENBQTdCOztBQUVBLE1BQU0sT0FBTyxHQUFJLEVBQUQsSUFBUTtBQUN0QixTQUFPLEVBQUUsQ0FBQyxLQUFILENBQVMsR0FBVCxFQUFjLEdBQWQsQ0FBbUIsQ0FBRCxJQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBVCxFQUFZLFdBQVosS0FBNEIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFSLENBQXJELEVBQWlFLElBQWpFLENBQXNFLEdBQXRFLENBQVA7QUFDRCxDQUZEOztBQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQU0sY0FBTixTQUE2QixhQUE3QixDQUEyQztBQUMxRCxFQUFBLFdBQVcsQ0FBRSxJQUFGLEVBQVEsSUFBUixFQUFjO0FBQ3ZCLFVBQU0sSUFBTixFQUFZLElBQVo7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsSUFBSSxDQUFDLFFBQXJCO0FBQ0EsU0FBSyxFQUFMLEdBQVUsS0FBSyxRQUFmO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixJQUFrQixPQUFPLENBQUMsS0FBSyxFQUFOLENBQXJDO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssSUFBTCxDQUFVLFFBQTFCO0FBQ0Q7O0FBRUQsRUFBQSxPQUFPLENBQUUsRUFBRixFQUFNO0FBQ1gsV0FBUSxHQUFFLEtBQUssUUFBUyxXQUFVLEtBQUssRUFBRyxRQUFPLEVBQUcsRUFBcEQ7QUFDRDs7QUFFRCxFQUFBLE1BQU0sQ0FBRSxJQUFGLEVBQVEsT0FBUixFQUFpQjtBQUNyQixJQUFBLE9BQU8sR0FBRyxPQUFPLEdBQUksSUFBRyxPQUFRLEVBQWYsR0FBbUIsRUFBcEM7QUFDQSxXQUFPLEtBQUssR0FBTCxDQUFVLFVBQVMsS0FBSyxFQUFHLFdBQVUsa0JBQWtCLENBQUMsSUFBRCxDQUFPLEdBQUUsT0FBUSxFQUF4RSxDQUFQO0FBQ0Q7O0FBaEJ5RCxDQUE1RDs7Ozs7Ozs7Ozs7Ozs7O0FDUkEsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQWxCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLG1WQW1CRyxNQUFNLENBQUMsR0FBUCxDQUFXLHNCQUFYLENBbkJILGlCQXFCRyxNQUFNLENBQUMsR0FBUCxDQUFXLHNCQUFYLENBckJILEVBQWlCLE1BQU0sVUFBTixDQUFpQjtBQVNoQyxFQUFBLFdBQVcsQ0FBRSxJQUFGLEVBQVE7QUFBQTtBQUFBO0FBQUEsYUFSVDtBQVFTO0FBQUE7QUFBQTtBQUFBLGFBTlIsRUFBRTtBQU1NO0FBQUE7QUFBQTtBQUFBLGFBSlQ7QUFJUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBK0RGLENBQUQsSUFBTztBQUNyQixZQUFJO0FBQ0YsZ0JBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxDQUFDLElBQWIsQ0FBaEI7QUFDQSxlQUFLLElBQUwsQ0FBVSxPQUFPLENBQUMsTUFBbEIsRUFBMEIsT0FBTyxDQUFDLE9BQWxDO0FBQ0QsU0FIRCxDQUdFLE9BQU8sR0FBUCxFQUFZO0FBQ1o7QUFDQSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWixFQUZZLENBRUs7QUFDbEI7QUFDRjtBQXZFa0I7QUFDakIsU0FBSyxJQUFMLEdBQVksSUFBWjs7QUFFQSxRQUFJLENBQUMsSUFBRCxJQUFTLElBQUksQ0FBQyxRQUFMLEtBQWtCLEtBQS9CLEVBQXNDO0FBQ3BDLFdBQUssSUFBTDtBQUNEO0FBQ0Y7O0FBRVMsTUFBTixNQUFNLEdBQUk7QUFBRSx1Q0FBTyxJQUFQO0FBQXFCOztBQUVyQyxrQkFBd0M7QUFBRSx1Q0FBTyxJQUFQO0FBQXFCOztBQUUvRCxtQkFBd0M7QUFBRSx1Q0FBTyxJQUFQO0FBQXFCOztBQUUvRCxFQUFBLElBQUksR0FBSTtBQUNOLDBEQUFlLElBQUksU0FBSixDQUFjLEtBQUssSUFBTCxDQUFVLE1BQXhCLENBQWY7O0FBRUEsd0RBQWEsTUFBYixHQUFzQixNQUFNO0FBQzFCLDREQUFlLElBQWY7O0FBRUEsYUFBTyxvREFBYSxNQUFiLEdBQXNCLENBQXRCLGdDQUEyQixJQUEzQixtQkFBUCxFQUFnRDtBQUM5QyxjQUFNLEtBQUssR0FBRyxvREFBYSxLQUFiLEVBQWQ7O0FBQ0EsYUFBSyxJQUFMLENBQVUsS0FBSyxDQUFDLE1BQWhCLEVBQXdCLEtBQUssQ0FBQyxPQUE5QjtBQUNEO0FBQ0YsS0FQRDs7QUFTQSx3REFBYSxPQUFiLEdBQXVCLE1BQU07QUFDM0IsNERBQWUsS0FBZjtBQUNELEtBRkQ7O0FBSUEsd0RBQWEsU0FBYiwrQkFBeUIsSUFBekI7QUFDRDs7QUFFRCxFQUFBLEtBQUssR0FBSTtBQUFBOztBQUNQLDJIQUFjLEtBQWQ7QUFDRDs7QUFFRCxFQUFBLElBQUksQ0FBRSxNQUFGLEVBQVUsT0FBVixFQUFtQjtBQUNyQjtBQUVBLFFBQUksNkJBQUMsSUFBRCxtQkFBSixFQUFtQjtBQUNqQiwwREFBYSxJQUFiLENBQWtCO0FBQUUsUUFBQSxNQUFGO0FBQVUsUUFBQTtBQUFWLE9BQWxCOztBQUNBO0FBQ0Q7O0FBRUQsd0RBQWEsSUFBYixDQUFrQixJQUFJLENBQUMsU0FBTCxDQUFlO0FBQy9CLE1BQUEsTUFEK0I7QUFFL0IsTUFBQTtBQUYrQixLQUFmLENBQWxCO0FBSUQ7O0FBRUQsRUFBQSxFQUFFLENBQUUsTUFBRixFQUFVLE9BQVYsRUFBbUI7QUFDbkIsMERBQWMsRUFBZCxDQUFpQixNQUFqQixFQUF5QixPQUF6QjtBQUNEOztBQUVELEVBQUEsSUFBSSxDQUFFLE1BQUYsRUFBVSxPQUFWLEVBQW1CO0FBQ3JCLDBEQUFjLElBQWQsQ0FBbUIsTUFBbkIsRUFBMkIsT0FBM0I7QUFDRDs7QUFFRCxFQUFBLElBQUksQ0FBRSxNQUFGLEVBQVUsT0FBVixFQUFtQjtBQUNyQiwwREFBYyxJQUFkLENBQW1CLE1BQW5CLEVBQTJCLE9BQTNCO0FBQ0Q7O0FBdEUrQixDQUFsQzs7O0FDRkE7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFELENBQTdCOztBQUNBLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxrQkFBRCxDQUE5Qjs7QUFDQSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBRCxDQUF0Qjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUNmLEVBQUEsYUFEZTtBQUVmLEVBQUEsUUFGZTtBQUdmLEVBQUEsY0FIZTtBQUlmLEVBQUE7QUFKZSxDQUFqQjs7O0FDWEE7QUFFQTtBQUNBO0FBQ0E7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFmLEdBQXlCLENBQUMsR0FBRCxFQUFNLEtBQU4sS0FBZ0I7QUFDdkMsU0FBTyxJQUFJLE9BQUosQ0FBYSxPQUFELElBQWE7QUFDOUIsSUFBQSxZQUFZLENBQUMsT0FBYixDQUFxQixHQUFyQixFQUEwQixLQUExQjtBQUNBLElBQUEsT0FBTztBQUNSLEdBSE0sQ0FBUDtBQUlELENBTEQ7O0FBT0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFmLEdBQTBCLEdBQUQsSUFBUztBQUNoQyxTQUFPLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFlBQVksQ0FBQyxPQUFiLENBQXFCLEdBQXJCLENBQWhCLENBQVA7QUFDRCxDQUZEOztBQUlBLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixHQUE2QixHQUFELElBQVM7QUFDbkMsU0FBTyxJQUFJLE9BQUosQ0FBYSxPQUFELElBQWE7QUFDOUIsSUFBQSxZQUFZLENBQUMsVUFBYixDQUF3QixHQUF4QjtBQUNBLElBQUEsT0FBTztBQUNSLEdBSE0sQ0FBUDtBQUlELENBTEQ7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsNEJBQUQsQ0FBMUI7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxVQUFOLENBQWlCO0FBQ2hDLEVBQUEsV0FBVyxDQUFFLElBQUYsRUFBUSxJQUFJLEdBQUcsRUFBZixFQUFtQjtBQUM1QixTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNEOztBQUVELEVBQUEsY0FBYyxHQUFJO0FBQ2hCLFVBQU07QUFBRSxNQUFBO0FBQUYsUUFBYyxLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQXBCO0FBQ0EsV0FBTyxPQUFPLENBQUMsS0FBSyxFQUFOLENBQVAsSUFBb0IsRUFBM0I7QUFDRDs7QUFFRCxFQUFBLGNBQWMsQ0FBRSxNQUFGLEVBQVU7QUFDdEIsVUFBTTtBQUFFLE1BQUE7QUFBRixRQUFjLEtBQUssSUFBTCxDQUFVLFFBQVYsRUFBcEI7QUFFQSxTQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CO0FBQ2pCLE1BQUEsT0FBTyxFQUFFLEVBQ1AsR0FBRyxPQURJO0FBRVAsU0FBQyxLQUFLLEVBQU4sR0FBVyxFQUNULEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBTixDQUREO0FBRVQsYUFBRztBQUZNO0FBRko7QUFEUSxLQUFuQjtBQVNEOztBQUVELEVBQUEsVUFBVSxDQUFFLE9BQUYsRUFBVztBQUNuQixTQUFLLElBQUwsR0FBWSxFQUFFLEdBQUcsS0FBSyxJQUFWO0FBQWdCLFNBQUc7QUFBbkIsS0FBWjtBQUNBLFNBQUssY0FBTCxHQUZtQixDQUVHOztBQUN0QixTQUFLLFFBQUw7QUFDRDs7QUFFRCxFQUFBLFFBQVEsR0FBSTtBQUNWLFVBQU0sVUFBVSxHQUFHLElBQUksVUFBSixDQUFlLENBQUMsS0FBSyxhQUFOLEVBQXFCLEtBQUssSUFBTCxDQUFVLE1BQS9CLEVBQXVDLEtBQUssSUFBTCxDQUFVLE1BQWpELENBQWYsQ0FBbkI7QUFDQSxTQUFLLElBQUwsR0FBWSxVQUFVLENBQUMsU0FBWCxDQUFxQixJQUFyQixDQUEwQixVQUExQixDQUFaO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFVBQVUsQ0FBQyxjQUFYLENBQTBCLElBQTFCLENBQStCLFVBQS9CLENBQWpCO0FBQ0EsU0FBSyxjQUFMLEdBSlUsQ0FJWTtBQUN2QjtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVFOzs7QUFDQSxFQUFBLFNBQVMsR0FBSTtBQUNYLFVBQU0sSUFBSSxLQUFKLENBQVUsNEVBQVYsQ0FBTjtBQUNELEdBaEQrQixDQWtEaEM7OztBQUNBLEVBQUEsT0FBTyxHQUFJLENBQUUsQ0FuRG1CLENBcURoQzs7O0FBQ0EsRUFBQSxTQUFTLEdBQUksQ0FBRTtBQUVmO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0UsRUFBQSxNQUFNLEdBQUk7QUFDUixVQUFNLElBQUksS0FBSixDQUFVLDhEQUFWLENBQU47QUFDRCxHQWhFK0IsQ0FrRWhDOzs7QUFDQSxFQUFBLE1BQU0sR0FBSSxDQUFFLENBbkVvQixDQXFFaEM7QUFDQTs7O0FBQ0EsRUFBQSxXQUFXLEdBQUksQ0FBRTs7QUF2RWUsQ0FBbEM7Ozs7Ozs7Ozs7O0FDWEEsTUFBTTtBQUFFLEVBQUE7QUFBRixJQUFhLE9BQU8sQ0FBQyxRQUFELENBQTFCOztBQUNBLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQ0FBRCxDQUE5Qjs7QUFFQSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUExQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxRQUFULENBQW1CLEVBQW5CLEVBQXVCO0FBQ3JCLE1BQUksT0FBTyxHQUFHLElBQWQ7QUFDQSxNQUFJLFVBQVUsR0FBRyxJQUFqQjtBQUNBLFNBQU8sQ0FBQyxHQUFHLElBQUosS0FBYTtBQUNsQixJQUFBLFVBQVUsR0FBRyxJQUFiOztBQUNBLFFBQUksQ0FBQyxPQUFMLEVBQWM7QUFDWixNQUFBLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBUixHQUFrQixJQUFsQixDQUF1QixNQUFNO0FBQ3JDLFFBQUEsT0FBTyxHQUFHLElBQVYsQ0FEcUMsQ0FFckM7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBTyxFQUFFLENBQUMsR0FBRyxVQUFKLENBQVQ7QUFDRCxPQVBTLENBQVY7QUFRRDs7QUFDRCxXQUFPLE9BQVA7QUFDRCxHQWJEO0FBY0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBQ0EsTUFBTSxRQUFOLFNBQXVCLFVBQXZCLENBQWtDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBR2hDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDRSxFQUFBLEtBQUssQ0FBRSxNQUFGLEVBQVUsTUFBVixFQUFrQjtBQUNyQixVQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxFQUFoQztBQUVBLFVBQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxNQUFELENBQXBDOztBQUVBLFFBQUksYUFBSixFQUFtQjtBQUNqQixXQUFLLGFBQUwsR0FBcUIsSUFBckIsQ0FEaUIsQ0FFakI7QUFDQTtBQUNBOztBQUNBLFlBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxzQkFBVCxFQUF4QixDQUxpQixDQU9qQjs7QUFDQSxnRUFBaUIsUUFBUSxDQUFFLEtBQUQsSUFBVztBQUNuQztBQUNBO0FBQ0E7QUFDQSxZQUFJLENBQUMsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixLQUFLLEVBQXpCLENBQUwsRUFBbUM7QUFDbkMsUUFBQSxNQUFNLENBQUMsS0FBSyxNQUFMLENBQVksS0FBWixDQUFELEVBQXFCLGVBQXJCLENBQU47QUFDQSxhQUFLLFdBQUw7QUFDRCxPQVB3QixDQUF6QjtBQVNBLFdBQUssSUFBTCxDQUFVLEdBQVYsQ0FBZSxjQUFhLGdCQUFpQixzQkFBcUIsTUFBTyxHQUF6RTs7QUFFQSxVQUFJLEtBQUssSUFBTCxDQUFVLG9CQUFkLEVBQW9DO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLFFBQUEsYUFBYSxDQUFDLFNBQWQsR0FBMEIsRUFBMUI7QUFDRDs7QUFFRCxNQUFBLE1BQU0sQ0FBQyxLQUFLLE1BQUwsQ0FBWSxLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQVosQ0FBRCxFQUFvQyxlQUFwQyxDQUFOO0FBQ0EsV0FBSyxFQUFMLEdBQVUsZUFBZSxDQUFDLGlCQUExQjtBQUNBLE1BQUEsYUFBYSxDQUFDLFdBQWQsQ0FBMEIsZUFBMUI7QUFFQSxXQUFLLE9BQUw7QUFFQSxhQUFPLEtBQUssRUFBWjtBQUNEOztBQUVELFFBQUksWUFBSjs7QUFDQSxRQUFJLE9BQU8sTUFBUCxLQUFrQixRQUFsQixJQUE4QixNQUFNLFlBQVksUUFBcEQsRUFBOEQ7QUFDNUQ7QUFDQSxNQUFBLFlBQVksR0FBRyxNQUFmO0FBQ0QsS0FIRCxNQUdPLElBQUksT0FBTyxNQUFQLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ3ZDO0FBQ0EsWUFBTSxNQUFNLEdBQUcsTUFBZixDQUZ1QyxDQUd2Qzs7QUFDQSxXQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLENBQUMsSUFBSTtBQUM1QixZQUFJLENBQUMsWUFBWSxNQUFqQixFQUF5QjtBQUN2QixVQUFBLFlBQVksR0FBRyxDQUFmO0FBQ0EsaUJBQU8sS0FBUDtBQUNEO0FBQ0YsT0FMRDtBQU1EOztBQUVELFFBQUksWUFBSixFQUFrQjtBQUNoQixXQUFLLElBQUwsQ0FBVSxHQUFWLENBQWUsY0FBYSxnQkFBaUIsT0FBTSxZQUFZLENBQUMsRUFBRyxFQUFuRTtBQUNBLFdBQUssTUFBTCxHQUFjLFlBQWQ7QUFDQSxXQUFLLEVBQUwsR0FBVSxZQUFZLENBQUMsU0FBYixDQUF1QixNQUF2QixDQUFWO0FBRUEsV0FBSyxPQUFMO0FBQ0EsYUFBTyxLQUFLLEVBQVo7QUFDRDs7QUFFRCxTQUFLLElBQUwsQ0FBVSxHQUFWLENBQWUsa0JBQWlCLGdCQUFpQixFQUFqRDtBQUVBLFFBQUksT0FBTyxHQUFJLGtDQUFpQyxnQkFBaUIsR0FBakU7O0FBQ0EsUUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDaEMsTUFBQSxPQUFPLElBQUksOENBQ1Asa0ZBRE8sR0FFUCx5R0FGTyxHQUdQLCtHQUhKO0FBSUQsS0FMRCxNQUtPO0FBQ0wsTUFBQSxPQUFPLElBQUksdUZBQ1AsZ0hBRE8sR0FFUCwyREFGTyxHQUdQLCtHQUhKO0FBSUQ7O0FBQ0QsVUFBTSxJQUFJLEtBQUosQ0FBVSxPQUFWLENBQU47QUFDRDs7QUFFRCxFQUFBLE1BQU0sQ0FBRSxLQUFGLEVBQVM7QUFDYixRQUFJLEtBQUssRUFBTCxJQUFXLElBQWYsRUFBcUI7QUFBQTs7QUFDbkIseUxBQWlCLEtBQWpCO0FBQ0Q7QUFDRjs7QUFFRCxFQUFBLE9BQU8sR0FBSTtBQUNULFFBQUksS0FBSyxhQUFULEVBQXdCO0FBQUE7O0FBQ3RCLHVCQUFLLEVBQUwsOEJBQVMsTUFBVDtBQUNEOztBQUNELFNBQUssU0FBTDtBQUNELEdBckcrQixDQXVHaEM7OztBQUNBLEVBQUEsT0FBTyxHQUFJLENBQUUsQ0F4R21CLENBMEdoQzs7O0FBQ0EsRUFBQSxTQUFTLEdBQUksQ0FBRTs7QUEzR2lCOztBQThHbEMsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBakI7OztBQ2xKQTtBQUVBOzs7Ozs7Ozs7O0FBRUEsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDRCQUFELENBQTFCOztBQUNBLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUFsQjs7QUFDQSxNQUFNO0FBQUUsRUFBQTtBQUFGLElBQWEsT0FBTyxDQUFDLFFBQUQsQ0FBMUI7O0FBQ0EsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGlCQUFELENBQXhCOztBQUNBLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFBRCxDQUE3Qjs7QUFDQSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMscUJBQUQsQ0FBNUI7O0FBQ0EsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLDZCQUFELENBQTNCOztBQUNBLE1BQU0sdUJBQXVCLEdBQUcsT0FBTyxDQUFDLHlDQUFELENBQXZDOztBQUNBLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQ0FBRCxDQUE5Qjs7QUFDQSxNQUFNLHNCQUFzQixHQUFHLE9BQU8sQ0FBQywwQkFBRCxDQUF0Qzs7QUFDQSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBRCxDQUEzQjs7QUFDQSxNQUFNO0FBQUUsRUFBQSxnQkFBRjtBQUFvQixFQUFBO0FBQXBCLElBQW9DLE9BQU8sQ0FBQyxXQUFELENBQWpELEMsQ0FFQTs7O0FBQ0EsTUFBTSxnQkFBTixTQUErQixLQUEvQixDQUFxQztBQUNuQyxFQUFBLFdBQVcsQ0FBRSxHQUFHLElBQUwsRUFBVztBQUNwQixVQUFNLEdBQUcsSUFBVDtBQUNBLFNBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNEOztBQUprQzs7QUFNckMsSUFBSSxPQUFPLGNBQVAsS0FBMEIsV0FBOUIsRUFBMkM7QUFDekM7QUFDQSxFQUFBLFVBQVUsQ0FBQyxjQUFYLEdBQTRCLE1BQU0sY0FBTixTQUE2QixLQUE3QixDQUFtQztBQUM3RCxJQUFBLFdBQVcsQ0FBRSxPQUFGLEVBQVcsTUFBWCxFQUFtQjtBQUM1QixZQUFNLE9BQU47QUFDQSxXQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7O0FBSjRELEdBQS9EO0FBTUQ7O0FBQ0QsTUFBTSx5QkFBTixTQUF3QyxjQUF4QyxDQUF1RDtBQUNyRCxFQUFBLFdBQVcsQ0FBRSxHQUFHLElBQUwsRUFBVztBQUNwQixVQUFNLEdBQUcsSUFBVDtBQUNBLFNBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNEOztBQUpvRDtBQU92RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQWt6Q0csTUFBTSxDQUFDLEdBQVAsQ0FBVyx1QkFBWCxDO2VBd0tBLE1BQU0sQ0FBQyxHQUFQLENBQVcseUJBQVgsQzs7QUF6OUNILE1BQU0sSUFBTixDQUFXO0FBQ1Q7O0FBR0E7O0FBYUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNFLEVBQUEsV0FBVyxDQUFFLEtBQUYsRUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQWpCUixNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQ7QUFpQlE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQWJSLEVBQUU7QUFhTTtBQUFBO0FBQUE7QUFBQSxhQVhGLElBQUksR0FBSjtBQVdFO0FBQUE7QUFBQTtBQUFBLGFBVE4sSUFBSSxHQUFKO0FBU007QUFBQTtBQUFBO0FBQUEsYUFQRCxJQUFJLEdBQUo7QUFPQztBQUFBO0FBQUE7QUFBQSxhQXN0Q0csS0FBSyxrQkFBTCxDQUF3QixJQUF4QixDQUE2QixJQUE3QjtBQXR0Q0g7QUFDakIsU0FBSyxhQUFMLEdBQXFCO0FBQ25CLE1BQUEsT0FBTyxFQUFFO0FBQ1AsUUFBQSxrQkFBa0IsRUFBRTtBQUNsQixhQUFHLDREQURlO0FBRWxCLGFBQUc7QUFGZSxTQURiO0FBS1AsUUFBQSxpQkFBaUIsRUFBRTtBQUNqQixhQUFHLHlDQURjO0FBRWpCLGFBQUc7QUFGYyxTQUxaO0FBU1AsUUFBQSx1QkFBdUIsRUFBRTtBQUN2QixhQUFHLGlEQURvQjtBQUV2QixhQUFHO0FBRm9CLFNBVGxCO0FBYVAsUUFBQSxXQUFXLEVBQUUsaURBYk47QUFjUCxRQUFBLHdCQUF3QixFQUFFLDhCQWRuQjtBQWVQLFFBQUEsOEJBQThCLEVBQUUsNkNBZnpCO0FBZ0JQLFFBQUEsWUFBWSxFQUFFLHVEQWhCUDtBQWlCUCxRQUFBLHlCQUF5QixFQUFFLCtCQWpCcEI7QUFrQlAsUUFBQSxrQkFBa0IsRUFBRSx1QkFsQmI7QUFtQlAsUUFBQSxZQUFZLEVBQUUsa0VBbkJQO0FBb0JQLFFBQUEsY0FBYyxFQUFFLGtDQXBCVDtBQXFCUCxRQUFBLFdBQVcsRUFBRSx3QkFyQk47QUFzQlAsUUFBQSx3QkFBd0IsRUFBRSxpRUF0Qm5CO0FBdUJQLFFBQUEsY0FBYyxFQUFFLDBCQXZCVDtBQXdCUCxRQUFBLG9CQUFvQixFQUFFLHdCQXhCZjtBQXlCUCxRQUFBLG1CQUFtQixFQUFFLDJCQXpCZDtBQTBCUDtBQUNBLFFBQUEsWUFBWSxFQUFFLG1DQTNCUDtBQTRCUCxRQUFBLE9BQU8sRUFBRTtBQUNQLGFBQUcsdUJBREk7QUFFUCxhQUFHO0FBRkksU0E1QkY7QUFnQ1AsUUFBQSx1QkFBdUIsRUFBRSwrQkFoQ2xCO0FBaUNQLFFBQUEsZUFBZSxFQUFFLHFCQWpDVjtBQWtDUCxRQUFBLE1BQU0sRUFBRSxRQWxDRDtBQW1DUCxRQUFBLE1BQU0sRUFBRSxTQW5DRDtBQW9DUCxRQUFBLE1BQU0sRUFBRSxRQXBDRDtBQXFDUCxRQUFBLFdBQVcsRUFBRSxjQXJDTjtBQXNDUCxRQUFBLE9BQU8sRUFBRSxZQXRDRjtBQXVDUCxRQUFBLHFCQUFxQixFQUFFLHdEQXZDaEI7QUF3Q1AsUUFBQSxnQkFBZ0IsRUFBRSwwQkF4Q1g7QUF5Q1AsUUFBQSxnQkFBZ0IsRUFBRSxxQkF6Q1g7QUEwQ1AsUUFBQSxZQUFZLEVBQUUsbUJBMUNQO0FBMkNQLFFBQUEsaUJBQWlCLEVBQUUsaUNBM0NaO0FBNENQLFFBQUEsWUFBWSxFQUFFLGdCQTVDUDtBQTZDUCxRQUFBLGdCQUFnQixFQUFFLHVDQTdDWDtBQThDUCxRQUFBLGtCQUFrQixFQUFFLDBDQTlDYjtBQStDUCxRQUFBLFdBQVcsRUFBRTtBQUNYLGFBQUcsMENBRFE7QUFFWCxhQUFHO0FBRlE7QUEvQ047QUFEVSxLQUFyQjtBQXVEQSxVQUFNLGNBQWMsR0FBRztBQUNyQixNQUFBLEVBQUUsRUFBRSxNQURpQjtBQUVyQixNQUFBLFdBQVcsRUFBRSxLQUZROztBQUdyQjtBQUNOO0FBQ0E7QUFDTSxNQUFBLG9CQUFvQixFQUFFLElBTkQ7QUFPckIsTUFBQSwwQkFBMEIsRUFBRSxJQVBQO0FBUXJCLE1BQUEsS0FBSyxFQUFFLEtBUmM7QUFTckIsTUFBQSxZQUFZLEVBQUU7QUFDWixRQUFBLFdBQVcsRUFBRSxJQUREO0FBRVosUUFBQSxXQUFXLEVBQUUsSUFGRDtBQUdaLFFBQUEsZ0JBQWdCLEVBQUUsSUFITjtBQUlaLFFBQUEsZ0JBQWdCLEVBQUUsSUFKTjtBQUtaLFFBQUEsZ0JBQWdCLEVBQUUsSUFMTjtBQU1aLFFBQUEsZ0JBQWdCLEVBQUUsSUFOTjtBQU9aLFFBQUEsa0JBQWtCLEVBQUU7QUFQUixPQVRPO0FBa0JyQixNQUFBLElBQUksRUFBRSxFQWxCZTtBQW1CckIsTUFBQSxpQkFBaUIsRUFBRyxXQUFELElBQWlCLFdBbkJmO0FBb0JyQixNQUFBLGNBQWMsRUFBRyxLQUFELElBQVcsS0FwQk47QUFxQnJCLE1BQUEsS0FBSyxFQUFFLFlBQVksRUFyQkU7QUFzQnJCLE1BQUEsTUFBTSxFQUFFLGdCQXRCYTtBQXVCckIsTUFBQSxXQUFXLEVBQUU7QUF2QlEsS0FBdkIsQ0F4RGlCLENBa0ZqQjtBQUNBOztBQUNBLFNBQUssSUFBTCxHQUFZLEVBQ1YsR0FBRyxjQURPO0FBRVYsU0FBRyxLQUZPO0FBR1YsTUFBQSxZQUFZLEVBQUUsRUFDWixHQUFHLGNBQWMsQ0FBQyxZQUROO0FBRVosWUFBSSxLQUFJLElBQUksS0FBSSxDQUFDLFlBQWpCO0FBRlk7QUFISixLQUFaLENBcEZpQixDQTZGakI7QUFDQTs7QUFDQSxRQUFJLEtBQUksSUFBSSxLQUFJLENBQUMsTUFBYixJQUF1QixLQUFJLENBQUMsS0FBaEMsRUFBdUM7QUFDckMsV0FBSyxHQUFMLENBQVMsMktBQVQsRUFBc0wsU0FBdEw7QUFDRCxLQUZELE1BRU8sSUFBSSxLQUFJLElBQUksS0FBSSxDQUFDLEtBQWpCLEVBQXdCO0FBQzdCLFdBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsV0FBbkI7QUFDRDs7QUFFRCxTQUFLLEdBQUwsQ0FBVSxlQUFjLEtBQUssV0FBTCxDQUFpQixPQUFRLEVBQWpEOztBQUVBLFFBQUksS0FBSyxJQUFMLENBQVUsWUFBVixDQUF1QixnQkFBdkIsSUFDRyxLQUFLLElBQUwsQ0FBVSxZQUFWLENBQXVCLGdCQUF2QixLQUE0QyxJQUQvQyxJQUVHLENBQUMsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFLLElBQUwsQ0FBVSxZQUFWLENBQXVCLGdCQUFyQyxDQUZSLEVBRWdFO0FBQzlELFlBQU0sSUFBSSxTQUFKLENBQWMsa0RBQWQsQ0FBTjtBQUNEOztBQUVELFNBQUssUUFBTCxHQTdHaUIsQ0ErR2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQUssaUJBQUwsR0FBeUIsUUFBUSxDQUFDLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBRCxFQUFvQyxHQUFwQyxFQUF5QztBQUFFLE1BQUEsT0FBTyxFQUFFLElBQVg7QUFBaUIsTUFBQSxRQUFRLEVBQUU7QUFBM0IsS0FBekMsQ0FBakM7QUFFQSxTQUFLLEtBQUwsR0FBYSxLQUFLLElBQUwsQ0FBVSxLQUF2QjtBQUNBLFNBQUssUUFBTCxDQUFjO0FBQ1osTUFBQSxPQUFPLEVBQUUsRUFERztBQUVaLE1BQUEsS0FBSyxFQUFFLEVBRks7QUFHWixNQUFBLGNBQWMsRUFBRSxFQUhKO0FBSVosTUFBQSxjQUFjLEVBQUUsSUFKSjtBQUtaLE1BQUEsWUFBWSxFQUFFO0FBQ1osUUFBQSxjQUFjLEVBQUUsc0JBQXNCLEVBRDFCO0FBRVosUUFBQSxzQkFBc0IsRUFBRSxJQUZaO0FBR1osUUFBQSxnQkFBZ0IsRUFBRTtBQUhOLE9BTEY7QUFVWixNQUFBLGFBQWEsRUFBRSxDQVZIO0FBV1osTUFBQSxJQUFJLEVBQUUsRUFBRSxHQUFHLEtBQUssSUFBTCxDQUFVO0FBQWYsT0FYTTtBQVlaLE1BQUEsSUFBSSxFQUFFLEVBWk07QUFhWixNQUFBLGNBQWMsRUFBRTtBQWJKLEtBQWQ7QUFnQkEsOEVBQXlCLEtBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixLQUF2QixLQUFpQztBQUM3RSxXQUFLLElBQUwsQ0FBVSxjQUFWLEVBQTBCLFNBQTFCLEVBQXFDLFNBQXJDLEVBQWdELEtBQWhEO0FBQ0EsV0FBSyxTQUFMLENBQWUsU0FBZjtBQUNELEtBSHdCLENBQXpCLENBeklpQixDQThJakI7O0FBQ0EsUUFBSSxLQUFLLElBQUwsQ0FBVSxLQUFWLElBQW1CLE9BQU8sTUFBUCxLQUFrQixXQUF6QyxFQUFzRDtBQUNwRCxNQUFBLE1BQU0sQ0FBQyxLQUFLLElBQUwsQ0FBVSxFQUFYLENBQU4sR0FBdUIsSUFBdkI7QUFDRDs7QUFFRDtBQUNEOztBQUVELEVBQUEsSUFBSSxDQUFFLEtBQUYsRUFBUyxHQUFHLElBQVosRUFBa0I7QUFDcEIsMERBQWMsSUFBZCxDQUFtQixLQUFuQixFQUEwQixHQUFHLElBQTdCO0FBQ0Q7O0FBRUQsRUFBQSxFQUFFLENBQUUsS0FBRixFQUFTLFFBQVQsRUFBbUI7QUFDbkIsMERBQWMsRUFBZCxDQUFpQixLQUFqQixFQUF3QixRQUF4Qjs7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFFRCxFQUFBLElBQUksQ0FBRSxLQUFGLEVBQVMsUUFBVCxFQUFtQjtBQUNyQiwwREFBYyxJQUFkLENBQW1CLEtBQW5CLEVBQTBCLFFBQTFCOztBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVELEVBQUEsR0FBRyxDQUFFLEtBQUYsRUFBUyxRQUFULEVBQW1CO0FBQ3BCLDBEQUFjLEdBQWQsQ0FBa0IsS0FBbEIsRUFBeUIsUUFBekI7O0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLFNBQVMsQ0FBRSxLQUFGLEVBQVM7QUFDaEIsU0FBSyxjQUFMLENBQW9CLE1BQU0sSUFBSTtBQUM1QixNQUFBLE1BQU0sQ0FBQyxNQUFQLENBQWMsS0FBZDtBQUNELEtBRkQ7QUFHRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUNFLEVBQUEsUUFBUSxDQUFFLEtBQUYsRUFBUztBQUNmLFNBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBcEI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUNFLEVBQUEsUUFBUSxHQUFJO0FBQ1YsV0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFYLEVBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUNXLE1BQUwsS0FBSyxHQUFJO0FBQ1g7QUFDQSxXQUFPLEtBQUssUUFBTCxFQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7OztBQUNFLEVBQUEsWUFBWSxDQUFFLE1BQUYsRUFBVSxLQUFWLEVBQWlCO0FBQzNCLFFBQUksQ0FBQyxLQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FBc0IsTUFBdEIsQ0FBTCxFQUFvQztBQUNsQyxZQUFNLElBQUksS0FBSixDQUFXLHVCQUFzQixNQUFPLHFDQUF4QyxDQUFOO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMLENBQWM7QUFDWixNQUFBLEtBQUssRUFBRSxFQUFFLEdBQUcsS0FBSyxRQUFMLEdBQWdCLEtBQXJCO0FBQTRCLFNBQUMsTUFBRCxHQUFVLEVBQUUsR0FBRyxLQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FBc0IsTUFBdEIsQ0FBTDtBQUFvQyxhQUFHO0FBQXZDO0FBQXRDO0FBREssS0FBZDtBQUdEOztBQUVELEVBQUEsUUFBUSxHQUFJO0FBQ1YsVUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFKLENBQWUsQ0FBQyxLQUFLLGFBQU4sRUFBcUIsS0FBSyxJQUFMLENBQVUsTUFBL0IsQ0FBZixDQUFuQjtBQUNBLFNBQUssSUFBTCxHQUFZLFVBQVUsQ0FBQyxTQUFYLENBQXFCLElBQXJCLENBQTBCLFVBQTFCLENBQVo7QUFDQSxTQUFLLFNBQUwsR0FBaUIsVUFBVSxDQUFDLGNBQVgsQ0FBMEIsSUFBMUIsQ0FBK0IsVUFBL0IsQ0FBakI7QUFDQSxTQUFLLE1BQUwsR0FBYyxVQUFVLENBQUMsTUFBekI7QUFDRDs7QUFFRCxFQUFBLFVBQVUsQ0FBRSxPQUFGLEVBQVc7QUFDbkIsU0FBSyxJQUFMLEdBQVksRUFDVixHQUFHLEtBQUssSUFERTtBQUVWLFNBQUcsT0FGTztBQUdWLE1BQUEsWUFBWSxFQUFFLEVBQ1osR0FBRyxLQUFLLElBQUwsQ0FBVSxZQUREO0FBRVosWUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFlBQXZCO0FBRlk7QUFISixLQUFaOztBQVNBLFFBQUksT0FBTyxDQUFDLElBQVosRUFBa0I7QUFDaEIsV0FBSyxPQUFMLENBQWEsT0FBTyxDQUFDLElBQXJCO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMOztBQUVBLFFBQUksT0FBTyxDQUFDLE1BQVosRUFBb0I7QUFDbEIsV0FBSyxjQUFMLENBQXFCLE1BQUQsSUFBWTtBQUM5QixRQUFBLE1BQU0sQ0FBQyxVQUFQO0FBQ0QsT0FGRDtBQUdELEtBcEJrQixDQXNCbkI7OztBQUNBLFNBQUssUUFBTCxHQXZCbUIsQ0F1Qkg7QUFDakI7O0FBRUQsRUFBQSxhQUFhLEdBQUk7QUFDZixVQUFNLGVBQWUsR0FBRztBQUN0QixNQUFBLFVBQVUsRUFBRSxDQURVO0FBRXRCLE1BQUEsYUFBYSxFQUFFLENBRk87QUFHdEIsTUFBQSxjQUFjLEVBQUUsS0FITTtBQUl0QixNQUFBLGFBQWEsRUFBRTtBQUpPLEtBQXhCO0FBTUEsVUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEtBQUssUUFBTCxHQUFnQjtBQUFyQixLQUFkO0FBQ0EsVUFBTSxZQUFZLEdBQUcsRUFBckI7QUFDQSxJQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixFQUFtQixPQUFuQixDQUEyQixNQUFNLElBQUk7QUFDbkMsWUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFEO0FBQVYsT0FBcEI7QUFDQSxNQUFBLFdBQVcsQ0FBQyxRQUFaLEdBQXVCLEVBQUUsR0FBRyxXQUFXLENBQUMsUUFBakI7QUFBMkIsV0FBRztBQUE5QixPQUF2QjtBQUNBLE1BQUEsWUFBWSxDQUFDLE1BQUQsQ0FBWixHQUF1QixXQUF2QjtBQUNELEtBSkQ7QUFNQSxTQUFLLFFBQUwsQ0FBYztBQUNaLE1BQUEsS0FBSyxFQUFFLFlBREs7QUFFWixNQUFBLGFBQWEsRUFBRTtBQUZILEtBQWQ7QUFLQSxTQUFLLElBQUwsQ0FBVSxnQkFBVjtBQUNEOztBQUVELEVBQUEsZUFBZSxDQUFFLEVBQUYsRUFBTTtBQUNuQixzRUFBb0IsR0FBcEIsQ0FBd0IsRUFBeEI7QUFDRDs7QUFFRCxFQUFBLGtCQUFrQixDQUFFLEVBQUYsRUFBTTtBQUN0QixXQUFPLGtFQUFvQixNQUFwQixDQUEyQixFQUEzQixDQUFQO0FBQ0Q7O0FBRUQsRUFBQSxnQkFBZ0IsQ0FBRSxFQUFGLEVBQU07QUFDcEIsd0VBQXFCLEdBQXJCLENBQXlCLEVBQXpCO0FBQ0Q7O0FBRUQsRUFBQSxtQkFBbUIsQ0FBRSxFQUFGLEVBQU07QUFDdkIsV0FBTyxvRUFBcUIsTUFBckIsQ0FBNEIsRUFBNUIsQ0FBUDtBQUNEOztBQUVELEVBQUEsV0FBVyxDQUFFLEVBQUYsRUFBTTtBQUNmLDhEQUFnQixHQUFoQixDQUFvQixFQUFwQjtBQUNEOztBQUVELEVBQUEsY0FBYyxDQUFFLEVBQUYsRUFBTTtBQUNsQixXQUFPLDBEQUFnQixNQUFoQixDQUF1QixFQUF2QixDQUFQO0FBQ0Q7O0FBRUQsRUFBQSxPQUFPLENBQUUsSUFBRixFQUFRO0FBQ2IsVUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLEtBQUssUUFBTCxHQUFnQixJQUFyQjtBQUEyQixTQUFHO0FBQTlCLEtBQXBCO0FBQ0EsVUFBTSxZQUFZLEdBQUcsRUFBRSxHQUFHLEtBQUssUUFBTCxHQUFnQjtBQUFyQixLQUFyQjtBQUVBLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE9BQTFCLENBQW1DLE1BQUQsSUFBWTtBQUM1QyxNQUFBLFlBQVksQ0FBQyxNQUFELENBQVosR0FBdUIsRUFBRSxHQUFHLFlBQVksQ0FBQyxNQUFELENBQWpCO0FBQTJCLFFBQUEsSUFBSSxFQUFFLEVBQUUsR0FBRyxZQUFZLENBQUMsTUFBRCxDQUFaLENBQXFCLElBQTFCO0FBQWdDLGFBQUc7QUFBbkM7QUFBakMsT0FBdkI7QUFDRCxLQUZEO0FBSUEsU0FBSyxHQUFMLENBQVMsa0JBQVQ7QUFDQSxTQUFLLEdBQUwsQ0FBUyxJQUFUO0FBRUEsU0FBSyxRQUFMLENBQWM7QUFDWixNQUFBLElBQUksRUFBRSxXQURNO0FBRVosTUFBQSxLQUFLLEVBQUU7QUFGSyxLQUFkO0FBSUQ7O0FBRUQsRUFBQSxXQUFXLENBQUUsTUFBRixFQUFVLElBQVYsRUFBZ0I7QUFDekIsVUFBTSxZQUFZLEdBQUcsRUFBRSxHQUFHLEtBQUssUUFBTCxHQUFnQjtBQUFyQixLQUFyQjs7QUFDQSxRQUFJLENBQUMsWUFBWSxDQUFDLE1BQUQsQ0FBakIsRUFBMkI7QUFDekIsV0FBSyxHQUFMLENBQVMsK0RBQVQsRUFBMEUsTUFBMUU7QUFDQTtBQUNEOztBQUNELFVBQU0sT0FBTyxHQUFHLEVBQUUsR0FBRyxZQUFZLENBQUMsTUFBRCxDQUFaLENBQXFCLElBQTFCO0FBQWdDLFNBQUc7QUFBbkMsS0FBaEI7QUFDQSxJQUFBLFlBQVksQ0FBQyxNQUFELENBQVosR0FBdUIsRUFBRSxHQUFHLFlBQVksQ0FBQyxNQUFELENBQWpCO0FBQTJCLE1BQUEsSUFBSSxFQUFFO0FBQWpDLEtBQXZCO0FBQ0EsU0FBSyxRQUFMLENBQWM7QUFBRSxNQUFBLEtBQUssRUFBRTtBQUFULEtBQWQ7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUNFLEVBQUEsT0FBTyxDQUFFLE1BQUYsRUFBVTtBQUNmLFdBQU8sS0FBSyxRQUFMLEdBQWdCLEtBQWhCLENBQXNCLE1BQXRCLENBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTs7O0FBQ0UsRUFBQSxRQUFRLEdBQUk7QUFDVixVQUFNO0FBQUUsTUFBQTtBQUFGLFFBQVksS0FBSyxRQUFMLEVBQWxCO0FBQ0EsV0FBTyxNQUFNLENBQUMsTUFBUCxDQUFjLEtBQWQsQ0FBUDtBQUNEOztBQUVELEVBQUEsd0JBQXdCLEdBQUk7QUFDMUIsVUFBTTtBQUFFLE1BQUEsS0FBSyxFQUFFLFdBQVQ7QUFBc0IsTUFBQSxhQUF0QjtBQUFxQyxNQUFBO0FBQXJDLFFBQStDLEtBQUssUUFBTCxFQUFyRDtBQUNBLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFQLENBQWMsV0FBZCxDQUFkO0FBQ0EsVUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFDO0FBQUUsTUFBQTtBQUFGLEtBQUQsS0FBa0IsQ0FBQyxRQUFRLENBQUMsY0FBVixJQUE0QixRQUFRLENBQUMsYUFBcEUsQ0FBeEI7QUFDQSxVQUFNLFFBQVEsR0FBSSxLQUFLLENBQUMsTUFBTixDQUFjLElBQUQsSUFBVSxDQUFDLElBQUksQ0FBQyxRQUFMLENBQWMsYUFBdEMsQ0FBbEI7QUFDQSxVQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTixDQUNuQixJQUFJLElBQUksSUFBSSxDQUFDLFFBQUwsQ0FBYyxhQUFkLElBQStCLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBN0MsSUFBMkQsSUFBSSxDQUFDLFFBQUwsQ0FBYyxXQUQ5RCxDQUFyQjtBQUdBLFVBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYyxJQUFELElBQVUsSUFBSSxDQUFDLFFBQUwsQ0FBYyxhQUFyQyxDQUEzQjtBQUNBLFVBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWMsSUFBRCxJQUFVLElBQUksQ0FBQyxRQUE1QixDQUFwQjtBQUNBLFVBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWMsSUFBRCxJQUFVLElBQUksQ0FBQyxRQUFMLENBQWMsY0FBckMsQ0FBdEI7QUFDQSxVQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTixDQUFjLElBQUQsSUFBVSxJQUFJLENBQUMsS0FBNUIsQ0FBckI7QUFDQSxVQUFNLHdCQUF3QixHQUFHLGVBQWUsQ0FBQyxNQUFoQixDQUF3QixJQUFELElBQVUsQ0FBQyxJQUFJLENBQUMsUUFBdkMsQ0FBakM7QUFDQSxVQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsTUFBTixDQUFjLElBQUQsSUFBVSxJQUFJLENBQUMsUUFBTCxDQUFjLFVBQWQsSUFBNEIsSUFBSSxDQUFDLFFBQUwsQ0FBYyxXQUFqRSxDQUF4QjtBQUVBLFdBQU87QUFDTCxNQUFBLFFBREs7QUFFTCxNQUFBLFlBRks7QUFHTCxNQUFBLGtCQUhLO0FBSUwsTUFBQSxXQUpLO0FBS0wsTUFBQSxhQUxLO0FBTUwsTUFBQSxZQU5LO0FBT0wsTUFBQSxlQVBLO0FBUUwsTUFBQSx3QkFSSztBQVNMLE1BQUEsZUFUSztBQVdMLE1BQUEsZUFBZSxFQUFFLGtCQUFrQixDQUFDLE1BQW5CLEdBQTRCLENBWHhDO0FBWUwsTUFBQSxhQUFhLEVBQUUsYUFBYSxLQUFLLEdBQWxCLElBQ1YsYUFBYSxDQUFDLE1BQWQsS0FBeUIsS0FBSyxDQUFDLE1BRHJCLElBRVYsZUFBZSxDQUFDLE1BQWhCLEtBQTJCLENBZDNCO0FBZUwsTUFBQSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEtBQUYsSUFBVyxZQUFZLENBQUMsTUFBYixLQUF3QixLQUFLLENBQUMsTUFmbEQ7QUFnQkwsTUFBQSxXQUFXLEVBQUUsZUFBZSxDQUFDLE1BQWhCLEtBQTJCLENBQTNCLElBQWdDLFdBQVcsQ0FBQyxNQUFaLEtBQXVCLGVBQWUsQ0FBQyxNQWhCL0U7QUFpQkwsTUFBQSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsTUFBaEIsR0FBeUIsQ0FqQnhDO0FBa0JMLE1BQUEsV0FBVyxFQUFFLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUF4QjtBQWxCUixLQUFQO0FBb0JEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0UsRUFBQSxvQkFBb0IsQ0FBRSxJQUFGLEVBQVEsS0FBUixFQUFlO0FBQ2pDLFFBQUk7QUFDRixnRkFBd0IsSUFBeEIsRUFBOEIsS0FBOUI7O0FBQ0EsYUFBTztBQUNMLFFBQUEsTUFBTSxFQUFFO0FBREgsT0FBUDtBQUdELEtBTEQsQ0FLRSxPQUFPLEdBQVAsRUFBWTtBQUNaLGFBQU87QUFDTCxRQUFBLE1BQU0sRUFBRSxLQURIO0FBRUwsUUFBQSxNQUFNLEVBQUUsR0FBRyxDQUFDO0FBRlAsT0FBUDtBQUlEO0FBQ0Y7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFzSkUsRUFBQSx3QkFBd0IsQ0FBRSxNQUFGLEVBQVU7QUFDaEMsVUFBTTtBQUFFLE1BQUE7QUFBRixRQUFZLEtBQUssUUFBTCxFQUFsQjs7QUFFQSxRQUFJLEtBQUssQ0FBQyxNQUFELENBQUwsSUFBaUIsQ0FBQyxLQUFLLENBQUMsTUFBRCxDQUFMLENBQWMsT0FBcEMsRUFBNkM7QUFDM0MsYUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsV0FBTyxLQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFnRkU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLEVBQUEsT0FBTyxDQUFFLElBQUYsRUFBUTtBQUNiLHdGQUE2QixJQUE3Qjs7QUFFQSxVQUFNO0FBQUUsTUFBQTtBQUFGLFFBQVksS0FBSyxRQUFMLEVBQWxCOztBQUNBLFFBQUksT0FBTywrQkFBRyxJQUFILGtFQUF1QyxLQUF2QyxFQUE4QyxJQUE5QyxDQUFYLENBSmEsQ0FNYjtBQUNBOzs7QUFDQSxRQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBVCxDQUFMLElBQXFCLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBVCxDQUFMLENBQWtCLE9BQTNDLEVBQW9EO0FBQ2xELE1BQUEsT0FBTyxHQUFHLEVBQ1IsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQVQsQ0FEQTtBQUVSLFFBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUZIO0FBR1IsUUFBQSxPQUFPLEVBQUU7QUFIRCxPQUFWO0FBS0EsV0FBSyxHQUFMLENBQVUsaURBQWdELE9BQU8sQ0FBQyxJQUFLLEtBQUksT0FBTyxDQUFDLEVBQUcsRUFBdEY7QUFDRDs7QUFFRCxTQUFLLFFBQUwsQ0FBYztBQUNaLE1BQUEsS0FBSyxFQUFFLEVBQ0wsR0FBRyxLQURFO0FBRUwsU0FBQyxPQUFPLENBQUMsRUFBVCxHQUFjO0FBRlQ7QUFESyxLQUFkO0FBT0EsU0FBSyxJQUFMLENBQVUsWUFBVixFQUF3QixPQUF4QjtBQUNBLFNBQUssSUFBTCxDQUFVLGFBQVYsRUFBeUIsQ0FBQyxPQUFELENBQXpCO0FBQ0EsU0FBSyxHQUFMLENBQVUsZUFBYyxPQUFPLENBQUMsSUFBSyxLQUFJLE9BQU8sQ0FBQyxFQUFHLGdCQUFlLE9BQU8sQ0FBQyxJQUFLLEVBQWhGOztBQUVBOztBQUVBLFdBQU8sT0FBTyxDQUFDLEVBQWY7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLFFBQVEsQ0FBRSxlQUFGLEVBQW1CO0FBQ3pCLDBGQUR5QixDQUd6Qjs7O0FBQ0EsVUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEtBQUssUUFBTCxHQUFnQjtBQUFyQixLQUFkO0FBQ0EsVUFBTSxRQUFRLEdBQUcsRUFBakI7QUFDQSxVQUFNLE1BQU0sR0FBRyxFQUFmOztBQUNBLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQXBDLEVBQTRDLENBQUMsRUFBN0MsRUFBaUQ7QUFDL0MsVUFBSTtBQUNGLFlBQUksT0FBTywrQkFBRyxJQUFILGtFQUF1QyxLQUF2QyxFQUE4QyxlQUFlLENBQUMsQ0FBRCxDQUE3RCxDQUFYLENBREUsQ0FFRjtBQUNBOzs7QUFDQSxZQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBVCxDQUFMLElBQXFCLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBVCxDQUFMLENBQWtCLE9BQTNDLEVBQW9EO0FBQ2xELFVBQUEsT0FBTyxHQUFHLEVBQ1IsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQVQsQ0FEQTtBQUVSLFlBQUEsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFELENBQWYsQ0FBbUIsSUFGakI7QUFHUixZQUFBLE9BQU8sRUFBRTtBQUhELFdBQVY7QUFLQSxlQUFLLEdBQUwsQ0FBVSxrQ0FBaUMsT0FBTyxDQUFDLElBQUssS0FBSSxPQUFPLENBQUMsRUFBRyxFQUF2RTtBQUNEOztBQUNELFFBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFULENBQUwsR0FBb0IsT0FBcEI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsT0FBZDtBQUNELE9BZEQsQ0FjRSxPQUFPLEdBQVAsRUFBWTtBQUNaLFlBQUksQ0FBQyxHQUFHLENBQUMsYUFBVCxFQUF3QjtBQUN0QixVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFLLFFBQUwsQ0FBYztBQUFFLE1BQUE7QUFBRixLQUFkO0FBRUEsSUFBQSxRQUFRLENBQUMsT0FBVCxDQUFrQixPQUFELElBQWE7QUFDNUIsV0FBSyxJQUFMLENBQVUsWUFBVixFQUF3QixPQUF4QjtBQUNELEtBRkQ7QUFJQSxTQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCLFFBQXpCOztBQUVBLFFBQUksUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsV0FBSyxHQUFMLENBQVUsa0JBQWlCLFFBQVEsQ0FBQyxNQUFPLFFBQTNDO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsTUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFFBQVosRUFBc0IsT0FBdEIsQ0FBOEIsTUFBTSxJQUFJO0FBQ3RDLGFBQUssR0FBTCxDQUFVLGVBQWMsUUFBUSxDQUFDLE1BQUQsQ0FBUixDQUFpQixJQUFLLFVBQVMsUUFBUSxDQUFDLE1BQUQsQ0FBUixDQUFpQixFQUFHLFlBQVcsUUFBUSxDQUFDLE1BQUQsQ0FBUixDQUFpQixJQUFLLEVBQTVHO0FBQ0QsT0FGRDtBQUdEOztBQUVELFFBQUksUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkI7QUFDRDs7QUFFRCxRQUFJLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQXBCLEVBQXVCO0FBQ3JCLFVBQUksT0FBTyxHQUFHLGdEQUFkO0FBQ0EsTUFBQSxNQUFNLENBQUMsT0FBUCxDQUFnQixRQUFELElBQWM7QUFDM0IsUUFBQSxPQUFPLElBQUssUUFBTyxRQUFRLENBQUMsT0FBUSxFQUFwQztBQUNELE9BRkQ7QUFJQSxXQUFLLElBQUwsQ0FBVTtBQUNSLFFBQUEsT0FBTyxFQUFFLEtBQUssSUFBTCxDQUFVLG9CQUFWLEVBQWdDO0FBQUUsVUFBQSxXQUFXLEVBQUUsTUFBTSxDQUFDO0FBQXRCLFNBQWhDLENBREQ7QUFFUixRQUFBLE9BQU8sRUFBRTtBQUZELE9BQVYsRUFHRyxPQUhILEVBR1ksS0FBSyxJQUFMLENBQVUsV0FIdEI7O0FBS0EsVUFBSSxPQUFPLGNBQVAsS0FBMEIsVUFBOUIsRUFBMEM7QUFDeEMsY0FBTSxJQUFJLGNBQUosQ0FBbUIsTUFBbkIsRUFBMkIsT0FBM0IsQ0FBTjtBQUNELE9BRkQsTUFFTztBQUNMLGNBQU0sR0FBRyxHQUFHLElBQUksS0FBSixDQUFVLE9BQVYsQ0FBWjtBQUNBLFFBQUEsR0FBRyxDQUFDLE1BQUosR0FBYSxNQUFiO0FBQ0EsY0FBTSxHQUFOO0FBQ0Q7QUFDRjtBQUNGOztBQUVELEVBQUEsV0FBVyxDQUFFLE9BQUYsRUFBVyxNQUFYLEVBQW1CO0FBQzVCLFVBQU07QUFBRSxNQUFBLEtBQUY7QUFBUyxNQUFBO0FBQVQsUUFBNEIsS0FBSyxRQUFMLEVBQWxDO0FBQ0EsVUFBTSxZQUFZLEdBQUcsRUFBRSxHQUFHO0FBQUwsS0FBckI7QUFDQSxVQUFNLGNBQWMsR0FBRyxFQUFFLEdBQUc7QUFBTCxLQUF2QjtBQUVBLFVBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBZCxDQUFyQjtBQUNBLElBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBaUIsTUFBRCxJQUFZO0FBQzFCLFVBQUksS0FBSyxDQUFDLE1BQUQsQ0FBVCxFQUFtQjtBQUNqQixRQUFBLFlBQVksQ0FBQyxNQUFELENBQVosR0FBdUIsS0FBSyxDQUFDLE1BQUQsQ0FBNUI7QUFDQSxlQUFPLFlBQVksQ0FBQyxNQUFELENBQW5CO0FBQ0Q7QUFDRixLQUxELEVBTjRCLENBYTVCOztBQUNBLGFBQVMsZ0JBQVQsQ0FBMkIsWUFBM0IsRUFBeUM7QUFDdkMsYUFBTyxZQUFZLENBQUMsWUFBRCxDQUFaLEtBQStCLFNBQXRDO0FBQ0Q7O0FBRUQsSUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLGNBQVosRUFBNEIsT0FBNUIsQ0FBcUMsUUFBRCxJQUFjO0FBQ2hELFlBQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxRQUFELENBQWQsQ0FBeUIsT0FBekIsQ0FBaUMsTUFBakMsQ0FBd0MsZ0JBQXhDLENBQW5CLENBRGdELENBR2hEOztBQUNBLFVBQUksVUFBVSxDQUFDLE1BQVgsS0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0IsZUFBTyxjQUFjLENBQUMsUUFBRCxDQUFyQjtBQUNBO0FBQ0Q7O0FBRUQsTUFBQSxjQUFjLENBQUMsUUFBRCxDQUFkLEdBQTJCLEVBQ3pCLEdBQUcsY0FBYyxDQUFDLFFBQUQsQ0FEUTtBQUV6QixRQUFBLE9BQU8sRUFBRTtBQUZnQixPQUEzQjtBQUlELEtBYkQ7QUFlQSxVQUFNLFdBQVcsR0FBRztBQUNsQixNQUFBLGNBQWMsRUFBRSxjQURFO0FBRWxCLE1BQUEsS0FBSyxFQUFFO0FBRlcsS0FBcEIsQ0FqQzRCLENBc0M1QjtBQUNBOztBQUNBLFFBQUksTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE1BQTFCLEtBQXFDLENBQXpDLEVBQTRDO0FBQzFDLE1BQUEsV0FBVyxDQUFDLGNBQVosR0FBNkIsSUFBN0I7QUFDQSxNQUFBLFdBQVcsQ0FBQyxLQUFaLEdBQW9CLElBQXBCO0FBQ0EsTUFBQSxXQUFXLENBQUMsY0FBWixHQUE2QixJQUE3QjtBQUNEOztBQUVELFNBQUssUUFBTCxDQUFjLFdBQWQ7QUFDQSxTQUFLLHNCQUFMO0FBRUEsVUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLENBQXZCO0FBQ0EsSUFBQSxjQUFjLENBQUMsT0FBZixDQUF3QixNQUFELElBQVk7QUFDakMsV0FBSyxJQUFMLENBQVUsY0FBVixFQUEwQixZQUFZLENBQUMsTUFBRCxDQUF0QyxFQUFnRCxNQUFoRDtBQUNELEtBRkQ7O0FBSUEsUUFBSSxjQUFjLENBQUMsTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUM3QixXQUFLLEdBQUwsQ0FBVSxXQUFVLGNBQWMsQ0FBQyxNQUFPLFFBQTFDO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBSyxHQUFMLENBQVUsa0JBQWlCLGNBQWMsQ0FBQyxJQUFmLENBQW9CLElBQXBCLENBQTBCLEVBQXJEO0FBQ0Q7QUFDRjs7QUFFRCxFQUFBLFVBQVUsQ0FBRSxNQUFGLEVBQVUsTUFBTSxHQUFHLElBQW5CLEVBQXlCO0FBQ2pDLFNBQUssV0FBTCxDQUFpQixDQUFDLE1BQUQsQ0FBakIsRUFBMkIsTUFBM0I7QUFDRDs7QUFFRCxFQUFBLFdBQVcsQ0FBRSxNQUFGLEVBQVU7QUFDbkIsUUFBSSxDQUFDLEtBQUssUUFBTCxHQUFnQixZQUFoQixDQUE2QixnQkFBOUIsSUFDSSxLQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLGNBRDdCLEVBQzZDO0FBQzNDLGFBQU8sU0FBUDtBQUNEOztBQUVELFVBQU0sU0FBUyxHQUFHLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsUUFBckIsSUFBaUMsS0FBbkQ7QUFDQSxVQUFNLFFBQVEsR0FBRyxDQUFDLFNBQWxCO0FBRUEsU0FBSyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCO0FBQ3hCLE1BQUE7QUFEd0IsS0FBMUI7QUFJQSxTQUFLLElBQUwsQ0FBVSxjQUFWLEVBQTBCLE1BQTFCLEVBQWtDLFFBQWxDO0FBRUEsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsRUFBQSxRQUFRLEdBQUk7QUFDVixVQUFNLFlBQVksR0FBRyxFQUFFLEdBQUcsS0FBSyxRQUFMLEdBQWdCO0FBQXJCLEtBQXJCO0FBQ0EsVUFBTSxzQkFBc0IsR0FBRyxNQUFNLENBQUMsSUFBUCxDQUFZLFlBQVosRUFBMEIsTUFBMUIsQ0FBa0MsSUFBRCxJQUFVO0FBQ3hFLGFBQU8sQ0FBQyxZQUFZLENBQUMsSUFBRCxDQUFaLENBQW1CLFFBQW5CLENBQTRCLGNBQTdCLElBQ0csWUFBWSxDQUFDLElBQUQsQ0FBWixDQUFtQixRQUFuQixDQUE0QixhQUR0QztBQUVELEtBSDhCLENBQS9CO0FBS0EsSUFBQSxzQkFBc0IsQ0FBQyxPQUF2QixDQUFnQyxJQUFELElBQVU7QUFDdkMsWUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLFlBQVksQ0FBQyxJQUFELENBQWpCO0FBQXlCLFFBQUEsUUFBUSxFQUFFO0FBQW5DLE9BQXBCO0FBQ0EsTUFBQSxZQUFZLENBQUMsSUFBRCxDQUFaLEdBQXFCLFdBQXJCO0FBQ0QsS0FIRDtBQUtBLFNBQUssUUFBTCxDQUFjO0FBQUUsTUFBQSxLQUFLLEVBQUU7QUFBVCxLQUFkO0FBQ0EsU0FBSyxJQUFMLENBQVUsV0FBVjtBQUNEOztBQUVELEVBQUEsU0FBUyxHQUFJO0FBQ1gsVUFBTSxZQUFZLEdBQUcsRUFBRSxHQUFHLEtBQUssUUFBTCxHQUFnQjtBQUFyQixLQUFyQjtBQUNBLFVBQU0sc0JBQXNCLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE1BQTFCLENBQWtDLElBQUQsSUFBVTtBQUN4RSxhQUFPLENBQUMsWUFBWSxDQUFDLElBQUQsQ0FBWixDQUFtQixRQUFuQixDQUE0QixjQUE3QixJQUNHLFlBQVksQ0FBQyxJQUFELENBQVosQ0FBbUIsUUFBbkIsQ0FBNEIsYUFEdEM7QUFFRCxLQUg4QixDQUEvQjtBQUtBLElBQUEsc0JBQXNCLENBQUMsT0FBdkIsQ0FBZ0MsSUFBRCxJQUFVO0FBQ3ZDLFlBQU0sV0FBVyxHQUFHLEVBQ2xCLEdBQUcsWUFBWSxDQUFDLElBQUQsQ0FERztBQUVsQixRQUFBLFFBQVEsRUFBRSxLQUZRO0FBR2xCLFFBQUEsS0FBSyxFQUFFO0FBSFcsT0FBcEI7QUFLQSxNQUFBLFlBQVksQ0FBQyxJQUFELENBQVosR0FBcUIsV0FBckI7QUFDRCxLQVBEO0FBUUEsU0FBSyxRQUFMLENBQWM7QUFBRSxNQUFBLEtBQUssRUFBRTtBQUFULEtBQWQ7QUFFQSxTQUFLLElBQUwsQ0FBVSxZQUFWO0FBQ0Q7O0FBRUQsRUFBQSxRQUFRLEdBQUk7QUFDVixVQUFNLFlBQVksR0FBRyxFQUFFLEdBQUcsS0FBSyxRQUFMLEdBQWdCO0FBQXJCLEtBQXJCO0FBQ0EsVUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE1BQTFCLENBQWlDLElBQUksSUFBSTtBQUM1RCxhQUFPLFlBQVksQ0FBQyxJQUFELENBQVosQ0FBbUIsS0FBMUI7QUFDRCxLQUZvQixDQUFyQjtBQUlBLElBQUEsWUFBWSxDQUFDLE9BQWIsQ0FBc0IsSUFBRCxJQUFVO0FBQzdCLFlBQU0sV0FBVyxHQUFHLEVBQ2xCLEdBQUcsWUFBWSxDQUFDLElBQUQsQ0FERztBQUVsQixRQUFBLFFBQVEsRUFBRSxLQUZRO0FBR2xCLFFBQUEsS0FBSyxFQUFFO0FBSFcsT0FBcEI7QUFLQSxNQUFBLFlBQVksQ0FBQyxJQUFELENBQVosR0FBcUIsV0FBckI7QUFDRCxLQVBEO0FBUUEsU0FBSyxRQUFMLENBQWM7QUFDWixNQUFBLEtBQUssRUFBRSxZQURLO0FBRVosTUFBQSxLQUFLLEVBQUU7QUFGSyxLQUFkO0FBS0EsU0FBSyxJQUFMLENBQVUsV0FBVixFQUF1QixZQUF2Qjs7QUFFQSxRQUFJLFlBQVksQ0FBQyxNQUFiLEtBQXdCLENBQTVCLEVBQStCO0FBQzdCLGFBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBZ0I7QUFDckIsUUFBQSxVQUFVLEVBQUUsRUFEUztBQUVyQixRQUFBLE1BQU0sRUFBRTtBQUZhLE9BQWhCLENBQVA7QUFJRDs7QUFFRCxVQUFNLFFBQVEsK0JBQUcsSUFBSCxnQ0FBc0IsWUFBdEIsRUFBb0M7QUFDaEQsTUFBQSxtQkFBbUIsRUFBRSxJQUQyQixDQUNyQjs7QUFEcUIsS0FBcEMsQ0FBZDs7QUFHQSx1Q0FBTyxJQUFQLDBCQUF1QixRQUF2QjtBQUNEOztBQUVELEVBQUEsU0FBUyxHQUFJO0FBQ1gsU0FBSyxJQUFMLENBQVUsWUFBVjtBQUVBLFVBQU07QUFBRSxNQUFBO0FBQUYsUUFBWSxLQUFLLFFBQUwsRUFBbEI7QUFFQSxVQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosQ0FBaEI7O0FBQ0EsUUFBSSxPQUFPLENBQUMsTUFBWixFQUFvQjtBQUNsQixXQUFLLFdBQUwsQ0FBaUIsT0FBakIsRUFBMEIsWUFBMUI7QUFDRDs7QUFFRCxTQUFLLFFBQUwsQ0FBYztBQUNaLE1BQUEsYUFBYSxFQUFFLENBREg7QUFFWixNQUFBLEtBQUssRUFBRSxJQUZLO0FBR1osTUFBQSxjQUFjLEVBQUU7QUFISixLQUFkO0FBS0Q7O0FBRUQsRUFBQSxXQUFXLENBQUUsTUFBRixFQUFVO0FBQ25CLFNBQUssWUFBTCxDQUFrQixNQUFsQixFQUEwQjtBQUN4QixNQUFBLEtBQUssRUFBRSxJQURpQjtBQUV4QixNQUFBLFFBQVEsRUFBRTtBQUZjLEtBQTFCO0FBS0EsU0FBSyxJQUFMLENBQVUsY0FBVixFQUEwQixNQUExQjs7QUFFQSxVQUFNLFFBQVEsK0JBQUcsSUFBSCxnQ0FBc0IsQ0FBQyxNQUFELENBQXRCLEVBQWdDO0FBQzVDLE1BQUEsbUJBQW1CLEVBQUUsSUFEdUIsQ0FDakI7O0FBRGlCLEtBQWhDLENBQWQ7O0FBR0EsdUNBQU8sSUFBUCwwQkFBdUIsUUFBdkI7QUFDRDs7QUFFRCxFQUFBLEtBQUssR0FBSTtBQUNQLFNBQUssU0FBTDtBQUNEOztBQUVELEVBQUEsTUFBTSxHQUFJO0FBQ1IsU0FBSyxjQUFMLENBQW9CLE1BQU0sSUFBSTtBQUM1QixVQUFJLE1BQU0sQ0FBQyxRQUFQLElBQW1CLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE1BQXZDLEVBQStDO0FBQzdDLFFBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsTUFBaEI7QUFDRDtBQUNGLEtBSkQ7QUFLRDs7QUFFRCxFQUFBLGlCQUFpQixDQUFFLElBQUYsRUFBUSxJQUFSLEVBQWM7QUFDN0IsUUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixDQUFMLEVBQTRCO0FBQzFCLFdBQUssR0FBTCxDQUFVLDBEQUF5RCxJQUFJLENBQUMsRUFBRyxFQUEzRTtBQUNBO0FBQ0QsS0FKNEIsQ0FNN0I7OztBQUNBLFVBQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsSUFBSSxDQUFDLFVBQXJCLEtBQW9DLElBQUksQ0FBQyxVQUFMLEdBQWtCLENBQWhGO0FBQ0EsU0FBSyxZQUFMLENBQWtCLElBQUksQ0FBQyxFQUF2QixFQUEyQjtBQUN6QixNQUFBLFFBQVEsRUFBRSxFQUNSLEdBQUcsS0FBSyxPQUFMLENBQWEsSUFBSSxDQUFDLEVBQWxCLEVBQXNCLFFBRGpCO0FBRVIsUUFBQSxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBRlo7QUFHUixRQUFBLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFIVDtBQUlSLFFBQUEsVUFBVSxFQUFFLGlCQUFpQixHQUN6QixJQUFJLENBQUMsS0FBTCxDQUFZLElBQUksQ0FBQyxhQUFMLEdBQXFCLElBQUksQ0FBQyxVQUEzQixHQUF5QyxHQUFwRCxDQUR5QixHQUV6QjtBQU5JO0FBRGUsS0FBM0I7QUFXQSxTQUFLLHNCQUFMO0FBQ0Q7O0FBRUQsRUFBQSxzQkFBc0IsR0FBSTtBQUN4QjtBQUNBO0FBQ0EsVUFBTSxLQUFLLEdBQUcsS0FBSyxRQUFMLEVBQWQ7QUFFQSxVQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTixDQUFjLElBQUQsSUFBVTtBQUN4QyxhQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsYUFBZCxJQUNGLElBQUksQ0FBQyxRQUFMLENBQWMsVUFEWixJQUVGLElBQUksQ0FBQyxRQUFMLENBQWMsV0FGbkI7QUFHRCxLQUprQixDQUFuQjs7QUFNQSxRQUFJLFVBQVUsQ0FBQyxNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQzNCLFdBQUssSUFBTCxDQUFVLFVBQVYsRUFBc0IsQ0FBdEI7QUFDQSxXQUFLLFFBQUwsQ0FBYztBQUFFLFFBQUEsYUFBYSxFQUFFO0FBQWpCLE9BQWQ7QUFDQTtBQUNEOztBQUVELFVBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFYLENBQW1CLElBQUQsSUFBVSxJQUFJLENBQUMsUUFBTCxDQUFjLFVBQWQsSUFBNEIsSUFBeEQsQ0FBbkI7QUFDQSxVQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBWCxDQUFtQixJQUFELElBQVUsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLElBQTRCLElBQXhELENBQXJCOztBQUVBLFFBQUksVUFBVSxDQUFDLE1BQVgsS0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0IsWUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLE1BQVgsR0FBb0IsR0FBeEM7QUFDQSxZQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsTUFBYixDQUFvQixDQUFDLEdBQUQsRUFBTSxJQUFOLEtBQWU7QUFDekQsZUFBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUEzQjtBQUNELE9BRnVCLEVBRXJCLENBRnFCLENBQXhCO0FBR0EsWUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBWSxlQUFlLEdBQUcsV0FBbkIsR0FBa0MsR0FBN0MsQ0FBdEI7QUFDQSxXQUFLLFFBQUwsQ0FBYztBQUFFLFFBQUE7QUFBRixPQUFkO0FBQ0E7QUFDRDs7QUFFRCxRQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsTUFBWCxDQUFrQixDQUFDLEdBQUQsRUFBTSxJQUFOLEtBQWU7QUFDL0MsYUFBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUEzQjtBQUNELEtBRmUsRUFFYixDQUZhLENBQWhCO0FBR0EsVUFBTSxXQUFXLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUEzQztBQUNBLElBQUEsU0FBUyxJQUFJLFdBQVcsR0FBRyxZQUFZLENBQUMsTUFBeEM7QUFFQSxRQUFJLFlBQVksR0FBRyxDQUFuQjtBQUNBLElBQUEsVUFBVSxDQUFDLE9BQVgsQ0FBb0IsSUFBRCxJQUFVO0FBQzNCLE1BQUEsWUFBWSxJQUFJLElBQUksQ0FBQyxRQUFMLENBQWMsYUFBOUI7QUFDRCxLQUZEO0FBR0EsSUFBQSxZQUFZLENBQUMsT0FBYixDQUFzQixJQUFELElBQVU7QUFDN0IsTUFBQSxZQUFZLElBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBZCxJQUE0QixDQUFoQyxDQUFaLEdBQWtELEdBQWxFO0FBQ0QsS0FGRDtBQUlBLFFBQUksYUFBYSxHQUFHLFNBQVMsS0FBSyxDQUFkLEdBQ2hCLENBRGdCLEdBRWhCLElBQUksQ0FBQyxLQUFMLENBQVksWUFBWSxHQUFHLFNBQWhCLEdBQTZCLEdBQXhDLENBRkosQ0E1Q3dCLENBZ0R4QjtBQUNBOztBQUNBLFFBQUksYUFBYSxHQUFHLEdBQXBCLEVBQXlCO0FBQ3ZCLE1BQUEsYUFBYSxHQUFHLEdBQWhCO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMLENBQWM7QUFBRSxNQUFBO0FBQUYsS0FBZDtBQUNBLFNBQUssSUFBTCxDQUFVLFVBQVYsRUFBc0IsYUFBdEI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7QUFvS0UsRUFBQSxrQkFBa0IsR0FBSTtBQUNwQixVQUFNLE1BQU0sR0FDUixPQUFPLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQXhCLEtBQW1DLFdBQW5DLEdBQ0UsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFEbkIsR0FFRSxJQUhOOztBQUlBLFFBQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxXQUFLLElBQUwsQ0FBVSxZQUFWO0FBQ0EsV0FBSyxJQUFMLENBQVUsS0FBSyxJQUFMLENBQVUsc0JBQVYsQ0FBVixFQUE2QyxPQUE3QyxFQUFzRCxDQUF0RDtBQUNBLFdBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNELEtBSkQsTUFJTztBQUNMLFdBQUssSUFBTCxDQUFVLFdBQVY7O0FBQ0EsVUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDbkIsYUFBSyxJQUFMLENBQVUsYUFBVjtBQUNBLGFBQUssSUFBTCxDQUFVLEtBQUssSUFBTCxDQUFVLHFCQUFWLENBQVYsRUFBNEMsU0FBNUMsRUFBdUQsSUFBdkQ7QUFDQSxhQUFLLFVBQUwsR0FBa0IsS0FBbEI7QUFDRDtBQUNGO0FBQ0Y7O0FBSUQsRUFBQSxLQUFLLEdBQUk7QUFDUCxXQUFPLEtBQUssSUFBTCxDQUFVLEVBQWpCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFOzs7QUFDQSxFQUFBLEdBQUcsQ0FBRSxNQUFGLEVBQVUsSUFBVixFQUFnQjtBQUNqQixRQUFJLE9BQU8sTUFBUCxLQUFrQixVQUF0QixFQUFrQztBQUNoQyxZQUFNLEdBQUcsR0FBSSxvQ0FBbUMsTUFBTSxLQUFLLElBQVgsR0FBa0IsTUFBbEIsR0FBMkIsT0FBTyxNQUFPLEdBQTdFLEdBQ1Isb0VBREo7QUFFQSxZQUFNLElBQUksU0FBSixDQUFjLEdBQWQsQ0FBTjtBQUNELEtBTGdCLENBT2pCOzs7QUFDQSxVQUFNLE1BQU0sR0FBRyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWlCLElBQWpCLENBQWY7QUFDQSxVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsRUFBeEI7O0FBRUEsUUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLFlBQU0sSUFBSSxLQUFKLENBQVUsNkJBQVYsQ0FBTjtBQUNEOztBQUVELFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBWixFQUFrQjtBQUNoQixZQUFNLElBQUksS0FBSixDQUFVLDhCQUFWLENBQU47QUFDRDs7QUFFRCxVQUFNLG1CQUFtQixHQUFHLEtBQUssU0FBTCxDQUFlLFFBQWYsQ0FBNUI7O0FBQ0EsUUFBSSxtQkFBSixFQUF5QjtBQUN2QixZQUFNLEdBQUcsR0FBSSxpQ0FBZ0MsbUJBQW1CLENBQUMsRUFBRyxLQUF4RCxHQUNQLGtCQUFpQixRQUFTLE1BRG5CLEdBRVIsbUZBRko7QUFHQSxZQUFNLElBQUksS0FBSixDQUFVLEdBQVYsQ0FBTjtBQUNEOztBQUVELFFBQUksTUFBTSxDQUFDLE9BQVgsRUFBb0I7QUFDbEIsV0FBSyxHQUFMLENBQVUsU0FBUSxRQUFTLEtBQUksTUFBTSxDQUFDLE9BQVEsRUFBOUM7QUFDRDs7QUFFRCxRQUFJLE1BQU0sQ0FBQyxJQUFQLGdDQUFlLElBQWYscUJBQUosRUFBa0M7QUFDaEMsNERBQWMsTUFBTSxDQUFDLElBQXJCLEVBQTJCLElBQTNCLENBQWdDLE1BQWhDO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsNERBQWMsTUFBTSxDQUFDLElBQXJCLElBQTZCLENBQUMsTUFBRCxDQUE3QjtBQUNEOztBQUNELElBQUEsTUFBTSxDQUFDLE9BQVA7QUFFQSxXQUFPLElBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0UsRUFBQSxTQUFTLENBQUUsRUFBRixFQUFNO0FBQ2IsU0FBSyxNQUFNLE9BQVgsSUFBc0IsTUFBTSxDQUFDLE1BQVAsNkJBQWMsSUFBZCxzQkFBdEIsRUFBb0Q7QUFDbEQsWUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSxNQUFNLElBQUksTUFBTSxDQUFDLEVBQVAsS0FBYyxFQUFyQyxDQUFwQjtBQUNBLFVBQUksV0FBVyxJQUFJLElBQW5CLEVBQXlCLE9BQU8sV0FBUDtBQUMxQjs7QUFDRCxXQUFPLFNBQVA7QUFDRDs7QUFFRCxnQkFBdUMsSUFBdkMsRUFBNkM7QUFDM0MsV0FBTyxzREFBYyxJQUFkLENBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQUNFLEVBQUEsY0FBYyxDQUFFLE1BQUYsRUFBVTtBQUN0QixJQUFBLE1BQU0sQ0FBQyxNQUFQLDZCQUFjLElBQWQsdUJBQTZCLElBQTdCLENBQWtDLENBQWxDLEVBQXFDLE9BQXJDLENBQTZDLE1BQTdDO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLFlBQVksQ0FBRSxRQUFGLEVBQVk7QUFDdEIsU0FBSyxHQUFMLENBQVUsbUJBQWtCLFFBQVEsQ0FBQyxFQUFHLEVBQXhDO0FBQ0EsU0FBSyxJQUFMLENBQVUsZUFBVixFQUEyQixRQUEzQjs7QUFFQSxRQUFJLFFBQVEsQ0FBQyxTQUFiLEVBQXdCO0FBQ3RCLE1BQUEsUUFBUSxDQUFDLFNBQVQ7QUFDRDs7QUFFRCxVQUFNLElBQUksR0FBRyxzREFBYyxRQUFRLENBQUMsSUFBdkIsQ0FBYixDQVJzQixDQVN0QjtBQUNBO0FBQ0E7OztBQUNBLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFMLEtBQVksUUFBUSxDQUFDLEVBQTVDLENBQWQ7O0FBQ0EsUUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCLE1BQUEsSUFBSSxDQUFDLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLENBQW5CO0FBQ0Q7O0FBRUQsVUFBTSxLQUFLLEdBQUcsS0FBSyxRQUFMLEVBQWQ7QUFDQSxVQUFNLFlBQVksR0FBRztBQUNuQixNQUFBLE9BQU8sRUFBRSxFQUNQLEdBQUcsS0FBSyxDQUFDLE9BREY7QUFFUCxTQUFDLFFBQVEsQ0FBQyxFQUFWLEdBQWU7QUFGUjtBQURVLEtBQXJCO0FBTUEsU0FBSyxRQUFMLENBQWMsWUFBZDtBQUNEO0FBRUQ7QUFDRjtBQUNBOzs7QUFDRSxFQUFBLEtBQUssR0FBSTtBQUNQLFNBQUssR0FBTCxDQUFVLHlCQUF3QixLQUFLLElBQUwsQ0FBVSxFQUFHLCtDQUEvQztBQUVBLFNBQUssS0FBTDs7QUFFQTs7QUFFQSxTQUFLLGNBQUwsQ0FBcUIsTUFBRCxJQUFZO0FBQzlCLFdBQUssWUFBTCxDQUFrQixNQUFsQjtBQUNELEtBRkQ7O0FBSUEsUUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsTUFBTSxDQUFDLG1CQUE1QyxFQUFpRTtBQUMvRCxNQUFBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixRQUEzQiw4QkFBcUMsSUFBckM7QUFDQSxNQUFBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixTQUEzQiw4QkFBc0MsSUFBdEM7QUFDRDtBQUNGOztBQUVELEVBQUEsUUFBUSxHQUFJO0FBQ1YsVUFBTTtBQUFFLE1BQUE7QUFBRixRQUFXLEtBQUssUUFBTCxFQUFqQjtBQUVBLFNBQUssUUFBTCxDQUFjO0FBQUUsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYO0FBQVIsS0FBZDtBQUVBLFNBQUssSUFBTCxDQUFVLGFBQVY7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNFLEVBQUEsSUFBSSxDQUFFLE9BQUYsRUFBVyxJQUFJLEdBQUcsTUFBbEIsRUFBMEIsUUFBUSxHQUFHLElBQXJDLEVBQTJDO0FBQzdDLFVBQU0sZ0JBQWdCLEdBQUcsT0FBTyxPQUFQLEtBQW1CLFFBQTVDO0FBRUEsU0FBSyxRQUFMLENBQWM7QUFDWixNQUFBLElBQUksRUFBRSxDQUNKLEdBQUcsS0FBSyxRQUFMLEdBQWdCLElBRGYsRUFFSjtBQUNFLFFBQUEsSUFERjtBQUVFLFFBQUEsT0FBTyxFQUFFLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFYLEdBQXFCLE9BRmhEO0FBR0UsUUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLE9BQVgsR0FBcUI7QUFIaEQsT0FGSTtBQURNLEtBQWQ7QUFXQSxJQUFBLFVBQVUsQ0FBQyxNQUFNLEtBQUssUUFBTCxFQUFQLEVBQXdCLFFBQXhCLENBQVY7QUFFQSxTQUFLLElBQUwsQ0FBVSxjQUFWO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0UsRUFBQSxHQUFHLENBQUUsT0FBRixFQUFXLElBQVgsRUFBaUI7QUFDbEIsVUFBTTtBQUFFLE1BQUE7QUFBRixRQUFhLEtBQUssSUFBeEI7O0FBQ0EsWUFBUSxJQUFSO0FBQ0UsV0FBSyxPQUFMO0FBQWMsUUFBQSxNQUFNLENBQUMsS0FBUCxDQUFhLE9BQWI7QUFBdUI7O0FBQ3JDLFdBQUssU0FBTDtBQUFnQixRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBWjtBQUFzQjs7QUFDdEM7QUFBUyxRQUFBLE1BQU0sQ0FBQyxLQUFQLENBQWEsT0FBYjtBQUF1QjtBQUhsQztBQUtEO0FBRUQ7QUFDRjtBQUNBOzs7QUFDRSxFQUFBLE9BQU8sQ0FBRSxRQUFGLEVBQVk7QUFDakIsU0FBSyxHQUFMLENBQVUsdUNBQXNDLFFBQVMsR0FBekQ7O0FBRUEsUUFBSSxDQUFDLEtBQUssUUFBTCxHQUFnQixjQUFoQixDQUErQixRQUEvQixDQUFMLEVBQStDO0FBQzdDLHNFQUFtQixRQUFuQjs7QUFDQSxhQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsb0JBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsdUNBQU8sSUFBUCwwQkFBdUIsUUFBdkI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBaUNFLGlCQUF5QyxHQUFHLElBQTVDLEVBQWtEO0FBQUUsdUNBQU8sSUFBUCxnQ0FBMEIsR0FBRyxJQUE3QjtBQUFvQzs7QUFReEY7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsRUFBQSxhQUFhLENBQUUsUUFBRixFQUFZLElBQVosRUFBa0I7QUFDN0IsUUFBSSw2QkFBQyxJQUFELDBCQUFpQixRQUFqQixDQUFKLEVBQWdDO0FBQzlCLFdBQUssR0FBTCxDQUFVLDJEQUEwRCxRQUFTLEVBQTdFO0FBQ0E7QUFDRDs7QUFDRCxVQUFNO0FBQUUsTUFBQTtBQUFGLFFBQXFCLEtBQUssUUFBTCxFQUEzQjtBQUNBLFVBQU0sYUFBYSxHQUFHLEVBQUUsR0FBRyxjQUFjLENBQUMsUUFBRCxDQUFuQjtBQUErQixNQUFBLE1BQU0sRUFBRSxFQUFFLEdBQUcsY0FBYyxDQUFDLFFBQUQsQ0FBZCxDQUF5QixNQUE5QjtBQUFzQyxXQUFHO0FBQXpDO0FBQXZDLEtBQXRCO0FBQ0EsU0FBSyxRQUFMLENBQWM7QUFDWixNQUFBLGNBQWMsRUFBRSxFQUFFLEdBQUcsY0FBTDtBQUFxQixTQUFDLFFBQUQsR0FBWTtBQUFqQztBQURKLEtBQWQ7QUFHRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztBQXVHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsRUFBQSxNQUFNLEdBQUk7QUFBQTs7QUFDUixRQUFJLDJCQUFDLHNEQUFjLFFBQWYsYUFBQyxzQkFBd0IsTUFBekIsQ0FBSixFQUFxQztBQUNuQyxXQUFLLEdBQUwsQ0FBUyxtQ0FBVCxFQUE4QyxTQUE5QztBQUNEOztBQUVELFFBQUk7QUFBRSxNQUFBO0FBQUYsUUFBWSxLQUFLLFFBQUwsRUFBaEI7QUFFQSxVQUFNLG9CQUFvQixHQUFHLEtBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsS0FBekIsQ0FBN0I7O0FBRUEsUUFBSSxvQkFBb0IsS0FBSyxLQUE3QixFQUFvQztBQUNsQyxhQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsK0RBQVYsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsUUFBSSxvQkFBb0IsSUFBSSxPQUFPLG9CQUFQLEtBQWdDLFFBQTVELEVBQXNFO0FBQ3BFLE1BQUEsS0FBSyxHQUFHLG9CQUFSLENBRG9FLENBRXBFO0FBQ0E7O0FBQ0EsV0FBSyxRQUFMLENBQWM7QUFDWixRQUFBO0FBRFksT0FBZDtBQUdEOztBQUVELFdBQU8sT0FBTyxDQUFDLE9BQVIsR0FDSixJQURJLENBQ0MsTUFBTTtBQUNWLHdGQUE0QixLQUE1Qjs7QUFDQSw0RkFBOEIsS0FBOUI7QUFDRCxLQUpJLEVBS0osS0FMSSxDQUtHLEdBQUQsSUFBUztBQUNkLDBGQUE2QixHQUE3QjtBQUNELEtBUEksRUFRSixJQVJJLENBUUMsTUFBTTtBQUNWLFlBQU07QUFBRSxRQUFBO0FBQUYsVUFBcUIsS0FBSyxRQUFMLEVBQTNCLENBRFUsQ0FFVjs7QUFDQSxZQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxNQUFQLENBQWMsY0FBZCxFQUE4QixPQUE5QixDQUFzQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQW5ELENBQWhDO0FBRUEsWUFBTSxjQUFjLEdBQUcsRUFBdkI7QUFDQSxNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixFQUFtQixPQUFuQixDQUE0QixNQUFELElBQVk7QUFDckMsY0FBTSxJQUFJLEdBQUcsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFiLENBRHFDLENBRXJDOztBQUNBLFlBQUssQ0FBQyxJQUFJLENBQUMsUUFBTCxDQUFjLGFBQWhCLElBQW1DLHVCQUF1QixDQUFDLE9BQXhCLENBQWdDLE1BQWhDLE1BQTRDLENBQUMsQ0FBcEYsRUFBd0Y7QUFDdEYsVUFBQSxjQUFjLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsRUFBekI7QUFDRDtBQUNGLE9BTkQ7O0FBUUEsWUFBTSxRQUFRLCtCQUFHLElBQUgsZ0NBQXNCLGNBQXRCLENBQWQ7O0FBQ0EseUNBQU8sSUFBUCwwQkFBdUIsUUFBdkI7QUFDRCxLQXhCSSxFQXlCSixLQXpCSSxDQXlCRyxHQUFELElBQVM7QUFDZCwwRkFBNkIsR0FBN0IsRUFBa0M7QUFDaEMsUUFBQSxZQUFZLEVBQUU7QUFEa0IsT0FBbEM7QUFHRCxLQTdCSSxDQUFQO0FBOEJEOztBQXZwRFE7OzZCQW1iVyxJLEVBQU0sS0FBSyxHQUFHLEtBQUssUUFBTCxFLEVBQWlCO0FBQ2pELFFBQU07QUFBRSxJQUFBLFdBQUY7QUFBZSxJQUFBLFdBQWY7QUFBNEIsSUFBQSxnQkFBNUI7QUFBOEMsSUFBQSxnQkFBOUM7QUFBZ0UsSUFBQTtBQUFoRSxNQUFxRixLQUFLLElBQUwsQ0FBVSxZQUFyRzs7QUFFQSxNQUFJLGdCQUFKLEVBQXNCO0FBQ3BCLFFBQUksS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFmLEdBQW1CLGdCQUF2QixFQUF5QztBQUN2QyxZQUFNLElBQUksZ0JBQUosQ0FBc0IsR0FBRSxLQUFLLElBQUwsQ0FBVSxtQkFBVixFQUErQjtBQUFFLFFBQUEsV0FBVyxFQUFFO0FBQWYsT0FBL0IsQ0FBa0UsRUFBMUYsQ0FBTjtBQUNEO0FBQ0Y7O0FBRUQsTUFBSSxnQkFBSixFQUFzQjtBQUNwQixVQUFNLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDLElBQWpCLENBQXVCLElBQUQsSUFBVTtBQUN4RDtBQUNBLFVBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLElBQW9CLENBQUMsQ0FBekIsRUFBNEI7QUFDMUIsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFWLEVBQWdCLE9BQU8sS0FBUDtBQUNoQixlQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FBa0IsT0FBbEIsRUFBMkIsRUFBM0IsQ0FBRCxFQUFpQyxJQUFqQyxDQUFaO0FBQ0QsT0FMdUQsQ0FPeEQ7OztBQUNBLFVBQUksSUFBSSxDQUFDLENBQUQsQ0FBSixLQUFZLEdBQVosSUFBbUIsSUFBSSxDQUFDLFNBQTVCLEVBQXVDO0FBQ3JDLGVBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxXQUFmLE9BQWlDLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFlLFdBQWYsRUFBeEM7QUFDRDs7QUFDRCxhQUFPLEtBQVA7QUFDRCxLQVp5QixDQUExQjs7QUFjQSxRQUFJLENBQUMsaUJBQUwsRUFBd0I7QUFDdEIsWUFBTSxzQkFBc0IsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixJQUF0QixDQUEvQjtBQUNBLFlBQU0sSUFBSSxnQkFBSixDQUFxQixLQUFLLElBQUwsQ0FBVSwyQkFBVixFQUF1QztBQUFFLFFBQUEsS0FBSyxFQUFFO0FBQVQsT0FBdkMsQ0FBckIsQ0FBTjtBQUNEO0FBQ0YsR0E1QmdELENBOEJqRDs7O0FBQ0EsTUFBSSxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsSUFBTCxJQUFhLElBQXJDLEVBQTJDO0FBQ3pDLFFBQUksY0FBYyxHQUFHLENBQXJCO0FBQ0EsSUFBQSxjQUFjLElBQUksSUFBSSxDQUFDLElBQXZCO0FBQ0EsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFlLENBQUQsSUFBTztBQUNuQixNQUFBLGNBQWMsSUFBSSxDQUFDLENBQUMsSUFBcEI7QUFDRCxLQUZEOztBQUdBLFFBQUksY0FBYyxHQUFHLGdCQUFyQixFQUF1QztBQUNyQyxZQUFNLElBQUksZ0JBQUosQ0FBcUIsS0FBSyxJQUFMLENBQVUsYUFBVixFQUF5QjtBQUNsRCxRQUFBLElBQUksRUFBRSxhQUFhLENBQUMsZ0JBQUQsQ0FEK0I7QUFFbEQsUUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBRnVDLE9BQXpCLENBQXJCLENBQU47QUFJRDtBQUNGLEdBM0NnRCxDQTZDakQ7OztBQUNBLE1BQUksV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFMLElBQWEsSUFBaEMsRUFBc0M7QUFDcEMsUUFBSSxJQUFJLENBQUMsSUFBTCxHQUFZLFdBQWhCLEVBQTZCO0FBQzNCLFlBQU0sSUFBSSxnQkFBSixDQUFxQixLQUFLLElBQUwsQ0FBVSxhQUFWLEVBQXlCO0FBQ2xELFFBQUEsSUFBSSxFQUFFLGFBQWEsQ0FBQyxXQUFELENBRCtCO0FBRWxELFFBQUEsSUFBSSxFQUFFLElBQUksQ0FBQztBQUZ1QyxPQUF6QixDQUFyQixDQUFOO0FBSUQ7QUFDRixHQXJEZ0QsQ0F1RGpEOzs7QUFDQSxNQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBTCxJQUFhLElBQWhDLEVBQXNDO0FBQ3BDLFFBQUksSUFBSSxDQUFDLElBQUwsR0FBWSxXQUFoQixFQUE2QjtBQUMzQixZQUFNLElBQUksZ0JBQUosQ0FBcUIsS0FBSyxJQUFMLENBQVUsY0FBVixFQUEwQjtBQUNuRCxRQUFBLElBQUksRUFBRSxhQUFhLENBQUMsV0FBRDtBQURnQyxPQUExQixDQUFyQixDQUFOO0FBR0Q7QUFDRjtBQUNGOztpQ0FPdUIsSyxFQUFPO0FBQzdCLFFBQU07QUFBRSxJQUFBO0FBQUYsTUFBdUIsS0FBSyxJQUFMLENBQVUsWUFBdkM7O0FBQ0EsTUFBSSxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosRUFBbUIsTUFBbkIsR0FBNEIsZ0JBQWhDLEVBQWtEO0FBQ2hELFVBQU0sSUFBSSxnQkFBSixDQUFzQixHQUFFLEtBQUssSUFBTCxDQUFVLHlCQUFWLEVBQXFDO0FBQUUsTUFBQSxXQUFXLEVBQUU7QUFBZixLQUFyQyxDQUF3RSxFQUFoRyxDQUFOO0FBQ0Q7QUFDRjs7bUNBTXlCLEssRUFBTztBQUMvQixRQUFNO0FBQUUsSUFBQTtBQUFGLE1BQXlCLEtBQUssSUFBTCxDQUFVLFlBQXpDO0FBQ0EsUUFBTTtBQUFFLElBQUE7QUFBRixNQUFxQixNQUFNLENBQUMsU0FBbEM7QUFFQSxRQUFNLE1BQU0sR0FBRyxFQUFmOztBQUNBLE9BQUssTUFBTSxNQUFYLElBQXFCLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixDQUFyQixFQUF5QztBQUN2QyxVQUFNLElBQUksR0FBRyxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQWI7O0FBQ0EsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxNQUF2QyxFQUErQyxDQUFDLEVBQWhELEVBQW9EO0FBQ2xELFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBekIsRUFBK0Isa0JBQWtCLENBQUMsQ0FBRCxDQUFqRCxDQUFELElBQTBELElBQUksQ0FBQyxJQUFMLENBQVUsa0JBQWtCLENBQUMsQ0FBRCxDQUE1QixNQUFxQyxFQUFuRyxFQUF1RztBQUNyRyxjQUFNLEdBQUcsR0FBRyxJQUFJLGdCQUFKLENBQXNCLEdBQUUsS0FBSyxJQUFMLENBQVUsZ0NBQVYsRUFBNEM7QUFBRSxVQUFBLFFBQVEsRUFBRSxJQUFJLENBQUM7QUFBakIsU0FBNUMsQ0FBcUUsRUFBN0YsQ0FBWjtBQUNBLFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaOztBQUNBLDRGQUE2QixHQUE3QixFQUFrQztBQUFFLFVBQUEsSUFBRjtBQUFRLFVBQUEsWUFBWSxFQUFFLEtBQXRCO0FBQTZCLFVBQUEsUUFBUSxFQUFFO0FBQXZDLFNBQWxDO0FBQ0Q7QUFDRjtBQUNGOztBQUVELE1BQUksTUFBTSxDQUFDLE1BQVgsRUFBbUI7QUFDakIsVUFBTSxJQUFJLHlCQUFKLENBQStCLEdBQUUsS0FBSyxJQUFMLENBQVUsMEJBQVYsQ0FBc0MsRUFBdkUsRUFBMEUsTUFBMUUsQ0FBTjtBQUNEO0FBQ0Y7O2tDQWF3QixHLEVBQUs7QUFBRSxFQUFBLFlBQVksR0FBRyxJQUFqQjtBQUF1QixFQUFBLElBQUksR0FBRyxJQUE5QjtBQUFvQyxFQUFBLFFBQVEsR0FBRztBQUEvQyxJQUF3RCxFLEVBQUk7QUFDeEYsUUFBTSxPQUFPLEdBQUcsT0FBTyxHQUFQLEtBQWUsUUFBZixHQUEwQixHQUFHLENBQUMsT0FBOUIsR0FBd0MsR0FBeEQ7QUFDQSxRQUFNLE9BQU8sR0FBSSxPQUFPLEdBQVAsS0FBZSxRQUFmLElBQTJCLEdBQUcsQ0FBQyxPQUFoQyxHQUEyQyxHQUFHLENBQUMsT0FBL0MsR0FBeUQsRUFBekUsQ0FGd0YsQ0FJeEY7QUFDQTs7QUFDQSxNQUFJLHFCQUFxQixHQUFHLE9BQTVCOztBQUNBLE1BQUksT0FBSixFQUFhO0FBQ1gsSUFBQSxxQkFBcUIsSUFBSyxJQUFHLE9BQVEsRUFBckM7QUFDRDs7QUFDRCxNQUFJLEdBQUcsQ0FBQyxhQUFSLEVBQXVCO0FBQ3JCLFNBQUssR0FBTCxDQUFTLHFCQUFUO0FBQ0EsU0FBSyxJQUFMLENBQVUsb0JBQVYsRUFBZ0MsSUFBaEMsRUFBc0MsR0FBdEM7QUFDRCxHQUhELE1BR087QUFDTCxTQUFLLEdBQUwsQ0FBUyxxQkFBVCxFQUFnQyxPQUFoQztBQUNELEdBZnVGLENBaUJ4RjtBQUNBOzs7QUFDQSxNQUFJLFlBQUosRUFBa0I7QUFDaEIsU0FBSyxJQUFMLENBQVU7QUFBRSxNQUFBLE9BQUY7QUFBVyxNQUFBO0FBQVgsS0FBVixFQUFnQyxPQUFoQyxFQUF5QyxLQUFLLElBQUwsQ0FBVSxXQUFuRDtBQUNEOztBQUVELE1BQUksUUFBSixFQUFjO0FBQ1osVUFBTyxPQUFPLEdBQVAsS0FBZSxRQUFmLEdBQTBCLEdBQTFCLEdBQWdDLElBQUksS0FBSixDQUFVLEdBQVYsQ0FBdkM7QUFDRDtBQUNGOztrQ0FFd0IsSSxFQUFNO0FBQzdCLFFBQU07QUFBRSxJQUFBO0FBQUYsTUFBcUIsS0FBSyxRQUFMLEVBQTNCOztBQUVBLE1BQUksY0FBYyxLQUFLLEtBQXZCLEVBQThCO0FBQzVCLHdGQUE2QixJQUFJLGdCQUFKLENBQXFCLEtBQUssSUFBTCxDQUFVLG9CQUFWLENBQXJCLENBQTdCLEVBQW9GO0FBQUUsTUFBQTtBQUFGLEtBQXBGO0FBQ0Q7QUFDRjs7eUNBbUIrQixLLEVBQU8sYyxFQUFnQjtBQUNyRCxRQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsY0FBRCxDQUE1QjtBQUNBLFFBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFELEVBQVcsY0FBWCxDQUE1QjtBQUNBLFFBQU0sYUFBYSxHQUFHLHVCQUF1QixDQUFDLFFBQUQsQ0FBdkIsQ0FBa0MsU0FBeEQ7QUFDQSxRQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLFFBQWhCLENBQXhCO0FBQ0EsUUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEVBQzVCLEdBQUcsY0FEeUI7QUFFNUIsSUFBQSxJQUFJLEVBQUU7QUFGc0IsR0FBRCxDQUE3Qjs7QUFLQSxNQUFJLEtBQUssd0JBQUwsQ0FBOEIsTUFBOUIsQ0FBSixFQUEyQztBQUN6QyxVQUFNLEtBQUssR0FBRyxJQUFJLGdCQUFKLENBQXFCLEtBQUssSUFBTCxDQUFVLGNBQVYsRUFBMEI7QUFBRSxNQUFBO0FBQUYsS0FBMUIsQ0FBckIsQ0FBZDs7QUFDQSx3RkFBNkIsS0FBN0IsRUFBb0M7QUFBRSxNQUFBLElBQUksRUFBRTtBQUFSLEtBQXBDO0FBQ0Q7O0FBRUQsUUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLElBQWYsSUFBdUIsRUFBcEM7QUFDQSxFQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksUUFBWjtBQUNBLEVBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxRQUFaLENBakJxRCxDQW1CckQ7O0FBQ0EsUUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsY0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBcEMsSUFBNEMsY0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBaEUsR0FBdUUsSUFBcEY7QUFFQSxNQUFJLE9BQU8sR0FBRztBQUNaLElBQUEsTUFBTSxFQUFFLGNBQWMsQ0FBQyxNQUFmLElBQXlCLEVBRHJCO0FBRVosSUFBQSxFQUFFLEVBQUUsTUFGUTtBQUdaLElBQUEsSUFBSSxFQUFFLFFBSE07QUFJWixJQUFBLFNBQVMsRUFBRSxhQUFhLElBQUksRUFKaEI7QUFLWixJQUFBLElBQUksRUFBRSxFQUNKLEdBQUcsS0FBSyxRQUFMLEdBQWdCLElBRGY7QUFFSixTQUFHO0FBRkMsS0FMTTtBQVNaLElBQUEsSUFBSSxFQUFFLFFBVE07QUFVWixJQUFBLElBQUksRUFBRSxjQUFjLENBQUMsSUFWVDtBQVdaLElBQUEsUUFBUSxFQUFFO0FBQ1IsTUFBQSxVQUFVLEVBQUUsQ0FESjtBQUVSLE1BQUEsYUFBYSxFQUFFLENBRlA7QUFHUixNQUFBLFVBQVUsRUFBRSxJQUhKO0FBSVIsTUFBQSxjQUFjLEVBQUUsS0FKUjtBQUtSLE1BQUEsYUFBYSxFQUFFO0FBTFAsS0FYRTtBQWtCWixJQUFBLElBbEJZO0FBbUJaLElBQUEsUUFuQlk7QUFvQlosSUFBQSxNQUFNLEVBQUUsY0FBYyxDQUFDLE1BQWYsSUFBeUIsRUFwQnJCO0FBcUJaLElBQUEsT0FBTyxFQUFFLGNBQWMsQ0FBQztBQXJCWixHQUFkO0FBd0JBLFFBQU0sdUJBQXVCLEdBQUcsS0FBSyxJQUFMLENBQVUsaUJBQVYsQ0FBNEIsT0FBNUIsRUFBcUMsS0FBckMsQ0FBaEM7O0FBRUEsTUFBSSx1QkFBdUIsS0FBSyxLQUFoQyxFQUF1QztBQUNyQztBQUNBLHdGQUE2QixJQUFJLGdCQUFKLENBQXFCLCtEQUFyQixDQUE3QixFQUFvSDtBQUFFLE1BQUEsWUFBWSxFQUFFLEtBQWhCO0FBQXVCLE1BQUE7QUFBdkIsS0FBcEg7QUFDRCxHQUhELE1BR08sSUFBSSxPQUFPLHVCQUFQLEtBQW1DLFFBQW5DLElBQStDLHVCQUF1QixLQUFLLElBQS9FLEVBQXFGO0FBQzFGLElBQUEsT0FBTyxHQUFHLHVCQUFWO0FBQ0Q7O0FBRUQsTUFBSTtBQUNGLFVBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixFQUFtQixHQUFuQixDQUF1QixDQUFDLElBQUksS0FBSyxDQUFDLENBQUQsQ0FBakMsQ0FBbkI7O0FBQ0EsOEVBQXdCLE9BQXhCLEVBQWlDLFVBQWpDO0FBQ0QsR0FIRCxDQUdFLE9BQU8sR0FBUCxFQUFZO0FBQ1osd0ZBQTZCLEdBQTdCLEVBQWtDO0FBQUUsTUFBQSxJQUFJLEVBQUU7QUFBUixLQUFsQztBQUNEOztBQUVELFNBQU8sT0FBUDtBQUNEOztnQ0FHc0I7QUFDckIsTUFBSSxLQUFLLElBQUwsQ0FBVSxXQUFWLElBQXlCLENBQUMsS0FBSyxvQkFBbkMsRUFBeUQ7QUFDdkQsU0FBSyxvQkFBTCxHQUE0QixVQUFVLENBQUMsTUFBTTtBQUMzQyxXQUFLLG9CQUFMLEdBQTRCLElBQTVCO0FBQ0EsV0FBSyxNQUFMLEdBQWMsS0FBZCxDQUFxQixHQUFELElBQVM7QUFDM0IsWUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFULEVBQXdCO0FBQ3RCLGVBQUssR0FBTCxDQUFTLEdBQUcsQ0FBQyxLQUFKLElBQWEsR0FBRyxDQUFDLE9BQWpCLElBQTRCLEdBQXJDO0FBQ0Q7QUFDRixPQUpEO0FBS0QsS0FQcUMsRUFPbkMsQ0FQbUMsQ0FBdEM7QUFRRDtBQUNGOzswQkFnWmdCO0FBQ2Y7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJLFFBQU0sWUFBWSxHQUFHLENBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxRQUFkLEtBQTJCO0FBQzlDLFFBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFOLElBQWlCLGVBQWhDOztBQUNBLFFBQUksS0FBSyxDQUFDLE9BQVYsRUFBbUI7QUFDakIsTUFBQSxRQUFRLElBQUssSUFBRyxLQUFLLENBQUMsT0FBUSxFQUE5QjtBQUNEOztBQUVELFNBQUssUUFBTCxDQUFjO0FBQUUsTUFBQSxLQUFLLEVBQUU7QUFBVCxLQUFkOztBQUVBLFFBQUksSUFBSSxJQUFJLElBQVIsSUFBZ0IsSUFBSSxDQUFDLEVBQUwsSUFBVyxLQUFLLFFBQUwsR0FBZ0IsS0FBL0MsRUFBc0Q7QUFDcEQsV0FBSyxZQUFMLENBQWtCLElBQUksQ0FBQyxFQUF2QixFQUEyQjtBQUN6QixRQUFBLEtBQUssRUFBRSxRQURrQjtBQUV6QixRQUFBO0FBRnlCLE9BQTNCO0FBSUQ7QUFDRixHQWREOztBQWdCQSxPQUFLLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFlBQWpCO0FBRUEsT0FBSyxFQUFMLENBQVEsY0FBUixFQUF3QixDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsUUFBZCxLQUEyQjtBQUNqRCxJQUFBLFlBQVksQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLFFBQWQsQ0FBWjs7QUFFQSxRQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixLQUFLLENBQUMsT0FBdkMsRUFBZ0Q7QUFDOUMsWUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFKLENBQVUsS0FBSyxDQUFDLE9BQWhCLENBQWpCO0FBQ0EsTUFBQSxRQUFRLENBQUMsT0FBVCxHQUFtQixLQUFLLENBQUMsT0FBekI7O0FBQ0EsVUFBSSxLQUFLLENBQUMsT0FBVixFQUFtQjtBQUNqQixRQUFBLFFBQVEsQ0FBQyxPQUFULElBQXFCLElBQUcsS0FBSyxDQUFDLE9BQVEsRUFBdEM7QUFDRDs7QUFDRCxNQUFBLFFBQVEsQ0FBQyxPQUFULEdBQW1CLEtBQUssSUFBTCxDQUFVLGdCQUFWLEVBQTRCO0FBQUUsUUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQWIsT0FBNUIsQ0FBbkI7O0FBQ0EsMEZBQTZCLFFBQTdCLEVBQXVDO0FBQ3JDLFFBQUEsUUFBUSxFQUFFO0FBRDJCLE9BQXZDO0FBR0QsS0FWRCxNQVVPO0FBQ0wsMEZBQTZCLEtBQTdCLEVBQW9DO0FBQ2xDLFFBQUEsUUFBUSxFQUFFO0FBRHdCLE9BQXBDO0FBR0Q7QUFDRixHQWxCRDtBQW9CQSxPQUFLLEVBQUwsQ0FBUSxRQUFSLEVBQWtCLE1BQU07QUFDdEIsU0FBSyxRQUFMLENBQWM7QUFBRSxNQUFBLEtBQUssRUFBRTtBQUFULEtBQWQ7QUFDRCxHQUZEO0FBSUEsT0FBSyxFQUFMLENBQVEsZ0JBQVIsRUFBMkIsSUFBRCxJQUFVO0FBQ2xDLFFBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxJQUFJLENBQUMsRUFBbEIsQ0FBTCxFQUE0QjtBQUMxQixXQUFLLEdBQUwsQ0FBVSwwREFBeUQsSUFBSSxDQUFDLEVBQUcsRUFBM0U7QUFDQTtBQUNEOztBQUNELFNBQUssWUFBTCxDQUFrQixJQUFJLENBQUMsRUFBdkIsRUFBMkI7QUFDekIsTUFBQSxRQUFRLEVBQUU7QUFDUixRQUFBLGFBQWEsRUFBRSxJQUFJLENBQUMsR0FBTCxFQURQO0FBRVIsUUFBQSxjQUFjLEVBQUUsS0FGUjtBQUdSLFFBQUEsVUFBVSxFQUFFLENBSEo7QUFJUixRQUFBLGFBQWEsRUFBRSxDQUpQO0FBS1IsUUFBQSxVQUFVLEVBQUUsSUFBSSxDQUFDO0FBTFQ7QUFEZSxLQUEzQjtBQVNELEdBZEQ7QUFnQkEsT0FBSyxFQUFMLENBQVEsaUJBQVIsRUFBMkIsS0FBSyxpQkFBaEM7QUFFQSxPQUFLLEVBQUwsQ0FBUSxnQkFBUixFQUEwQixDQUFDLElBQUQsRUFBTyxVQUFQLEtBQXNCO0FBQzlDLFFBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxJQUFJLENBQUMsRUFBbEIsQ0FBTCxFQUE0QjtBQUMxQixXQUFLLEdBQUwsQ0FBVSwwREFBeUQsSUFBSSxDQUFDLEVBQUcsRUFBM0U7QUFDQTtBQUNEOztBQUVELFVBQU0sZUFBZSxHQUFHLEtBQUssT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixFQUFzQixRQUE5QztBQUNBLFNBQUssWUFBTCxDQUFrQixJQUFJLENBQUMsRUFBdkIsRUFBMkI7QUFDekIsTUFBQSxRQUFRLEVBQUUsRUFDUixHQUFHLGVBREs7QUFFUixRQUFBLFdBQVcsRUFBRSxvRUFBcUIsSUFBckIsR0FBNEIsQ0FBNUIsR0FBZ0M7QUFDM0MsVUFBQSxJQUFJLEVBQUU7QUFEcUMsU0FBaEMsR0FFVCxJQUpJO0FBS1IsUUFBQSxjQUFjLEVBQUUsSUFMUjtBQU1SLFFBQUEsVUFBVSxFQUFFLEdBTko7QUFPUixRQUFBLGFBQWEsRUFBRSxlQUFlLENBQUM7QUFQdkIsT0FEZTtBQVV6QixNQUFBLFFBQVEsRUFBRSxVQVZlO0FBV3pCLE1BQUEsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQVhHO0FBWXpCLE1BQUEsUUFBUSxFQUFFO0FBWmUsS0FBM0IsRUFQOEMsQ0FzQjlDO0FBQ0E7O0FBQ0EsUUFBSSxJQUFJLENBQUMsSUFBTCxJQUFhLElBQWpCLEVBQXVCO0FBQ3JCLFdBQUssWUFBTCxDQUFrQixJQUFJLENBQUMsRUFBdkIsRUFBMkI7QUFDekIsUUFBQSxJQUFJLEVBQUUsVUFBVSxDQUFDLGFBQVgsSUFBNEIsZUFBZSxDQUFDO0FBRHpCLE9BQTNCO0FBR0Q7O0FBRUQsU0FBSyxzQkFBTDtBQUNELEdBL0JEO0FBaUNBLE9BQUssRUFBTCxDQUFRLHFCQUFSLEVBQStCLENBQUMsSUFBRCxFQUFPLFFBQVAsS0FBb0I7QUFDakQsUUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixDQUFMLEVBQTRCO0FBQzFCLFdBQUssR0FBTCxDQUFVLDBEQUF5RCxJQUFJLENBQUMsRUFBRyxFQUEzRTtBQUNBO0FBQ0Q7O0FBQ0QsU0FBSyxZQUFMLENBQWtCLElBQUksQ0FBQyxFQUF2QixFQUEyQjtBQUN6QixNQUFBLFFBQVEsRUFBRSxFQUFFLEdBQUcsS0FBSyxPQUFMLENBQWEsSUFBSSxDQUFDLEVBQWxCLEVBQXNCLFFBQTNCO0FBQXFDLFFBQUEsVUFBVSxFQUFFO0FBQWpEO0FBRGUsS0FBM0I7QUFHRCxHQVJEO0FBVUEsT0FBSyxFQUFMLENBQVEscUJBQVIsRUFBZ0MsSUFBRCxJQUFVO0FBQ3ZDLFFBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxJQUFJLENBQUMsRUFBbEIsQ0FBTCxFQUE0QjtBQUMxQixXQUFLLEdBQUwsQ0FBVSwwREFBeUQsSUFBSSxDQUFDLEVBQUcsRUFBM0U7QUFDQTtBQUNEOztBQUNELFVBQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxLQUFLLFFBQUwsR0FBZ0I7QUFBckIsS0FBZDtBQUNBLElBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFOLENBQUwsR0FBaUIsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBTixDQUFWO0FBQXFCLE1BQUEsUUFBUSxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQU4sQ0FBTCxDQUFlO0FBQXBCO0FBQS9CLEtBQWpCO0FBQ0EsV0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQU4sQ0FBTCxDQUFlLFFBQWYsQ0FBd0IsVUFBL0I7QUFFQSxTQUFLLFFBQUwsQ0FBYztBQUFFLE1BQUE7QUFBRixLQUFkO0FBQ0QsR0FWRDtBQVlBLE9BQUssRUFBTCxDQUFRLHNCQUFSLEVBQWdDLENBQUMsSUFBRCxFQUFPLFFBQVAsS0FBb0I7QUFDbEQsUUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixDQUFMLEVBQTRCO0FBQzFCLFdBQUssR0FBTCxDQUFVLDBEQUF5RCxJQUFJLENBQUMsRUFBRyxFQUEzRTtBQUNBO0FBQ0Q7O0FBQ0QsU0FBSyxZQUFMLENBQWtCLElBQUksQ0FBQyxFQUF2QixFQUEyQjtBQUN6QixNQUFBLFFBQVEsRUFBRSxFQUFFLEdBQUcsS0FBSyxRQUFMLEdBQWdCLEtBQWhCLENBQXNCLElBQUksQ0FBQyxFQUEzQixFQUErQixRQUFwQztBQUE4QyxRQUFBLFdBQVcsRUFBRTtBQUEzRDtBQURlLEtBQTNCO0FBR0QsR0FSRDtBQVVBLE9BQUssRUFBTCxDQUFRLHNCQUFSLEVBQWlDLElBQUQsSUFBVTtBQUN4QyxRQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsSUFBSSxDQUFDLEVBQWxCLENBQUwsRUFBNEI7QUFDMUIsV0FBSyxHQUFMLENBQVUsMERBQXlELElBQUksQ0FBQyxFQUFHLEVBQTNFO0FBQ0E7QUFDRDs7QUFDRCxVQUFNLEtBQUssR0FBRyxFQUNaLEdBQUcsS0FBSyxRQUFMLEdBQWdCO0FBRFAsS0FBZDtBQUdBLElBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFOLENBQUwsR0FBaUIsRUFDZixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBTixDQURPO0FBRWYsTUFBQSxRQUFRLEVBQUUsRUFDUixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBTixDQUFMLENBQWU7QUFEVjtBQUZLLEtBQWpCO0FBTUEsV0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQU4sQ0FBTCxDQUFlLFFBQWYsQ0FBd0IsV0FBL0I7QUFFQSxTQUFLLFFBQUwsQ0FBYztBQUFFLE1BQUE7QUFBRixLQUFkO0FBQ0QsR0FqQkQ7QUFtQkEsT0FBSyxFQUFMLENBQVEsVUFBUixFQUFvQixNQUFNO0FBQ3hCO0FBQ0EsU0FBSyxzQkFBTDtBQUNELEdBSEQsRUF0SmUsQ0EySmY7O0FBQ0EsTUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsTUFBTSxDQUFDLGdCQUE1QyxFQUE4RDtBQUM1RCxJQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixRQUF4Qiw4QkFBa0MsSUFBbEM7QUFDQSxJQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixTQUF4Qiw4QkFBbUMsSUFBbkM7QUFDQSxJQUFBLFVBQVUsNkJBQUMsSUFBRCw2Q0FBMkIsSUFBM0IsQ0FBVjtBQUNEO0FBQ0Y7O3dCQWtPYyxPLEVBQVMsSUFBSSxHQUFHLEUsRUFBSTtBQUNqQztBQUNBLFFBQU07QUFBRSxJQUFBLG1CQUFtQixHQUFHO0FBQXhCLE1BQWtDLElBQXhDO0FBRUEsUUFBTTtBQUFFLElBQUEsY0FBRjtBQUFrQixJQUFBO0FBQWxCLE1BQXFDLEtBQUssUUFBTCxFQUEzQzs7QUFDQSxNQUFJLENBQUMsY0FBRCxJQUFtQixDQUFDLG1CQUF4QixFQUE2QztBQUMzQyxVQUFNLElBQUksS0FBSixDQUFVLGdEQUFWLENBQU47QUFDRDs7QUFFRCxRQUFNLFFBQVEsR0FBRyxNQUFNLEVBQXZCO0FBRUEsT0FBSyxJQUFMLENBQVUsUUFBVixFQUFvQjtBQUNsQixJQUFBLEVBQUUsRUFBRSxRQURjO0FBRWxCLElBQUE7QUFGa0IsR0FBcEI7QUFLQSxPQUFLLFFBQUwsQ0FBYztBQUNaLElBQUEsY0FBYyxFQUFFLEtBQUssSUFBTCxDQUFVLDBCQUFWLEtBQXlDLEtBQXpDLElBQWtELEtBQUssSUFBTCxDQUFVLG9CQUFWLEtBQW1DLEtBRHpGO0FBR1osSUFBQSxjQUFjLEVBQUUsRUFDZCxHQUFHLGNBRFc7QUFFZCxPQUFDLFFBQUQsR0FBWTtBQUNWLFFBQUEsT0FEVTtBQUVWLFFBQUEsSUFBSSxFQUFFLENBRkk7QUFHVixRQUFBLE1BQU0sRUFBRTtBQUhFO0FBRkU7QUFISixHQUFkO0FBYUEsU0FBTyxRQUFQO0FBQ0Q7O3FCQUlXLFEsRUFBVTtBQUNwQixRQUFNO0FBQUUsSUFBQTtBQUFGLE1BQXFCLEtBQUssUUFBTCxFQUEzQjtBQUVBLFNBQU8sY0FBYyxDQUFDLFFBQUQsQ0FBckI7QUFDRDs7d0JBeUJjLFEsRUFBVTtBQUN2QixRQUFNLGNBQWMsR0FBRyxFQUFFLEdBQUcsS0FBSyxRQUFMLEdBQWdCO0FBQXJCLEdBQXZCO0FBQ0EsU0FBTyxjQUFjLENBQUMsUUFBRCxDQUFyQjtBQUVBLE9BQUssUUFBTCxDQUFjO0FBQ1osSUFBQTtBQURZLEdBQWQ7QUFHRDs7MkJBT2lCLFEsRUFBVTtBQUMxQixNQUFJO0FBQUUsSUFBQTtBQUFGLE1BQXFCLEtBQUssUUFBTCxFQUF6QjtBQUNBLE1BQUksYUFBYSxHQUFHLGNBQWMsQ0FBQyxRQUFELENBQWxDO0FBQ0EsUUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLElBQWQsSUFBc0IsQ0FBMUM7QUFFQSxRQUFNLEtBQUssR0FBRyxDQUNaLCtCQUFHLElBQUgsaUNBRFksRUFFWiwrQkFBRyxJQUFILHlCQUZZLEVBR1osK0JBQUcsSUFBSCxtQ0FIWSxDQUFkOztBQUtBLE1BQUk7QUFDRixTQUFLLElBQUksSUFBSSxHQUFHLFdBQWhCLEVBQTZCLElBQUksR0FBRyxLQUFLLENBQUMsTUFBMUMsRUFBa0QsSUFBSSxFQUF0RCxFQUEwRDtBQUN4RCxVQUFJLENBQUMsYUFBTCxFQUFvQjtBQUNsQjtBQUNEOztBQUNELFlBQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFELENBQWhCO0FBRUEsWUFBTSxhQUFhLEdBQUcsRUFDcEIsR0FBRyxhQURpQjtBQUVwQixRQUFBO0FBRm9CLE9BQXRCO0FBS0EsV0FBSyxRQUFMLENBQWM7QUFDWixRQUFBLGNBQWMsRUFBRSxFQUNkLEdBQUcsY0FEVztBQUVkLFdBQUMsUUFBRCxHQUFZO0FBRkU7QUFESixPQUFkLEVBWHdELENBa0J4RDtBQUNBOztBQUNBLFlBQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFmLEVBQXdCLFFBQXhCLENBQVIsQ0FwQndELENBc0J4RDs7QUFDQSxNQUFBLGNBQWMsR0FBRyxLQUFLLFFBQUwsR0FBZ0IsY0FBakM7QUFDQSxNQUFBLGFBQWEsR0FBRyxjQUFjLENBQUMsUUFBRCxDQUE5QjtBQUNEO0FBQ0YsR0EzQkQsQ0EyQkUsT0FBTyxHQUFQLEVBQVk7QUFDWixTQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEdBQW5COztBQUNBLG9FQUFtQixRQUFuQjs7QUFDQSxVQUFNLEdBQU47QUFDRCxHQXpDeUIsQ0EyQzFCOzs7QUFDQSxNQUFJLGFBQUosRUFBbUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFBLGFBQWEsQ0FBQyxPQUFkLENBQXNCLE9BQXRCLENBQStCLE1BQUQsSUFBWTtBQUN4QyxZQUFNLElBQUksR0FBRyxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQWI7O0FBQ0EsVUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQUwsQ0FBYyxXQUExQixFQUF1QztBQUNyQyxhQUFLLElBQUwsQ0FBVSxzQkFBVixFQUFrQyxJQUFsQztBQUNEO0FBQ0YsS0FMRDtBQU9BLFVBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxPQUFkLENBQXNCLEdBQXRCLENBQTJCLE1BQUQsSUFBWSxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQXRDLENBQWQ7QUFDQSxVQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTixDQUFjLElBQUQsSUFBVSxDQUFDLElBQUksQ0FBQyxLQUE3QixDQUFuQjtBQUNBLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWMsSUFBRCxJQUFVLElBQUksQ0FBQyxLQUE1QixDQUFmO0FBQ0EsVUFBTSxLQUFLLGFBQUwsQ0FBbUIsUUFBbkIsRUFBNkI7QUFBRSxNQUFBLFVBQUY7QUFBYyxNQUFBLE1BQWQ7QUFBc0IsTUFBQTtBQUF0QixLQUE3QixDQUFOLENBckJpQixDQXVCakI7O0FBQ0EsSUFBQSxjQUFjLEdBQUcsS0FBSyxRQUFMLEdBQWdCLGNBQWpDO0FBQ0EsSUFBQSxhQUFhLEdBQUcsY0FBYyxDQUFDLFFBQUQsQ0FBOUI7QUFDRCxHQXRFeUIsQ0F1RTFCO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFJLE1BQUo7O0FBQ0EsTUFBSSxhQUFKLEVBQW1CO0FBQ2pCLElBQUEsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUF2QjtBQUNBLFNBQUssSUFBTCxDQUFVLFVBQVYsRUFBc0IsTUFBdEI7O0FBRUEsb0VBQW1CLFFBQW5CO0FBQ0Q7O0FBQ0QsTUFBSSxNQUFNLElBQUksSUFBZCxFQUFvQjtBQUNsQixTQUFLLEdBQUwsQ0FBVSwyREFBMEQsUUFBUyxFQUE3RTtBQUNEOztBQUNELFNBQU8sTUFBUDtBQUNEOztBQTVsREcsSSxDQUVHLE87QUF3cERULE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQWpCOzs7OztBQ3hzREEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxXQUFULENBQXNCLFFBQXRCLEVBQWdDLGNBQWhDLEVBQWdEO0FBQy9ELE1BQUksY0FBYyxDQUFDLElBQW5CLEVBQXlCO0FBQ3ZCLFdBQU8sY0FBYyxDQUFDLElBQXRCO0FBQ0Q7O0FBRUQsTUFBSSxRQUFRLENBQUMsS0FBVCxDQUFlLEdBQWYsRUFBb0IsQ0FBcEIsTUFBMkIsT0FBL0IsRUFBd0M7QUFDdEMsV0FBUSxHQUFFLFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixFQUFvQixDQUFwQixDQUF1QixJQUFHLFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixFQUFvQixDQUFwQixDQUF1QixFQUEzRDtBQUNEOztBQUVELFNBQU8sUUFBUDtBQUNELENBVkQ7OztBQ0FBOztBQUVBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQXBCOztBQUNBLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQTFCOztBQUNBLE1BQU07QUFBRSxFQUFBO0FBQUYsSUFBa0IsT0FBTyxDQUFDLFdBQUQsQ0FBL0I7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBakI7QUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWYsR0FBc0IsSUFBdEI7QUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLFFBQWYsR0FBMEIsUUFBMUI7QUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsR0FBNEIsVUFBNUI7QUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLFdBQWYsR0FBNkIsV0FBN0I7Ozs7O0FDWEE7QUFDQSxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsOEJBQUQsQ0FBNUIsQyxDQUVBO0FBQ0E7OztBQUNBLE1BQU0sZ0JBQWdCLEdBQUc7QUFDdkIsRUFBQSxLQUFLLEVBQUUsTUFBTSxDQUFFLENBRFE7QUFFdkIsRUFBQSxJQUFJLEVBQUUsTUFBTSxDQUFFLENBRlM7QUFHdkIsRUFBQSxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUosS0FBYSxPQUFPLENBQUMsS0FBUixDQUFlLFdBQVUsWUFBWSxFQUFHLEdBQXhDLEVBQTRDLEdBQUcsSUFBL0M7QUFIRyxDQUF6QixDLENBTUE7QUFDQTs7QUFDQSxNQUFNLFdBQVcsR0FBRztBQUNsQixFQUFBLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSixLQUFhLE9BQU8sQ0FBQyxLQUFSLENBQWUsV0FBVSxZQUFZLEVBQUcsR0FBeEMsRUFBNEMsR0FBRyxJQUEvQyxDQURGO0FBRWxCLEVBQUEsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFKLEtBQWEsT0FBTyxDQUFDLElBQVIsQ0FBYyxXQUFVLFlBQVksRUFBRyxHQUF2QyxFQUEyQyxHQUFHLElBQTlDLENBRkQ7QUFHbEIsRUFBQSxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUosS0FBYSxPQUFPLENBQUMsS0FBUixDQUFlLFdBQVUsWUFBWSxFQUFHLEdBQXhDLEVBQTRDLEdBQUcsSUFBL0M7QUFIRixDQUFwQjtBQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQ2YsRUFBQSxnQkFEZTtBQUVmLEVBQUE7QUFGZSxDQUFqQjs7Ozs7QUNuQkE7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxzQkFBVCxDQUFpQyxTQUFqQyxFQUE0QztBQUMzRDtBQUNBLE1BQUksU0FBUyxJQUFJLElBQWpCLEVBQXVCO0FBQ3JCLElBQUEsU0FBUyxHQUFHLE9BQU8sU0FBUCxLQUFxQixXQUFyQixHQUFtQyxTQUFTLENBQUMsU0FBN0MsR0FBeUQsSUFBckU7QUFDRCxHQUowRCxDQUszRDs7O0FBQ0EsTUFBSSxDQUFDLFNBQUwsRUFBZ0IsT0FBTyxJQUFQO0FBRWhCLFFBQU0sQ0FBQyxHQUFHLG1CQUFtQixJQUFuQixDQUF3QixTQUF4QixDQUFWO0FBQ0EsTUFBSSxDQUFDLENBQUwsRUFBUSxPQUFPLElBQVA7QUFFUixRQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBRCxDQUFyQjtBQUNBLE1BQUksQ0FBQyxLQUFELEVBQVEsS0FBUixJQUFpQixXQUFXLENBQUMsS0FBWixDQUFrQixHQUFsQixDQUFyQjtBQUNBLEVBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFELEVBQVEsRUFBUixDQUFoQjtBQUNBLEVBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFELEVBQVEsRUFBUixDQUFoQixDQWQyRCxDQWdCM0Q7QUFDQTtBQUNBOztBQUNBLE1BQUksS0FBSyxHQUFHLEVBQVIsSUFBZSxLQUFLLEtBQUssRUFBVixJQUFnQixLQUFLLEdBQUcsS0FBM0MsRUFBbUQ7QUFDakQsV0FBTyxJQUFQO0FBQ0QsR0FyQjBELENBdUIzRDtBQUNBOzs7QUFDQSxNQUFJLEtBQUssR0FBRyxFQUFSLElBQWUsS0FBSyxLQUFLLEVBQVYsSUFBZ0IsS0FBSyxJQUFJLEtBQTVDLEVBQW9EO0FBQ2xELFdBQU8sSUFBUDtBQUNELEdBM0IwRCxDQTZCM0Q7OztBQUNBLFNBQU8sS0FBUDtBQUNELENBL0JEOzs7Ozs7O0FDSEEsTUFBTTtBQUFFLEVBQUE7QUFBRixJQUFlLE9BQU8sQ0FBQyxZQUFELENBQTVCOztBQUNBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyx5QkFBRCxDQUF2Qjs7QUFDQSxNQUFNO0FBQUUsRUFBQTtBQUFGLElBQVEsT0FBTyxDQUFDLFFBQUQsQ0FBckI7O0FBRUEsTUFBTSxDQUFDLE9BQVAscUJBQWlCLE1BQU0sU0FBTixTQUF3QixRQUF4QixDQUFpQztBQUdoRCxFQUFBLFdBQVcsQ0FBRSxJQUFGLEVBQVEsSUFBUixFQUFjO0FBQ3ZCLFVBQU0sSUFBTixFQUFZLElBQVo7QUFDQSxTQUFLLEVBQUwsR0FBVSxLQUFLLElBQUwsQ0FBVSxFQUFWLElBQWdCLFdBQTFCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsWUFBYjtBQUNBLFNBQUssSUFBTCxHQUFZLFVBQVo7QUFFQSxTQUFLLGFBQUwsR0FBcUI7QUFDbkIsTUFBQSxPQUFPLEVBQUU7QUFDUDtBQUNBO0FBQ0E7QUFDQSxRQUFBLFdBQVcsRUFBRTtBQUpOO0FBRFUsS0FBckIsQ0FOdUIsQ0FldkI7O0FBQ0EsVUFBTSxjQUFjLEdBQUc7QUFDckIsTUFBQSxNQUFNLEVBQUUsSUFEYTtBQUVyQixNQUFBLE1BQU0sRUFBRSxJQUZhO0FBR3JCLE1BQUEsU0FBUyxFQUFFO0FBSFUsS0FBdkIsQ0FoQnVCLENBc0J2Qjs7QUFDQSxTQUFLLElBQUwsR0FBWSxFQUFFLEdBQUcsY0FBTDtBQUFxQixTQUFHO0FBQXhCLEtBQVo7QUFFQSxTQUFLLFFBQUw7QUFFQSxTQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBekI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0Q7O0FBRUQsRUFBQSxRQUFRLENBQUUsS0FBRixFQUFTO0FBQ2YsVUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLEdBQU4sQ0FBVyxJQUFELEtBQVc7QUFDdkMsTUFBQSxNQUFNLEVBQUUsS0FBSyxFQUQwQjtBQUV2QyxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsSUFGNEI7QUFHdkMsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBSDRCO0FBSXZDLE1BQUEsSUFBSSxFQUFFO0FBSmlDLEtBQVgsQ0FBVixDQUFwQjs7QUFPQSxRQUFJO0FBQ0YsV0FBSyxJQUFMLENBQVUsUUFBVixDQUFtQixXQUFuQjtBQUNELEtBRkQsQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNaLFdBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxHQUFkO0FBQ0Q7QUFDRjs7QUFFRCxFQUFBLGlCQUFpQixDQUFFLEtBQUYsRUFBUztBQUN4QixTQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsaURBQWQ7QUFDQSxVQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFkLENBQXJCO0FBQ0EsU0FBSyxRQUFMLENBQWMsS0FBZCxFQUh3QixDQUt4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBQSxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWIsR0FBcUIsSUFBckI7QUFDRDs7QUFFRCxFQUFBLFdBQVcsR0FBSTtBQUNiLFNBQUssS0FBTCxDQUFXLEtBQVg7QUFDRDs7QUFFRCxFQUFBLE1BQU0sR0FBSTtBQUNSO0FBQ0EsVUFBTSxnQkFBZ0IsR0FBRztBQUN2QixNQUFBLEtBQUssRUFBRSxPQURnQjtBQUV2QixNQUFBLE1BQU0sRUFBRSxPQUZlO0FBR3ZCLE1BQUEsT0FBTyxFQUFFLENBSGM7QUFJdkIsTUFBQSxRQUFRLEVBQUUsUUFKYTtBQUt2QixNQUFBLFFBQVEsRUFBRSxVQUxhO0FBTXZCLE1BQUEsTUFBTSxFQUFFLENBQUM7QUFOYyxLQUF6QjtBQVNBLFVBQU07QUFBRSxNQUFBO0FBQUYsUUFBbUIsS0FBSyxJQUFMLENBQVUsSUFBbkM7QUFDQSxVQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsZ0JBQWIsR0FBZ0MsWUFBWSxDQUFDLGdCQUFiLENBQThCLElBQTlCLENBQW1DLEdBQW5DLENBQWhDLEdBQTBFLElBQXpGO0FBRUEsV0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRTtBQUNFLE1BQUEsU0FBUyxFQUFDLHNCQURaO0FBRUUsTUFBQSxLQUFLLEVBQUUsS0FBSyxJQUFMLENBQVUsTUFBVixJQUFvQixnQkFGN0I7QUFHRSxNQUFBLElBQUksRUFBQyxNQUhQO0FBSUUsTUFBQSxJQUFJLEVBQUUsS0FBSyxJQUFMLENBQVUsU0FKbEI7QUFLRSxNQUFBLFFBQVEsRUFBRSxLQUFLLGlCQUxqQjtBQU1FLE1BQUEsUUFBUSxFQUFFLFlBQVksQ0FBQyxnQkFBYixLQUFrQyxDQU45QztBQU9FLE1BQUEsTUFBTSxFQUFFLE1BUFY7QUFRRSxNQUFBLEdBQUcsRUFBRyxLQUFELElBQVc7QUFBRSxhQUFLLEtBQUwsR0FBYSxLQUFiO0FBQW9CO0FBUnhDLE1BREYsRUFXRyxLQUFLLElBQUwsQ0FBVSxNQUFWLElBRUM7QUFDRSxNQUFBLFNBQVMsRUFBQyxvQkFEWjtBQUVFLE1BQUEsSUFBSSxFQUFDLFFBRlA7QUFHRSxNQUFBLE9BQU8sRUFBRSxLQUFLO0FBSGhCLE9BS0csS0FBSyxJQUFMLENBQVUsYUFBVixDQUxILENBYkosQ0FERjtBQXdCRDs7QUFFRCxFQUFBLE9BQU8sR0FBSTtBQUNULFVBQU07QUFBRSxNQUFBO0FBQUYsUUFBYSxLQUFLLElBQXhCOztBQUNBLFFBQUksTUFBSixFQUFZO0FBQ1YsV0FBSyxLQUFMLENBQVcsTUFBWCxFQUFtQixJQUFuQjtBQUNEO0FBQ0Y7O0FBRUQsRUFBQSxTQUFTLEdBQUk7QUFDWCxTQUFLLE9BQUw7QUFDRDs7QUFySCtDLENBQWxELFNBQ1MsT0FEVDs7Ozs7QUNKQSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBRCxDQUExQjs7QUFDQSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBeEI7O0FBQ0EsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUFELENBQTdCOztBQUNBLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBRCxDQUF6Qjs7QUFDQSxNQUFNO0FBQUUsRUFBQTtBQUFGLElBQVEsT0FBTyxDQUFDLFFBQUQsQ0FBckI7O0FBRUEsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQS9COztBQUVBLE1BQU0sR0FBRyxHQUFJLFFBQWI7O0FBQ0EsTUFBTSxTQUFTLEdBQUcsTUFBTyxJQUFHLEdBQUksR0FBaEM7O0FBRUEsU0FBUyxTQUFULENBQW9CLEtBQXBCLEVBQTJCO0FBQ3pCLFFBQU07QUFDSixJQUFBLFFBREk7QUFFSixJQUFBLGVBRkk7QUFHSixJQUFBLGNBSEk7QUFJSixJQUFBLElBSkk7QUFLSixJQUFBLFdBTEk7QUFNSixJQUFBLFdBTkk7QUFPSixJQUFBO0FBUEksTUFRRixLQVJKO0FBVUEsUUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQ3BDLGNBRG9DLEVBRXBDLFlBRm9DLEVBR3BDLDBCQUhvQyxFQUlwQyxrQ0FKb0MsRUFLcEM7QUFDRSwwQkFBc0IsV0FBVyxLQUFLLGVBQWUsQ0FBQztBQUR4RCxHQUxvQyxFQVFwQztBQUFFLDBDQUFzQztBQUF4QyxHQVJvQyxDQUF0QztBQVdBLFFBQU0sYUFBYSxHQUNmLFFBQVEsSUFBSSxlQUFaLElBQStCLENBQUMsY0FBaEMsR0FDRSxJQUFJLENBQUMsaUJBQUQsRUFBb0I7QUFBRSxJQUFBLFdBQVcsRUFBRTtBQUFmLEdBQXBCLENBRE4sR0FFRSxJQUFJLENBQUMsY0FBRCxFQUFpQjtBQUFFLElBQUEsV0FBVyxFQUFFO0FBQWYsR0FBakIsQ0FIVjtBQUtBLFNBQ0U7QUFDRSxJQUFBLElBQUksRUFBQyxRQURQO0FBRUUsSUFBQSxTQUFTLEVBQUUsbUJBRmI7QUFHRSxrQkFBWSxJQUFJLENBQUMsY0FBRCxFQUFpQjtBQUFFLE1BQUEsV0FBVyxFQUFFO0FBQWYsS0FBakIsQ0FIbEI7QUFJRSxJQUFBLE9BQU8sRUFBRSxXQUpYO0FBS0UsSUFBQSxRQUFRLEVBQUUsV0FMWjtBQU1FO0FBTkYsS0FRRyxhQVJILENBREY7QUFZRDs7QUFFRCxTQUFTLFFBQVQsQ0FBbUIsS0FBbkIsRUFBMEI7QUFDeEIsUUFBTTtBQUFFLElBQUEsSUFBRjtBQUFRLElBQUE7QUFBUixNQUFpQixLQUF2QjtBQUVBLFNBQ0U7QUFDRSxJQUFBLElBQUksRUFBQyxRQURQO0FBRUUsSUFBQSxTQUFTLEVBQUMsa0ZBRlo7QUFHRSxrQkFBWSxJQUFJLENBQUMsYUFBRCxDQUhsQjtBQUlFLElBQUEsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQUwsRUFKakI7QUFLRTtBQUxGLEtBT0U7QUFDRSxtQkFBWSxNQURkO0FBRUUsSUFBQSxTQUFTLEVBQUMsT0FGWjtBQUdFLElBQUEsU0FBUyxFQUFDLGFBSFo7QUFJRSxJQUFBLEtBQUssRUFBQyxHQUpSO0FBS0UsSUFBQSxNQUFNLEVBQUMsSUFMVDtBQU1FLElBQUEsT0FBTyxFQUFDO0FBTlYsS0FRRTtBQUFNLElBQUEsQ0FBQyxFQUFDO0FBQVIsSUFSRixDQVBGLEVBaUJHLElBQUksQ0FBQyxPQUFELENBakJQLENBREY7QUFxQkQ7O0FBRUQsU0FBUyxTQUFULENBQW9CLEtBQXBCLEVBQTJCO0FBQ3pCLFFBQU07QUFBRSxJQUFBLElBQUY7QUFBUSxJQUFBO0FBQVIsTUFBaUIsS0FBdkI7QUFFQSxTQUNFO0FBQ0UsSUFBQSxJQUFJLEVBQUMsUUFEUDtBQUVFLElBQUEsU0FBUyxFQUFDLDZDQUZaO0FBR0UsSUFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQUQsQ0FIYjtBQUlFLGtCQUFZLElBQUksQ0FBQyxRQUFELENBSmxCO0FBS0UsSUFBQSxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUMsU0FBTCxFQUxqQjtBQU1FO0FBTkYsS0FRRTtBQUNFLG1CQUFZLE1BRGQ7QUFFRSxJQUFBLFNBQVMsRUFBQyxPQUZaO0FBR0UsSUFBQSxTQUFTLEVBQUMsYUFIWjtBQUlFLElBQUEsS0FBSyxFQUFDLElBSlI7QUFLRSxJQUFBLE1BQU0sRUFBQyxJQUxUO0FBTUUsSUFBQSxPQUFPLEVBQUM7QUFOVixLQVFFO0FBQUcsSUFBQSxJQUFJLEVBQUMsTUFBUjtBQUFlLElBQUEsUUFBUSxFQUFDO0FBQXhCLEtBQ0U7QUFBUSxJQUFBLElBQUksRUFBQyxNQUFiO0FBQW9CLElBQUEsRUFBRSxFQUFDLEdBQXZCO0FBQTJCLElBQUEsRUFBRSxFQUFDLEdBQTlCO0FBQWtDLElBQUEsQ0FBQyxFQUFDO0FBQXBDLElBREYsRUFFRTtBQUNFLElBQUEsSUFBSSxFQUFDLE1BRFA7QUFFRSxJQUFBLENBQUMsRUFBQztBQUZKLElBRkYsQ0FSRixDQVJGLENBREY7QUEyQkQ7O0FBRUQsU0FBUyxpQkFBVCxDQUE0QixLQUE1QixFQUFtQztBQUNqQyxRQUFNO0FBQUUsSUFBQSxXQUFGO0FBQWUsSUFBQSxJQUFmO0FBQXFCLElBQUEsYUFBckI7QUFBb0MsSUFBQSxnQkFBcEM7QUFBc0QsSUFBQTtBQUF0RCxNQUErRCxLQUFyRTtBQUNBLFFBQU0sS0FBSyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBRCxDQUFQLEdBQW9CLElBQUksQ0FBQyxPQUFELENBQWpEOztBQUVBLFdBQVMsaUJBQVQsR0FBOEI7QUFDNUIsUUFBSSxhQUFKLEVBQW1CLE9BQU8sSUFBUDs7QUFFbkIsUUFBSSxDQUFDLGdCQUFMLEVBQXVCO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLFNBQUwsRUFBUDtBQUNEOztBQUVELFFBQUksV0FBSixFQUFpQjtBQUNmLGFBQU8sSUFBSSxDQUFDLFNBQUwsRUFBUDtBQUNEOztBQUVELFdBQU8sSUFBSSxDQUFDLFFBQUwsRUFBUDtBQUNEOztBQUVELFNBQ0U7QUFDRSxJQUFBLEtBQUssRUFBRSxLQURUO0FBRUUsa0JBQVksS0FGZDtBQUdFLElBQUEsU0FBUyxFQUFDLDZDQUhaO0FBSUUsSUFBQSxJQUFJLEVBQUMsUUFKUDtBQUtFLElBQUEsT0FBTyxFQUFFLGlCQUxYO0FBTUU7QUFORixLQVFFO0FBQ0UsbUJBQVksTUFEZDtBQUVFLElBQUEsU0FBUyxFQUFDLE9BRlo7QUFHRSxJQUFBLFNBQVMsRUFBQyxhQUhaO0FBSUUsSUFBQSxLQUFLLEVBQUMsSUFKUjtBQUtFLElBQUEsTUFBTSxFQUFDLElBTFQ7QUFNRSxJQUFBLE9BQU8sRUFBQztBQU5WLEtBUUU7QUFBRyxJQUFBLElBQUksRUFBQyxNQUFSO0FBQWUsSUFBQSxRQUFRLEVBQUM7QUFBeEIsS0FDRTtBQUFRLElBQUEsSUFBSSxFQUFDLE1BQWI7QUFBb0IsSUFBQSxFQUFFLEVBQUMsR0FBdkI7QUFBMkIsSUFBQSxFQUFFLEVBQUMsR0FBOUI7QUFBa0MsSUFBQSxDQUFDLEVBQUM7QUFBcEMsSUFERixFQUVFO0FBQ0UsSUFBQSxJQUFJLEVBQUMsTUFEUDtBQUVFLElBQUEsQ0FBQyxFQUNDLFdBQVcsR0FDUCx5QkFETyxHQUVQO0FBTFIsSUFGRixDQVJGLENBUkYsQ0FERjtBQStCRDs7QUFFRCxTQUFTLE9BQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDdkIsUUFBTTtBQUFFLElBQUEsSUFBRjtBQUFRLElBQUE7QUFBUixNQUE4QixLQUFwQztBQUVBLFNBQ0U7QUFDRSxJQUFBLElBQUksRUFBQyxRQURQO0FBRUUsSUFBQSxTQUFTLEVBQUMsaUZBRlo7QUFHRSxJQUFBLE9BQU8sRUFBRSxpQkFIWDtBQUlFO0FBSkYsS0FNRyxJQUFJLENBQUMsTUFBRCxDQU5QLENBREY7QUFVRDs7QUFFRCxTQUFTLGNBQVQsR0FBMkI7QUFDekIsU0FDRTtBQUNFLElBQUEsU0FBUyxFQUFDLHdCQURaO0FBRUUsbUJBQVksTUFGZDtBQUdFLElBQUEsU0FBUyxFQUFDLE9BSFo7QUFJRSxJQUFBLEtBQUssRUFBQyxJQUpSO0FBS0UsSUFBQSxNQUFNLEVBQUM7QUFMVCxLQU9FO0FBQ0UsSUFBQSxDQUFDLEVBQUMsc2JBREo7QUFFRSxJQUFBLFFBQVEsRUFBQztBQUZYLElBUEYsQ0FERjtBQWNEOztBQUVELFNBQVMscUJBQVQsQ0FBZ0MsS0FBaEMsRUFBdUM7QUFDckMsUUFBTTtBQUFFLElBQUE7QUFBRixNQUFlLEtBQXJCO0FBQ0EsUUFBTTtBQUFFLElBQUEsS0FBRjtBQUFTLElBQUEsSUFBVDtBQUFlLElBQUE7QUFBZixNQUEyQixRQUFqQztBQUNBLFFBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBSyxHQUFHLEdBQW5CLENBQXJCO0FBQ0EsUUFBTSxHQUFHLEdBQUksUUFBYjtBQUVBLFNBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0UsRUFBQyxjQUFELE9BREYsRUFFRyxJQUFJLEtBQUssYUFBVCxHQUEwQixHQUFFLFlBQWEsS0FBSSxHQUFJLEdBQWpELEdBQXNELEVBRnpELEVBR0csT0FISCxDQURGO0FBT0Q7O0FBRUQsU0FBUyxlQUFULENBQTBCLEtBQTFCLEVBQWlDO0FBQy9CLFFBQU07QUFDSixJQUFBLFVBREk7QUFFSixJQUFBLFFBRkk7QUFHSixJQUFBLGlCQUhJO0FBSUosSUFBQSxTQUpJO0FBS0osSUFBQSxRQUxJO0FBTUosSUFBQTtBQU5JLE1BT0YsS0FQSjtBQVNBLFFBQU0sMEJBQTBCLEdBQUcsVUFBVSxHQUFHLENBQWhEO0FBRUEsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRywwQkFBMEIsSUFDdEIsSUFBSSxDQUFDLHNCQUFELEVBQXlCO0FBQzlCLElBQUEsUUFEOEI7QUFFOUIsSUFBQSxXQUFXLEVBQUU7QUFGaUIsR0FBekIsQ0FGWCxFQU1FO0FBQU0sSUFBQSxTQUFTLEVBQUM7QUFBaEIsS0FLRywwQkFBMEIsSUFBSSxTQUFTLEVBTDFDLEVBT0csSUFBSSxDQUFDLHFCQUFELEVBQXdCO0FBQzNCLElBQUEsUUFBUSxFQUFFLGFBQWEsQ0FBQyxpQkFBRCxDQURJO0FBRTNCLElBQUEsS0FBSyxFQUFFLGFBQWEsQ0FBQyxTQUFEO0FBRk8sR0FBeEIsQ0FQUCxFQVlHLFNBQVMsRUFaWixFQWNHLElBQUksQ0FBQyxXQUFELEVBQWM7QUFDakIsSUFBQSxJQUFJLEVBQUUsU0FBUyxDQUFDLFFBQUQ7QUFERSxHQUFkLENBZFAsQ0FORixDQURGO0FBMkJEOztBQUVELFNBQVMsc0JBQVQsQ0FBaUMsS0FBakMsRUFBd0M7QUFDdEMsUUFBTTtBQUFFLElBQUEsSUFBRjtBQUFRLElBQUEsUUFBUjtBQUFrQixJQUFBO0FBQWxCLE1BQWlDLEtBQXZDO0FBRUEsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRyxJQUFJLENBQUMsc0JBQUQsRUFBeUI7QUFBRSxJQUFBLFFBQUY7QUFBWSxJQUFBLFdBQVcsRUFBRTtBQUF6QixHQUF6QixDQURQLENBREY7QUFLRDs7QUFFRCxTQUFTLHFCQUFULENBQWdDLEtBQWhDLEVBQXVDO0FBQ3JDLFFBQU07QUFBRSxJQUFBLElBQUY7QUFBUSxJQUFBLFFBQVI7QUFBa0IsSUFBQTtBQUFsQixNQUFrQyxLQUF4QztBQUNBLFFBQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUNwQyxjQURvQyxFQUVwQyxZQUZvQyxFQUdwQywwQkFIb0MsRUFJcEMsNENBSm9DLENBQXRDO0FBT0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRyxJQUFJLENBQUMsaUJBQUQsRUFBb0I7QUFBRSxJQUFBLFdBQVcsRUFBRTtBQUFmLEdBQXBCLENBRFAsQ0FERixFQUlFO0FBQ0UsSUFBQSxJQUFJLEVBQUMsUUFEUDtBQUVFLElBQUEsU0FBUyxFQUFFLG1CQUZiO0FBR0Usa0JBQVksSUFBSSxDQUFDLGNBQUQsRUFBaUI7QUFBRSxNQUFBLFdBQVcsRUFBRTtBQUFmLEtBQWpCLENBSGxCO0FBSUUsSUFBQSxPQUFPLEVBQUU7QUFKWCxLQU1HLElBQUksQ0FBQyxRQUFELENBTlAsQ0FKRixDQURGO0FBZUQ7O0FBRUQsTUFBTSx3QkFBd0IsR0FBRyxRQUFRLENBQUMsZUFBRCxFQUFrQixHQUFsQixFQUF1QjtBQUM5RCxFQUFBLE9BQU8sRUFBRSxJQURxRDtBQUU5RCxFQUFBLFFBQVEsRUFBRTtBQUZvRCxDQUF2QixDQUF6Qzs7QUFLQSxTQUFTLG9CQUFULENBQStCLEtBQS9CLEVBQXNDO0FBQ3BDLFFBQU07QUFDSixJQUFBLElBREk7QUFFSixJQUFBLHNCQUZJO0FBR0osSUFBQSxhQUhJO0FBSUosSUFBQSxtQkFKSTtBQUtKLElBQUEsZUFMSTtBQU1KLElBQUEsYUFOSTtBQU9KLElBQUEsV0FQSTtBQVFKLElBQUEsUUFSSTtBQVNKLElBQUEsVUFUSTtBQVVKLElBQUEsUUFWSTtBQVdKLElBQUEsaUJBWEk7QUFZSixJQUFBLFNBWkk7QUFhSixJQUFBLFFBYkk7QUFjSixJQUFBO0FBZEksTUFlRixLQWZKO0FBZ0JBLFFBQU0seUJBQXlCLEdBQUcsUUFBUSxJQUFJLGVBQTlDOztBQUVBLE1BQUksQ0FBQyxlQUFELElBQW9CLGFBQXhCLEVBQXVDO0FBQ3JDLFdBQU8sSUFBUDtBQUNEOztBQUVELFFBQU0sS0FBSyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBRCxDQUFQLEdBQW9CLElBQUksQ0FBQyxXQUFELENBQWpEOztBQUVBLFdBQVMscUJBQVQsR0FBa0M7QUFDaEMsUUFBSSxDQUFDLFdBQUQsSUFBZ0IsQ0FBQyx5QkFBakIsSUFBOEMsbUJBQWxELEVBQXVFO0FBQ3JFLFVBQUksc0JBQUosRUFBNEI7QUFDMUIsZUFDRSxFQUFDLHdCQUFEO0FBQ0UsVUFBQSxVQUFVLEVBQUUsVUFEZDtBQUVFLFVBQUEsUUFBUSxFQUFFLFFBRlo7QUFHRSxVQUFBLGlCQUFpQixFQUFFLGlCQUhyQjtBQUlFLFVBQUEsU0FBUyxFQUFFLFNBSmI7QUFLRSxVQUFBLFFBQVEsRUFBRSxRQUxaO0FBTUUsVUFBQSxJQUFJLEVBQUU7QUFOUixVQURGO0FBVUQ7O0FBQ0QsYUFDRSxFQUFDLHNCQUFEO0FBQ0UsUUFBQSxJQUFJLEVBQUUsSUFEUjtBQUVFLFFBQUEsUUFBUSxFQUFFLFFBRlo7QUFHRSxRQUFBLFVBQVUsRUFBRTtBQUhkLFFBREY7QUFPRDs7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRCxTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUMsd0JBQWY7QUFBd0Msa0JBQVksS0FBcEQ7QUFBMkQsSUFBQSxLQUFLLEVBQUU7QUFBbEUsS0FDRyxDQUFDLFdBQUQsR0FBZSxFQUFDLGNBQUQsT0FBZixHQUFvQyxJQUR2QyxFQUVFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNHLHNCQUFzQixHQUFJLEdBQUUsS0FBTSxLQUFJLGFBQWMsR0FBOUIsR0FBbUMsS0FENUQsQ0FERixFQUtHLHFCQUFxQixFQUx4QixFQU9HLHlCQUF5QixHQUN4QixFQUFDLHFCQUFEO0FBQ0UsSUFBQSxJQUFJLEVBQUUsSUFEUjtBQUVFLElBQUEsUUFBUSxFQUFFLFFBRlo7QUFHRSxJQUFBLFdBQVcsRUFBRTtBQUhmLElBRHdCLEdBTXRCLElBYk4sQ0FGRixDQURGO0FBb0JEOztBQUVELFNBQVMsbUJBQVQsQ0FBOEIsS0FBOUIsRUFBcUM7QUFDbkMsUUFBTTtBQUFFLElBQUE7QUFBRixNQUFXLEtBQWpCO0FBRUEsU0FDRTtBQUNFLElBQUEsU0FBUyxFQUFDLHdCQURaO0FBRUUsSUFBQSxJQUFJLEVBQUMsUUFGUDtBQUdFLElBQUEsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFEO0FBSGIsS0FLRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUNFLG1CQUFZLE1BRGQ7QUFFRSxJQUFBLFNBQVMsRUFBQyxPQUZaO0FBR0UsSUFBQSxTQUFTLEVBQUMsNENBSFo7QUFJRSxJQUFBLEtBQUssRUFBQyxJQUpSO0FBS0UsSUFBQSxNQUFNLEVBQUMsSUFMVDtBQU1FLElBQUEsT0FBTyxFQUFDO0FBTlYsS0FRRTtBQUFNLElBQUEsQ0FBQyxFQUFDO0FBQVIsSUFSRixDQURGLEVBV0csSUFBSSxDQUFDLFVBQUQsQ0FYUCxDQURGLENBTEYsQ0FERjtBQXVCRDs7QUFFRCxTQUFTLGdCQUFULENBQTJCLEtBQTNCLEVBQWtDO0FBQ2hDLFFBQU07QUFBRSxJQUFBLEtBQUY7QUFBUyxJQUFBO0FBQVQsTUFBa0IsS0FBeEI7O0FBRUEsV0FBUyxpQkFBVCxHQUE4QjtBQUM1QixVQUFNLFlBQVksR0FBSSxHQUFFLElBQUksQ0FBQyxjQUFELENBQWlCLFNBQVEsS0FBTSxFQUEzRCxDQUQ0QixDQUU1Qjs7QUFDQSxJQUFBLEtBQUssQ0FBQyxZQUFELENBQUwsQ0FINEIsQ0FHUjtBQUNyQjs7QUFFRCxTQUNFO0FBQ0UsSUFBQSxTQUFTLEVBQUMsd0JBRFo7QUFFRSxJQUFBLElBQUksRUFBQyxPQUZQO0FBR0UsSUFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQUQ7QUFIYixLQUtFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFO0FBQ0UsbUJBQVksTUFEZDtBQUVFLElBQUEsU0FBUyxFQUFDLE9BRlo7QUFHRSxJQUFBLFNBQVMsRUFBQyw0Q0FIWjtBQUlFLElBQUEsS0FBSyxFQUFDLElBSlI7QUFLRSxJQUFBLE1BQU0sRUFBQyxJQUxUO0FBTUUsSUFBQSxPQUFPLEVBQUM7QUFOVixLQVFFO0FBQU0sSUFBQSxDQUFDLEVBQUM7QUFBUixJQVJGLENBREYsRUFXRyxJQUFJLENBQUMsY0FBRCxDQVhQLENBREYsQ0FMRixFQW9CRTtBQUNFLElBQUEsU0FBUyxFQUFDLHdCQURaO0FBRUUsa0JBQVksS0FGZDtBQUdFLDhCQUF1QixXQUh6QjtBQUlFLDBCQUFtQixRQUpyQjtBQUtFLElBQUEsT0FBTyxFQUFFLGlCQUxYO0FBTUUsSUFBQSxJQUFJLEVBQUM7QUFOUCxTQXBCRixDQURGO0FBaUNEOztBQUVELE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQ2YsRUFBQSxTQURlO0FBRWYsRUFBQSxRQUZlO0FBR2YsRUFBQSxTQUhlO0FBSWYsRUFBQSxpQkFKZTtBQUtmLEVBQUEsT0FMZTtBQU1mLEVBQUEsY0FOZTtBQU9mLEVBQUEsZUFQZTtBQVFmLEVBQUEscUJBUmU7QUFTZixFQUFBLGdCQVRlO0FBVWYsRUFBQSxvQkFWZTtBQVdmLEVBQUE7QUFYZSxDQUFqQjs7Ozs7QUNsYkEsTUFBTTtBQUFFLEVBQUE7QUFBRixJQUFRLE9BQU8sQ0FBQyxRQUFELENBQXJCOztBQUNBLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFELENBQTFCOztBQUNBLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUEvQjs7QUFDQSxNQUFNLDJCQUEyQixHQUFHLE9BQU8sQ0FBQywrQkFBRCxDQUEzQzs7QUFFQSxNQUFNO0FBQ0osRUFBQSxTQURJO0FBRUosRUFBQSxRQUZJO0FBR0osRUFBQSxTQUhJO0FBSUosRUFBQSxpQkFKSTtBQUtKLEVBQUEsT0FMSTtBQU1KLEVBQUEscUJBTkk7QUFPSixFQUFBLGdCQVBJO0FBUUosRUFBQSxvQkFSSTtBQVNKLEVBQUE7QUFUSSxJQVVGLE9BQU8sQ0FBQyxjQUFELENBVlg7O0FBWUEsTUFBTTtBQUNKLEVBQUEsV0FESTtBQUVKLEVBQUEsYUFGSTtBQUdKLEVBQUEsbUJBSEk7QUFJSixFQUFBLGVBSkk7QUFLSixFQUFBLG9CQUxJO0FBTUosRUFBQTtBQU5JLElBT0YsZUFQSjtBQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQWpCOztBQUVBLFNBQVMsU0FBVCxDQUFvQixLQUFwQixFQUEyQjtBQUN6QixRQUFNO0FBQ0osSUFBQSxRQURJO0FBRUosSUFBQSxjQUZJO0FBR0osSUFBQSxrQkFISTtBQUlKLElBQUEsV0FKSTtBQUtKLElBQUEsZ0JBTEk7QUFNSixJQUFBLEtBTkk7QUFPSixJQUFBLGdCQVBJO0FBUUosSUFBQSxxQkFSSTtBQVNKLElBQUEsZ0JBVEk7QUFVSixJQUFBLGVBVkk7QUFXSixJQUFBLGNBWEk7QUFZSixJQUFBLFdBWkk7QUFhSixJQUFBLGFBYkk7QUFjSixJQUFBLEtBZEk7QUFlSixJQUFBLHNCQWZJO0FBZ0JKLElBQUEsZUFoQkk7QUFpQkosSUFBQSxXQWpCSTtBQWtCSixJQUFBLGFBbEJJO0FBbUJKLElBQUEsaUJBbkJJO0FBb0JKLElBQUEsZUFwQkk7QUFxQkosSUFBQSxJQXJCSTtBQXNCSixJQUFBLFdBdEJJO0FBdUJKLElBQUEsSUF2Qkk7QUF3QkosSUFBQSxhQXhCSTtBQXlCSixJQUFBLG1CQXpCSTtBQTBCSixJQUFBLFVBMUJJO0FBMkJKLElBQUEsUUEzQkk7QUE0QkosSUFBQSxTQTVCSTtBQTZCSixJQUFBLFFBN0JJO0FBOEJKLElBQUE7QUE5QkksTUErQkYsS0EvQko7O0FBaUNBLFdBQVMsZ0JBQVQsR0FBNkI7QUFDM0IsWUFBUSxXQUFSO0FBQ0UsV0FBSyxvQkFBTDtBQUNBLFdBQUssbUJBQUw7QUFBMEI7QUFDeEIsZ0JBQU0sUUFBUSxHQUFHLDJCQUEyQixDQUFDLEtBQUQsQ0FBNUM7O0FBRUEsY0FBSSxRQUFRLENBQUMsSUFBVCxLQUFrQixhQUF0QixFQUFxQztBQUNuQyxtQkFBTyxRQUFRLENBQUMsS0FBVCxHQUFpQixHQUF4QjtBQUNEOztBQUNELGlCQUFPLGFBQVA7QUFDRDs7QUFDRCxXQUFLLFdBQUw7QUFBa0I7QUFDaEIsaUJBQU8sSUFBUDtBQUNEOztBQUNELFdBQUssZUFBTDtBQUFzQjtBQUNwQixjQUFJLENBQUMsc0JBQUwsRUFBNkI7QUFDM0IsbUJBQU8sSUFBUDtBQUNEOztBQUNELGlCQUFPLGFBQVA7QUFDRDs7QUFDRDtBQUNFLGVBQU8sYUFBUDtBQXBCSjtBQXNCRDs7QUFFRCxXQUFTLGtCQUFULEdBQStCO0FBQzdCLFlBQVEsV0FBUjtBQUNFLFdBQUssb0JBQUw7QUFDQSxXQUFLLG1CQUFMO0FBQTBCO0FBQ3hCLGdCQUFNO0FBQUUsWUFBQTtBQUFGLGNBQVcsMkJBQTJCLENBQUMsS0FBRCxDQUE1QztBQUNBLGlCQUFPLElBQUksS0FBSyxlQUFoQjtBQUNEOztBQUNELFdBQUssZUFBTDtBQUFzQjtBQUNwQixjQUFJLENBQUMsc0JBQUwsRUFBNkI7QUFDM0IsbUJBQU8sSUFBUDtBQUNEOztBQUNELGlCQUFPLEtBQVA7QUFDRDs7QUFDRDtBQUNFLGVBQU8sS0FBUDtBQWJKO0FBZUQ7O0FBRUQsV0FBUyxXQUFULEdBQXdCO0FBQ3RCLFFBQUksY0FBSixFQUFvQjtBQUNsQixhQUFPLEtBQVA7QUFDRDs7QUFFRCxZQUFRLFdBQVI7QUFDRSxXQUFLLGFBQUw7QUFDRSxlQUFPLGdCQUFnQixJQUFJLFFBQVEsS0FBSyxDQUF4Qzs7QUFDRixXQUFLLGNBQUw7QUFDRSxlQUFPLGVBQVA7O0FBQ0Y7QUFDRSxlQUFPLEtBQVA7QUFOSjtBQVFEOztBQUVELFFBQU0sYUFBYSxHQUFHLGdCQUFnQixFQUF0QztBQUVBLFFBQU0sUUFBUSxHQUFHLFdBQVcsRUFBNUI7QUFFQSxRQUFNLEtBQUssR0FBRyxhQUFILFdBQUcsYUFBSCxHQUFvQixHQUEvQjtBQUVBLFFBQU0sYUFBYSxHQUNmLENBQUMsS0FBRCxJQUNDLFFBREQsSUFFQyxDQUFDLGtCQUZGLElBR0MsQ0FBQyxXQUhGLElBSUMsY0FKRCxJQUtDLENBQUMsZ0JBTk47QUFRQSxRQUFNLGFBQWEsR0FDZixDQUFDLGdCQUFELElBQ0MsV0FBVyxLQUFLLGFBRGpCLElBRUMsV0FBVyxLQUFLLGNBSHJCO0FBS0EsUUFBTSxrQkFBa0IsR0FDcEIsZ0JBQWdCLElBQ2YsQ0FBQyxxQkFERixJQUVDLFdBQVcsS0FBSyxlQUhyQjtBQUtBLFFBQU0sWUFBWSxHQUFHLEtBQUssSUFBSSxDQUFDLGVBQS9CO0FBRUEsUUFBTSxXQUFXLEdBQUcsaUJBQWlCLElBQUksV0FBVyxLQUFLLGNBQXpEO0FBRUEsUUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMseUJBQUQsRUFBNEI7QUFDL0Qsd0JBQW9CLGtCQUFrQjtBQUR5QixHQUE1QixDQUFyQztBQUlBLFFBQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUNwQztBQUFFLGlCQUFhO0FBQWYsR0FEb0MsRUFFcEMsZ0JBRm9DLEVBR25DLE1BQUssV0FBWSxFQUhrQixFQUlwQztBQUFFLGtCQUFjO0FBQWhCLEdBSm9DLENBQXRDO0FBT0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFFLG1CQUFoQjtBQUFxQyxtQkFBYTtBQUFsRCxLQUNFO0FBQ0UsSUFBQSxTQUFTLEVBQUUsa0JBRGI7QUFFRSxJQUFBLEtBQUssRUFBRTtBQUFFLE1BQUEsS0FBSyxFQUFHLEdBQUUsS0FBTTtBQUFsQixLQUZUO0FBR0UsSUFBQSxJQUFJLEVBQUMsYUFIUDtBQUlFLGtCQUFhLEdBQUUsS0FBTSxHQUp2QjtBQUtFLHNCQUFpQixHQUFFLEtBQU0sR0FMM0I7QUFNRSxxQkFBYyxHQU5oQjtBQU9FLHFCQUFjLEtBUGhCO0FBUUUscUJBQWU7QUFSakIsSUFERixFQVlHLENBQUMsTUFBTTtBQUNOLFlBQVEsV0FBUjtBQUNFLFdBQUssbUJBQUw7QUFDQSxXQUFLLG9CQUFMO0FBQ0UsZUFDRSxFQUFDLHFCQUFEO0FBQ0UsVUFBQSxRQUFRLEVBQUUsMkJBQTJCLENBQUMsS0FBRDtBQUR2QyxVQURGOztBQUtGLFdBQUssY0FBTDtBQUNFLGVBQU8sRUFBQyxtQkFBRDtBQUFxQixVQUFBLElBQUksRUFBRTtBQUEzQixVQUFQOztBQUNGLFdBQUssV0FBTDtBQUNFLGVBQU8sRUFBQyxnQkFBRDtBQUFrQixVQUFBLEtBQUssRUFBRSxLQUF6QjtBQUFnQyxVQUFBLElBQUksRUFBRTtBQUF0QyxVQUFQOztBQUNGLFdBQUssZUFBTDtBQUNFLGVBQ0UsRUFBQyxvQkFBRDtBQUNFLFVBQUEsSUFBSSxFQUFFLElBRFI7QUFFRSxVQUFBLHNCQUFzQixFQUFFLHNCQUYxQjtBQUdFLFVBQUEsYUFBYSxFQUFFLGFBSGpCO0FBSUUsVUFBQSxtQkFBbUIsRUFBRSxtQkFKdkI7QUFLRSxVQUFBLGVBQWUsRUFBRSxlQUxuQjtBQU1FLFVBQUEsYUFBYSxFQUFFLGFBTmpCO0FBT0UsVUFBQSxXQUFXLEVBQUUsV0FQZjtBQVFFLFVBQUEsUUFBUSxFQUFFLFFBUlo7QUFTRSxVQUFBLFVBQVUsRUFBRSxVQVRkO0FBVUUsVUFBQSxRQUFRLEVBQUUsUUFWWjtBQVdFLFVBQUEsaUJBQWlCLEVBQUUsaUJBWHJCO0FBWUUsVUFBQSxTQUFTLEVBQUUsU0FaYjtBQWFFLFVBQUEsUUFBUSxFQUFFLFFBYlo7QUFjRSxVQUFBLFdBQVcsRUFBRTtBQWRmLFVBREY7O0FBa0JGO0FBQ0UsZUFBTyxJQUFQO0FBaENKO0FBa0NELEdBbkNBLEdBWkgsRUFpREU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0ksY0FBYyxJQUFJLGFBQW5CLEdBQ0MsRUFBQyxTQUFEO0FBQ0UsSUFBQSxRQUFRLEVBQUUsUUFEWjtBQUVFLElBQUEsZUFBZSxFQUFFLGVBRm5CO0FBR0UsSUFBQSxjQUFjLEVBQUUsY0FIbEI7QUFJRSxJQUFBLElBQUksRUFBRSxJQUpSO0FBS0UsSUFBQSxXQUFXLEVBQUUsV0FMZjtBQU1FLElBQUEsV0FBVyxFQUFFLFdBTmY7QUFPRSxJQUFBLFdBQVcsRUFBRTtBQVBmLElBREQsR0FVRyxJQVhOLEVBYUcsWUFBWSxHQUFHLEVBQUMsUUFBRDtBQUFVLElBQUEsSUFBSSxFQUFFLElBQWhCO0FBQXNCLElBQUEsSUFBSSxFQUFFO0FBQTVCLElBQUgsR0FBMEMsSUFiekQsRUFlRyxrQkFBa0IsR0FDakIsRUFBQyxpQkFBRDtBQUNFLElBQUEsV0FBVyxFQUFFLFdBRGY7QUFFRSxJQUFBLElBQUksRUFBRSxJQUZSO0FBR0UsSUFBQSxhQUFhLEVBQUUsYUFIakI7QUFJRSxJQUFBLGdCQUFnQixFQUFFLGdCQUpwQjtBQUtFLElBQUEsSUFBSSxFQUFFO0FBTFIsSUFEaUIsR0FRZixJQXZCTixFQXlCRyxhQUFhLEdBQUcsRUFBQyxTQUFEO0FBQVcsSUFBQSxJQUFJLEVBQUUsSUFBakI7QUFBdUIsSUFBQSxJQUFJLEVBQUU7QUFBN0IsSUFBSCxHQUEyQyxJQXpCM0QsRUEyQkcsV0FBVyxHQUNWLEVBQUMsT0FBRDtBQUFTLElBQUEsSUFBSSxFQUFFLElBQWY7QUFBcUIsSUFBQSxpQkFBaUIsRUFBRTtBQUF4QyxJQURVLEdBRVIsSUE3Qk4sQ0FqREYsQ0FERjtBQW1GRDs7Ozs7QUNsUEQsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFDZixFQUFBLFdBQVcsRUFBRSxPQURFO0FBRWYsRUFBQSxhQUFhLEVBQUUsU0FGQTtBQUdmLEVBQUEsbUJBQW1CLEVBQUUsZUFITjtBQUlmLEVBQUEsZUFBZSxFQUFFLFdBSkY7QUFLZixFQUFBLG9CQUFvQixFQUFFLGdCQUxQO0FBTWYsRUFBQSxjQUFjLEVBQUU7QUFORCxDQUFqQjs7Ozs7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLDJCQUFULENBQXNDLEtBQXRDLEVBQTZDO0FBQzVELFFBQU0sTUFBTSxHQUFHLEVBQWY7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLE9BQUo7O0FBRUEsT0FBSyxNQUFNO0FBQUUsSUFBQTtBQUFGLEdBQVgsSUFBMkIsTUFBTSxDQUFDLE1BQVAsQ0FBYyxLQUFkLENBQTNCLEVBQWlEO0FBQy9DLFVBQU07QUFBRSxNQUFBLFVBQUY7QUFBYyxNQUFBO0FBQWQsUUFBOEIsUUFBcEMsQ0FEK0MsQ0FFL0M7QUFDQTs7QUFDQSxRQUFJLE9BQU8sSUFBSSxJQUFYLEtBQW9CLFVBQVUsSUFBSSxXQUFsQyxDQUFKLEVBQW9EO0FBQ2xELE9BQUM7QUFBRSxRQUFBLElBQUY7QUFBUSxRQUFBO0FBQVIsVUFBb0IsVUFBVSxJQUFJLFdBQW5DO0FBQ0Q7O0FBQ0QsUUFBSSxDQUFBLFVBQVUsUUFBVixZQUFBLFVBQVUsQ0FBRSxJQUFaLE1BQXFCLGFBQXpCLEVBQXdDLE1BQU0sQ0FBQyxJQUFQLENBQVksVUFBVSxDQUFDLEtBQXZCO0FBQ3hDLFFBQUksQ0FBQSxXQUFXLFFBQVgsWUFBQSxXQUFXLENBQUUsSUFBYixNQUFzQixhQUExQixFQUF5QyxNQUFNLENBQUMsSUFBUCxDQUFZLFdBQVcsQ0FBQyxLQUF4QjtBQUMxQzs7QUFFRCxRQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBUCxDQUFjLENBQUMsS0FBRCxFQUFRLGFBQVIsS0FBMEI7QUFDcEQsV0FBTyxLQUFLLEdBQUcsYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUF0QztBQUNELEdBRmEsRUFFWCxDQUZXLENBQWQ7QUFJQSxTQUFPO0FBQ0wsSUFBQSxJQURLO0FBRUwsSUFBQSxPQUZLO0FBR0wsSUFBQTtBQUhLLEdBQVA7QUFLRCxDQXpCRDs7Ozs7OztBQ0FBLE1BQU07QUFBRSxFQUFBO0FBQUYsSUFBZSxPQUFPLENBQUMsWUFBRCxDQUE1Qjs7QUFDQSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsMEJBQUQsQ0FBeEI7O0FBQ0EsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsbUNBQUQsQ0FBakM7O0FBQ0EsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsa0NBQUQsQ0FBaEM7O0FBQ0EsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQS9COztBQUNBLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFELENBQTNCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE1BQU0sQ0FBQyxPQUFQLHFCQUFpQixNQUFNLFNBQU4sU0FBd0IsUUFBeEIsQ0FBaUM7QUFDaEQ7QUFHQSxFQUFBLFdBQVcsQ0FBRSxJQUFGLEVBQVEsSUFBUixFQUFjO0FBQ3ZCLFVBQU0sSUFBTixFQUFZLElBQVo7O0FBRHVCLFNBNER6QixXQTVEeUIsR0E0RFgsTUFBTTtBQUNsQixZQUFNO0FBQUUsUUFBQTtBQUFGLFVBQXFCLEtBQUssSUFBTCxDQUFVLFFBQVYsRUFBM0I7O0FBRUEsVUFBSSxjQUFKLEVBQW9CO0FBQ2xCLGFBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxtQkFBZjtBQUNBLGVBQU8sU0FBUDtBQUNEOztBQUVELGFBQU8sS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixLQUFuQixDQUF5QixNQUFNLENBQ3BDO0FBQ0QsT0FGTSxDQUFQO0FBR0QsS0F2RXdCOztBQUV2QixTQUFLLEVBQUwsR0FBVSxLQUFLLElBQUwsQ0FBVSxFQUFWLElBQWdCLFdBQTFCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsV0FBYjtBQUNBLFNBQUssSUFBTCxHQUFZLG1CQUFaO0FBRUEsU0FBSyxhQUFMLEdBQXFCO0FBQ25CLE1BQUEsT0FBTyxFQUFFO0FBQ1AsUUFBQSxTQUFTLEVBQUUsV0FESjtBQUVQLFFBQUEsTUFBTSxFQUFFLFFBRkQ7QUFHUCxRQUFBLFFBQVEsRUFBRSxVQUhIO0FBSVAsUUFBQSxZQUFZLEVBQUUsZUFKUDtBQUtQLFFBQUEsTUFBTSxFQUFFLFFBTEQ7QUFNUCxRQUFBLEtBQUssRUFBRSxPQU5BO0FBT1AsUUFBQSxXQUFXLEVBQUUsY0FQTjtBQVFQLFFBQUEsTUFBTSxFQUFFLFFBUkQ7QUFTUCxRQUFBLEtBQUssRUFBRSxPQVRBO0FBVVAsUUFBQSxNQUFNLEVBQUUsUUFWRDtBQVdQLFFBQUEsSUFBSSxFQUFFLE1BWEM7QUFZUCxRQUFBLG9CQUFvQixFQUFFO0FBQ3BCLGFBQUcsNkNBRGlCO0FBRXBCLGFBQUc7QUFGaUIsU0FaZjtBQWdCUCxRQUFBLG1CQUFtQixFQUFFLHlCQWhCZDtBQWlCUCxRQUFBLFNBQVMsRUFBRSxjQWpCSjtBQWtCUCxRQUFBLFlBQVksRUFBRTtBQUNaLGFBQUcsNEJBRFM7QUFFWixhQUFHO0FBRlMsU0FsQlA7QUFzQlAsUUFBQSxlQUFlLEVBQUU7QUFDZixhQUFHLDZCQURZO0FBRWYsYUFBRztBQUZZLFNBdEJWO0FBMEJQLFFBQUEsZUFBZSxFQUFFO0FBQ2YsYUFBRyxnQ0FEWTtBQUVmLGFBQUc7QUFGWTtBQTFCVjtBQURVLEtBQXJCLENBTnVCLENBd0N2Qjs7QUFDQSxVQUFNLGNBQWMsR0FBRztBQUNyQixNQUFBLE1BQU0sRUFBRSxNQURhO0FBRXJCLE1BQUEsZ0JBQWdCLEVBQUUsS0FGRztBQUdyQixNQUFBLGVBQWUsRUFBRSxLQUhJO0FBSXJCLE1BQUEscUJBQXFCLEVBQUUsS0FKRjtBQUtyQixNQUFBLGdCQUFnQixFQUFFLEtBTEc7QUFNckIsTUFBQSxtQkFBbUIsRUFBRSxLQU5BO0FBT3JCLE1BQUEsZUFBZSxFQUFFLElBUEk7QUFRckIsTUFBQSxpQkFBaUIsRUFBRTtBQVJFLEtBQXZCO0FBV0EsU0FBSyxJQUFMLEdBQVksRUFBRSxHQUFHLGNBQUw7QUFBcUIsU0FBRztBQUF4QixLQUFaO0FBRUEsU0FBSyxRQUFMO0FBRUEsU0FBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixDQUFkO0FBQ0EsU0FBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixJQUFsQixDQUFmO0FBQ0Q7O0FBZUQsRUFBQSxNQUFNLENBQUUsS0FBRixFQUFTO0FBQ2IsVUFBTTtBQUNKLE1BQUEsWUFESTtBQUVKLE1BQUEsS0FGSTtBQUdKLE1BQUEsY0FISTtBQUlKLE1BQUEsYUFKSTtBQUtKLE1BQUEsS0FMSTtBQU1KLE1BQUE7QUFOSSxRQU9GLEtBUEo7QUFTQSxVQUFNO0FBQ0osTUFBQSxRQURJO0FBRUosTUFBQSxZQUZJO0FBR0osTUFBQSxhQUhJO0FBSUosTUFBQSx3QkFKSTtBQU1KLE1BQUEsZUFOSTtBQU9KLE1BQUEsYUFQSTtBQVFKLE1BQUEsWUFSSTtBQVNKLE1BQUEsV0FUSTtBQVVKLE1BQUEsa0JBVkk7QUFXSixNQUFBO0FBWEksUUFZRixLQUFLLElBQUwsQ0FBVSx3QkFBVixFQVpKLENBVmEsQ0F3QmI7QUFDQTtBQUNBOztBQUNBLFVBQU0sbUJBQW1CLEdBQUcsY0FBYyxHQUN0QyxNQUFNLENBQUMsTUFBUCxDQUFjLEtBQWQsQ0FEc0MsR0FFdEMsUUFGSjtBQUdBLFVBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyx3QkFBRCxDQUE1QjtBQUNBLFVBQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxnQkFBeEM7QUFDQSxVQUFNLHNCQUFzQixHQUFHLFlBQVksQ0FBQyxjQUFiLEtBQWdDLEtBQS9EO0FBRUEsUUFBSSxTQUFTLEdBQUcsQ0FBaEI7QUFDQSxRQUFJLGlCQUFpQixHQUFHLENBQXhCO0FBRUEsSUFBQSxZQUFZLENBQUMsT0FBYixDQUFzQixJQUFELElBQVU7QUFDN0IsTUFBQSxTQUFTLElBQUksSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLElBQTRCLENBQXpDO0FBQ0EsTUFBQSxpQkFBaUIsSUFBSSxJQUFJLENBQUMsUUFBTCxDQUFjLGFBQWQsSUFBK0IsQ0FBcEQ7QUFDRCxLQUhEO0FBS0EsV0FBTyxXQUFXLENBQUM7QUFDakIsTUFBQSxLQURpQjtBQUVqQixNQUFBLFdBQVcsRUFBRSxpQkFBaUIsQ0FDNUIsWUFENEIsRUFFNUIsYUFGNEIsRUFHNUIsY0FINEIsRUFJNUIsS0FBSyxDQUFDLEtBQU4sSUFBZSxFQUphLENBRmI7QUFRakIsTUFBQSxjQVJpQjtBQVNqQixNQUFBLGFBVGlCO0FBVWpCLE1BQUEsU0FWaUI7QUFXakIsTUFBQSxpQkFYaUI7QUFZakIsTUFBQSxhQUFhLEVBQUUsS0FaRTtBQWFqQixNQUFBLFdBYmlCO0FBY2pCLE1BQUEsWUFkaUI7QUFlakIsTUFBQSxlQWZpQjtBQWdCakIsTUFBQSxrQkFoQmlCO0FBaUJqQixNQUFBLFdBakJpQjtBQWtCakIsTUFBQSxjQWxCaUI7QUFtQmpCLE1BQUEsUUFBUSxFQUFFLGFBQWEsQ0FBQyxNQW5CUDtBQW9CakIsTUFBQSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsTUFwQmI7QUFxQmpCLE1BQUEsVUFBVSxFQUFFLFlBQVksQ0FBQyxNQXJCUjtBQXNCakIsTUFBQSxRQXRCaUI7QUF1QmpCLE1BQUEsS0F2QmlCO0FBd0JqQixNQUFBLElBQUksRUFBRSxLQUFLLElBeEJNO0FBeUJqQixNQUFBLElBQUksRUFBRSxLQUFLLElBekJNO0FBMEJqQixNQUFBLFdBQVcsRUFBRSxLQUFLLFdBMUJEO0FBMkJqQixNQUFBLGlCQUFpQixFQUFFLEtBQUssSUFBTCxDQUFVLGlCQTNCWjtBQTRCakIsTUFBQSxnQkE1QmlCO0FBNkJqQixNQUFBLHNCQTdCaUI7QUE4QmpCLE1BQUEsbUJBQW1CLEVBQUUsS0FBSyxJQUFMLENBQVUsbUJBOUJkO0FBK0JqQixNQUFBLGdCQUFnQixFQUFFLEtBQUssSUFBTCxDQUFVLGdCQS9CWDtBQWdDakIsTUFBQSxlQUFlLEVBQUUsS0FBSyxJQUFMLENBQVUsZUFoQ1Y7QUFpQ2pCLE1BQUEscUJBQXFCLEVBQUUsS0FBSyxJQUFMLENBQVUscUJBakNoQjtBQWtDakIsTUFBQSxnQkFBZ0IsRUFBRSxLQUFLLElBQUwsQ0FBVSxnQkFsQ1g7QUFtQ2pCLE1BQUEsZUFBZSxFQUFFLEtBQUssSUFBTCxDQUFVLGVBbkNWO0FBb0NqQixNQUFBLGFBQWEsRUFBRSxLQUFLO0FBcENILEtBQUQsQ0FBbEI7QUFzQ0Q7O0FBRUQsRUFBQSxPQUFPLEdBQUk7QUFDVDtBQUNBLFVBQU0sT0FBTyxHQUFHLEtBQUssRUFBckI7QUFDQSxVQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFELENBQWxDOztBQUNBLFFBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2QsTUFBQSxPQUFPLENBQUMsR0FBUixHQUFjLEtBQWQ7QUFDRDtBQUNGOztBQUVELEVBQUEsT0FBTyxHQUFJO0FBQ1QsVUFBTTtBQUFFLE1BQUE7QUFBRixRQUFhLEtBQUssSUFBeEI7O0FBQ0EsUUFBSSxNQUFKLEVBQVk7QUFDVixXQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQW1CLElBQW5CO0FBQ0Q7QUFDRjs7QUFFRCxFQUFBLFNBQVMsR0FBSTtBQUNYLFNBQUssT0FBTDtBQUNEOztBQWpMK0MsQ0FBbEQsU0FFUyxPQUZUOztBQW9MQSxTQUFTLGFBQVQsQ0FBd0IsS0FBeEIsRUFBK0I7QUFDN0IsTUFBSSxVQUFVLEdBQUcsQ0FBakI7QUFDQSxFQUFBLEtBQUssQ0FBQyxPQUFOLENBQWUsSUFBRCxJQUFVO0FBQ3RCLElBQUEsVUFBVSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBTixDQUF0QjtBQUNELEdBRkQ7QUFHQSxTQUFPLFVBQVA7QUFDRDs7QUFFRCxTQUFTLFdBQVQsQ0FBc0IsS0FBdEIsRUFBNkI7QUFDM0IsUUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLEtBQUQsQ0FBaEM7O0FBQ0EsTUFBSSxVQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDcEIsV0FBTyxDQUFQO0FBQ0Q7O0FBRUQsUUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsTUFBTixDQUFhLENBQUMsS0FBRCxFQUFRLElBQVIsS0FBaUI7QUFDeEQsV0FBTyxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQU4sQ0FBaEM7QUFDRCxHQUYyQixFQUV6QixDQUZ5QixDQUE1QjtBQUlBLFNBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBWSxtQkFBbUIsR0FBRyxVQUF2QixHQUFxQyxFQUFoRCxJQUFzRCxFQUE3RDtBQUNEOztBQUVELFNBQVMsaUJBQVQsQ0FBNEIsWUFBNUIsRUFBMEMsYUFBMUMsRUFBeUQsY0FBekQsRUFBeUUsS0FBekUsRUFBZ0Y7QUFDOUUsTUFBSSxZQUFKLEVBQWtCO0FBQ2hCLFdBQU8sZUFBZSxDQUFDLFdBQXZCO0FBQ0Q7O0FBRUQsTUFBSSxhQUFKLEVBQW1CO0FBQ2pCLFdBQU8sZUFBZSxDQUFDLGNBQXZCO0FBQ0Q7O0FBRUQsTUFBSSxjQUFKLEVBQW9CO0FBQ2xCLFdBQU8sZUFBZSxDQUFDLGFBQXZCO0FBQ0Q7O0FBRUQsTUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDLGFBQTVCO0FBQ0EsUUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxLQUFaLENBQWhCOztBQUNBLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQTVCLEVBQW9DLENBQUMsRUFBckMsRUFBeUM7QUFDdkMsVUFBTTtBQUFFLE1BQUE7QUFBRixRQUFlLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBRCxDQUFSLENBQTFCLENBRHVDLENBRXZDOztBQUNBLFFBQUksUUFBUSxDQUFDLGFBQVQsSUFBMEIsQ0FBQyxRQUFRLENBQUMsY0FBeEMsRUFBd0Q7QUFDdEQsYUFBTyxlQUFlLENBQUMsZUFBdkI7QUFDRCxLQUxzQyxDQU12QztBQUNBOzs7QUFDQSxRQUFJLFFBQVEsQ0FBQyxVQUFULElBQXVCLEtBQUssS0FBSyxlQUFlLENBQUMsZUFBckQsRUFBc0U7QUFDcEUsTUFBQSxLQUFLLEdBQUcsZUFBZSxDQUFDLG1CQUF4QjtBQUNELEtBVnNDLENBV3ZDO0FBQ0E7OztBQUNBLFFBQ0UsUUFBUSxDQUFDLFdBQVQsSUFDRyxLQUFLLEtBQUssZUFBZSxDQUFDLGVBRDdCLElBRUcsS0FBSyxLQUFLLGVBQWUsQ0FBQyxtQkFIL0IsRUFJRTtBQUNBLE1BQUEsS0FBSyxHQUFHLGVBQWUsQ0FBQyxvQkFBeEI7QUFDRDtBQUNGOztBQUNELFNBQU8sS0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7O0FDelBEO0FBQ0E7QUFDQTtBQUNBLE1BQU0sWUFBTixDQUFtQjtBQUdqQixFQUFBLFdBQVcsR0FBSTtBQUFBO0FBQUE7QUFBQTtBQUNiLFNBQUssS0FBTCxHQUFhLEVBQWI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7QUFFRCxFQUFBLFFBQVEsR0FBSTtBQUNWLFdBQU8sS0FBSyxLQUFaO0FBQ0Q7O0FBRUQsRUFBQSxRQUFRLENBQUUsS0FBRixFQUFTO0FBQ2YsVUFBTSxTQUFTLEdBQUcsRUFBRSxHQUFHLEtBQUs7QUFBVixLQUFsQjtBQUNBLFVBQU0sU0FBUyxHQUFHLEVBQUUsR0FBRyxLQUFLLEtBQVY7QUFBaUIsU0FBRztBQUFwQixLQUFsQjtBQUVBLFNBQUssS0FBTCxHQUFhLFNBQWI7O0FBQ0EsMERBQWMsU0FBZCxFQUF5QixTQUF6QixFQUFvQyxLQUFwQztBQUNEOztBQUVELEVBQUEsU0FBUyxDQUFFLFFBQUYsRUFBWTtBQUNuQixTQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLFFBQXBCO0FBQ0EsV0FBTyxNQUFNO0FBQ1g7QUFDQSxXQUFLLFNBQUwsQ0FBZSxNQUFmLENBQ0UsS0FBSyxTQUFMLENBQWUsT0FBZixDQUF1QixRQUF2QixDQURGLEVBRUUsQ0FGRjtBQUlELEtBTkQ7QUFPRDs7QUE3QmdCOzttQkErQlAsR0FBRyxJLEVBQU07QUFDakIsT0FBSyxTQUFMLENBQWUsT0FBZixDQUF3QixRQUFELElBQWM7QUFDbkMsSUFBQSxRQUFRLENBQUMsR0FBRyxJQUFKLENBQVI7QUFDRCxHQUZEO0FBR0Q7O0FBbkNHLFksQ0FDRyxPOztBQXFDVCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLFlBQVQsR0FBeUI7QUFDeEMsU0FBTyxJQUFJLFlBQUosRUFBUDtBQUNELENBRkQ7Ozs7O0FDekNBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQW5COztBQUVBLFNBQVMsU0FBVCxHQUFzQjtBQUNwQixTQUFPLE9BQU8sTUFBUCxLQUFrQixXQUFsQixLQUNMLE9BQU8sTUFBTSxDQUFDLFFBQWQsS0FBMkIsV0FBM0IsSUFDRyxPQUFPLE1BQU0sQ0FBQyxPQUFkLEtBQTBCLFdBRDdCLElBRUcsT0FBTyxNQUFNLENBQUMsT0FBZCxLQUEwQixXQUh4QixDQUFQO0FBS0Q7O0FBRUQsU0FBUyxhQUFULEdBQTBCO0FBQ3hCLFNBQU8sT0FBTyxTQUFQLEtBQXFCLFdBQXJCLElBQ0YsT0FBTyxTQUFTLENBQUMsT0FBakIsS0FBNkIsUUFEM0IsSUFFRixTQUFTLENBQUMsT0FBVixDQUFrQixXQUFsQixPQUFvQyxhQUZ6QztBQUdELEMsQ0FFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLGNBQVQsQ0FBeUIsV0FBekIsRUFBc0M7QUFDckQsU0FBTyxDQUFDLElBQUQsRUFBTyxPQUFQLEtBQW1CO0FBQ3hCLFFBQUksU0FBUyxNQUFNLGFBQWEsRUFBaEMsRUFBb0M7QUFDbEMsYUFBTyxHQUFHLENBQUMsY0FBSixDQUFtQixXQUFuQixDQUErQixJQUEvQixFQUFxQyxPQUFyQyxDQUFQO0FBQ0Q7O0FBRUQsVUFBTSxlQUFlLEdBQUcsQ0FDdEIsS0FEc0IsRUFFdEIsV0FBVyxDQUFDLEVBRlUsRUFHdEIsT0FBTyxDQUFDLFFBSGMsRUFJdEIsSUFKc0IsQ0FJakIsR0FKaUIsQ0FBeEI7QUFNQSxXQUFPLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGVBQWhCLENBQVA7QUFDRCxHQVpEO0FBYUQsQ0FkRDs7Ozs7OztBQ3hCQSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsMkJBQUQsQ0FBMUI7O0FBQ0EsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBbkI7O0FBQ0EsTUFBTTtBQUFFLEVBQUEsUUFBRjtBQUFZLEVBQUEsYUFBWjtBQUEyQixFQUFBO0FBQTNCLElBQXNDLE9BQU8sQ0FBQyx3QkFBRCxDQUFuRDs7QUFDQSxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxvQ0FBRCxDQUFsQzs7QUFDQSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsK0JBQUQsQ0FBN0I7O0FBQ0EsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLHdCQUFELENBQXRCOztBQUNBLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyw4QkFBRCxDQUE1Qjs7QUFDQSxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsOEJBQUQsQ0FBNUI7O0FBQ0EsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGdDQUFELENBQTlCOztBQUNBLE1BQU07QUFBRSxFQUFBO0FBQUYsSUFBdUIsT0FBTyxDQUFDLGtDQUFELENBQXBDOztBQUNBLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyw2QkFBRCxDQUEzQjs7QUFDQSxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBOUI7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE1BQU0saUJBQWlCLEdBQUc7QUFDeEIsRUFBQSxRQUFRLEVBQUUsRUFEYztBQUd4QixFQUFBLFNBQVMsRUFBRSxJQUhhO0FBSXhCLEVBQUEsUUFBUSxFQUFFLEVBSmM7QUFLeEIsRUFBQSxVQUFVLEVBQUUsSUFMWTtBQU94QixFQUFBLFVBQVUsRUFBRSxJQVBZO0FBUXhCLEVBQUEsZUFBZSxFQUFFLElBUk87QUFTeEIsRUFBQSxTQUFTLEVBQUUsSUFUYTtBQVV4QixFQUFBLE9BQU8sRUFBRSxJQVZlO0FBWXhCLEVBQUEsbUJBQW1CLEVBQUUsS0FaRztBQWF4QixFQUFBLE9BQU8sRUFBRSxFQWJlO0FBY3hCLEVBQUEsWUFBWSxFQUFFLEtBZFU7QUFnQnhCLEVBQUEsU0FBUyxFQUFFLFFBaEJhO0FBaUJ4QixFQUFBLFdBQVcsRUFBRSxDQUFDLENBQUQsRUFBSSxJQUFKLEVBQVUsSUFBVixFQUFnQixJQUFoQixDQWpCVztBQWtCeEIsRUFBQSxlQUFlLEVBQUUsQ0FsQk87QUFtQnhCLEVBQUEsMEJBQTBCLEVBQUUsS0FuQko7QUFvQnhCLEVBQUEsb0JBQW9CLEVBQUUsS0FwQkU7QUFxQnhCLEVBQUEsd0JBQXdCLEVBQUU7QUFyQkYsQ0FBMUI7QUF3QkE7QUFDQTtBQUNBOztBQUNBLE1BQU0sQ0FBQyxPQUFQLHFCQUFpQixNQUFNLEdBQU4sU0FBa0IsVUFBbEIsQ0FBNkI7QUFHNUM7QUFDRjtBQUNBO0FBQ0E7QUFDRSxFQUFBLFdBQVcsQ0FBRSxJQUFGLEVBQVEsSUFBUixFQUFjO0FBQ3ZCLFVBQU0sSUFBTixFQUFZLElBQVo7QUFDQSxTQUFLLElBQUwsR0FBWSxVQUFaO0FBQ0EsU0FBSyxFQUFMLEdBQVUsS0FBSyxJQUFMLENBQVUsRUFBVixJQUFnQixLQUExQjtBQUNBLFNBQUssS0FBTCxHQUFhLEtBQWIsQ0FKdUIsQ0FNdkI7O0FBQ0EsVUFBTSxjQUFjLEdBQUc7QUFDckIsTUFBQSxrQkFBa0IsRUFBRSxJQURDO0FBRXJCLE1BQUEsS0FBSyxFQUFFLENBRmM7QUFHckIsTUFBQSxXQUFXLEVBQUUsQ0FBQyxDQUFELEVBQUksSUFBSixFQUFVLElBQVYsRUFBZ0IsSUFBaEIsQ0FIUTtBQUlyQixNQUFBLGVBQWUsRUFBRTtBQUpJLEtBQXZCLENBUHVCLENBY3ZCOztBQUNBOztBQUNBLFNBQUssSUFBTCxHQUFZLEVBQUUsR0FBRyxjQUFMO0FBQXFCLFNBQUc7QUFBeEIsS0FBWjs7QUFFQSxRQUFJLGVBQWUsSUFBbkIsRUFBeUI7QUFDdkIsWUFBTSxJQUFJLEtBQUosQ0FBVSw2REFBVixDQUFOO0FBQ0Q7QUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBOzs7QUFDSSxTQUFLLFFBQUwsR0FBZ0IsSUFBSSxnQkFBSixDQUFxQixLQUFLLElBQUwsQ0FBVSxLQUEvQixDQUFoQjtBQUVBLFNBQUssU0FBTCxHQUFpQixNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQsQ0FBakI7QUFDQSxTQUFLLGNBQUwsR0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFkLENBQXRCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBZCxDQUF2QjtBQUVBLFNBQUssbUJBQUwsR0FBMkIsS0FBSyxtQkFBTCxDQUF5QixJQUF6QixDQUE4QixJQUE5QixDQUEzQjtBQUNBLFNBQUssWUFBTCxHQUFvQixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7QUFDRDs7QUFFRCxFQUFBLG1CQUFtQixHQUFJO0FBQ3JCLFVBQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxLQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCO0FBQTFCLEtBQWQ7QUFDQSxJQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixFQUFtQixPQUFuQixDQUE0QixNQUFELElBQVk7QUFDckM7QUFDQSxVQUFJLEtBQUssQ0FBQyxNQUFELENBQUwsQ0FBYyxHQUFkLElBQXFCLEtBQUssQ0FBQyxNQUFELENBQUwsQ0FBYyxHQUFkLENBQWtCLFNBQTNDLEVBQXNEO0FBQ3BELGNBQU0sUUFBUSxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBRCxDQUFMLENBQWM7QUFBbkIsU0FBakI7QUFDQSxlQUFPLFFBQVEsQ0FBQyxTQUFoQjtBQUNBLFFBQUEsS0FBSyxDQUFDLE1BQUQsQ0FBTCxHQUFnQixFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQUQsQ0FBVjtBQUFvQixVQUFBLEdBQUcsRUFBRTtBQUF6QixTQUFoQjtBQUNEO0FBQ0YsS0FQRDtBQVNBLFNBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUI7QUFBRSxNQUFBO0FBQUYsS0FBbkI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0UsRUFBQSx1QkFBdUIsQ0FBRSxNQUFGLEVBQVUsSUFBSSxHQUFHLEVBQWpCLEVBQXFCO0FBQzFDLFFBQUksS0FBSyxTQUFMLENBQWUsTUFBZixDQUFKLEVBQTRCO0FBQzFCLFlBQU0sUUFBUSxHQUFHLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBakI7QUFFQSxNQUFBLFFBQVEsQ0FBQyxLQUFUOztBQUVBLFVBQUksSUFBSSxDQUFDLEtBQVQsRUFBZ0I7QUFDZCxRQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsSUFBZjtBQUNEOztBQUVELFdBQUssU0FBTCxDQUFlLE1BQWYsSUFBeUIsSUFBekI7QUFDRDs7QUFDRCxRQUFJLEtBQUssY0FBTCxDQUFvQixNQUFwQixDQUFKLEVBQWlDO0FBQy9CLFdBQUssY0FBTCxDQUFvQixNQUFwQixFQUE0QixNQUE1QjtBQUNBLFdBQUssY0FBTCxDQUFvQixNQUFwQixJQUE4QixJQUE5QjtBQUNEOztBQUNELFFBQUksS0FBSyxlQUFMLENBQXFCLE1BQXJCLENBQUosRUFBa0M7QUFDaEMsV0FBSyxlQUFMLENBQXFCLE1BQXJCLEVBQTZCLEtBQTdCO0FBQ0EsV0FBSyxlQUFMLENBQXFCLE1BQXJCLElBQStCLElBQS9CO0FBQ0Q7QUFDRjtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLE1BQU0sQ0FBRSxJQUFGLEVBQVE7QUFDWixTQUFLLHVCQUFMLENBQTZCLElBQUksQ0FBQyxFQUFsQyxFQURZLENBR1o7O0FBQ0EsV0FBTyxJQUFJLE9BQUosQ0FBWSxDQUFDLE9BQUQsRUFBVSxNQUFWLEtBQXFCO0FBQ3RDLFdBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxnQkFBZixFQUFpQyxJQUFqQztBQUVBLFlBQU0sSUFBSSxHQUFHLEVBQ1gsR0FBRyxLQUFLLElBREc7QUFFWCxZQUFJLElBQUksQ0FBQyxHQUFMLElBQVksRUFBaEI7QUFGVyxPQUFiOztBQUtBLFVBQUksT0FBTyxJQUFJLENBQUMsT0FBWixLQUF3QixVQUE1QixFQUF3QztBQUN0QyxRQUFBLElBQUksQ0FBQyxPQUFMLEdBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBQWY7QUFDRDtBQUVEOzs7QUFDQSxZQUFNLGFBQWEsR0FBRyxFQUNwQixHQUFHLGlCQURpQjtBQUVwQixXQUFHO0FBRmlCLE9BQXRCLENBYnNDLENBa0J0QztBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFBLGFBQWEsQ0FBQyxXQUFkLEdBQTRCLGNBQWMsQ0FBQyxJQUFELENBQTFDOztBQUVBLE1BQUEsYUFBYSxDQUFDLGVBQWQsR0FBaUMsR0FBRCxJQUFTO0FBQ3ZDLGNBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxtQkFBSixFQUFaO0FBQ0EsUUFBQSxHQUFHLENBQUMsZUFBSixHQUFzQixDQUFDLENBQUMsSUFBSSxDQUFDLGVBQTdCOztBQUVBLFlBQUksT0FBTyxJQUFJLENBQUMsZUFBWixLQUFnQyxVQUFwQyxFQUFnRDtBQUM5QyxVQUFBLElBQUksQ0FBQyxlQUFMLENBQXFCLEdBQXJCO0FBQ0Q7QUFDRixPQVBEOztBQVNBLE1BQUEsYUFBYSxDQUFDLE9BQWQsR0FBeUIsR0FBRCxJQUFTO0FBQy9CLGFBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxHQUFkO0FBRUEsY0FBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLGVBQUosR0FBc0IsR0FBRyxDQUFDLGVBQUosQ0FBb0IsbUJBQXBCLEVBQXRCLEdBQWtFLElBQTlFOztBQUNBLFlBQUksY0FBYyxDQUFDLEdBQUQsQ0FBbEIsRUFBeUI7QUFDdkIsVUFBQSxHQUFHLEdBQUcsSUFBSSxZQUFKLENBQWlCLEdBQWpCLEVBQXNCLEdBQXRCLENBQU47QUFDRDs7QUFFRCxhQUFLLHVCQUFMLENBQTZCLElBQUksQ0FBQyxFQUFsQztBQUNBLFFBQUEsYUFBYSxDQUFDLElBQWQ7QUFFQSxhQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsY0FBZixFQUErQixJQUEvQixFQUFxQyxHQUFyQztBQUVBLFFBQUEsTUFBTSxDQUFDLEdBQUQsQ0FBTjtBQUNELE9BZEQ7O0FBZ0JBLE1BQUEsYUFBYSxDQUFDLFVBQWQsR0FBMkIsQ0FBQyxhQUFELEVBQWdCLFVBQWhCLEtBQStCO0FBQ3hELGFBQUssa0JBQUwsQ0FBd0IsSUFBeEIsRUFBOEIsTUFBTSxDQUFDLEdBQXJDO0FBQ0EsYUFBSyxJQUFMLENBQVUsSUFBVixDQUFlLGlCQUFmLEVBQWtDLElBQWxDLEVBQXdDO0FBQ3RDLFVBQUEsUUFBUSxFQUFFLElBRDRCO0FBRXRDLFVBQUEsYUFGc0M7QUFHdEMsVUFBQTtBQUhzQyxTQUF4QztBQUtELE9BUEQ7O0FBU0EsTUFBQSxhQUFhLENBQUMsU0FBZCxHQUEwQixNQUFNO0FBQzlCLGNBQU0sVUFBVSxHQUFHO0FBQ2pCLFVBQUEsU0FBUyxFQUFFLE1BQU0sQ0FBQztBQURELFNBQW5CO0FBSUEsYUFBSyx1QkFBTCxDQUE2QixJQUFJLENBQUMsRUFBbEM7QUFDQSxRQUFBLGFBQWEsQ0FBQyxJQUFkO0FBRUEsYUFBSyxJQUFMLENBQVUsSUFBVixDQUFlLGdCQUFmLEVBQWlDLElBQWpDLEVBQXVDLFVBQXZDOztBQUVBLFlBQUksTUFBTSxDQUFDLEdBQVgsRUFBZ0I7QUFDZCxlQUFLLElBQUwsQ0FBVSxHQUFWLENBQWUsWUFBVyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQUssU0FBUSxNQUFNLENBQUMsR0FBSSxFQUE5RDtBQUNEOztBQUVELFFBQUEsT0FBTyxDQUFDLE1BQUQsQ0FBUDtBQUNELE9BZkQ7O0FBaUJBLFlBQU0sUUFBUSxHQUFHLENBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxRQUFmLEtBQTRCO0FBQzNDLFlBQUksV0FBVyxDQUFDLEdBQUQsRUFBTSxPQUFOLENBQVgsSUFBNkIsQ0FBQyxXQUFXLENBQUMsR0FBRCxFQUFNLFFBQU4sQ0FBN0MsRUFBOEQ7QUFDNUQsVUFBQSxHQUFHLENBQUMsUUFBRCxDQUFILEdBQWdCLEdBQUcsQ0FBQyxPQUFELENBQW5CO0FBQ0Q7QUFDRixPQUpEO0FBTUE7OztBQUNBLFlBQU0sSUFBSSxHQUFHLEVBQWI7QUFDQSxZQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTixDQUFjLElBQUksQ0FBQyxVQUFuQixJQUNmLElBQUksQ0FBQyxVQURVLENBRWpCO0FBRmlCLFFBR2YsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFJLENBQUMsSUFBakIsQ0FISjtBQUlBLE1BQUEsVUFBVSxDQUFDLE9BQVgsQ0FBb0IsSUFBRCxJQUFVO0FBQzNCLFFBQUEsSUFBSSxDQUFDLElBQUQsQ0FBSixHQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFiO0FBQ0QsT0FGRCxFQXZGc0MsQ0EyRnRDOztBQUNBLE1BQUEsUUFBUSxDQUFDLElBQUQsRUFBTyxNQUFQLEVBQWUsVUFBZixDQUFSO0FBQ0EsTUFBQSxRQUFRLENBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxVQUFmLENBQVI7QUFFQSxNQUFBLGFBQWEsQ0FBQyxRQUFkLEdBQXlCLElBQXpCO0FBRUEsWUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBUixDQUFlLElBQUksQ0FBQyxJQUFwQixFQUEwQixhQUExQixDQUFmO0FBQ0EsV0FBSyxTQUFMLENBQWUsSUFBSSxDQUFDLEVBQXBCLElBQTBCLE1BQTFCO0FBQ0EsV0FBSyxjQUFMLENBQW9CLElBQUksQ0FBQyxFQUF6QixJQUErQixJQUFJLFlBQUosQ0FBaUIsS0FBSyxJQUF0QixDQUEvQjtBQUVBLE1BQUEsTUFBTSxDQUFDLG1CQUFQLEdBQTZCLElBQTdCLENBQW1DLGVBQUQsSUFBcUI7QUFDckQsY0FBTSxjQUFjLEdBQUcsZUFBZSxDQUFDLENBQUQsQ0FBdEM7O0FBQ0EsWUFBSSxjQUFKLEVBQW9CO0FBQ2xCLGVBQUssSUFBTCxDQUFVLEdBQVYsQ0FBZSw0QkFBMkIsSUFBSSxDQUFDLEVBQUcsZUFBYyxjQUFjLENBQUMsWUFBYSxFQUE1RjtBQUNBLFVBQUEsTUFBTSxDQUFDLHdCQUFQLENBQWdDLGNBQWhDO0FBQ0Q7QUFDRixPQU5EO0FBUUEsVUFBSSxhQUFhLEdBQUcsS0FBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixNQUFNO0FBQzFDLFlBQUksQ0FBQyxJQUFJLENBQUMsUUFBVixFQUFvQjtBQUNsQixVQUFBLE1BQU0sQ0FBQyxLQUFQO0FBQ0QsU0FIeUMsQ0FJMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxlQUFPLE1BQU0sQ0FBRSxDQUFmO0FBQ0QsT0FYbUIsQ0FBcEI7QUFhQSxXQUFLLFlBQUwsQ0FBa0IsSUFBSSxDQUFDLEVBQXZCLEVBQTRCLFlBQUQsSUFBa0I7QUFDM0MsUUFBQSxhQUFhLENBQUMsS0FBZDtBQUNBLGFBQUssdUJBQUwsQ0FBNkIsSUFBSSxDQUFDLEVBQWxDLEVBQXNDO0FBQUUsVUFBQSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUFsQixTQUF0QztBQUNBLFFBQUEsT0FBTyxDQUFFLFVBQVMsWUFBYSxjQUF4QixDQUFQO0FBQ0QsT0FKRDtBQU1BLFdBQUssT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixFQUF1QixRQUFELElBQWM7QUFDbEMsWUFBSSxRQUFKLEVBQWM7QUFDWjtBQUNBLFVBQUEsYUFBYSxDQUFDLEtBQWQ7QUFDQSxVQUFBLE1BQU0sQ0FBQyxLQUFQO0FBQ0QsU0FKRCxNQUlPO0FBQ0w7QUFDQTtBQUNBLFVBQUEsYUFBYSxDQUFDLEtBQWQ7QUFDQSxVQUFBLGFBQWEsR0FBRyxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLE1BQU07QUFDdEMsWUFBQSxNQUFNLENBQUMsS0FBUDtBQUNBLG1CQUFPLE1BQU0sQ0FBRSxDQUFmO0FBQ0QsV0FIZSxDQUFoQjtBQUlEO0FBQ0YsT0FkRDtBQWdCQSxXQUFLLFVBQUwsQ0FBZ0IsSUFBSSxDQUFDLEVBQXJCLEVBQXlCLE1BQU07QUFDN0IsUUFBQSxhQUFhLENBQUMsS0FBZDtBQUNBLFFBQUEsTUFBTSxDQUFDLEtBQVA7QUFDRCxPQUhEO0FBS0EsV0FBSyxXQUFMLENBQWlCLElBQUksQ0FBQyxFQUF0QixFQUEwQixNQUFNO0FBQzlCLFFBQUEsYUFBYSxDQUFDLEtBQWQ7QUFDQSxhQUFLLHVCQUFMLENBQTZCLElBQUksQ0FBQyxFQUFsQyxFQUFzQztBQUFFLFVBQUEsS0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFBbEIsU0FBdEM7QUFDQSxRQUFBLE9BQU8sQ0FBRSxVQUFTLElBQUksQ0FBQyxFQUFHLGVBQW5CLENBQVA7QUFDRCxPQUpEO0FBTUEsV0FBSyxXQUFMLENBQWlCLElBQUksQ0FBQyxFQUF0QixFQUEwQixNQUFNO0FBQzlCLFFBQUEsYUFBYSxDQUFDLEtBQWQ7O0FBQ0EsWUFBSSxJQUFJLENBQUMsS0FBVCxFQUFnQjtBQUNkLFVBQUEsTUFBTSxDQUFDLEtBQVA7QUFDRDs7QUFDRCxRQUFBLGFBQWEsR0FBRyxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLE1BQU07QUFDdEMsVUFBQSxNQUFNLENBQUMsS0FBUDtBQUNBLGlCQUFPLE1BQU0sQ0FBRSxDQUFmO0FBQ0QsU0FIZSxDQUFoQjtBQUlELE9BVEQ7QUFVRCxLQXJLTSxFQXFLSixLQXJLSSxDQXFLRyxHQUFELElBQVM7QUFDaEIsV0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLGNBQWYsRUFBK0IsSUFBL0IsRUFBcUMsR0FBckM7QUFDQSxZQUFNLEdBQU47QUFDRCxLQXhLTSxDQUFQO0FBeUtEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLFlBQVksQ0FBRSxJQUFGLEVBQVE7QUFDbEIsU0FBSyx1QkFBTCxDQUE2QixJQUFJLENBQUMsRUFBbEM7QUFFQSxVQUFNLElBQUksR0FBRyxFQUFFLEdBQUcsS0FBSztBQUFWLEtBQWI7O0FBQ0EsUUFBSSxJQUFJLENBQUMsR0FBVCxFQUFjO0FBQ1o7QUFDQSxNQUFBLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBZCxFQUFvQixJQUFJLENBQUMsR0FBekI7QUFDRDs7QUFFRCxTQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsZ0JBQWYsRUFBaUMsSUFBakM7QUFDQSxTQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsSUFBSSxDQUFDLE1BQUwsQ0FBWSxHQUExQjs7QUFFQSxRQUFJLElBQUksQ0FBQyxXQUFULEVBQXNCO0FBQ3BCLGFBQU8sS0FBSyxxQkFBTCxDQUEyQixJQUEzQixDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxJQUFJLE9BQUosQ0FBWSxDQUFDLE9BQUQsRUFBVSxNQUFWLEtBQXFCO0FBQ3RDLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFMLENBQVksZUFBWixDQUE0QixRQUE1QixHQUF1QyxRQUF2QyxHQUFrRCxhQUFqRTtBQUNBLFlBQU0sTUFBTSxHQUFHLElBQUksTUFBSixDQUFXLEtBQUssSUFBaEIsRUFBc0IsSUFBSSxDQUFDLE1BQUwsQ0FBWSxlQUFsQyxDQUFmLENBRnNDLENBSXRDOztBQUNBLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFJLENBQUMsTUFBTCxDQUFZLEdBQXhCLEVBQTZCLEVBQzNCLEdBQUcsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQURZO0FBRTNCLFFBQUEsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUZZO0FBRzNCLFFBQUEsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUhXO0FBSTNCLFFBQUEsUUFBUSxFQUFFLEtBSmlCO0FBSzNCLFFBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFMLENBQVUsSUFMVztBQU0zQixRQUFBLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FOYTtBQU8zQixRQUFBLFFBQVEsRUFBRSxJQUFJLENBQUM7QUFQWSxPQUE3QixFQVFHLElBUkgsQ0FRUyxHQUFELElBQVM7QUFDZixhQUFLLElBQUwsQ0FBVSxZQUFWLENBQXVCLElBQUksQ0FBQyxFQUE1QixFQUFnQztBQUFFLFVBQUEsV0FBVyxFQUFFLEdBQUcsQ0FBQztBQUFuQixTQUFoQztBQUNBLFFBQUEsSUFBSSxHQUFHLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsSUFBSSxDQUFDLEVBQXZCLENBQVA7QUFDQSxlQUFPLEtBQUsscUJBQUwsQ0FBMkIsSUFBM0IsQ0FBUDtBQUNELE9BWkQsRUFZRyxJQVpILENBWVEsTUFBTTtBQUNaLFFBQUEsT0FBTztBQUNSLE9BZEQsRUFjRyxLQWRILENBY1UsR0FBRCxJQUFTO0FBQ2hCLGFBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxjQUFmLEVBQStCLElBQS9CLEVBQXFDLEdBQXJDO0FBQ0EsUUFBQSxNQUFNLENBQUMsR0FBRCxDQUFOO0FBQ0QsT0FqQkQ7QUFrQkQsS0F2Qk0sQ0FBUDtBQXdCRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNFLEVBQUEscUJBQXFCLENBQUUsSUFBRixFQUFRO0FBQzNCLFdBQU8sSUFBSSxPQUFKLENBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixLQUFxQjtBQUN0QyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBbkI7QUFDQSxZQUFNLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQUwsQ0FBWSxZQUFiLENBQTFCO0FBQ0EsWUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFKLENBQVc7QUFBRSxRQUFBLE1BQU0sRUFBRyxHQUFFLElBQUssUUFBTyxLQUFNLEVBQS9CO0FBQWtDLFFBQUEsUUFBUSxFQUFFO0FBQTVDLE9BQVgsQ0FBZjtBQUNBLFdBQUssZUFBTCxDQUFxQixJQUFJLENBQUMsRUFBMUIsSUFBZ0MsTUFBaEM7QUFDQSxXQUFLLGNBQUwsQ0FBb0IsSUFBSSxDQUFDLEVBQXpCLElBQStCLElBQUksWUFBSixDQUFpQixLQUFLLElBQXRCLENBQS9CO0FBRUEsV0FBSyxZQUFMLENBQWtCLElBQUksQ0FBQyxFQUF2QixFQUEyQixNQUFNO0FBQy9CLFFBQUEsYUFBYSxDQUFDLEtBQWQ7QUFDQSxRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixFQUF0QjtBQUNBLGFBQUssdUJBQUwsQ0FBNkIsSUFBSSxDQUFDLEVBQWxDO0FBQ0EsUUFBQSxPQUFPLENBQUUsVUFBUyxJQUFJLENBQUMsRUFBRyxjQUFuQixDQUFQO0FBQ0QsT0FMRDtBQU9BLFdBQUssT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixFQUF1QixRQUFELElBQWM7QUFDbEMsWUFBSSxRQUFKLEVBQWM7QUFDWjtBQUNBLFVBQUEsYUFBYSxDQUFDLEtBQWQ7QUFDQSxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBWixFQUFxQixFQUFyQjtBQUNELFNBSkQsTUFJTztBQUNMO0FBQ0E7QUFDQSxVQUFBLGFBQWEsQ0FBQyxLQUFkO0FBQ0EsVUFBQSxhQUFhLEdBQUcsS0FBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixNQUFNO0FBQ3RDLFlBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxRQUFaLEVBQXNCLEVBQXRCO0FBQ0EsbUJBQU8sTUFBTSxDQUFFLENBQWY7QUFDRCxXQUhlLENBQWhCO0FBSUQ7QUFDRixPQWREO0FBZ0JBLFdBQUssVUFBTCxDQUFnQixJQUFJLENBQUMsRUFBckIsRUFBeUIsTUFBTTtBQUM3QixRQUFBLGFBQWEsQ0FBQyxLQUFkO0FBQ0EsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosRUFBcUIsRUFBckI7QUFDRCxPQUhEO0FBS0EsV0FBSyxXQUFMLENBQWlCLElBQUksQ0FBQyxFQUF0QixFQUEwQixNQUFNO0FBQzlCLFFBQUEsYUFBYSxDQUFDLEtBQWQ7QUFDQSxRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixFQUF0QjtBQUNBLGFBQUssdUJBQUwsQ0FBNkIsSUFBSSxDQUFDLEVBQWxDO0FBQ0EsUUFBQSxPQUFPLENBQUUsVUFBUyxJQUFJLENBQUMsRUFBRyxlQUFuQixDQUFQO0FBQ0QsT0FMRDtBQU9BLFdBQUssV0FBTCxDQUFpQixJQUFJLENBQUMsRUFBdEIsRUFBMEIsTUFBTTtBQUM5QixRQUFBLGFBQWEsQ0FBQyxLQUFkOztBQUNBLFlBQUksSUFBSSxDQUFDLEtBQVQsRUFBZ0I7QUFDZCxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBWixFQUFxQixFQUFyQjtBQUNEOztBQUNELFFBQUEsYUFBYSxHQUFHLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsTUFBTTtBQUN0QyxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixFQUF0QjtBQUNBLGlCQUFPLE1BQU0sQ0FBRSxDQUFmO0FBQ0QsU0FIZSxDQUFoQjtBQUlELE9BVEQ7QUFXQSxXQUFLLE9BQUwsQ0FBYSxJQUFJLENBQUMsRUFBbEIsRUFBc0IsTUFBTTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUksTUFBTSxDQUFDLE1BQVgsRUFBbUI7QUFDakIsVUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosRUFBcUIsRUFBckI7QUFDQSxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixFQUF0QjtBQUNEO0FBQ0YsT0FURDtBQVdBLFdBQUssVUFBTCxDQUFnQixJQUFJLENBQUMsRUFBckIsRUFBeUIsTUFBTTtBQUM3QjtBQUNBLFlBQUksTUFBTSxDQUFDLE1BQVgsRUFBbUI7QUFDakIsVUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosRUFBcUIsRUFBckI7QUFDQSxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixFQUF0QjtBQUNEO0FBQ0YsT0FORDtBQVFBLE1BQUEsTUFBTSxDQUFDLEVBQVAsQ0FBVSxVQUFWLEVBQXVCLFlBQUQsSUFBa0Isa0JBQWtCLENBQUMsSUFBRCxFQUFPLFlBQVAsRUFBcUIsSUFBckIsQ0FBMUQ7QUFFQSxNQUFBLE1BQU0sQ0FBQyxFQUFQLENBQVUsT0FBVixFQUFvQixPQUFELElBQWE7QUFDOUIsY0FBTTtBQUFFLFVBQUE7QUFBRixZQUFjLE9BQU8sQ0FBQyxLQUE1QjtBQUNBLGNBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBSSxLQUFKLENBQVUsT0FBVixDQUFkLEVBQWtDO0FBQUUsVUFBQSxLQUFLLEVBQUUsT0FBTyxDQUFDO0FBQWpCLFNBQWxDLENBQWQsQ0FGOEIsQ0FJOUI7QUFDQTs7QUFDQSxZQUFJLENBQUMsS0FBSyxJQUFMLENBQVUsa0JBQWYsRUFBbUM7QUFDakMsZUFBSyx1QkFBTCxDQUE2QixJQUFJLENBQUMsRUFBbEMsRUFEaUMsQ0FFakM7O0FBQ0EsZUFBSyxJQUFMLENBQVUsWUFBVixDQUF1QixJQUFJLENBQUMsRUFBNUIsRUFBZ0M7QUFDOUIsWUFBQSxXQUFXLEVBQUU7QUFEaUIsV0FBaEM7QUFHRCxTQU5ELE1BTU87QUFDTCxVQUFBLE1BQU0sQ0FBQyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxJQUFMLENBQVUsSUFBVixDQUFlLGNBQWYsRUFBK0IsSUFBL0IsRUFBcUMsS0FBckM7QUFDQSxRQUFBLGFBQWEsQ0FBQyxJQUFkO0FBQ0EsUUFBQSxNQUFNLENBQUMsS0FBRCxDQUFOO0FBQ0QsT0FuQkQ7QUFxQkEsTUFBQSxNQUFNLENBQUMsRUFBUCxDQUFVLFNBQVYsRUFBc0IsSUFBRCxJQUFVO0FBQzdCLGNBQU0sVUFBVSxHQUFHO0FBQ2pCLFVBQUEsU0FBUyxFQUFFLElBQUksQ0FBQztBQURDLFNBQW5CO0FBSUEsYUFBSyxJQUFMLENBQVUsSUFBVixDQUFlLGdCQUFmLEVBQWlDLElBQWpDLEVBQXVDLFVBQXZDO0FBQ0EsYUFBSyx1QkFBTCxDQUE2QixJQUFJLENBQUMsRUFBbEM7QUFDQSxRQUFBLGFBQWEsQ0FBQyxJQUFkO0FBRUEsUUFBQSxPQUFPO0FBQ1IsT0FWRDtBQVlBLFVBQUksYUFBYSxHQUFHLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsTUFBTTtBQUMxQyxRQUFBLE1BQU0sQ0FBQyxJQUFQOztBQUNBLFlBQUksSUFBSSxDQUFDLFFBQVQsRUFBbUI7QUFDakIsVUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosRUFBcUIsRUFBckI7QUFDRCxTQUp5QyxDQU0xQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLGVBQU8sTUFBTSxDQUFFLENBQWY7QUFDRCxPQWJtQixDQUFwQjtBQWNELEtBekhNLENBQVA7QUEwSEQ7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0UsRUFBQSxrQkFBa0IsQ0FBRSxJQUFGLEVBQVEsU0FBUixFQUFtQjtBQUNuQyxVQUFNLFdBQVcsR0FBRyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLElBQUksQ0FBQyxFQUF2QixDQUFwQjtBQUNBLFFBQUksQ0FBQyxXQUFMLEVBQWtCLE9BRmlCLENBR25DOztBQUNBLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBYixJQUFvQixXQUFXLENBQUMsR0FBWixDQUFnQixTQUFoQixLQUE4QixTQUF0RCxFQUFpRTtBQUMvRCxXQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsMEJBQWQ7QUFDQSxXQUFLLElBQUwsQ0FBVSxZQUFWLENBQXVCLFdBQVcsQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxRQUFBLEdBQUcsRUFBRSxFQUFFLEdBQUcsV0FBVyxDQUFDLEdBQWpCO0FBQXNCLFVBQUEsU0FBUyxFQUFFO0FBQWpDO0FBRGdDLE9BQXZDO0FBR0Q7QUFDRjtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLFlBQVksQ0FBRSxNQUFGLEVBQVUsRUFBVixFQUFjO0FBQ3hCLFNBQUssY0FBTCxDQUFvQixNQUFwQixFQUE0QixFQUE1QixDQUErQixjQUEvQixFQUFnRCxJQUFELElBQVU7QUFDdkQsVUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLEVBQXBCLEVBQXdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBTixDQUFGO0FBQ3pCLEtBRkQ7QUFHRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLE9BQU8sQ0FBRSxNQUFGLEVBQVUsRUFBVixFQUFjO0FBQ25CLFNBQUssY0FBTCxDQUFvQixNQUFwQixFQUE0QixFQUE1QixDQUErQixjQUEvQixFQUErQyxDQUFDLFlBQUQsRUFBZSxRQUFmLEtBQTRCO0FBQ3pFLFVBQUksTUFBTSxLQUFLLFlBQWYsRUFBNkI7QUFDM0I7QUFDQSxRQUFBLEVBQUUsQ0FBQyxRQUFELENBQUY7QUFDRDtBQUNGLEtBTEQ7QUFNRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLE9BQU8sQ0FBRSxNQUFGLEVBQVUsRUFBVixFQUFjO0FBQ25CLFNBQUssY0FBTCxDQUFvQixNQUFwQixFQUE0QixFQUE1QixDQUErQixjQUEvQixFQUFnRCxZQUFELElBQWtCO0FBQy9ELFVBQUksTUFBTSxLQUFLLFlBQWYsRUFBNkI7QUFDM0IsUUFBQSxFQUFFO0FBQ0g7QUFDRixLQUpEO0FBS0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O0FBQ0UsRUFBQSxVQUFVLENBQUUsTUFBRixFQUFVLEVBQVYsRUFBYztBQUN0QixTQUFLLGNBQUwsQ0FBb0IsTUFBcEIsRUFBNEIsRUFBNUIsQ0FBK0IsV0FBL0IsRUFBNEMsTUFBTTtBQUNoRCxVQUFJLENBQUMsS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixNQUFsQixDQUFMLEVBQWdDO0FBQ2hDLE1BQUEsRUFBRTtBQUNILEtBSEQ7QUFJRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7QUFDRSxFQUFBLFVBQVUsQ0FBRSxNQUFGLEVBQVUsRUFBVixFQUFjO0FBQ3RCLFNBQUssY0FBTCxDQUFvQixNQUFwQixFQUE0QixFQUE1QixDQUErQixXQUEvQixFQUE0QyxNQUFNO0FBQ2hELFVBQUksQ0FBQyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLE1BQWxCLENBQUwsRUFBZ0M7QUFDaEMsTUFBQSxFQUFFO0FBQ0gsS0FIRDtBQUlEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7OztBQUNFLEVBQUEsV0FBVyxDQUFFLE1BQUYsRUFBVSxFQUFWLEVBQWM7QUFDdkIsU0FBSyxjQUFMLENBQW9CLE1BQXBCLEVBQTRCLEVBQTVCLENBQStCLFlBQS9CLEVBQTZDLE1BQU07QUFDakQsVUFBSSxDQUFDLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBTCxFQUFnQztBQUNoQyxNQUFBLEVBQUU7QUFDSCxLQUhEO0FBSUQ7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O0FBQ0UsRUFBQSxXQUFXLENBQUUsTUFBRixFQUFVLEVBQVYsRUFBYztBQUN2QixTQUFLLGNBQUwsQ0FBb0IsTUFBcEIsRUFBNEIsRUFBNUIsQ0FBK0IsWUFBL0IsRUFBNkMsTUFBTTtBQUNqRCxVQUFJLENBQUMsS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixNQUFsQixDQUFMLEVBQWdDO0FBQ2hDLE1BQUEsRUFBRTtBQUNILEtBSEQ7QUFJRDtBQUVEO0FBQ0Y7QUFDQTs7O0FBQ0UsRUFBQSxXQUFXLENBQUUsS0FBRixFQUFTO0FBQ2xCLFVBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBQyxJQUFELEVBQU8sQ0FBUCxLQUFhO0FBQ3RDLFlBQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFwQjtBQUNBLFlBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFwQjs7QUFFQSxVQUFJLFdBQVcsSUFBWCxJQUFtQixJQUFJLENBQUMsS0FBNUIsRUFBbUM7QUFDakMsZUFBTyxPQUFPLENBQUMsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLElBQUksQ0FBQyxLQUFmLENBQWYsQ0FBUDtBQUNEOztBQUFDLFVBQUksSUFBSSxDQUFDLFFBQVQsRUFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsWUFBSSxDQUFDLElBQUksQ0FBQyxRQUFMLENBQWMsYUFBZixJQUFnQyxDQUFDLElBQUksQ0FBQyxVQUExQyxFQUFzRDtBQUNwRCxlQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsZ0JBQWYsRUFBaUMsSUFBakM7QUFDRDs7QUFDRCxlQUFPLEtBQUssWUFBTCxDQUFrQixJQUFsQixFQUF3QixPQUF4QixFQUFpQyxLQUFqQyxDQUFQO0FBQ0QsT0FkcUMsQ0FldEM7OztBQUNBLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBTCxDQUFjLGFBQWYsSUFBZ0MsQ0FBQyxJQUFJLENBQUMsVUFBMUMsRUFBc0Q7QUFDcEQsYUFBSyxJQUFMLENBQVUsSUFBVixDQUFlLGdCQUFmLEVBQWlDLElBQWpDO0FBQ0Q7O0FBQ0QsYUFBTyxLQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLE9BQWxCLEVBQTJCLEtBQTNCLENBQVA7QUFDRCxLQXBCZ0IsQ0FBakI7QUFzQkEsV0FBTyxNQUFNLENBQUMsUUFBRCxDQUFiO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7OztBQUNFLEVBQUEsWUFBWSxDQUFFLE9BQUYsRUFBVztBQUNyQixRQUFJLE9BQU8sQ0FBQyxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLFdBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYywwQkFBZDtBQUNBLGFBQU8sT0FBTyxDQUFDLE9BQVIsRUFBUDtBQUNEOztBQUVELFFBQUksS0FBSyxJQUFMLENBQVUsS0FBVixLQUFvQixDQUF4QixFQUEyQjtBQUN6QixXQUFLLElBQUwsQ0FBVSxHQUFWLENBQ0UscU9BREYsRUFFRSxTQUZGO0FBSUQ7O0FBRUQsU0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLG9CQUFkO0FBQ0EsVUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQVIsQ0FBYSxNQUFELElBQVksS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixNQUFsQixDQUF4QixDQUF0QjtBQUVBLFdBQU8sS0FBSyxXQUFMLENBQWlCLGFBQWpCLEVBQ0osSUFESSxDQUNDLE1BQU0sSUFEUCxDQUFQO0FBRUQ7O0FBRUQsRUFBQSxPQUFPLEdBQUk7QUFDVCxTQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CO0FBQ2pCLE1BQUEsWUFBWSxFQUFFLEVBQUUsR0FBRyxLQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCLFlBQTFCO0FBQXdDLFFBQUEsZ0JBQWdCLEVBQUU7QUFBMUQ7QUFERyxLQUFuQjtBQUdBLFNBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsS0FBSyxZQUEzQjtBQUVBLFNBQUssSUFBTCxDQUFVLEVBQVYsQ0FBYSxnQkFBYixFQUErQixLQUFLLG1CQUFwQztBQUNEOztBQUVELEVBQUEsU0FBUyxHQUFJO0FBQ1gsU0FBSyxJQUFMLENBQVUsUUFBVixDQUFtQjtBQUNqQixNQUFBLFlBQVksRUFBRSxFQUFFLEdBQUcsS0FBSyxJQUFMLENBQVUsUUFBVixHQUFxQixZQUExQjtBQUF3QyxRQUFBLGdCQUFnQixFQUFFO0FBQTFEO0FBREcsS0FBbkI7QUFHQSxTQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLEtBQUssWUFBOUI7QUFDRDs7QUFub0IyQyxDQUE5QyxTQUNTLE9BRFQ7Ozs7Ozs7Ozs7Ozs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLENBQUMsT0FBUCxnSUFBaUIsTUFBTSxZQUFOLENBQW1CO0FBS2xDLEVBQUEsV0FBVyxDQUFFLE9BQUYsRUFBVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBRlo7QUFFWTtBQUNwQiw0REFBZ0IsT0FBaEI7QUFDRDs7QUFFRCxFQUFBLEVBQUUsQ0FBRSxLQUFGLEVBQVMsRUFBVCxFQUFhO0FBQ2Isd0RBQWEsSUFBYixDQUFrQixDQUFDLEtBQUQsRUFBUSxFQUFSLENBQWxCOztBQUNBLFdBQU8sc0RBQWMsRUFBZCxDQUFpQixLQUFqQixFQUF3QixFQUF4QixDQUFQO0FBQ0Q7O0FBRUQsRUFBQSxNQUFNLEdBQUk7QUFDUixTQUFLLE1BQU0sQ0FBQyxLQUFELEVBQVEsRUFBUixDQUFYLElBQTBCLG9EQUFhLE1BQWIsQ0FBb0IsQ0FBcEIsQ0FBMUIsRUFBa0Q7QUFDaEQsNERBQWMsR0FBZCxDQUFrQixLQUFsQixFQUF5QixFQUF6QjtBQUNEO0FBQ0Y7O0FBbEJpQyxDQUFwQzs7Ozs7QUNKQSxNQUFNLFlBQU4sU0FBMkIsS0FBM0IsQ0FBaUM7QUFDL0IsRUFBQSxXQUFXLENBQUUsS0FBRixFQUFTLEdBQUcsR0FBRyxJQUFmLEVBQXFCO0FBQzlCLFVBQU8sdUdBQVA7QUFFQSxTQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsR0FBZjtBQUNEOztBQVA4Qjs7QUFVakMsTUFBTSxDQUFDLE9BQVAsR0FBaUIsWUFBakI7Ozs7Ozs7Ozs7O0FDVkEsU0FBUyxpQkFBVCxHQUE4QjtBQUM1QixTQUFPLElBQUksS0FBSixDQUFVLFdBQVYsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsTUFBTSxnQkFBTixDQUF1QjtBQUtyQixFQUFBLFdBQVcsQ0FBRSxLQUFGLEVBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFKRjtBQUlFO0FBQUE7QUFBQTtBQUFBLGFBRkY7QUFFRTs7QUFDbEIsUUFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBakIsSUFBNkIsS0FBSyxLQUFLLENBQTNDLEVBQThDO0FBQzVDLFdBQUssS0FBTCxHQUFhLFFBQWI7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0Q7QUFDRjs7QUF1RkQsRUFBQSxHQUFHLENBQUUsRUFBRixFQUFNLFlBQU4sRUFBb0I7QUFDckIsUUFBSSxzRUFBdUIsS0FBSyxLQUFoQyxFQUF1QztBQUNyQyx5Q0FBTyxJQUFQLGdCQUFrQixFQUFsQjtBQUNEOztBQUNELHVDQUFPLElBQVAsa0JBQW1CLEVBQW5CLEVBQXVCLFlBQXZCO0FBQ0Q7O0FBRUQsRUFBQSxtQkFBbUIsQ0FBRSxFQUFGLEVBQU0sWUFBTixFQUFvQjtBQUNyQyxXQUFPLENBQUMsR0FBRyxJQUFKLEtBQWE7QUFDbEIsVUFBSSxhQUFKO0FBQ0EsWUFBTSxZQUFZLEdBQUcsSUFBSSxPQUFKLENBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixLQUFxQjtBQUNwRCxRQUFBLGFBQWEsR0FBRyxLQUFLLEdBQUwsQ0FBUyxNQUFNO0FBQzdCLGNBQUksV0FBSjtBQUNBLGNBQUksWUFBSjs7QUFDQSxjQUFJO0FBQ0YsWUFBQSxZQUFZLEdBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsRUFBRSxDQUFDLEdBQUcsSUFBSixDQUFsQixDQUFmO0FBQ0QsV0FGRCxDQUVFLE9BQU8sR0FBUCxFQUFZO0FBQ1osWUFBQSxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQVIsQ0FBZSxHQUFmLENBQWY7QUFDRDs7QUFFRCxVQUFBLFlBQVksQ0FBQyxJQUFiLENBQW1CLE1BQUQsSUFBWTtBQUM1QixnQkFBSSxXQUFKLEVBQWlCO0FBQ2YsY0FBQSxNQUFNLENBQUMsV0FBRCxDQUFOO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsY0FBQSxhQUFhLENBQUMsSUFBZDtBQUNBLGNBQUEsT0FBTyxDQUFDLE1BQUQsQ0FBUDtBQUNEO0FBQ0YsV0FQRCxFQU9JLEdBQUQsSUFBUztBQUNWLGdCQUFJLFdBQUosRUFBaUI7QUFDZixjQUFBLE1BQU0sQ0FBQyxXQUFELENBQU47QUFDRCxhQUZELE1BRU87QUFDTCxjQUFBLGFBQWEsQ0FBQyxJQUFkO0FBQ0EsY0FBQSxNQUFNLENBQUMsR0FBRCxDQUFOO0FBQ0Q7QUFDRixXQWREO0FBZ0JBLGlCQUFPLE1BQU07QUFDWCxZQUFBLFdBQVcsR0FBRyxpQkFBaUIsRUFBL0I7QUFDRCxXQUZEO0FBR0QsU0E1QmUsRUE0QmIsWUE1QmEsQ0FBaEI7QUE2QkQsT0E5Qm9CLENBQXJCOztBQWdDQSxNQUFBLFlBQVksQ0FBQyxLQUFiLEdBQXFCLE1BQU07QUFDekIsUUFBQSxhQUFhLENBQUMsS0FBZDtBQUNELE9BRkQ7O0FBSUEsYUFBTyxZQUFQO0FBQ0QsS0F2Q0Q7QUF3Q0Q7O0FBbEpvQjs7Z0JBYWQsRSxFQUFJO0FBQ1QseUVBQXdCLENBQXhCO0FBRUEsTUFBSSxJQUFJLEdBQUcsS0FBWDtBQUVBLE1BQUksWUFBSjs7QUFDQSxNQUFJO0FBQ0YsSUFBQSxZQUFZLEdBQUcsRUFBRSxFQUFqQjtBQUNELEdBRkQsQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNaLDJFQUF3QixDQUF4QjtBQUNBLFVBQU0sR0FBTjtBQUNEOztBQUVELFNBQU87QUFDTCxJQUFBLEtBQUssRUFBRSxNQUFNO0FBQ1gsVUFBSSxJQUFKLEVBQVU7QUFDVixNQUFBLElBQUksR0FBRyxJQUFQO0FBQ0EsNkVBQXdCLENBQXhCO0FBQ0EsTUFBQSxZQUFZOztBQUNaO0FBQ0QsS0FQSTtBQVNMLElBQUEsSUFBSSxFQUFFLE1BQU07QUFDVixVQUFJLElBQUosRUFBVTtBQUNWLE1BQUEsSUFBSSxHQUFHLElBQVA7QUFDQSw2RUFBd0IsQ0FBeEI7O0FBQ0E7QUFDRDtBQWRJLEdBQVA7QUFnQkQ7O3VCQUVhO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsRUFBQSxjQUFjLENBQUMsa0NBQU0sSUFBTixpQkFBRCxDQUFkO0FBQ0Q7O2tCQUVRO0FBQ1AsTUFBSSx1RUFBd0IsS0FBSyxLQUFqQyxFQUF3QztBQUN0QztBQUNEOztBQUNELE1BQUksb0VBQXFCLE1BQXJCLEtBQWdDLENBQXBDLEVBQXVDO0FBQ3JDO0FBQ0QsR0FOTSxDQVFQO0FBQ0E7QUFDQTs7O0FBQ0EsUUFBTSxJQUFJLEdBQUcsb0VBQXFCLEtBQXJCLEVBQWI7O0FBQ0EsUUFBTSxPQUFPLCtCQUFHLElBQUgsZ0JBQWMsSUFBSSxDQUFDLEVBQW5CLENBQWI7O0FBQ0EsRUFBQSxJQUFJLENBQUMsS0FBTCxHQUFhLE9BQU8sQ0FBQyxLQUFyQjtBQUNBLEVBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxPQUFPLENBQUMsSUFBcEI7QUFDRDs7aUJBRU8sRSxFQUFJLE9BQU8sR0FBRyxFLEVBQUk7QUFDeEIsUUFBTSxPQUFPLEdBQUc7QUFDZCxJQUFBLEVBRGM7QUFFZCxJQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUixJQUFvQixDQUZoQjtBQUdkLElBQUEsS0FBSyxFQUFFLE1BQU07QUFDWCw0REFBYyxPQUFkO0FBQ0QsS0FMYTtBQU1kLElBQUEsSUFBSSxFQUFFLE1BQU07QUFDVixZQUFNLElBQUksS0FBSixDQUFVLDREQUFWLENBQU47QUFDRDtBQVJhLEdBQWhCOztBQVdBLFFBQU0sS0FBSyxHQUFHLG9FQUFxQixTQUFyQixDQUFnQyxLQUFELElBQVc7QUFDdEQsV0FBTyxPQUFPLENBQUMsUUFBUixHQUFtQixLQUFLLENBQUMsUUFBaEM7QUFDRCxHQUZhLENBQWQ7O0FBR0EsTUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCLHdFQUFxQixJQUFyQixDQUEwQixPQUExQjtBQUNELEdBRkQsTUFFTztBQUNMLHdFQUFxQixNQUFyQixDQUE0QixLQUE1QixFQUFtQyxDQUFuQyxFQUFzQyxPQUF0QztBQUNEOztBQUNELFNBQU8sT0FBUDtBQUNEOzttQkFFUyxPLEVBQVM7QUFDakIsUUFBTSxLQUFLLEdBQUcsb0VBQXFCLE9BQXJCLENBQTZCLE9BQTdCLENBQWQ7O0FBQ0EsTUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCLHdFQUFxQixNQUFyQixDQUE0QixLQUE1QixFQUFtQyxDQUFuQztBQUNEO0FBQ0Y7O0FBcURILE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQ2YsRUFBQSxnQkFEZTtBQUVmLEVBQUEsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLFNBQUQ7QUFGakIsQ0FBakI7Ozs7Ozs7Ozs7Ozs7QUN6SkEsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBbkI7O0FBRUEsU0FBUyxpQkFBVCxDQUE0QixNQUE1QixFQUFvQyxFQUFwQyxFQUF3QyxXQUF4QyxFQUFxRDtBQUNuRCxRQUFNLFFBQVEsR0FBRyxFQUFqQjtBQUNBLEVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZ0IsS0FBRCxJQUFXO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFDN0IsYUFBTyxRQUFRLENBQUMsSUFBVCxDQUFjLEtBQWQsQ0FBUDtBQUNEOztBQUVELFdBQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFSLENBQUYsQ0FBaUIsS0FBakIsRUFBd0IsT0FBeEIsQ0FBZ0MsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLElBQVQsS0FBa0I7QUFDdkQsVUFBSSxHQUFHLEtBQUssRUFBWixFQUFnQjtBQUNkLFFBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkO0FBQ0QsT0FIc0QsQ0FLdkQ7OztBQUNBLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBdEIsRUFBeUI7QUFDdkIsUUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLFdBQWQ7QUFDRDtBQUNGLEtBVE0sQ0FBUDtBQVVELEdBbkJEO0FBb0JBLFNBQU8sUUFBUDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxXQUFULENBQXNCLE1BQXRCLEVBQThCLE9BQTlCLEVBQXVDO0FBQ3JDLFFBQU0sV0FBVyxHQUFHLEtBQXBCO0FBQ0EsUUFBTSxlQUFlLEdBQUcsTUFBeEI7QUFDQSxNQUFJLFlBQVksR0FBRyxDQUFDLE1BQUQsQ0FBbkI7QUFFQSxNQUFJLE9BQU8sSUFBSSxJQUFmLEVBQXFCLE9BQU8sWUFBUDs7QUFFckIsT0FBSyxNQUFNLEdBQVgsSUFBa0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLENBQWxCLEVBQXdDO0FBQ3RDLFFBQUksR0FBRyxLQUFLLEdBQVosRUFBaUI7QUFDZjtBQUNBO0FBQ0E7QUFDQSxVQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRCxDQUF6Qjs7QUFDQSxVQUFJLE9BQU8sV0FBUCxLQUF1QixRQUEzQixFQUFxQztBQUNuQyxRQUFBLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQVIsQ0FBWCxDQUE0QixXQUE1QixFQUF5QyxlQUF6QyxDQUFkO0FBQ0QsT0FQYyxDQVFmO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBQSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsWUFBRCxFQUFlLElBQUksTUFBSixDQUFZLE9BQU0sR0FBSSxLQUF0QixFQUE0QixHQUE1QixDQUFmLEVBQWlELFdBQWpELENBQWhDO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLFlBQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE1BQU0sQ0FBQyxPQUFQLCtEQUFpQixNQUFNLFVBQU4sQ0FBaUI7QUFDaEM7QUFDRjtBQUNBO0FBQ0UsRUFBQSxXQUFXLENBQUUsT0FBRixFQUFXO0FBQUE7QUFBQTtBQUFBO0FBQ3BCLFNBQUssTUFBTCxHQUFjO0FBQ1osTUFBQSxPQUFPLEVBQUUsRUFERzs7QUFFWixNQUFBLFNBQVMsQ0FBRSxDQUFGLEVBQUs7QUFDWixZQUFJLENBQUMsS0FBSyxDQUFWLEVBQWE7QUFDWCxpQkFBTyxDQUFQO0FBQ0Q7O0FBQ0QsZUFBTyxDQUFQO0FBQ0Q7O0FBUFcsS0FBZDs7QUFVQSxRQUFJLEtBQUssQ0FBQyxPQUFOLENBQWMsT0FBZCxDQUFKLEVBQTRCO0FBQzFCLE1BQUEsT0FBTyxDQUFDLE9BQVIsNkJBQWdCLElBQWhCLG1CQUE2QixJQUE3QjtBQUNELEtBRkQsTUFFTztBQUNMLHdEQUFZLE9BQVo7QUFDRDtBQUNGOztBQVlEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsRUFBQSxTQUFTLENBQUUsR0FBRixFQUFPLE9BQVAsRUFBZ0I7QUFDdkIsV0FBTyxLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsRUFBeUIsT0FBekIsRUFBa0MsSUFBbEMsQ0FBdUMsRUFBdkMsQ0FBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNFLEVBQUEsY0FBYyxDQUFFLEdBQUYsRUFBTyxPQUFQLEVBQWdCO0FBQzVCLFFBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxNQUFMLENBQVksT0FBYixFQUFzQixHQUF0QixDQUFSLEVBQW9DO0FBQ2xDLFlBQU0sSUFBSSxLQUFKLENBQVcsbUJBQWtCLEdBQUksRUFBakMsQ0FBTjtBQUNEOztBQUVELFVBQU0sTUFBTSxHQUFHLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsR0FBcEIsQ0FBZjtBQUNBLFVBQU0sY0FBYyxHQUFHLE9BQU8sTUFBUCxLQUFrQixRQUF6Qzs7QUFFQSxRQUFJLGNBQUosRUFBb0I7QUFDbEIsVUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsV0FBZixLQUErQixXQUE5QyxFQUEyRDtBQUN6RCxjQUFNLE1BQU0sR0FBRyxLQUFLLE1BQUwsQ0FBWSxTQUFaLENBQXNCLE9BQU8sQ0FBQyxXQUE5QixDQUFmO0FBQ0EsZUFBTyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQUQsQ0FBUCxFQUFpQixPQUFqQixDQUFsQjtBQUNEOztBQUNELFlBQU0sSUFBSSxLQUFKLENBQVUsd0ZBQVYsQ0FBTjtBQUNEOztBQUVELFdBQU8sV0FBVyxDQUFDLE1BQUQsRUFBUyxPQUFULENBQWxCO0FBQ0Q7O0FBbkUrQixDQUFsQzs7aUJBc0JVLE0sRUFBUTtBQUNkLE1BQUksRUFBQyxNQUFELFlBQUMsTUFBTSxDQUFFLE9BQVQsQ0FBSixFQUFzQjtBQUNwQjtBQUNEOztBQUVELFFBQU0sVUFBVSxHQUFHLEtBQUssTUFBeEI7QUFDQSxPQUFLLE1BQUwsR0FBYyxFQUFFLEdBQUcsVUFBTDtBQUFpQixJQUFBLE9BQU8sRUFBRSxFQUFFLEdBQUcsVUFBVSxDQUFDLE9BQWhCO0FBQXlCLFNBQUcsTUFBTSxDQUFDO0FBQW5DO0FBQTFCLEdBQWQ7QUFDQSxPQUFLLE1BQUwsQ0FBWSxTQUFaLEdBQXdCLE1BQU0sQ0FBQyxTQUFQLElBQW9CLFVBQVUsQ0FBQyxTQUF2RDtBQUNEOzs7OztBQ3pHSCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBeEI7O0FBRUEsU0FBUyxrQkFBVCxDQUE2QixRQUE3QixFQUF1QyxZQUF2QyxFQUFxRCxJQUFyRCxFQUEyRDtBQUN6RCxRQUFNO0FBQUUsSUFBQSxRQUFGO0FBQVksSUFBQSxhQUFaO0FBQTJCLElBQUE7QUFBM0IsTUFBMEMsWUFBaEQ7O0FBQ0EsTUFBSSxRQUFKLEVBQWM7QUFDWixJQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsR0FBZCxDQUFtQixvQkFBbUIsUUFBUyxFQUEvQztBQUNBLElBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkLENBQW1CLGlCQUFuQixFQUFzQyxJQUF0QyxFQUE0QztBQUMxQyxNQUFBLFFBRDBDO0FBRTFDLE1BQUEsYUFGMEM7QUFHMUMsTUFBQTtBQUgwQyxLQUE1QztBQUtEO0FBQ0Y7O0FBRUQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBUSxDQUFDLGtCQUFELEVBQXFCLEdBQXJCLEVBQTBCO0FBQ2pELEVBQUEsT0FBTyxFQUFFLElBRHdDO0FBRWpELEVBQUEsUUFBUSxFQUFFO0FBRnVDLENBQTFCLENBQXpCOzs7OztBQ2RBLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUE1QjtBQUVBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxxQkFBVCxDQUFnQyxHQUFHLE9BQW5DLEVBQTRDO0FBQzNELFNBQU8sS0FBSyxDQUFDLEdBQUcsT0FBSixDQUFMLENBQ0osS0FESSxDQUNHLEdBQUQsSUFBUztBQUNkLFFBQUksR0FBRyxDQUFDLElBQUosS0FBYSxZQUFqQixFQUErQjtBQUM3QixZQUFNLEdBQU47QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNLElBQUksWUFBSixDQUFpQixHQUFqQixDQUFOO0FBQ0Q7QUFDRixHQVBJLENBQVA7QUFRRCxDQVREOzs7OztBQ0xBLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUE1QjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxjQUFULENBQXlCLE9BQXpCLEVBQWtDLE9BQU8sR0FBRyxRQUE1QyxFQUFzRDtBQUNyRSxNQUFJLE9BQU8sT0FBUCxLQUFtQixRQUF2QixFQUFpQztBQUMvQixXQUFPLE9BQU8sQ0FBQyxhQUFSLENBQXNCLE9BQXRCLENBQVA7QUFDRDs7QUFFRCxNQUFJLFlBQVksQ0FBQyxPQUFELENBQWhCLEVBQTJCO0FBQ3pCLFdBQU8sT0FBUDtBQUNEOztBQUVELFNBQU8sSUFBUDtBQUNELENBVkQ7Ozs7O0FDUkEsU0FBUyxlQUFULENBQTBCLFNBQTFCLEVBQXFDO0FBQ25DLFNBQU8sU0FBUyxDQUFDLFVBQVYsQ0FBcUIsQ0FBckIsRUFBd0IsUUFBeEIsQ0FBaUMsRUFBakMsQ0FBUDtBQUNEOztBQUVELFNBQVMsY0FBVCxDQUF5QixJQUF6QixFQUErQjtBQUM3QixNQUFJLE1BQU0sR0FBRyxFQUFiO0FBQ0EsU0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLGFBQWIsRUFBNkIsU0FBRCxJQUFlO0FBQ2hELElBQUEsTUFBTSxJQUFLLElBQUcsZUFBZSxDQUFDLFNBQUQsQ0FBWSxFQUF6QztBQUNBLFdBQU8sR0FBUDtBQUNELEdBSE0sSUFHRixNQUhMO0FBSUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxjQUFULENBQXlCLElBQXpCLEVBQStCO0FBQzlDO0FBQ0E7QUFFQSxNQUFJLEVBQUUsR0FBRyxNQUFUOztBQUNBLE1BQUksT0FBTyxJQUFJLENBQUMsSUFBWixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxJQUFBLEVBQUUsSUFBSyxJQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQVYsRUFBRCxDQUEwQixFQUFsRDtBQUNEOztBQUVELE1BQUksSUFBSSxDQUFDLElBQUwsS0FBYyxTQUFsQixFQUE2QjtBQUMzQixJQUFBLEVBQUUsSUFBSyxJQUFHLElBQUksQ0FBQyxJQUFLLEVBQXBCO0FBQ0Q7O0FBRUQsTUFBSSxJQUFJLENBQUMsSUFBTCxJQUFhLE9BQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFqQixLQUFrQyxRQUFuRCxFQUE2RDtBQUMzRCxJQUFBLEVBQUUsSUFBSyxJQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsQ0FBdUIsV0FBdkIsRUFBRCxDQUF1QyxFQUEvRDtBQUNEOztBQUVELE1BQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLEtBQW1CLFNBQXZCLEVBQWtDO0FBQ2hDLElBQUEsRUFBRSxJQUFLLElBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFLLEVBQXpCO0FBQ0Q7O0FBQ0QsTUFBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsS0FBMkIsU0FBL0IsRUFBMEM7QUFDeEMsSUFBQSxFQUFFLElBQUssSUFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQWEsRUFBakM7QUFDRDs7QUFFRCxTQUFPLEVBQVA7QUFDRCxDQXpCRDs7Ozs7QUNuQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxpQkFBVCxDQUE0QixZQUE1QixFQUEwQztBQUN6RCxTQUFPLFlBQVksQ0FBQyxVQUFiLEdBQTBCLFlBQVksQ0FBQyxhQUE5QztBQUNELENBRkQ7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyx1QkFBVCxDQUFrQyxZQUFsQyxFQUFnRDtBQUMvRCxRQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsV0FBYixDQUF5QixHQUF6QixDQUFoQixDQUQrRCxDQUUvRDs7QUFDQSxNQUFJLE9BQU8sS0FBSyxDQUFDLENBQWIsSUFBa0IsT0FBTyxLQUFLLFlBQVksQ0FBQyxNQUFiLEdBQXNCLENBQXhELEVBQTJEO0FBQ3pELFdBQU87QUFDTCxNQUFBLElBQUksRUFBRSxZQUREO0FBRUwsTUFBQSxTQUFTLEVBQUU7QUFGTixLQUFQO0FBSUQ7O0FBQ0QsU0FBTztBQUNMLElBQUEsSUFBSSxFQUFFLFlBQVksQ0FBQyxLQUFiLENBQW1CLENBQW5CLEVBQXNCLE9BQXRCLENBREQ7QUFFTCxJQUFBLFNBQVMsRUFBRSxZQUFZLENBQUMsS0FBYixDQUFtQixPQUFPLEdBQUcsQ0FBN0I7QUFGTixHQUFQO0FBSUQsQ0FiRDs7Ozs7QUNOQSxNQUFNLHVCQUF1QixHQUFHLE9BQU8sQ0FBQywyQkFBRCxDQUF2Qzs7QUFDQSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBRCxDQUF6Qjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLFdBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7QUFBQTs7QUFDM0MsTUFBSSxJQUFJLENBQUMsSUFBVCxFQUFlLE9BQU8sSUFBSSxDQUFDLElBQVo7QUFFZixRQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBTCw0QkFBWSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBTixDQUF2QixDQUFtQyxTQUEvQyxxQkFBWSxzQkFBOEMsV0FBOUMsRUFBWixHQUEwRSxJQUFoRzs7QUFDQSxNQUFJLGFBQWEsSUFBSSxhQUFhLElBQUksU0FBdEMsRUFBaUQ7QUFDL0M7QUFDQSxXQUFPLFNBQVMsQ0FBQyxhQUFELENBQWhCO0FBQ0QsR0FQMEMsQ0FRM0M7OztBQUNBLFNBQU8sMEJBQVA7QUFDRCxDQVZEOzs7OztBQ0hBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsYUFBVCxDQUF3QixHQUF4QixFQUE2QjtBQUM1QztBQUNBLFFBQU0sS0FBSyxHQUFHLHdEQUFkO0FBQ0EsUUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQU4sQ0FBVyxHQUFYLEVBQWdCLENBQWhCLENBQWI7QUFDQSxRQUFNLGNBQWMsR0FBRyxjQUFjLElBQWQsQ0FBbUIsR0FBbkIsSUFBMEIsSUFBMUIsR0FBaUMsS0FBeEQ7QUFFQSxTQUFRLEdBQUUsY0FBZSxNQUFLLElBQUssRUFBbkM7QUFDRCxDQVBEOzs7OztBQ0FBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsUUFBVCxDQUFtQixZQUFuQixFQUFpQztBQUNoRCxNQUFJLENBQUMsWUFBWSxDQUFDLGFBQWxCLEVBQWlDLE9BQU8sQ0FBUDtBQUVqQyxRQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBTCxLQUFhLFlBQVksQ0FBQyxhQUE5QztBQUNBLFFBQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxhQUFiLElBQThCLFdBQVcsR0FBRyxJQUE1QyxDQUFwQjtBQUNBLFNBQU8sV0FBUDtBQUNELENBTkQ7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsU0FBUyxnQkFBVCxDQUEyQixPQUEzQixFQUFvQztBQUFBOztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFPLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUEzQixFQUFnQztBQUM5QjtBQUNBLElBQUEsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFsQjtBQUNEOztBQUNELHFCQUFPLE9BQVAscUJBQU8sU0FBUyxHQUFoQjtBQUNEOztBQUVELE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGdCQUFqQjs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxHQUFULENBQWMsTUFBZCxFQUFzQjtBQUNwQixTQUFPLE1BQU0sR0FBRyxFQUFULEdBQWUsSUFBRyxNQUFPLEVBQXpCLEdBQTZCLE1BQU0sQ0FBQyxRQUFQLEVBQXBDO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7OztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsWUFBVCxHQUF5QjtBQUN4QyxRQUFNLElBQUksR0FBRyxJQUFJLElBQUosRUFBYjtBQUNBLFFBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBTCxFQUFELENBQWpCO0FBQ0EsUUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFMLEVBQUQsQ0FBbkI7QUFDQSxRQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUwsRUFBRCxDQUFuQjtBQUNBLFNBQVEsR0FBRSxLQUFNLElBQUcsT0FBUSxJQUFHLE9BQVEsRUFBdEM7QUFDRCxDQU5EOzs7OztBQ2JBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsR0FBVCxDQUFjLE1BQWQsRUFBc0IsR0FBdEIsRUFBMkI7QUFDMUMsU0FBTyxNQUFNLENBQUMsU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFQO0FBQ0QsQ0FGRDs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxZQUFULENBQXVCLEdBQXZCLEVBQTRCO0FBQzNDLFNBQU8sQ0FBQSxHQUFHLFFBQUgsWUFBQSxHQUFHLENBQUUsUUFBTCxNQUFrQixJQUFJLENBQUMsWUFBOUI7QUFDRCxDQUZEOzs7OztBQ0xBLFNBQVMsY0FBVCxDQUF5QixHQUF6QixFQUE4QjtBQUM1QixNQUFJLENBQUMsR0FBTCxFQUFVO0FBQ1IsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsU0FBUSxHQUFHLENBQUMsVUFBSixLQUFtQixDQUFuQixJQUF3QixHQUFHLENBQUMsVUFBSixLQUFtQixDQUE1QyxJQUFrRCxHQUFHLENBQUMsTUFBSixLQUFlLENBQXhFO0FBQ0Q7O0FBRUQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBakI7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUNmLEVBQUEsRUFBRSxFQUFFLGVBRFc7QUFFZixFQUFBLFFBQVEsRUFBRSxlQUZLO0FBR2YsRUFBQSxHQUFHLEVBQUUsV0FIVTtBQUlmLEVBQUEsR0FBRyxFQUFFLFdBSlU7QUFLZixFQUFBLEdBQUcsRUFBRSxlQUxVO0FBTWYsRUFBQSxHQUFHLEVBQUUsWUFOVTtBQU9mLEVBQUEsR0FBRyxFQUFFLFdBUFU7QUFRZixFQUFBLEdBQUcsRUFBRSxXQVJVO0FBU2YsRUFBQSxJQUFJLEVBQUUsWUFUUztBQVVmLEVBQUEsSUFBSSxFQUFFLFlBVlM7QUFXZixFQUFBLElBQUksRUFBRSxXQVhTO0FBWWYsRUFBQSxHQUFHLEVBQUUsV0FaVTtBQWFmLEVBQUEsR0FBRyxFQUFFLFVBYlU7QUFjZixFQUFBLEdBQUcsRUFBRSwyQkFkVTtBQWVmLEVBQUEsR0FBRyxFQUFFLDJCQWZVO0FBZ0JmLEVBQUEsR0FBRyxFQUFFLGlCQWhCVTtBQWlCZixFQUFBLEdBQUcsRUFBRSxrQkFqQlU7QUFrQmYsRUFBQSxHQUFHLEVBQUUsa0JBbEJVO0FBbUJmLEVBQUEsR0FBRyxFQUFFLGlCQW5CVTtBQW9CZixFQUFBLEdBQUcsRUFBRSxvQkFwQlU7QUFxQmYsRUFBQSxJQUFJLEVBQUUsa0RBckJTO0FBc0JmLEVBQUEsSUFBSSxFQUFFLHlFQXRCUztBQXVCZixFQUFBLEdBQUcsRUFBRSxvQkF2QlU7QUF3QmYsRUFBQSxJQUFJLEVBQUUsa0RBeEJTO0FBeUJmLEVBQUEsSUFBSSxFQUFFLHlFQXpCUztBQTBCZixFQUFBLEdBQUcsRUFBRSwwQkExQlU7QUEyQmYsRUFBQSxJQUFJLEVBQUUsZ0RBM0JTO0FBNEJmLEVBQUEsR0FBRyxFQUFFLDBCQTVCVTtBQTZCZixFQUFBLEdBQUcsRUFBRSx5QkE3QlU7QUE4QmYsRUFBQSxHQUFHLEVBQUUsMEJBOUJVO0FBK0JmLEVBQUEsR0FBRyxFQUFFLDBCQS9CVTtBQWdDZixFQUFBLElBQUksRUFBRSx1REFoQ1M7QUFpQ2YsRUFBQSxJQUFJLEVBQUUsZ0RBakNTO0FBa0NmLEVBQUEsSUFBSSxFQUFFLG1FQWxDUztBQW1DZixFQUFBLEdBQUcsRUFBRSwwQkFuQ1U7QUFvQ2YsRUFBQSxJQUFJLEVBQUUsbURBcENTO0FBcUNmLEVBQUEsSUFBSSxFQUFFLHNFQXJDUztBQXNDZixFQUFBLEdBQUcsRUFBRSwwQkF0Q1U7QUF1Q2YsRUFBQSxHQUFHLEVBQUUsWUF2Q1U7QUF3Q2YsRUFBQSxJQUFJLEVBQUUsWUF4Q1M7QUF5Q2YsRUFBQSxJQUFJLEVBQUUsWUF6Q1M7QUEwQ2YsRUFBQSxHQUFHLEVBQUUsWUExQ1U7QUEyQ2YsRUFBQSxHQUFHLEVBQUUsaUJBM0NVO0FBNENmLEVBQUEsR0FBRyxFQUFFLGlCQTVDVTtBQTZDZixRQUFNLDZCQTdDUztBQThDZixFQUFBLEdBQUcsRUFBRSw4QkE5Q1U7QUErQ2YsRUFBQSxHQUFHLEVBQUUsbUJBL0NVO0FBZ0RmLEVBQUEsRUFBRSxFQUFFLGtCQWhEVztBQWlEZixFQUFBLEdBQUcsRUFBRTtBQWpEVSxDQUFqQjs7Ozs7QUNMQSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBN0I7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxTQUFULENBQW9CLE9BQXBCLEVBQTZCO0FBQzVDLFFBQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxPQUFELENBQTFCLENBRDRDLENBRzVDO0FBQ0E7QUFDQTs7QUFDQSxRQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBTCxLQUFlLENBQWYsR0FBbUIsRUFBbkIsR0FBeUIsR0FBRSxJQUFJLENBQUMsS0FBTSxHQUF2RDtBQUNBLFFBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFMLEtBQWlCLENBQWpCLEdBQXFCLEVBQXJCLEdBQTJCLEdBQUUsSUFBSSxDQUFDLEtBQUwsS0FBZSxDQUFmLEdBQW1CLElBQUksQ0FBQyxPQUF4QixHQUFtQyxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQUFzQixFQUF0QixFQUEwQixRQUExQixDQUFtQyxDQUFuQyxFQUFzQyxHQUF0QyxDQUEyQyxFQUFFLEdBQW5JO0FBQ0EsUUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUwsS0FBZSxDQUFmLEdBQW1CLEVBQW5CLEdBQXlCLEdBQUUsSUFBSSxDQUFDLE9BQUwsS0FBaUIsQ0FBakIsR0FBcUIsSUFBSSxDQUFDLE9BQTFCLEdBQXFDLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQXNCLEVBQXRCLEVBQTBCLFFBQTFCLENBQW1DLENBQW5DLEVBQXNDLEdBQXRDLENBQTJDLEVBQUUsR0FBbkk7QUFFQSxTQUFRLEdBQUUsUUFBUyxHQUFFLFVBQVcsR0FBRSxVQUFXLEVBQTdDO0FBQ0QsQ0FYRDs7Ozs7QUNGQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLGFBQVQsQ0FBd0IsVUFBeEIsRUFBb0M7QUFDbkQsUUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFVLEdBQUcsSUFBeEIsSUFBZ0MsRUFBOUM7QUFDQSxRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQVUsR0FBRyxFQUF4QixJQUE4QixFQUE5QztBQUNBLFFBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBVSxHQUFHLEVBQXhCLENBQWhCO0FBRUEsU0FBTztBQUFFLElBQUEsS0FBRjtBQUFTLElBQUEsT0FBVDtBQUFrQixJQUFBO0FBQWxCLEdBQVA7QUFDRCxDQU5EOzs7OztBQ0FBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsTUFBVCxDQUFpQixRQUFqQixFQUEyQjtBQUMxQyxRQUFNLFdBQVcsR0FBRyxFQUFwQjtBQUNBLFFBQU0sVUFBVSxHQUFHLEVBQW5COztBQUNBLFdBQVMsUUFBVCxDQUFtQixLQUFuQixFQUEwQjtBQUN4QixJQUFBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLEtBQWpCO0FBQ0Q7O0FBQ0QsV0FBUyxRQUFULENBQW1CLEtBQW5CLEVBQTBCO0FBQ3hCLElBQUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsS0FBaEI7QUFDRDs7QUFFRCxRQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBUixDQUNYLFFBQVEsQ0FBQyxHQUFULENBQWMsT0FBRCxJQUFhLE9BQU8sQ0FBQyxJQUFSLENBQWEsUUFBYixFQUF1QixRQUF2QixDQUExQixDQURXLENBQWI7QUFJQSxTQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBTTtBQUNyQixXQUFPO0FBQ0wsTUFBQSxVQUFVLEVBQUUsV0FEUDtBQUVMLE1BQUEsTUFBTSxFQUFFO0FBRkgsS0FBUDtBQUlELEdBTE0sQ0FBUDtBQU1ELENBcEJEOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUssQ0FBQyxJQUF2Qjs7Ozs7QUNIQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFwQjs7QUFDQSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBekI7O0FBQ0EsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQXpCOztBQUNBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFELENBQW5COztBQUVBLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTO0FBQUMsRUFBQSxLQUFLLEVBQUUsSUFBUjtBQUFjLEVBQUEsV0FBVyxFQUFFO0FBQTNCLENBQVQsQ0FBaEI7QUFDQSxPQUFPLENBQ0osR0FESCxDQUNPLFNBRFAsRUFDa0I7QUFBRSxFQUFBLE1BQU0sRUFBRSxZQUFWO0FBQXdCLEVBQUEsTUFBTSxFQUFFO0FBQWhDLENBRGxCLEVBRUcsR0FGSCxDQUVPLEdBRlAsRUFFWTtBQUFFLEVBQUEsUUFBUSxFQUFFO0FBQVosQ0FGWixFQUdHLEdBSEgsQ0FHTyxTQUhQLEVBR2tCO0FBQ2QsRUFBQSxNQUFNLEVBQUUscUJBRE07QUFFZCxFQUFBLGdCQUFnQixFQUFFLElBRko7QUFHZCxFQUFBLGVBQWUsRUFBRTtBQUhILENBSGxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GbGV0L3ByZXR0aWVyLWJ5dGVzL1xuLy8gQ2hhbmdpbmcgMTAwMCBieXRlcyB0byAxMDI0LCBzbyB3ZSBjYW4ga2VlcCB1cHBlcmNhc2UgS0IgdnMga0Jcbi8vIElTQyBMaWNlbnNlIChjKSBEYW4gRmxldHRyZSBodHRwczovL2dpdGh1Yi5jb20vRmxldC9wcmV0dGllci1ieXRlcy9ibG9iL21hc3Rlci9MSUNFTlNFXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHByZXR0aWVyQnl0ZXMgKG51bSkge1xuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgfHwgaXNOYU4obnVtKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbnVtYmVyLCBnb3QgJyArIHR5cGVvZiBudW0pXG4gIH1cblxuICB2YXIgbmVnID0gbnVtIDwgMFxuICB2YXIgdW5pdHMgPSBbJ0InLCAnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXVxuXG4gIGlmIChuZWcpIHtcbiAgICBudW0gPSAtbnVtXG4gIH1cblxuICBpZiAobnVtIDwgMSkge1xuICAgIHJldHVybiAobmVnID8gJy0nIDogJycpICsgbnVtICsgJyBCJ1xuICB9XG5cbiAgdmFyIGV4cG9uZW50ID0gTWF0aC5taW4oTWF0aC5mbG9vcihNYXRoLmxvZyhudW0pIC8gTWF0aC5sb2coMTAyNCkpLCB1bml0cy5sZW5ndGggLSAxKVxuICBudW0gPSBOdW1iZXIobnVtIC8gTWF0aC5wb3coMTAyNCwgZXhwb25lbnQpKVxuICB2YXIgdW5pdCA9IHVuaXRzW2V4cG9uZW50XVxuXG4gIGlmIChudW0gPj0gMTAgfHwgbnVtICUgMSA9PT0gMCkge1xuICAgIC8vIERvIG5vdCBzaG93IGRlY2ltYWxzIHdoZW4gdGhlIG51bWJlciBpcyB0d28tZGlnaXQsIG9yIGlmIHRoZSBudW1iZXIgaGFzIG5vXG4gICAgLy8gZGVjaW1hbCBjb21wb25lbnQuXG4gICAgcmV0dXJuIChuZWcgPyAnLScgOiAnJykgKyBudW0udG9GaXhlZCgwKSArICcgJyArIHVuaXRcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKG5lZyA/ICctJyA6ICcnKSArIG51bS50b0ZpeGVkKDEpICsgJyAnICsgdW5pdFxuICB9XG59XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE4IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcygpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0aWYgKGFyZy5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YXIgaW5uZXIgPSBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHRcdFx0aWYgKGlubmVyKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goaW5uZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRpZiAoYXJnLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goa2V5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZy50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdGNsYXNzTmFtZXMuZGVmYXVsdCA9IGNsYXNzTmFtZXM7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIi8qXG4gKiAgYmFzZTY0LmpzXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbiAqICAgIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqXG4gKiAgUmVmZXJlbmNlczpcbiAqICAgIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0XG4gKi9cbjsoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShnbG9iYWwpXG4gICAgICAgIDogdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kXG4gICAgICAgID8gZGVmaW5lKGZhY3RvcnkpIDogZmFjdG9yeShnbG9iYWwpXG59KChcbiAgICB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmXG4gICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3dcbiAgICAgICAgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFxuOiB0aGlzXG4pLCBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gZXhpc3RpbmcgdmVyc2lvbiBmb3Igbm9Db25mbGljdCgpXG4gICAgZ2xvYmFsID0gZ2xvYmFsIHx8IHt9O1xuICAgIHZhciBfQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB2YXIgdmVyc2lvbiA9IFwiMi42LjRcIjtcbiAgICAvLyBjb25zdGFudHNcbiAgICB2YXIgYjY0Y2hhcnNcbiAgICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG4gICAgdmFyIGI2NHRhYiA9IGZ1bmN0aW9uKGJpbikge1xuICAgICAgICB2YXIgdCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJpbi5sZW5ndGg7IGkgPCBsOyBpKyspIHRbYmluLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KGI2NGNoYXJzKTtcbiAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbiAgICAvLyBlbmNvZGVyIHN0dWZmXG4gICAgdmFyIGNiX3V0b2IgPSBmdW5jdGlvbihjKSB7XG4gICAgICAgIGlmIChjLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHZhciBjYyA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIHJldHVybiBjYyA8IDB4ODAgPyBjXG4gICAgICAgICAgICAgICAgOiBjYyA8IDB4ODAwID8gKGZyb21DaGFyQ29kZSgweGMwIHwgKGNjID4+PiA2KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8IChjYyAmIDB4M2YpKSlcbiAgICAgICAgICAgICAgICA6IChmcm9tQ2hhckNvZGUoMHhlMCB8ICgoY2MgPj4+IDEyKSAmIDB4MGYpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gIDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNjID0gMHgxMDAwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgwKSAtIDB4RDgwMCkgKiAweDQwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgxKSAtIDB4REMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgweGYwIHwgKChjYyA+Pj4gMTgpICYgMHgwNykpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAxMikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlX3V0b2IgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGRl18W15cXHgwMC1cXHg3Rl0vZztcbiAgICB2YXIgdXRvYiA9IGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgcmV0dXJuIHUucmVwbGFjZShyZV91dG9iLCBjYl91dG9iKTtcbiAgICB9O1xuICAgIHZhciBjYl9lbmNvZGUgPSBmdW5jdGlvbihjY2MpIHtcbiAgICAgICAgdmFyIHBhZGxlbiA9IFswLCAyLCAxXVtjY2MubGVuZ3RoICUgM10sXG4gICAgICAgIG9yZCA9IGNjYy5jaGFyQ29kZUF0KDApIDw8IDE2XG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDEgPyBjY2MuY2hhckNvZGVBdCgxKSA6IDApIDw8IDgpXG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDIgPyBjY2MuY2hhckNvZGVBdCgyKSA6IDApKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpLFxuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAyID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDYpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDEgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQob3JkICYgNjMpXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBidG9hID0gZ2xvYmFsLmJ0b2EgJiYgdHlwZW9mIGdsb2JhbC5idG9hID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBmdW5jdGlvbihiKXsgcmV0dXJuIGdsb2JhbC5idG9hKGIpIH0gOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIGlmIChiLm1hdGNoKC9bXlxceDAwLVxceEZGXS8pKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICdUaGUgc3RyaW5nIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UoL1tcXHNcXFNdezEsM30vZywgY2JfZW5jb2RlKTtcbiAgICB9O1xuICAgIHZhciBfZW5jb2RlID0gZnVuY3Rpb24odSkge1xuICAgICAgICByZXR1cm4gYnRvYSh1dG9iKFN0cmluZyh1KSkpO1xuICAgIH07XG4gICAgdmFyIG1rVXJpU2FmZSA9IGZ1bmN0aW9uIChiNjQpIHtcbiAgICAgICAgcmV0dXJuIGI2NC5yZXBsYWNlKC9bK1xcL10vZywgZnVuY3Rpb24obTApIHtcbiAgICAgICAgICAgIHJldHVybiBtMCA9PSAnKycgPyAnLScgOiAnXyc7XG4gICAgICAgIH0pLnJlcGxhY2UoLz0vZywgJycpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uKHUsIHVyaXNhZmUpIHtcbiAgICAgICAgcmV0dXJuIHVyaXNhZmUgPyBta1VyaVNhZmUoX2VuY29kZSh1KSkgOiBfZW5jb2RlKHUpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZVVSSSA9IGZ1bmN0aW9uKHUpIHsgcmV0dXJuIGVuY29kZSh1LCB0cnVlKSB9O1xuICAgIHZhciBmcm9tVWludDhBcnJheTtcbiAgICBpZiAoZ2xvYmFsLlVpbnQ4QXJyYXkpIGZyb21VaW50OEFycmF5ID0gZnVuY3Rpb24oYSwgdXJpc2FmZSkge1xuICAgICAgICAvLyByZXR1cm4gYnRvYShmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgYSkpO1xuICAgICAgICB2YXIgYjY0ID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYS5sZW5ndGg7IGkgPCBsOyBpICs9IDMpIHtcbiAgICAgICAgICAgIHZhciBhMCA9IGFbaV0sIGExID0gYVtpKzFdLCBhMiA9IGFbaSsyXTtcbiAgICAgICAgICAgIHZhciBvcmQgPSBhMCA8PCAxNiB8IGExIDw8IDggfCBhMjtcbiAgICAgICAgICAgIGI2NCArPSAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpXG4gICAgICAgICAgICAgICAgKyAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKVxuICAgICAgICAgICAgICAgICsgKCB0eXBlb2YgYTEgIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBiNjRjaGFycy5jaGFyQXQoKG9yZCA+Pj4gIDYpICYgNjMpIDogJz0nKVxuICAgICAgICAgICAgICAgICsgKCB0eXBlb2YgYTIgIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBiNjRjaGFycy5jaGFyQXQoIG9yZCAgICAgICAgICYgNjMpIDogJz0nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJpc2FmZSA/IG1rVXJpU2FmZShiNjQpIDogYjY0O1xuICAgIH07XG4gICAgLy8gZGVjb2RlciBzdHVmZlxuICAgIHZhciByZV9idG91ID0gL1tcXHhDMC1cXHhERl1bXFx4ODAtXFx4QkZdfFtcXHhFMC1cXHhFRl1bXFx4ODAtXFx4QkZdezJ9fFtcXHhGMC1cXHhGN11bXFx4ODAtXFx4QkZdezN9L2c7XG4gICAgdmFyIGNiX2J0b3UgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHN3aXRjaChjY2NjLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB2YXIgY3AgPSAoKDB4MDcgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDE4KVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCAxMilcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSkgPDwgIDYpXG4gICAgICAgICAgICAgICAgfCAgICAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMykpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gY3AgLSAweDEwMDAwO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoKG9mZnNldCAgPj4+IDEwKSArIDB4RDgwMClcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoKG9mZnNldCAmIDB4M0ZGKSArIDB4REMwMCkpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgwZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgICAgIHwgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MWYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGJ0b3UgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UocmVfYnRvdSwgY2JfYnRvdSk7XG4gICAgfTtcbiAgICB2YXIgY2JfZGVjb2RlID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICB2YXIgbGVuID0gY2NjYy5sZW5ndGgsXG4gICAgICAgIHBhZGxlbiA9IGxlbiAlIDQsXG4gICAgICAgIG4gPSAobGVuID4gMCA/IGI2NHRhYltjY2NjLmNoYXJBdCgwKV0gPDwgMTggOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMSA/IGI2NHRhYltjY2NjLmNoYXJBdCgxKV0gPDwgMTIgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMiA/IGI2NHRhYltjY2NjLmNoYXJBdCgyKV0gPDwgIDYgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMyA/IGI2NHRhYltjY2NjLmNoYXJBdCgzKV0gICAgICAgOiAwKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gPj4+IDE2KSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSgobiA+Pj4gIDgpICYgMHhmZiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gICAgICAgICAmIDB4ZmYpXG4gICAgICAgIF07XG4gICAgICAgIGNoYXJzLmxlbmd0aCAtPSBbMCwgMCwgMiwgMV1bcGFkbGVuXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIF9hdG9iID0gZ2xvYmFsLmF0b2IgJiYgdHlwZW9mIGdsb2JhbC5hdG9iID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBmdW5jdGlvbihhKXsgcmV0dXJuIGdsb2JhbC5hdG9iKGEpIH0gOiBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIGEucmVwbGFjZSgvXFxTezEsNH0vZywgY2JfZGVjb2RlKTtcbiAgICB9O1xuICAgIHZhciBhdG9iID0gZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gX2F0b2IoU3RyaW5nKGEpLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJykpO1xuICAgIH07XG4gICAgdmFyIF9kZWNvZGUgPSBmdW5jdGlvbihhKSB7IHJldHVybiBidG91KF9hdG9iKGEpKSB9O1xuICAgIHZhciBfZnJvbVVSSSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhhKS5yZXBsYWNlKC9bLV9dL2csIGZ1bmN0aW9uKG0wKSB7XG4gICAgICAgICAgICByZXR1cm4gbTAgPT0gJy0nID8gJysnIDogJy8nXG4gICAgICAgIH0pLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJyk7XG4gICAgfTtcbiAgICB2YXIgZGVjb2RlID0gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKF9mcm9tVVJJKGEpKTtcbiAgICB9O1xuICAgIHZhciB0b1VpbnQ4QXJyYXk7XG4gICAgaWYgKGdsb2JhbC5VaW50OEFycmF5KSB0b1VpbnQ4QXJyYXkgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LmZyb20oYXRvYihfZnJvbVVSSShhKSksIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIG5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgICAgIGdsb2JhbC5CYXNlNjQgPSBfQmFzZTY0O1xuICAgICAgICByZXR1cm4gQmFzZTY0O1xuICAgIH07XG4gICAgLy8gZXhwb3J0IEJhc2U2NFxuICAgIGdsb2JhbC5CYXNlNjQgPSB7XG4gICAgICAgIFZFUlNJT046IHZlcnNpb24sXG4gICAgICAgIGF0b2I6IGF0b2IsXG4gICAgICAgIGJ0b2E6IGJ0b2EsXG4gICAgICAgIGZyb21CYXNlNjQ6IGRlY29kZSxcbiAgICAgICAgdG9CYXNlNjQ6IGVuY29kZSxcbiAgICAgICAgdXRvYjogdXRvYixcbiAgICAgICAgZW5jb2RlOiBlbmNvZGUsXG4gICAgICAgIGVuY29kZVVSSTogZW5jb2RlVVJJLFxuICAgICAgICBidG91OiBidG91LFxuICAgICAgICBkZWNvZGU6IGRlY29kZSxcbiAgICAgICAgbm9Db25mbGljdDogbm9Db25mbGljdCxcbiAgICAgICAgZnJvbVVpbnQ4QXJyYXk6IGZyb21VaW50OEFycmF5LFxuICAgICAgICB0b1VpbnQ4QXJyYXk6IHRvVWludDhBcnJheVxuICAgIH07XG4gICAgLy8gaWYgRVM1IGlzIGF2YWlsYWJsZSwgbWFrZSBCYXNlNjQuZXh0ZW5kU3RyaW5nKCkgYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIG5vRW51bSA9IGZ1bmN0aW9uKHYpe1xuICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZTp2LGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZX07XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbC5CYXNlNjQuZXh0ZW5kU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICdmcm9tQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZSh0aGlzKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjQnLCBub0VudW0oZnVuY3Rpb24gKHVyaXNhZmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB1cmlzYWZlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjRVUkknLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlKHRoaXMsIHRydWUpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvL1xuICAgIC8vIGV4cG9ydCBCYXNlNjQgdG8gdGhlIG5hbWVzcGFjZVxuICAgIC8vXG4gICAgaWYgKGdsb2JhbFsnTWV0ZW9yJ10pIHsgLy8gTWV0ZW9yLmpzXG4gICAgICAgIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIC8vIG1vZHVsZS5leHBvcnRzIGFuZCBBTUQgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZS5cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBoYXMgcHJlY2VkZW5jZS5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMuQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpeyByZXR1cm4gZ2xvYmFsLkJhc2U2NCB9KTtcbiAgICB9XG4gICAgLy8gdGhhdCdzIGl0IVxuICAgIHJldHVybiB7QmFzZTY0OiBnbG9iYWwuQmFzZTY0fVxufSkpO1xuIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuIiwidmFyIHdpbGRjYXJkID0gcmVxdWlyZSgnd2lsZGNhcmQnKTtcbnZhciByZU1pbWVQYXJ0U3BsaXQgPSAvW1xcL1xcK1xcLl0vO1xuXG4vKipcbiAgIyBtaW1lLW1hdGNoXG5cbiAgQSBzaW1wbGUgZnVuY3Rpb24gdG8gY2hlY2tlciB3aGV0aGVyIGEgdGFyZ2V0IG1pbWUgdHlwZSBtYXRjaGVzIGEgbWltZS10eXBlXG4gIHBhdHRlcm4gKGUuZy4gaW1hZ2UvanBlZyBtYXRjaGVzIGltYWdlL2pwZWcgT1IgaW1hZ2UvKikuXG5cbiAgIyMgRXhhbXBsZSBVc2FnZVxuXG4gIDw8PCBleGFtcGxlLmpzXG5cbioqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHBhdHRlcm4pIHtcbiAgZnVuY3Rpb24gdGVzdChwYXR0ZXJuKSB7XG4gICAgdmFyIHJlc3VsdCA9IHdpbGRjYXJkKHBhdHRlcm4sIHRhcmdldCwgcmVNaW1lUGFydFNwbGl0KTtcblxuICAgIC8vIGVuc3VyZSB0aGF0IHdlIGhhdmUgYSB2YWxpZCBtaW1lIHR5cGUgKHNob3VsZCBoYXZlIHR3byBwYXJ0cylcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPj0gMjtcbiAgfVxuXG4gIHJldHVybiBwYXR0ZXJuID8gdGVzdChwYXR0ZXJuLnNwbGl0KCc7JylbMF0pIDogdGVzdDtcbn07XG4iLCIvKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAgIyB3aWxkY2FyZFxuXG4gIFZlcnkgc2ltcGxlIHdpbGRjYXJkIG1hdGNoaW5nLCB3aGljaCBpcyBkZXNpZ25lZCB0byBwcm92aWRlIHRoZSBzYW1lXG4gIGZ1bmN0aW9uYWxpdHkgdGhhdCBpcyBmb3VuZCBpbiB0aGVcbiAgW2V2ZV0oaHR0cHM6Ly9naXRodWIuY29tL2Fkb2JlLXdlYnBsYXRmb3JtL2V2ZSkgZXZlbnRpbmcgbGlicmFyeS5cblxuICAjIyBVc2FnZVxuXG4gIEl0IHdvcmtzIHdpdGggc3RyaW5nczpcblxuICA8PDwgZXhhbXBsZXMvc3RyaW5ncy5qc1xuXG4gIEFycmF5czpcblxuICA8PDwgZXhhbXBsZXMvYXJyYXlzLmpzXG5cbiAgT2JqZWN0cyAobWF0Y2hpbmcgYWdhaW5zdCBrZXlzKTpcblxuICA8PDwgZXhhbXBsZXMvb2JqZWN0cy5qc1xuXG4gIFdoaWxlIHRoZSBsaWJyYXJ5IHdvcmtzIGluIE5vZGUsIGlmIHlvdSBhcmUgYXJlIGxvb2tpbmcgZm9yIGZpbGUtYmFzZWRcbiAgd2lsZGNhcmQgbWF0Y2hpbmcgdGhlbiB5b3Ugc2hvdWxkIGhhdmUgYSBsb29rIGF0OlxuXG4gIDxodHRwczovL2dpdGh1Yi5jb20vaXNhYWNzL25vZGUtZ2xvYj5cbioqL1xuXG5mdW5jdGlvbiBXaWxkY2FyZE1hdGNoZXIodGV4dCwgc2VwYXJhdG9yKSB7XG4gIHRoaXMudGV4dCA9IHRleHQgPSB0ZXh0IHx8ICcnO1xuICB0aGlzLmhhc1dpbGQgPSB+dGV4dC5pbmRleE9mKCcqJyk7XG4gIHRoaXMuc2VwYXJhdG9yID0gc2VwYXJhdG9yO1xuICB0aGlzLnBhcnRzID0gdGV4dC5zcGxpdChzZXBhcmF0b3IpO1xufVxuXG5XaWxkY2FyZE1hdGNoZXIucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgdmFyIG1hdGNoZXMgPSB0cnVlO1xuICB2YXIgcGFydHMgPSB0aGlzLnBhcnRzO1xuICB2YXIgaWk7XG4gIHZhciBwYXJ0c0NvdW50ID0gcGFydHMubGVuZ3RoO1xuICB2YXIgdGVzdFBhcnRzO1xuXG4gIGlmICh0eXBlb2YgaW5wdXQgPT0gJ3N0cmluZycgfHwgaW5wdXQgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuaGFzV2lsZCAmJiB0aGlzLnRleHQgIT0gaW5wdXQpIHtcbiAgICAgIG1hdGNoZXMgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGVzdFBhcnRzID0gKGlucHV0IHx8ICcnKS5zcGxpdCh0aGlzLnNlcGFyYXRvcik7XG4gICAgICBmb3IgKGlpID0gMDsgbWF0Y2hlcyAmJiBpaSA8IHBhcnRzQ291bnQ7IGlpKyspIHtcbiAgICAgICAgaWYgKHBhcnRzW2lpXSA9PT0gJyonKSAge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGlpIDwgdGVzdFBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgIG1hdGNoZXMgPSBwYXJ0c1tpaV0gPT09IHRlc3RQYXJ0c1tpaV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF0Y2hlcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1hdGNoZXMsIHRoZW4gcmV0dXJuIHRoZSBjb21wb25lbnQgcGFydHNcbiAgICAgIG1hdGNoZXMgPSBtYXRjaGVzICYmIHRlc3RQYXJ0cztcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGlucHV0LnNwbGljZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgbWF0Y2hlcyA9IFtdO1xuXG4gICAgZm9yIChpaSA9IGlucHV0Lmxlbmd0aDsgaWktLTsgKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChpbnB1dFtpaV0pKSB7XG4gICAgICAgIG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGhdID0gaW5wdXRbaWldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT0gJ29iamVjdCcpIHtcbiAgICBtYXRjaGVzID0ge307XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gaW5wdXQpIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKGtleSkpIHtcbiAgICAgICAgbWF0Y2hlc1trZXldID0gaW5wdXRba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgdGVzdCwgc2VwYXJhdG9yKSB7XG4gIHZhciBtYXRjaGVyID0gbmV3IFdpbGRjYXJkTWF0Y2hlcih0ZXh0LCBzZXBhcmF0b3IgfHwgL1tcXC9cXC5dLyk7XG4gIGlmICh0eXBlb2YgdGVzdCAhPSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBtYXRjaGVyLm1hdGNoKHRlc3QpO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXI7XG59O1xuIiwiLyoqXG4qIENyZWF0ZSBhbiBldmVudCBlbWl0dGVyIHdpdGggbmFtZXNwYWNlc1xuKiBAbmFtZSBjcmVhdGVOYW1lc3BhY2VFbWl0dGVyXG4qIEBleGFtcGxlXG4qIHZhciBlbWl0dGVyID0gcmVxdWlyZSgnLi9pbmRleCcpKClcbipcbiogZW1pdHRlci5vbignKicsIGZ1bmN0aW9uICgpIHtcbiogICBjb25zb2xlLmxvZygnYWxsIGV2ZW50cyBlbWl0dGVkJywgdGhpcy5ldmVudClcbiogfSlcbipcbiogZW1pdHRlci5vbignZXhhbXBsZScsIGZ1bmN0aW9uICgpIHtcbiogICBjb25zb2xlLmxvZygnZXhhbXBsZSBldmVudCBlbWl0dGVkJylcbiogfSlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZU5hbWVzcGFjZUVtaXR0ZXIgKCkge1xuICB2YXIgZW1pdHRlciA9IHt9XG4gIHZhciBfZm5zID0gZW1pdHRlci5fZm5zID0ge31cblxuICAvKipcbiAgKiBFbWl0IGFuIGV2ZW50LiBPcHRpb25hbGx5IG5hbWVzcGFjZSB0aGUgZXZlbnQuIEhhbmRsZXJzIGFyZSBmaXJlZCBpbiB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSB3ZXJlIGFkZGVkIHdpdGggZXhhY3QgbWF0Y2hlcyB0YWtpbmcgcHJlY2VkZW5jZS4gU2VwYXJhdGUgdGhlIG5hbWVzcGFjZSBhbmQgZXZlbnQgd2l0aCBhIGA6YFxuICAqIEBuYW1lIGVtaXRcbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQg4oCTIHRoZSBuYW1lIG9mIHRoZSBldmVudCwgd2l0aCBvcHRpb25hbCBuYW1lc3BhY2VcbiAgKiBAcGFyYW0gey4uLip9IGRhdGEg4oCTIHVwIHRvIDYgYXJndW1lbnRzIHRoYXQgYXJlIHBhc3NlZCB0byB0aGUgZXZlbnQgbGlzdGVuZXJcbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIuZW1pdCgnZXhhbXBsZScpXG4gICogZW1pdHRlci5lbWl0KCdkZW1vOnRlc3QnKVxuICAqIGVtaXR0ZXIuZW1pdCgnZGF0YScsIHsgZXhhbXBsZTogdHJ1ZX0sICdhIHN0cmluZycsIDEpXG4gICovXG4gIGVtaXR0ZXIuZW1pdCA9IGZ1bmN0aW9uIGVtaXQgKGV2ZW50LCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1LCBhcmc2KSB7XG4gICAgdmFyIHRvRW1pdCA9IGdldExpc3RlbmVycyhldmVudClcblxuICAgIGlmICh0b0VtaXQubGVuZ3RoKSB7XG4gICAgICBlbWl0QWxsKGV2ZW50LCB0b0VtaXQsIFthcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1LCBhcmc2XSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBDcmVhdGUgZW4gZXZlbnQgbGlzdGVuZXIuXG4gICogQG5hbWUgb25cbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5vbignZXhhbXBsZScsIGZ1bmN0aW9uICgpIHt9KVxuICAqIGVtaXR0ZXIub24oJ2RlbW8nLCBmdW5jdGlvbiAoKSB7fSlcbiAgKi9cbiAgZW1pdHRlci5vbiA9IGZ1bmN0aW9uIG9uIChldmVudCwgZm4pIHtcbiAgICBpZiAoIV9mbnNbZXZlbnRdKSB7XG4gICAgICBfZm5zW2V2ZW50XSA9IFtdXG4gICAgfVxuXG4gICAgX2Zuc1tldmVudF0ucHVzaChmbilcbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBlbiBldmVudCBsaXN0ZW5lciB0aGF0IGZpcmVzIG9uY2UuXG4gICogQG5hbWUgb25jZVxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICogQGV4YW1wbGVcbiAgKiBlbWl0dGVyLm9uY2UoJ2V4YW1wbGUnLCBmdW5jdGlvbiAoKSB7fSlcbiAgKiBlbWl0dGVyLm9uY2UoJ2RlbW8nLCBmdW5jdGlvbiAoKSB7fSlcbiAgKi9cbiAgZW1pdHRlci5vbmNlID0gZnVuY3Rpb24gb25jZSAoZXZlbnQsIGZuKSB7XG4gICAgZnVuY3Rpb24gb25lICgpIHtcbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIGVtaXR0ZXIub2ZmKGV2ZW50LCBvbmUpXG4gICAgfVxuICAgIHRoaXMub24oZXZlbnQsIG9uZSlcbiAgfVxuXG4gIC8qKlxuICAqIFN0b3AgbGlzdGVuaW5nIHRvIGFuIGV2ZW50LiBTdG9wIGFsbCBsaXN0ZW5lcnMgb24gYW4gZXZlbnQgYnkgb25seSBwYXNzaW5nIHRoZSBldmVudCBuYW1lLiBTdG9wIGEgc2luZ2xlIGxpc3RlbmVyIGJ5IHBhc3NpbmcgdGhhdCBldmVudCBoYW5kbGVyIGFzIGEgY2FsbGJhY2suXG4gICogWW91IG11c3QgYmUgZXhwbGljaXQgYWJvdXQgd2hhdCB3aWxsIGJlIHVuc3Vic2NyaWJlZDogYGVtaXR0ZXIub2ZmKCdkZW1vJylgIHdpbGwgdW5zdWJzY3JpYmUgYW4gYGVtaXR0ZXIub24oJ2RlbW8nKWAgbGlzdGVuZXIsXG4gICogYGVtaXR0ZXIub2ZmKCdkZW1vOmV4YW1wbGUnKWAgd2lsbCB1bnN1YnNjcmliZSBhbiBgZW1pdHRlci5vbignZGVtbzpleGFtcGxlJylgIGxpc3RlbmVyXG4gICogQG5hbWUgb2ZmXG4gICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXSDigJMgdGhlIHNwZWNpZmljIGhhbmRsZXJcbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIub2ZmKCdleGFtcGxlJylcbiAgKiBlbWl0dGVyLm9mZignZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9mZiA9IGZ1bmN0aW9uIG9mZiAoZXZlbnQsIGZuKSB7XG4gICAgdmFyIGtlZXAgPSBbXVxuXG4gICAgaWYgKGV2ZW50ICYmIGZuKSB7XG4gICAgICB2YXIgZm5zID0gdGhpcy5fZm5zW2V2ZW50XVxuICAgICAgdmFyIGkgPSAwXG4gICAgICB2YXIgbCA9IGZucyA/IGZucy5sZW5ndGggOiAwXG5cbiAgICAgIGZvciAoaTsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoZm5zW2ldICE9PSBmbikge1xuICAgICAgICAgIGtlZXAucHVzaChmbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBrZWVwLmxlbmd0aCA/IHRoaXMuX2Zuc1tldmVudF0gPSBrZWVwIDogZGVsZXRlIHRoaXMuX2Zuc1tldmVudF1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpc3RlbmVycyAoZSkge1xuICAgIHZhciBvdXQgPSBfZm5zW2VdID8gX2Zuc1tlXSA6IFtdXG4gICAgdmFyIGlkeCA9IGUuaW5kZXhPZignOicpXG4gICAgdmFyIGFyZ3MgPSAoaWR4ID09PSAtMSkgPyBbZV0gOiBbZS5zdWJzdHJpbmcoMCwgaWR4KSwgZS5zdWJzdHJpbmcoaWR4ICsgMSldXG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKF9mbnMpXG4gICAgdmFyIGkgPSAwXG4gICAgdmFyIGwgPSBrZXlzLmxlbmd0aFxuXG4gICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgaWYgKGtleSA9PT0gJyonKSB7XG4gICAgICAgIG91dCA9IG91dC5jb25jYXQoX2Zuc1trZXldKVxuICAgICAgfVxuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiYgYXJnc1swXSA9PT0ga2V5KSB7XG4gICAgICAgIG91dCA9IG91dC5jb25jYXQoX2Zuc1trZXldKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXRBbGwgKGUsIGZucywgYXJncykge1xuICAgIHZhciBpID0gMFxuICAgIHZhciBsID0gZm5zLmxlbmd0aFxuXG4gICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoIWZuc1tpXSkgYnJlYWtcbiAgICAgIGZuc1tpXS5ldmVudCA9IGVcbiAgICAgIGZuc1tpXS5hcHBseShmbnNbaV0sIGFyZ3MpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVtaXR0ZXJcbn1cbiIsImxldCB7IHVybEFscGhhYmV0IH0gPSByZXF1aXJlKCcuL3VybC1hbHBoYWJldC9pbmRleC5janMnKVxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgaWYgKFxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmXG4gICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgJiZcbiAgICB0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJ1xuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnUmVhY3QgTmF0aXZlIGRvZXMgbm90IGhhdmUgYSBidWlsdC1pbiBzZWN1cmUgcmFuZG9tIGdlbmVyYXRvci4gJyArXG4gICAgICAgICdJZiB5b3UgZG9u4oCZdCBuZWVkIHVucHJlZGljdGFibGUgSURzIHVzZSBgbmFub2lkL25vbi1zZWN1cmVgLiAnICtcbiAgICAgICAgJ0ZvciBzZWN1cmUgSURzLCBpbXBvcnQgYHJlYWN0LW5hdGl2ZS1nZXQtcmFuZG9tLXZhbHVlc2AgJyArXG4gICAgICAgICdiZWZvcmUgTmFubyBJRC4nXG4gICAgKVxuICB9XG4gIGlmICh0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0ltcG9ydCBmaWxlIHdpdGggYGlmICghd2luZG93LmNyeXB0bykgd2luZG93LmNyeXB0byA9IHdpbmRvdy5tc0NyeXB0b2AnICtcbiAgICAgICAgJyBiZWZvcmUgaW1wb3J0aW5nIE5hbm8gSUQgdG8gZml4IElFIDExIHN1cHBvcnQnXG4gICAgKVxuICB9XG4gIGlmICh0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdZb3VyIGJyb3dzZXIgZG9lcyBub3QgaGF2ZSBzZWN1cmUgcmFuZG9tIGdlbmVyYXRvci4gJyArXG4gICAgICAgICdJZiB5b3UgZG9u4oCZdCBuZWVkIHVucHJlZGljdGFibGUgSURzLCB5b3UgY2FuIHVzZSBuYW5vaWQvbm9uLXNlY3VyZS4nXG4gICAgKVxuICB9XG59XG5sZXQgcmFuZG9tID0gYnl0ZXMgPT4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShieXRlcykpXG5sZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBzaXplLCBnZXRSYW5kb20pID0+IHtcbiAgbGV0IG1hc2sgPSAoMiA8PCAoTWF0aC5sb2coYWxwaGFiZXQubGVuZ3RoIC0gMSkgLyBNYXRoLkxOMikpIC0gMVxuICBsZXQgc3RlcCA9IC1+KCgxLjYgKiBtYXNrICogc2l6ZSkgLyBhbHBoYWJldC5sZW5ndGgpXG4gIHJldHVybiAoKSA9PiB7XG4gICAgbGV0IGlkID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHN0ZXApXG4gICAgICBsZXQgaiA9IHN0ZXBcbiAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgaWQgKz0gYWxwaGFiZXRbYnl0ZXNbal0gJiBtYXNrXSB8fCAnJ1xuICAgICAgICBpZiAoaWQubGVuZ3RoID09PSBzaXplKSByZXR1cm4gaWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmxldCBjdXN0b21BbHBoYWJldCA9IChhbHBoYWJldCwgc2l6ZSkgPT4gY3VzdG9tUmFuZG9tKGFscGhhYmV0LCBzaXplLCByYW5kb20pXG5sZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT4ge1xuICBsZXQgaWQgPSAnJ1xuICBsZXQgYnl0ZXMgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKVxuICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgbGV0IGJ5dGUgPSBieXRlc1tzaXplXSAmIDYzXG4gICAgaWYgKGJ5dGUgPCAzNikge1xuICAgICAgaWQgKz0gYnl0ZS50b1N0cmluZygzNilcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPCA2Mikge1xuICAgICAgaWQgKz0gKGJ5dGUgLSAyNikudG9TdHJpbmcoMzYpLnRvVXBwZXJDYXNlKClcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPCA2Mykge1xuICAgICAgaWQgKz0gJ18nXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkICs9ICctJ1xuICAgIH1cbiAgfVxuICByZXR1cm4gaWRcbn1cbm1vZHVsZS5leHBvcnRzID0geyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0LCBjdXN0b21SYW5kb20sIHVybEFscGhhYmV0LCByYW5kb20gfVxuIiwibGV0IHVybEFscGhhYmV0ID1cbiAgJ3VzZWFuZG9tLTI2VDE5ODM0MFBYNzVweEpBQ0tWRVJZTUlOREJVU0hXT0xGX0dRWmJmZ2hqa2xxdnd5enJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IHsgdXJsQWxwaGFiZXQgfVxuIiwidmFyIG4sbCx1LHQsaSxyLG8sZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZHxpdGVyYS9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gdihuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiBoKGwsdSx0KXt2YXIgaSxyLG8sZj17fTtmb3IobyBpbiB1KVwia2V5XCI9PW8/aT11W29dOlwicmVmXCI9PW8/cj11W29dOmZbb109dVtvXTtpZihhcmd1bWVudHMubGVuZ3RoPjImJihmLmNoaWxkcmVuPWFyZ3VtZW50cy5sZW5ndGg+Mz9uLmNhbGwoYXJndW1lbnRzLDIpOnQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwmJm51bGwhPWwuZGVmYXVsdFByb3BzKWZvcihvIGluIGwuZGVmYXVsdFByb3BzKXZvaWQgMD09PWZbb10mJihmW29dPWwuZGVmYXVsdFByb3BzW29dKTtyZXR1cm4gcChsLGYsaSxyLG51bGwpfWZ1bmN0aW9uIHAobix0LGkscixvKXt2YXIgZj17dHlwZTpuLHByb3BzOnQsa2V5OmkscmVmOnIsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLF9faDpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6bnVsbD09bz8rK3U6b307cmV0dXJuIG51bGw9PW8mJm51bGwhPWwudm5vZGUmJmwudm5vZGUoZiksZn1mdW5jdGlvbiB5KG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIGQobixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gXyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/XyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT9fKG4pOm51bGx9ZnVuY3Rpb24gayhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGsobil9fWZ1bmN0aW9uIHgobil7KCFuLl9fZCYmKG4uX19kPSEwKSYmaS5wdXNoKG4pJiYhYi5fX3IrK3x8byE9PWwuZGVib3VuY2VSZW5kZXJpbmcpJiYoKG89bC5kZWJvdW5jZVJlbmRlcmluZyl8fHIpKGIpfWZ1bmN0aW9uIGIoKXtmb3IodmFyIG47Yi5fX3I9aS5sZW5ndGg7KW49aS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSxpPVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LHQsaSxyLG87bi5fX2QmJihyPShpPShsPW4pLl9fdikuX19lLChvPWwuX19QKSYmKHU9W10sKHQ9YSh7fSxpKSkuX192PWkuX192KzEsSShvLGksdCxsLl9fbix2b2lkIDAhPT1vLm93bmVyU1ZHRWxlbWVudCxudWxsIT1pLl9faD9bcl06bnVsbCx1LG51bGw9PXI/XyhpKTpyLGkuX19oKSxUKHUsaSksaS5fX2UhPXImJmsoaSkpKX0pfWZ1bmN0aW9uIG0obixsLHUsdCxpLHIsbyxmLHMsYSl7dmFyIHYsaCxkLGsseCxiLG0sQT10JiZ0Ll9fa3x8YyxQPUEubGVuZ3RoO2Zvcih1Ll9faz1bXSx2PTA7djxsLmxlbmd0aDt2KyspaWYobnVsbCE9KGs9dS5fX2tbdl09bnVsbD09KGs9bFt2XSl8fFwiYm9vbGVhblwiPT10eXBlb2Ygaz9udWxsOlwic3RyaW5nXCI9PXR5cGVvZiBrfHxcIm51bWJlclwiPT10eXBlb2Yga3x8XCJiaWdpbnRcIj09dHlwZW9mIGs/cChudWxsLGssbnVsbCxudWxsLGspOkFycmF5LmlzQXJyYXkoayk/cCh5LHtjaGlsZHJlbjprfSxudWxsLG51bGwsbnVsbCk6ay5fX2I+MD9wKGsudHlwZSxrLnByb3BzLGsua2V5LG51bGwsay5fX3YpOmspKXtpZihrLl9fPXUsay5fX2I9dS5fX2IrMSxudWxsPT09KGQ9QVt2XSl8fGQmJmsua2V5PT1kLmtleSYmay50eXBlPT09ZC50eXBlKUFbdl09dm9pZCAwO2Vsc2UgZm9yKGg9MDtoPFA7aCsrKXtpZigoZD1BW2hdKSYmay5rZXk9PWQua2V5JiZrLnR5cGU9PT1kLnR5cGUpe0FbaF09dm9pZCAwO2JyZWFrfWQ9bnVsbH1JKG4sayxkPWR8fGUsaSxyLG8sZixzLGEpLHg9ay5fX2UsKGg9ay5yZWYpJiZkLnJlZiE9aCYmKG18fChtPVtdKSxkLnJlZiYmbS5wdXNoKGQucmVmLG51bGwsayksbS5wdXNoKGgsay5fX2N8fHgsaykpLG51bGwhPXg/KG51bGw9PWImJihiPXgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGsudHlwZSYmay5fX2s9PT1kLl9faz9rLl9fZD1zPWcoayxzLG4pOnM9dyhuLGssZCxBLHgscyksXCJmdW5jdGlvblwiPT10eXBlb2YgdS50eXBlJiYodS5fX2Q9cykpOnMmJmQuX19lPT1zJiZzLnBhcmVudE5vZGUhPW4mJihzPV8oZCkpfWZvcih1Ll9fZT1iLHY9UDt2LS07KW51bGwhPUFbdl0mJihcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LnR5cGUmJm51bGwhPUFbdl0uX19lJiZBW3ZdLl9fZT09dS5fX2QmJih1Ll9fZD1fKHQsdisxKSksTChBW3ZdLEFbdl0pKTtpZihtKWZvcih2PTA7djxtLmxlbmd0aDt2KyspeihtW3ZdLG1bKyt2XSxtWysrdl0pfWZ1bmN0aW9uIGcobixsLHUpe2Zvcih2YXIgdCxpPW4uX19rLHI9MDtpJiZyPGkubGVuZ3RoO3IrKykodD1pW3JdKSYmKHQuX189bixsPVwiZnVuY3Rpb25cIj09dHlwZW9mIHQudHlwZT9nKHQsbCx1KTp3KHUsdCx0LGksdC5fX2UsbCkpO3JldHVybiBsfWZ1bmN0aW9uIHcobixsLHUsdCxpLHIpe3ZhciBvLGYsZTtpZih2b2lkIDAhPT1sLl9fZClvPWwuX19kLGwuX19kPXZvaWQgMDtlbHNlIGlmKG51bGw9PXV8fGkhPXJ8fG51bGw9PWkucGFyZW50Tm9kZSluOmlmKG51bGw9PXJ8fHIucGFyZW50Tm9kZSE9PW4pbi5hcHBlbmRDaGlsZChpKSxvPW51bGw7ZWxzZXtmb3IoZj1yLGU9MDsoZj1mLm5leHRTaWJsaW5nKSYmZTx0Lmxlbmd0aDtlKz0yKWlmKGY9PWkpYnJlYWsgbjtuLmluc2VydEJlZm9yZShpLHIpLG89cn1yZXR1cm4gdm9pZCAwIT09bz9vOmkubmV4dFNpYmxpbmd9ZnVuY3Rpb24gQShuLGwsdSx0LGkpe3ZhciByO2ZvcihyIGluIHUpXCJjaGlsZHJlblwiPT09cnx8XCJrZXlcIj09PXJ8fHIgaW4gbHx8QyhuLHIsbnVsbCx1W3JdLHQpO2ZvcihyIGluIGwpaSYmXCJmdW5jdGlvblwiIT10eXBlb2YgbFtyXXx8XCJjaGlsZHJlblwiPT09cnx8XCJrZXlcIj09PXJ8fFwidmFsdWVcIj09PXJ8fFwiY2hlY2tlZFwiPT09cnx8dVtyXT09PWxbcl18fEMobixyLGxbcl0sdVtyXSx0KX1mdW5jdGlvbiBQKG4sbCx1KXtcIi1cIj09PWxbMF0/bi5zZXRQcm9wZXJ0eShsLHUpOm5bbF09bnVsbD09dT9cIlwiOlwibnVtYmVyXCIhPXR5cGVvZiB1fHxzLnRlc3QobCk/dTp1K1wicHhcIn1mdW5jdGlvbiBDKG4sbCx1LHQsaSl7dmFyIHI7bjppZihcInN0eWxlXCI9PT1sKWlmKFwic3RyaW5nXCI9PXR5cGVvZiB1KW4uc3R5bGUuY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQmJihuLnN0eWxlLmNzc1RleHQ9dD1cIlwiKSx0KWZvcihsIGluIHQpdSYmbCBpbiB1fHxQKG4uc3R5bGUsbCxcIlwiKTtpZih1KWZvcihsIGluIHUpdCYmdVtsXT09PXRbbF18fFAobi5zdHlsZSxsLHVbbF0pfWVsc2UgaWYoXCJvXCI9PT1sWzBdJiZcIm5cIj09PWxbMV0pcj1sIT09KGw9bC5yZXBsYWNlKC9DYXB0dXJlJC8sXCJcIikpLGw9bC50b0xvd2VyQ2FzZSgpaW4gbj9sLnRvTG93ZXJDYXNlKCkuc2xpY2UoMik6bC5zbGljZSgyKSxuLmx8fChuLmw9e30pLG4ubFtsK3JdPXUsdT90fHxuLmFkZEV2ZW50TGlzdGVuZXIobCxyP0g6JCxyKTpuLnJlbW92ZUV2ZW50TGlzdGVuZXIobCxyP0g6JCxyKTtlbHNlIGlmKFwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIiE9PWwpe2lmKGkpbD1sLnJlcGxhY2UoL3hsaW5rW0g6aF0vLFwiaFwiKS5yZXBsYWNlKC9zTmFtZSQvLFwic1wiKTtlbHNlIGlmKFwiaHJlZlwiIT09bCYmXCJsaXN0XCIhPT1sJiZcImZvcm1cIiE9PWwmJlwidGFiSW5kZXhcIiE9PWwmJlwiZG93bmxvYWRcIiE9PWwmJmwgaW4gbil0cnl7bltsXT1udWxsPT11P1wiXCI6dTticmVhayBufWNhdGNoKG4pe31cImZ1bmN0aW9uXCI9PXR5cGVvZiB1fHwobnVsbCE9dSYmKCExIT09dXx8XCJhXCI9PT1sWzBdJiZcInJcIj09PWxbMV0pP24uc2V0QXR0cmlidXRlKGwsdSk6bi5yZW1vdmVBdHRyaWJ1dGUobCkpfX1mdW5jdGlvbiAkKG4pe3RoaXMubFtuLnR5cGUrITFdKGwuZXZlbnQ/bC5ldmVudChuKTpuKX1mdW5jdGlvbiBIKG4pe3RoaXMubFtuLnR5cGUrITBdKGwuZXZlbnQ/bC5ldmVudChuKTpuKX1mdW5jdGlvbiBJKG4sdSx0LGkscixvLGYsZSxjKXt2YXIgcyx2LGgscCxfLGsseCxiLGcsdyxBLFA9dS50eXBlO2lmKHZvaWQgMCE9PXUuY29uc3RydWN0b3IpcmV0dXJuIG51bGw7bnVsbCE9dC5fX2gmJihjPXQuX19oLGU9dS5fX2U9dC5fX2UsdS5fX2g9bnVsbCxvPVtlXSksKHM9bC5fX2IpJiZzKHUpO3RyeXtuOmlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFApe2lmKGI9dS5wcm9wcyxnPShzPVAuY29udGV4dFR5cGUpJiZpW3MuX19jXSx3PXM/Zz9nLnByb3BzLnZhbHVlOnMuX186aSx0Ll9fYz94PSh2PXUuX19jPXQuX19jKS5fXz12Ll9fRTooXCJwcm90b3R5cGVcImluIFAmJlAucHJvdG90eXBlLnJlbmRlcj91Ll9fYz12PW5ldyBQKGIsdyk6KHUuX19jPXY9bmV3IGQoYix3KSx2LmNvbnN0cnVjdG9yPVAsdi5yZW5kZXI9TSksZyYmZy5zdWIodiksdi5wcm9wcz1iLHYuc3RhdGV8fCh2LnN0YXRlPXt9KSx2LmNvbnRleHQ9dyx2Ll9fbj1pLGg9di5fX2Q9ITAsdi5fX2g9W10pLG51bGw9PXYuX19zJiYodi5fX3M9di5zdGF0ZSksbnVsbCE9UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJih2Ll9fcz09di5zdGF0ZSYmKHYuX19zPWEoe30sdi5fX3MpKSxhKHYuX19zLFAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGIsdi5fX3MpKSkscD12LnByb3BzLF89di5zdGF0ZSxoKW51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT12LmNvbXBvbmVudFdpbGxNb3VudCYmdi5jb21wb25lbnRXaWxsTW91bnQoKSxudWxsIT12LmNvbXBvbmVudERpZE1vdW50JiZ2Ll9faC5wdXNoKHYuY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYobnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJmIhPT1wJiZudWxsIT12LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJnYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhiLHcpLCF2Ll9fZSYmbnVsbCE9di5zaG91bGRDb21wb25lbnRVcGRhdGUmJiExPT09di5zaG91bGRDb21wb25lbnRVcGRhdGUoYix2Ll9fcyx3KXx8dS5fX3Y9PT10Ll9fdil7di5wcm9wcz1iLHYuc3RhdGU9di5fX3MsdS5fX3YhPT10Ll9fdiYmKHYuX19kPSExKSx2Ll9fdj11LHUuX19lPXQuX19lLHUuX19rPXQuX19rLHUuX19rLmZvckVhY2goZnVuY3Rpb24obil7biYmKG4uX189dSl9KSx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KTticmVhayBufW51bGwhPXYuY29tcG9uZW50V2lsbFVwZGF0ZSYmdi5jb21wb25lbnRXaWxsVXBkYXRlKGIsdi5fX3MsdyksbnVsbCE9di5jb21wb25lbnREaWRVcGRhdGUmJnYuX19oLnB1c2goZnVuY3Rpb24oKXt2LmNvbXBvbmVudERpZFVwZGF0ZShwLF8sayl9KX12LmNvbnRleHQ9dyx2LnByb3BzPWIsdi5zdGF0ZT12Ll9fcywocz1sLl9fcikmJnModSksdi5fX2Q9ITEsdi5fX3Y9dSx2Ll9fUD1uLHM9di5yZW5kZXIodi5wcm9wcyx2LnN0YXRlLHYuY29udGV4dCksdi5zdGF0ZT12Ll9fcyxudWxsIT12LmdldENoaWxkQ29udGV4dCYmKGk9YShhKHt9LGkpLHYuZ2V0Q2hpbGRDb250ZXh0KCkpKSxofHxudWxsPT12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlfHwoaz12LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHAsXykpLEE9bnVsbCE9cyYmcy50eXBlPT09eSYmbnVsbD09cy5rZXk/cy5wcm9wcy5jaGlsZHJlbjpzLG0obixBcnJheS5pc0FycmF5KEEpP0E6W0FdLHUsdCxpLHIsbyxmLGUsYyksdi5iYXNlPXUuX19lLHUuX19oPW51bGwsdi5fX2gubGVuZ3RoJiZmLnB1c2godikseCYmKHYuX19FPXYuX189bnVsbCksdi5fX2U9ITF9ZWxzZSBudWxsPT1vJiZ1Ll9fdj09PXQuX192Pyh1Ll9faz10Ll9fayx1Ll9fZT10Ll9fZSk6dS5fX2U9aih0Ll9fZSx1LHQsaSxyLG8sZixjKTsocz1sLmRpZmZlZCkmJnModSl9Y2F0Y2gobil7dS5fX3Y9bnVsbCwoY3x8bnVsbCE9bykmJih1Ll9fZT1lLHUuX19oPSEhYyxvW28uaW5kZXhPZihlKV09bnVsbCksbC5fX2Uobix1LHQpfX1mdW5jdGlvbiBUKG4sdSl7bC5fX2MmJmwuX19jKHUsbiksbi5zb21lKGZ1bmN0aW9uKHUpe3RyeXtuPXUuX19oLHUuX19oPVtdLG4uc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChuKXtsLl9fZShuLHUuX192KX19KX1mdW5jdGlvbiBqKGwsdSx0LGkscixvLGYsYyl7dmFyIHMsYSxoLHA9dC5wcm9wcyx5PXUucHJvcHMsZD11LnR5cGUsaz0wO2lmKFwic3ZnXCI9PT1kJiYocj0hMCksbnVsbCE9bylmb3IoO2s8by5sZW5ndGg7aysrKWlmKChzPW9ba10pJiYocz09PWx8fChkP3MubG9jYWxOYW1lPT1kOjM9PXMubm9kZVR5cGUpKSl7bD1zLG9ba109bnVsbDticmVha31pZihudWxsPT1sKXtpZihudWxsPT09ZClyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoeSk7bD1yP2RvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsZCk6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkLHkuaXMmJnkpLG89bnVsbCxjPSExfWlmKG51bGw9PT1kKXA9PT15fHxjJiZsLmRhdGE9PT15fHwobC5kYXRhPXkpO2Vsc2V7aWYobz1vJiZuLmNhbGwobC5jaGlsZE5vZGVzKSxhPShwPXQucHJvcHN8fGUpLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLGg9eS5kYW5nZXJvdXNseVNldElubmVySFRNTCwhYyl7aWYobnVsbCE9bylmb3IocD17fSxrPTA7azxsLmF0dHJpYnV0ZXMubGVuZ3RoO2srKylwW2wuYXR0cmlidXRlc1trXS5uYW1lXT1sLmF0dHJpYnV0ZXNba10udmFsdWU7KGh8fGEpJiYoaCYmKGEmJmguX19odG1sPT1hLl9faHRtbHx8aC5fX2h0bWw9PT1sLmlubmVySFRNTCl8fChsLmlubmVySFRNTD1oJiZoLl9faHRtbHx8XCJcIikpfWlmKEEobCx5LHAscixjKSxoKXUuX19rPVtdO2Vsc2UgaWYoaz11LnByb3BzLmNoaWxkcmVuLG0obCxBcnJheS5pc0FycmF5KGspP2s6W2tdLHUsdCxpLHImJlwiZm9yZWlnbk9iamVjdFwiIT09ZCxvLGYsbz9vWzBdOnQuX19rJiZfKHQsMCksYyksbnVsbCE9bylmb3Ioaz1vLmxlbmd0aDtrLS07KW51bGwhPW9ba10mJnYob1trXSk7Y3x8KFwidmFsdWVcImluIHkmJnZvaWQgMCE9PShrPXkudmFsdWUpJiYoayE9PWwudmFsdWV8fFwicHJvZ3Jlc3NcIj09PWQmJiFrKSYmQyhsLFwidmFsdWVcIixrLHAudmFsdWUsITEpLFwiY2hlY2tlZFwiaW4geSYmdm9pZCAwIT09KGs9eS5jaGVja2VkKSYmayE9PWwuY2hlY2tlZCYmQyhsLFwiY2hlY2tlZFwiLGsscC5jaGVja2VkLCExKSl9cmV0dXJuIGx9ZnVuY3Rpb24geihuLHUsdCl7dHJ5e1wiZnVuY3Rpb25cIj09dHlwZW9mIG4/bih1KTpuLmN1cnJlbnQ9dX1jYXRjaChuKXtsLl9fZShuLHQpfX1mdW5jdGlvbiBMKG4sdSx0KXt2YXIgaSxyO2lmKGwudW5tb3VudCYmbC51bm1vdW50KG4pLChpPW4ucmVmKSYmKGkuY3VycmVudCYmaS5jdXJyZW50IT09bi5fX2V8fHooaSxudWxsLHUpKSxudWxsIT0oaT1uLl9fYykpe2lmKGkuY29tcG9uZW50V2lsbFVubW91bnQpdHJ5e2kuY29tcG9uZW50V2lsbFVubW91bnQoKX1jYXRjaChuKXtsLl9fZShuLHUpfWkuYmFzZT1pLl9fUD1udWxsfWlmKGk9bi5fX2spZm9yKHI9MDtyPGkubGVuZ3RoO3IrKylpW3JdJiZMKGlbcl0sdSxcImZ1bmN0aW9uXCIhPXR5cGVvZiBuLnR5cGUpO3R8fG51bGw9PW4uX19lfHx2KG4uX19lKSxuLl9fZT1uLl9fZD12b2lkIDB9ZnVuY3Rpb24gTShuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBOKHUsdCxpKXt2YXIgcixvLGY7bC5fXyYmbC5fXyh1LHQpLG89KHI9XCJmdW5jdGlvblwiPT10eXBlb2YgaSk/bnVsbDppJiZpLl9fa3x8dC5fX2ssZj1bXSxJKHQsdT0oIXImJml8fHQpLl9faz1oKHksbnVsbCxbdV0pLG98fGUsZSx2b2lkIDAhPT10Lm93bmVyU1ZHRWxlbWVudCwhciYmaT9baV06bz9udWxsOnQuZmlyc3RDaGlsZD9uLmNhbGwodC5jaGlsZE5vZGVzKTpudWxsLGYsIXImJmk/aTpvP28uX19lOnQuZmlyc3RDaGlsZCxyKSxUKGYsdSl9bj1jLnNsaWNlLGw9e19fZTpmdW5jdGlvbihuLGwpe2Zvcih2YXIgdSx0LGk7bD1sLl9fOylpZigodT1sLl9fYykmJiF1Ll9fKXRyeXtpZigodD11LmNvbnN0cnVjdG9yKSYmbnVsbCE9dC5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJih1LnNldFN0YXRlKHQuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSxpPXUuX19kKSxudWxsIT11LmNvbXBvbmVudERpZENhdGNoJiYodS5jb21wb25lbnREaWRDYXRjaChuKSxpPXUuX19kKSxpKXJldHVybiB1Ll9fRT11fWNhdGNoKGwpe249bH10aHJvdyBufX0sdT0wLHQ9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LGQucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT1udWxsIT10aGlzLl9fcyYmdGhpcy5fX3MhPT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWEoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bihhKHt9LHUpLHRoaXMucHJvcHMpKSxuJiZhKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9faC5wdXNoKGwpLHgodGhpcykpfSxkLnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobikseCh0aGlzKSl9LGQucHJvdG90eXBlLnJlbmRlcj15LGk9W10scj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxiLl9fcj0wLGY9MCxleHBvcnRzLnJlbmRlcj1OLGV4cG9ydHMuaHlkcmF0ZT1mdW5jdGlvbiBuKGwsdSl7TihsLHUsbil9LGV4cG9ydHMuY3JlYXRlRWxlbWVudD1oLGV4cG9ydHMuaD1oLGV4cG9ydHMuRnJhZ21lbnQ9eSxleHBvcnRzLmNyZWF0ZVJlZj1mdW5jdGlvbigpe3JldHVybntjdXJyZW50Om51bGx9fSxleHBvcnRzLmlzVmFsaWRFbGVtZW50PXQsZXhwb3J0cy5Db21wb25lbnQ9ZCxleHBvcnRzLmNsb25lRWxlbWVudD1mdW5jdGlvbihsLHUsdCl7dmFyIGkscixvLGY9YSh7fSxsLnByb3BzKTtmb3IobyBpbiB1KVwia2V5XCI9PW8/aT11W29dOlwicmVmXCI9PW8/cj11W29dOmZbb109dVtvXTtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD4yJiYoZi5jaGlsZHJlbj1hcmd1bWVudHMubGVuZ3RoPjM/bi5jYWxsKGFyZ3VtZW50cywyKTp0KSxwKGwudHlwZSxmLGl8fGwua2V5LHJ8fGwucmVmLG51bGwpfSxleHBvcnRzLmNyZWF0ZUNvbnRleHQ9ZnVuY3Rpb24obixsKXt2YXIgdT17X19jOmw9XCJfX2NDXCIrZisrLF9fOm4sQ29uc3VtZXI6ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0sUHJvdmlkZXI6ZnVuY3Rpb24obil7dmFyIHUsdDtyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fCh1PVtdLCh0PXt9KVtsXT10aGlzLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMucHJvcHMudmFsdWUhPT1uLnZhbHVlJiZ1LnNvbWUoeCl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe3UucHVzaChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1LnNwbGljZSh1LmluZGV4T2YobiksMSksbCYmbC5jYWxsKG4pfX0pLG4uY2hpbGRyZW59fTtyZXR1cm4gdS5Qcm92aWRlci5fXz11LkNvbnN1bWVyLmNvbnRleHRUeXBlPXV9LGV4cG9ydHMudG9DaGlsZEFycmF5PWZ1bmN0aW9uIG4obCx1KXtyZXR1cm4gdT11fHxbXSxudWxsPT1sfHxcImJvb2xlYW5cIj09dHlwZW9mIGx8fChBcnJheS5pc0FycmF5KGwpP2wuc29tZShmdW5jdGlvbihsKXtuKGwsdSl9KTp1LnB1c2gobCkpLHV9LGV4cG9ydHMub3B0aW9ucz1sO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LmpzLm1hcFxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbiAgLCB1bmRlZjtcblxuLyoqXG4gKiBEZWNvZGUgYSBVUkkgZW5jb2RlZCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBVUkkgZW5jb2RlZCBzdHJpbmcuXG4gKiBAcmV0dXJucyB7U3RyaW5nfE51bGx9IFRoZSBkZWNvZGVkIHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGlucHV0LnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gZW5jb2RlIGEgZ2l2ZW4gaW5wdXQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgdGhhdCBuZWVkcyB0byBiZSBlbmNvZGVkLlxuICogQHJldHVybnMge1N0cmluZ3xOdWxsfSBUaGUgZW5jb2RlZCBzdHJpbmcuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZW5jb2RlKGlucHV0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChpbnB1dCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBxdWVyeSBzdHJpbmcgcGFyc2VyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeSBUaGUgcXVlcnkgc3RyaW5nIHRoYXQgbmVlZHMgdG8gYmUgcGFyc2VkLlxuICogQHJldHVybnMge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nKHF1ZXJ5KSB7XG4gIHZhciBwYXJzZXIgPSAvKFtePT8jJl0rKT0/KFteJl0qKS9nXG4gICAgLCByZXN1bHQgPSB7fVxuICAgICwgcGFydDtcblxuICB3aGlsZSAocGFydCA9IHBhcnNlci5leGVjKHF1ZXJ5KSkge1xuICAgIHZhciBrZXkgPSBkZWNvZGUocGFydFsxXSlcbiAgICAgICwgdmFsdWUgPSBkZWNvZGUocGFydFsyXSk7XG5cbiAgICAvL1xuICAgIC8vIFByZXZlbnQgb3ZlcnJpZGluZyBvZiBleGlzdGluZyBwcm9wZXJ0aWVzLiBUaGlzIGVuc3VyZXMgdGhhdCBidWlsZC1pblxuICAgIC8vIG1ldGhvZHMgbGlrZSBgdG9TdHJpbmdgIG9yIF9fcHJvdG9fXyBhcmUgbm90IG92ZXJyaWRlbiBieSBtYWxpY2lvdXNcbiAgICAvLyBxdWVyeXN0cmluZ3MuXG4gICAgLy9cbiAgICAvLyBJbiB0aGUgY2FzZSBpZiBmYWlsZWQgZGVjb2RpbmcsIHdlIHdhbnQgdG8gb21pdCB0aGUga2V5L3ZhbHVlIHBhaXJzXG4gICAgLy8gZnJvbSB0aGUgcmVzdWx0LlxuICAgIC8vXG4gICAgaWYgKGtleSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCBrZXkgaW4gcmVzdWx0KSBjb250aW51ZTtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gYSBxdWVyeSBzdHJpbmcgdG8gYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogT2JqZWN0IHRoYXQgc2hvdWxkIGJlIHRyYW5zZm9ybWVkLlxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeCBPcHRpb25hbCBwcmVmaXguXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcXVlcnlzdHJpbmdpZnkob2JqLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4IHx8ICcnO1xuXG4gIHZhciBwYWlycyA9IFtdXG4gICAgLCB2YWx1ZVxuICAgICwga2V5O1xuXG4gIC8vXG4gIC8vIE9wdGlvbmFsbHkgcHJlZml4IHdpdGggYSAnPycgaWYgbmVlZGVkXG4gIC8vXG4gIGlmICgnc3RyaW5nJyAhPT0gdHlwZW9mIHByZWZpeCkgcHJlZml4ID0gJz8nO1xuXG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmIChoYXMuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHZhbHVlID0gb2JqW2tleV07XG5cbiAgICAgIC8vXG4gICAgICAvLyBFZGdlIGNhc2VzIHdoZXJlIHdlIGFjdHVhbGx5IHdhbnQgdG8gZW5jb2RlIHRoZSB2YWx1ZSB0byBhbiBlbXB0eVxuICAgICAgLy8gc3RyaW5nIGluc3RlYWQgb2YgdGhlIHN0cmluZ2lmaWVkIHZhbHVlLlxuICAgICAgLy9cbiAgICAgIGlmICghdmFsdWUgJiYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZiB8fCBpc05hTih2YWx1ZSkpKSB7XG4gICAgICAgIHZhbHVlID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGtleSA9IGVuY29kZShrZXkpO1xuICAgICAgdmFsdWUgPSBlbmNvZGUodmFsdWUpO1xuXG4gICAgICAvL1xuICAgICAgLy8gSWYgd2UgZmFpbGVkIHRvIGVuY29kZSB0aGUgc3RyaW5ncywgd2Ugc2hvdWxkIGJhaWwgb3V0IGFzIHdlIGRvbid0XG4gICAgICAvLyB3YW50IHRvIGFkZCBpbnZhbGlkIHN0cmluZ3MgdG8gdGhlIHF1ZXJ5LlxuICAgICAgLy9cbiAgICAgIGlmIChrZXkgPT09IG51bGwgfHwgdmFsdWUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgcGFpcnMucHVzaChrZXkgKyc9JysgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYWlycy5sZW5ndGggPyBwcmVmaXggKyBwYWlycy5qb2luKCcmJykgOiAnJztcbn1cblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydHMuc3RyaW5naWZ5ID0gcXVlcnlzdHJpbmdpZnk7XG5leHBvcnRzLnBhcnNlID0gcXVlcnlzdHJpbmc7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2hlY2sgaWYgd2UncmUgcmVxdWlyZWQgdG8gYWRkIGEgcG9ydCBudW1iZXIuXG4gKlxuICogQHNlZSBodHRwczovL3VybC5zcGVjLndoYXR3Zy5vcmcvI2RlZmF1bHQtcG9ydFxuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBwb3J0IFBvcnQgbnVtYmVyIHdlIG5lZWQgdG8gY2hlY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm90b2NvbCBQcm90b2NvbCB3ZSBuZWVkIHRvIGNoZWNrIGFnYWluc3QuXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gSXMgaXQgYSBkZWZhdWx0IHBvcnQgZm9yIHRoZSBnaXZlbiBwcm90b2NvbFxuICogQGFwaSBwcml2YXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVxdWlyZWQocG9ydCwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbC5zcGxpdCgnOicpWzBdO1xuICBwb3J0ID0gK3BvcnQ7XG5cbiAgaWYgKCFwb3J0KSByZXR1cm4gZmFsc2U7XG5cbiAgc3dpdGNoIChwcm90b2NvbCkge1xuICAgIGNhc2UgJ2h0dHAnOlxuICAgIGNhc2UgJ3dzJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gODA7XG5cbiAgICBjYXNlICdodHRwcyc6XG4gICAgY2FzZSAnd3NzJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gNDQzO1xuXG4gICAgY2FzZSAnZnRwJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gMjE7XG5cbiAgICBjYXNlICdnb3BoZXInOlxuICAgIHJldHVybiBwb3J0ICE9PSA3MDtcblxuICAgIGNhc2UgJ2ZpbGUnOlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBwb3J0ICE9PSAwO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgX2lzUmVhY3ROYXRpdmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2lzUmVhY3ROYXRpdmVcIikpO1xuXG52YXIgX3VyaVRvQmxvYiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vdXJpVG9CbG9iXCIpKTtcblxudmFyIF9pc0NvcmRvdmEgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2lzQ29yZG92YVwiKSk7XG5cbnZhciBfcmVhZEFzQnl0ZUFycmF5ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9yZWFkQXNCeXRlQXJyYXlcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5cbnZhciBGaWxlU291cmNlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgLy8gTWFrZSB0aGlzLnNpemUgYSBtZXRob2RcbiAgZnVuY3Rpb24gRmlsZVNvdXJjZShmaWxlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVTb3VyY2UpO1xuXG4gICAgdGhpcy5fZmlsZSA9IGZpbGU7XG4gICAgdGhpcy5zaXplID0gZmlsZS5zaXplO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEZpbGVTb3VyY2UsIFt7XG4gICAga2V5OiBcInNsaWNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNsaWNlKHN0YXJ0LCBlbmQpIHtcbiAgICAgIC8vIEluIEFwYWNoZSBDb3Jkb3ZhIGFwcGxpY2F0aW9ucywgYSBGaWxlIG11c3QgYmUgcmVzb2x2ZWQgdXNpbmdcbiAgICAgIC8vIEZpbGVSZWFkZXIgaW5zdGFuY2VzLCBzZWVcbiAgICAgIC8vIGh0dHBzOi8vY29yZG92YS5hcGFjaGUub3JnL2RvY3MvZW4vOC54L3JlZmVyZW5jZS9jb3Jkb3ZhLXBsdWdpbi1maWxlL2luZGV4Lmh0bWwjcmVhZC1hLWZpbGVcbiAgICAgIGlmICgoMCwgX2lzQ29yZG92YS5kZWZhdWx0KSgpKSB7XG4gICAgICAgIHJldHVybiAoMCwgX3JlYWRBc0J5dGVBcnJheS5kZWZhdWx0KSh0aGlzLl9maWxlLnNsaWNlKHN0YXJ0LCBlbmQpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlID0gdGhpcy5fZmlsZS5zbGljZShzdGFydCwgZW5kKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlKCkgey8vIE5vdGhpbmcgdG8gZG8gaGVyZSBzaW5jZSB3ZSBkb24ndCBuZWVkIHRvIHJlbGVhc2UgYW55IHJlc291cmNlcy5cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRmlsZVNvdXJjZTtcbn0oKTtcblxudmFyIFN0cmVhbVNvdXJjZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFN0cmVhbVNvdXJjZShyZWFkZXIsIGNodW5rU2l6ZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTdHJlYW1Tb3VyY2UpO1xuXG4gICAgdGhpcy5fY2h1bmtTaXplID0gY2h1bmtTaXplO1xuICAgIHRoaXMuX2J1ZmZlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9idWZmZXJPZmZzZXQgPSAwO1xuICAgIHRoaXMuX3JlYWRlciA9IHJlYWRlcjtcbiAgICB0aGlzLl9kb25lID0gZmFsc2U7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU3RyZWFtU291cmNlLCBbe1xuICAgIGtleTogXCJzbGljZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzbGljZShzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoc3RhcnQgPCB0aGlzLl9idWZmZXJPZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIlJlcXVlc3RlZCBkYXRhIGlzIGJlZm9yZSB0aGUgcmVhZGVyJ3MgY3VycmVudCBvZmZzZXRcIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fcmVhZFVudGlsRW5vdWdoRGF0YU9yRG9uZShzdGFydCwgZW5kKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX3JlYWRVbnRpbEVub3VnaERhdGFPckRvbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3JlYWRVbnRpbEVub3VnaERhdGFPckRvbmUoc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGhhc0Vub3VnaERhdGEgPSBlbmQgPD0gdGhpcy5fYnVmZmVyT2Zmc2V0ICsgbGVuKHRoaXMuX2J1ZmZlcik7XG5cbiAgICAgIGlmICh0aGlzLl9kb25lIHx8IGhhc0Vub3VnaERhdGEpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5fZ2V0RGF0YUZyb21CdWZmZXIoc3RhcnQsIGVuZCk7XG5cbiAgICAgICAgdmFyIGRvbmUgPSB2YWx1ZSA9PSBudWxsID8gdGhpcy5fZG9uZSA6IGZhbHNlO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgZG9uZTogZG9uZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3JlYWRlci5yZWFkKCkudGhlbihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgdmFsdWUgPSBfcmVmLnZhbHVlLFxuICAgICAgICAgICAgZG9uZSA9IF9yZWYuZG9uZTtcblxuICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgIF90aGlzLl9kb25lID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChfdGhpcy5fYnVmZmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBfdGhpcy5fYnVmZmVyID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMuX2J1ZmZlciA9IGNvbmNhdChfdGhpcy5fYnVmZmVyLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMuX3JlYWRVbnRpbEVub3VnaERhdGFPckRvbmUoc3RhcnQsIGVuZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2dldERhdGFGcm9tQnVmZmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXREYXRhRnJvbUJ1ZmZlcihzdGFydCwgZW5kKSB7XG4gICAgICAvLyBSZW1vdmUgZGF0YSBmcm9tIGJ1ZmZlciBiZWZvcmUgYHN0YXJ0YC5cbiAgICAgIC8vIERhdGEgbWlnaHQgYmUgcmVyZWFkIGZyb20gdGhlIGJ1ZmZlciBpZiBhbiB1cGxvYWQgZmFpbHMsIHNvIHdlIGNhbiBvbmx5XG4gICAgICAvLyBzYWZlbHkgZGVsZXRlIGRhdGEgd2hlbiBpdCBjb21lcyAqYmVmb3JlKiB3aGF0IGlzIGN1cnJlbnRseSBiZWluZyByZWFkLlxuICAgICAgaWYgKHN0YXJ0ID4gdGhpcy5fYnVmZmVyT2Zmc2V0KSB7XG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IHRoaXMuX2J1ZmZlci5zbGljZShzdGFydCAtIHRoaXMuX2J1ZmZlck9mZnNldCk7XG4gICAgICAgIHRoaXMuX2J1ZmZlck9mZnNldCA9IHN0YXJ0O1xuICAgICAgfSAvLyBJZiB0aGUgYnVmZmVyIGlzIGVtcHR5IGFmdGVyIHJlbW92aW5nIG9sZCBkYXRhLCBhbGwgZGF0YSBoYXMgYmVlbiByZWFkLlxuXG5cbiAgICAgIHZhciBoYXNBbGxEYXRhQmVlblJlYWQgPSBsZW4odGhpcy5fYnVmZmVyKSA9PT0gMDtcblxuICAgICAgaWYgKHRoaXMuX2RvbmUgJiYgaGFzQWxsRGF0YUJlZW5SZWFkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSAvLyBXZSBhbHJlYWR5IHJlbW92ZWQgZGF0YSBiZWZvcmUgYHN0YXJ0YCwgc28gd2UganVzdCByZXR1cm4gdGhlIGZpcnN0XG4gICAgICAvLyBjaHVuayBmcm9tIHRoZSBidWZmZXIuXG5cblxuICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlci5zbGljZSgwLCBlbmQgLSBzdGFydCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgaWYgKHRoaXMuX3JlYWRlci5jYW5jZWwpIHtcbiAgICAgICAgdGhpcy5fcmVhZGVyLmNhbmNlbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTdHJlYW1Tb3VyY2U7XG59KCk7XG5cbmZ1bmN0aW9uIGxlbihibG9iT3JBcnJheSkge1xuICBpZiAoYmxvYk9yQXJyYXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIDA7XG4gIGlmIChibG9iT3JBcnJheS5zaXplICE9PSB1bmRlZmluZWQpIHJldHVybiBibG9iT3JBcnJheS5zaXplO1xuICByZXR1cm4gYmxvYk9yQXJyYXkubGVuZ3RoO1xufVxuLypcbiAgVHlwZWQgYXJyYXlzIGFuZCBibG9icyBkb24ndCBoYXZlIGEgY29uY2F0IG1ldGhvZC5cbiAgVGhpcyBmdW5jdGlvbiBoZWxwcyBTdHJlYW1Tb3VyY2UgYWNjdW11bGF0ZSBkYXRhIHRvIHJlYWNoIGNodW5rU2l6ZS5cbiovXG5cblxuZnVuY3Rpb24gY29uY2F0KGEsIGIpIHtcbiAgaWYgKGEuY29uY2F0KSB7XG4gICAgLy8gSXMgYGFgIGFuIEFycmF5P1xuICAgIHJldHVybiBhLmNvbmNhdChiKTtcbiAgfVxuXG4gIGlmIChhIGluc3RhbmNlb2YgQmxvYikge1xuICAgIHJldHVybiBuZXcgQmxvYihbYSwgYl0sIHtcbiAgICAgIHR5cGU6IGEudHlwZVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGEuc2V0KSB7XG4gICAgLy8gSXMgYGFgIGEgdHlwZWQgYXJyYXk/XG4gICAgdmFyIGMgPSBuZXcgYS5jb25zdHJ1Y3RvcihhLmxlbmd0aCArIGIubGVuZ3RoKTtcbiAgICBjLnNldChhKTtcbiAgICBjLnNldChiLCBhLmxlbmd0aCk7XG4gICAgcmV0dXJuIGM7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZGF0YSB0eXBlJyk7XG59XG5cbnZhciBGaWxlUmVhZGVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRmlsZVJlYWRlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZVJlYWRlcik7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRmlsZVJlYWRlciwgW3tcbiAgICBrZXk6IFwib3BlbkZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbkZpbGUoaW5wdXQsIGNodW5rU2l6ZSkge1xuICAgICAgLy8gSW4gUmVhY3QgTmF0aXZlLCB3aGVuIHVzZXIgc2VsZWN0cyBhIGZpbGUsIGluc3RlYWQgb2YgYSBGaWxlIG9yIEJsb2IsXG4gICAgICAvLyB5b3UgdXN1YWxseSBnZXQgYSBmaWxlIG9iamVjdCB7fSB3aXRoIGEgdXJpIHByb3BlcnR5IHRoYXQgY29udGFpbnNcbiAgICAgIC8vIGEgbG9jYWwgcGF0aCB0byB0aGUgZmlsZS4gV2UgdXNlIFhNTEh0dHBSZXF1ZXN0IHRvIGZldGNoXG4gICAgICAvLyB0aGUgZmlsZSBibG9iLCBiZWZvcmUgdXBsb2FkaW5nIHdpdGggdHVzLlxuICAgICAgaWYgKCgwLCBfaXNSZWFjdE5hdGl2ZS5kZWZhdWx0KSgpICYmIGlucHV0ICYmIHR5cGVvZiBpbnB1dC51cmkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiAoMCwgX3VyaVRvQmxvYi5kZWZhdWx0KShpbnB1dC51cmkpLnRoZW4oZnVuY3Rpb24gKGJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEZpbGVTb3VyY2UoYmxvYik7XG4gICAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInR1czogY2Fubm90IGZldGNoIGBmaWxlLnVyaWAgYXMgQmxvYiwgbWFrZSBzdXJlIHRoZSB1cmkgaXMgY29ycmVjdCBhbmQgYWNjZXNzaWJsZS4gXCIuY29uY2F0KGVycikpO1xuICAgICAgICB9KTtcbiAgICAgIH0gLy8gU2luY2Ugd2UgZW11bGF0ZSB0aGUgQmxvYiB0eXBlIGluIG91ciB0ZXN0cyAobm90IGFsbCB0YXJnZXQgYnJvd3NlcnNcbiAgICAgIC8vIHN1cHBvcnQgaXQpLCB3ZSBjYW5ub3QgdXNlIGBpbnN0YW5jZW9mYCBmb3IgdGVzdGluZyB3aGV0aGVyIHRoZSBpbnB1dCB2YWx1ZVxuICAgICAgLy8gY2FuIGJlIGhhbmRsZWQuIEluc3RlYWQsIHdlIHNpbXBseSBjaGVjayBpcyB0aGUgc2xpY2UoKSBmdW5jdGlvbiBhbmQgdGhlXG4gICAgICAvLyBzaXplIHByb3BlcnR5IGFyZSBhdmFpbGFibGUuXG5cblxuICAgICAgaWYgKHR5cGVvZiBpbnB1dC5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgaW5wdXQuc2l6ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgRmlsZVNvdXJjZShpbnB1dCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGlucHV0LnJlYWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2h1bmtTaXplID0gK2NodW5rU2l6ZTtcblxuICAgICAgICBpZiAoIWlzRmluaXRlKGNodW5rU2l6ZSkpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdjYW5ub3QgY3JlYXRlIHNvdXJjZSBmb3Igc3RyZWFtIHdpdGhvdXQgYSBmaW5pdGUgdmFsdWUgZm9yIHRoZSBgY2h1bmtTaXplYCBvcHRpb24nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBTdHJlYW1Tb3VyY2UoaW5wdXQsIGNodW5rU2l6ZSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdzb3VyY2Ugb2JqZWN0IG1heSBvbmx5IGJlIGFuIGluc3RhbmNlIG9mIEZpbGUsIEJsb2IsIG9yIFJlYWRlciBpbiB0aGlzIGVudmlyb25tZW50JykpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBGaWxlUmVhZGVyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBGaWxlUmVhZGVyOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZmluZ2VycHJpbnQ7XG5cbnZhciBfaXNSZWFjdE5hdGl2ZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaXNSZWFjdE5hdGl2ZVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIFRPRE86IERpZmZlcmVuY2lhdGUgYmV0d2VlbiBpbnB1dCB0eXBlc1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgZmluZ2VycHJpbnQgZm9yIGEgZmlsZSB3aGljaCB3aWxsIGJlIHVzZWQgdGhlIHN0b3JlIHRoZSBlbmRwb2ludFxuICpcbiAqIEBwYXJhbSB7RmlsZX0gZmlsZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGZpbmdlcnByaW50KGZpbGUsIG9wdGlvbnMpIHtcbiAgaWYgKCgwLCBfaXNSZWFjdE5hdGl2ZS5kZWZhdWx0KSgpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFjdE5hdGl2ZUZpbmdlcnByaW50KGZpbGUsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoWyd0dXMtYnInLCBmaWxlLm5hbWUsIGZpbGUudHlwZSwgZmlsZS5zaXplLCBmaWxlLmxhc3RNb2RpZmllZCwgb3B0aW9ucy5lbmRwb2ludF0uam9pbignLScpKTtcbn1cblxuZnVuY3Rpb24gcmVhY3ROYXRpdmVGaW5nZXJwcmludChmaWxlLCBvcHRpb25zKSB7XG4gIHZhciBleGlmSGFzaCA9IGZpbGUuZXhpZiA/IGhhc2hDb2RlKEpTT04uc3RyaW5naWZ5KGZpbGUuZXhpZikpIDogJ25vZXhpZic7XG4gIHJldHVybiBbJ3R1cy1ybicsIGZpbGUubmFtZSB8fCAnbm9uYW1lJywgZmlsZS5zaXplIHx8ICdub3NpemUnLCBleGlmSGFzaCwgb3B0aW9ucy5lbmRwb2ludF0uam9pbignLycpO1xufVxuXG5mdW5jdGlvbiBoYXNoQ29kZShzdHIpIHtcbiAgLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgzMTkzNy8xNTE2NjZcbiAgdmFyIGhhc2ggPSAwO1xuXG4gIGlmIChzdHIubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGhhc2g7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBfY2hhciA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuXG4gICAgaGFzaCA9IChoYXNoIDw8IDUpIC0gaGFzaCArIF9jaGFyO1xuICAgIGhhc2ggJj0gaGFzaDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gIH1cblxuICByZXR1cm4gaGFzaDtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuLyogZ2xvYmFsIHdpbmRvdyAqL1xuXG5cbnZhciBYSFJIdHRwU3RhY2sgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBYSFJIdHRwU3RhY2soKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFhIUkh0dHBTdGFjayk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoWEhSSHR0cFN0YWNrLCBbe1xuICAgIGtleTogXCJjcmVhdGVSZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZVJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgICAgIHJldHVybiBuZXcgUmVxdWVzdChtZXRob2QsIHVybCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldE5hbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TmFtZSgpIHtcbiAgICAgIHJldHVybiAnWEhSSHR0cFN0YWNrJztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gWEhSSHR0cFN0YWNrO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBYSFJIdHRwU3RhY2s7XG5cbnZhciBSZXF1ZXN0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUmVxdWVzdChtZXRob2QsIHVybCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZXF1ZXN0KTtcblxuICAgIHRoaXMuX3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgdGhpcy5feGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuXG4gICAgdGhpcy5fbWV0aG9kID0gbWV0aG9kO1xuICAgIHRoaXMuX3VybCA9IHVybDtcbiAgICB0aGlzLl9oZWFkZXJzID0ge307XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUmVxdWVzdCwgW3tcbiAgICBrZXk6IFwiZ2V0TWV0aG9kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldE1ldGhvZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tZXRob2Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVSTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRVUkwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRIZWFkZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0SGVhZGVyKGhlYWRlciwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuXG4gICAgICB0aGlzLl9oZWFkZXJzW2hlYWRlcl0gPSB2YWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0SGVhZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEhlYWRlcihoZWFkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oZWFkZXJzW2hlYWRlcl07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldFByb2dyZXNzSGFuZGxlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRQcm9ncmVzc0hhbmRsZXIocHJvZ3Jlc3NIYW5kbGVyKSB7XG4gICAgICAvLyBUZXN0IHN1cHBvcnQgZm9yIHByb2dyZXNzIGV2ZW50cyBiZWZvcmUgYXR0YWNoaW5nIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgICBpZiAoISgndXBsb2FkJyBpbiB0aGlzLl94aHIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5feGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwcm9ncmVzc0hhbmRsZXIoZS5sb2FkZWQpO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGJvZHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBfdGhpcy5feGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShfdGhpcy5feGhyKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgX3RoaXMuX3hoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIF90aGlzLl94aHIuc2VuZChib2R5KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhYm9ydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhYm9ydCgpIHtcbiAgICAgIHRoaXMuX3hoci5hYm9ydCgpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVuZGVybHlpbmdPYmplY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VW5kZXJseWluZ09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJlcXVlc3Q7XG59KCk7XG5cbnZhciBSZXNwb25zZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlc3BvbnNlKHhocikge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZXNwb25zZSk7XG5cbiAgICB0aGlzLl94aHIgPSB4aHI7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUmVzcG9uc2UsIFt7XG4gICAga2V5OiBcImdldFN0YXR1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdGF0dXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLnN0YXR1cztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0SGVhZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEhlYWRlcihoZWFkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoaGVhZGVyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0Qm9keVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCb2R5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3hoci5yZXNwb25zZVRleHQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVuZGVybHlpbmdPYmplY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VW5kZXJseWluZ09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJlc3BvbnNlO1xufSgpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZW5hYmxlRGVidWdMb2dcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2xvZ2dlci5lbmFibGVEZWJ1Z0xvZztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjYW5TdG9yZVVSTHNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX3VybFN0b3JhZ2UuY2FuU3RvcmVVUkxzO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkh0dHBTdGFja1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfaHR0cFN0YWNrLmRlZmF1bHQ7XG4gIH1cbn0pO1xuZXhwb3J0cy5pc1N1cHBvcnRlZCA9IGV4cG9ydHMuZGVmYXVsdE9wdGlvbnMgPSBleHBvcnRzLlVwbG9hZCA9IHZvaWQgMDtcblxudmFyIF91cGxvYWQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi91cGxvYWRcIikpO1xuXG52YXIgX25vb3BVcmxTdG9yYWdlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vbm9vcFVybFN0b3JhZ2VcIikpO1xuXG52YXIgX2xvZ2dlciA9IHJlcXVpcmUoXCIuLi9sb2dnZXJcIik7XG5cbnZhciBfdXJsU3RvcmFnZSA9IHJlcXVpcmUoXCIuL3VybFN0b3JhZ2VcIik7XG5cbnZhciBfaHR0cFN0YWNrID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9odHRwU3RhY2tcIikpO1xuXG52YXIgX2ZpbGVSZWFkZXIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2ZpbGVSZWFkZXJcIikpO1xuXG52YXIgX2ZpbmdlcnByaW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9maW5nZXJwcmludFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xufVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgICBvLl9fcHJvdG9fXyA9IHA7XG4gICAgcmV0dXJuIG87XG4gIH07XG5cbiAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksXG4gICAgICAgIHJlc3VsdDtcblxuICAgIGlmIChfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkpIHtcbiAgICAgIHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7XG5cbiAgICAgIHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHtcbiAgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHtcbiAgICByZXR1cm4gY2FsbDtcbiAgfVxuXG4gIHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpO1xufVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkge1xuICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7XG4gIGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7XG4gIGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7XG5cbiAgdHJ5IHtcbiAgICBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlO1xuICAgIH0pO1xuICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9O1xuXG4gICAgaWYgKGkgJSAyKSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cbi8qIGdsb2JhbCB3aW5kb3cgKi9cblxuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSBfb2JqZWN0U3ByZWFkKHt9LCBfdXBsb2FkLmRlZmF1bHQuZGVmYXVsdE9wdGlvbnMsIHtcbiAgaHR0cFN0YWNrOiBuZXcgX2h0dHBTdGFjay5kZWZhdWx0KCksXG4gIGZpbGVSZWFkZXI6IG5ldyBfZmlsZVJlYWRlci5kZWZhdWx0KCksXG4gIHVybFN0b3JhZ2U6IF91cmxTdG9yYWdlLmNhblN0b3JlVVJMcyA/IG5ldyBfdXJsU3RvcmFnZS5XZWJTdG9yYWdlVXJsU3RvcmFnZSgpIDogbmV3IF9ub29wVXJsU3RvcmFnZS5kZWZhdWx0KCksXG4gIGZpbmdlcnByaW50OiBfZmluZ2VycHJpbnQuZGVmYXVsdFxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcblxudmFyIFVwbG9hZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX0Jhc2VVcGxvYWQpIHtcbiAgX2luaGVyaXRzKFVwbG9hZCwgX0Jhc2VVcGxvYWQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoVXBsb2FkKTtcblxuICBmdW5jdGlvbiBVcGxvYWQoKSB7XG4gICAgdmFyIGZpbGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFVwbG9hZCk7XG5cbiAgICBvcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHt9LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgZmlsZSwgb3B0aW9ucyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoVXBsb2FkLCBudWxsLCBbe1xuICAgIGtleTogXCJ0ZXJtaW5hdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGVybWluYXRlKHVybCwgb3B0aW9ucywgY2IpIHtcbiAgICAgIG9wdGlvbnMgPSBfb2JqZWN0U3ByZWFkKHt9LCBkZWZhdWx0T3B0aW9ucywge30sIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIF91cGxvYWQuZGVmYXVsdC50ZXJtaW5hdGUodXJsLCBvcHRpb25zLCBjYik7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFVwbG9hZDtcbn0oX3VwbG9hZC5kZWZhdWx0KTtcblxuZXhwb3J0cy5VcGxvYWQgPSBVcGxvYWQ7XG52YXIgX3dpbmRvdyA9IHdpbmRvdyxcbiAgICBYTUxIdHRwUmVxdWVzdCA9IF93aW5kb3cuWE1MSHR0cFJlcXVlc3QsXG4gICAgQmxvYiA9IF93aW5kb3cuQmxvYjtcbnZhciBpc1N1cHBvcnRlZCA9IFhNTEh0dHBSZXF1ZXN0ICYmIEJsb2IgJiYgdHlwZW9mIEJsb2IucHJvdG90eXBlLnNsaWNlID09PSAnZnVuY3Rpb24nO1xuZXhwb3J0cy5pc1N1cHBvcnRlZCA9IGlzU3VwcG9ydGVkOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgaXNDb3Jkb3ZhID0gZnVuY3Rpb24gaXNDb3Jkb3ZhKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiAodHlwZW9mIHdpbmRvdy5QaG9uZUdhcCAhPSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LkNvcmRvdmEgIT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdy5jb3Jkb3ZhICE9ICd1bmRlZmluZWQnKTtcbn07XG5cbnZhciBfZGVmYXVsdCA9IGlzQ29yZG92YTtcbmV4cG9ydHMuZGVmYXVsdCA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgaXNSZWFjdE5hdGl2ZSA9IGZ1bmN0aW9uIGlzUmVhY3ROYXRpdmUoKSB7XG4gIHJldHVybiB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdzdHJpbmcnICYmIG5hdmlnYXRvci5wcm9kdWN0LnRvTG93ZXJDYXNlKCkgPT09ICdyZWFjdG5hdGl2ZSc7XG59O1xuXG52YXIgX2RlZmF1bHQgPSBpc1JlYWN0TmF0aXZlO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSByZWFkQXNCeXRlQXJyYXk7XG5cbi8qKlxuICogcmVhZEFzQnl0ZUFycmF5IGNvbnZlcnRzIGEgRmlsZSBvYmplY3QgdG8gYSBVaW50OEFycmF5LlxuICogVGhpcyBmdW5jdGlvbiBpcyBvbmx5IHVzZWQgb24gdGhlIEFwYWNoZSBDb3Jkb3ZhIHBsYXRmb3JtLlxuICogU2VlIGh0dHBzOi8vY29yZG92YS5hcGFjaGUub3JnL2RvY3MvZW4vbGF0ZXN0L3JlZmVyZW5jZS9jb3Jkb3ZhLXBsdWdpbi1maWxlL2luZGV4Lmh0bWwjcmVhZC1hLWZpbGVcbiAqL1xuZnVuY3Rpb24gcmVhZEFzQnl0ZUFycmF5KGNodW5rKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlID0gbmV3IFVpbnQ4QXJyYXkocmVhZGVyLnJlc3VsdCk7XG4gICAgICByZXNvbHZlKHtcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9O1xuXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGNodW5rKTtcbiAgfSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB1cmlUb0Jsb2I7XG5cbi8qKlxuICogdXJpVG9CbG9iIHJlc29sdmVzIGEgVVJJIHRvIGEgQmxvYiBvYmplY3QuIFRoaXMgaXMgdXNlZCBmb3JcbiAqIFJlYWN0IE5hdGl2ZSB0byByZXRyaWV2ZSBhIGZpbGUgKGlkZW50aWZpZWQgYnkgYSBmaWxlOi8vXG4gKiBVUkkpIGFzIGEgYmxvYi5cbiAqL1xuZnVuY3Rpb24gdXJpVG9CbG9iKHVyaSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBibG9iID0geGhyLnJlc3BvbnNlO1xuICAgICAgcmVzb2x2ZShibG9iKTtcbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9O1xuXG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVyaSk7XG4gICAgeGhyLnNlbmQoKTtcbiAgfSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLldlYlN0b3JhZ2VVcmxTdG9yYWdlID0gZXhwb3J0cy5jYW5TdG9yZVVSTHMgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cbi8qIGdsb2JhbCB3aW5kb3csIGxvY2FsU3RvcmFnZSAqL1xuXG5cbnZhciBoYXNTdG9yYWdlID0gZmFsc2U7XG5cbnRyeSB7XG4gIGhhc1N0b3JhZ2UgPSAnbG9jYWxTdG9yYWdlJyBpbiB3aW5kb3c7IC8vIEF0dGVtcHQgdG8gc3RvcmUgYW5kIHJlYWQgZW50cmllcyBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlIHRvIGRldGVjdCBQcml2YXRlXG4gIC8vIE1vZGUgb24gU2FmYXJpIG9uIGlPUyAoc2VlICM0OSlcblxuICB2YXIga2V5ID0gJ3R1c1N1cHBvcnQnO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xufSBjYXRjaCAoZSkge1xuICAvLyBJZiB3ZSB0cnkgdG8gYWNjZXNzIGxvY2FsU3RvcmFnZSBpbnNpZGUgYSBzYW5kYm94ZWQgaWZyYW1lLCBhIFNlY3VyaXR5RXJyb3JcbiAgLy8gaXMgdGhyb3duLiBXaGVuIGluIHByaXZhdGUgbW9kZSBvbiBpT1MgU2FmYXJpLCBhIFF1b3RhRXhjZWVkZWRFcnJvciBpc1xuICAvLyB0aHJvd24gKHNlZSAjNDkpXG4gIGlmIChlLmNvZGUgPT09IGUuU0VDVVJJVFlfRVJSIHx8IGUuY29kZSA9PT0gZS5RVU9UQV9FWENFRURFRF9FUlIpIHtcbiAgICBoYXNTdG9yYWdlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG52YXIgY2FuU3RvcmVVUkxzID0gaGFzU3RvcmFnZTtcbmV4cG9ydHMuY2FuU3RvcmVVUkxzID0gY2FuU3RvcmVVUkxzO1xuXG52YXIgV2ViU3RvcmFnZVVybFN0b3JhZ2UgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBXZWJTdG9yYWdlVXJsU3RvcmFnZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgV2ViU3RvcmFnZVVybFN0b3JhZ2UpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFdlYlN0b3JhZ2VVcmxTdG9yYWdlLCBbe1xuICAgIGtleTogXCJmaW5kQWxsVXBsb2Fkc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kQWxsVXBsb2FkcygpIHtcbiAgICAgIHZhciByZXN1bHRzID0gdGhpcy5fZmluZEVudHJpZXMoJ3R1czo6Jyk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpbmRVcGxvYWRzQnlGaW5nZXJwcmludFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kVXBsb2Fkc0J5RmluZ2VycHJpbnQoZmluZ2VycHJpbnQpIHtcbiAgICAgIHZhciByZXN1bHRzID0gdGhpcy5fZmluZEVudHJpZXMoXCJ0dXM6OlwiLmNvbmNhdChmaW5nZXJwcmludCwgXCI6OlwiKSk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVVcGxvYWQodXJsU3RvcmFnZUtleSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odXJsU3RvcmFnZUtleSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZFVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRVcGxvYWQoZmluZ2VycHJpbnQsIHVwbG9hZCkge1xuICAgICAgdmFyIGlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxMik7XG4gICAgICB2YXIga2V5ID0gXCJ0dXM6OlwiLmNvbmNhdChmaW5nZXJwcmludCwgXCI6OlwiKS5jb25jYXQoaWQpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGxvYWQpKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoa2V5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZpbmRFbnRyaWVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9maW5kRW50cmllcyhwcmVmaXgpIHtcbiAgICAgIHZhciByZXN1bHRzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBfa2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcblxuICAgICAgICBpZiAoX2tleS5pbmRleE9mKHByZWZpeCkgIT09IDApIGNvbnRpbnVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHVwbG9hZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oX2tleSkpO1xuICAgICAgICAgIHVwbG9hZC51cmxTdG9yYWdlS2V5ID0gX2tleTtcbiAgICAgICAgICByZXN1bHRzLnB1c2godXBsb2FkKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgey8vIFRoZSBKU09OIHBhcnNlIGVycm9yIGlzIGludGVudGlvbmFsbHkgaWdub3JlZCBoZXJlLCBzbyBhIG1hbGZvcm1lZFxuICAgICAgICAgIC8vIGVudHJ5IGluIHRoZSBzdG9yYWdlIGNhbm5vdCBwcmV2ZW50IGFuIHVwbG9hZC5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gV2ViU3RvcmFnZVVybFN0b3JhZ2U7XG59KCk7XG5cbmV4cG9ydHMuV2ViU3RvcmFnZVVybFN0b3JhZ2UgPSBXZWJTdG9yYWdlVXJsU3RvcmFnZTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkge1xuICAgICAgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjtcblxuICAgICAgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG59XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGY7XG59XG5cbmZ1bmN0aW9uIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpIHtcbiAgdmFyIF9jYWNoZSA9IHR5cGVvZiBNYXAgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBNYXAoKSA6IHVuZGVmaW5lZDtcblxuICBfd3JhcE5hdGl2ZVN1cGVyID0gZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykge1xuICAgIGlmIChDbGFzcyA9PT0gbnVsbCB8fCAhX2lzTmF0aXZlRnVuY3Rpb24oQ2xhc3MpKSByZXR1cm4gQ2xhc3M7XG5cbiAgICBpZiAodHlwZW9mIENsYXNzICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIF9jYWNoZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaWYgKF9jYWNoZS5oYXMoQ2xhc3MpKSByZXR1cm4gX2NhY2hlLmdldChDbGFzcyk7XG5cbiAgICAgIF9jYWNoZS5zZXQoQ2xhc3MsIFdyYXBwZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFdyYXBwZXIoKSB7XG4gICAgICByZXR1cm4gX2NvbnN0cnVjdChDbGFzcywgYXJndW1lbnRzLCBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3IpO1xuICAgIH1cblxuICAgIFdyYXBwZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGFzcy5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBXcmFwcGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBfc2V0UHJvdG90eXBlT2YoV3JhcHBlciwgQ2xhc3MpO1xuICB9O1xuXG4gIHJldHVybiBfd3JhcE5hdGl2ZVN1cGVyKENsYXNzKTtcbn1cblxuZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7XG4gIGlmIChfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkpIHtcbiAgICBfY29uc3RydWN0ID0gUmVmbGVjdC5jb25zdHJ1Y3Q7XG4gIH0gZWxzZSB7XG4gICAgX2NvbnN0cnVjdCA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykge1xuICAgICAgdmFyIGEgPSBbbnVsbF07XG4gICAgICBhLnB1c2guYXBwbHkoYSwgYXJncyk7XG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSBGdW5jdGlvbi5iaW5kLmFwcGx5KFBhcmVudCwgYSk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICAgIGlmIChDbGFzcykgX3NldFByb3RvdHlwZU9mKGluc3RhbmNlLCBDbGFzcy5wcm90b3R5cGUpO1xuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkge1xuICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7XG4gIGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7XG4gIGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7XG5cbiAgdHJ5IHtcbiAgICBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZUZ1bmN0aW9uKGZuKSB7XG4gIHJldHVybiBGdW5jdGlvbi50b1N0cmluZy5jYWxsKGZuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSAhPT0gLTE7XG59XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gIF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH07XG4gIHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7XG59XG5cbnZhciBEZXRhaWxlZEVycm9yID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfRXJyb3IpIHtcbiAgX2luaGVyaXRzKERldGFpbGVkRXJyb3IsIF9FcnJvcik7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihEZXRhaWxlZEVycm9yKTtcblxuICBmdW5jdGlvbiBEZXRhaWxlZEVycm9yKG1lc3NhZ2UpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICB2YXIgY2F1c2luZ0VyciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICB2YXIgcmVxID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuICAgIHZhciByZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IG51bGw7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGV0YWlsZWRFcnJvcik7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuICAgIF90aGlzLm9yaWdpbmFsUmVxdWVzdCA9IHJlcTtcbiAgICBfdGhpcy5vcmlnaW5hbFJlc3BvbnNlID0gcmVzO1xuICAgIF90aGlzLmNhdXNpbmdFcnJvciA9IGNhdXNpbmdFcnI7XG5cbiAgICBpZiAoY2F1c2luZ0VyciAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlICs9IFwiLCBjYXVzZWQgYnkgXCIuY29uY2F0KGNhdXNpbmdFcnIudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcSAhPSBudWxsKSB7XG4gICAgICB2YXIgcmVxdWVzdElkID0gcmVxLmdldEhlYWRlcignWC1SZXF1ZXN0LUlEJykgfHwgJ24vYSc7XG4gICAgICB2YXIgbWV0aG9kID0gcmVxLmdldE1ldGhvZCgpO1xuICAgICAgdmFyIHVybCA9IHJlcS5nZXRVUkwoKTtcbiAgICAgIHZhciBzdGF0dXMgPSByZXMgPyByZXMuZ2V0U3RhdHVzKCkgOiAnbi9hJztcbiAgICAgIHZhciBib2R5ID0gcmVzID8gcmVzLmdldEJvZHkoKSB8fCAnJyA6ICduL2EnO1xuICAgICAgbWVzc2FnZSArPSBcIiwgb3JpZ2luYXRlZCBmcm9tIHJlcXVlc3QgKG1ldGhvZDogXCIuY29uY2F0KG1ldGhvZCwgXCIsIHVybDogXCIpLmNvbmNhdCh1cmwsIFwiLCByZXNwb25zZSBjb2RlOiBcIikuY29uY2F0KHN0YXR1cywgXCIsIHJlc3BvbnNlIHRleHQ6IFwiKS5jb25jYXQoYm9keSwgXCIsIHJlcXVlc3QgaWQ6IFwiKS5jb25jYXQocmVxdWVzdElkLCBcIilcIik7XG4gICAgfVxuXG4gICAgX3RoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgcmV0dXJuIERldGFpbGVkRXJyb3I7XG59KCAvKiNfX1BVUkVfXyovX3dyYXBOYXRpdmVTdXBlcihFcnJvcikpO1xuXG52YXIgX2RlZmF1bHQgPSBEZXRhaWxlZEVycm9yO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmVuYWJsZURlYnVnTG9nID0gZW5hYmxlRGVidWdMb2c7XG5leHBvcnRzLmxvZyA9IGxvZztcblxuLyogZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIgKi9cbnZhciBpc0VuYWJsZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gZW5hYmxlRGVidWdMb2coKSB7XG4gIGlzRW5hYmxlZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGxvZyhtc2cpIHtcbiAgaWYgKCFpc0VuYWJsZWQpIHJldHVybjtcbiAgY29uc29sZS5sb2cobXNnKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiICovXG5cblxudmFyIE5vb3BVcmxTdG9yYWdlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTm9vcFVybFN0b3JhZ2UoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE5vb3BVcmxTdG9yYWdlKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhOb29wVXJsU3RvcmFnZSwgW3tcbiAgICBrZXk6IFwibGlzdEFsbFVwbG9hZHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGlzdEFsbFVwbG9hZHMoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmluZFVwbG9hZHNCeUZpbmdlcnByaW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbmRVcGxvYWRzQnlGaW5nZXJwcmludChmaW5nZXJwcmludCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVVcGxvYWQodXJsU3RvcmFnZUtleSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkVXBsb2FkKGZpbmdlcnByaW50LCB1cGxvYWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE5vb3BVcmxTdG9yYWdlO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBOb29wVXJsU3RvcmFnZTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxudmFyIF9qc0Jhc2UgPSByZXF1aXJlKFwianMtYmFzZTY0XCIpO1xuXG52YXIgX3VybFBhcnNlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwidXJsLXBhcnNlXCIpKTtcblxudmFyIF9lcnJvciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZXJyb3JcIikpO1xuXG52YXIgX2xvZ2dlciA9IHJlcXVpcmUoXCIuL2xvZ2dlclwiKTtcblxudmFyIF91dWlkID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dWlkXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlO1xuICAgIH0pO1xuICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9O1xuXG4gICAgaWYgKGkgJSAyKSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuLyogZ2xvYmFsIHdpbmRvdyAqL1xuXG5cbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgZW5kcG9pbnQ6IG51bGwsXG4gIHVwbG9hZFVybDogbnVsbCxcbiAgbWV0YWRhdGE6IHt9LFxuICBmaW5nZXJwcmludDogbnVsbCxcbiAgdXBsb2FkU2l6ZTogbnVsbCxcbiAgb25Qcm9ncmVzczogbnVsbCxcbiAgb25DaHVua0NvbXBsZXRlOiBudWxsLFxuICBvblN1Y2Nlc3M6IG51bGwsXG4gIG9uRXJyb3I6IG51bGwsXG4gIF9vblVwbG9hZFVybEF2YWlsYWJsZTogbnVsbCxcbiAgb3ZlcnJpZGVQYXRjaE1ldGhvZDogZmFsc2UsXG4gIGhlYWRlcnM6IHt9LFxuICBhZGRSZXF1ZXN0SWQ6IGZhbHNlLFxuICBvbkJlZm9yZVJlcXVlc3Q6IG51bGwsXG4gIG9uQWZ0ZXJSZXNwb25zZTogbnVsbCxcbiAgb25TaG91bGRSZXRyeTogbnVsbCxcbiAgY2h1bmtTaXplOiBJbmZpbml0eSxcbiAgcmV0cnlEZWxheXM6IFswLCAxMDAwLCAzMDAwLCA1MDAwXSxcbiAgcGFyYWxsZWxVcGxvYWRzOiAxLFxuICBzdG9yZUZpbmdlcnByaW50Rm9yUmVzdW1pbmc6IHRydWUsXG4gIHJlbW92ZUZpbmdlcnByaW50T25TdWNjZXNzOiBmYWxzZSxcbiAgdXBsb2FkTGVuZ3RoRGVmZXJyZWQ6IGZhbHNlLFxuICB1cGxvYWREYXRhRHVyaW5nQ3JlYXRpb246IGZhbHNlLFxuICB1cmxTdG9yYWdlOiBudWxsLFxuICBmaWxlUmVhZGVyOiBudWxsLFxuICBodHRwU3RhY2s6IG51bGxcbn07XG5cbnZhciBCYXNlVXBsb2FkID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQmFzZVVwbG9hZChmaWxlLCBvcHRpb25zKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJhc2VVcGxvYWQpOyAvLyBXYXJuIGFib3V0IHJlbW92ZWQgb3B0aW9ucyBmcm9tIHByZXZpb3VzIHZlcnNpb25zXG5cblxuICAgIGlmICgncmVzdW1lJyBpbiBvcHRpb25zKSB7XG4gICAgICBjb25zb2xlLmxvZygndHVzOiBUaGUgYHJlc3VtZWAgb3B0aW9uIGhhcyBiZWVuIHJlbW92ZWQgaW4gdHVzLWpzLWNsaWVudCB2Mi4gUGxlYXNlIHVzZSB0aGUgVVJMIHN0b3JhZ2UgQVBJIGluc3RlYWQuJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIH0gLy8gVGhlIGRlZmF1bHQgb3B0aW9ucyB3aWxsIGFscmVhZHkgYmUgYWRkZWQgZnJvbSB0aGUgd3JhcHBlciBjbGFzc2VzLlxuXG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zOyAvLyBUaGUgc3RvcmFnZSBtb2R1bGUgdXNlZCB0byBzdG9yZSBVUkxzXG5cbiAgICB0aGlzLl91cmxTdG9yYWdlID0gdGhpcy5vcHRpb25zLnVybFN0b3JhZ2U7IC8vIFRoZSB1bmRlcmx5aW5nIEZpbGUvQmxvYiBvYmplY3RcblxuICAgIHRoaXMuZmlsZSA9IGZpbGU7IC8vIFRoZSBVUkwgYWdhaW5zdCB3aGljaCB0aGUgZmlsZSB3aWxsIGJlIHVwbG9hZGVkXG5cbiAgICB0aGlzLnVybCA9IG51bGw7IC8vIFRoZSB1bmRlcmx5aW5nIHJlcXVlc3Qgb2JqZWN0IGZvciB0aGUgY3VycmVudCBQQVRDSCByZXF1ZXN0XG5cbiAgICB0aGlzLl9yZXEgPSBudWxsOyAvLyBUaGUgZmluZ2VycGlucnQgZm9yIHRoZSBjdXJyZW50IGZpbGUgKHNldCBhZnRlciBzdGFydCgpKVxuXG4gICAgdGhpcy5fZmluZ2VycHJpbnQgPSBudWxsOyAvLyBUaGUga2V5IHRoYXQgdGhlIFVSTCBzdG9yYWdlIHJldHVybmVkIHdoZW4gc2F2aW5nIGFuIFVSTCB3aXRoIGEgZmluZ2VycHJpbnQsXG5cbiAgICB0aGlzLl91cmxTdG9yYWdlS2V5ID0gbnVsbDsgLy8gVGhlIG9mZnNldCB1c2VkIGluIHRoZSBjdXJyZW50IFBBVENIIHJlcXVlc3RcblxuICAgIHRoaXMuX29mZnNldCA9IG51bGw7IC8vIFRydWUgaWYgdGhlIGN1cnJlbnQgUEFUQ0ggcmVxdWVzdCBoYXMgYmVlbiBhYm9ydGVkXG5cbiAgICB0aGlzLl9hYm9ydGVkID0gZmFsc2U7IC8vIFRoZSBmaWxlJ3Mgc2l6ZSBpbiBieXRlc1xuXG4gICAgdGhpcy5fc2l6ZSA9IG51bGw7IC8vIFRoZSBTb3VyY2Ugb2JqZWN0IHdoaWNoIHdpbGwgd3JhcCBhcm91bmQgdGhlIGdpdmVuIGZpbGUgYW5kIHByb3ZpZGVzIHVzXG4gICAgLy8gd2l0aCBhIHVuaWZpZWQgaW50ZXJmYWNlIGZvciBnZXR0aW5nIGl0cyBzaXplIGFuZCBzbGljZSBjaHVua3MgZnJvbSBpdHNcbiAgICAvLyBjb250ZW50IGFsbG93aW5nIHVzIHRvIGVhc2lseSBoYW5kbGUgRmlsZXMsIEJsb2JzLCBCdWZmZXJzIGFuZCBTdHJlYW1zLlxuXG4gICAgdGhpcy5fc291cmNlID0gbnVsbDsgLy8gVGhlIGN1cnJlbnQgY291bnQgb2YgYXR0ZW1wdHMgd2hpY2ggaGF2ZSBiZWVuIG1hZGUuIFplcm8gaW5kaWNhdGVzIG5vbmUuXG5cbiAgICB0aGlzLl9yZXRyeUF0dGVtcHQgPSAwOyAvLyBUaGUgdGltZW91dCdzIElEIHdoaWNoIGlzIHVzZWQgdG8gZGVsYXkgdGhlIG5leHQgcmV0cnlcblxuICAgIHRoaXMuX3JldHJ5VGltZW91dCA9IG51bGw7IC8vIFRoZSBvZmZzZXQgb2YgdGhlIHJlbW90ZSB1cGxvYWQgYmVmb3JlIHRoZSBsYXRlc3QgYXR0ZW1wdCB3YXMgc3RhcnRlZC5cblxuICAgIHRoaXMuX29mZnNldEJlZm9yZVJldHJ5ID0gMDsgLy8gQW4gYXJyYXkgb2YgQmFzZVVwbG9hZCBpbnN0YW5jZXMgd2hpY2ggYXJlIHVzZWQgZm9yIHVwbG9hZGluZyB0aGUgZGlmZmVyZW50XG4gICAgLy8gcGFydHMsIGlmIHRoZSBwYXJhbGxlbFVwbG9hZHMgb3B0aW9uIGlzIHVzZWQuXG5cbiAgICB0aGlzLl9wYXJhbGxlbFVwbG9hZHMgPSBudWxsOyAvLyBBbiBhcnJheSBvZiB1cGxvYWQgVVJMcyB3aGljaCBhcmUgdXNlZCBmb3IgdXBsb2FkaW5nIHRoZSBkaWZmZXJlbnRcbiAgICAvLyBwYXJ0cywgaWYgdGhlIHBhcmFsbGVsVXBsb2FkcyBvcHRpb24gaXMgdXNlZC5cblxuICAgIHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscyA9IG51bGw7XG4gIH1cbiAgLyoqXG4gICAqIFVzZSB0aGUgVGVybWluYXRpb24gZXh0ZW5zaW9uIHRvIGRlbGV0ZSBhbiB1cGxvYWQgZnJvbSB0aGUgc2VydmVyIGJ5IHNlbmRpbmcgYSBERUxFVEVcbiAgICogcmVxdWVzdCB0byB0aGUgc3BlY2lmaWVkIHVwbG9hZCBVUkwuIFRoaXMgaXMgb25seSBwb3NzaWJsZSBpZiB0aGUgc2VydmVyIHN1cHBvcnRzIHRoZVxuICAgKiBUZXJtaW5hdGlvbiBleHRlbnNpb24uIElmIHRoZSBgb3B0aW9ucy5yZXRyeURlbGF5c2AgcHJvcGVydHkgaXMgc2V0LCB0aGUgbWV0aG9kIHdpbGxcbiAgICogYWxzbyByZXRyeSBpZiBhbiBlcnJvciBvY3VycnMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIHVwbG9hZCdzIFVSTCB3aGljaCB3aWxsIGJlIHRlcm1pbmF0ZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIE9wdGlvbmFsIG9wdGlvbnMgZm9yIGluZmx1ZW5jaW5nIEhUVFAgcmVxdWVzdHMuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBQcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQvcmVqZWN0ZWQgd2hlbiB0aGUgcmVxdWVzdHMgZmluaXNoLlxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhCYXNlVXBsb2FkLCBbe1xuICAgIGtleTogXCJmaW5kUHJldmlvdXNVcGxvYWRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbmRQcmV2aW91c1VwbG9hZHMoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbmdlcnByaW50KHRoaXMuZmlsZSwgdGhpcy5vcHRpb25zKS50aGVuKGZ1bmN0aW9uIChmaW5nZXJwcmludCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuX3VybFN0b3JhZ2UuZmluZFVwbG9hZHNCeUZpbmdlcnByaW50KGZpbmdlcnByaW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXN1bWVGcm9tUHJldmlvdXNVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzdW1lRnJvbVByZXZpb3VzVXBsb2FkKHByZXZpb3VzVXBsb2FkKSB7XG4gICAgICB0aGlzLnVybCA9IHByZXZpb3VzVXBsb2FkLnVwbG9hZFVybCB8fCBudWxsO1xuICAgICAgdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzID0gcHJldmlvdXNVcGxvYWQucGFyYWxsZWxVcGxvYWRVcmxzIHx8IG51bGw7XG4gICAgICB0aGlzLl91cmxTdG9yYWdlS2V5ID0gcHJldmlvdXNVcGxvYWQudXJsU3RvcmFnZUtleTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic3RhcnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdmFyIGZpbGUgPSB0aGlzLmZpbGU7XG5cbiAgICAgIGlmICghZmlsZSkge1xuICAgICAgICB0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKCd0dXM6IG5vIGZpbGUgb3Igc3RyZWFtIHRvIHVwbG9hZCBwcm92aWRlZCcpKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVuZHBvaW50ICYmICF0aGlzLm9wdGlvbnMudXBsb2FkVXJsKSB7XG4gICAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IoJ3R1czogbmVpdGhlciBhbiBlbmRwb2ludCBvciBhbiB1cGxvYWQgVVJMIGlzIHByb3ZpZGVkJykpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJldHJ5RGVsYXlzID0gdGhpcy5vcHRpb25zLnJldHJ5RGVsYXlzO1xuXG4gICAgICBpZiAocmV0cnlEZWxheXMgIT0gbnVsbCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocmV0cnlEZWxheXMpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IoJ3R1czogdGhlIGByZXRyeURlbGF5c2Agb3B0aW9uIG11c3QgZWl0aGVyIGJlIGFuIGFycmF5IG9yIG51bGwnKSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhcmFsbGVsVXBsb2FkcyA+IDEpIHtcbiAgICAgICAgLy8gVGVzdCB3aGljaCBvcHRpb25zIGFyZSBpbmNvbXBhdGlibGUgd2l0aCBwYXJhbGxlbCB1cGxvYWRzLlxuICAgICAgICBbJ3VwbG9hZFVybCcsICd1cGxvYWRTaXplJywgJ3VwbG9hZExlbmd0aERlZmVycmVkJ10uZm9yRWFjaChmdW5jdGlvbiAob3B0aW9uTmFtZSkge1xuICAgICAgICAgIGlmIChfdGhpczIub3B0aW9uc1tvcHRpb25OYW1lXSkge1xuICAgICAgICAgICAgX3RoaXMyLl9lbWl0RXJyb3IobmV3IEVycm9yKFwidHVzOiBjYW5ub3QgdXNlIHRoZSBcIi5jb25jYXQob3B0aW9uTmFtZSwgXCIgb3B0aW9uIHdoZW4gcGFyYWxsZWxVcGxvYWRzIGlzIGVuYWJsZWRcIikpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZmluZ2VycHJpbnQoZmlsZSwgdGhpcy5vcHRpb25zKS50aGVuKGZ1bmN0aW9uIChmaW5nZXJwcmludCkge1xuICAgICAgICBpZiAoZmluZ2VycHJpbnQgPT0gbnVsbCkge1xuICAgICAgICAgICgwLCBfbG9nZ2VyLmxvZykoJ05vIGZpbmdlcnByaW50IHdhcyBjYWxjdWxhdGVkIG1lYW5pbmcgdGhhdCB0aGUgdXBsb2FkIGNhbm5vdCBiZSBzdG9yZWQgaW4gdGhlIFVSTCBzdG9yYWdlLicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICgwLCBfbG9nZ2VyLmxvZykoXCJDYWxjdWxhdGVkIGZpbmdlcnByaW50OiBcIi5jb25jYXQoZmluZ2VycHJpbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMi5fZmluZ2VycHJpbnQgPSBmaW5nZXJwcmludDtcblxuICAgICAgICBpZiAoX3RoaXMyLl9zb3VyY2UpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMyLl9zb3VyY2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMyLm9wdGlvbnMuZmlsZVJlYWRlci5vcGVuRmlsZShmaWxlLCBfdGhpczIub3B0aW9ucy5jaHVua1NpemUpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgIF90aGlzMi5fc291cmNlID0gc291cmNlOyAvLyBJZiB0aGUgdXBsb2FkIHdhcyBjb25maWd1cmVkIHRvIHVzZSBtdWx0aXBsZSByZXF1ZXN0cyBvciBpZiB3ZSByZXN1bWUgZnJvbVxuICAgICAgICAvLyBhbiB1cGxvYWQgd2hpY2ggdXNlZCBtdWx0aXBsZSByZXF1ZXN0cywgd2Ugc3RhcnQgYSBwYXJhbGxlbCB1cGxvYWQuXG5cbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLnBhcmFsbGVsVXBsb2FkcyA+IDEgfHwgX3RoaXMyLl9wYXJhbGxlbFVwbG9hZFVybHMgIT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzMi5fc3RhcnRQYXJhbGxlbFVwbG9hZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzMi5fc3RhcnRTaW5nbGVVcGxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMi5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhdGUgdGhlIHVwbG9hZGluZyBwcm9jZWR1cmUgZm9yIGEgcGFyYWxsZWxpemVkIHVwbG9hZCwgd2hlcmUgb25lIGZpbGUgaXMgc3BsaXQgaW50b1xuICAgICAqIG11bHRpcGxlIHJlcXVlc3Qgd2hpY2ggYXJlIHJ1biBpbiBwYXJhbGxlbC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3N0YXJ0UGFyYWxsZWxVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3N0YXJ0UGFyYWxsZWxVcGxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIHRvdGFsU2l6ZSA9IHRoaXMuX3NpemUgPSB0aGlzLl9zb3VyY2Uuc2l6ZTtcbiAgICAgIHZhciB0b3RhbFByb2dyZXNzID0gMDtcbiAgICAgIHRoaXMuX3BhcmFsbGVsVXBsb2FkcyA9IFtdO1xuICAgICAgdmFyIHBhcnRDb3VudCA9IHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscyAhPSBudWxsID8gdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzLmxlbmd0aCA6IHRoaXMub3B0aW9ucy5wYXJhbGxlbFVwbG9hZHM7IC8vIFRoZSBpbnB1dCBmaWxlIHdpbGwgYmUgc3BsaXQgaW50byBtdWx0aXBsZSBzbGljZXMgd2hpY2ggYXJlIHVwbG9hZGVkIGluIHNlcGFyYXRlXG4gICAgICAvLyByZXF1ZXN0cy4gSGVyZSB3ZSBnZW5lcmF0ZSB0aGUgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbiBmb3IgdGhlIHNsaWNlcy5cblxuICAgICAgdmFyIHBhcnRzID0gc3BsaXRTaXplSW50b1BhcnRzKHRoaXMuX3NvdXJjZS5zaXplLCBwYXJ0Q291bnQsIHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscyk7IC8vIENyZWF0ZSBhbiBlbXB0eSBsaXN0IGZvciBzdG9yaW5nIHRoZSB1cGxvYWQgVVJMc1xuXG4gICAgICB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHMgPSBuZXcgQXJyYXkocGFydHMubGVuZ3RoKTsgLy8gR2VuZXJhdGUgYSBwcm9taXNlIGZvciBlYWNoIHNsaWNlIHRoYXQgd2lsbCBiZSByZXNvbHZlIGlmIHRoZSByZXNwZWN0aXZlXG4gICAgICAvLyB1cGxvYWQgaXMgY29tcGxldGVkLlxuXG4gICAgICB2YXIgdXBsb2FkcyA9IHBhcnRzLm1hcChmdW5jdGlvbiAocGFydCwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGxhc3RQYXJ0UHJvZ3Jlc3MgPSAwO1xuICAgICAgICByZXR1cm4gX3RoaXMzLl9zb3VyY2Uuc2xpY2UocGFydC5zdGFydCwgcGFydC5lbmQpLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBfcmVmLnZhbHVlO1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAvLyBNZXJnZSB3aXRoIHRoZSB1c2VyIHN1cHBsaWVkIG9wdGlvbnMgYnV0IG92ZXJ3cml0ZSBzb21lIHZhbHVlcy5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgX3RoaXMzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgLy8gSWYgYXZhaWxhYmxlLCB0aGUgcGFydGlhbCB1cGxvYWQgc2hvdWxkIGJlIHJlc3VtZWQgZnJvbSBhIHByZXZpb3VzIFVSTC5cbiAgICAgICAgICAgICAgdXBsb2FkVXJsOiBwYXJ0LnVwbG9hZFVybCB8fCBudWxsLFxuICAgICAgICAgICAgICAvLyBXZSB0YWtlIG1hbnVhbGx5IGNhcmUgb2YgcmVzdW1pbmcgZm9yIHBhcnRpYWwgdXBsb2Fkcywgc28gdGhleSBzaG91bGRcbiAgICAgICAgICAgICAgLy8gbm90IGJlIHN0b3JlZCBpbiB0aGUgVVJMIHN0b3JhZ2UuXG4gICAgICAgICAgICAgIHN0b3JlRmluZ2VycHJpbnRGb3JSZXN1bWluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHJlbW92ZUZpbmdlcnByaW50T25TdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHBhcmFsbGVsVXBsb2FkcyBvcHRpb24gdG8gbm90IGNhdXNlIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxLFxuICAgICAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgICAgIC8vIEFkZCB0aGUgaGVhZGVyIHRvIGluZGljYXRlIHRoZSB0aGlzIGlzIGEgcGFydGlhbCB1cGxvYWQuXG4gICAgICAgICAgICAgIGhlYWRlcnM6IF9vYmplY3RTcHJlYWQoe30sIF90aGlzMy5vcHRpb25zLmhlYWRlcnMsIHtcbiAgICAgICAgICAgICAgICAnVXBsb2FkLUNvbmNhdCc6ICdwYXJ0aWFsJ1xuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgLy8gUmVqZWN0IG9yIHJlc29sdmUgdGhlIHByb21pc2UgaWYgdGhlIHVwbG9hZCBlcnJvcnMgb3IgY29tcGxldGVzLlxuICAgICAgICAgICAgICBvblN1Y2Nlc3M6IHJlc29sdmUsXG4gICAgICAgICAgICAgIG9uRXJyb3I6IHJlamVjdCxcbiAgICAgICAgICAgICAgLy8gQmFzZWQgaW4gdGhlIHByb2dyZXNzIGZvciB0aGlzIHBhcnRpYWwgdXBsb2FkLCBjYWxjdWxhdGUgdGhlIHByb2dyZXNzXG4gICAgICAgICAgICAgIC8vIGZvciB0aGUgZW50aXJlIGZpbmFsIHVwbG9hZC5cbiAgICAgICAgICAgICAgb25Qcm9ncmVzczogZnVuY3Rpb24gb25Qcm9ncmVzcyhuZXdQYXJ0UHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICB0b3RhbFByb2dyZXNzID0gdG90YWxQcm9ncmVzcyAtIGxhc3RQYXJ0UHJvZ3Jlc3MgKyBuZXdQYXJ0UHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgbGFzdFBhcnRQcm9ncmVzcyA9IG5ld1BhcnRQcm9ncmVzcztcblxuICAgICAgICAgICAgICAgIF90aGlzMy5fZW1pdFByb2dyZXNzKHRvdGFsUHJvZ3Jlc3MsIHRvdGFsU2l6ZSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIC8vIFdhaXQgdW50aWwgZXZlcnkgcGFydGlhbCB1cGxvYWQgaGFzIGFuIHVwbG9hZCBVUkwsIHNvIHdlIGNhbiBhZGRcbiAgICAgICAgICAgICAgLy8gdGhlbSB0byB0aGUgVVJMIHN0b3JhZ2UuXG4gICAgICAgICAgICAgIF9vblVwbG9hZFVybEF2YWlsYWJsZTogZnVuY3Rpb24gX29uVXBsb2FkVXJsQXZhaWxhYmxlKCkge1xuICAgICAgICAgICAgICAgIF90aGlzMy5fcGFyYWxsZWxVcGxvYWRVcmxzW2luZGV4XSA9IHVwbG9hZC51cmw7IC8vIFRlc3QgaWYgYWxsIHVwbG9hZHMgaGF2ZSByZWNlaXZlZCBhbiBVUkxcblxuICAgICAgICAgICAgICAgIGlmIChfdGhpczMuX3BhcmFsbGVsVXBsb2FkVXJscy5maWx0ZXIoZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAhIXU7XG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoID09PSBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzMy5fc2F2ZVVwbG9hZEluVXJsU3RvcmFnZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB1cGxvYWQgPSBuZXcgQmFzZVVwbG9hZCh2YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB1cGxvYWQuc3RhcnQoKTsgLy8gU3RvcmUgdGhlIHVwbG9hZCBpbiBhbiBhcnJheSwgc28gd2UgY2FuIGxhdGVyIGFib3J0IHRoZW0gaWYgbmVjZXNzYXJ5LlxuXG4gICAgICAgICAgICBfdGhpczMuX3BhcmFsbGVsVXBsb2Fkcy5wdXNoKHVwbG9hZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB2YXIgcmVxOyAvLyBXYWl0IHVudGlsIGFsbCBwYXJ0aWFsIHVwbG9hZHMgYXJlIGZpbmlzaGVkIGFuZCB3ZSBjYW4gc2VuZCB0aGUgUE9TVCByZXF1ZXN0IGZvclxuICAgICAgLy8gY3JlYXRpbmcgdGhlIGZpbmFsIHVwbG9hZC5cblxuICAgICAgUHJvbWlzZS5hbGwodXBsb2FkcykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlcSA9IF90aGlzMy5fb3BlblJlcXVlc3QoJ1BPU1QnLCBfdGhpczMub3B0aW9ucy5lbmRwb2ludCk7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoJ1VwbG9hZC1Db25jYXQnLCBcImZpbmFsO1wiLmNvbmNhdChfdGhpczMuX3BhcmFsbGVsVXBsb2FkVXJscy5qb2luKCcgJykpKTsgLy8gQWRkIG1ldGFkYXRhIGlmIHZhbHVlcyBoYXZlIGJlZW4gYWRkZWRcblxuICAgICAgICB2YXIgbWV0YWRhdGEgPSBlbmNvZGVNZXRhZGF0YShfdGhpczMub3B0aW9ucy5tZXRhZGF0YSk7XG5cbiAgICAgICAgaWYgKG1ldGFkYXRhICE9PSAnJykge1xuICAgICAgICAgIHJlcS5zZXRIZWFkZXIoJ1VwbG9hZC1NZXRhZGF0YScsIG1ldGFkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfdGhpczMuX3NlbmRSZXF1ZXN0KHJlcSwgbnVsbCk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFpblN0YXR1c0NhdGVnb3J5KHJlcy5nZXRTdGF0dXMoKSwgMjAwKSkge1xuICAgICAgICAgIF90aGlzMy5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgJ3R1czogdW5leHBlY3RlZCByZXNwb25zZSB3aGlsZSBjcmVhdGluZyB1cGxvYWQnKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcy5nZXRIZWFkZXIoJ0xvY2F0aW9uJyk7XG5cbiAgICAgICAgaWYgKGxvY2F0aW9uID09IG51bGwpIHtcbiAgICAgICAgICBfdGhpczMuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsICd0dXM6IGludmFsaWQgb3IgbWlzc2luZyBMb2NhdGlvbiBoZWFkZXInKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMy51cmwgPSByZXNvbHZlVXJsKF90aGlzMy5vcHRpb25zLmVuZHBvaW50LCBsb2NhdGlvbik7XG4gICAgICAgICgwLCBfbG9nZ2VyLmxvZykoXCJDcmVhdGVkIHVwbG9hZCBhdCBcIi5jb25jYXQoX3RoaXMzLnVybCkpO1xuXG4gICAgICAgIF90aGlzMy5fZW1pdFN1Y2Nlc3MoKTtcbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICBfdGhpczMuX2VtaXRFcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluaXRpYXRlIHRoZSB1cGxvYWRpbmcgcHJvY2VkdXJlIGZvciBhIG5vbi1wYXJhbGxlbCB1cGxvYWQuIEhlcmUgdGhlIGVudGlyZSBmaWxlIGlzXG4gICAgICogdXBsb2FkZWQgaW4gYSBzZXF1ZW50aWFsIG1hdHRlci5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3N0YXJ0U2luZ2xlVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9zdGFydFNpbmdsZVVwbG9hZCgpIHtcbiAgICAgIC8vIEZpcnN0LCB3ZSBsb29rIGF0IHRoZSB1cGxvYWRMZW5ndGhEZWZlcnJlZCBvcHRpb24uXG4gICAgICAvLyBOZXh0LCB3ZSBjaGVjayBpZiB0aGUgY2FsbGVyIGhhcyBzdXBwbGllZCBhIG1hbnVhbCB1cGxvYWQgc2l6ZS5cbiAgICAgIC8vIEZpbmFsbHksIHdlIHRyeSB0byB1c2UgdGhlIGNhbGN1bGF0ZWQgc2l6ZSBmcm9tIHRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRMZW5ndGhEZWZlcnJlZCkge1xuICAgICAgICB0aGlzLl9zaXplID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnVwbG9hZFNpemUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zaXplID0gK3RoaXMub3B0aW9ucy51cGxvYWRTaXplO1xuXG4gICAgICAgIGlmIChpc05hTih0aGlzLl9zaXplKSkge1xuICAgICAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IoJ3R1czogY2Fubm90IGNvbnZlcnQgYHVwbG9hZFNpemVgIG9wdGlvbiBpbnRvIGEgbnVtYmVyJykpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zaXplID0gdGhpcy5fc291cmNlLnNpemU7XG5cbiAgICAgICAgaWYgKHRoaXMuX3NpemUgPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IoXCJ0dXM6IGNhbm5vdCBhdXRvbWF0aWNhbGx5IGRlcml2ZSB1cGxvYWQncyBzaXplIGZyb20gaW5wdXQgYW5kIG11c3QgYmUgc3BlY2lmaWVkIG1hbnVhbGx5IHVzaW5nIHRoZSBgdXBsb2FkU2l6ZWAgb3B0aW9uXCIpKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSAvLyBSZXNldCB0aGUgYWJvcnRlZCBmbGFnIHdoZW4gdGhlIHVwbG9hZCBpcyBzdGFydGVkIG9yIGVsc2UgdGhlXG4gICAgICAvLyBfcGVyZm9ybVVwbG9hZCB3aWxsIHN0b3AgYmVmb3JlIHNlbmRpbmcgYSByZXF1ZXN0IGlmIHRoZSB1cGxvYWQgaGFzIGJlZW5cbiAgICAgIC8vIGFib3J0ZWQgcHJldmlvdXNseS5cblxuXG4gICAgICB0aGlzLl9hYm9ydGVkID0gZmFsc2U7IC8vIFRoZSB1cGxvYWQgaGFkIGJlZW4gc3RhcnRlZCBwcmV2aW91c2x5IGFuZCB3ZSBzaG91bGQgcmV1c2UgdGhpcyBVUkwuXG5cbiAgICAgIGlmICh0aGlzLnVybCAhPSBudWxsKSB7XG4gICAgICAgICgwLCBfbG9nZ2VyLmxvZykoXCJSZXN1bWluZyB1cGxvYWQgZnJvbSBwcmV2aW91cyBVUkw6IFwiLmNvbmNhdCh0aGlzLnVybCkpO1xuXG4gICAgICAgIHRoaXMuX3Jlc3VtZVVwbG9hZCgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gLy8gQSBVUkwgaGFzIG1hbnVhbGx5IGJlZW4gc3BlY2lmaWVkLCBzbyB3ZSB0cnkgdG8gcmVzdW1lXG5cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRVcmwgIT0gbnVsbCkge1xuICAgICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiUmVzdW1pbmcgdXBsb2FkIGZyb20gcHJvdmlkZWQgVVJMOiBcIi5jb25jYXQodGhpcy5vcHRpb25zLnVybCkpO1xuICAgICAgICB0aGlzLnVybCA9IHRoaXMub3B0aW9ucy51cGxvYWRVcmw7XG5cbiAgICAgICAgdGhpcy5fcmVzdW1lVXBsb2FkKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBBbiB1cGxvYWQgaGFzIG5vdCBzdGFydGVkIGZvciB0aGUgZmlsZSB5ZXQsIHNvIHdlIHN0YXJ0IGEgbmV3IG9uZVxuXG5cbiAgICAgICgwLCBfbG9nZ2VyLmxvZykoJ0NyZWF0aW5nIGEgbmV3IHVwbG9hZCcpO1xuXG4gICAgICB0aGlzLl9jcmVhdGVVcGxvYWQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWJvcnQgYW55IHJ1bm5pbmcgcmVxdWVzdCBhbmQgc3RvcCB0aGUgY3VycmVudCB1cGxvYWQuIEFmdGVyIGFib3J0IGlzIGNhbGxlZCwgbm8gZXZlbnRcbiAgICAgKiBoYW5kbGVyIHdpbGwgYmUgaW52b2tlZCBhbnltb3JlLiBZb3UgY2FuIHVzZSB0aGUgYHN0YXJ0YCBtZXRob2QgdG8gcmVzdW1lIHRoZSB1cGxvYWRcbiAgICAgKiBhZ2Fpbi5cbiAgICAgKiBJZiBgc2hvdWxkVGVybWluYXRlYCBpcyB0cnVlLCB0aGUgYHRlcm1pbmF0ZWAgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgdG8gcmVtb3ZlIHRoZVxuICAgICAqIGN1cnJlbnQgdXBsb2FkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2hvdWxkVGVybWluYXRlIFRydWUgaWYgdGhlIHVwbG9hZCBzaG91bGQgYmUgZGVsZXRlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2Ugd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSByZXF1ZXN0cyBmaW5pc2guXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJhYm9ydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhYm9ydChzaG91bGRUZXJtaW5hdGUpIHtcbiAgICAgIHZhciBfdGhpczQgPSB0aGlzOyAvLyBDb3VudCB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBzZWUgaWYgYSBjYWxsYmFjayBpcyBiZWluZyBwcm92aWRlZCBpbiB0aGUgb2xkIHN0eWxlIHJlcXVpcmVkIGJ5IHR1cy1qcy1jbGllbnQgMS54LCB0aGVuIHRocm93IGFuIGVycm9yIGlmIGl0IGlzLlxuICAgICAgLy8gYGFyZ3VtZW50c2AgaXMgYSBKYXZhU2NyaXB0IGJ1aWx0LWluIHZhcmlhYmxlIHRoYXQgY29udGFpbnMgYWxsIG9mIHRoZSBmdW5jdGlvbidzIGFyZ3VtZW50cy5cblxuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3R1czogdGhlIGFib3J0IGZ1bmN0aW9uIGRvZXMgbm90IGFjY2VwdCBhIGNhbGxiYWNrIHNpbmNlIHYyIGFueW1vcmU7IHBsZWFzZSB1c2UgdGhlIHJldHVybmVkIFByb21pc2UgaW5zdGVhZCcpO1xuICAgICAgfSAvLyBTdG9wIGFueSBwYXJhbGxlbCBwYXJ0aWFsIHVwbG9hZHMsIHRoYXQgaGF2ZSBiZWVuIHN0YXJ0ZWQgaW4gX3N0YXJ0UGFyYWxsZWxVcGxvYWRzLlxuXG5cbiAgICAgIGlmICh0aGlzLl9wYXJhbGxlbFVwbG9hZHMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wYXJhbGxlbFVwbG9hZHMuZm9yRWFjaChmdW5jdGlvbiAodXBsb2FkKSB7XG4gICAgICAgICAgdXBsb2FkLmFib3J0KHNob3VsZFRlcm1pbmF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSAvLyBTdG9wIGFueSBjdXJyZW50IHJ1bm5pbmcgcmVxdWVzdC5cblxuXG4gICAgICBpZiAodGhpcy5fcmVxICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3JlcS5hYm9ydCgpO1xuXG4gICAgICAgIHRoaXMuX3NvdXJjZS5jbG9zZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hYm9ydGVkID0gdHJ1ZTsgLy8gU3RvcCBhbnkgdGltZW91dCB1c2VkIGZvciBpbml0aWF0aW5nIGEgcmV0cnkuXG5cbiAgICAgIGlmICh0aGlzLl9yZXRyeVRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmV0cnlUaW1lb3V0KTtcbiAgICAgICAgdGhpcy5fcmV0cnlUaW1lb3V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzaG91bGRUZXJtaW5hdGUgfHwgdGhpcy51cmwgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBCYXNlVXBsb2FkLnRlcm1pbmF0ZSh0aGlzLnVybCwgdGhpcy5vcHRpb25zKSAvLyBSZW1vdmUgZW50cnkgZnJvbSB0aGUgVVJMIHN0b3JhZ2Ugc2luY2UgdGhlIHVwbG9hZCBVUkwgaXMgbm8gbG9uZ2VyIHZhbGlkLlxuICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX3RoaXM0Ll9yZW1vdmVGcm9tVXJsU3RvcmFnZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9lbWl0SHR0cEVycm9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCBtZXNzYWdlLCBjYXVzaW5nRXJyKSB7XG4gICAgICB0aGlzLl9lbWl0RXJyb3IobmV3IF9lcnJvci5kZWZhdWx0KG1lc3NhZ2UsIGNhdXNpbmdFcnIsIHJlcSwgcmVzKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9lbWl0RXJyb3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VtaXRFcnJvcihlcnIpIHtcbiAgICAgIHZhciBfdGhpczUgPSB0aGlzOyAvLyBEbyBub3QgZW1pdCBlcnJvcnMsIGUuZy4gZnJvbSBhYm9ydGVkIEhUVFAgcmVxdWVzdHMsIGlmIHRoZSB1cGxvYWQgaGFzIGJlZW4gc3RvcHBlZC5cblxuXG4gICAgICBpZiAodGhpcy5fYWJvcnRlZCkgcmV0dXJuOyAvLyBDaGVjayBpZiB3ZSBzaG91bGQgcmV0cnksIHdoZW4gZW5hYmxlZCwgYmVmb3JlIHNlbmRpbmcgdGhlIGVycm9yIHRvIHRoZSB1c2VyLlxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnJldHJ5RGVsYXlzICE9IG51bGwpIHtcbiAgICAgICAgLy8gV2Ugd2lsbCByZXNldCB0aGUgYXR0ZW1wdCBjb3VudGVyIGlmXG4gICAgICAgIC8vIC0gd2Ugd2VyZSBhbHJlYWR5IGFibGUgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyIChvZmZzZXQgIT0gbnVsbCkgYW5kXG4gICAgICAgIC8vIC0gd2Ugd2VyZSBhYmxlIHRvIHVwbG9hZCBhIHNtYWxsIGNodW5rIG9mIGRhdGEgdG8gdGhlIHNlcnZlclxuICAgICAgICB2YXIgc2hvdWxkUmVzZXREZWxheXMgPSB0aGlzLl9vZmZzZXQgIT0gbnVsbCAmJiB0aGlzLl9vZmZzZXQgPiB0aGlzLl9vZmZzZXRCZWZvcmVSZXRyeTtcblxuICAgICAgICBpZiAoc2hvdWxkUmVzZXREZWxheXMpIHtcbiAgICAgICAgICB0aGlzLl9yZXRyeUF0dGVtcHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3VsZFJldHJ5KGVyciwgdGhpcy5fcmV0cnlBdHRlbXB0LCB0aGlzLm9wdGlvbnMpKSB7XG4gICAgICAgICAgdmFyIGRlbGF5ID0gdGhpcy5vcHRpb25zLnJldHJ5RGVsYXlzW3RoaXMuX3JldHJ5QXR0ZW1wdCsrXTtcbiAgICAgICAgICB0aGlzLl9vZmZzZXRCZWZvcmVSZXRyeSA9IHRoaXMuX29mZnNldDtcbiAgICAgICAgICB0aGlzLl9yZXRyeVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzNS5zdGFydCgpO1xuICAgICAgICAgIH0sIGRlbGF5KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25FcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcihlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQdWJsaXNoZXMgbm90aWZpY2F0aW9uIGlmIHRoZSB1cGxvYWQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2VtaXRTdWNjZXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0U3VjY2VzcygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlRmluZ2VycHJpbnRPblN1Y2Nlc3MpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHN0b3JlZCBmaW5nZXJwcmludCBhbmQgY29ycmVzcG9uZGluZyBlbmRwb2ludC4gVGhpcyBjYXVzZXNcbiAgICAgICAgLy8gbmV3IHVwbG9hZHMgb2YgdGhlIHNhbWUgZmlsZSB0byBiZSB0cmVhdGVkIGFzIGEgZGlmZmVyZW50IGZpbGUuXG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21VcmxTdG9yYWdlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uU3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25TdWNjZXNzKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFB1Ymxpc2hlcyBub3RpZmljYXRpb24gd2hlbiBkYXRhIGhhcyBiZWVuIHNlbnQgdG8gdGhlIHNlcnZlci4gVGhpc1xuICAgICAqIGRhdGEgbWF5IG5vdCBoYXZlIGJlZW4gYWNjZXB0ZWQgYnkgdGhlIHNlcnZlciB5ZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYnl0ZXNTZW50ICBOdW1iZXIgb2YgYnl0ZXMgc2VudCB0byB0aGUgc2VydmVyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlc1RvdGFsIFRvdGFsIG51bWJlciBvZiBieXRlcyB0byBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfZW1pdFByb2dyZXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0UHJvZ3Jlc3MoYnl0ZXNTZW50LCBieXRlc1RvdGFsKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vblByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vblByb2dyZXNzKGJ5dGVzU2VudCwgYnl0ZXNUb3RhbCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFB1Ymxpc2hlcyBub3RpZmljYXRpb24gd2hlbiBhIGNodW5rIG9mIGRhdGEgaGFzIGJlZW4gc2VudCB0byB0aGUgc2VydmVyXG4gICAgICogYW5kIGFjY2VwdGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNodW5rU2l6ZSAgU2l6ZSBvZiB0aGUgY2h1bmsgdGhhdCB3YXMgYWNjZXB0ZWQgYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYnl0ZXNBY2NlcHRlZCBUb3RhbCBudW1iZXIgb2YgYnl0ZXMgdGhhdCBoYXZlIGJlZW5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0ZWQgYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYnl0ZXNUb3RhbCBUb3RhbCBudW1iZXIgb2YgYnl0ZXMgdG8gYmUgc2VudCB0byB0aGUgc2VydmVyLlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2VtaXRDaHVua0NvbXBsZXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0Q2h1bmtDb21wbGV0ZShjaHVua1NpemUsIGJ5dGVzQWNjZXB0ZWQsIGJ5dGVzVG90YWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uQ2h1bmtDb21wbGV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25DaHVua0NvbXBsZXRlKGNodW5rU2l6ZSwgYnl0ZXNBY2NlcHRlZCwgYnl0ZXNUb3RhbCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyB1cGxvYWQgdXNpbmcgdGhlIGNyZWF0aW9uIGV4dGVuc2lvbiBieSBzZW5kaW5nIGEgUE9TVFxuICAgICAqIHJlcXVlc3QgdG8gdGhlIGVuZHBvaW50LiBBZnRlciBzdWNjZXNzZnVsIGNyZWF0aW9uIHRoZSBmaWxlIHdpbGwgYmVcbiAgICAgKiB1cGxvYWRlZFxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfY3JlYXRlVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9jcmVhdGVVcGxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcigndHVzOiB1bmFibGUgdG8gY3JlYXRlIHVwbG9hZCBiZWNhdXNlIG5vIGVuZHBvaW50IGlzIHByb3ZpZGVkJykpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcSA9IHRoaXMuX29wZW5SZXF1ZXN0KCdQT1NUJywgdGhpcy5vcHRpb25zLmVuZHBvaW50KTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRMZW5ndGhEZWZlcnJlZCkge1xuICAgICAgICByZXEuc2V0SGVhZGVyKCdVcGxvYWQtRGVmZXItTGVuZ3RoJywgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXEuc2V0SGVhZGVyKCdVcGxvYWQtTGVuZ3RoJywgdGhpcy5fc2l6ZSk7XG4gICAgICB9IC8vIEFkZCBtZXRhZGF0YSBpZiB2YWx1ZXMgaGF2ZSBiZWVuIGFkZGVkXG5cblxuICAgICAgdmFyIG1ldGFkYXRhID0gZW5jb2RlTWV0YWRhdGEodGhpcy5vcHRpb25zLm1ldGFkYXRhKTtcblxuICAgICAgaWYgKG1ldGFkYXRhICE9PSAnJykge1xuICAgICAgICByZXEuc2V0SGVhZGVyKCdVcGxvYWQtTWV0YWRhdGEnLCBtZXRhZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9taXNlO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZERhdGFEdXJpbmdDcmVhdGlvbiAmJiAhdGhpcy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgICAgIHByb21pc2UgPSB0aGlzLl9hZGRDaHVua1RvUmVxdWVzdChyZXEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZSA9IHRoaXMuX3NlbmRSZXF1ZXN0KHJlcSwgbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeShyZXMuZ2V0U3RhdHVzKCksIDIwMCkpIHtcbiAgICAgICAgICBfdGhpczYuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsICd0dXM6IHVuZXhwZWN0ZWQgcmVzcG9uc2Ugd2hpbGUgY3JlYXRpbmcgdXBsb2FkJyk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jYXRpb24gPSByZXMuZ2V0SGVhZGVyKCdMb2NhdGlvbicpO1xuXG4gICAgICAgIGlmIChsb2NhdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgX3RoaXM2Ll9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCAndHVzOiBpbnZhbGlkIG9yIG1pc3NpbmcgTG9jYXRpb24gaGVhZGVyJyk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczYudXJsID0gcmVzb2x2ZVVybChfdGhpczYub3B0aW9ucy5lbmRwb2ludCwgbG9jYXRpb24pO1xuICAgICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiQ3JlYXRlZCB1cGxvYWQgYXQgXCIuY29uY2F0KF90aGlzNi51cmwpKTtcblxuICAgICAgICBpZiAodHlwZW9mIF90aGlzNi5vcHRpb25zLl9vblVwbG9hZFVybEF2YWlsYWJsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIF90aGlzNi5vcHRpb25zLl9vblVwbG9hZFVybEF2YWlsYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzNi5fc2l6ZSA9PT0gMCkge1xuICAgICAgICAgIC8vIE5vdGhpbmcgdG8gdXBsb2FkIGFuZCBmaWxlIHdhcyBzdWNjZXNzZnVsbHkgY3JlYXRlZFxuICAgICAgICAgIF90aGlzNi5fZW1pdFN1Y2Nlc3MoKTtcblxuICAgICAgICAgIF90aGlzNi5fc291cmNlLmNsb3NlKCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczYuX3NhdmVVcGxvYWRJblVybFN0b3JhZ2UoKTtcblxuICAgICAgICBpZiAoX3RoaXM2Lm9wdGlvbnMudXBsb2FkRGF0YUR1cmluZ0NyZWF0aW9uKSB7XG4gICAgICAgICAgX3RoaXM2Ll9oYW5kbGVVcGxvYWRSZXNwb25zZShyZXEsIHJlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXM2Ll9vZmZzZXQgPSAwO1xuXG4gICAgICAgICAgX3RoaXM2Ll9wZXJmb3JtVXBsb2FkKCk7XG4gICAgICAgIH1cbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICBfdGhpczYuX2VtaXRIdHRwRXJyb3IocmVxLCBudWxsLCAndHVzOiBmYWlsZWQgdG8gY3JlYXRlIHVwbG9hZCcsIGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLypcbiAgICAgKiBUcnkgdG8gcmVzdW1lIGFuIGV4aXN0aW5nIHVwbG9hZC4gRmlyc3QgYSBIRUFEIHJlcXVlc3Qgd2lsbCBiZSBzZW50XG4gICAgICogdG8gcmV0cmlldmUgdGhlIG9mZnNldC4gSWYgdGhlIHJlcXVlc3QgZmFpbHMgYSBuZXcgdXBsb2FkIHdpbGwgYmVcbiAgICAgKiBjcmVhdGVkLiBJbiB0aGUgY2FzZSBvZiBhIHN1Y2Nlc3NmdWwgcmVzcG9uc2UgdGhlIGZpbGUgd2lsbCBiZSB1cGxvYWRlZC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3Jlc3VtZVVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVzdW1lVXBsb2FkKCkge1xuICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgIHZhciByZXEgPSB0aGlzLl9vcGVuUmVxdWVzdCgnSEVBRCcsIHRoaXMudXJsKTtcblxuICAgICAgdmFyIHByb21pc2UgPSB0aGlzLl9zZW5kUmVxdWVzdChyZXEsIG51bGwpO1xuXG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgc3RhdHVzID0gcmVzLmdldFN0YXR1cygpO1xuXG4gICAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeShzdGF0dXMsIDIwMCkpIHtcbiAgICAgICAgICBpZiAoaW5TdGF0dXNDYXRlZ29yeShzdGF0dXMsIDQwMCkpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBzdG9yZWQgZmluZ2VycHJpbnQgYW5kIGNvcnJlc3BvbmRpbmcgZW5kcG9pbnQsXG4gICAgICAgICAgICAvLyBvbiBjbGllbnQgZXJyb3JzIHNpbmNlIHRoZSBmaWxlIGNhbiBub3QgYmUgZm91bmRcbiAgICAgICAgICAgIF90aGlzNy5fcmVtb3ZlRnJvbVVybFN0b3JhZ2UoKTtcbiAgICAgICAgICB9IC8vIElmIHRoZSB1cGxvYWQgaXMgbG9ja2VkIChpbmRpY2F0ZWQgYnkgdGhlIDQyMyBMb2NrZWQgc3RhdHVzIGNvZGUpLCB3ZVxuICAgICAgICAgIC8vIGVtaXQgYW4gZXJyb3IgaW5zdGVhZCBvZiBkaXJlY3RseSBzdGFydGluZyBhIG5ldyB1cGxvYWQuIFRoaXMgd2F5IHRoZVxuICAgICAgICAgIC8vIHJldHJ5IGxvZ2ljIGNhbiBjYXRjaCB0aGUgZXJyb3IgYW5kIHdpbGwgcmV0cnkgdGhlIHVwbG9hZC4gQW4gdXBsb2FkXG4gICAgICAgICAgLy8gaXMgdXN1YWxseSBsb2NrZWQgZm9yIGEgc2hvcnQgcGVyaW9kIG9mIHRpbWUgYW5kIHdpbGwgYmUgYXZhaWxhYmxlXG4gICAgICAgICAgLy8gYWZ0ZXJ3YXJkcy5cblxuXG4gICAgICAgICAgaWYgKHN0YXR1cyA9PT0gNDIzKSB7XG4gICAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsICd0dXM6IHVwbG9hZCBpcyBjdXJyZW50bHkgbG9ja2VkOyByZXRyeSBsYXRlcicpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFfdGhpczcub3B0aW9ucy5lbmRwb2ludCkge1xuICAgICAgICAgICAgLy8gRG9uJ3QgYXR0ZW1wdCB0byBjcmVhdGUgYSBuZXcgdXBsb2FkIGlmIG5vIGVuZHBvaW50IGlzIHByb3ZpZGVkLlxuICAgICAgICAgICAgX3RoaXM3Ll9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCAndHVzOiB1bmFibGUgdG8gcmVzdW1lIHVwbG9hZCAobmV3IHVwbG9hZCBjYW5ub3QgYmUgY3JlYXRlZCB3aXRob3V0IGFuIGVuZHBvaW50KScpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSAvLyBUcnkgdG8gY3JlYXRlIGEgbmV3IHVwbG9hZFxuXG5cbiAgICAgICAgICBfdGhpczcudXJsID0gbnVsbDtcblxuICAgICAgICAgIF90aGlzNy5fY3JlYXRlVXBsb2FkKCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2Zmc2V0ID0gcGFyc2VJbnQocmVzLmdldEhlYWRlcignVXBsb2FkLU9mZnNldCcpLCAxMCk7XG5cbiAgICAgICAgaWYgKGlzTmFOKG9mZnNldCkpIHtcbiAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsICd0dXM6IGludmFsaWQgb3IgbWlzc2luZyBvZmZzZXQgdmFsdWUnKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW5ndGggPSBwYXJzZUludChyZXMuZ2V0SGVhZGVyKCdVcGxvYWQtTGVuZ3RoJyksIDEwKTtcblxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSAmJiAhX3RoaXM3Lm9wdGlvbnMudXBsb2FkTGVuZ3RoRGVmZXJyZWQpIHtcbiAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsICd0dXM6IGludmFsaWQgb3IgbWlzc2luZyBsZW5ndGggdmFsdWUnKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgX3RoaXM3Lm9wdGlvbnMuX29uVXBsb2FkVXJsQXZhaWxhYmxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgX3RoaXM3Lm9wdGlvbnMuX29uVXBsb2FkVXJsQXZhaWxhYmxlKCk7XG4gICAgICAgIH0gLy8gVXBsb2FkIGhhcyBhbHJlYWR5IGJlZW4gY29tcGxldGVkIGFuZCB3ZSBkbyBub3QgbmVlZCB0byBzZW5kIGFkZGl0aW9uYWxcbiAgICAgICAgLy8gZGF0YSB0byB0aGUgc2VydmVyXG5cblxuICAgICAgICBpZiAob2Zmc2V0ID09PSBsZW5ndGgpIHtcbiAgICAgICAgICBfdGhpczcuX2VtaXRQcm9ncmVzcyhsZW5ndGgsIGxlbmd0aCk7XG5cbiAgICAgICAgICBfdGhpczcuX2VtaXRTdWNjZXNzKCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczcuX29mZnNldCA9IG9mZnNldDtcblxuICAgICAgICBfdGhpczcuX3BlcmZvcm1VcGxvYWQoKTtcbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCBudWxsLCAndHVzOiBmYWlsZWQgdG8gcmVzdW1lIHVwbG9hZCcsIGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhcnQgdXBsb2FkaW5nIHRoZSBmaWxlIHVzaW5nIFBBVENIIHJlcXVlc3RzLiBUaGUgZmlsZSB3aWxsIGJlIGRpdmlkZWRcbiAgICAgKiBpbnRvIGNodW5rcyBhcyBzcGVjaWZpZWQgaW4gdGhlIGNodW5rU2l6ZSBvcHRpb24uIER1cmluZyB0aGUgdXBsb2FkXG4gICAgICogdGhlIG9uUHJvZ3Jlc3MgZXZlbnQgaGFuZGxlciBtYXkgYmUgaW52b2tlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3BlcmZvcm1VcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3BlcmZvcm1VcGxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXM4ID0gdGhpczsgLy8gSWYgdGhlIHVwbG9hZCBoYXMgYmVlbiBhYm9ydGVkLCB3ZSB3aWxsIG5vdCBzZW5kIHRoZSBuZXh0IFBBVENIIHJlcXVlc3QuXG4gICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCBpZiB0aGUgYWJvcnQgbWV0aG9kIHdhcyBjYWxsZWQgZHVyaW5nIGEgY2FsbGJhY2ssIHN1Y2hcbiAgICAgIC8vIGFzIG9uQ2h1bmtDb21wbGV0ZSBvciBvblByb2dyZXNzLlxuXG5cbiAgICAgIGlmICh0aGlzLl9hYm9ydGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcTsgLy8gU29tZSBicm93c2VyIGFuZCBzZXJ2ZXJzIG1heSBub3Qgc3VwcG9ydCB0aGUgUEFUQ0ggbWV0aG9kLiBGb3IgdGhvc2VcbiAgICAgIC8vIGNhc2VzLCB5b3UgY2FuIHRlbGwgdHVzLWpzLWNsaWVudCB0byB1c2UgYSBQT1NUIHJlcXVlc3Qgd2l0aCB0aGVcbiAgICAgIC8vIFgtSFRUUC1NZXRob2QtT3ZlcnJpZGUgaGVhZGVyIGZvciBzaW11bGF0aW5nIGEgUEFUQ0ggcmVxdWVzdC5cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vdmVycmlkZVBhdGNoTWV0aG9kKSB7XG4gICAgICAgIHJlcSA9IHRoaXMuX29wZW5SZXF1ZXN0KCdQT1NUJywgdGhpcy51cmwpO1xuICAgICAgICByZXEuc2V0SGVhZGVyKCdYLUhUVFAtTWV0aG9kLU92ZXJyaWRlJywgJ1BBVENIJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXEgPSB0aGlzLl9vcGVuUmVxdWVzdCgnUEFUQ0gnLCB0aGlzLnVybCk7XG4gICAgICB9XG5cbiAgICAgIHJlcS5zZXRIZWFkZXIoJ1VwbG9hZC1PZmZzZXQnLCB0aGlzLl9vZmZzZXQpO1xuXG4gICAgICB2YXIgcHJvbWlzZSA9IHRoaXMuX2FkZENodW5rVG9SZXF1ZXN0KHJlcSk7XG5cbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeShyZXMuZ2V0U3RhdHVzKCksIDIwMCkpIHtcbiAgICAgICAgICBfdGhpczguX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsICd0dXM6IHVuZXhwZWN0ZWQgcmVzcG9uc2Ugd2hpbGUgdXBsb2FkaW5nIGNodW5rJyk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczguX2hhbmRsZVVwbG9hZFJlc3BvbnNlKHJlcSwgcmVzKTtcbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICAvLyBEb24ndCBlbWl0IGFuIGVycm9yIGlmIHRoZSB1cGxvYWQgd2FzIGFib3J0ZWQgbWFudWFsbHlcbiAgICAgICAgaWYgKF90aGlzOC5fYWJvcnRlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzOC5fZW1pdEh0dHBFcnJvcihyZXEsIG51bGwsIFwidHVzOiBmYWlsZWQgdG8gdXBsb2FkIGNodW5rIGF0IG9mZnNldCBcIi5jb25jYXQoX3RoaXM4Ll9vZmZzZXQpLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIF9hZGRDaHVua3RvUmVxdWVzdCByZWFkcyBhIGNodW5rIGZyb20gdGhlIHNvdXJjZSBhbmQgc2VuZHMgaXQgdXNpbmcgdGhlXG4gICAgICogc3VwcGxpZWQgcmVxdWVzdCBvYmplY3QuIEl0IHdpbGwgbm90IGhhbmRsZSB0aGUgcmVzcG9uc2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9hZGRDaHVua1RvUmVxdWVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfYWRkQ2h1bmtUb1JlcXVlc3QocmVxKSB7XG4gICAgICB2YXIgX3RoaXM5ID0gdGhpcztcblxuICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5fb2Zmc2V0O1xuICAgICAgdmFyIGVuZCA9IHRoaXMuX29mZnNldCArIHRoaXMub3B0aW9ucy5jaHVua1NpemU7XG4gICAgICByZXEuc2V0UHJvZ3Jlc3NIYW5kbGVyKGZ1bmN0aW9uIChieXRlc1NlbnQpIHtcbiAgICAgICAgX3RoaXM5Ll9lbWl0UHJvZ3Jlc3Moc3RhcnQgKyBieXRlc1NlbnQsIF90aGlzOS5fc2l6ZSk7XG4gICAgICB9KTtcbiAgICAgIHJlcS5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9vZmZzZXQrb2N0ZXQtc3RyZWFtJyk7IC8vIFRoZSBzcGVjaWZpZWQgY2h1bmtTaXplIG1heSBiZSBJbmZpbml0eSBvciB0aGUgY2FsY2x1YXRlZCBlbmQgcG9zaXRpb25cbiAgICAgIC8vIG1heSBleGNlZWQgdGhlIGZpbGUncyBzaXplLiBJbiBib3RoIGNhc2VzLCB3ZSBsaW1pdCB0aGUgZW5kIHBvc2l0aW9uIHRvXG4gICAgICAvLyB0aGUgaW5wdXQncyB0b3RhbCBzaXplIGZvciBzaW1wbGVyIGNhbGN1bGF0aW9ucyBhbmQgY29ycmVjdG5lc3MuXG5cbiAgICAgIGlmICgoZW5kID09PSBJbmZpbml0eSB8fCBlbmQgPiB0aGlzLl9zaXplKSAmJiAhdGhpcy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgIGVuZCA9IHRoaXMuX3NpemU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudGhlbihmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gX3JlZjIudmFsdWUsXG4gICAgICAgICAgICBkb25lID0gX3JlZjIuZG9uZTsgLy8gSWYgdGhlIHVwbG9hZCBsZW5ndGggaXMgZGVmZXJyZWQsIHRoZSB1cGxvYWQgc2l6ZSB3YXMgbm90IHNwZWNpZmllZCBkdXJpbmdcbiAgICAgICAgLy8gdXBsb2FkIGNyZWF0aW9uLiBTbywgaWYgdGhlIGZpbGUgcmVhZGVyIGlzIGRvbmUgcmVhZGluZywgd2Uga25vdyB0aGUgdG90YWxcbiAgICAgICAgLy8gdXBsb2FkIHNpemUgYW5kIGNhbiB0ZWxsIHRoZSB0dXMgc2VydmVyLlxuXG4gICAgICAgIGlmIChfdGhpczkub3B0aW9ucy51cGxvYWRMZW5ndGhEZWZlcnJlZCAmJiBkb25lKSB7XG4gICAgICAgICAgX3RoaXM5Ll9zaXplID0gX3RoaXM5Ll9vZmZzZXQgKyAodmFsdWUgJiYgdmFsdWUuc2l6ZSA/IHZhbHVlLnNpemUgOiAwKTtcbiAgICAgICAgICByZXEuc2V0SGVhZGVyKCdVcGxvYWQtTGVuZ3RoJywgX3RoaXM5Ll9zaXplKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBfdGhpczkuX3NlbmRSZXF1ZXN0KHJlcSk7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczkuX2VtaXRQcm9ncmVzcyhfdGhpczkuX29mZnNldCwgX3RoaXM5Ll9zaXplKTtcblxuICAgICAgICByZXR1cm4gX3RoaXM5Ll9zZW5kUmVxdWVzdChyZXEsIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBfaGFuZGxlVXBsb2FkUmVzcG9uc2UgaXMgdXNlZCBieSByZXF1ZXN0cyB0aGF0IGhhdmVuIGJlZW4gc2VudCB1c2luZyBfYWRkQ2h1bmtUb1JlcXVlc3RcbiAgICAgKiBhbmQgYWxyZWFkeSBoYXZlIHJlY2VpdmVkIGEgcmVzcG9uc2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9oYW5kbGVVcGxvYWRSZXNwb25zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlVXBsb2FkUmVzcG9uc2UocmVxLCByZXMpIHtcbiAgICAgIHZhciBvZmZzZXQgPSBwYXJzZUludChyZXMuZ2V0SGVhZGVyKCdVcGxvYWQtT2Zmc2V0JyksIDEwKTtcblxuICAgICAgaWYgKGlzTmFOKG9mZnNldCkpIHtcbiAgICAgICAgdGhpcy5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgJ3R1czogaW52YWxpZCBvciBtaXNzaW5nIG9mZnNldCB2YWx1ZScpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fZW1pdFByb2dyZXNzKG9mZnNldCwgdGhpcy5fc2l6ZSk7XG5cbiAgICAgIHRoaXMuX2VtaXRDaHVua0NvbXBsZXRlKG9mZnNldCAtIHRoaXMuX29mZnNldCwgb2Zmc2V0LCB0aGlzLl9zaXplKTtcblxuICAgICAgdGhpcy5fb2Zmc2V0ID0gb2Zmc2V0O1xuXG4gICAgICBpZiAob2Zmc2V0ID09IHRoaXMuX3NpemUpIHtcbiAgICAgICAgLy8gWWF5LCBmaW5hbGx5IGRvbmUgOilcbiAgICAgICAgdGhpcy5fZW1pdFN1Y2Nlc3MoKTtcblxuICAgICAgICB0aGlzLl9zb3VyY2UuY2xvc2UoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3BlcmZvcm1VcGxvYWQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IEhUVFAgcmVxdWVzdCBvYmplY3Qgd2l0aCB0aGUgZ2l2ZW4gbWV0aG9kIGFuZCBVUkwuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9vcGVuUmVxdWVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfb3BlblJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgICAgIHZhciByZXEgPSBvcGVuUmVxdWVzdChtZXRob2QsIHVybCwgdGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMuX3JlcSA9IHJlcTtcbiAgICAgIHJldHVybiByZXE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgZW50cnkgaW4gdGhlIFVSTCBzdG9yYWdlLCBpZiBpdCBoYXMgYmVlbiBzYXZlZCBiZWZvcmUuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9yZW1vdmVGcm9tVXJsU3RvcmFnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVtb3ZlRnJvbVVybFN0b3JhZ2UoKSB7XG4gICAgICB2YXIgX3RoaXMxMCA9IHRoaXM7XG5cbiAgICAgIGlmICghdGhpcy5fdXJsU3RvcmFnZUtleSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLl91cmxTdG9yYWdlLnJlbW92ZVVwbG9hZCh0aGlzLl91cmxTdG9yYWdlS2V5KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgX3RoaXMxMC5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fdXJsU3RvcmFnZUtleSA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgdXBsb2FkIFVSTCB0byB0aGUgVVJMIHN0b3JhZ2UsIGlmIHBvc3NpYmxlLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfc2F2ZVVwbG9hZEluVXJsU3RvcmFnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfc2F2ZVVwbG9hZEluVXJsU3RvcmFnZSgpIHtcbiAgICAgIHZhciBfdGhpczExID0gdGhpczsgLy8gT25seSBpZiBhIGZpbmdlcnByaW50IHdhcyBjYWxjdWxhdGVkIGZvciB0aGUgaW5wdXQgKGkuZS4gbm90IGEgc3RyZWFtKSwgd2UgY2FuIHN0b3JlIHRoZSB1cGxvYWQgVVJMLlxuXG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnN0b3JlRmluZ2VycHJpbnRGb3JSZXN1bWluZyB8fCAhdGhpcy5fZmluZ2VycHJpbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RvcmVkVXBsb2FkID0ge1xuICAgICAgICBzaXplOiB0aGlzLl9zaXplLFxuICAgICAgICBtZXRhZGF0YTogdGhpcy5vcHRpb25zLm1ldGFkYXRhLFxuICAgICAgICBjcmVhdGlvblRpbWU6IG5ldyBEYXRlKCkudG9TdHJpbmcoKVxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuX3BhcmFsbGVsVXBsb2Fkcykge1xuICAgICAgICAvLyBTYXZlIG11bHRpcGxlIFVSTHMgaWYgdGhlIHBhcmFsbGVsVXBsb2FkcyBvcHRpb24gaXMgdXNlZCAuLi5cbiAgICAgICAgc3RvcmVkVXBsb2FkLnBhcmFsbGVsVXBsb2FkVXJscyA9IHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIC4uLiBvdGhlcndpc2Ugd2UganVzdCBzYXZlIHRoZSBvbmUgYXZhaWxhYmxlIFVSTC5cbiAgICAgICAgc3RvcmVkVXBsb2FkLnVwbG9hZFVybCA9IHRoaXMudXJsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl91cmxTdG9yYWdlLmFkZFVwbG9hZCh0aGlzLl9maW5nZXJwcmludCwgc3RvcmVkVXBsb2FkKS50aGVuKGZ1bmN0aW9uICh1cmxTdG9yYWdlS2V5KSB7XG4gICAgICAgIHJldHVybiBfdGhpczExLl91cmxTdG9yYWdlS2V5ID0gdXJsU3RvcmFnZUtleTtcbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICBfdGhpczExLl9lbWl0RXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kIGEgcmVxdWVzdCB3aXRoIHRoZSBwcm92aWRlZCBib2R5LlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfc2VuZFJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3NlbmRSZXF1ZXN0KHJlcSkge1xuICAgICAgdmFyIGJvZHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocmVxLCBib2R5LCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cbiAgfV0sIFt7XG4gICAga2V5OiBcInRlcm1pbmF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXJtaW5hdGUodXJsLCBvcHRpb25zKSB7XG4gICAgICAvLyBDb3VudCB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBzZWUgaWYgYSBjYWxsYmFjayBpcyBiZWluZyBwcm92aWRlZCBhcyB0aGUgbGFzdFxuICAgICAgLy8gYXJndW1lbnQgaW4gdGhlIG9sZCBzdHlsZSByZXF1aXJlZCBieSB0dXMtanMtY2xpZW50IDEueCwgdGhlbiB0aHJvdyBhbiBlcnJvciBpZiBpdCBpcy5cbiAgICAgIC8vIGBhcmd1bWVudHNgIGlzIGEgSmF2YVNjcmlwdCBidWlsdC1pbiB2YXJpYWJsZSB0aGF0IGNvbnRhaW5zIGFsbCBvZiB0aGUgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0dXM6IHRoZSB0ZXJtaW5hdGUgZnVuY3Rpb24gZG9lcyBub3QgYWNjZXB0IGEgY2FsbGJhY2sgc2luY2UgdjIgYW55bW9yZTsgcGxlYXNlIHVzZSB0aGUgcmV0dXJuZWQgUHJvbWlzZSBpbnN0ZWFkJyk7XG4gICAgICB9IC8vIE5vdGUgdGhhdCBpbiBvcmRlciBmb3IgdGhlIHRyaWNrIGFib3ZlIHRvIHdvcmssIGEgZGVmYXVsdCB2YWx1ZSBjYW5ub3QgYmUgc2V0IGZvciBgb3B0aW9uc2AsXG4gICAgICAvLyBzbyB0aGUgY2hlY2sgYmVsb3cgcmVwbGFjZXMgdGhlIG9sZCBkZWZhdWx0IGB7fWAuXG5cblxuICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG5cbiAgICAgIHZhciByZXEgPSBvcGVuUmVxdWVzdCgnREVMRVRFJywgdXJsLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChyZXEsIG51bGwsIG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyBBIDIwNCByZXNwb25zZSBpbmRpY2F0ZXMgYSBzdWNjZXNzZnVsbCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXMuZ2V0U3RhdHVzKCkgPT09IDIwNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBfZXJyb3IuZGVmYXVsdCgndHVzOiB1bmV4cGVjdGVkIHJlc3BvbnNlIHdoaWxlIHRlcm1pbmF0aW5nIHVwbG9hZCcsIG51bGwsIHJlcSwgcmVzKTtcbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoIShlcnIgaW5zdGFuY2VvZiBfZXJyb3IuZGVmYXVsdCkpIHtcbiAgICAgICAgICBlcnIgPSBuZXcgX2Vycm9yLmRlZmF1bHQoJ3R1czogZmFpbGVkIHRvIHRlcm1pbmF0ZSB1cGxvYWQnLCBlcnIsIHJlcSwgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNob3VsZFJldHJ5KGVyciwgMCwgb3B0aW9ucykpIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0gLy8gSW5zdGVhZCBvZiBrZWVwaW5nIHRyYWNrIG9mIHRoZSByZXRyeSBhdHRlbXB0cywgd2UgcmVtb3ZlIHRoZSBmaXJzdCBlbGVtZW50IGZyb20gdGhlIGRlbGF5c1xuICAgICAgICAvLyBhcnJheS4gSWYgdGhlIGFycmF5IGlzIGVtcHR5LCBhbGwgcmV0cnkgYXR0ZW1wdHMgYXJlIHVzZWQgdXAgYW5kIHdlIHdpbGwgYnViYmxlIHVwIHRoZSBlcnJvci5cbiAgICAgICAgLy8gV2UgcmVjdXJzaXZlbHkgY2FsbCB0aGUgdGVybWluYXRlIGZ1bmN0aW9uIHdpbGwgcmVtb3ZpbmcgZWxlbWVudHMgZnJvbSB0aGUgcmV0cnlEZWxheXMgYXJyYXkuXG5cblxuICAgICAgICB2YXIgZGVsYXkgPSBvcHRpb25zLnJldHJ5RGVsYXlzWzBdO1xuICAgICAgICB2YXIgcmVtYWluaW5nRGVsYXlzID0gb3B0aW9ucy5yZXRyeURlbGF5cy5zbGljZSgxKTtcblxuICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IF9vYmplY3RTcHJlYWQoe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICByZXRyeURlbGF5czogcmVtYWluaW5nRGVsYXlzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIEJhc2VVcGxvYWQudGVybWluYXRlKHVybCwgbmV3T3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJhc2VVcGxvYWQ7XG59KCk7XG5cbmZ1bmN0aW9uIGVuY29kZU1ldGFkYXRhKG1ldGFkYXRhKSB7XG4gIHZhciBlbmNvZGVkID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG1ldGFkYXRhKSB7XG4gICAgZW5jb2RlZC5wdXNoKFwiXCIuY29uY2F0KGtleSwgXCIgXCIpLmNvbmNhdChfanNCYXNlLkJhc2U2NC5lbmNvZGUobWV0YWRhdGFba2V5XSkpKTtcbiAgfVxuXG4gIHJldHVybiBlbmNvZGVkLmpvaW4oJywnKTtcbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBnaXZlbiBzdGF0dXMgaXMgaW4gdGhlIHJhbmdlIG9mIHRoZSBleHBlY3RlZCBjYXRlZ29yeS5cbiAqIEZvciBleGFtcGxlLCBvbmx5IGEgc3RhdHVzIGJldHdlZW4gMjAwIGFuZCAyOTkgd2lsbCBzYXRpc2Z5IHRoZSBjYXRlZ29yeSAyMDAuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBpblN0YXR1c0NhdGVnb3J5KHN0YXR1cywgY2F0ZWdvcnkpIHtcbiAgcmV0dXJuIHN0YXR1cyA+PSBjYXRlZ29yeSAmJiBzdGF0dXMgPCBjYXRlZ29yeSArIDEwMDtcbn1cbi8qKlxuICogQ3JlYXRlIGEgbmV3IEhUVFAgcmVxdWVzdCB3aXRoIHRoZSBzcGVjaWZpZWQgbWV0aG9kIGFuZCBVUkwuXG4gKiBUaGUgbmVjZXNzYXJ5IGhlYWRlcnMgdGhhdCBhcmUgaW5jbHVkZWQgaW4gZXZlcnkgcmVxdWVzdFxuICogd2lsbCBiZSBhZGRlZCwgaW5jbHVkaW5nIHRoZSByZXF1ZXN0IElELlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblxuZnVuY3Rpb24gb3BlblJlcXVlc3QobWV0aG9kLCB1cmwsIG9wdGlvbnMpIHtcbiAgdmFyIHJlcSA9IG9wdGlvbnMuaHR0cFN0YWNrLmNyZWF0ZVJlcXVlc3QobWV0aG9kLCB1cmwpO1xuICByZXEuc2V0SGVhZGVyKCdUdXMtUmVzdW1hYmxlJywgJzEuMC4wJyk7XG4gIHZhciBoZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuXG4gIGZvciAodmFyIG5hbWUgaW4gaGVhZGVycykge1xuICAgIHJlcS5zZXRIZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5hZGRSZXF1ZXN0SWQpIHtcbiAgICB2YXIgcmVxdWVzdElkID0gKDAsIF91dWlkLmRlZmF1bHQpKCk7XG4gICAgcmVxLnNldEhlYWRlcignWC1SZXF1ZXN0LUlEJywgcmVxdWVzdElkKTtcbiAgfVxuXG4gIHJldHVybiByZXE7XG59XG4vKipcbiAqIFNlbmQgYSByZXF1ZXN0IHdpdGggdGhlIHByb3ZpZGVkIGJvZHkgd2hpbGUgaW52b2tpbmcgdGhlIG9uQmVmb3JlUmVxdWVzdFxuICogYW5kIG9uQWZ0ZXJSZXNwb25zZSBjYWxsYmFja3MuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBzZW5kUmVxdWVzdChyZXEsIGJvZHksIG9wdGlvbnMpIHtcbiAgdmFyIG9uQmVmb3JlUmVxdWVzdFByb21pc2UgPSB0eXBlb2Ygb3B0aW9ucy5vbkJlZm9yZVJlcXVlc3QgPT09ICdmdW5jdGlvbicgPyBQcm9taXNlLnJlc29sdmUob3B0aW9ucy5vbkJlZm9yZVJlcXVlc3QocmVxKSkgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgcmV0dXJuIG9uQmVmb3JlUmVxdWVzdFByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHJlcS5zZW5kKGJvZHkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgdmFyIG9uQWZ0ZXJSZXNwb25zZVByb21pc2UgPSB0eXBlb2Ygb3B0aW9ucy5vbkFmdGVyUmVzcG9uc2UgPT09ICdmdW5jdGlvbicgPyBQcm9taXNlLnJlc29sdmUob3B0aW9ucy5vbkFmdGVyUmVzcG9uc2UocmVxLCByZXMpKSA6IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgcmV0dXJuIG9uQWZ0ZXJSZXNwb25zZVByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBicm93c2VyIHJ1bm5pbmcgdGhpcyBjb2RlIGhhcyBpbnRlcm5ldCBhY2Nlc3MuXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYWx3YXlzIHJldHVybiB0cnVlIGluIHRoZSBub2RlLmpzIGVudmlyb25tZW50XG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBpc09ubGluZSgpIHtcbiAgdmFyIG9ubGluZSA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICduYXZpZ2F0b3InIGluIHdpbmRvdyAmJiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZSA9PT0gZmFsc2UpIHtcbiAgICBvbmxpbmUgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBvbmxpbmU7XG59XG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCBpdCBpcyBvayB0byByZXRyeSBhIHJlcXVlc3QuXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnIgdGhlIGVycm9yIHJldHVybmVkIGZyb20gdGhlIGxhc3QgcmVxdWVzdFxuICogQHBhcmFtIHtudW1iZXJ9IHJldHJ5QXR0ZW1wdCB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSByZXF1ZXN0IGhhcyBhbHJlYWR5IGJlZW4gcmV0cmllZFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgdHVzIFVwbG9hZCBvcHRpb25zXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBzaG91bGRSZXRyeShlcnIsIHJldHJ5QXR0ZW1wdCwgb3B0aW9ucykge1xuICAvLyBXZSBvbmx5IGF0dGVtcHQgYSByZXRyeSBpZlxuICAvLyAtIHJldHJ5RGVsYXlzIG9wdGlvbiBpcyBzZXRcbiAgLy8gLSB3ZSBkaWRuJ3QgZXhjZWVkIHRoZSBtYXhpdW0gbnVtYmVyIG9mIHJldHJpZXMsIHlldCwgYW5kXG4gIC8vIC0gdGhpcyBlcnJvciB3YXMgY2F1c2VkIGJ5IGEgcmVxdWVzdCBvciBpdCdzIHJlc3BvbnNlIGFuZFxuICAvLyAtIHRoZSBlcnJvciBpcyBzZXJ2ZXIgZXJyb3IgKGkuZS4gbm90IGEgc3RhdHVzIDR4eCBleGNlcHQgYSA0MDkgb3IgNDIzKSBvclxuICAvLyBhIG9uU2hvdWxkUmV0cnkgaXMgc3BlY2lmaWVkIGFuZCByZXR1cm5zIHRydWVcbiAgLy8gLSB0aGUgYnJvd3NlciBkb2VzIG5vdCBpbmRpY2F0ZSB0aGF0IHdlIGFyZSBvZmZsaW5lXG4gIGlmIChvcHRpb25zLnJldHJ5RGVsYXlzID09IG51bGwgfHwgcmV0cnlBdHRlbXB0ID49IG9wdGlvbnMucmV0cnlEZWxheXMubGVuZ3RoIHx8IGVyci5vcmlnaW5hbFJlcXVlc3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm9uU2hvdWxkUmV0cnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5vblNob3VsZFJldHJ5KGVyciwgcmV0cnlBdHRlbXB0LCBvcHRpb25zKTtcbiAgfVxuXG4gIHZhciBzdGF0dXMgPSBlcnIub3JpZ2luYWxSZXNwb25zZSA/IGVyci5vcmlnaW5hbFJlc3BvbnNlLmdldFN0YXR1cygpIDogMDtcbiAgcmV0dXJuICghaW5TdGF0dXNDYXRlZ29yeShzdGF0dXMsIDQwMCkgfHwgc3RhdHVzID09PSA0MDkgfHwgc3RhdHVzID09PSA0MjMpICYmIGlzT25saW5lKCk7XG59XG4vKipcbiAqIFJlc29sdmUgYSByZWxhdGl2ZSBsaW5rIGdpdmVuIHRoZSBvcmlnaW4gYXMgc291cmNlLiBGb3IgZXhhbXBsZSxcbiAqIGlmIGEgSFRUUCByZXF1ZXN0IHRvIGh0dHA6Ly9leGFtcGxlLmNvbS9maWxlcy8gcmV0dXJucyBhIExvY2F0aW9uXG4gKiBoZWFkZXIgd2l0aCB0aGUgdmFsdWUgL3VwbG9hZC9hYmMsIHRoZSByZXNvbHZlZCBVUkwgd2lsbCBiZTpcbiAqIGh0dHA6Ly9leGFtcGxlLmNvbS91cGxvYWQvYWJjXG4gKi9cblxuXG5mdW5jdGlvbiByZXNvbHZlVXJsKG9yaWdpbiwgbGluaykge1xuICByZXR1cm4gbmV3IF91cmxQYXJzZS5kZWZhdWx0KGxpbmssIG9yaWdpbikudG9TdHJpbmcoKTtcbn1cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBzdGFydCBhbmQgZW5kIHBvc2l0aW9ucyBmb3IgdGhlIHBhcnRzIGlmIGFuIHVwbG9hZFxuICogaXMgc3BsaXQgaW50byBtdWx0aXBsZSBwYXJhbGxlbCByZXF1ZXN0cy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxTaXplIFRoZSBieXRlIHNpemUgb2YgdGhlIHVwbG9hZCwgd2hpY2ggd2lsbCBiZSBzcGxpdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJ0Q291bnQgVGhlIG51bWJlciBpbiBob3cgbWFueSBwYXJ0cyB0aGUgdXBsb2FkIHdpbGwgYmUgc3BsaXQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwcmV2aW91c1VybHMgVGhlIHVwbG9hZCBVUkxzIGZvciBwcmV2aW91cyBwYXJ0cy5cbiAqIEByZXR1cm4ge29iamVjdFtdfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBzcGxpdFNpemVJbnRvUGFydHModG90YWxTaXplLCBwYXJ0Q291bnQsIHByZXZpb3VzVXJscykge1xuICB2YXIgcGFydFNpemUgPSBNYXRoLmZsb29yKHRvdGFsU2l6ZSAvIHBhcnRDb3VudCk7XG4gIHZhciBwYXJ0cyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydENvdW50OyBpKyspIHtcbiAgICBwYXJ0cy5wdXNoKHtcbiAgICAgIHN0YXJ0OiBwYXJ0U2l6ZSAqIGksXG4gICAgICBlbmQ6IHBhcnRTaXplICogKGkgKyAxKVxuICAgIH0pO1xuICB9XG5cbiAgcGFydHNbcGFydENvdW50IC0gMV0uZW5kID0gdG90YWxTaXplOyAvLyBBdHRhY2ggVVJMcyBmcm9tIHByZXZpb3VzIHVwbG9hZHMsIGlmIGF2YWlsYWJsZS5cblxuICBpZiAocHJldmlvdXNVcmxzKSB7XG4gICAgcGFydHMuZm9yRWFjaChmdW5jdGlvbiAocGFydCwgaW5kZXgpIHtcbiAgICAgIHBhcnQudXBsb2FkVXJsID0gcHJldmlvdXNVcmxzW2luZGV4XSB8fCBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG5CYXNlVXBsb2FkLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG52YXIgX2RlZmF1bHQgPSBCYXNlVXBsb2FkO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB1dWlkO1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgVVVJRCB2NCBiYXNlZCBvbiByYW5kb20gbnVtYmVycy4gV2UgaW50ZW50aW9hbmxseSB1c2UgdGhlIGxlc3NcbiAqIHNlY3VyZSBNYXRoLnJhbmRvbSBmdW5jdGlvbiBoZXJlIHNpbmNlIHRoZSBtb3JlIHNlY3VyZSBjcnlwdG8uZ2V0UmFuZG9tTnVtYmVyc1xuICogaXMgbm90IGF2YWlsYWJsZSBvbiBhbGwgcGxhdGZvcm1zLlxuICogVGhpcyBpcyBub3QgYSBwcm9ibGVtIGZvciB1cyBzaW5jZSB3ZSB1c2UgdGhlIFVVSUQgb25seSBmb3IgZ2VuZXJhdGluZyBhXG4gKiByZXF1ZXN0IElELCBzbyB3ZSBjYW4gY29ycmVsYXRlIHNlcnZlciBsb2dzIHRvIGNsaWVudCBlcnJvcnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyB0YWtlbiBmcm9tIGZvbGxvd2luZyBzaXRlOlxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2NyZWF0ZS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGdlbmVyYXRlIFVVSURcbiAqL1xuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDAsXG4gICAgICAgIHYgPSBjID09ICd4JyA/IHIgOiByICYgMHgzIHwgMHg4O1xuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVxdWlyZWQgPSByZXF1aXJlKCdyZXF1aXJlcy1wb3J0JylcbiAgLCBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5naWZ5JylcbiAgLCBzbGFzaGVzID0gL15bQS1aYS16XVtBLVphLXowLTkrLS5dKjpcXC9cXC8vXG4gICwgcHJvdG9jb2xyZSA9IC9eKFthLXpdW2EtejAtOS4rLV0qOik/KFxcL1xcLyk/KFtcXFxcL10rKT8oW1xcU1xcc10qKS9pXG4gICwgd2luZG93c0RyaXZlTGV0dGVyID0gL15bYS16QS1aXTovXG4gICwgd2hpdGVzcGFjZSA9ICdbXFxcXHgwOVxcXFx4MEFcXFxceDBCXFxcXHgwQ1xcXFx4MERcXFxceDIwXFxcXHhBMFxcXFx1MTY4MFxcXFx1MTgwRVxcXFx1MjAwMFxcXFx1MjAwMVxcXFx1MjAwMlxcXFx1MjAwM1xcXFx1MjAwNFxcXFx1MjAwNVxcXFx1MjAwNlxcXFx1MjAwN1xcXFx1MjAwOFxcXFx1MjAwOVxcXFx1MjAwQVxcXFx1MjAyRlxcXFx1MjA1RlxcXFx1MzAwMFxcXFx1MjAyOFxcXFx1MjAyOVxcXFx1RkVGRl0nXG4gICwgbGVmdCA9IG5ldyBSZWdFeHAoJ14nKyB3aGl0ZXNwYWNlICsnKycpO1xuXG4vKipcbiAqIFRyaW0gYSBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBTdHJpbmcgdG8gdHJpbS5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdHJpbUxlZnQoc3RyKSB7XG4gIHJldHVybiAoc3RyID8gc3RyIDogJycpLnRvU3RyaW5nKCkucmVwbGFjZShsZWZ0LCAnJyk7XG59XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSBwYXJzZSBydWxlcyBmb3IgdGhlIFVSTCBwYXJzZXIsIGl0IGluZm9ybXMgdGhlIHBhcnNlclxuICogYWJvdXQ6XG4gKlxuICogMC4gVGhlIGNoYXIgaXQgTmVlZHMgdG8gcGFyc2UsIGlmIGl0J3MgYSBzdHJpbmcgaXQgc2hvdWxkIGJlIGRvbmUgdXNpbmdcbiAqICAgIGluZGV4T2YsIFJlZ0V4cCB1c2luZyBleGVjIGFuZCBOYU4gbWVhbnMgc2V0IGFzIGN1cnJlbnQgdmFsdWUuXG4gKiAxLiBUaGUgcHJvcGVydHkgd2Ugc2hvdWxkIHNldCB3aGVuIHBhcnNpbmcgdGhpcyB2YWx1ZS5cbiAqIDIuIEluZGljYXRpb24gaWYgaXQncyBiYWNrd2FyZHMgb3IgZm9yd2FyZCBwYXJzaW5nLCB3aGVuIHNldCBhcyBudW1iZXIgaXQnc1xuICogICAgdGhlIHZhbHVlIG9mIGV4dHJhIGNoYXJzIHRoYXQgc2hvdWxkIGJlIHNwbGl0IG9mZi5cbiAqIDMuIEluaGVyaXQgZnJvbSBsb2NhdGlvbiBpZiBub24gZXhpc3RpbmcgaW4gdGhlIHBhcnNlci5cbiAqIDQuIGB0b0xvd2VyQ2FzZWAgdGhlIHJlc3VsdGluZyB2YWx1ZS5cbiAqL1xudmFyIHJ1bGVzID0gW1xuICBbJyMnLCAnaGFzaCddLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgWyc/JywgJ3F1ZXJ5J10sICAgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIGZ1bmN0aW9uIHNhbml0aXplKGFkZHJlc3MsIHVybCkgeyAgICAgLy8gU2FuaXRpemUgd2hhdCBpcyBsZWZ0IG9mIHRoZSBhZGRyZXNzXG4gICAgcmV0dXJuIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpID8gYWRkcmVzcy5yZXBsYWNlKC9cXFxcL2csICcvJykgOiBhZGRyZXNzO1xuICB9LFxuICBbJy8nLCAncGF0aG5hbWUnXSwgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgWydAJywgJ2F1dGgnLCAxXSwgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGZyb250LlxuICBbTmFOLCAnaG9zdCcsIHVuZGVmaW5lZCwgMSwgMV0sICAgICAgIC8vIFNldCBsZWZ0IG92ZXIgdmFsdWUuXG4gIFsvOihcXGQrKSQvLCAncG9ydCcsIHVuZGVmaW5lZCwgMV0sICAgIC8vIFJlZ0V4cCB0aGUgYmFjay5cbiAgW05hTiwgJ2hvc3RuYW1lJywgdW5kZWZpbmVkLCAxLCAxXSAgICAvLyBTZXQgbGVmdCBvdmVyLlxuXTtcblxuLyoqXG4gKiBUaGVzZSBwcm9wZXJ0aWVzIHNob3VsZCBub3QgYmUgY29waWVkIG9yIGluaGVyaXRlZCBmcm9tLiBUaGlzIGlzIG9ubHkgbmVlZGVkXG4gKiBmb3IgYWxsIG5vbiBibG9iIFVSTCdzIGFzIGEgYmxvYiBVUkwgZG9lcyBub3QgaW5jbHVkZSBhIGhhc2gsIG9ubHkgdGhlXG4gKiBvcmlnaW4uXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBpZ25vcmUgPSB7IGhhc2g6IDEsIHF1ZXJ5OiAxIH07XG5cbi8qKlxuICogVGhlIGxvY2F0aW9uIG9iamVjdCBkaWZmZXJzIHdoZW4geW91ciBjb2RlIGlzIGxvYWRlZCB0aHJvdWdoIGEgbm9ybWFsIHBhZ2UsXG4gKiBXb3JrZXIgb3IgdGhyb3VnaCBhIHdvcmtlciB1c2luZyBhIGJsb2IuIEFuZCB3aXRoIHRoZSBibG9iYmxlIGJlZ2lucyB0aGVcbiAqIHRyb3VibGUgYXMgdGhlIGxvY2F0aW9uIG9iamVjdCB3aWxsIGNvbnRhaW4gdGhlIFVSTCBvZiB0aGUgYmxvYiwgbm90IHRoZVxuICogbG9jYXRpb24gb2YgdGhlIHBhZ2Ugd2hlcmUgb3VyIGNvZGUgaXMgbG9hZGVkIGluLiBUaGUgYWN0dWFsIG9yaWdpbiBpc1xuICogZW5jb2RlZCBpbiB0aGUgYHBhdGhuYW1lYCBzbyB3ZSBjYW4gdGhhbmtmdWxseSBnZW5lcmF0ZSBhIGdvb2QgXCJkZWZhdWx0XCJcbiAqIGxvY2F0aW9uIGZyb20gaXQgc28gd2UgY2FuIGdlbmVyYXRlIHByb3BlciByZWxhdGl2ZSBVUkwncyBhZ2Fpbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGxvYyBPcHRpb25hbCBkZWZhdWx0IGxvY2F0aW9uIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IGxvbGNhdGlvbiBvYmplY3QuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIGxvbGNhdGlvbihsb2MpIHtcbiAgdmFyIGdsb2JhbFZhcjtcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IHdpbmRvdztcbiAgZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IGdsb2JhbDtcbiAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSBnbG9iYWxWYXIgPSBzZWxmO1xuICBlbHNlIGdsb2JhbFZhciA9IHt9O1xuXG4gIHZhciBsb2NhdGlvbiA9IGdsb2JhbFZhci5sb2NhdGlvbiB8fCB7fTtcbiAgbG9jID0gbG9jIHx8IGxvY2F0aW9uO1xuXG4gIHZhciBmaW5hbGRlc3RpbmF0aW9uID0ge31cbiAgICAsIHR5cGUgPSB0eXBlb2YgbG9jXG4gICAgLCBrZXk7XG5cbiAgaWYgKCdibG9iOicgPT09IGxvYy5wcm90b2NvbCkge1xuICAgIGZpbmFsZGVzdGluYXRpb24gPSBuZXcgVXJsKHVuZXNjYXBlKGxvYy5wYXRobmFtZSksIHt9KTtcbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PT0gdHlwZSkge1xuICAgIGZpbmFsZGVzdGluYXRpb24gPSBuZXcgVXJsKGxvYywge30pO1xuICAgIGZvciAoa2V5IGluIGlnbm9yZSkgZGVsZXRlIGZpbmFsZGVzdGluYXRpb25ba2V5XTtcbiAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PT0gdHlwZSkge1xuICAgIGZvciAoa2V5IGluIGxvYykge1xuICAgICAgaWYgKGtleSBpbiBpZ25vcmUpIGNvbnRpbnVlO1xuICAgICAgZmluYWxkZXN0aW5hdGlvbltrZXldID0gbG9jW2tleV07XG4gICAgfVxuXG4gICAgaWYgKGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uLnNsYXNoZXMgPSBzbGFzaGVzLnRlc3QobG9jLmhyZWYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmaW5hbGRlc3RpbmF0aW9uO1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYSBwcm90b2NvbCBzY2hlbWUgaXMgc3BlY2lhbC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gVGhlIHByb3RvY29sIHNjaGVtZSBvZiB0aGUgVVJMXG4gKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIHByb3RvY29sIHNjaGVtZSBpcyBzcGVjaWFsLCBlbHNlIGBmYWxzZWBcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGlzU3BlY2lhbChzY2hlbWUpIHtcbiAgcmV0dXJuIChcbiAgICBzY2hlbWUgPT09ICdmaWxlOicgfHxcbiAgICBzY2hlbWUgPT09ICdmdHA6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ2h0dHA6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ2h0dHBzOicgfHxcbiAgICBzY2hlbWUgPT09ICd3czonIHx8XG4gICAgc2NoZW1lID09PSAnd3NzOidcbiAgKTtcbn1cblxuLyoqXG4gKiBAdHlwZWRlZiBQcm90b2NvbEV4dHJhY3RcbiAqIEB0eXBlIE9iamVjdFxuICogQHByb3BlcnR5IHtTdHJpbmd9IHByb3RvY29sIFByb3RvY29sIG1hdGNoZWQgaW4gdGhlIFVSTCwgaW4gbG93ZXJjYXNlLlxuICogQHByb3BlcnR5IHtCb29sZWFufSBzbGFzaGVzIGB0cnVlYCBpZiBwcm90b2NvbCBpcyBmb2xsb3dlZCBieSBcIi8vXCIsIGVsc2UgYGZhbHNlYC5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSByZXN0IFJlc3Qgb2YgdGhlIFVSTCB0aGF0IGlzIG5vdCBwYXJ0IG9mIHRoZSBwcm90b2NvbC5cbiAqL1xuXG4vKipcbiAqIEV4dHJhY3QgcHJvdG9jb2wgaW5mb3JtYXRpb24gZnJvbSBhIFVSTCB3aXRoL3dpdGhvdXQgZG91YmxlIHNsYXNoIChcIi8vXCIpLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIFVSTCB3ZSB3YW50IHRvIGV4dHJhY3QgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBsb2NhdGlvblxuICogQHJldHVybiB7UHJvdG9jb2xFeHRyYWN0fSBFeHRyYWN0ZWQgaW5mb3JtYXRpb24uXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBleHRyYWN0UHJvdG9jb2woYWRkcmVzcywgbG9jYXRpb24pIHtcbiAgYWRkcmVzcyA9IHRyaW1MZWZ0KGFkZHJlc3MpO1xuICBsb2NhdGlvbiA9IGxvY2F0aW9uIHx8IHt9O1xuXG4gIHZhciBtYXRjaCA9IHByb3RvY29scmUuZXhlYyhhZGRyZXNzKTtcbiAgdmFyIHByb3RvY29sID0gbWF0Y2hbMV0gPyBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpIDogJyc7XG4gIHZhciBmb3J3YXJkU2xhc2hlcyA9ICEhbWF0Y2hbMl07XG4gIHZhciBvdGhlclNsYXNoZXMgPSAhIW1hdGNoWzNdO1xuICB2YXIgc2xhc2hlc0NvdW50ID0gMDtcbiAgdmFyIHJlc3Q7XG5cbiAgaWYgKGZvcndhcmRTbGFzaGVzKSB7XG4gICAgaWYgKG90aGVyU2xhc2hlcykge1xuICAgICAgcmVzdCA9IG1hdGNoWzJdICsgbWF0Y2hbM10gKyBtYXRjaFs0XTtcbiAgICAgIHNsYXNoZXNDb3VudCA9IG1hdGNoWzJdLmxlbmd0aCArIG1hdGNoWzNdLmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdCA9IG1hdGNoWzJdICsgbWF0Y2hbNF07XG4gICAgICBzbGFzaGVzQ291bnQgPSBtYXRjaFsyXS5sZW5ndGg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChvdGhlclNsYXNoZXMpIHtcbiAgICAgIHJlc3QgPSBtYXRjaFszXSArIG1hdGNoWzRdO1xuICAgICAgc2xhc2hlc0NvdW50ID0gbWF0Y2hbM10ubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0ID0gbWF0Y2hbNF1cbiAgICB9XG4gIH1cblxuICBpZiAocHJvdG9jb2wgPT09ICdmaWxlOicpIHtcbiAgICBpZiAoc2xhc2hlc0NvdW50ID49IDIpIHtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKDIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc1NwZWNpYWwocHJvdG9jb2wpKSB7XG4gICAgcmVzdCA9IG1hdGNoWzRdO1xuICB9IGVsc2UgaWYgKHByb3RvY29sKSB7XG4gICAgaWYgKGZvcndhcmRTbGFzaGVzKSB7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZSgyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoc2xhc2hlc0NvdW50ID49IDIgJiYgaXNTcGVjaWFsKGxvY2F0aW9uLnByb3RvY29sKSkge1xuICAgIHJlc3QgPSBtYXRjaFs0XTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgIHNsYXNoZXM6IGZvcndhcmRTbGFzaGVzIHx8IGlzU3BlY2lhbChwcm90b2NvbCksXG4gICAgc2xhc2hlc0NvdW50OiBzbGFzaGVzQ291bnQsXG4gICAgcmVzdDogcmVzdFxuICB9O1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSByZWxhdGl2ZSBVUkwgcGF0aG5hbWUgYWdhaW5zdCBhIGJhc2UgVVJMIHBhdGhuYW1lLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWxhdGl2ZSBQYXRobmFtZSBvZiB0aGUgcmVsYXRpdmUgVVJMLlxuICogQHBhcmFtIHtTdHJpbmd9IGJhc2UgUGF0aG5hbWUgb2YgdGhlIGJhc2UgVVJMLlxuICogQHJldHVybiB7U3RyaW5nfSBSZXNvbHZlZCBwYXRobmFtZS5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmUocmVsYXRpdmUsIGJhc2UpIHtcbiAgaWYgKHJlbGF0aXZlID09PSAnJykgcmV0dXJuIGJhc2U7XG5cbiAgdmFyIHBhdGggPSAoYmFzZSB8fCAnLycpLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmNvbmNhdChyZWxhdGl2ZS5zcGxpdCgnLycpKVxuICAgICwgaSA9IHBhdGgubGVuZ3RoXG4gICAgLCBsYXN0ID0gcGF0aFtpIC0gMV1cbiAgICAsIHVuc2hpZnQgPSBmYWxzZVxuICAgICwgdXAgPSAwO1xuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAocGF0aFtpXSA9PT0gJy4nKSB7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKHBhdGhbaV0gPT09ICcuLicpIHtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBpZiAoaSA9PT0gMCkgdW5zaGlmdCA9IHRydWU7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgaWYgKHVuc2hpZnQpIHBhdGgudW5zaGlmdCgnJyk7XG4gIGlmIChsYXN0ID09PSAnLicgfHwgbGFzdCA9PT0gJy4uJykgcGF0aC5wdXNoKCcnKTtcblxuICByZXR1cm4gcGF0aC5qb2luKCcvJyk7XG59XG5cbi8qKlxuICogVGhlIGFjdHVhbCBVUkwgaW5zdGFuY2UuIEluc3RlYWQgb2YgcmV0dXJuaW5nIGFuIG9iamVjdCB3ZSd2ZSBvcHRlZC1pbiB0b1xuICogY3JlYXRlIGFuIGFjdHVhbCBjb25zdHJ1Y3RvciBhcyBpdCdzIG11Y2ggbW9yZSBtZW1vcnkgZWZmaWNpZW50IGFuZFxuICogZmFzdGVyIGFuZCBpdCBwbGVhc2VzIG15IE9DRC5cbiAqXG4gKiBJdCBpcyB3b3J0aCBub3RpbmcgdGhhdCB3ZSBzaG91bGQgbm90IHVzZSBgVVJMYCBhcyBjbGFzcyBuYW1lIHRvIHByZXZlbnRcbiAqIGNsYXNoZXMgd2l0aCB0aGUgZ2xvYmFsIFVSTCBpbnN0YW5jZSB0aGF0IGdvdCBpbnRyb2R1Y2VkIGluIGJyb3dzZXJzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgVVJMIHdlIHdhbnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IFtsb2NhdGlvbl0gTG9jYXRpb24gZGVmYXVsdHMgZm9yIHJlbGF0aXZlIHBhdGhzLlxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBbcGFyc2VyXSBQYXJzZXIgZm9yIHRoZSBxdWVyeSBzdHJpbmcuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBVcmwoYWRkcmVzcywgbG9jYXRpb24sIHBhcnNlcikge1xuICBhZGRyZXNzID0gdHJpbUxlZnQoYWRkcmVzcyk7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVybCkpIHtcbiAgICByZXR1cm4gbmV3IFVybChhZGRyZXNzLCBsb2NhdGlvbiwgcGFyc2VyKTtcbiAgfVxuXG4gIHZhciByZWxhdGl2ZSwgZXh0cmFjdGVkLCBwYXJzZSwgaW5zdHJ1Y3Rpb24sIGluZGV4LCBrZXlcbiAgICAsIGluc3RydWN0aW9ucyA9IHJ1bGVzLnNsaWNlKClcbiAgICAsIHR5cGUgPSB0eXBlb2YgbG9jYXRpb25cbiAgICAsIHVybCA9IHRoaXNcbiAgICAsIGkgPSAwO1xuXG4gIC8vXG4gIC8vIFRoZSBmb2xsb3dpbmcgaWYgc3RhdGVtZW50cyBhbGxvd3MgdGhpcyBtb2R1bGUgdHdvIGhhdmUgY29tcGF0aWJpbGl0eSB3aXRoXG4gIC8vIDIgZGlmZmVyZW50IEFQSTpcbiAgLy9cbiAgLy8gMS4gTm9kZS5qcydzIGB1cmwucGFyc2VgIGFwaSB3aGljaCBhY2NlcHRzIGEgVVJMLCBib29sZWFuIGFzIGFyZ3VtZW50c1xuICAvLyAgICB3aGVyZSB0aGUgYm9vbGVhbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcXVlcnkgc3RyaW5nIHNob3VsZCBhbHNvIGJlIHBhcnNlZC5cbiAgLy9cbiAgLy8gMi4gVGhlIGBVUkxgIGludGVyZmFjZSBvZiB0aGUgYnJvd3NlciB3aGljaCBhY2NlcHRzIGEgVVJMLCBvYmplY3QgYXNcbiAgLy8gICAgYXJndW1lbnRzLiBUaGUgc3VwcGxpZWQgb2JqZWN0IHdpbGwgYmUgdXNlZCBhcyBkZWZhdWx0IHZhbHVlcyAvIGZhbGwtYmFja1xuICAvLyAgICBmb3IgcmVsYXRpdmUgcGF0aHMuXG4gIC8vXG4gIGlmICgnb2JqZWN0JyAhPT0gdHlwZSAmJiAnc3RyaW5nJyAhPT0gdHlwZSkge1xuICAgIHBhcnNlciA9IGxvY2F0aW9uO1xuICAgIGxvY2F0aW9uID0gbnVsbDtcbiAgfVxuXG4gIGlmIChwYXJzZXIgJiYgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHBhcnNlcikgcGFyc2VyID0gcXMucGFyc2U7XG5cbiAgbG9jYXRpb24gPSBsb2xjYXRpb24obG9jYXRpb24pO1xuXG4gIC8vXG4gIC8vIEV4dHJhY3QgcHJvdG9jb2wgaW5mb3JtYXRpb24gYmVmb3JlIHJ1bm5pbmcgdGhlIGluc3RydWN0aW9ucy5cbiAgLy9cbiAgZXh0cmFjdGVkID0gZXh0cmFjdFByb3RvY29sKGFkZHJlc3MgfHwgJycsIGxvY2F0aW9uKTtcbiAgcmVsYXRpdmUgPSAhZXh0cmFjdGVkLnByb3RvY29sICYmICFleHRyYWN0ZWQuc2xhc2hlcztcbiAgdXJsLnNsYXNoZXMgPSBleHRyYWN0ZWQuc2xhc2hlcyB8fCByZWxhdGl2ZSAmJiBsb2NhdGlvbi5zbGFzaGVzO1xuICB1cmwucHJvdG9jb2wgPSBleHRyYWN0ZWQucHJvdG9jb2wgfHwgbG9jYXRpb24ucHJvdG9jb2wgfHwgJyc7XG4gIGFkZHJlc3MgPSBleHRyYWN0ZWQucmVzdDtcblxuICAvL1xuICAvLyBXaGVuIHRoZSBhdXRob3JpdHkgY29tcG9uZW50IGlzIGFic2VudCB0aGUgVVJMIHN0YXJ0cyB3aXRoIGEgcGF0aFxuICAvLyBjb21wb25lbnQuXG4gIC8vXG4gIGlmIChcbiAgICBleHRyYWN0ZWQucHJvdG9jb2wgPT09ICdmaWxlOicgJiYgKFxuICAgICAgZXh0cmFjdGVkLnNsYXNoZXNDb3VudCAhPT0gMiB8fCB3aW5kb3dzRHJpdmVMZXR0ZXIudGVzdChhZGRyZXNzKSkgfHxcbiAgICAoIWV4dHJhY3RlZC5zbGFzaGVzICYmXG4gICAgICAoZXh0cmFjdGVkLnByb3RvY29sIHx8XG4gICAgICAgIGV4dHJhY3RlZC5zbGFzaGVzQ291bnQgPCAyIHx8XG4gICAgICAgICFpc1NwZWNpYWwodXJsLnByb3RvY29sKSkpXG4gICkge1xuICAgIGluc3RydWN0aW9uc1szXSA9IFsvKC4qKS8sICdwYXRobmFtZSddO1xuICB9XG5cbiAgZm9yICg7IGkgPCBpbnN0cnVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBpbnN0cnVjdGlvbiA9IGluc3RydWN0aW9uc1tpXTtcblxuICAgIGlmICh0eXBlb2YgaW5zdHJ1Y3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFkZHJlc3MgPSBpbnN0cnVjdGlvbihhZGRyZXNzLCB1cmwpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcGFyc2UgPSBpbnN0cnVjdGlvblswXTtcbiAgICBrZXkgPSBpbnN0cnVjdGlvblsxXTtcblxuICAgIGlmIChwYXJzZSAhPT0gcGFyc2UpIHtcbiAgICAgIHVybFtrZXldID0gYWRkcmVzcztcbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcGFyc2UpIHtcbiAgICAgIGlmICh+KGluZGV4ID0gYWRkcmVzcy5pbmRleE9mKHBhcnNlKSkpIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgaW5zdHJ1Y3Rpb25bMl0pIHtcbiAgICAgICAgICB1cmxba2V5XSA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKGluZGV4ICsgaW5zdHJ1Y3Rpb25bMl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybFtrZXldID0gYWRkcmVzcy5zbGljZShpbmRleCk7XG4gICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgoaW5kZXggPSBwYXJzZS5leGVjKGFkZHJlc3MpKSkge1xuICAgICAgdXJsW2tleV0gPSBpbmRleFsxXTtcbiAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4LmluZGV4KTtcbiAgICB9XG5cbiAgICB1cmxba2V5XSA9IHVybFtrZXldIHx8IChcbiAgICAgIHJlbGF0aXZlICYmIGluc3RydWN0aW9uWzNdID8gbG9jYXRpb25ba2V5XSB8fCAnJyA6ICcnXG4gICAgKTtcblxuICAgIC8vXG4gICAgLy8gSG9zdG5hbWUsIGhvc3QgYW5kIHByb3RvY29sIHNob3VsZCBiZSBsb3dlcmNhc2VkIHNvIHRoZXkgY2FuIGJlIHVzZWQgdG9cbiAgICAvLyBjcmVhdGUgYSBwcm9wZXIgYG9yaWdpbmAuXG4gICAgLy9cbiAgICBpZiAoaW5zdHJ1Y3Rpb25bNF0pIHVybFtrZXldID0gdXJsW2tleV0udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8vXG4gIC8vIEFsc28gcGFyc2UgdGhlIHN1cHBsaWVkIHF1ZXJ5IHN0cmluZyBpbiB0byBhbiBvYmplY3QuIElmIHdlJ3JlIHN1cHBsaWVkXG4gIC8vIHdpdGggYSBjdXN0b20gcGFyc2VyIGFzIGZ1bmN0aW9uIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIGRlZmF1bHQgYnVpbGQtaW5cbiAgLy8gcGFyc2VyLlxuICAvL1xuICBpZiAocGFyc2VyKSB1cmwucXVlcnkgPSBwYXJzZXIodXJsLnF1ZXJ5KTtcblxuICAvL1xuICAvLyBJZiB0aGUgVVJMIGlzIHJlbGF0aXZlLCByZXNvbHZlIHRoZSBwYXRobmFtZSBhZ2FpbnN0IHRoZSBiYXNlIFVSTC5cbiAgLy9cbiAgaWYgKFxuICAgICAgcmVsYXRpdmVcbiAgICAmJiBsb2NhdGlvbi5zbGFzaGVzXG4gICAgJiYgdXJsLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nXG4gICAgJiYgKHVybC5wYXRobmFtZSAhPT0gJycgfHwgbG9jYXRpb24ucGF0aG5hbWUgIT09ICcnKVxuICApIHtcbiAgICB1cmwucGF0aG5hbWUgPSByZXNvbHZlKHVybC5wYXRobmFtZSwgbG9jYXRpb24ucGF0aG5hbWUpO1xuICB9XG5cbiAgLy9cbiAgLy8gRGVmYXVsdCB0byBhIC8gZm9yIHBhdGhuYW1lIGlmIG5vbmUgZXhpc3RzLiBUaGlzIG5vcm1hbGl6ZXMgdGhlIFVSTFxuICAvLyB0byBhbHdheXMgaGF2ZSBhIC9cbiAgLy9cbiAgaWYgKHVybC5wYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJyAmJiBpc1NwZWNpYWwodXJsLnByb3RvY29sKSkge1xuICAgIHVybC5wYXRobmFtZSA9ICcvJyArIHVybC5wYXRobmFtZTtcbiAgfVxuXG4gIC8vXG4gIC8vIFdlIHNob3VsZCBub3QgYWRkIHBvcnQgbnVtYmVycyBpZiB0aGV5IGFyZSBhbHJlYWR5IHRoZSBkZWZhdWx0IHBvcnQgbnVtYmVyXG4gIC8vIGZvciBhIGdpdmVuIHByb3RvY29sLiBBcyB0aGUgaG9zdCBhbHNvIGNvbnRhaW5zIHRoZSBwb3J0IG51bWJlciB3ZSdyZSBnb2luZ1xuICAvLyBvdmVycmlkZSBpdCB3aXRoIHRoZSBob3N0bmFtZSB3aGljaCBjb250YWlucyBubyBwb3J0IG51bWJlci5cbiAgLy9cbiAgaWYgKCFyZXF1aXJlZCh1cmwucG9ydCwgdXJsLnByb3RvY29sKSkge1xuICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgIHVybC5wb3J0ID0gJyc7XG4gIH1cblxuICAvL1xuICAvLyBQYXJzZSBkb3duIHRoZSBgYXV0aGAgZm9yIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQuXG4gIC8vXG4gIHVybC51c2VybmFtZSA9IHVybC5wYXNzd29yZCA9ICcnO1xuICBpZiAodXJsLmF1dGgpIHtcbiAgICBpbnN0cnVjdGlvbiA9IHVybC5hdXRoLnNwbGl0KCc6Jyk7XG4gICAgdXJsLnVzZXJuYW1lID0gaW5zdHJ1Y3Rpb25bMF0gfHwgJyc7XG4gICAgdXJsLnBhc3N3b3JkID0gaW5zdHJ1Y3Rpb25bMV0gfHwgJyc7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICE9PSAnZmlsZTonICYmIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpICYmIHVybC5ob3N0XG4gICAgPyB1cmwucHJvdG9jb2wgKycvLycrIHVybC5ob3N0XG4gICAgOiAnbnVsbCc7XG5cbiAgLy9cbiAgLy8gVGhlIGhyZWYgaXMganVzdCB0aGUgY29tcGlsZWQgcmVzdWx0LlxuICAvL1xuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgY29udmVuaWVuY2UgbWV0aG9kIGZvciBjaGFuZ2luZyBwcm9wZXJ0aWVzIGluIHRoZSBVUkwgaW5zdGFuY2UgdG9cbiAqIGluc3VyZSB0aGF0IHRoZXkgYWxsIHByb3BhZ2F0ZSBjb3JyZWN0bHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhcnQgICAgICAgICAgUHJvcGVydHkgd2UgbmVlZCB0byBhZGp1c3QuXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAgICAgICAgICBUaGUgbmV3bHkgYXNzaWduZWQgdmFsdWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IGZuICBXaGVuIHNldHRpbmcgdGhlIHF1ZXJ5LCBpdCB3aWxsIGJlIHRoZSBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZCB0byBwYXJzZSB0aGUgcXVlcnkuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaGVuIHNldHRpbmcgdGhlIHByb3RvY29sLCBkb3VibGUgc2xhc2ggd2lsbCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZCBmcm9tIHRoZSBmaW5hbCB1cmwgaWYgaXQgaXMgdHJ1ZS5cbiAqIEByZXR1cm5zIHtVUkx9IFVSTCBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHNldChwYXJ0LCB2YWx1ZSwgZm4pIHtcbiAgdmFyIHVybCA9IHRoaXM7XG5cbiAgc3dpdGNoIChwYXJ0KSB7XG4gICAgY2FzZSAncXVlcnknOlxuICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHZhbHVlID0gKGZuIHx8IHFzLnBhcnNlKSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwb3J0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoIXJlcXVpcmVkKHZhbHVlLCB1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgICAgICB1cmxbcGFydF0gPSAnJztcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWUgKyc6JysgdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnaG9zdG5hbWUnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICh1cmwucG9ydCkgdmFsdWUgKz0gJzonKyB1cmwucG9ydDtcbiAgICAgIHVybC5ob3N0ID0gdmFsdWU7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3QnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICgvOlxcZCskLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KCc6Jyk7XG4gICAgICAgIHVybC5wb3J0ID0gdmFsdWUucG9wKCk7XG4gICAgICAgIHVybC5ob3N0bmFtZSA9IHZhbHVlLmpvaW4oJzonKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybC5ob3N0bmFtZSA9IHZhbHVlO1xuICAgICAgICB1cmwucG9ydCA9ICcnO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3Byb3RvY29sJzpcbiAgICAgIHVybC5wcm90b2NvbCA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICB1cmwuc2xhc2hlcyA9ICFmbjtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncGF0aG5hbWUnOlxuICAgIGNhc2UgJ2hhc2gnOlxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHZhciBjaGFyID0gcGFydCA9PT0gJ3BhdGhuYW1lJyA/ICcvJyA6ICcjJztcbiAgICAgICAgdXJsW3BhcnRdID0gdmFsdWUuY2hhckF0KDApICE9PSBjaGFyID8gY2hhciArIHZhbHVlIDogdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnMgPSBydWxlc1tpXTtcblxuICAgIGlmIChpbnNbNF0pIHVybFtpbnNbMV1dID0gdXJsW2luc1sxXV0udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHVybC5vcmlnaW4gPSB1cmwucHJvdG9jb2wgIT09ICdmaWxlOicgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgJiYgdXJsLmhvc3RcbiAgICA/IHVybC5wcm90b2NvbCArJy8vJysgdXJsLmhvc3RcbiAgICA6ICdudWxsJztcblxuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xuXG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBwcm9wZXJ0aWVzIGJhY2sgaW4gdG8gYSB2YWxpZCBhbmQgZnVsbCBVUkwgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZ2lmeSBPcHRpb25hbCBxdWVyeSBzdHJpbmdpZnkgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBDb21waWxlZCB2ZXJzaW9uIG9mIHRoZSBVUkwuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHN0cmluZ2lmeSkge1xuICBpZiAoIXN0cmluZ2lmeSB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3RyaW5naWZ5KSBzdHJpbmdpZnkgPSBxcy5zdHJpbmdpZnk7XG5cbiAgdmFyIHF1ZXJ5XG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBwcm90b2NvbCA9IHVybC5wcm90b2NvbDtcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuY2hhckF0KHByb3RvY29sLmxlbmd0aCAtIDEpICE9PSAnOicpIHByb3RvY29sICs9ICc6JztcblxuICB2YXIgcmVzdWx0ID0gcHJvdG9jb2wgKyAodXJsLnNsYXNoZXMgfHwgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgPyAnLy8nIDogJycpO1xuXG4gIGlmICh1cmwudXNlcm5hbWUpIHtcbiAgICByZXN1bHQgKz0gdXJsLnVzZXJuYW1lO1xuICAgIGlmICh1cmwucGFzc3dvcmQpIHJlc3VsdCArPSAnOicrIHVybC5wYXNzd29yZDtcbiAgICByZXN1bHQgKz0gJ0AnO1xuICB9XG5cbiAgcmVzdWx0ICs9IHVybC5ob3N0ICsgdXJsLnBhdGhuYW1lO1xuXG4gIHF1ZXJ5ID0gJ29iamVjdCcgPT09IHR5cGVvZiB1cmwucXVlcnkgPyBzdHJpbmdpZnkodXJsLnF1ZXJ5KSA6IHVybC5xdWVyeTtcbiAgaWYgKHF1ZXJ5KSByZXN1bHQgKz0gJz8nICE9PSBxdWVyeS5jaGFyQXQoMCkgPyAnPycrIHF1ZXJ5IDogcXVlcnk7XG5cbiAgaWYgKHVybC5oYXNoKSByZXN1bHQgKz0gdXJsLmhhc2g7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuVXJsLnByb3RvdHlwZSA9IHsgc2V0OiBzZXQsIHRvU3RyaW5nOiB0b1N0cmluZyB9O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBVUkwgcGFyc2VyIGFuZCBzb21lIGFkZGl0aW9uYWwgcHJvcGVydGllcyB0aGF0IG1pZ2h0IGJlIHVzZWZ1bCBmb3Jcbi8vIG90aGVycyBvciB0ZXN0aW5nLlxuLy9cblVybC5leHRyYWN0UHJvdG9jb2wgPSBleHRyYWN0UHJvdG9jb2w7XG5VcmwubG9jYXRpb24gPSBsb2xjYXRpb247XG5VcmwudHJpbUxlZnQgPSB0cmltTGVmdDtcblVybC5xcyA9IHFzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVybDtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBBdXRoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcignQXV0aG9yaXphdGlvbiByZXF1aXJlZCcpXG4gICAgdGhpcy5uYW1lID0gJ0F1dGhFcnJvcidcbiAgICB0aGlzLmlzQXV0aEVycm9yID0gdHJ1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aEVycm9yXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5jb25zdCB0b2tlblN0b3JhZ2UgPSByZXF1aXJlKCcuL3Rva2VuU3RvcmFnZScpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICAgIHRoaXMudG9rZW5LZXkgPSBgY29tcGFuaW9uLSR7dGhpcy5wbHVnaW5JZH0tYXV0aC10b2tlbmBcbiAgICB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgPSB0aGlzLm9wdHMuY29tcGFuaW9uS2V5c1BhcmFtc1xuICAgIHRoaXMucHJlQXV0aFRva2VuID0gbnVsbFxuICB9XG5cbiAgaGVhZGVycyAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtzdXBlci5oZWFkZXJzKCksIHRoaXMuZ2V0QXV0aFRva2VuKCldKVxuICAgICAgLnRoZW4oKFtoZWFkZXJzLCB0b2tlbl0pID0+IHtcbiAgICAgICAgY29uc3QgYXV0aEhlYWRlcnMgPSB7fVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICBhdXRoSGVhZGVyc1sndXBweS1hdXRoLXRva2VuJ10gPSB0b2tlblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcykge1xuICAgICAgICAgIGF1dGhIZWFkZXJzWyd1cHB5LWNyZWRlbnRpYWxzLXBhcmFtcyddID0gYnRvYShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgcGFyYW1zOiB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgfSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgLi4uaGVhZGVycywgLi4uYXV0aEhlYWRlcnMgfVxuICAgICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIHJlc3BvbnNlID0gc3VwZXIub25SZWNlaXZlUmVzcG9uc2UocmVzcG9uc2UpXG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKVxuICAgIGNvbnN0IG9sZEF1dGhlbnRpY2F0ZWQgPSBwbHVnaW4uZ2V0UGx1Z2luU3RhdGUoKS5hdXRoZW50aWNhdGVkXG4gICAgY29uc3QgYXV0aGVudGljYXRlZCA9IG9sZEF1dGhlbnRpY2F0ZWQgPyByZXNwb25zZS5zdGF0dXMgIT09IDQwMSA6IHJlc3BvbnNlLnN0YXR1cyA8IDQwMFxuICAgIHBsdWdpbi5zZXRQbHVnaW5TdGF0ZSh7IGF1dGhlbnRpY2F0ZWQgfSlcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHNldEF1dGhUb2tlbiAodG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnNldEl0ZW0odGhpcy50b2tlbktleSwgdG9rZW4pXG4gIH1cblxuICBnZXRBdXRoVG9rZW4gKCkge1xuICAgIHJldHVybiB0aGlzLnVwcHkuZ2V0UGx1Z2luKHRoaXMucGx1Z2luSWQpLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnRva2VuS2V5KVxuICB9XG5cbiAgYXV0aFVybCAocXVlcmllcyA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJlQXV0aFRva2VuKSB7XG4gICAgICBxdWVyaWVzLnVwcHlQcmVBdXRoVG9rZW4gPSB0aGlzLnByZUF1dGhUb2tlblxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aGlzLmhvc3RuYW1lfS8ke3RoaXMuaWR9L2Nvbm5lY3Q/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJpZXMpfWBcbiAgfVxuXG4gIGZpbGVVcmwgKGlkKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaG9zdG5hbWV9LyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgZmV0Y2hQcmVBdXRoVG9rZW4gKCkge1xuICAgIGlmICghdGhpcy5jb21wYW5pb25LZXlzUGFyYW1zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KGAke3RoaXMuaWR9L3ByZWF1dGgvYCwgeyBwYXJhbXM6IHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcyB9KVxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnByZUF1dGhUb2tlbiA9IHJlcy50b2tlblxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSB1bmFibGUgdG8gZmV0Y2ggcHJlQXV0aFRva2VuICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgIH0pXG4gIH1cblxuICBsaXN0IChkaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbGlzdC8ke2RpcmVjdG9yeSB8fCAnJ31gKVxuICB9XG5cbiAgbG9nb3V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbG9nb3V0YClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgICByZXNwb25zZSxcbiAgICAgICAgdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy50b2tlbktleSksXG4gICAgICBdKSkudGhlbigoW3Jlc3BvbnNlXSkgPT4gcmVzcG9uc2UpXG4gIH1cblxuICBzdGF0aWMgaW5pdFBsdWdpbiAocGx1Z2luLCBvcHRzLCBkZWZhdWx0T3B0cykge1xuICAgIHBsdWdpbi50eXBlID0gJ2FjcXVpcmVyJ1xuICAgIHBsdWdpbi5maWxlcyA9IFtdXG4gICAgaWYgKGRlZmF1bHRPcHRzKSB7XG4gICAgICBwbHVnaW4ub3B0cyA9IHsgLi4uZGVmYXVsdE9wdHMsIC4uLm9wdHMgfVxuICAgIH1cblxuICAgIGlmIChvcHRzLnNlcnZlclVybCB8fCBvcHRzLnNlcnZlclBhdHRlcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlcnZlclVybGAgYW5kIGBzZXJ2ZXJQYXR0ZXJuYCBoYXZlIGJlZW4gcmVuYW1lZCB0byBgY29tcGFuaW9uVXJsYCBhbmQgYGNvbXBhbmlvbkFsbG93ZWRIb3N0c2AgcmVzcGVjdGl2ZWx5IGluIHRoZSAwLjMwLjUgcmVsZWFzZS4gUGxlYXNlIGNvbnN1bHQgdGhlIGRvY3MgKGZvciBleGFtcGxlLCBodHRwczovL3VwcHkuaW8vZG9jcy9pbnN0YWdyYW0vIGZvciB0aGUgSW5zdGFncmFtIHBsdWdpbikgYW5kIHVzZSB0aGUgdXBkYXRlZCBvcHRpb25zLmAnKVxuICAgIH1cblxuICAgIGlmIChvcHRzLmNvbXBhbmlvbkFsbG93ZWRIb3N0cykge1xuICAgICAgY29uc3QgcGF0dGVybiA9IG9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzXG4gICAgICAvLyB2YWxpZGF0ZSBjb21wYW5pb25BbGxvd2VkSG9zdHMgcGFyYW1cbiAgICAgIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycgJiYgIUFycmF5LmlzQXJyYXkocGF0dGVybikgJiYgIShwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke3BsdWdpbi5pZH06IHRoZSBvcHRpb24gXCJjb21wYW5pb25BbGxvd2VkSG9zdHNcIiBtdXN0IGJlIG9uZSBvZiBzdHJpbmcsIEFycmF5LCBSZWdFeHBgKVxuICAgICAgfVxuICAgICAgcGx1Z2luLm9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzID0gcGF0dGVyblxuICAgIH0gZWxzZSBpZiAoL14oPyFodHRwcz86XFwvXFwvKS4qJC9pLnRlc3Qob3B0cy5jb21wYW5pb25VcmwpKSB7XG4gICAgICAvLyBkb2VzIG5vdCBzdGFydCB3aXRoIGh0dHBzOi8vXG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBgaHR0cHM6Ly8ke29wdHMuY29tcGFuaW9uVXJsLnJlcGxhY2UoL15cXC9cXC8vLCAnJyl9YFxuICAgIH0gZWxzZSB7XG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBuZXcgVVJMKG9wdHMuY29tcGFuaW9uVXJsKS5vcmlnaW5cbiAgICB9XG5cbiAgICBwbHVnaW4uc3RvcmFnZSA9IHBsdWdpbi5vcHRzLnN0b3JhZ2UgfHwgdG9rZW5TdG9yYWdlXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmZXRjaFdpdGhOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmV0Y2hXaXRoTmV0d29ya0Vycm9yJylcbmNvbnN0IEF1dGhFcnJvciA9IHJlcXVpcmUoJy4vQXV0aEVycm9yJylcblxuLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyBzbGFzaCBzbyB3ZSBjYW4gYWx3YXlzIHNhZmVseSBhcHBlbmQgL3h5ei5cbmZ1bmN0aW9uIHN0cmlwU2xhc2ggKHVybCkge1xuICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSlNPTlJlc3BvbnNlIChyZXMpIHtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSkge1xuICAgIHRocm93IG5ldyBBdXRoRXJyb3IoKVxuICB9XG5cbiAgY29uc3QganNvblByb21pc2UgPSByZXMuanNvbigpXG5cbiAgaWYgKHJlcy5zdGF0dXMgPCAyMDAgfHwgcmVzLnN0YXR1cyA+IDMwMCkge1xuICAgIGxldCBlcnJNc2cgPSBgRmFpbGVkIHJlcXVlc3Qgd2l0aCBzdGF0dXM6ICR7cmVzLnN0YXR1c30uICR7cmVzLnN0YXR1c1RleHR9YFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnJEYXRhID0gYXdhaXQganNvblByb21pc2VcbiAgICAgIGVyck1zZyA9IGVyckRhdGEubWVzc2FnZSA/IGAke2Vyck1zZ30gbWVzc2FnZTogJHtlcnJEYXRhLm1lc3NhZ2V9YCA6IGVyck1zZ1xuICAgICAgZXJyTXNnID0gZXJyRGF0YS5yZXF1ZXN0SWQgPyBgJHtlcnJNc2d9IHJlcXVlc3QtSWQ6ICR7ZXJyRGF0YS5yZXF1ZXN0SWR9YCA6IGVyck1zZ1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5zYWZlLWZpbmFsbHlcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpXG4gICAgfVxuICB9XG4gIHJldHVybiBqc29uUHJvbWlzZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJlcXVlc3RDbGllbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgI2dldFBvc3RSZXNwb25zZUZ1bmMgPSBza2lwID0+IHJlc3BvbnNlID0+IChza2lwID8gcmVzcG9uc2UgOiB0aGlzLm9uUmVjZWl2ZVJlc3BvbnNlKHJlc3BvbnNlKSlcblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHRoaXMudXBweSA9IHVwcHlcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5vblJlY2VpdmVSZXNwb25zZSA9IHRoaXMub25SZWNlaXZlUmVzcG9uc2UuYmluZCh0aGlzKVxuICAgIHRoaXMuYWxsb3dlZEhlYWRlcnMgPSBbJ2FjY2VwdCcsICdjb250ZW50LXR5cGUnLCAndXBweS1hdXRoLXRva2VuJ11cbiAgICB0aGlzLnByZWZsaWdodERvbmUgPSBmYWxzZVxuICB9XG5cbiAgZ2V0IGhvc3RuYW1lICgpIHtcbiAgICBjb25zdCB7IGNvbXBhbmlvbiB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIHJldHVybiBzdHJpcFNsYXNoKGNvbXBhbmlvbiAmJiBjb21wYW5pb25baG9zdF0gPyBjb21wYW5pb25baG9zdF0gOiBob3N0KVxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRIZWFkZXJzID17XG4gICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnVXBweS1WZXJzaW9ucyc6IGBAdXBweS9jb21wYW5pb24tY2xpZW50PSR7UmVxdWVzdENsaWVudC5WRVJTSU9OfWAsXG4gIH1cblxuICBoZWFkZXJzICgpIHtcbiAgICBjb25zdCB1c2VySGVhZGVycyA9IHRoaXMub3B0cy5jb21wYW5pb25IZWFkZXJzIHx8IHt9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAuLi5SZXF1ZXN0Q2xpZW50LmRlZmF1bHRIZWFkZXJzLFxuICAgICAgLi4udXNlckhlYWRlcnMsXG4gICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBjb21wYW5pb24gPSBzdGF0ZS5jb21wYW5pb24gfHwge31cbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIGNvbnN0IHsgaGVhZGVycyB9ID0gcmVzcG9uc2VcbiAgICAvLyBTdG9yZSB0aGUgc2VsZi1pZGVudGlmaWVkIGRvbWFpbiBuYW1lIGZvciB0aGUgQ29tcGFuaW9uIGluc3RhbmNlIHdlIGp1c3QgaGl0LlxuICAgIGlmIChoZWFkZXJzLmhhcygnaS1hbScpICYmIGhlYWRlcnMuZ2V0KCdpLWFtJykgIT09IGNvbXBhbmlvbltob3N0XSkge1xuICAgICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgICAgY29tcGFuaW9uOiB7IC4uLmNvbXBhbmlvbiwgW2hvc3RdOiBoZWFkZXJzLmdldCgnaS1hbScpIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gICNnZXRVcmwgKHVybCkge1xuICAgIGlmICgvXihodHRwcz86fClcXC9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgcmV0dXJuIHVybFxuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vJHt1cmx9YFxuICB9XG5cbiAgI2Vycm9ySGFuZGxlciAobWV0aG9kLCBwYXRoKSB7XG4gICAgcmV0dXJuIChlcnIpID0+IHtcbiAgICAgIGlmICghZXJyPy5pc0F1dGhFcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgQ291bGQgbm90ICR7bWV0aG9kfSAke3RoaXMuI2dldFVybChwYXRoKX1gKVxuICAgICAgICBlcnJvci5jYXVzZSA9IGVyclxuICAgICAgICBlcnIgPSBlcnJvciAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgIH1cbiAgfVxuXG4gIHByZWZsaWdodCAocGF0aCkge1xuICAgIGlmICh0aGlzLnByZWZsaWdodERvbmUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpKVxuICAgIH1cblxuICAgIHJldHVybiBmZXRjaCh0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgIG1ldGhvZDogJ09QVElPTlMnLFxuICAgIH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMuaGFzKCdhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJykpIHtcbiAgICAgICAgICB0aGlzLmFsbG93ZWRIZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnKVxuICAgICAgICAgICAgLnNwbGl0KCcsJykubWFwKChoZWFkZXJOYW1lKSA9PiBoZWFkZXJOYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0RG9uZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEhlYWRlcnMuc2xpY2UoKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coYFtDb21wYW5pb25DbGllbnRdIHVuYWJsZSB0byBtYWtlIHByZWZsaWdodCByZXF1ZXN0ICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgICAgdGhpcy5wcmVmbGlnaHREb25lID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpXG4gICAgICB9KVxuICB9XG5cbiAgcHJlZmxpZ2h0QW5kSGVhZGVycyAocGF0aCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5wcmVmbGlnaHQocGF0aCksIHRoaXMuaGVhZGVycygpXSlcbiAgICAgIC50aGVuKChbYWxsb3dlZEhlYWRlcnMsIGhlYWRlcnNdKSA9PiB7XG4gICAgICAgIC8vIGZpbHRlciB0byBrZWVwIG9ubHkgYWxsb3dlZCBIZWFkZXJzXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgIGlmICghYWxsb3dlZEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSBleGNsdWRpbmcgZGlzYWxsb3dlZCBoZWFkZXIgJHtoZWFkZXJ9YClcbiAgICAgICAgICAgIGRlbGV0ZSBoZWFkZXJzW2hlYWRlcl0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gaGVhZGVyc1xuICAgICAgfSlcbiAgfVxuXG4gIGdldCAocGF0aCwgc2tpcFBvc3RSZXNwb25zZSkge1xuICAgIGNvbnN0IG1ldGhvZCA9ICdnZXQnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICB9KSlcbiAgICAgIC50aGVuKHRoaXMuI2dldFBvc3RSZXNwb25zZUZ1bmMoc2tpcFBvc3RSZXNwb25zZSkpXG4gICAgICAudGhlbihoYW5kbGVKU09OUmVzcG9uc2UpXG4gICAgICAuY2F0Y2godGhpcy4jZXJyb3JIYW5kbGVyKG1ldGhvZCwgcGF0aCkpXG4gIH1cblxuICBwb3N0IChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ3Bvc3QnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG5cbiAgZGVsZXRlIChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ2RlbGV0ZSdcbiAgICByZXR1cm4gdGhpcy5wcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpXG4gICAgICAudGhlbigoaGVhZGVycykgPT4gZmV0Y2hXaXRoTmV0d29ya0Vycm9yKGAke3RoaXMuaG9zdG5hbWV9LyR7cGF0aH1gLCB7XG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgY3JlZGVudGlhbHM6IHRoaXMub3B0cy5jb21wYW5pb25Db29raWVzUnVsZSB8fCAnc2FtZS1vcmlnaW4nLFxuICAgICAgICBib2R5OiBkYXRhID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBudWxsLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2VhcmNoUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICB9XG5cbiAgZmlsZVVybCAoaWQpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vc2VhcmNoLyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgc2VhcmNoICh0ZXh0LCBxdWVyaWVzKSB7XG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgPyBgJiR7cXVlcmllc31gIDogJydcbiAgICByZXR1cm4gdGhpcy5nZXQoYHNlYXJjaC8ke3RoaXMuaWR9L2xpc3Q/cT0ke2VuY29kZVVSSUNvbXBvbmVudCh0ZXh0KX0ke3F1ZXJpZXN9YClcbiAgfVxufVxuIiwiY29uc3QgZWUgPSByZXF1aXJlKCduYW1lc3BhY2UtZW1pdHRlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVXBweVNvY2tldCB7XG4gICNxdWV1ZWQgPSBbXVxuXG4gICNlbWl0dGVyID0gZWUoKVxuXG4gICNpc09wZW4gPSBmYWxzZVxuXG4gICNzb2NrZXRcblxuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMub3B0cyA9IG9wdHNcblxuICAgIGlmICghb3B0cyB8fCBvcHRzLmF1dG9PcGVuICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5vcGVuKClcbiAgICB9XG4gIH1cblxuICBnZXQgaXNPcGVuICgpIHsgcmV0dXJuIHRoaXMuI2lzT3BlbiB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0U29ja2V0JyldICgpIHsgcmV0dXJuIHRoaXMuI3NvY2tldCB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0UXVldWVkJyldICgpIHsgcmV0dXJuIHRoaXMuI3F1ZXVlZCB9XG5cbiAgb3BlbiAoKSB7XG4gICAgdGhpcy4jc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLm9wdHMudGFyZ2V0KVxuXG4gICAgdGhpcy4jc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2lzT3BlbiA9IHRydWVcblxuICAgICAgd2hpbGUgKHRoaXMuI3F1ZXVlZC5sZW5ndGggPiAwICYmIHRoaXMuI2lzT3Blbikge1xuICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuI3F1ZXVlZC5zaGlmdCgpXG4gICAgICAgIHRoaXMuc2VuZChmaXJzdC5hY3Rpb24sIGZpcnN0LnBheWxvYWQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNpc09wZW4gPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMuI3NvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLiNoYW5kbGVNZXNzYWdlXG4gIH1cblxuICBjbG9zZSAoKSB7XG4gICAgdGhpcy4jc29ja2V0Py5jbG9zZSgpXG4gIH1cblxuICBzZW5kIChhY3Rpb24sIHBheWxvYWQpIHtcbiAgICAvLyBhdHRhY2ggdXVpZFxuXG4gICAgaWYgKCF0aGlzLiNpc09wZW4pIHtcbiAgICAgIHRoaXMuI3F1ZXVlZC5wdXNoKHsgYWN0aW9uLCBwYXlsb2FkIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLiNzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3Rpb24sXG4gICAgICBwYXlsb2FkLFxuICAgIH0pKVxuICB9XG5cbiAgb24gKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oYWN0aW9uLCBoYW5kbGVyKVxuICB9XG5cbiAgZW1pdCAoYWN0aW9uLCBwYXlsb2FkKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGFjdGlvbiwgcGF5bG9hZClcbiAgfVxuXG4gIG9uY2UgKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub25jZShhY3Rpb24sIGhhbmRsZXIpXG4gIH1cblxuICAjaGFuZGxlTWVzc2FnZT0gKGUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKVxuICAgICAgdGhpcy5lbWl0KG1lc3NhZ2UuYWN0aW9uLCBtZXNzYWdlLnBheWxvYWQpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBUT0RPOiB1c2UgYSBtb3JlIHJvYnVzdCBlcnJvciBoYW5kbGVyLlxuICAgICAgY29uc29sZS5sb2coZXJyKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIE1hbmFnZXMgY29tbXVuaWNhdGlvbnMgd2l0aCBDb21wYW5pb25cbiAqL1xuXG5jb25zdCBSZXF1ZXN0Q2xpZW50ID0gcmVxdWlyZSgnLi9SZXF1ZXN0Q2xpZW50JylcbmNvbnN0IFByb3ZpZGVyID0gcmVxdWlyZSgnLi9Qcm92aWRlcicpXG5jb25zdCBTZWFyY2hQcm92aWRlciA9IHJlcXVpcmUoJy4vU2VhcmNoUHJvdmlkZXInKVxuY29uc3QgU29ja2V0ID0gcmVxdWlyZSgnLi9Tb2NrZXQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgUmVxdWVzdENsaWVudCxcbiAgUHJvdmlkZXIsXG4gIFNlYXJjaFByb3ZpZGVyLFxuICBTb2NrZXQsXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBzZXJ2ZXMgYXMgYW4gQXN5bmMgd3JhcHBlciBmb3IgTG9jYWxTdG9yYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNldEl0ZW0gPSAoa2V5LCB2YWx1ZSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKVxuICAgIHJlc29sdmUoKVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5nZXRJdGVtID0gKGtleSkgPT4ge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpXG59XG5cbm1vZHVsZS5leHBvcnRzLnJlbW92ZUl0ZW0gPSAoa2V5KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSlcbiAgICByZXNvbHZlKClcbiAgfSlcbn1cbiIsIi8qKlxuICogQ29yZSBwbHVnaW4gbG9naWMgdGhhdCBhbGwgcGx1Z2lucyBzaGFyZS5cbiAqXG4gKiBCYXNlUGx1Z2luIGRvZXMgbm90IGNvbnRhaW4gRE9NIHJlbmRlcmluZyBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgcGx1Z2luc1xuICogd2l0aG91dCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIFNlZSBgUGx1Z2luYCBmb3IgdGhlIGV4dGVuZGVkIHZlcnNpb24gd2l0aCBQcmVhY3QgcmVuZGVyaW5nIGZvciBpbnRlcmZhY2VzLlxuICovXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFzZVBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzID0ge30pIHtcbiAgICB0aGlzLnVwcHkgPSB1cHB5XG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICB9XG5cbiAgZ2V0UGx1Z2luU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICByZXR1cm4gcGx1Z2luc1t0aGlzLmlkXSB8fCB7fVxuICB9XG5cbiAgc2V0UGx1Z2luU3RhdGUgKHVwZGF0ZSkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcblxuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7XG4gICAgICAgIC4uLnBsdWdpbnMsXG4gICAgICAgIFt0aGlzLmlkXToge1xuICAgICAgICAgIC4uLnBsdWdpbnNbdGhpcy5pZF0sXG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgc2V0T3B0aW9ucyAobmV3T3B0cykge1xuICAgIHRoaXMub3B0cyA9IHsgLi4udGhpcy5vcHRzLCAuLi5uZXdPcHRzIH1cbiAgICB0aGlzLnNldFBsdWdpblN0YXRlKCkgLy8gc28gdGhhdCBVSSByZS1yZW5kZXJzIHdpdGggbmV3IG9wdGlvbnNcbiAgICB0aGlzLmkxOG5Jbml0KClcbiAgfVxuXG4gIGkxOG5Jbml0ICgpIHtcbiAgICBjb25zdCB0cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy51cHB5LmxvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pXG4gICAgdGhpcy5pMThuID0gdHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0cmFuc2xhdG9yKVxuICAgIHRoaXMuaTE4bkFycmF5ID0gdHJhbnNsYXRvci50cmFuc2xhdGVBcnJheS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSgpIC8vIHNvIHRoYXQgVUkgcmUtcmVuZGVycyBhbmQgd2Ugc2VlIHRoZSB1cGRhdGVkIGxvY2FsZVxuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZGFibGUgbWV0aG9kc1xuICAgKiA9PT09PT09PT09PT09PT09PT1cbiAgICogVGhlc2UgbWV0aG9kcyBhcmUgaGVyZSB0byBzZXJ2ZSBhcyBhbiBvdmVydmlldyBvZiB0aGUgZXh0ZW5kYWJsZSBtZXRob2RzIGFzIHdlbGwgYXNcbiAgICogbWFraW5nIHRoZW0gbm90IGNvbmRpdGlvbmFsIGluIHVzZSwgc3VjaCBhcyBgaWYgKHRoaXMuYWZ0ZXJVcGRhdGUpYC5cbiAgICovXG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWRkVGFyZ2V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4dGVuZCB0aGUgYWRkVGFyZ2V0IG1ldGhvZCB0byBhZGQgeW91ciBwbHVnaW4gdG8gYW5vdGhlciBwbHVnaW5cXCdzIHRhcmdldCcpXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICBpbnN0YWxsICgpIHt9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdW5pbnN0YWxsICgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHBsdWdpbiBpcyBtb3VudGVkLCB3aGV0aGVyIGluIERPTSBvciBpbnRvIGFub3RoZXIgcGx1Z2luLlxuICAgKiBOZWVkZWQgYmVjYXVzZSBzb21ldGltZXMgcGx1Z2lucyBhcmUgbW91bnRlZCBzZXBhcmF0ZWx5L2FmdGVyIGBpbnN0YWxsYCxcbiAgICogc28gdGhpcy5lbCBhbmQgdGhpcy5wYXJlbnQgbWlnaHQgbm90IGJlIGF2YWlsYWJsZSBpbiBgaW5zdGFsbGAuXG4gICAqIFRoaXMgaXMgdGhlIGNhc2Ugd2l0aCBAdXBweS9yZWFjdCBwbHVnaW5zLCBmb3IgZXhhbXBsZS5cbiAgICovXG4gIHJlbmRlciAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHRlbmQgdGhlIHJlbmRlciBtZXRob2QgdG8gYWRkIHlvdXIgcGx1Z2luIHRvIGEgRE9NIGVsZW1lbnQnKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdXBkYXRlICgpIHt9XG5cbiAgLy8gQ2FsbGVkIGFmdGVyIGV2ZXJ5IHN0YXRlIHVwZGF0ZSwgYWZ0ZXIgZXZlcnl0aGluZydzIG1vdW50ZWQuIERlYm91bmNlZC5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWZ0ZXJVcGRhdGUgKCkge31cbn1cbiIsImNvbnN0IHsgcmVuZGVyIH0gPSByZXF1aXJlKCdwcmVhY3QnKVxuY29uc3QgZmluZERPTUVsZW1lbnQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmluZERPTUVsZW1lbnQnKVxuXG5jb25zdCBCYXNlUGx1Z2luID0gcmVxdWlyZSgnLi9CYXNlUGx1Z2luJylcblxuLyoqXG4gKiBEZWZlciBhIGZyZXF1ZW50IGNhbGwgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0geygpID0+IFR9IGZuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UgKGZuKSB7XG4gIGxldCBjYWxsaW5nID0gbnVsbFxuICBsZXQgbGF0ZXN0QXJncyA9IG51bGxcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgbGF0ZXN0QXJncyA9IGFyZ3NcbiAgICBpZiAoIWNhbGxpbmcpIHtcbiAgICAgIGNhbGxpbmcgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2FsbGluZyA9IG51bGxcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCBgYXJnc2AgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBzdGF0ZSwgaWYgbXVsdGlwbGUgY2FsbHMgaGFwcGVuZWQgc2luY2UgdGhpcyB0YXNrXG4gICAgICAgIC8vIHdhcyBxdWV1ZWQuIFNvIHdlIHVzZSB0aGUgYGxhdGVzdEFyZ3NgLCB3aGljaCBkZWZpbml0ZWx5XG4gICAgICAgIC8vIGlzIHRoZSBtb3N0IHJlY2VudCBjYWxsLlxuICAgICAgICByZXR1cm4gZm4oLi4ubGF0ZXN0QXJncylcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBjYWxsaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBVSVBsdWdpbiBpcyB0aGUgZXh0ZW5kZWQgdmVyc2lvbiBvZiBCYXNlUGx1Z2luIHRvIGluY29ycG9yYXRlIHJlbmRlcmluZyB3aXRoIFByZWFjdC5cbiAqIFVzZSB0aGlzIGZvciBwbHVnaW5zIHRoYXQgbmVlZCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIEZvciBwbHVnaW5zIHdpdGhvdXQgYW4gdXNlciBpbnRlcmZhY2UsIHNlZSBCYXNlUGx1Z2luLlxuICovXG5jbGFzcyBVSVBsdWdpbiBleHRlbmRzIEJhc2VQbHVnaW4ge1xuICAjdXBkYXRlVUlcblxuICAvKipcbiAgICogQ2hlY2sgaWYgc3VwcGxpZWQgYHRhcmdldGAgaXMgYSBET00gZWxlbWVudCBvciBhbiBgb2JqZWN0YC5cbiAgICogSWYgaXTigJlzIGFuIG9iamVjdCDigJQgdGFyZ2V0IGlzIGEgcGx1Z2luLCBhbmQgd2Ugc2VhcmNoIGBwbHVnaW5zYFxuICAgKiBmb3IgYSBwbHVnaW4gd2l0aCBzYW1lIG5hbWUgYW5kIHJldHVybiBpdHMgdGFyZ2V0LlxuICAgKi9cbiAgbW91bnQgKHRhcmdldCwgcGx1Z2luKSB7XG4gICAgY29uc3QgY2FsbGVyUGx1Z2luTmFtZSA9IHBsdWdpbi5pZFxuXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGZpbmRET01FbGVtZW50KHRhcmdldClcblxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICB0aGlzLmlzVGFyZ2V0RE9NRWwgPSB0cnVlXG4gICAgICAvLyBXaGVuIHRhcmdldCBpcyA8Ym9keT4gd2l0aCBhIHNpbmdsZSA8ZGl2PiBlbGVtZW50LFxuICAgICAgLy8gUHJlYWN0IHRoaW5rcyBpdOKAmXMgdGhlIFVwcHkgcm9vdCBlbGVtZW50IGluIHRoZXJlIHdoZW4gZG9pbmcgYSBkaWZmLFxuICAgICAgLy8gYW5kIGRlc3Ryb3lzIGl0LiBTbyB3ZSBhcmUgY3JlYXRpbmcgYSBmcmFnbWVudCAoY291bGQgYmUgZW1wdHkgZGl2KVxuICAgICAgY29uc3QgdXBweVJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cbiAgICAgIC8vIEFQSSBmb3IgcGx1Z2lucyB0aGF0IHJlcXVpcmUgYSBzeW5jaHJvbm91cyByZXJlbmRlci5cbiAgICAgIHRoaXMuI3VwZGF0ZVVJID0gZGVib3VuY2UoKHN0YXRlKSA9PiB7XG4gICAgICAgIC8vIHBsdWdpbiBjb3VsZCBiZSByZW1vdmVkLCBidXQgdGhpcy5yZXJlbmRlciBpcyBkZWJvdW5jZWQgYmVsb3csXG4gICAgICAgIC8vIHNvIGl0IGNvdWxkIHN0aWxsIGJlIGNhbGxlZCBldmVuIGFmdGVyIHVwcHkucmVtb3ZlUGx1Z2luIG9yIHVwcHkuY2xvc2VcbiAgICAgICAgLy8gaGVuY2UgdGhlIGNoZWNrXG4gICAgICAgIGlmICghdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLmlkKSkgcmV0dXJuXG4gICAgICAgIHJlbmRlcih0aGlzLnJlbmRlcihzdGF0ZSksIHVwcHlSb290RWxlbWVudClcbiAgICAgICAgdGhpcy5hZnRlclVwZGF0ZSgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gYSBET00gZWxlbWVudCAnJHt0YXJnZXR9J2ApXG5cbiAgICAgIGlmICh0aGlzLm9wdHMucmVwbGFjZVRhcmdldENvbnRlbnQpIHtcbiAgICAgICAgLy8gRG9pbmcgcmVuZGVyKGgobnVsbCksIHRhcmdldEVsZW1lbnQpLCB3aGljaCBzaG91bGQgaGF2ZSBiZWVuXG4gICAgICAgIC8vIGEgYmV0dGVyIHdheSwgc2luY2UgYmVjYXVzZSB0aGUgY29tcG9uZW50IG1pZ2h0IG5lZWQgdG8gZG8gYWRkaXRpb25hbCBjbGVhbnVwIHdoZW4gaXQgaXMgcmVtb3ZlZCxcbiAgICAgICAgLy8gc3RvcHBlZCB3b3JraW5nIOKAlCBQcmVhY3QganVzdCBhZGRzIG51bGwgaW50byB0YXJnZXQsIG5vdCByZXBsYWNpbmdcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuICAgICAgfVxuXG4gICAgICByZW5kZXIodGhpcy5yZW5kZXIodGhpcy51cHB5LmdldFN0YXRlKCkpLCB1cHB5Um9vdEVsZW1lbnQpXG4gICAgICB0aGlzLmVsID0gdXBweVJvb3RFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHVwcHlSb290RWxlbWVudClcblxuICAgICAgdGhpcy5vbk1vdW50KClcblxuICAgICAgcmV0dXJuIHRoaXMuZWxcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0UGx1Z2luXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mIFVJUGx1Z2luKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gKmluc3RhbmNlKlxuICAgICAgdGFyZ2V0UGx1Z2luID0gdGFyZ2V0XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gdHlwZVxuICAgICAgY29uc3QgVGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgcGx1Z2luIGluc3RhbmNlLlxuICAgICAgdGhpcy51cHB5Lml0ZXJhdGVQbHVnaW5zKHAgPT4ge1xuICAgICAgICBpZiAocCBpbnN0YW5jZW9mIFRhcmdldCkge1xuICAgICAgICAgIHRhcmdldFBsdWdpbiA9IHBcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0UGx1Z2luKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gJHt0YXJnZXRQbHVnaW4uaWR9YClcbiAgICAgIHRoaXMucGFyZW50ID0gdGFyZ2V0UGx1Z2luXG4gICAgICB0aGlzLmVsID0gdGFyZ2V0UGx1Z2luLmFkZFRhcmdldChwbHVnaW4pXG5cbiAgICAgIHRoaXMub25Nb3VudCgpXG4gICAgICByZXR1cm4gdGhpcy5lbFxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coYE5vdCBpbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX1gKVxuXG4gICAgbGV0IG1lc3NhZ2UgPSBgSW52YWxpZCB0YXJnZXQgb3B0aW9uIGdpdmVuIHRvICR7Y2FsbGVyUGx1Z2luTmFtZX0uYFxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlICs9ICcgVGhlIGdpdmVuIHRhcmdldCBpcyBub3QgYSBQbHVnaW4gY2xhc3MuICdcbiAgICAgICAgKyAnUGxlYXNlIGNoZWNrIHRoYXQgeW91XFwncmUgbm90IHNwZWNpZnlpbmcgYSBSZWFjdCBDb21wb25lbnQgaW5zdGVhZCBvZiBhIHBsdWdpbi4gJ1xuICAgICAgICArICdJZiB5b3UgYXJlIHVzaW5nIEB1cHB5LyogcGFja2FnZXMgZGlyZWN0bHksIG1ha2Ugc3VyZSB5b3UgaGF2ZSBvbmx5IDEgdmVyc2lvbiBvZiBAdXBweS9jb3JlIGluc3RhbGxlZDogJ1xuICAgICAgICArICdydW4gYG5wbSBscyBAdXBweS9jb3JlYCBvbiB0aGUgY29tbWFuZCBsaW5lIGFuZCB2ZXJpZnkgdGhhdCBhbGwgdGhlIHZlcnNpb25zIG1hdGNoIGFuZCBhcmUgZGVkdXBlZCBjb3JyZWN0bHkuJ1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlICs9ICdJZiB5b3UgbWVhbnQgdG8gdGFyZ2V0IGFuIEhUTUwgZWxlbWVudCwgcGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50IGV4aXN0cy4gJ1xuICAgICAgICArICdDaGVjayB0aGF0IHRoZSA8c2NyaXB0PiB0YWcgaW5pdGlhbGl6aW5nIFVwcHkgaXMgcmlnaHQgYmVmb3JlIHRoZSBjbG9zaW5nIDwvYm9keT4gdGFnIGF0IHRoZSBlbmQgb2YgdGhlIHBhZ2UuICdcbiAgICAgICAgKyAnKHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXMvMTA0MilcXG5cXG4nXG4gICAgICAgICsgJ0lmIHlvdSBtZWFudCB0byB0YXJnZXQgYSBwbHVnaW4sIHBsZWFzZSBjb25maXJtIHRoYXQgeW91ciBgaW1wb3J0YCBzdGF0ZW1lbnRzIG9yIGByZXF1aXJlYCBjYWxscyBhcmUgY29ycmVjdC4nXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKVxuICB9XG5cbiAgdXBkYXRlIChzdGF0ZSkge1xuICAgIGlmICh0aGlzLmVsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuI3VwZGF0ZVVJPy4oc3RhdGUpXG4gICAgfVxuICB9XG5cbiAgdW5tb3VudCAoKSB7XG4gICAgaWYgKHRoaXMuaXNUYXJnZXRET01FbCkge1xuICAgICAgdGhpcy5lbD8ucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5vblVubW91bnQoKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgb25Nb3VudCAoKSB7fVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIG9uVW5tb3VudCAoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJUGx1Z2luXG4iLCIvKiBnbG9iYWwgQWdncmVnYXRlRXJyb3IgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5jb25zdCBlZSA9IHJlcXVpcmUoJ25hbWVzcGFjZS1lbWl0dGVyJylcbmNvbnN0IHsgbmFub2lkIH0gPSByZXF1aXJlKCduYW5vaWQnKVxuY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuY29uc3QgcHJldHRpZXJCeXRlcyA9IHJlcXVpcmUoJ0B0cmFuc2xvYWRpdC9wcmV0dGllci1ieXRlcycpXG5jb25zdCBtYXRjaCA9IHJlcXVpcmUoJ21pbWUtbWF0Y2gnKVxuY29uc3QgRGVmYXVsdFN0b3JlID0gcmVxdWlyZSgnQHVwcHkvc3RvcmUtZGVmYXVsdCcpXG5jb25zdCBnZXRGaWxlVHlwZSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlVHlwZScpXG5jb25zdCBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbiA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpXG5jb25zdCBnZW5lcmF0ZUZpbGVJRCA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZW5lcmF0ZUZpbGVJRCcpXG5jb25zdCBzdXBwb3J0c1VwbG9hZFByb2dyZXNzID0gcmVxdWlyZSgnLi9zdXBwb3J0c1VwbG9hZFByb2dyZXNzJylcbmNvbnN0IGdldEZpbGVOYW1lID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZScpXG5jb25zdCB7IGp1c3RFcnJvcnNMb2dnZXIsIGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuXG4vLyBFeHBvcnRlZCBmcm9tIGhlcmUuXG5jbGFzcyBSZXN0cmljdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5pc1Jlc3RyaWN0aW9uID0gdHJ1ZVxuICB9XG59XG5pZiAodHlwZW9mIEFnZ3JlZ2F0ZUVycm9yID09PSAndW5kZWZpbmVkJykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZ2xvYmFsLWFzc2lnblxuICBnbG9iYWxUaGlzLkFnZ3JlZ2F0ZUVycm9yID0gY2xhc3MgQWdncmVnYXRlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IgKG1lc3NhZ2UsIGVycm9ycykge1xuICAgICAgc3VwZXIobWVzc2FnZSlcbiAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzXG4gICAgfVxuICB9XG59XG5jbGFzcyBBZ2dyZWdhdGVSZXN0cmljdGlvbkVycm9yIGV4dGVuZHMgQWdncmVnYXRlRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5pc1Jlc3RyaWN0aW9uID0gdHJ1ZVxuICB9XG59XG5cbi8qKlxuICogVXBweSBDb3JlIG1vZHVsZS5cbiAqIE1hbmFnZXMgcGx1Z2lucywgc3RhdGUgdXBkYXRlcywgYWN0cyBhcyBhbiBldmVudCBidXMsXG4gKiBhZGRzL3JlbW92ZXMgZmlsZXMgYW5kIG1ldGFkYXRhLlxuICovXG5jbGFzcyBVcHB5IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgQmFzZVBsdWdpbltdPn0gKi9cbiAgI3BsdWdpbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgI3N0b3JlVW5zdWJzY3JpYmVcblxuICAjZW1pdHRlciA9IGVlKClcblxuICAjcHJlUHJvY2Vzc29ycyA9IG5ldyBTZXQoKVxuXG4gICN1cGxvYWRlcnMgPSBuZXcgU2V0KClcblxuICAjcG9zdFByb2Nlc3NvcnMgPSBuZXcgU2V0KClcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgVXBweVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyDigJQgVXBweSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgYWRkQnVsa0ZpbGVzRmFpbGVkOiB7XG4gICAgICAgICAgMDogJ0ZhaWxlZCB0byBhZGQgJXtzbWFydF9jb3VudH0gZmlsZSBkdWUgdG8gYW4gaW50ZXJuYWwgZXJyb3InLFxuICAgICAgICAgIDE6ICdGYWlsZWQgdG8gYWRkICV7c21hcnRfY291bnR9IGZpbGVzIGR1ZSB0byBpbnRlcm5hbCBlcnJvcnMnLFxuICAgICAgICB9LFxuICAgICAgICB5b3VDYW5Pbmx5VXBsb2FkWDoge1xuICAgICAgICAgIDA6ICdZb3UgY2FuIG9ubHkgdXBsb2FkICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgY2FuIG9ubHkgdXBsb2FkICV7c21hcnRfY291bnR9IGZpbGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgeW91SGF2ZVRvQXRMZWFzdFNlbGVjdFg6IHtcbiAgICAgICAgICAwOiAnWW91IGhhdmUgdG8gc2VsZWN0IGF0IGxlYXN0ICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgaGF2ZSB0byBzZWxlY3QgYXQgbGVhc3QgJXtzbWFydF9jb3VudH0gZmlsZXMnLFxuICAgICAgICB9LFxuICAgICAgICBleGNlZWRzU2l6ZTogJyV7ZmlsZX0gZXhjZWVkcyBtYXhpbXVtIGFsbG93ZWQgc2l6ZSBvZiAle3NpemV9JyxcbiAgICAgICAgbWlzc2luZ1JlcXVpcmVkTWV0YUZpZWxkOiAnTWlzc2luZyByZXF1aXJlZCBtZXRhIGZpZWxkcycsXG4gICAgICAgIG1pc3NpbmdSZXF1aXJlZE1ldGFGaWVsZE9uRmlsZTogJ01pc3NpbmcgcmVxdWlyZWQgbWV0YSBmaWVsZHMgaW4gJXtmaWxlTmFtZX0nLFxuICAgICAgICBpbmZlcmlvclNpemU6ICdUaGlzIGZpbGUgaXMgc21hbGxlciB0aGFuIHRoZSBhbGxvd2VkIHNpemUgb2YgJXtzaXplfScsXG4gICAgICAgIHlvdUNhbk9ubHlVcGxvYWRGaWxlVHlwZXM6ICdZb3UgY2FuIG9ubHkgdXBsb2FkOiAle3R5cGVzfScsXG4gICAgICAgIG5vTW9yZUZpbGVzQWxsb3dlZDogJ0Nhbm5vdCBhZGQgbW9yZSBmaWxlcycsXG4gICAgICAgIG5vRHVwbGljYXRlczogJ0Nhbm5vdCBhZGQgdGhlIGR1cGxpY2F0ZSBmaWxlIFxcJyV7ZmlsZU5hbWV9XFwnLCBpdCBhbHJlYWR5IGV4aXN0cycsXG4gICAgICAgIGNvbXBhbmlvbkVycm9yOiAnQ29ubmVjdGlvbiB3aXRoIENvbXBhbmlvbiBmYWlsZWQnLFxuICAgICAgICBhdXRoQWJvcnRlZDogJ0F1dGhlbnRpY2F0aW9uIGFib3J0ZWQnLFxuICAgICAgICBjb21wYW5pb25VbmF1dGhvcml6ZUhpbnQ6ICdUbyB1bmF1dGhvcml6ZSB0byB5b3VyICV7cHJvdmlkZXJ9IGFjY291bnQsIHBsZWFzZSBnbyB0byAle3VybH0nLFxuICAgICAgICBmYWlsZWRUb1VwbG9hZDogJ0ZhaWxlZCB0byB1cGxvYWQgJXtmaWxlfScsXG4gICAgICAgIG5vSW50ZXJuZXRDb25uZWN0aW9uOiAnTm8gSW50ZXJuZXQgY29ubmVjdGlvbicsXG4gICAgICAgIGNvbm5lY3RlZFRvSW50ZXJuZXQ6ICdDb25uZWN0ZWQgdG8gdGhlIEludGVybmV0JyxcbiAgICAgICAgLy8gU3RyaW5ncyBmb3IgcmVtb3RlIHByb3ZpZGVyc1xuICAgICAgICBub0ZpbGVzRm91bmQ6ICdZb3UgaGF2ZSBubyBmaWxlcyBvciBmb2xkZXJzIGhlcmUnLFxuICAgICAgICBzZWxlY3RYOiB7XG4gICAgICAgICAgMDogJ1NlbGVjdCAle3NtYXJ0X2NvdW50fScsXG4gICAgICAgICAgMTogJ1NlbGVjdCAle3NtYXJ0X2NvdW50fScsXG4gICAgICAgIH0sXG4gICAgICAgIGFsbEZpbGVzRnJvbUZvbGRlck5hbWVkOiAnQWxsIGZpbGVzIGZyb20gZm9sZGVyICV7bmFtZX0nLFxuICAgICAgICBvcGVuRm9sZGVyTmFtZWQ6ICdPcGVuIGZvbGRlciAle25hbWV9JyxcbiAgICAgICAgY2FuY2VsOiAnQ2FuY2VsJyxcbiAgICAgICAgbG9nT3V0OiAnTG9nIG91dCcsXG4gICAgICAgIGZpbHRlcjogJ0ZpbHRlcicsXG4gICAgICAgIHJlc2V0RmlsdGVyOiAnUmVzZXQgZmlsdGVyJyxcbiAgICAgICAgbG9hZGluZzogJ0xvYWRpbmcuLi4nLFxuICAgICAgICBhdXRoZW50aWNhdGVXaXRoVGl0bGU6ICdQbGVhc2UgYXV0aGVudGljYXRlIHdpdGggJXtwbHVnaW5OYW1lfSB0byBzZWxlY3QgZmlsZXMnLFxuICAgICAgICBhdXRoZW50aWNhdGVXaXRoOiAnQ29ubmVjdCB0byAle3BsdWdpbk5hbWV9JyxcbiAgICAgICAgc2lnbkluV2l0aEdvb2dsZTogJ1NpZ24gaW4gd2l0aCBHb29nbGUnLFxuICAgICAgICBzZWFyY2hJbWFnZXM6ICdTZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGVudGVyVGV4dFRvU2VhcmNoOiAnRW50ZXIgdGV4dCB0byBzZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGJhY2tUb1NlYXJjaDogJ0JhY2sgdG8gU2VhcmNoJyxcbiAgICAgICAgZW1wdHlGb2xkZXJBZGRlZDogJ05vIGZpbGVzIHdlcmUgYWRkZWQgZnJvbSBlbXB0eSBmb2xkZXInLFxuICAgICAgICBmb2xkZXJBbHJlYWR5QWRkZWQ6ICdUaGUgZm9sZGVyIFwiJXtmb2xkZXJ9XCIgd2FzIGFscmVhZHkgYWRkZWQnLFxuICAgICAgICBmb2xkZXJBZGRlZDoge1xuICAgICAgICAgIDA6ICdBZGRlZCAle3NtYXJ0X2NvdW50fSBmaWxlIGZyb20gJXtmb2xkZXJ9JyxcbiAgICAgICAgICAxOiAnQWRkZWQgJXtzbWFydF9jb3VudH0gZmlsZXMgZnJvbSAle2ZvbGRlcn0nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGlkOiAndXBweScsXG4gICAgICBhdXRvUHJvY2VlZDogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIEBkZXByZWNhdGVkIFRoZSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkXG4gICAgICAgKi9cbiAgICAgIGFsbG93TXVsdGlwbGVVcGxvYWRzOiB0cnVlLFxuICAgICAgYWxsb3dNdWx0aXBsZVVwbG9hZEJhdGNoZXM6IHRydWUsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgbWF4RmlsZVNpemU6IG51bGwsXG4gICAgICAgIG1pbkZpbGVTaXplOiBudWxsLFxuICAgICAgICBtYXhUb3RhbEZpbGVTaXplOiBudWxsLFxuICAgICAgICBtYXhOdW1iZXJPZkZpbGVzOiBudWxsLFxuICAgICAgICBtaW5OdW1iZXJPZkZpbGVzOiBudWxsLFxuICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBudWxsLFxuICAgICAgICByZXF1aXJlZE1ldGFGaWVsZHM6IFtdLFxuICAgICAgfSxcbiAgICAgIG1ldGE6IHt9LFxuICAgICAgb25CZWZvcmVGaWxlQWRkZWQ6IChjdXJyZW50RmlsZSkgPT4gY3VycmVudEZpbGUsXG4gICAgICBvbkJlZm9yZVVwbG9hZDogKGZpbGVzKSA9PiBmaWxlcyxcbiAgICAgIHN0b3JlOiBEZWZhdWx0U3RvcmUoKSxcbiAgICAgIGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlcixcbiAgICAgIGluZm9UaW1lb3V0OiA1MDAwLFxuICAgIH1cblxuICAgIC8vIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyLFxuICAgIC8vIG1ha2luZyBzdXJlIHRvIG1lcmdlIHJlc3RyaWN0aW9ucyB0b29cbiAgICB0aGlzLm9wdHMgPSB7XG4gICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLm9wdHMsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMucmVzdHJpY3Rpb25zLFxuICAgICAgICAuLi4ob3B0cyAmJiBvcHRzLnJlc3RyaWN0aW9ucyksXG4gICAgICB9LFxuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZGVidWc6IHRydWUgZm9yIGJhY2t3YXJkcy1jb21wYXRhYmlsaXR5LCB1bmxlc3MgbG9nZ2VyIGlzIHNldCBpbiBvcHRzXG4gICAgLy8gb3B0cyBpbnN0ZWFkIG9mIHRoaXMub3B0cyB0byBhdm9pZCBjb21wYXJpbmcgb2JqZWN0cyDigJQgd2Ugc2V0IGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlciBpbiBkZWZhdWx0T3B0aW9uc1xuICAgIGlmIChvcHRzICYmIG9wdHMubG9nZ2VyICYmIG9wdHMuZGVidWcpIHtcbiAgICAgIHRoaXMubG9nKCdZb3UgYXJlIHVzaW5nIGEgY3VzdG9tIGBsb2dnZXJgLCBidXQgYWxzbyBzZXQgYGRlYnVnOiB0cnVlYCwgd2hpY2ggdXNlcyBidWlsdC1pbiBsb2dnZXIgdG8gb3V0cHV0IGxvZ3MgdG8gY29uc29sZS4gSWdub3JpbmcgYGRlYnVnOiB0cnVlYCBhbmQgdXNpbmcgeW91ciBjdXN0b20gYGxvZ2dlcmAuJywgJ3dhcm5pbmcnKVxuICAgIH0gZWxzZSBpZiAob3B0cyAmJiBvcHRzLmRlYnVnKSB7XG4gICAgICB0aGlzLm9wdHMubG9nZ2VyID0gZGVidWdMb2dnZXJcbiAgICB9XG5cbiAgICB0aGlzLmxvZyhgVXNpbmcgQ29yZSB2JHt0aGlzLmNvbnN0cnVjdG9yLlZFUlNJT059YClcblxuICAgIGlmICh0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXNcbiAgICAgICAgJiYgdGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzICE9PSBudWxsXG4gICAgICAgICYmICFBcnJheS5pc0FycmF5KHRoaXMub3B0cy5yZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ByZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlc2AgbXVzdCBiZSBhbiBhcnJheScpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICAvLyBfX19XaHkgdGhyb3R0bGUgYXQgNTAwbXM/XG4gICAgLy8gICAgLSBXZSBtdXN0IHRocm90dGxlIGF0ID4yNTBtcyBmb3Igc3VwZXJmb2N1cyBpbiBEYXNoYm9hcmQgdG8gd29yayB3ZWxsXG4gICAgLy8gICAgKGJlY2F1c2UgYW5pbWF0aW9uIHRha2VzIDAuMjVzLCBhbmQgd2Ugd2FudCB0byB3YWl0IGZvciBhbGwgYW5pbWF0aW9ucyB0byBiZSBvdmVyIGJlZm9yZSByZWZvY3VzaW5nKS5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXTogaWYgdGhvdHRsZSBpcyBhdCAxMDBtcywgdGhlbiBpZiB5b3UgYXJlIHVwbG9hZGluZyBhIGZpbGUsXG4gICAgLy8gICAgYW5kIGNsaWNrICdBREQgTU9SRSBGSUxFUycsIC0gZm9jdXMgd29uJ3QgYWN0aXZhdGUgaW4gRmlyZWZveC5cbiAgICAvLyAgICAtIFdlIG11c3QgdGhyb3R0bGUgYXQgYXJvdW5kID41MDBtcyB0byBhdm9pZCBwZXJmb3JtYW5jZSBsYWdzLlxuICAgIC8vICAgIFtQcmFjdGljYWwgQ2hlY2tdIEZpcmVmb3gsIHRyeSB0byB1cGxvYWQgYSBiaWcgZmlsZSBmb3IgYSBwcm9sb25nZWQgcGVyaW9kIG9mIHRpbWUuIExhcHRvcCB3aWxsIHN0YXJ0IHRvIGhlYXQgdXAuXG4gICAgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcyA9IHRocm90dGxlKHRoaXMuY2FsY3VsYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKSwgNTAwLCB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiB0cnVlIH0pXG5cbiAgICB0aGlzLnN0b3JlID0gdGhpcy5vcHRzLnN0b3JlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7fSxcbiAgICAgIGZpbGVzOiB7fSxcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiB7fSxcbiAgICAgIGFsbG93TmV3VXBsb2FkOiB0cnVlLFxuICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgIHVwbG9hZFByb2dyZXNzOiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzKCksXG4gICAgICAgIGluZGl2aWR1YWxDYW5jZWxsYXRpb246IHRydWUsXG4gICAgICAgIHJlc3VtYWJsZVVwbG9hZHM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgICBtZXRhOiB7IC4uLnRoaXMub3B0cy5tZXRhIH0sXG4gICAgICBpbmZvOiBbXSxcbiAgICAgIHJlY292ZXJlZFN0YXRlOiBudWxsLFxuICAgIH0pXG5cbiAgICB0aGlzLiNzdG9yZVVuc3Vic2NyaWJlID0gdGhpcy5zdG9yZS5zdWJzY3JpYmUoKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaCkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdzdGF0ZS11cGRhdGUnLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpXG4gICAgICB0aGlzLnVwZGF0ZUFsbChuZXh0U3RhdGUpXG4gICAgfSlcblxuICAgIC8vIEV4cG9zaW5nIHVwcHkgb2JqZWN0IG9uIHdpbmRvdyBmb3IgZGVidWdnaW5nIGFuZCB0ZXN0aW5nXG4gICAgaWYgKHRoaXMub3B0cy5kZWJ1ZyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93W3RoaXMub3B0cy5pZF0gPSB0aGlzXG4gICAgfVxuXG4gICAgdGhpcy4jYWRkTGlzdGVuZXJzKClcbiAgfVxuXG4gIGVtaXQgKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGV2ZW50LCAuLi5hcmdzKVxuICB9XG5cbiAgb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBvbmNlIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLiNlbWl0dGVyLm9uY2UoZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBvZmYgKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuI2VtaXR0ZXIub2ZmKGV2ZW50LCBjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb24gYWxsIHBsdWdpbnMgYW5kIHJ1biBgdXBkYXRlYCBvbiB0aGVtLlxuICAgKiBDYWxsZWQgZWFjaCB0aW1lIHN0YXRlIGNoYW5nZXMuXG4gICAqXG4gICAqL1xuICB1cGRhdGVBbGwgKHN0YXRlKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgcGx1Z2luLnVwZGF0ZShzdGF0ZSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgc3RhdGUgd2l0aCBhIHBhdGNoXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXRjaCB7Zm9vOiAnYmFyJ31cbiAgICovXG4gIHNldFN0YXRlIChwYXRjaCkge1xuICAgIHRoaXMuc3RvcmUuc2V0U3RhdGUocGF0Y2gpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBCYWNrIGNvbXBhdCBmb3Igd2hlbiB1cHB5LnN0YXRlIGlzIHVzZWQgaW5zdGVhZCBvZiB1cHB5LmdldFN0YXRlKCkuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBnZXQgc3RhdGUgKCkge1xuICAgIC8vIEhlcmUsIHN0YXRlIGlzIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkuXG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCB0byBzZXQgc3RhdGUgZm9yIGEgc3BlY2lmaWMgZmlsZS5cbiAgICovXG4gIHNldEZpbGVTdGF0ZSAoZmlsZUlELCBzdGF0ZSkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fu4oCZdCBzZXQgc3RhdGUgZm9yICR7ZmlsZUlEfSAodGhlIGZpbGUgY291bGQgaGF2ZSBiZWVuIHJlbW92ZWQpYClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcywgW2ZpbGVJRF06IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0sIC4uLnN0YXRlIH0gfSxcbiAgICB9KVxuICB9XG5cbiAgaTE4bkluaXQgKCkge1xuICAgIGNvbnN0IHRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcihbdGhpcy5kZWZhdWx0TG9jYWxlLCB0aGlzLm9wdHMubG9jYWxlXSlcbiAgICB0aGlzLmkxOG4gPSB0cmFuc2xhdG9yLnRyYW5zbGF0ZS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5pMThuQXJyYXkgPSB0cmFuc2xhdG9yLnRyYW5zbGF0ZUFycmF5LmJpbmQodHJhbnNsYXRvcilcbiAgICB0aGlzLmxvY2FsZSA9IHRyYW5zbGF0b3IubG9jYWxlXG4gIH1cblxuICBzZXRPcHRpb25zIChuZXdPcHRzKSB7XG4gICAgdGhpcy5vcHRzID0ge1xuICAgICAgLi4udGhpcy5vcHRzLFxuICAgICAgLi4ubmV3T3B0cyxcbiAgICAgIHJlc3RyaWN0aW9uczoge1xuICAgICAgICAuLi50aGlzLm9wdHMucmVzdHJpY3Rpb25zLFxuICAgICAgICAuLi4obmV3T3B0cyAmJiBuZXdPcHRzLnJlc3RyaWN0aW9ucyksXG4gICAgICB9LFxuICAgIH1cblxuICAgIGlmIChuZXdPcHRzLm1ldGEpIHtcbiAgICAgIHRoaXMuc2V0TWV0YShuZXdPcHRzLm1ldGEpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICBpZiAobmV3T3B0cy5sb2NhbGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMoKHBsdWdpbikgPT4ge1xuICAgICAgICBwbHVnaW4uc2V0T3B0aW9ucygpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIE5vdGU6IHRoaXMgaXMgbm90IHRoZSBwcmVhY3QgYHNldFN0YXRlYCwgaXQncyBhbiBpbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGhhcyB0aGUgc2FtZSBuYW1lLlxuICAgIHRoaXMuc2V0U3RhdGUoKSAvLyBzbyB0aGF0IFVJIHJlLXJlbmRlcnMgd2l0aCBuZXcgb3B0aW9uc1xuICB9XG5cbiAgcmVzZXRQcm9ncmVzcyAoKSB7XG4gICAgY29uc3QgZGVmYXVsdFByb2dyZXNzID0ge1xuICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICB1cGxvYWRTdGFydGVkOiBudWxsLFxuICAgIH1cbiAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7fVxuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZpbGVJRCA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHsgLi4uZmlsZXNbZmlsZUlEXSB9XG4gICAgICB1cGRhdGVkRmlsZS5wcm9ncmVzcyA9IHsgLi4udXBkYXRlZEZpbGUucHJvZ3Jlc3MsIC4uLmRlZmF1bHRQcm9ncmVzcyB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmVzZXQtcHJvZ3Jlc3MnKVxuICB9XG5cbiAgYWRkUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHRoaXMuI3ByZVByb2Nlc3NvcnMuYWRkKGZuKVxuICB9XG5cbiAgcmVtb3ZlUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHJldHVybiB0aGlzLiNwcmVQcm9jZXNzb3JzLmRlbGV0ZShmbilcbiAgfVxuXG4gIGFkZFBvc3RQcm9jZXNzb3IgKGZuKSB7XG4gICAgdGhpcy4jcG9zdFByb2Nlc3NvcnMuYWRkKGZuKVxuICB9XG5cbiAgcmVtb3ZlUG9zdFByb2Nlc3NvciAoZm4pIHtcbiAgICByZXR1cm4gdGhpcy4jcG9zdFByb2Nlc3NvcnMuZGVsZXRlKGZuKVxuICB9XG5cbiAgYWRkVXBsb2FkZXIgKGZuKSB7XG4gICAgdGhpcy4jdXBsb2FkZXJzLmFkZChmbilcbiAgfVxuXG4gIHJlbW92ZVVwbG9hZGVyIChmbikge1xuICAgIHJldHVybiB0aGlzLiN1cGxvYWRlcnMuZGVsZXRlKGZuKVxuICB9XG5cbiAgc2V0TWV0YSAoZGF0YSkge1xuICAgIGNvbnN0IHVwZGF0ZWRNZXRhID0geyAuLi50aGlzLmdldFN0YXRlKCkubWV0YSwgLi4uZGF0YSB9XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuXG4gICAgT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXSwgbWV0YTogeyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXS5tZXRhLCAuLi5kYXRhIH0gfVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZygnQWRkaW5nIG1ldGFkYXRhOicpXG4gICAgdGhpcy5sb2coZGF0YSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbWV0YTogdXBkYXRlZE1ldGEsXG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgIH0pXG4gIH1cblxuICBzZXRGaWxlTWV0YSAoZmlsZUlELCBkYXRhKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGlmICghdXBkYXRlZEZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRoaXMubG9nKCdXYXMgdHJ5aW5nIHRvIHNldCBtZXRhZGF0YSBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJywgZmlsZUlEKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IG5ld01ldGEgPSB7IC4uLnVwZGF0ZWRGaWxlc1tmaWxlSURdLm1ldGEsIC4uLmRhdGEgfVxuICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXSwgbWV0YTogbmV3TWV0YSB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBmaWxlIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRCBUaGUgSUQgb2YgdGhlIGZpbGUgb2JqZWN0IHRvIHJldHVybi5cbiAgICovXG4gIGdldEZpbGUgKGZpbGVJRCkge1xuICAgIHJldHVybiB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgZmlsZXMgaW4gYW4gYXJyYXkuXG4gICAqL1xuICBnZXRGaWxlcyAoKSB7XG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZmlsZXMpXG4gIH1cblxuICBnZXRPYmplY3RPZkZpbGVzUGVyU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgZmlsZXM6IGZpbGVzT2JqZWN0LCB0b3RhbFByb2dyZXNzLCBlcnJvciB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgZmlsZXMgPSBPYmplY3QudmFsdWVzKGZpbGVzT2JqZWN0KVxuICAgIGNvbnN0IGluUHJvZ3Jlc3NGaWxlcyA9IGZpbGVzLmZpbHRlcigoeyBwcm9ncmVzcyB9KSA9PiAhcHJvZ3Jlc3MudXBsb2FkQ29tcGxldGUgJiYgcHJvZ3Jlc3MudXBsb2FkU3RhcnRlZClcbiAgICBjb25zdCBuZXdGaWxlcyA9ICBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3Qgc3RhcnRlZEZpbGVzID0gZmlsZXMuZmlsdGVyKFxuICAgICAgZmlsZSA9PiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzIHx8IGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICApXG4gICAgY29uc3QgdXBsb2FkU3RhcnRlZEZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3QgcGF1c2VkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUuaXNQYXVzZWQpXG4gICAgY29uc3QgY29tcGxldGVGaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZSlcbiAgICBjb25zdCBlcnJvcmVkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUuZXJyb3IpXG4gICAgY29uc3QgaW5Qcm9ncmVzc05vdFBhdXNlZEZpbGVzID0gaW5Qcm9ncmVzc0ZpbGVzLmZpbHRlcigoZmlsZSkgPT4gIWZpbGUuaXNQYXVzZWQpXG4gICAgY29uc3QgcHJvY2Vzc2luZ0ZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLnByZXByb2Nlc3MgfHwgZmlsZS5wcm9ncmVzcy5wb3N0cHJvY2VzcylcblxuICAgIHJldHVybiB7XG4gICAgICBuZXdGaWxlcyxcbiAgICAgIHN0YXJ0ZWRGaWxlcyxcbiAgICAgIHVwbG9hZFN0YXJ0ZWRGaWxlcyxcbiAgICAgIHBhdXNlZEZpbGVzLFxuICAgICAgY29tcGxldGVGaWxlcyxcbiAgICAgIGVycm9yZWRGaWxlcyxcbiAgICAgIGluUHJvZ3Jlc3NGaWxlcyxcbiAgICAgIGluUHJvZ3Jlc3NOb3RQYXVzZWRGaWxlcyxcbiAgICAgIHByb2Nlc3NpbmdGaWxlcyxcblxuICAgICAgaXNVcGxvYWRTdGFydGVkOiB1cGxvYWRTdGFydGVkRmlsZXMubGVuZ3RoID4gMCxcbiAgICAgIGlzQWxsQ29tcGxldGU6IHRvdGFsUHJvZ3Jlc3MgPT09IDEwMFxuICAgICAgICAmJiBjb21wbGV0ZUZpbGVzLmxlbmd0aCA9PT0gZmlsZXMubGVuZ3RoXG4gICAgICAgICYmIHByb2Nlc3NpbmdGaWxlcy5sZW5ndGggPT09IDAsXG4gICAgICBpc0FsbEVycm9yZWQ6ICEhZXJyb3IgJiYgZXJyb3JlZEZpbGVzLmxlbmd0aCA9PT0gZmlsZXMubGVuZ3RoLFxuICAgICAgaXNBbGxQYXVzZWQ6IGluUHJvZ3Jlc3NGaWxlcy5sZW5ndGggIT09IDAgJiYgcGF1c2VkRmlsZXMubGVuZ3RoID09PSBpblByb2dyZXNzRmlsZXMubGVuZ3RoLFxuICAgICAgaXNVcGxvYWRJblByb2dyZXNzOiBpblByb2dyZXNzRmlsZXMubGVuZ3RoID4gMCxcbiAgICAgIGlzU29tZUdob3N0OiBmaWxlcy5zb21lKGZpbGUgPT4gZmlsZS5pc0dob3N0KSxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBwdWJsaWMgd3JhcHBlciBmb3IgX2NoZWNrUmVzdHJpY3Rpb25zIOKAlCBjaGVja3MgaWYgYSBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMuXG4gICAqIEZvciB1c2UgaW4gVUkgcGx1aWdpbnMgKGxpa2UgUHJvdmlkZXJzKSwgdG8gZGlzYWxsb3cgc2VsZWN0aW5nIGZpbGVzIHRoYXQgd29u4oCZdCBwYXNzIHJlc3RyaWN0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtmaWxlc10gYXJyYXkgdG8gY2hlY2sgbWF4TnVtYmVyT2ZGaWxlcyBhbmQgbWF4VG90YWxGaWxlU2l6ZVxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSB7IHJlc3VsdDogdHJ1ZS9mYWxzZSwgcmVhc29uOiB3aHkgZmlsZSBkaWRu4oCZdCBwYXNzIHJlc3RyaWN0aW9ucyB9XG4gICAqL1xuICB2YWxpZGF0ZVJlc3RyaWN0aW9ucyAoZmlsZSwgZmlsZXMpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy4jY2hlY2tSZXN0cmljdGlvbnMoZmlsZSwgZmlsZXMpXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IHRydWUsXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IGZhbHNlLFxuICAgICAgICByZWFzb246IGVyci5tZXNzYWdlLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMgc2V0IGluIG9wdGlvbnM6IG1heEZpbGVTaXplLCBtaW5GaWxlU2l6ZSxcbiAgICogbWF4TnVtYmVyT2ZGaWxlcyBhbmQgYWxsb3dlZEZpbGVUeXBlcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtmaWxlc10gYXJyYXkgdG8gY2hlY2sgbWF4TnVtYmVyT2ZGaWxlcyBhbmQgbWF4VG90YWxGaWxlU2l6ZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgI2NoZWNrUmVzdHJpY3Rpb25zIChmaWxlLCBmaWxlcyA9IHRoaXMuZ2V0RmlsZXMoKSkge1xuICAgIGNvbnN0IHsgbWF4RmlsZVNpemUsIG1pbkZpbGVTaXplLCBtYXhUb3RhbEZpbGVTaXplLCBtYXhOdW1iZXJPZkZpbGVzLCBhbGxvd2VkRmlsZVR5cGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG5cbiAgICBpZiAobWF4TnVtYmVyT2ZGaWxlcykge1xuICAgICAgaWYgKGZpbGVzLmxlbmd0aCArIDEgPiBtYXhOdW1iZXJPZkZpbGVzKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKGAke3RoaXMuaTE4bigneW91Q2FuT25seVVwbG9hZFgnLCB7IHNtYXJ0X2NvdW50OiBtYXhOdW1iZXJPZkZpbGVzIH0pfWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFsbG93ZWRGaWxlVHlwZXMpIHtcbiAgICAgIGNvbnN0IGlzQ29ycmVjdEZpbGVUeXBlID0gYWxsb3dlZEZpbGVUeXBlcy5zb21lKCh0eXBlKSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBtaW1lLXR5cGVcbiAgICAgICAgaWYgKHR5cGUuaW5kZXhPZignLycpID4gLTEpIHtcbiAgICAgICAgICBpZiAoIWZpbGUudHlwZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgcmV0dXJuIG1hdGNoKGZpbGUudHlwZS5yZXBsYWNlKC87Lio/JC8sICcnKSwgdHlwZSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG90aGVyd2lzZSB0aGlzIGlzIGxpa2VseSBhbiBleHRlbnNpb25cbiAgICAgICAgaWYgKHR5cGVbMF0gPT09ICcuJyAmJiBmaWxlLmV4dGVuc2lvbikge1xuICAgICAgICAgIHJldHVybiBmaWxlLmV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSB0eXBlLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoIWlzQ29ycmVjdEZpbGVUeXBlKSB7XG4gICAgICAgIGNvbnN0IGFsbG93ZWRGaWxlVHlwZXNTdHJpbmcgPSBhbGxvd2VkRmlsZVR5cGVzLmpvaW4oJywgJylcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCd5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzJywgeyB0eXBlczogYWxsb3dlZEZpbGVUeXBlc1N0cmluZyB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtYXhUb3RhbEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heFRvdGFsRmlsZVNpemUgJiYgZmlsZS5zaXplICE9IG51bGwpIHtcbiAgICAgIGxldCB0b3RhbEZpbGVzU2l6ZSA9IDBcbiAgICAgIHRvdGFsRmlsZXNTaXplICs9IGZpbGUuc2l6ZVxuICAgICAgZmlsZXMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICB0b3RhbEZpbGVzU2l6ZSArPSBmLnNpemVcbiAgICAgIH0pXG4gICAgICBpZiAodG90YWxGaWxlc1NpemUgPiBtYXhUb3RhbEZpbGVTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignZXhjZWVkc1NpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtYXhUb3RhbEZpbGVTaXplKSxcbiAgICAgICAgICBmaWxlOiBmaWxlLm5hbWUsXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGNhbid0IGNoZWNrIG1heEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heEZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplID4gbWF4RmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdleGNlZWRzU2l6ZScsIHtcbiAgICAgICAgICBzaXplOiBwcmV0dGllckJ5dGVzKG1heEZpbGVTaXplKSxcbiAgICAgICAgICBmaWxlOiBmaWxlLm5hbWUsXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGNhbid0IGNoZWNrIG1pbkZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1pbkZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplIDwgbWluRmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdpbmZlcmlvclNpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtaW5GaWxlU2l6ZSksXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBtaW5OdW1iZXJPZkZpbGVzIHJlc3RyaWN0aW9uIGlzIHJlYWNoZWQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNjaGVja01pbk51bWJlck9mRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgeyBtaW5OdW1iZXJPZkZpbGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG4gICAgaWYgKE9iamVjdC5rZXlzKGZpbGVzKS5sZW5ndGggPCBtaW5OdW1iZXJPZkZpbGVzKSB7XG4gICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcihgJHt0aGlzLmkxOG4oJ3lvdUhhdmVUb0F0TGVhc3RTZWxlY3RYJywgeyBzbWFydF9jb3VudDogbWluTnVtYmVyT2ZGaWxlcyB9KX1gKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiByZXF1aXJlZE1ldGFGaWVsZCByZXN0cmljdGlvbiBpcyBtZXQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICovXG4gICNjaGVja1JlcXVpcmVkTWV0YUZpZWxkcyAoZmlsZXMpIHtcbiAgICBjb25zdCB7IHJlcXVpcmVkTWV0YUZpZWxkcyB9ID0gdGhpcy5vcHRzLnJlc3RyaWN0aW9uc1xuICAgIGNvbnN0IHsgaGFzT3duUHJvcGVydHkgfSA9IE9iamVjdC5wcm90b3R5cGVcblxuICAgIGNvbnN0IGVycm9ycyA9IFtdXG4gICAgZm9yIChjb25zdCBmaWxlSUQgb2YgT2JqZWN0LmtleXMoZmlsZXMpKSB7XG4gICAgICBjb25zdCBmaWxlID0gdGhpcy5nZXRGaWxlKGZpbGVJRClcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWlyZWRNZXRhRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChmaWxlLm1ldGEsIHJlcXVpcmVkTWV0YUZpZWxkc1tpXSkgfHwgZmlsZS5tZXRhW3JlcXVpcmVkTWV0YUZpZWxkc1tpXV0gPT09ICcnKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gbmV3IFJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCdtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGRPbkZpbGUnLCB7IGZpbGVOYW1lOiBmaWxlLm5hbWUgfSl9YClcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpXG4gICAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHsgZmlsZSwgc2hvd0luZm9ybWVyOiBmYWxzZSwgdGhyb3dFcnI6IGZhbHNlIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZVJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCdtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGQnKX1gLCBlcnJvcnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgYW4gZXJyb3IsIHNldHMgSW5mb3JtZXIgbWVzc2FnZSwgdGhlbiB0aHJvd3MgdGhlIGVycm9yLlxuICAgKiBFbWl0cyBhICdyZXN0cmljdGlvbi1mYWlsZWQnIGV2ZW50IGlmIGl04oCZcyBhIHJlc3RyaWN0aW9uIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0IHwgc3RyaW5nfSBlcnIg4oCUIEVycm9yIG9iamVjdCBvciBwbGFpbiBzdHJpbmcgbWVzc2FnZVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc2hvd0luZm9ybWVyPXRydWVdIOKAlCBTb21ldGltZXMgZGV2ZWxvcGVyIG1pZ2h0IHdhbnQgdG8gc2hvdyBJbmZvcm1lciBtYW51YWxseVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMuZmlsZT1udWxsXSDigJQgRmlsZSBvYmplY3QgdXNlZCB0byBlbWl0IHRoZSByZXN0cmljdGlvbiBlcnJvclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRocm93RXJyPXRydWVdIOKAlCBFcnJvcnMgc2hvdWxkbuKAmXQgYmUgdGhyb3duLCBmb3IgZXhhbXBsZSwgaW4gYHVwbG9hZC1lcnJvcmAgZXZlbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNzaG93T3JMb2dFcnJvckFuZFRocm93IChlcnIsIHsgc2hvd0luZm9ybWVyID0gdHJ1ZSwgZmlsZSA9IG51bGwsIHRocm93RXJyID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBjb25zdCBtZXNzYWdlID0gdHlwZW9mIGVyciA9PT0gJ29iamVjdCcgPyBlcnIubWVzc2FnZSA6IGVyclxuICAgIGNvbnN0IGRldGFpbHMgPSAodHlwZW9mIGVyciA9PT0gJ29iamVjdCcgJiYgZXJyLmRldGFpbHMpID8gZXJyLmRldGFpbHMgOiAnJ1xuXG4gICAgLy8gUmVzdHJpY3Rpb24gZXJyb3JzIHNob3VsZCBiZSBsb2dnZWQsIGJ1dCBub3QgYXMgZXJyb3JzLFxuICAgIC8vIGFzIHRoZXkgYXJlIGV4cGVjdGVkIGFuZCBzaG93biBpbiB0aGUgVUkuXG4gICAgbGV0IGxvZ01lc3NhZ2VXaXRoRGV0YWlscyA9IG1lc3NhZ2VcbiAgICBpZiAoZGV0YWlscykge1xuICAgICAgbG9nTWVzc2FnZVdpdGhEZXRhaWxzICs9IGAgJHtkZXRhaWxzfWBcbiAgICB9XG4gICAgaWYgKGVyci5pc1Jlc3RyaWN0aW9uKSB7XG4gICAgICB0aGlzLmxvZyhsb2dNZXNzYWdlV2l0aERldGFpbHMpXG4gICAgICB0aGlzLmVtaXQoJ3Jlc3RyaWN0aW9uLWZhaWxlZCcsIGZpbGUsIGVycilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2cobG9nTWVzc2FnZVdpdGhEZXRhaWxzLCAnZXJyb3InKVxuICAgIH1cblxuICAgIC8vIFNvbWV0aW1lcyBpbmZvcm1lciBoYXMgdG8gYmUgc2hvd24gbWFudWFsbHkgYnkgdGhlIGRldmVsb3BlcixcbiAgICAvLyBmb3IgZXhhbXBsZSwgaW4gYG9uQmVmb3JlRmlsZUFkZGVkYC5cbiAgICBpZiAoc2hvd0luZm9ybWVyKSB7XG4gICAgICB0aGlzLmluZm8oeyBtZXNzYWdlLCBkZXRhaWxzIH0sICdlcnJvcicsIHRoaXMub3B0cy5pbmZvVGltZW91dClcbiAgICB9XG5cbiAgICBpZiAodGhyb3dFcnIpIHtcbiAgICAgIHRocm93ICh0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyciA6IG5ldyBFcnJvcihlcnIpKVxuICAgIH1cbiAgfVxuXG4gICNhc3NlcnROZXdVcGxvYWRBbGxvd2VkIChmaWxlKSB7XG4gICAgY29uc3QgeyBhbGxvd05ld1VwbG9hZCB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoYWxsb3dOZXdVcGxvYWQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignbm9Nb3JlRmlsZXNBbGxvd2VkJykpLCB7IGZpbGUgfSlcbiAgICB9XG4gIH1cblxuICBjaGVja0lmRmlsZUFscmVhZHlFeGlzdHMgKGZpbGVJRCkge1xuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKGZpbGVzW2ZpbGVJRF0gJiYgIWZpbGVzW2ZpbGVJRF0uaXNHaG9zdCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZmlsZSBzdGF0ZSBvYmplY3QgYmFzZWQgb24gdXNlci1wcm92aWRlZCBgYWRkRmlsZSgpYCBvcHRpb25zLlxuICAgKlxuICAgKiBOb3RlIHRoaXMgaXMgZXh0cmVtZWx5IHNpZGUtZWZmZWN0ZnVsIGFuZCBzaG91bGQgb25seSBiZSBkb25lIHdoZW4gYSBmaWxlIHN0YXRlIG9iamVjdFxuICAgKiB3aWxsIGJlIGFkZGVkIHRvIHN0YXRlIGltbWVkaWF0ZWx5IGFmdGVyd2FyZCFcbiAgICpcbiAgICogVGhlIGBmaWxlc2AgdmFsdWUgaXMgcGFzc2VkIGluIGJlY2F1c2UgaXQgbWF5IGJlIHVwZGF0ZWQgYnkgdGhlIGNhbGxlciB3aXRob3V0IHVwZGF0aW5nIHRoZSBzdG9yZS5cbiAgICovXG4gICNjaGVja0FuZENyZWF0ZUZpbGVTdGF0ZU9iamVjdCAoZmlsZXMsIGZpbGVEZXNjcmlwdG9yKSB7XG4gICAgY29uc3QgZmlsZVR5cGUgPSBnZXRGaWxlVHlwZShmaWxlRGVzY3JpcHRvcilcbiAgICBjb25zdCBmaWxlTmFtZSA9IGdldEZpbGVOYW1lKGZpbGVUeXBlLCBmaWxlRGVzY3JpcHRvcilcbiAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24oZmlsZU5hbWUpLmV4dGVuc2lvblxuICAgIGNvbnN0IGlzUmVtb3RlID0gQm9vbGVhbihmaWxlRGVzY3JpcHRvci5pc1JlbW90ZSlcbiAgICBjb25zdCBmaWxlSUQgPSBnZW5lcmF0ZUZpbGVJRCh7XG4gICAgICAuLi5maWxlRGVzY3JpcHRvcixcbiAgICAgIHR5cGU6IGZpbGVUeXBlLFxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5jaGVja0lmRmlsZUFscmVhZHlFeGlzdHMoZmlsZUlEKSkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ25vRHVwbGljYXRlcycsIHsgZmlsZU5hbWUgfSkpXG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KGVycm9yLCB7IGZpbGU6IGZpbGVEZXNjcmlwdG9yIH0pXG4gICAgfVxuXG4gICAgY29uc3QgbWV0YSA9IGZpbGVEZXNjcmlwdG9yLm1ldGEgfHwge31cbiAgICBtZXRhLm5hbWUgPSBmaWxlTmFtZVxuICAgIG1ldGEudHlwZSA9IGZpbGVUeXBlXG5cbiAgICAvLyBgbnVsbGAgbWVhbnMgdGhlIHNpemUgaXMgdW5rbm93bi5cbiAgICBjb25zdCBzaXplID0gTnVtYmVyLmlzRmluaXRlKGZpbGVEZXNjcmlwdG9yLmRhdGEuc2l6ZSkgPyBmaWxlRGVzY3JpcHRvci5kYXRhLnNpemUgOiBudWxsXG5cbiAgICBsZXQgbmV3RmlsZSA9IHtcbiAgICAgIHNvdXJjZTogZmlsZURlc2NyaXB0b3Iuc291cmNlIHx8ICcnLFxuICAgICAgaWQ6IGZpbGVJRCxcbiAgICAgIG5hbWU6IGZpbGVOYW1lLFxuICAgICAgZXh0ZW5zaW9uOiBmaWxlRXh0ZW5zaW9uIHx8ICcnLFxuICAgICAgbWV0YToge1xuICAgICAgICAuLi50aGlzLmdldFN0YXRlKCkubWV0YSxcbiAgICAgICAgLi4ubWV0YSxcbiAgICAgIH0sXG4gICAgICB0eXBlOiBmaWxlVHlwZSxcbiAgICAgIGRhdGE6IGZpbGVEZXNjcmlwdG9yLmRhdGEsXG4gICAgICBwcm9ncmVzczoge1xuICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICBieXRlc1VwbG9hZGVkOiAwLFxuICAgICAgICBieXRlc1RvdGFsOiBzaXplLFxuICAgICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICAgIHVwbG9hZFN0YXJ0ZWQ6IG51bGwsXG4gICAgICB9LFxuICAgICAgc2l6ZSxcbiAgICAgIGlzUmVtb3RlLFxuICAgICAgcmVtb3RlOiBmaWxlRGVzY3JpcHRvci5yZW1vdGUgfHwgJycsXG4gICAgICBwcmV2aWV3OiBmaWxlRGVzY3JpcHRvci5wcmV2aWV3LFxuICAgIH1cblxuICAgIGNvbnN0IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlRmlsZUFkZGVkKG5ld0ZpbGUsIGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgLy8gRG9u4oCZdCBzaG93IFVJIGluZm8gZm9yIHRoaXMgZXJyb3IsIGFzIGl0IHNob3VsZCBiZSBkb25lIGJ5IHRoZSBkZXZlbG9wZXJcbiAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cobmV3IFJlc3RyaWN0aW9uRXJyb3IoJ0Nhbm5vdCBhZGQgdGhlIGZpbGUgYmVjYXVzZSBvbkJlZm9yZUZpbGVBZGRlZCByZXR1cm5lZCBmYWxzZS4nKSwgeyBzaG93SW5mb3JtZXI6IGZhbHNlLCBmaWxlRGVzY3JpcHRvciB9KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSAnb2JqZWN0JyAmJiBvbkJlZm9yZUZpbGVBZGRlZFJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgbmV3RmlsZSA9IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZpbGVzQXJyYXkgPSBPYmplY3Qua2V5cyhmaWxlcykubWFwKGkgPT4gZmlsZXNbaV0pXG4gICAgICB0aGlzLiNjaGVja1Jlc3RyaWN0aW9ucyhuZXdGaWxlLCBmaWxlc0FycmF5KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHsgZmlsZTogbmV3RmlsZSB9KVxuICAgIH1cblxuICAgIHJldHVybiBuZXdGaWxlXG4gIH1cblxuICAvLyBTY2hlZHVsZSBhbiB1cGxvYWQgaWYgYGF1dG9Qcm9jZWVkYCBpcyBlbmFibGVkLlxuICAjc3RhcnRJZkF1dG9Qcm9jZWVkICgpIHtcbiAgICBpZiAodGhpcy5vcHRzLmF1dG9Qcm9jZWVkICYmICF0aGlzLnNjaGVkdWxlZEF1dG9Qcm9jZWVkKSB7XG4gICAgICB0aGlzLnNjaGVkdWxlZEF1dG9Qcm9jZWVkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBudWxsXG4gICAgICAgIHRoaXMudXBsb2FkKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGlmICghZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMubG9nKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSB8fCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSwgNClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGZpbGUgdG8gYHN0YXRlLmZpbGVzYC4gVGhpcyB3aWxsIHJ1biBgb25CZWZvcmVGaWxlQWRkZWRgLFxuICAgKiB0cnkgdG8gZ3Vlc3MgZmlsZSB0eXBlIGluIGEgY2xldmVyIHdheSwgY2hlY2sgZmlsZSBhZ2FpbnN0IHJlc3RyaWN0aW9ucyxcbiAgICogYW5kIHN0YXJ0IGFuIHVwbG9hZCBpZiBgYXV0b1Byb2NlZWQgPT09IHRydWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsZSBvYmplY3QgdG8gYWRkXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGlkIGZvciB0aGUgYWRkZWQgZmlsZVxuICAgKi9cbiAgYWRkRmlsZSAoZmlsZSkge1xuICAgIHRoaXMuI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoZmlsZSlcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgIGxldCBuZXdGaWxlID0gdGhpcy4jY2hlY2tBbmRDcmVhdGVGaWxlU3RhdGVPYmplY3QoZmlsZXMsIGZpbGUpXG5cbiAgICAvLyBVc2VycyBhcmUgYXNrZWQgdG8gcmUtc2VsZWN0IHJlY292ZXJlZCBmaWxlcyB3aXRob3V0IGRhdGEsXG4gICAgLy8gYW5kIHRvIGtlZXAgdGhlIHByb2dyZXNzLCBtZXRhIGFuZCBldmVydGhpbmcgZWxzZSwgd2Ugb25seSByZXBsYWNlIHNhaWQgZGF0YVxuICAgIGlmIChmaWxlc1tuZXdGaWxlLmlkXSAmJiBmaWxlc1tuZXdGaWxlLmlkXS5pc0dob3N0KSB7XG4gICAgICBuZXdGaWxlID0ge1xuICAgICAgICAuLi5maWxlc1tuZXdGaWxlLmlkXSxcbiAgICAgICAgZGF0YTogZmlsZS5kYXRhLFxuICAgICAgICBpc0dob3N0OiBmYWxzZSxcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nKGBSZXBsYWNlZCB0aGUgYmxvYiBpbiB0aGUgcmVzdG9yZWQgZ2hvc3QgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9YClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB7XG4gICAgICAgIC4uLmZpbGVzLFxuICAgICAgICBbbmV3RmlsZS5pZF06IG5ld0ZpbGUsXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ2ZpbGUtYWRkZWQnLCBuZXdGaWxlKVxuICAgIHRoaXMuZW1pdCgnZmlsZXMtYWRkZWQnLCBbbmV3RmlsZV0pXG4gICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZS5uYW1lfSwgJHtuZXdGaWxlLmlkfSwgbWltZSB0eXBlOiAke25ld0ZpbGUudHlwZX1gKVxuXG4gICAgdGhpcy4jc3RhcnRJZkF1dG9Qcm9jZWVkKClcblxuICAgIHJldHVybiBuZXdGaWxlLmlkXG4gIH1cblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIGZpbGVzIHRvIGBzdGF0ZS5maWxlc2AuIFNlZSB0aGUgYGFkZEZpbGUoKWAgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogSWYgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIGFkZGluZyBhIGZpbGUsIGl0IGlzIGxvZ2dlZCBhbmQgdGhlIHVzZXIgaXMgbm90aWZpZWQuXG4gICAqIFRoaXMgaXMgZ29vZCBmb3IgVUkgcGx1Z2lucywgYnV0IG5vdCBmb3IgcHJvZ3JhbW1hdGljIHVzZS5cbiAgICogUHJvZ3JhbW1hdGljIHVzZXJzIHNob3VsZCB1c3VhbGx5IHN0aWxsIHVzZSBgYWRkRmlsZSgpYCBvbiBpbmRpdmlkdWFsIGZpbGVzLlxuICAgKi9cbiAgYWRkRmlsZXMgKGZpbGVEZXNjcmlwdG9ycykge1xuICAgIHRoaXMuI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoKVxuXG4gICAgLy8gY3JlYXRlIGEgY29weSBvZiB0aGUgZmlsZXMgb2JqZWN0IG9ubHkgb25jZVxuICAgIGNvbnN0IGZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGNvbnN0IG5ld0ZpbGVzID0gW11cbiAgICBjb25zdCBlcnJvcnMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZURlc2NyaXB0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgbmV3RmlsZSA9IHRoaXMuI2NoZWNrQW5kQ3JlYXRlRmlsZVN0YXRlT2JqZWN0KGZpbGVzLCBmaWxlRGVzY3JpcHRvcnNbaV0pXG4gICAgICAgIC8vIFVzZXJzIGFyZSBhc2tlZCB0byByZS1zZWxlY3QgcmVjb3ZlcmVkIGZpbGVzIHdpdGhvdXQgZGF0YSxcbiAgICAgICAgLy8gYW5kIHRvIGtlZXAgdGhlIHByb2dyZXNzLCBtZXRhIGFuZCBldmVydGhpbmcgZWxzZSwgd2Ugb25seSByZXBsYWNlIHNhaWQgZGF0YVxuICAgICAgICBpZiAoZmlsZXNbbmV3RmlsZS5pZF0gJiYgZmlsZXNbbmV3RmlsZS5pZF0uaXNHaG9zdCkge1xuICAgICAgICAgIG5ld0ZpbGUgPSB7XG4gICAgICAgICAgICAuLi5maWxlc1tuZXdGaWxlLmlkXSxcbiAgICAgICAgICAgIGRhdGE6IGZpbGVEZXNjcmlwdG9yc1tpXS5kYXRhLFxuICAgICAgICAgICAgaXNHaG9zdDogZmFsc2UsXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubG9nKGBSZXBsYWNlZCBibG9iIGluIGEgZ2hvc3QgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9YClcbiAgICAgICAgfVxuICAgICAgICBmaWxlc1tuZXdGaWxlLmlkXSA9IG5ld0ZpbGVcbiAgICAgICAgbmV3RmlsZXMucHVzaChuZXdGaWxlKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmICghZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXMgfSlcblxuICAgIG5ld0ZpbGVzLmZvckVhY2goKG5ld0ZpbGUpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnZmlsZS1hZGRlZCcsIG5ld0ZpbGUpXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgnZmlsZXMtYWRkZWQnLCBuZXdGaWxlcylcblxuICAgIGlmIChuZXdGaWxlcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgQWRkZWQgYmF0Y2ggb2YgJHtuZXdGaWxlcy5sZW5ndGh9IGZpbGVzYClcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMobmV3RmlsZXMpLmZvckVhY2goZmlsZUlEID0+IHtcbiAgICAgICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZXNbZmlsZUlEXS5uYW1lfVxcbiBpZDogJHtuZXdGaWxlc1tmaWxlSURdLmlkfVxcbiB0eXBlOiAke25ld0ZpbGVzW2ZpbGVJRF0udHlwZX1gKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAobmV3RmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy4jc3RhcnRJZkF1dG9Qcm9jZWVkKClcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBtZXNzYWdlID0gJ011bHRpcGxlIGVycm9ycyBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgZmlsZXM6XFxuJ1xuICAgICAgZXJyb3JzLmZvckVhY2goKHN1YkVycm9yKSA9PiB7XG4gICAgICAgIG1lc3NhZ2UgKz0gYFxcbiAqICR7c3ViRXJyb3IubWVzc2FnZX1gXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmluZm8oe1xuICAgICAgICBtZXNzYWdlOiB0aGlzLmkxOG4oJ2FkZEJ1bGtGaWxlc0ZhaWxlZCcsIHsgc21hcnRfY291bnQ6IGVycm9ycy5sZW5ndGggfSksXG4gICAgICAgIGRldGFpbHM6IG1lc3NhZ2UsXG4gICAgICB9LCAnZXJyb3InLCB0aGlzLm9wdHMuaW5mb1RpbWVvdXQpXG5cbiAgICAgIGlmICh0eXBlb2YgQWdncmVnYXRlRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZUVycm9yKGVycm9ycywgbWVzc2FnZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgICAgICBlcnIuZXJyb3JzID0gZXJyb3JzXG4gICAgICAgIHRocm93IGVyclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUZpbGVzIChmaWxlSURzLCByZWFzb24pIHtcbiAgICBjb25zdCB7IGZpbGVzLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi5maWxlcyB9XG4gICAgY29uc3QgdXBkYXRlZFVwbG9hZHMgPSB7IC4uLmN1cnJlbnRVcGxvYWRzIH1cblxuICAgIGNvbnN0IHJlbW92ZWRGaWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICBmaWxlSURzLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgaWYgKGZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgICAgcmVtb3ZlZEZpbGVzW2ZpbGVJRF0gPSBmaWxlc1tmaWxlSURdXG4gICAgICAgIGRlbGV0ZSB1cGRhdGVkRmlsZXNbZmlsZUlEXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgZmlsZXMgZnJvbSB0aGUgYGZpbGVJRHNgIGxpc3QgaW4gZWFjaCB1cGxvYWQuXG4gICAgZnVuY3Rpb24gZmlsZUlzTm90UmVtb3ZlZCAodXBsb2FkRmlsZUlEKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlZEZpbGVzW3VwbG9hZEZpbGVJRF0gPT09IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRVcGxvYWRzKS5mb3JFYWNoKCh1cGxvYWRJRCkgPT4ge1xuICAgICAgY29uc3QgbmV3RmlsZUlEcyA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXS5maWxlSURzLmZpbHRlcihmaWxlSXNOb3RSZW1vdmVkKVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIHVwbG9hZCBpZiBubyBmaWxlcyBhcmUgYXNzb2NpYXRlZCB3aXRoIGl0IGFueW1vcmUuXG4gICAgICBpZiAobmV3RmlsZUlEcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIHVwZGF0ZWRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdXBkYXRlZFVwbG9hZHNbdXBsb2FkSURdID0ge1xuICAgICAgICAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sXG4gICAgICAgIGZpbGVJRHM6IG5ld0ZpbGVJRHMsXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IHN0YXRlVXBkYXRlID0ge1xuICAgICAgY3VycmVudFVwbG9hZHM6IHVwZGF0ZWRVcGxvYWRzLFxuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICB9XG5cbiAgICAvLyBJZiBhbGwgZmlsZXMgd2VyZSByZW1vdmVkIC0gYWxsb3cgbmV3IHVwbG9hZHMsXG4gICAgLy8gYW5kIGNsZWFyIHJlY292ZXJlZFN0YXRlXG4gICAgaWYgKE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICBzdGF0ZVVwZGF0ZS5hbGxvd05ld1VwbG9hZCA9IHRydWVcbiAgICAgIHN0YXRlVXBkYXRlLmVycm9yID0gbnVsbFxuICAgICAgc3RhdGVVcGRhdGUucmVjb3ZlcmVkU3RhdGUgPSBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZVVwZGF0ZSlcbiAgICB0aGlzLmNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKVxuXG4gICAgY29uc3QgcmVtb3ZlZEZpbGVJRHMgPSBPYmplY3Qua2V5cyhyZW1vdmVkRmlsZXMpXG4gICAgcmVtb3ZlZEZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ2ZpbGUtcmVtb3ZlZCcsIHJlbW92ZWRGaWxlc1tmaWxlSURdLCByZWFzb24pXG4gICAgfSlcblxuICAgIGlmIChyZW1vdmVkRmlsZUlEcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCAke3JlbW92ZWRGaWxlSURzLmxlbmd0aH0gZmlsZXNgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCBmaWxlczogJHtyZW1vdmVkRmlsZUlEcy5qb2luKCcsICcpfWApXG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRmlsZSAoZmlsZUlELCByZWFzb24gPSBudWxsKSB7XG4gICAgdGhpcy5yZW1vdmVGaWxlcyhbZmlsZUlEXSwgcmVhc29uKVxuICB9XG5cbiAgcGF1c2VSZXN1bWUgKGZpbGVJRCkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcy5yZXN1bWFibGVVcGxvYWRzXG4gICAgICAgICB8fCB0aGlzLmdldEZpbGUoZmlsZUlEKS51cGxvYWRDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGNvbnN0IHdhc1BhdXNlZCA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpLmlzUGF1c2VkIHx8IGZhbHNlXG4gICAgY29uc3QgaXNQYXVzZWQgPSAhd2FzUGF1c2VkXG5cbiAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlSUQsIHtcbiAgICAgIGlzUGF1c2VkLFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZC1wYXVzZScsIGZpbGVJRCwgaXNQYXVzZWQpXG5cbiAgICByZXR1cm4gaXNQYXVzZWRcbiAgfVxuXG4gIHBhdXNlQWxsICgpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcyB9XG4gICAgY29uc3QgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcyA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gIXVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZVxuICAgICAgICAgICAgICYmIHVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgfSlcblxuICAgIGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSB7IC4uLnVwZGF0ZWRGaWxlc1tmaWxlXSwgaXNQYXVzZWQ6IHRydWUgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgICB0aGlzLmVtaXQoJ3BhdXNlLWFsbCcpXG4gIH1cblxuICByZXN1bWVBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBpblByb2dyZXNzVXBkYXRlZEZpbGVzID0gT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiAhdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZENvbXBsZXRlXG4gICAgICAgICAgICAgJiYgdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWRcbiAgICB9KVxuXG4gICAgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHtcbiAgICAgICAgLi4udXBkYXRlZEZpbGVzW2ZpbGVdLFxuICAgICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczogdXBkYXRlZEZpbGVzIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3Jlc3VtZS1hbGwnKVxuICB9XG5cbiAgcmV0cnlBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBmaWxlc1RvUmV0cnkgPSBPYmplY3Qua2V5cyh1cGRhdGVkRmlsZXMpLmZpbHRlcihmaWxlID0+IHtcbiAgICAgIHJldHVybiB1cGRhdGVkRmlsZXNbZmlsZV0uZXJyb3JcbiAgICB9KVxuXG4gICAgZmlsZXNUb1JldHJ5LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRGaWxlID0ge1xuICAgICAgICAuLi51cGRhdGVkRmlsZXNbZmlsZV0sXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZV0gPSB1cGRhdGVkRmlsZVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmV0cnktYWxsJywgZmlsZXNUb1JldHJ5KVxuXG4gICAgaWYgKGZpbGVzVG9SZXRyeS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBzdWNjZXNzZnVsOiBbXSxcbiAgICAgICAgZmFpbGVkOiBbXSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQoZmlsZXNUb1JldHJ5LCB7XG4gICAgICBmb3JjZUFsbG93TmV3VXBsb2FkOiB0cnVlLCAvLyBjcmVhdGUgbmV3IHVwbG9hZCBldmVuIGlmIGFsbG93TmV3VXBsb2FkOiBmYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuI3J1blVwbG9hZCh1cGxvYWRJRClcbiAgfVxuXG4gIGNhbmNlbEFsbCAoKSB7XG4gICAgdGhpcy5lbWl0KCdjYW5jZWwtYWxsJylcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgZmlsZUlEcyA9IE9iamVjdC5rZXlzKGZpbGVzKVxuICAgIGlmIChmaWxlSURzLmxlbmd0aCkge1xuICAgICAgdGhpcy5yZW1vdmVGaWxlcyhmaWxlSURzLCAnY2FuY2VsLWFsbCcpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0b3RhbFByb2dyZXNzOiAwLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICByZWNvdmVyZWRTdGF0ZTogbnVsbCxcbiAgICB9KVxuICB9XG5cbiAgcmV0cnlVcGxvYWQgKGZpbGVJRCkge1xuICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgndXBsb2FkLXJldHJ5JywgZmlsZUlEKVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQoW2ZpbGVJRF0sIHtcbiAgICAgIGZvcmNlQWxsb3dOZXdVcGxvYWQ6IHRydWUsIC8vIGNyZWF0ZSBuZXcgdXBsb2FkIGV2ZW4gaWYgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy4jcnVuVXBsb2FkKHVwbG9hZElEKVxuICB9XG5cbiAgcmVzZXQgKCkge1xuICAgIHRoaXMuY2FuY2VsQWxsKClcbiAgfVxuXG4gIGxvZ291dCAoKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgaWYgKHBsdWdpbi5wcm92aWRlciAmJiBwbHVnaW4ucHJvdmlkZXIubG9nb3V0KSB7XG4gICAgICAgIHBsdWdpbi5wcm92aWRlci5sb2dvdXQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjYWxjdWxhdGVQcm9ncmVzcyAoZmlsZSwgZGF0YSkge1xuICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gYnl0ZXNUb3RhbCBtYXkgYmUgbnVsbCBvciB6ZXJvOyBpbiB0aGF0IGNhc2Ugd2UgY2FuJ3QgZGl2aWRlIGJ5IGl0XG4gICAgY29uc3QgY2FuSGF2ZVBlcmNlbnRhZ2UgPSBOdW1iZXIuaXNGaW5pdGUoZGF0YS5ieXRlc1RvdGFsKSAmJiBkYXRhLmJ5dGVzVG90YWwgPiAwXG4gICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgLi4udGhpcy5nZXRGaWxlKGZpbGUuaWQpLnByb2dyZXNzLFxuICAgICAgICBieXRlc1VwbG9hZGVkOiBkYXRhLmJ5dGVzVXBsb2FkZWQsXG4gICAgICAgIGJ5dGVzVG90YWw6IGRhdGEuYnl0ZXNUb3RhbCxcbiAgICAgICAgcGVyY2VudGFnZTogY2FuSGF2ZVBlcmNlbnRhZ2VcbiAgICAgICAgICA/IE1hdGgucm91bmQoKGRhdGEuYnl0ZXNVcGxvYWRlZCAvIGRhdGEuYnl0ZXNUb3RhbCkgKiAxMDApXG4gICAgICAgICAgOiAwLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MgKCkge1xuICAgIC8vIGNhbGN1bGF0ZSB0b3RhbCBwcm9ncmVzcywgdXNpbmcgdGhlIG51bWJlciBvZiBmaWxlcyBjdXJyZW50bHkgdXBsb2FkaW5nLFxuICAgIC8vIG11bHRpcGxpZWQgYnkgMTAwIGFuZCB0aGUgc3VtbSBvZiBpbmRpdmlkdWFsIHByb2dyZXNzIG9mIGVhY2ggZmlsZVxuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRGaWxlcygpXG5cbiAgICBjb25zdCBpblByb2dyZXNzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgICAgIHx8IGZpbGUucHJvZ3Jlc3MucHJlcHJvY2Vzc1xuICAgICAgICB8fCBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG4gICAgfSlcblxuICAgIGlmIChpblByb2dyZXNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIDApXG4gICAgICB0aGlzLnNldFN0YXRlKHsgdG90YWxQcm9ncmVzczogMCB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc2l6ZWRGaWxlcyA9IGluUHJvZ3Jlc3MuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLmJ5dGVzVG90YWwgIT0gbnVsbClcbiAgICBjb25zdCB1bnNpemVkRmlsZXMgPSBpblByb2dyZXNzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy5ieXRlc1RvdGFsID09IG51bGwpXG5cbiAgICBpZiAoc2l6ZWRGaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzTWF4ID0gaW5Qcm9ncmVzcy5sZW5ndGggKiAxMDBcbiAgICAgIGNvbnN0IGN1cnJlbnRQcm9ncmVzcyA9IHVuc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjICsgZmlsZS5wcm9ncmVzcy5wZXJjZW50YWdlXG4gICAgICB9LCAwKVxuICAgICAgY29uc3QgdG90YWxQcm9ncmVzcyA9IE1hdGgucm91bmQoKGN1cnJlbnRQcm9ncmVzcyAvIHByb2dyZXNzTWF4KSAqIDEwMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgdG90YWxTaXplID0gc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuIGFjYyArIGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbFxuICAgIH0sIDApXG4gICAgY29uc3QgYXZlcmFnZVNpemUgPSB0b3RhbFNpemUgLyBzaXplZEZpbGVzLmxlbmd0aFxuICAgIHRvdGFsU2l6ZSArPSBhdmVyYWdlU2l6ZSAqIHVuc2l6ZWRGaWxlcy5sZW5ndGhcblxuICAgIGxldCB1cGxvYWRlZFNpemUgPSAwXG4gICAgc2l6ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB1cGxvYWRlZFNpemUgKz0gZmlsZS5wcm9ncmVzcy5ieXRlc1VwbG9hZGVkXG4gICAgfSlcbiAgICB1bnNpemVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgdXBsb2FkZWRTaXplICs9IChhdmVyYWdlU2l6ZSAqIChmaWxlLnByb2dyZXNzLnBlcmNlbnRhZ2UgfHwgMCkpIC8gMTAwXG4gICAgfSlcblxuICAgIGxldCB0b3RhbFByb2dyZXNzID0gdG90YWxTaXplID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogTWF0aC5yb3VuZCgodXBsb2FkZWRTaXplIC8gdG90YWxTaXplKSAqIDEwMClcblxuICAgIC8vIGhvdCBmaXgsIGJlY2F1c2U6XG4gICAgLy8gdXBsb2FkZWRTaXplIGVuZGVkIHVwIGxhcmdlciB0aGFuIHRvdGFsU2l6ZSwgcmVzdWx0aW5nIGluIDEzMjUlIHRvdGFsXG4gICAgaWYgKHRvdGFsUHJvZ3Jlc3MgPiAxMDApIHtcbiAgICAgIHRvdGFsUHJvZ3Jlc3MgPSAxMDBcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdG90YWxQcm9ncmVzcyB9KVxuICAgIHRoaXMuZW1pdCgncHJvZ3Jlc3MnLCB0b3RhbFByb2dyZXNzKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBsaXN0ZW5lcnMgZm9yIGFsbCBnbG9iYWwgYWN0aW9ucywgbGlrZTpcbiAgICogYGVycm9yYCwgYGZpbGUtcmVtb3ZlZGAsIGB1cGxvYWQtcHJvZ3Jlc3NgXG4gICAqL1xuICAjYWRkTGlzdGVuZXJzICgpIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbZmlsZV1cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3Jlc3BvbnNlXVxuICAgICAqL1xuICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnJvciwgZmlsZSwgcmVzcG9uc2UpID0+IHtcbiAgICAgIGxldCBlcnJvck1zZyA9IGVycm9yLm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InXG4gICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICBlcnJvck1zZyArPSBgICR7ZXJyb3IuZGV0YWlsc31gXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogZXJyb3JNc2cgfSlcblxuICAgICAgaWYgKGZpbGUgIT0gbnVsbCAmJiBmaWxlLmlkIGluIHRoaXMuZ2V0U3RhdGUoKS5maWxlcykge1xuICAgICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgICAgZXJyb3I6IGVycm9yTXNnLFxuICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub24oJ2Vycm9yJywgZXJyb3JIYW5kbGVyKVxuXG4gICAgdGhpcy5vbigndXBsb2FkLWVycm9yJywgKGZpbGUsIGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgZXJyb3JIYW5kbGVyKGVycm9yLCBmaWxlLCByZXNwb25zZSlcblxuICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcgJiYgZXJyb3IubWVzc2FnZSkge1xuICAgICAgICBjb25zdCBuZXdFcnJvciA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKVxuICAgICAgICBuZXdFcnJvci5kZXRhaWxzID0gZXJyb3IubWVzc2FnZVxuICAgICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICAgIG5ld0Vycm9yLmRldGFpbHMgKz0gYCAke2Vycm9yLmRldGFpbHN9YFxuICAgICAgICB9XG4gICAgICAgIG5ld0Vycm9yLm1lc3NhZ2UgPSB0aGlzLmkxOG4oJ2ZhaWxlZFRvVXBsb2FkJywgeyBmaWxlOiBmaWxlLm5hbWUgfSlcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhuZXdFcnJvciwge1xuICAgICAgICAgIHRocm93RXJyOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3coZXJyb3IsIHtcbiAgICAgICAgICB0aHJvd0VycjogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub24oJ3VwbG9hZCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtc3RhcnRlZCcsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICB1cGxvYWRTdGFydGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICAgICAgYnl0ZXNUb3RhbDogZmlsZS5zaXplLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkLXByb2dyZXNzJywgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcylcblxuICAgIHRoaXMub24oJ3VwbG9hZC1zdWNjZXNzJywgKGZpbGUsIHVwbG9hZFJlc3ApID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50UHJvZ3Jlc3MgPSB0aGlzLmdldEZpbGUoZmlsZS5pZCkucHJvZ3Jlc3NcbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICAuLi5jdXJyZW50UHJvZ3Jlc3MsXG4gICAgICAgICAgcG9zdHByb2Nlc3M6IHRoaXMuI3Bvc3RQcm9jZXNzb3JzLnNpemUgPiAwID8ge1xuICAgICAgICAgICAgbW9kZTogJ2luZGV0ZXJtaW5hdGUnLFxuICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiB0cnVlLFxuICAgICAgICAgIHBlcmNlbnRhZ2U6IDEwMCxcbiAgICAgICAgICBieXRlc1VwbG9hZGVkOiBjdXJyZW50UHJvZ3Jlc3MuYnl0ZXNUb3RhbCxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzcG9uc2U6IHVwbG9hZFJlc3AsXG4gICAgICAgIHVwbG9hZFVSTDogdXBsb2FkUmVzcC51cGxvYWRVUkwsXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlbW90ZSBwcm92aWRlcnMgc29tZXRpbWVzIGRvbid0IHRlbGwgdXMgdGhlIGZpbGUgc2l6ZSxcbiAgICAgIC8vIGJ1dCB3ZSBjYW4ga25vdyBob3cgbWFueSBieXRlcyB3ZSB1cGxvYWRlZCBvbmNlIHRoZSB1cGxvYWQgaXMgY29tcGxldGUuXG4gICAgICBpZiAoZmlsZS5zaXplID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICAgIHNpemU6IHVwbG9hZFJlc3AuYnl0ZXNVcGxvYWRlZCB8fCBjdXJyZW50UHJvZ3Jlc3MuYnl0ZXNUb3RhbCxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncHJlcHJvY2Vzcy1wcm9ncmVzcycsIChmaWxlLCBwcm9ncmVzcykgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIHByb2dyZXNzOiB7IC4uLnRoaXMuZ2V0RmlsZShmaWxlLmlkKS5wcm9ncmVzcywgcHJlcHJvY2VzczogcHJvZ3Jlc3MgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3ByZXByb2Nlc3MtY29tcGxldGUnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICAgIGZpbGVzW2ZpbGUuaWRdID0geyAuLi5maWxlc1tmaWxlLmlkXSwgcHJvZ3Jlc3M6IHsgLi4uZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MgfSB9XG4gICAgICBkZWxldGUgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MucHJlcHJvY2Vzc1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXMgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtcHJvZ3Jlc3MnLCAoZmlsZSwgcHJvZ3Jlc3MpID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczogeyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MsIHBvc3Rwcm9jZXNzOiBwcm9ncmVzcyB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtY29tcGxldGUnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBmaWxlcyA9IHtcbiAgICAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzLFxuICAgICAgfVxuICAgICAgZmlsZXNbZmlsZS5pZF0gPSB7XG4gICAgICAgIC4uLmZpbGVzW2ZpbGUuaWRdLFxuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgIC4uLmZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgZGVsZXRlIGZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlcyB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdyZXN0b3JlZCcsICgpID0+IHtcbiAgICAgIC8vIEZpbGVzIG1heSBoYXZlIGNoYW5nZWQtLWVuc3VyZSBwcm9ncmVzcyBpcyBzdGlsbCBhY2N1cmF0ZS5cbiAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG4gICAgfSlcblxuICAgIC8vIHNob3cgaW5mb3JtZXIgaWYgb2ZmbGluZVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHRoaXMuI3VwZGF0ZU9ubGluZVN0YXR1cylcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgc2V0VGltZW91dCh0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMsIDMwMDApXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlT25saW5lU3RhdHVzICgpIHtcbiAgICBjb25zdCBvbmxpbmVcbiAgICAgID0gdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lXG4gICAgICAgIDogdHJ1ZVxuICAgIGlmICghb25saW5lKSB7XG4gICAgICB0aGlzLmVtaXQoJ2lzLW9mZmxpbmUnKVxuICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignbm9JbnRlcm5ldENvbm5lY3Rpb24nKSwgJ2Vycm9yJywgMClcbiAgICAgIHRoaXMud2FzT2ZmbGluZSA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KCdpcy1vbmxpbmUnKVxuICAgICAgaWYgKHRoaXMud2FzT2ZmbGluZSkge1xuICAgICAgICB0aGlzLmVtaXQoJ2JhY2stb25saW5lJylcbiAgICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignY29ubmVjdGVkVG9JbnRlcm5ldCcpLCAnc3VjY2VzcycsIDMwMDApXG4gICAgICAgIHRoaXMud2FzT2ZmbGluZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgI3VwZGF0ZU9ubGluZVN0YXR1cyA9IHRoaXMudXBkYXRlT25saW5lU3RhdHVzLmJpbmQodGhpcylcblxuICBnZXRJRCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0cy5pZFxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHBsdWdpbiB3aXRoIENvcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBQbHVnaW4gb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0c10gb2JqZWN0IHdpdGggb3B0aW9ucyB0byBiZSBwYXNzZWQgdG8gUGx1Z2luXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IHNlbGYgZm9yIGNoYWluaW5nXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gIHVzZSAoUGx1Z2luLCBvcHRzKSB7XG4gICAgaWYgKHR5cGVvZiBQbHVnaW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGBFeHBlY3RlZCBhIHBsdWdpbiBjbGFzcywgYnV0IGdvdCAke1BsdWdpbiA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiBQbHVnaW59LmBcbiAgICAgICAgKyAnIFBsZWFzZSB2ZXJpZnkgdGhhdCB0aGUgcGx1Z2luIHdhcyBpbXBvcnRlZCBhbmQgc3BlbGxlZCBjb3JyZWN0bHkuJ1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgLy8gSW5zdGFudGlhdGVcbiAgICBjb25zdCBwbHVnaW4gPSBuZXcgUGx1Z2luKHRoaXMsIG9wdHMpXG4gICAgY29uc3QgcGx1Z2luSWQgPSBwbHVnaW4uaWRcblxuICAgIGlmICghcGx1Z2luSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBwbHVnaW4gbXVzdCBoYXZlIGFuIGlkJylcbiAgICB9XG5cbiAgICBpZiAoIXBsdWdpbi50eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGx1Z2luIG11c3QgaGF2ZSBhIHR5cGUnKVxuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0c1BsdWdpbkFscmVhZHkgPSB0aGlzLmdldFBsdWdpbihwbHVnaW5JZClcbiAgICBpZiAoZXhpc3RzUGx1Z2luQWxyZWFkeSkge1xuICAgICAgY29uc3QgbXNnID0gYEFscmVhZHkgZm91bmQgYSBwbHVnaW4gbmFtZWQgJyR7ZXhpc3RzUGx1Z2luQWxyZWFkeS5pZH0nLiBgXG4gICAgICAgICsgYFRyaWVkIHRvIHVzZTogJyR7cGx1Z2luSWR9Jy5cXG5gXG4gICAgICAgICsgJ1VwcHkgcGx1Z2lucyBtdXN0IGhhdmUgdW5pcXVlIGBpZGAgb3B0aW9ucy4gU2VlIGh0dHBzOi8vdXBweS5pby9kb2NzL3BsdWdpbnMvI2lkLidcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgaWYgKFBsdWdpbi5WRVJTSU9OKSB7XG4gICAgICB0aGlzLmxvZyhgVXNpbmcgJHtwbHVnaW5JZH0gdiR7UGx1Z2luLlZFUlNJT059YClcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnR5cGUgaW4gdGhpcy4jcGx1Z2lucykge1xuICAgICAgdGhpcy4jcGx1Z2luc1twbHVnaW4udHlwZV0ucHVzaChwbHVnaW4pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI3BsdWdpbnNbcGx1Z2luLnR5cGVdID0gW3BsdWdpbl1cbiAgICB9XG4gICAgcGx1Z2luLmluc3RhbGwoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIG9uZSBQbHVnaW4gYnkgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIHBsdWdpbiBpZFxuICAgKiBAcmV0dXJucyB7QmFzZVBsdWdpbnx1bmRlZmluZWR9XG4gICAqL1xuICBnZXRQbHVnaW4gKGlkKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW5zIG9mIE9iamVjdC52YWx1ZXModGhpcy4jcGx1Z2lucykpIHtcbiAgICAgIGNvbnN0IGZvdW5kUGx1Z2luID0gcGx1Z2lucy5maW5kKHBsdWdpbiA9PiBwbHVnaW4uaWQgPT09IGlkKVxuICAgICAgaWYgKGZvdW5kUGx1Z2luICE9IG51bGwpIHJldHVybiBmb3VuZFBsdWdpblxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICBbU3ltYm9sLmZvcigndXBweSB0ZXN0OiBnZXRQbHVnaW5zJyldICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuI3BsdWdpbnNbdHlwZV1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggYWxsIGB1c2VgZCBwbHVnaW5zLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCB3aWxsIGJlIHJ1biBvbiBlYWNoIHBsdWdpblxuICAgKi9cbiAgaXRlcmF0ZVBsdWdpbnMgKG1ldGhvZCkge1xuICAgIE9iamVjdC52YWx1ZXModGhpcy4jcGx1Z2lucykuZmxhdCgxKS5mb3JFYWNoKG1ldGhvZClcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYW5kIHJlbW92ZSBhIHBsdWdpbi5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGluc3RhbmNlIFRoZSBwbHVnaW4gaW5zdGFuY2UgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGx1Z2luIChpbnN0YW5jZSkge1xuICAgIHRoaXMubG9nKGBSZW1vdmluZyBwbHVnaW4gJHtpbnN0YW5jZS5pZH1gKVxuICAgIHRoaXMuZW1pdCgncGx1Z2luLXJlbW92ZScsIGluc3RhbmNlKVxuXG4gICAgaWYgKGluc3RhbmNlLnVuaW5zdGFsbCkge1xuICAgICAgaW5zdGFuY2UudW5pbnN0YWxsKClcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy4jcGx1Z2luc1tpbnN0YW5jZS50eXBlXVxuICAgIC8vIGxpc3QuaW5kZXhPZiBmYWlsZWQgaGVyZSwgYmVjYXVzZSBWdWUzIGNvbnZlcnRlZCB0aGUgcGx1Z2luIGluc3RhbmNlXG4gICAgLy8gdG8gYSBQcm94eSBvYmplY3QsIHdoaWNoIGZhaWxlZCB0aGUgc3RyaWN0IGNvbXBhcmlzb24gdGVzdDpcbiAgICAvLyBvYmogIT09IG9ialByb3h5XG4gICAgY29uc3QgaW5kZXggPSBsaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGluc3RhbmNlLmlkKVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZFN0YXRlID0ge1xuICAgICAgcGx1Z2luczoge1xuICAgICAgICAuLi5zdGF0ZS5wbHVnaW5zLFxuICAgICAgICBbaW5zdGFuY2UuaWRdOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHVwZGF0ZWRTdGF0ZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYWxsIHBsdWdpbnMgYW5kIGNsb3NlIGRvd24gdGhpcyBVcHB5IGluc3RhbmNlLlxuICAgKi9cbiAgY2xvc2UgKCkge1xuICAgIHRoaXMubG9nKGBDbG9zaW5nIFVwcHkgaW5zdGFuY2UgJHt0aGlzLm9wdHMuaWR9OiByZW1vdmluZyBhbGwgZmlsZXMgYW5kIHVuaW5zdGFsbGluZyBwbHVnaW5zYClcblxuICAgIHRoaXMucmVzZXQoKVxuXG4gICAgdGhpcy4jc3RvcmVVbnN1YnNjcmliZSgpXG5cbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKChwbHVnaW4pID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlUGx1Z2luKHBsdWdpbilcbiAgICB9KVxuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMpXG4gICAgfVxuICB9XG5cbiAgaGlkZUluZm8gKCkge1xuICAgIGNvbnN0IHsgaW5mbyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICB0aGlzLnNldFN0YXRlKHsgaW5mbzogaW5mby5zbGljZSgxKSB9KVxuXG4gICAgdGhpcy5lbWl0KCdpbmZvLWhpZGRlbicpXG4gIH1cblxuICAvKipcbiAgICogU2V0IGluZm8gbWVzc2FnZSBpbiBgc3RhdGUuaW5mb2AsIHNvIHRoYXQgVUkgcGx1Z2lucyBsaWtlIGBJbmZvcm1lcmBcbiAgICogY2FuIGRpc3BsYXkgdGhlIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgb2JqZWN0fSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGJ5IHRoZSBpbmZvcm1lclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb25dXG4gICAqL1xuICBpbmZvIChtZXNzYWdlLCB0eXBlID0gJ2luZm8nLCBkdXJhdGlvbiA9IDMwMDApIHtcbiAgICBjb25zdCBpc0NvbXBsZXhNZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGluZm86IFtcbiAgICAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmluZm8sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIG1lc3NhZ2U6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLm1lc3NhZ2UgOiBtZXNzYWdlLFxuICAgICAgICAgIGRldGFpbHM6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLmRldGFpbHMgOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZGVJbmZvKCksIGR1cmF0aW9uKVxuXG4gICAgdGhpcy5lbWl0KCdpbmZvLXZpc2libGUnKVxuICB9XG5cbiAgLyoqXG4gICAqIFBhc3NlcyBtZXNzYWdlcyB0byBhIGZ1bmN0aW9uLCBwcm92aWRlZCBpbiBgb3B0cy5sb2dnZXJgLlxuICAgKiBJZiBgb3B0cy5sb2dnZXI6IFVwcHkuZGVidWdMb2dnZXJgIG9yIGBvcHRzLmRlYnVnOiB0cnVlYCwgbG9ncyB0byB0aGUgYnJvd3NlciBjb25zb2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG1lc3NhZ2UgdG8gbG9nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gb3B0aW9uYWwgYGVycm9yYCBvciBgd2FybmluZ2BcbiAgICovXG4gIGxvZyAobWVzc2FnZSwgdHlwZSkge1xuICAgIGNvbnN0IHsgbG9nZ2VyIH0gPSB0aGlzLm9wdHNcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2Vycm9yJzogbG9nZ2VyLmVycm9yKG1lc3NhZ2UpOyBicmVha1xuICAgICAgY2FzZSAnd2FybmluZyc6IGxvZ2dlci53YXJuKG1lc3NhZ2UpOyBicmVha1xuICAgICAgZGVmYXVsdDogbG9nZ2VyLmRlYnVnKG1lc3NhZ2UpOyBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlIGFuIHVwbG9hZCBieSBpdHMgSUQuXG4gICAqL1xuICByZXN0b3JlICh1cGxvYWRJRCkge1xuICAgIHRoaXMubG9nKGBDb3JlOiBhdHRlbXB0aW5nIHRvIHJlc3RvcmUgdXBsb2FkIFwiJHt1cGxvYWRJRH1cImApXG5cbiAgICBpZiAoIXRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0pIHtcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vbmV4aXN0ZW50IHVwbG9hZCcpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHVwbG9hZCBmb3IgYSBidW5jaCBvZiBmaWxlcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBmaWxlSURzIEZpbGUgSURzIHRvIGluY2x1ZGUgaW4gdGhpcyB1cGxvYWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IElEIG9mIHRoaXMgdXBsb2FkLlxuICAgKi9cbiAgI2NyZWF0ZVVwbG9hZCAoZmlsZUlEcywgb3B0cyA9IHt9KSB7XG4gICAgLy8gdXBweS5yZXRyeUFsbCBzZXRzIHRoaXMgdG8gdHJ1ZSDigJQgd2hlbiByZXRyeWluZyB3ZSB3YW50IHRvIGlnbm9yZSBgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlYFxuICAgIGNvbnN0IHsgZm9yY2VBbGxvd05ld1VwbG9hZCA9IGZhbHNlIH0gPSBvcHRzXG5cbiAgICBjb25zdCB7IGFsbG93TmV3VXBsb2FkLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgaWYgKCFhbGxvd05ld1VwbG9hZCAmJiAhZm9yY2VBbGxvd05ld1VwbG9hZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHVwbG9hZDogYWxyZWFkeSB1cGxvYWRpbmcuJylcbiAgICB9XG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IG5hbm9pZCgpXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZCcsIHtcbiAgICAgIGlkOiB1cGxvYWRJRCxcbiAgICAgIGZpbGVJRHMsXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWxsb3dOZXdVcGxvYWQ6IHRoaXMub3B0cy5hbGxvd011bHRpcGxlVXBsb2FkQmF0Y2hlcyAhPT0gZmFsc2UgJiYgdGhpcy5vcHRzLmFsbG93TXVsdGlwbGVVcGxvYWRzICE9PSBmYWxzZSxcblxuICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgLi4uY3VycmVudFVwbG9hZHMsXG4gICAgICAgIFt1cGxvYWRJRF06IHtcbiAgICAgICAgICBmaWxlSURzLFxuICAgICAgICAgIHN0ZXA6IDAsXG4gICAgICAgICAgcmVzdWx0OiB7fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHJldHVybiB1cGxvYWRJRFxuICB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogY3JlYXRlVXBsb2FkJyldICguLi5hcmdzKSB7IHJldHVybiB0aGlzLiNjcmVhdGVVcGxvYWQoLi4uYXJncykgfVxuXG4gICNnZXRVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG4gIH1cblxuICAvKipcbiAgICogQWRkIGRhdGEgdG8gYW4gdXBsb2FkJ3MgcmVzdWx0IG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElEIFRoZSBJRCBvZiB0aGUgdXBsb2FkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBEYXRhIHByb3BlcnRpZXMgdG8gYWRkIHRvIHRoZSByZXN1bHQgb2JqZWN0LlxuICAgKi9cbiAgYWRkUmVzdWx0RGF0YSAodXBsb2FkSUQsIGRhdGEpIHtcbiAgICBpZiAoIXRoaXMuI2dldFVwbG9hZCh1cGxvYWRJRCkpIHtcbiAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7dXBsb2FkSUR9YClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICBjb25zdCBjdXJyZW50VXBsb2FkID0geyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sIHJlc3VsdDogeyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0ucmVzdWx0LCAuLi5kYXRhIH0gfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVwbG9hZHM6IHsgLi4uY3VycmVudFVwbG9hZHMsIFt1cGxvYWRJRF06IGN1cnJlbnRVcGxvYWQgfSxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiB1cGxvYWQsIGVnLiBpZiBpdCBoYXMgYmVlbiBjYW5jZWxlZCBvciBjb21wbGV0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJRCBUaGUgSUQgb2YgdGhlIHVwbG9hZC5cbiAgICovXG4gICNyZW1vdmVVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgY3VycmVudFVwbG9hZHMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2FkcyB9XG4gICAgZGVsZXRlIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VXBsb2FkcyxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1biBhbiB1cGxvYWQuIFRoaXMgcGlja3MgdXAgd2hlcmUgaXQgbGVmdCBvZmYgaW4gY2FzZSB0aGUgdXBsb2FkIGlzIGJlaW5nIHJlc3RvcmVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgI3J1blVwbG9hZCAodXBsb2FkSUQpIHtcbiAgICBsZXQgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgbGV0IGN1cnJlbnRVcGxvYWQgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICBjb25zdCByZXN0b3JlU3RlcCA9IGN1cnJlbnRVcGxvYWQuc3RlcCB8fCAwXG5cbiAgICBjb25zdCBzdGVwcyA9IFtcbiAgICAgIC4uLnRoaXMuI3ByZVByb2Nlc3NvcnMsXG4gICAgICAuLi50aGlzLiN1cGxvYWRlcnMsXG4gICAgICAuLi50aGlzLiNwb3N0UHJvY2Vzc29ycyxcbiAgICBdXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobGV0IHN0ZXAgPSByZXN0b3JlU3RlcDsgc3RlcCA8IHN0ZXBzLmxlbmd0aDsgc3RlcCsrKSB7XG4gICAgICAgIGlmICghY3VycmVudFVwbG9hZCkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZm4gPSBzdGVwc1tzdGVwXVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRVcGxvYWQgPSB7XG4gICAgICAgICAgLi4uY3VycmVudFVwbG9hZCxcbiAgICAgICAgICBzdGVwLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgICAgIC4uLmN1cnJlbnRVcGxvYWRzLFxuICAgICAgICAgICAgW3VwbG9hZElEXTogdXBkYXRlZFVwbG9hZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRPRE8gZ2l2ZSB0aGlzIHRoZSBgdXBkYXRlZFVwbG9hZGAgb2JqZWN0IGFzIGl0cyBvbmx5IHBhcmFtZXRlciBtYXliZT9cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdoZW4gbW9yZSBtZXRhZGF0YSBtYXkgYmUgYWRkZWQgdG8gdGhlIHVwbG9hZCB0aGlzIHdvdWxkIGtlZXAgZ2V0dGluZyBtb3JlIHBhcmFtZXRlcnNcbiAgICAgICAgYXdhaXQgZm4odXBkYXRlZFVwbG9hZC5maWxlSURzLCB1cGxvYWRJRClcblxuICAgICAgICAvLyBVcGRhdGUgY3VycmVudFVwbG9hZCB2YWx1ZSBpbiBjYXNlIGl0IHdhcyBtb2RpZmllZCBhc3luY2hyb25vdXNseS5cbiAgICAgICAgY3VycmVudFVwbG9hZHMgPSB0aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHNcbiAgICAgICAgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICAgIHRocm93IGVyclxuICAgIH1cblxuICAgIC8vIFNldCByZXN1bHQgZGF0YS5cbiAgICBpZiAoY3VycmVudFVwbG9hZCkge1xuICAgICAgLy8gTWFyayBwb3N0cHJvY2Vzc2luZyBzdGVwIGFzIGNvbXBsZXRlIGlmIG5lY2Vzc2FyeTsgdGhpcyBhZGRyZXNzZXMgYSBjYXNlIHdoZXJlIHdlIG1pZ2h0IGdldFxuICAgICAgLy8gc3R1Y2sgaW4gdGhlIHBvc3Rwcm9jZXNzaW5nIFVJIHdoaWxlIHRoZSB1cGxvYWQgaXMgZnVsbHkgY29tcGxldGUuXG4gICAgICAvLyBJZiB0aGUgcG9zdHByb2Nlc3Npbmcgc3RlcHMgZG8gbm90IGRvIGFueSB3b3JrLCB0aGV5IG1heSBub3QgZW1pdCBwb3N0cHJvY2Vzc2luZyBldmVudHMgYXRcbiAgICAgIC8vIGFsbCwgYW5kIG5ldmVyIG1hcmsgdGhlIHBvc3Rwcm9jZXNzaW5nIGFzIGNvbXBsZXRlLiBUaGlzIGlzIGZpbmUgb24gaXRzIG93biBidXQgd2VcbiAgICAgIC8vIGludHJvZHVjZWQgY29kZSBpbiB0aGUgQHVwcHkvY29yZSB1cGxvYWQtc3VjY2VzcyBoYW5kbGVyIHRvIHByZXBhcmUgcG9zdHByb2Nlc3NpbmcgcHJvZ3Jlc3NcbiAgICAgIC8vIHN0YXRlIGlmIGFueSBwb3N0cHJvY2Vzc29ycyBhcmUgcmVnaXN0ZXJlZC4gVGhhdCBpcyB0byBhdm9pZCBhIFwiZmxhc2ggb2YgY29tcGxldGVkIHN0YXRlXCJcbiAgICAgIC8vIGJlZm9yZSB0aGUgcG9zdHByb2Nlc3NpbmcgcGx1Z2lucyBjYW4gZW1pdCBldmVudHMuXG4gICAgICAvL1xuICAgICAgLy8gU28sIGp1c3QgaW4gY2FzZSBhbiB1cGxvYWQgd2l0aCBwb3N0cHJvY2Vzc2luZyBwbHVnaW5zICpoYXMqIGNvbXBsZXRlZCAqd2l0aG91dCogZW1pdHRpbmdcbiAgICAgIC8vIHBvc3Rwcm9jZXNzaW5nIGNvbXBsZXRpb24sIHdlIGRvIGl0IGluc3RlYWQuXG4gICAgICBjdXJyZW50VXBsb2FkLmZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmdldEZpbGUoZmlsZUlEKVxuICAgICAgICBpZiAoZmlsZSAmJiBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwb3N0cHJvY2Vzcy1jb21wbGV0ZScsIGZpbGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGZpbGVzID0gY3VycmVudFVwbG9hZC5maWxlSURzLm1hcCgoZmlsZUlEKSA9PiB0aGlzLmdldEZpbGUoZmlsZUlEKSlcbiAgICAgIGNvbnN0IHN1Y2Nlc3NmdWwgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLmVycm9yKVxuICAgICAgY29uc3QgZmFpbGVkID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmVycm9yKVxuICAgICAgYXdhaXQgdGhpcy5hZGRSZXN1bHREYXRhKHVwbG9hZElELCB7IHN1Y2Nlc3NmdWwsIGZhaWxlZCwgdXBsb2FkSUQgfSlcblxuICAgICAgLy8gVXBkYXRlIGN1cnJlbnRVcGxvYWQgdmFsdWUgaW4gY2FzZSBpdCB3YXMgbW9kaWZpZWQgYXN5bmNocm9ub3VzbHkuXG4gICAgICBjdXJyZW50VXBsb2FkcyA9IHRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1xuICAgICAgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgIH1cbiAgICAvLyBFbWl0IGNvbXBsZXRpb24gZXZlbnRzLlxuICAgIC8vIFRoaXMgaXMgaW4gYSBzZXBhcmF0ZSBmdW5jdGlvbiBzbyB0aGF0IHRoZSBgY3VycmVudFVwbG9hZHNgIHZhcmlhYmxlXG4gICAgLy8gYWx3YXlzIHJlZmVycyB0byB0aGUgbGF0ZXN0IHN0YXRlLiBJbiB0aGUgaGFuZGxlciByaWdodCBhYm92ZSBpdCByZWZlcnNcbiAgICAvLyB0byBhbiBvdXRkYXRlZCBvYmplY3Qgd2l0aG91dCB0aGUgYC5yZXN1bHRgIHByb3BlcnR5LlxuICAgIGxldCByZXN1bHRcbiAgICBpZiAoY3VycmVudFVwbG9hZCkge1xuICAgICAgcmVzdWx0ID0gY3VycmVudFVwbG9hZC5yZXN1bHRcbiAgICAgIHRoaXMuZW1pdCgnY29tcGxldGUnLCByZXN1bHQpXG5cbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcmVzdWx0IGZvciBhbiB1cGxvYWQgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke3VwbG9hZElEfWApXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhbiB1cGxvYWQgZm9yIGFsbCB0aGUgZmlsZXMgdGhhdCBhcmUgbm90IGN1cnJlbnRseSBiZWluZyB1cGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICB1cGxvYWQgKCkge1xuICAgIGlmICghdGhpcy4jcGx1Z2lucy51cGxvYWRlcj8ubGVuZ3RoKSB7XG4gICAgICB0aGlzLmxvZygnTm8gdXBsb2FkZXIgdHlwZSBwbHVnaW5zIGFyZSB1c2VkJywgJ3dhcm5pbmcnKVxuICAgIH1cblxuICAgIGxldCB7IGZpbGVzIH0gPSB0aGlzLmdldFN0YXRlKClcblxuICAgIGNvbnN0IG9uQmVmb3JlVXBsb2FkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlVXBsb2FkKGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlVXBsb2FkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm90IHN0YXJ0aW5nIHRoZSB1cGxvYWQgYmVjYXVzZSBvbkJlZm9yZVVwbG9hZCByZXR1cm5lZCBmYWxzZScpKVxuICAgIH1cblxuICAgIGlmIChvbkJlZm9yZVVwbG9hZFJlc3VsdCAmJiB0eXBlb2Ygb25CZWZvcmVVcGxvYWRSZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBmaWxlcyA9IG9uQmVmb3JlVXBsb2FkUmVzdWx0XG4gICAgICAvLyBVcGRhdGluZyBmaWxlcyBpbiBzdGF0ZSwgYmVjYXVzZSB1cGxvYWRlciBwbHVnaW5zIHJlY2VpdmUgZmlsZSBJRHMsXG4gICAgICAvLyBhbmQgdGhlbiBmZXRjaCB0aGUgYWN0dWFsIGZpbGUgb2JqZWN0IGZyb20gc3RhdGVcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmaWxlcyxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuI2NoZWNrTWluTnVtYmVyT2ZGaWxlcyhmaWxlcylcbiAgICAgICAgdGhpcy4jY2hlY2tSZXF1aXJlZE1ldGFGaWVsZHMoZmlsZXMpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICAgICAgLy8gZ2V0IGEgbGlzdCBvZiBmaWxlcyB0aGF0IGFyZSBjdXJyZW50bHkgYXNzaWduZWQgdG8gdXBsb2Fkc1xuICAgICAgICBjb25zdCBjdXJyZW50bHlVcGxvYWRpbmdGaWxlcyA9IE9iamVjdC52YWx1ZXMoY3VycmVudFVwbG9hZHMpLmZsYXRNYXAoY3VyciA9PiBjdXJyLmZpbGVJRHMpXG5cbiAgICAgICAgY29uc3Qgd2FpdGluZ0ZpbGVJRHMgPSBbXVxuICAgICAgICBPYmplY3Qua2V5cyhmaWxlcykuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpXG4gICAgICAgICAgLy8gaWYgdGhlIGZpbGUgaGFzbid0IHN0YXJ0ZWQgdXBsb2FkaW5nIGFuZCBoYXNuJ3QgYWxyZWFkeSBiZWVuIGFzc2lnbmVkIHRvIGFuIHVwbG9hZC4uXG4gICAgICAgICAgaWYgKCghZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkKSAmJiAoY3VycmVudGx5VXBsb2FkaW5nRmlsZXMuaW5kZXhPZihmaWxlSUQpID09PSAtMSkpIHtcbiAgICAgICAgICAgIHdhaXRpbmdGaWxlSURzLnB1c2goZmlsZS5pZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQod2FpdGluZ0ZpbGVJRHMpXG4gICAgICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHtcbiAgICAgICAgICBzaG93SW5mb3JtZXI6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwcHlcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWUgKGZpbGVUeXBlLCBmaWxlRGVzY3JpcHRvcikge1xuICBpZiAoZmlsZURlc2NyaXB0b3IubmFtZSkge1xuICAgIHJldHVybiBmaWxlRGVzY3JpcHRvci5uYW1lXG4gIH1cblxuICBpZiAoZmlsZVR5cGUuc3BsaXQoJy8nKVswXSA9PT0gJ2ltYWdlJykge1xuICAgIHJldHVybiBgJHtmaWxlVHlwZS5zcGxpdCgnLycpWzBdfS4ke2ZpbGVUeXBlLnNwbGl0KCcvJylbMV19YFxuICB9XG5cbiAgcmV0dXJuICdub25hbWUnXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgVXBweSA9IHJlcXVpcmUoJy4vVXBweScpXG5jb25zdCBVSVBsdWdpbiA9IHJlcXVpcmUoJy4vVUlQbHVnaW4nKVxuY29uc3QgQmFzZVBsdWdpbiA9IHJlcXVpcmUoJy4vQmFzZVBsdWdpbicpXG5jb25zdCB7IGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwcHlcbm1vZHVsZS5leHBvcnRzLlVwcHkgPSBVcHB5XG5tb2R1bGUuZXhwb3J0cy5VSVBsdWdpbiA9IFVJUGx1Z2luXG5tb2R1bGUuZXhwb3J0cy5CYXNlUGx1Z2luID0gQmFzZVBsdWdpblxubW9kdWxlLmV4cG9ydHMuZGVidWdMb2dnZXIgPSBkZWJ1Z0xvZ2dlclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuY29uc3QgZ2V0VGltZVN0YW1wID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldFRpbWVTdGFtcCcpXG5cbi8vIFN3YWxsb3cgYWxsIGxvZ3MsIGV4Y2VwdCBlcnJvcnMuXG4vLyBkZWZhdWx0IGlmIGxvZ2dlciBpcyBub3Qgc2V0IG9yIGRlYnVnOiBmYWxzZVxuY29uc3QganVzdEVycm9yc0xvZ2dlciA9IHtcbiAgZGVidWc6ICgpID0+IHt9LFxuICB3YXJuOiAoKSA9PiB7fSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBjb25zb2xlLmVycm9yKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxufVxuXG4vLyBQcmludCBsb2dzIHRvIGNvbnNvbGUgd2l0aCBuYW1lc3BhY2UgKyB0aW1lc3RhbXAsXG4vLyBzZXQgYnkgbG9nZ2VyOiBVcHB5LmRlYnVnTG9nZ2VyIG9yIGRlYnVnOiB0cnVlXG5jb25zdCBkZWJ1Z0xvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiBjb25zb2xlLmRlYnVnKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICB3YXJuOiAoLi4uYXJncykgPT4gY29uc29sZS53YXJuKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IGNvbnNvbGUuZXJyb3IoYFtVcHB5XSBbJHtnZXRUaW1lU3RhbXAoKX1dYCwgLi4uYXJncyksXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBqdXN0RXJyb3JzTG9nZ2VyLFxuICBkZWJ1Z0xvZ2dlcixcbn1cbiIsIi8vIEVkZ2UgMTUueCBkb2VzIG5vdCBmaXJlICdwcm9ncmVzcycgZXZlbnRzIG9uIHVwbG9hZHMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkvaXNzdWVzLzk0NVxuLy8gQW5kIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEyMjI0NTEwL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzICh1c2VyQWdlbnQpIHtcbiAgLy8gQWxsb3cgcGFzc2luZyBpbiB1c2VyQWdlbnQgZm9yIHRlc3RzXG4gIGlmICh1c2VyQWdlbnQgPT0gbnVsbCkge1xuICAgIHVzZXJBZ2VudCA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnID8gbmF2aWdhdG9yLnVzZXJBZ2VudCA6IG51bGxcbiAgfVxuICAvLyBBc3N1bWUgaXQgd29ya3MgYmVjYXVzZSBiYXNpY2FsbHkgZXZlcnl0aGluZyBzdXBwb3J0cyBwcm9ncmVzcyBldmVudHMuXG4gIGlmICghdXNlckFnZW50KSByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IG0gPSAvRWRnZVxcLyhcXGQrXFwuXFxkKykvLmV4ZWModXNlckFnZW50KVxuICBpZiAoIW0pIHJldHVybiB0cnVlXG5cbiAgY29uc3QgZWRnZVZlcnNpb24gPSBtWzFdXG4gIGxldCBbbWFqb3IsIG1pbm9yXSA9IGVkZ2VWZXJzaW9uLnNwbGl0KCcuJylcbiAgbWFqb3IgPSBwYXJzZUludChtYWpvciwgMTApXG4gIG1pbm9yID0gcGFyc2VJbnQobWlub3IsIDEwKVxuXG4gIC8vIFdvcmtlZCBiZWZvcmU6XG4gIC8vIEVkZ2UgNDAuMTUwNjMuMC4wXG4gIC8vIE1pY3Jvc29mdCBFZGdlSFRNTCAxNS4xNTA2M1xuICBpZiAobWFqb3IgPCAxNSB8fCAobWFqb3IgPT09IDE1ICYmIG1pbm9yIDwgMTUwNjMpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8vIEZpeGVkIGluOlxuICAvLyBNaWNyb3NvZnQgRWRnZUhUTUwgMTguMTgyMThcbiAgaWYgKG1ham9yID4gMTggfHwgKG1ham9yID09PSAxOCAmJiBtaW5vciA+PSAxODIxOCkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8gb3RoZXIgdmVyc2lvbnMgZG9uJ3Qgd29yay5cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCJjb25zdCB7IFVJUGx1Z2luIH0gPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IHRvQXJyYXkgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvdG9BcnJheScpXG5jb25zdCB7IGggfSA9IHJlcXVpcmUoJ3ByZWFjdCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRmlsZUlucHV0IGV4dGVuZHMgVUlQbHVnaW4ge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy5pZCA9IHRoaXMub3B0cy5pZCB8fCAnRmlsZUlucHV0J1xuICAgIHRoaXMudGl0bGUgPSAnRmlsZSBJbnB1dCdcbiAgICB0aGlzLnR5cGUgPSAnYWNxdWlyZXInXG5cbiAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7XG4gICAgICAgIC8vIFRoZSBzYW1lIGtleSBpcyB1c2VkIGZvciB0aGUgc2FtZSBwdXJwb3NlIGJ5IEB1cHB5L3JvYm9kb2cncyBgZm9ybSgpYCBBUEksIGJ1dCBvdXJcbiAgICAgICAgLy8gbG9jYWxlIHBhY2sgc2NyaXB0cyBjYW4ndCBhY2Nlc3MgaXQgaW4gUm9ib2RvZy4gSWYgaXQgaXMgdXBkYXRlZCBoZXJlLCBpdCBzaG91bGRcbiAgICAgICAgLy8gYWxzbyBiZSB1cGRhdGVkIHRoZXJlIVxuICAgICAgICBjaG9vc2VGaWxlczogJ0Nob29zZSBmaWxlcycsXG4gICAgICB9LFxuICAgIH1cblxuICAgIC8vIERlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgcHJldHR5OiB0cnVlLFxuICAgICAgaW5wdXROYW1lOiAnZmlsZXNbXScsXG4gICAgfVxuXG4gICAgLy8gTWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXJcbiAgICB0aGlzLm9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH1cblxuICAgIHRoaXMuaTE4bkluaXQoKVxuXG4gICAgdGhpcy5yZW5kZXIgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVJbnB1dENoYW5nZSA9IHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcylcbiAgfVxuXG4gIGFkZEZpbGVzIChmaWxlcykge1xuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gZmlsZXMubWFwKChmaWxlKSA9PiAoe1xuICAgICAgc291cmNlOiB0aGlzLmlkLFxuICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgdHlwZTogZmlsZS50eXBlLFxuICAgICAgZGF0YTogZmlsZSxcbiAgICB9KSlcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnVwcHkuYWRkRmlsZXMoZGVzY3JpcHRvcnMpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGVycilcbiAgICB9XG4gIH1cblxuICBoYW5kbGVJbnB1dENoYW5nZSAoZXZlbnQpIHtcbiAgICB0aGlzLnVwcHkubG9nKCdbRmlsZUlucHV0XSBTb21ldGhpbmcgc2VsZWN0ZWQgdGhyb3VnaCBpbnB1dC4uLicpXG4gICAgY29uc3QgZmlsZXMgPSB0b0FycmF5KGV2ZW50LnRhcmdldC5maWxlcylcbiAgICB0aGlzLmFkZEZpbGVzKGZpbGVzKVxuXG4gICAgLy8gV2UgY2xlYXIgdGhlIGlucHV0IGFmdGVyIGEgZmlsZSBpcyBzZWxlY3RlZCwgYmVjYXVzZSBvdGhlcndpc2VcbiAgICAvLyBjaGFuZ2UgZXZlbnQgaXMgbm90IGZpcmVkIGluIENocm9tZSBhbmQgU2FmYXJpIHdoZW4gYSBmaWxlXG4gICAgLy8gd2l0aCB0aGUgc2FtZSBuYW1lIGlzIHNlbGVjdGVkLlxuICAgIC8vIF9fX1doeSBub3QgdXNlIHZhbHVlPVwiXCIgb24gPGlucHV0Lz4gaW5zdGVhZD9cbiAgICAvLyAgICBCZWNhdXNlIGlmIHdlIHVzZSB0aGF0IG1ldGhvZCBvZiBjbGVhcmluZyB0aGUgaW5wdXQsXG4gICAgLy8gICAgQ2hyb21lIHdpbGwgbm90IHRyaWdnZXIgY2hhbmdlIGlmIHdlIGRyb3AgdGhlIHNhbWUgZmlsZSB0d2ljZSAoSXNzdWUgIzc2OCkuXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gbnVsbFxuICB9XG5cbiAgaGFuZGxlQ2xpY2sgKCkge1xuICAgIHRoaXMuaW5wdXQuY2xpY2soKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICAvKiBodHRwOi8vdHltcGFudXMubmV0L2NvZHJvcHMvMjAxNS8wOS8xNS9zdHlsaW5nLWN1c3RvbWl6aW5nLWZpbGUtaW5wdXRzLXNtYXJ0LXdheS8gKi9cbiAgICBjb25zdCBoaWRkZW5JbnB1dFN0eWxlID0ge1xuICAgICAgd2lkdGg6ICcwLjFweCcsXG4gICAgICBoZWlnaHQ6ICcwLjFweCcsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB6SW5kZXg6IC0xLFxuICAgIH1cblxuICAgIGNvbnN0IHsgcmVzdHJpY3Rpb25zIH0gPSB0aGlzLnVwcHkub3B0c1xuICAgIGNvbnN0IGFjY2VwdCA9IHJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzID8gcmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXMuam9pbignLCcpIDogbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1Sb290IHVwcHktRmlsZUlucHV0LWNvbnRhaW5lclwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJ1cHB5LUZpbGVJbnB1dC1pbnB1dFwiXG4gICAgICAgICAgc3R5bGU9e3RoaXMub3B0cy5wcmV0dHkgJiYgaGlkZGVuSW5wdXRTdHlsZX1cbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgbmFtZT17dGhpcy5vcHRzLmlucHV0TmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dENoYW5nZX1cbiAgICAgICAgICBtdWx0aXBsZT17cmVzdHJpY3Rpb25zLm1heE51bWJlck9mRmlsZXMgIT09IDF9XG4gICAgICAgICAgYWNjZXB0PXthY2NlcHR9XG4gICAgICAgICAgcmVmPXsoaW5wdXQpID0+IHsgdGhpcy5pbnB1dCA9IGlucHV0IH19XG4gICAgICAgIC8+XG4gICAgICAgIHt0aGlzLm9wdHMucHJldHR5XG4gICAgICAgICAgJiYgKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInVwcHktRmlsZUlucHV0LWJ0blwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMuaTE4bignY2hvb3NlRmlsZXMnKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IHRoaXMub3B0c1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMubW91bnQodGFyZ2V0LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51bm1vdW50KClcbiAgfVxufVxuIiwiY29uc3QgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKVxuY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuY29uc3QgcHJldHRpZXJCeXRlcyA9IHJlcXVpcmUoJ0B0cmFuc2xvYWRpdC9wcmV0dGllci1ieXRlcycpXG5jb25zdCBwcmV0dHlFVEEgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvcHJldHR5RVRBJylcbmNvbnN0IHsgaCB9ID0gcmVxdWlyZSgncHJlYWN0JylcblxuY29uc3Qgc3RhdHVzQmFyU3RhdGVzID0gcmVxdWlyZSgnLi9TdGF0dXNCYXJTdGF0ZXMnKVxuXG5jb25zdCBET1QgPSBgXFx1MDBCN2BcbmNvbnN0IHJlbmRlckRvdCA9ICgpID0+IGAgJHtET1R9IGBcblxuZnVuY3Rpb24gVXBsb2FkQnRuIChwcm9wcykge1xuICBjb25zdCB7XG4gICAgbmV3RmlsZXMsXG4gICAgaXNVcGxvYWRTdGFydGVkLFxuICAgIHJlY292ZXJlZFN0YXRlLFxuICAgIGkxOG4sXG4gICAgdXBsb2FkU3RhdGUsXG4gICAgaXNTb21lR2hvc3QsXG4gICAgc3RhcnRVcGxvYWQsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHVwbG9hZEJ0bkNsYXNzTmFtZXMgPSBjbGFzc05hbWVzKFxuICAgICd1cHB5LXUtcmVzZXQnLFxuICAgICd1cHB5LWMtYnRuJyxcbiAgICAndXBweS1TdGF0dXNCYXItYWN0aW9uQnRuJyxcbiAgICAndXBweS1TdGF0dXNCYXItYWN0aW9uQnRuLS11cGxvYWQnLFxuICAgIHtcbiAgICAgICd1cHB5LWMtYnRuLXByaW1hcnknOiB1cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkcsXG4gICAgfSxcbiAgICB7ICd1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLWRpc2FibGVkJzogaXNTb21lR2hvc3QgfVxuICApXG5cbiAgY29uc3QgdXBsb2FkQnRuVGV4dFxuICAgID0gbmV3RmlsZXMgJiYgaXNVcGxvYWRTdGFydGVkICYmICFyZWNvdmVyZWRTdGF0ZVxuICAgICAgPyBpMThuKCd1cGxvYWRYTmV3RmlsZXMnLCB7IHNtYXJ0X2NvdW50OiBuZXdGaWxlcyB9KVxuICAgICAgOiBpMThuKCd1cGxvYWRYRmlsZXMnLCB7IHNtYXJ0X2NvdW50OiBuZXdGaWxlcyB9KVxuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e3VwbG9hZEJ0bkNsYXNzTmFtZXN9XG4gICAgICBhcmlhLWxhYmVsPXtpMThuKCd1cGxvYWRYRmlsZXMnLCB7IHNtYXJ0X2NvdW50OiBuZXdGaWxlcyB9KX1cbiAgICAgIG9uQ2xpY2s9e3N0YXJ0VXBsb2FkfVxuICAgICAgZGlzYWJsZWQ9e2lzU29tZUdob3N0fVxuICAgICAgZGF0YS11cHB5LXN1cGVyLWZvY3VzYWJsZVxuICAgID5cbiAgICAgIHt1cGxvYWRCdG5UZXh0fVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIFJldHJ5QnRuIChwcm9wcykge1xuICBjb25zdCB7IGkxOG4sIHVwcHkgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT1cInVwcHktdS1yZXNldCB1cHB5LWMtYnRuIHVwcHktU3RhdHVzQmFyLWFjdGlvbkJ0biB1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLXJldHJ5XCJcbiAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ3JldHJ5VXBsb2FkJyl9XG4gICAgICBvbkNsaWNrPXsoKSA9PiB1cHB5LnJldHJ5QWxsKCl9XG4gICAgICBkYXRhLXVwcHktc3VwZXItZm9jdXNhYmxlXG4gICAgPlxuICAgICAgPHN2Z1xuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgICAgIGNsYXNzTmFtZT1cInVwcHktYy1pY29uXCJcbiAgICAgICAgd2lkdGg9XCI4XCJcbiAgICAgICAgaGVpZ2h0PVwiMTBcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDggMTBcIlxuICAgICAgPlxuICAgICAgICA8cGF0aCBkPVwiTTQgMi40MDhhMi43NSAyLjc1IDAgMSAwIDIuNzUgMi43NS42MjYuNjI2IDAgMCAxIDEuMjUuMDE4di4wMjNhNCA0IDAgMSAxLTQtNC4wNDFWLjI1YS4yNS4yNSAwIDAgMSAuMzg5LS4yMDhsMi4yOTkgMS41MzNhLjI1LjI1IDAgMCAxIDAgLjQxNmwtMi4zIDEuNTMzQS4yNS4yNSAwIDAgMSA0IDMuMzE2di0uOTA4elwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICAgIHtpMThuKCdyZXRyeScpfVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIENhbmNlbEJ0biAocHJvcHMpIHtcbiAgY29uc3QgeyBpMThuLCB1cHB5IH0gPSBwcm9wc1xuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LXUtcmVzZXQgdXBweS1TdGF0dXNCYXItYWN0aW9uQ2lyY2xlQnRuXCJcbiAgICAgIHRpdGxlPXtpMThuKCdjYW5jZWwnKX1cbiAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ2NhbmNlbCcpfVxuICAgICAgb25DbGljaz17KCkgPT4gdXBweS5jYW5jZWxBbGwoKX1cbiAgICAgIGRhdGEtdXBweS1zdXBlci1mb2N1c2FibGVcbiAgICA+XG4gICAgICA8c3ZnXG4gICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICAgICAgY2xhc3NOYW1lPVwidXBweS1jLWljb25cIlxuICAgICAgICB3aWR0aD1cIjE2XCJcbiAgICAgICAgaGVpZ2h0PVwiMTZcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDE2IDE2XCJcbiAgICAgID5cbiAgICAgICAgPGcgZmlsbD1cIm5vbmVcIiBmaWxsUnVsZT1cImV2ZW5vZGRcIj5cbiAgICAgICAgICA8Y2lyY2xlIGZpbGw9XCIjODg4XCIgY3g9XCI4XCIgY3k9XCI4XCIgcj1cIjhcIiAvPlxuICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICBmaWxsPVwiI0ZGRlwiXG4gICAgICAgICAgICBkPVwiTTkuMjgzIDhsMi41NjcgMi41NjctMS4yODMgMS4yODNMOCA5LjI4MyA1LjQzMyAxMS44NSA0LjE1IDEwLjU2NyA2LjcxNyA4IDQuMTUgNS40MzMgNS40MzMgNC4xNSA4IDYuNzE3bDIuNTY3LTIuNTY3IDEuMjgzIDEuMjgzelwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9zdmc+XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuZnVuY3Rpb24gUGF1c2VSZXN1bWVCdXR0b24gKHByb3BzKSB7XG4gIGNvbnN0IHsgaXNBbGxQYXVzZWQsIGkxOG4sIGlzQWxsQ29tcGxldGUsIHJlc3VtYWJsZVVwbG9hZHMsIHVwcHkgfSA9IHByb3BzXG4gIGNvbnN0IHRpdGxlID0gaXNBbGxQYXVzZWQgPyBpMThuKCdyZXN1bWUnKSA6IGkxOG4oJ3BhdXNlJylcblxuICBmdW5jdGlvbiB0b2dnbGVQYXVzZVJlc3VtZSAoKSB7XG4gICAgaWYgKGlzQWxsQ29tcGxldGUpIHJldHVybiBudWxsXG5cbiAgICBpZiAoIXJlc3VtYWJsZVVwbG9hZHMpIHtcbiAgICAgIHJldHVybiB1cHB5LmNhbmNlbEFsbCgpXG4gICAgfVxuXG4gICAgaWYgKGlzQWxsUGF1c2VkKSB7XG4gICAgICByZXR1cm4gdXBweS5yZXN1bWVBbGwoKVxuICAgIH1cblxuICAgIHJldHVybiB1cHB5LnBhdXNlQWxsKClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgYXJpYS1sYWJlbD17dGl0bGV9XG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LXUtcmVzZXQgdXBweS1TdGF0dXNCYXItYWN0aW9uQ2lyY2xlQnRuXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgb25DbGljaz17dG9nZ2xlUGF1c2VSZXN1bWV9XG4gICAgICBkYXRhLXVwcHktc3VwZXItZm9jdXNhYmxlXG4gICAgPlxuICAgICAgPHN2Z1xuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgICAgIGNsYXNzTmFtZT1cInVwcHktYy1pY29uXCJcbiAgICAgICAgd2lkdGg9XCIxNlwiXG4gICAgICAgIGhlaWdodD1cIjE2XCJcbiAgICAgICAgdmlld0JveD1cIjAgMCAxNiAxNlwiXG4gICAgICA+XG4gICAgICAgIDxnIGZpbGw9XCJub25lXCIgZmlsbFJ1bGU9XCJldmVub2RkXCI+XG4gICAgICAgICAgPGNpcmNsZSBmaWxsPVwiIzg4OFwiIGN4PVwiOFwiIGN5PVwiOFwiIHI9XCI4XCIgLz5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZmlsbD1cIiNGRkZcIlxuICAgICAgICAgICAgZD17XG4gICAgICAgICAgICAgIGlzQWxsUGF1c2VkXG4gICAgICAgICAgICAgICAgPyAnTTYgNC4yNUwxMS41IDggNiAxMS43NXonXG4gICAgICAgICAgICAgICAgOiAnTTUgNC41aDJ2N0g1di03em00IDBoMnY3SDl2LTd6J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIERvbmVCdG4gKHByb3BzKSB7XG4gIGNvbnN0IHsgaTE4biwgZG9uZUJ1dHRvbkhhbmRsZXIgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT1cInVwcHktdS1yZXNldCB1cHB5LWMtYnRuIHVwcHktU3RhdHVzQmFyLWFjdGlvbkJ0biB1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLWRvbmVcIlxuICAgICAgb25DbGljaz17ZG9uZUJ1dHRvbkhhbmRsZXJ9XG4gICAgICBkYXRhLXVwcHktc3VwZXItZm9jdXNhYmxlXG4gICAgPlxuICAgICAge2kxOG4oJ2RvbmUnKX1cbiAgICA8L2J1dHRvbj5cbiAgKVxufVxuXG5mdW5jdGlvbiBMb2FkaW5nU3Bpbm5lciAoKSB7XG4gIHJldHVybiAoXG4gICAgPHN2Z1xuICAgICAgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3Bpbm5lclwiXG4gICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxuICAgICAgd2lkdGg9XCIxNFwiXG4gICAgICBoZWlnaHQ9XCIxNFwiXG4gICAgPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk0xMy45ODMgNi41NDdjLS4xMi0yLjUwOS0xLjY0LTQuODkzLTMuOTM5LTUuOTM2LTIuNDgtMS4xMjctNS40ODgtLjY1Ni03LjU1NiAxLjA5NEMuNTI0IDMuMzY3LS4zOTggNi4wNDguMTYyIDguNTYyYy41NTYgMi40OTUgMi40NiA0LjUyIDQuOTQgNS4xODMgMi45MzIuNzg0IDUuNjEtLjYwMiA3LjI1Ni0zLjAxNS0xLjQ5MyAxLjk5My0zLjc0NSAzLjMwOS02LjI5OCAyLjg2OC0yLjUxNC0uNDM0LTQuNTc4LTIuMzQ5LTUuMTUzLTQuODRhNi4yMjYgNi4yMjYgMCAwIDEgMi45OC02Ljc3OEM2LjM0LjU4NiA5Ljc0IDEuMSAxMS4zNzMgMy40OTNjLjQwNy41OTYuNjkzIDEuMjgyLjg0MiAxLjk4OC4xMjcuNTk4LjA3MyAxLjE5Ny4xNjEgMS43OTQuMDc4LjUyNS41NDMgMS4yNTcgMS4xNS44NjQuNTI1LS4zNDEuNDktMS4wNS40NTYtMS41OTItLjAwNy0uMTUuMDIuMyAwIDBcIlxuICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgLz5cbiAgICA8L3N2Zz5cbiAgKVxufVxuXG5mdW5jdGlvbiBQcm9ncmVzc0JhclByb2Nlc3NpbmcgKHByb3BzKSB7XG4gIGNvbnN0IHsgcHJvZ3Jlc3MgfSA9IHByb3BzXG4gIGNvbnN0IHsgdmFsdWUsIG1vZGUsIG1lc3NhZ2UgfSA9IHByb2dyZXNzXG4gIGNvbnN0IHJvdW5kZWRWYWx1ZSA9IE1hdGgucm91bmQodmFsdWUgKiAxMDApXG4gIGNvbnN0IGRvdCA9IGBcXHUwMEI3YFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1jb250ZW50XCI+XG4gICAgICA8TG9hZGluZ1NwaW5uZXIgLz5cbiAgICAgIHttb2RlID09PSAnZGV0ZXJtaW5hdGUnID8gYCR7cm91bmRlZFZhbHVlfSUgJHtkb3R9IGAgOiAnJ31cbiAgICAgIHttZXNzYWdlfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFByb2dyZXNzRGV0YWlscyAocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIG51bVVwbG9hZHMsXG4gICAgY29tcGxldGUsXG4gICAgdG90YWxVcGxvYWRlZFNpemUsXG4gICAgdG90YWxTaXplLFxuICAgIHRvdGFsRVRBLFxuICAgIGkxOG4sXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IGlmU2hvd0ZpbGVzVXBsb2FkZWRPZlRvdGFsID0gbnVtVXBsb2FkcyA+IDFcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3RhdHVzU2Vjb25kYXJ5XCI+XG4gICAgICB7aWZTaG93RmlsZXNVcGxvYWRlZE9mVG90YWxcbiAgICAgICAgJiYgaTE4bignZmlsZXNVcGxvYWRlZE9mVG90YWwnLCB7XG4gICAgICAgICAgY29tcGxldGUsXG4gICAgICAgICAgc21hcnRfY291bnQ6IG51bVVwbG9hZHMsXG4gICAgICAgIH0pfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItYWRkaXRpb25hbEluZm9cIj5cbiAgICAgICAgey8qIFdoZW4gc2hvdWxkIHdlIHJlbmRlciB0aGlzIGRvdD9cbiAgICAgICAgICAxLiAuLWFkZGl0aW9uYWxJbmZvIGlzIHNob3duIChoYXBwZW5zIG9ubHkgb24gZGVza3RvcHMpXG4gICAgICAgICAgMi4gQU5EICdmaWxlc1VwbG9hZGVkT2ZUb3RhbCcgd2FzIHNob3duXG4gICAgICAgICovfVxuICAgICAgICB7aWZTaG93RmlsZXNVcGxvYWRlZE9mVG90YWwgJiYgcmVuZGVyRG90KCl9XG5cbiAgICAgICAge2kxOG4oJ2RhdGFVcGxvYWRlZE9mVG90YWwnLCB7XG4gICAgICAgICAgY29tcGxldGU6IHByZXR0aWVyQnl0ZXModG90YWxVcGxvYWRlZFNpemUpLFxuICAgICAgICAgIHRvdGFsOiBwcmV0dGllckJ5dGVzKHRvdGFsU2l6ZSksXG4gICAgICAgIH0pfVxuXG4gICAgICAgIHtyZW5kZXJEb3QoKX1cblxuICAgICAgICB7aTE4bigneFRpbWVMZWZ0Jywge1xuICAgICAgICAgIHRpbWU6IHByZXR0eUVUQSh0b3RhbEVUQSksXG4gICAgICAgIH0pfVxuICAgICAgPC9zcGFuPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFVua25vd25Qcm9ncmVzc0RldGFpbHMgKHByb3BzKSB7XG4gIGNvbnN0IHsgaTE4biwgY29tcGxldGUsIG51bVVwbG9hZHMgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1NlY29uZGFyeVwiPlxuICAgICAge2kxOG4oJ2ZpbGVzVXBsb2FkZWRPZlRvdGFsJywgeyBjb21wbGV0ZSwgc21hcnRfY291bnQ6IG51bVVwbG9hZHMgfSl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gVXBsb2FkTmV3bHlBZGRlZEZpbGVzIChwcm9wcykge1xuICBjb25zdCB7IGkxOG4sIG5ld0ZpbGVzLCBzdGFydFVwbG9hZCB9ID0gcHJvcHNcbiAgY29uc3QgdXBsb2FkQnRuQ2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMoXG4gICAgJ3VwcHktdS1yZXNldCcsXG4gICAgJ3VwcHktYy1idG4nLFxuICAgICd1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4nLFxuICAgICd1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLXVwbG9hZE5ld2x5QWRkZWQnXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3RhdHVzU2Vjb25kYXJ5XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1NlY29uZGFyeUhpbnRcIj5cbiAgICAgICAge2kxOG4oJ3hNb3JlRmlsZXNBZGRlZCcsIHsgc21hcnRfY291bnQ6IG5ld0ZpbGVzIH0pfVxuICAgICAgPC9kaXY+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9e3VwbG9hZEJ0bkNsYXNzTmFtZXN9XG4gICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ3VwbG9hZFhGaWxlcycsIHsgc21hcnRfY291bnQ6IG5ld0ZpbGVzIH0pfVxuICAgICAgICBvbkNsaWNrPXtzdGFydFVwbG9hZH1cbiAgICAgID5cbiAgICAgICAge2kxOG4oJ3VwbG9hZCcpfVxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgVGhyb3R0bGVkUHJvZ3Jlc3NEZXRhaWxzID0gdGhyb3R0bGUoUHJvZ3Jlc3NEZXRhaWxzLCA1MDAsIHtcbiAgbGVhZGluZzogdHJ1ZSxcbiAgdHJhaWxpbmc6IHRydWUsXG59KVxuXG5mdW5jdGlvbiBQcm9ncmVzc0JhclVwbG9hZGluZyAocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIGkxOG4sXG4gICAgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyxcbiAgICB0b3RhbFByb2dyZXNzLFxuICAgIHNob3dQcm9ncmVzc0RldGFpbHMsXG4gICAgaXNVcGxvYWRTdGFydGVkLFxuICAgIGlzQWxsQ29tcGxldGUsXG4gICAgaXNBbGxQYXVzZWQsXG4gICAgbmV3RmlsZXMsXG4gICAgbnVtVXBsb2FkcyxcbiAgICBjb21wbGV0ZSxcbiAgICB0b3RhbFVwbG9hZGVkU2l6ZSxcbiAgICB0b3RhbFNpemUsXG4gICAgdG90YWxFVEEsXG4gICAgc3RhcnRVcGxvYWQsXG4gIH0gPSBwcm9wc1xuICBjb25zdCBzaG93VXBsb2FkTmV3bHlBZGRlZEZpbGVzID0gbmV3RmlsZXMgJiYgaXNVcGxvYWRTdGFydGVkXG5cbiAgaWYgKCFpc1VwbG9hZFN0YXJ0ZWQgfHwgaXNBbGxDb21wbGV0ZSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCB0aXRsZSA9IGlzQWxsUGF1c2VkID8gaTE4bigncGF1c2VkJykgOiBpMThuKCd1cGxvYWRpbmcnKVxuXG4gIGZ1bmN0aW9uIHJlbmRlclByb2dyZXNzRGV0YWlscyAoKSB7XG4gICAgaWYgKCFpc0FsbFBhdXNlZCAmJiAhc2hvd1VwbG9hZE5ld2x5QWRkZWRGaWxlcyAmJiBzaG93UHJvZ3Jlc3NEZXRhaWxzKSB7XG4gICAgICBpZiAoc3VwcG9ydHNVcGxvYWRQcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxUaHJvdHRsZWRQcm9ncmVzc0RldGFpbHNcbiAgICAgICAgICAgIG51bVVwbG9hZHM9e251bVVwbG9hZHN9XG4gICAgICAgICAgICBjb21wbGV0ZT17Y29tcGxldGV9XG4gICAgICAgICAgICB0b3RhbFVwbG9hZGVkU2l6ZT17dG90YWxVcGxvYWRlZFNpemV9XG4gICAgICAgICAgICB0b3RhbFNpemU9e3RvdGFsU2l6ZX1cbiAgICAgICAgICAgIHRvdGFsRVRBPXt0b3RhbEVUQX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFVua25vd25Qcm9ncmVzc0RldGFpbHNcbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIGNvbXBsZXRlPXtjb21wbGV0ZX1cbiAgICAgICAgICBudW1VcGxvYWRzPXtudW1VcGxvYWRzfVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWNvbnRlbnRcIiBhcmlhLWxhYmVsPXt0aXRsZX0gdGl0bGU9e3RpdGxlfT5cbiAgICAgIHshaXNBbGxQYXVzZWQgPyA8TG9hZGluZ1NwaW5uZXIgLz4gOiBudWxsfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNQcmltYXJ5XCI+XG4gICAgICAgICAge3N1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MgPyBgJHt0aXRsZX06ICR7dG90YWxQcm9ncmVzc30lYCA6IHRpdGxlfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7cmVuZGVyUHJvZ3Jlc3NEZXRhaWxzKCl9XG5cbiAgICAgICAge3Nob3dVcGxvYWROZXdseUFkZGVkRmlsZXMgPyAoXG4gICAgICAgICAgPFVwbG9hZE5ld2x5QWRkZWRGaWxlc1xuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIG5ld0ZpbGVzPXtuZXdGaWxlc31cbiAgICAgICAgICAgIHN0YXJ0VXBsb2FkPXtzdGFydFVwbG9hZH1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFByb2dyZXNzQmFyQ29tcGxldGUgKHByb3BzKSB7XG4gIGNvbnN0IHsgaTE4biB9ID0gcHJvcHNcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWNvbnRlbnRcIlxuICAgICAgcm9sZT1cInN0YXR1c1wiXG4gICAgICB0aXRsZT17aTE4bignY29tcGxldGUnKX1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1ByaW1hcnlcIj5cbiAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3RhdHVzSW5kaWNhdG9yIHVwcHktYy1pY29uXCJcbiAgICAgICAgICAgIHdpZHRoPVwiMTVcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiMTFcIlxuICAgICAgICAgICAgdmlld0JveD1cIjAgMCAxNSAxMVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0uNDE0IDUuODQzTDEuNjI3IDQuNjNsMy40NzIgMy40NzJMMTMuMjAyIDBsMS4yMTIgMS4yMTNMNS4xIDEwLjUyOHpcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIHtpMThuKCdjb21wbGV0ZScpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFByb2dyZXNzQmFyRXJyb3IgKHByb3BzKSB7XG4gIGNvbnN0IHsgZXJyb3IsIGkxOG4gfSA9IHByb3BzXG5cbiAgZnVuY3Rpb24gZGlzcGxheUVycm9yQWxlcnQgKCkge1xuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGAke2kxOG4oJ3VwbG9hZEZhaWxlZCcpfSBcXG5cXG4gJHtlcnJvcn1gXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWFsZXJ0XG4gICAgYWxlcnQoZXJyb3JNZXNzYWdlKSAvLyBUT0RPOiBtb3ZlIHRvIGN1c3RvbSBhbGVydCBpbXBsZW1lbnRhdGlvblxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1jb250ZW50XCJcbiAgICAgIHJvbGU9XCJhbGVydFwiXG4gICAgICB0aXRsZT17aTE4bigndXBsb2FkRmFpbGVkJyl9XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNQcmltYXJ5XCI+XG4gICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c0luZGljYXRvciB1cHB5LWMtaWNvblwiXG4gICAgICAgICAgICB3aWR0aD1cIjExXCJcbiAgICAgICAgICAgIGhlaWdodD1cIjExXCJcbiAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTEgMTFcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNNC4yNzggNS41TDAgMS4yMjIgMS4yMjIgMCA1LjUgNC4yNzggOS43NzggMCAxMSAxLjIyMiA2LjcyMiA1LjUgMTEgOS43NzggOS43NzggMTEgNS41IDYuNzIyIDEuMjIyIDExIDAgOS43Nzh6XCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICB7aTE4bigndXBsb2FkRmFpbGVkJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWRldGFpbHNcIlxuICAgICAgICBhcmlhLWxhYmVsPXtlcnJvcn1cbiAgICAgICAgZGF0YS1taWNyb3RpcC1wb3NpdGlvbj1cInRvcC1yaWdodFwiXG4gICAgICAgIGRhdGEtbWljcm90aXAtc2l6ZT1cIm1lZGl1bVwiXG4gICAgICAgIG9uQ2xpY2s9e2Rpc3BsYXlFcnJvckFsZXJ0fVxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgID5cbiAgICAgICAgP1xuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFVwbG9hZEJ0bixcbiAgUmV0cnlCdG4sXG4gIENhbmNlbEJ0bixcbiAgUGF1c2VSZXN1bWVCdXR0b24sXG4gIERvbmVCdG4sXG4gIExvYWRpbmdTcGlubmVyLFxuICBQcm9ncmVzc0RldGFpbHMsXG4gIFByb2dyZXNzQmFyUHJvY2Vzc2luZyxcbiAgUHJvZ3Jlc3NCYXJFcnJvcixcbiAgUHJvZ3Jlc3NCYXJVcGxvYWRpbmcsXG4gIFByb2dyZXNzQmFyQ29tcGxldGUsXG59XG4iLCJjb25zdCB7IGggfSA9IHJlcXVpcmUoJ3ByZWFjdCcpXG5jb25zdCBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpXG5jb25zdCBzdGF0dXNCYXJTdGF0ZXMgPSByZXF1aXJlKCcuL1N0YXR1c0JhclN0YXRlcycpXG5jb25zdCBjYWxjdWxhdGVQcm9jZXNzaW5nUHJvZ3Jlc3MgPSByZXF1aXJlKCcuL2NhbGN1bGF0ZVByb2Nlc3NpbmdQcm9ncmVzcycpXG5cbmNvbnN0IHtcbiAgVXBsb2FkQnRuLFxuICBSZXRyeUJ0bixcbiAgQ2FuY2VsQnRuLFxuICBQYXVzZVJlc3VtZUJ1dHRvbixcbiAgRG9uZUJ0bixcbiAgUHJvZ3Jlc3NCYXJQcm9jZXNzaW5nLFxuICBQcm9ncmVzc0JhckVycm9yLFxuICBQcm9ncmVzc0JhclVwbG9hZGluZyxcbiAgUHJvZ3Jlc3NCYXJDb21wbGV0ZSxcbn0gPSByZXF1aXJlKCcuL0NvbXBvbmVudHMnKVxuXG5jb25zdCB7XG4gIFNUQVRFX0VSUk9SLFxuICBTVEFURV9XQUlUSU5HLFxuICBTVEFURV9QUkVQUk9DRVNTSU5HLFxuICBTVEFURV9VUExPQURJTkcsXG4gIFNUQVRFX1BPU1RQUk9DRVNTSU5HLFxuICBTVEFURV9DT01QTEVURSxcbn0gPSBzdGF0dXNCYXJTdGF0ZXNcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0dXNCYXJcblxuZnVuY3Rpb24gU3RhdHVzQmFyIChwcm9wcykge1xuICBjb25zdCB7XG4gICAgbmV3RmlsZXMsXG4gICAgYWxsb3dOZXdVcGxvYWQsXG4gICAgaXNVcGxvYWRJblByb2dyZXNzLFxuICAgIGlzQWxsUGF1c2VkLFxuICAgIHJlc3VtYWJsZVVwbG9hZHMsXG4gICAgZXJyb3IsXG4gICAgaGlkZVVwbG9hZEJ1dHRvbixcbiAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b24sXG4gICAgaGlkZUNhbmNlbEJ1dHRvbixcbiAgICBoaWRlUmV0cnlCdXR0b24sXG4gICAgcmVjb3ZlcmVkU3RhdGUsXG4gICAgdXBsb2FkU3RhdGUsXG4gICAgdG90YWxQcm9ncmVzcyxcbiAgICBmaWxlcyxcbiAgICBzdXBwb3J0c1VwbG9hZFByb2dyZXNzLFxuICAgIGhpZGVBZnRlckZpbmlzaCxcbiAgICBpc1NvbWVHaG9zdCxcbiAgICBpc1RhcmdldERPTUVsLFxuICAgIGRvbmVCdXR0b25IYW5kbGVyLFxuICAgIGlzVXBsb2FkU3RhcnRlZCxcbiAgICBpMThuLFxuICAgIHN0YXJ0VXBsb2FkLFxuICAgIHVwcHksXG4gICAgaXNBbGxDb21wbGV0ZSxcbiAgICBzaG93UHJvZ3Jlc3NEZXRhaWxzLFxuICAgIG51bVVwbG9hZHMsXG4gICAgY29tcGxldGUsXG4gICAgdG90YWxTaXplLFxuICAgIHRvdGFsRVRBLFxuICAgIHRvdGFsVXBsb2FkZWRTaXplLFxuICB9ID0gcHJvcHNcblxuICBmdW5jdGlvbiBnZXRQcm9ncmVzc1ZhbHVlICgpIHtcbiAgICBzd2l0Y2ggKHVwbG9hZFN0YXRlKSB7XG4gICAgICBjYXNlIFNUQVRFX1BPU1RQUk9DRVNTSU5HOlxuICAgICAgY2FzZSBTVEFURV9QUkVQUk9DRVNTSU5HOiB7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gY2FsY3VsYXRlUHJvY2Vzc2luZ1Byb2dyZXNzKGZpbGVzKVxuXG4gICAgICAgIGlmIChwcm9ncmVzcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIHByb2dyZXNzLnZhbHVlICogMTAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvdGFsUHJvZ3Jlc3NcbiAgICAgIH1cbiAgICAgIGNhc2UgU1RBVEVfRVJST1I6IHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICAgIGNhc2UgU1RBVEVfVVBMT0FESU5HOiB7XG4gICAgICAgIGlmICghc3VwcG9ydHNVcGxvYWRQcm9ncmVzcykge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvdGFsUHJvZ3Jlc3NcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0b3RhbFByb2dyZXNzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXNJbmRldGVybWluYXRlICgpIHtcbiAgICBzd2l0Y2ggKHVwbG9hZFN0YXRlKSB7XG4gICAgICBjYXNlIFNUQVRFX1BPU1RQUk9DRVNTSU5HOlxuICAgICAgY2FzZSBTVEFURV9QUkVQUk9DRVNTSU5HOiB7XG4gICAgICAgIGNvbnN0IHsgbW9kZSB9ID0gY2FsY3VsYXRlUHJvY2Vzc2luZ1Byb2dyZXNzKGZpbGVzKVxuICAgICAgICByZXR1cm4gbW9kZSA9PT0gJ2luZGV0ZXJtaW5hdGUnXG4gICAgICB9XG4gICAgICBjYXNlIFNUQVRFX1VQTE9BRElORzoge1xuICAgICAgICBpZiAoIXN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXNIaWRkZW4gKCkge1xuICAgIGlmIChyZWNvdmVyZWRTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgc3dpdGNoICh1cGxvYWRTdGF0ZSkge1xuICAgICAgY2FzZSBTVEFURV9XQUlUSU5HOlxuICAgICAgICByZXR1cm4gaGlkZVVwbG9hZEJ1dHRvbiB8fCBuZXdGaWxlcyA9PT0gMFxuICAgICAgY2FzZSBTVEFURV9DT01QTEVURTpcbiAgICAgICAgcmV0dXJuIGhpZGVBZnRlckZpbmlzaFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgY29uc3QgcHJvZ3Jlc3NWYWx1ZSA9IGdldFByb2dyZXNzVmFsdWUoKVxuXG4gIGNvbnN0IGlzSGlkZGVuID0gZ2V0SXNIaWRkZW4oKVxuXG4gIGNvbnN0IHdpZHRoID0gcHJvZ3Jlc3NWYWx1ZSA/PyAxMDBcblxuICBjb25zdCBzaG93VXBsb2FkQnRuXG4gICAgPSAhZXJyb3JcbiAgICAmJiBuZXdGaWxlc1xuICAgICYmICFpc1VwbG9hZEluUHJvZ3Jlc3NcbiAgICAmJiAhaXNBbGxQYXVzZWRcbiAgICAmJiBhbGxvd05ld1VwbG9hZFxuICAgICYmICFoaWRlVXBsb2FkQnV0dG9uXG5cbiAgY29uc3Qgc2hvd0NhbmNlbEJ0blxuICAgID0gIWhpZGVDYW5jZWxCdXR0b25cbiAgICAmJiB1cGxvYWRTdGF0ZSAhPT0gU1RBVEVfV0FJVElOR1xuICAgICYmIHVwbG9hZFN0YXRlICE9PSBTVEFURV9DT01QTEVURVxuXG4gIGNvbnN0IHNob3dQYXVzZVJlc3VtZUJ0blxuICAgID0gcmVzdW1hYmxlVXBsb2Fkc1xuICAgICYmICFoaWRlUGF1c2VSZXN1bWVCdXR0b25cbiAgICAmJiB1cGxvYWRTdGF0ZSA9PT0gU1RBVEVfVVBMT0FESU5HXG5cbiAgY29uc3Qgc2hvd1JldHJ5QnRuID0gZXJyb3IgJiYgIWhpZGVSZXRyeUJ1dHRvblxuXG4gIGNvbnN0IHNob3dEb25lQnRuID0gZG9uZUJ1dHRvbkhhbmRsZXIgJiYgdXBsb2FkU3RhdGUgPT09IFNUQVRFX0NPTVBMRVRFXG5cbiAgY29uc3QgcHJvZ3Jlc3NDbGFzc05hbWVzID0gY2xhc3NOYW1lcygndXBweS1TdGF0dXNCYXItcHJvZ3Jlc3MnLCB7XG4gICAgJ2lzLWluZGV0ZXJtaW5hdGUnOiBnZXRJc0luZGV0ZXJtaW5hdGUoKSxcbiAgfSlcblxuICBjb25zdCBzdGF0dXNCYXJDbGFzc05hbWVzID0gY2xhc3NOYW1lcyhcbiAgICB7ICd1cHB5LVJvb3QnOiBpc1RhcmdldERPTUVsIH0sXG4gICAgJ3VwcHktU3RhdHVzQmFyJyxcbiAgICBgaXMtJHt1cGxvYWRTdGF0ZX1gLFxuICAgIHsgJ2hhcy1naG9zdHMnOiBpc1NvbWVHaG9zdCB9XG4gIClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtzdGF0dXNCYXJDbGFzc05hbWVzfSBhcmlhLWhpZGRlbj17aXNIaWRkZW59PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e3Byb2dyZXNzQ2xhc3NOYW1lc31cbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke3dpZHRofSVgIH19XG4gICAgICAgIHJvbGU9XCJwcm9ncmVzc2JhclwiXG4gICAgICAgIGFyaWEtbGFiZWw9e2Ake3dpZHRofSVgfVxuICAgICAgICBhcmlhLXZhbHVldGV4dD17YCR7d2lkdGh9JWB9XG4gICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgIGFyaWEtdmFsdWVub3c9e3Byb2dyZXNzVmFsdWV9XG4gICAgICAvPlxuXG4gICAgICB7KCgpID0+IHtcbiAgICAgICAgc3dpdGNoICh1cGxvYWRTdGF0ZSkge1xuICAgICAgICAgIGNhc2UgU1RBVEVfUFJFUFJPQ0VTU0lORzpcbiAgICAgICAgICBjYXNlIFNUQVRFX1BPU1RQUk9DRVNTSU5HOlxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPFByb2dyZXNzQmFyUHJvY2Vzc2luZ1xuICAgICAgICAgICAgICAgIHByb2dyZXNzPXtjYWxjdWxhdGVQcm9jZXNzaW5nUHJvZ3Jlc3MoZmlsZXMpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIGNhc2UgU1RBVEVfQ09NUExFVEU6XG4gICAgICAgICAgICByZXR1cm4gPFByb2dyZXNzQmFyQ29tcGxldGUgaTE4bj17aTE4bn0gLz5cbiAgICAgICAgICBjYXNlIFNUQVRFX0VSUk9SOlxuICAgICAgICAgICAgcmV0dXJuIDxQcm9ncmVzc0JhckVycm9yIGVycm9yPXtlcnJvcn0gaTE4bj17aTE4bn0gLz5cbiAgICAgICAgICBjYXNlIFNUQVRFX1VQTE9BRElORzpcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxQcm9ncmVzc0JhclVwbG9hZGluZ1xuICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcz17c3VwcG9ydHNVcGxvYWRQcm9ncmVzc31cbiAgICAgICAgICAgICAgICB0b3RhbFByb2dyZXNzPXt0b3RhbFByb2dyZXNzfVxuICAgICAgICAgICAgICAgIHNob3dQcm9ncmVzc0RldGFpbHM9e3Nob3dQcm9ncmVzc0RldGFpbHN9XG4gICAgICAgICAgICAgICAgaXNVcGxvYWRTdGFydGVkPXtpc1VwbG9hZFN0YXJ0ZWR9XG4gICAgICAgICAgICAgICAgaXNBbGxDb21wbGV0ZT17aXNBbGxDb21wbGV0ZX1cbiAgICAgICAgICAgICAgICBpc0FsbFBhdXNlZD17aXNBbGxQYXVzZWR9XG4gICAgICAgICAgICAgICAgbmV3RmlsZXM9e25ld0ZpbGVzfVxuICAgICAgICAgICAgICAgIG51bVVwbG9hZHM9e251bVVwbG9hZHN9XG4gICAgICAgICAgICAgICAgY29tcGxldGU9e2NvbXBsZXRlfVxuICAgICAgICAgICAgICAgIHRvdGFsVXBsb2FkZWRTaXplPXt0b3RhbFVwbG9hZGVkU2l6ZX1cbiAgICAgICAgICAgICAgICB0b3RhbFNpemU9e3RvdGFsU2l6ZX1cbiAgICAgICAgICAgICAgICB0b3RhbEVUQT17dG90YWxFVEF9XG4gICAgICAgICAgICAgICAgc3RhcnRVcGxvYWQ9e3N0YXJ0VXBsb2FkfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9KSgpfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWFjdGlvbnNcIj5cbiAgICAgICAgeyhyZWNvdmVyZWRTdGF0ZSB8fCBzaG93VXBsb2FkQnRuKSA/IChcbiAgICAgICAgICA8VXBsb2FkQnRuXG4gICAgICAgICAgICBuZXdGaWxlcz17bmV3RmlsZXN9XG4gICAgICAgICAgICBpc1VwbG9hZFN0YXJ0ZWQ9e2lzVXBsb2FkU3RhcnRlZH1cbiAgICAgICAgICAgIHJlY292ZXJlZFN0YXRlPXtyZWNvdmVyZWRTdGF0ZX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpc1NvbWVHaG9zdD17aXNTb21lR2hvc3R9XG4gICAgICAgICAgICBzdGFydFVwbG9hZD17c3RhcnRVcGxvYWR9XG4gICAgICAgICAgICB1cGxvYWRTdGF0ZT17dXBsb2FkU3RhdGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3Nob3dSZXRyeUJ0biA/IDxSZXRyeUJ0biBpMThuPXtpMThufSB1cHB5PXt1cHB5fSAvPiA6IG51bGx9XG5cbiAgICAgICAge3Nob3dQYXVzZVJlc3VtZUJ0biA/IChcbiAgICAgICAgICA8UGF1c2VSZXN1bWVCdXR0b25cbiAgICAgICAgICAgIGlzQWxsUGF1c2VkPXtpc0FsbFBhdXNlZH1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpc0FsbENvbXBsZXRlPXtpc0FsbENvbXBsZXRlfVxuICAgICAgICAgICAgcmVzdW1hYmxlVXBsb2Fkcz17cmVzdW1hYmxlVXBsb2Fkc31cbiAgICAgICAgICAgIHVwcHk9e3VwcHl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3Nob3dDYW5jZWxCdG4gPyA8Q2FuY2VsQnRuIGkxOG49e2kxOG59IHVwcHk9e3VwcHl9IC8+IDogbnVsbH1cblxuICAgICAgICB7c2hvd0RvbmVCdG4gPyAoXG4gICAgICAgICAgPERvbmVCdG4gaTE4bj17aTE4bn0gZG9uZUJ1dHRvbkhhbmRsZXI9e2RvbmVCdXR0b25IYW5kbGVyfSAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgU1RBVEVfRVJST1I6ICdlcnJvcicsXG4gIFNUQVRFX1dBSVRJTkc6ICd3YWl0aW5nJyxcbiAgU1RBVEVfUFJFUFJPQ0VTU0lORzogJ3ByZXByb2Nlc3NpbmcnLFxuICBTVEFURV9VUExPQURJTkc6ICd1cGxvYWRpbmcnLFxuICBTVEFURV9QT1NUUFJPQ0VTU0lORzogJ3Bvc3Rwcm9jZXNzaW5nJyxcbiAgU1RBVEVfQ09NUExFVEU6ICdjb21wbGV0ZScsXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbGN1bGF0ZVByb2Nlc3NpbmdQcm9ncmVzcyAoZmlsZXMpIHtcbiAgY29uc3QgdmFsdWVzID0gW11cbiAgbGV0IG1vZGVcbiAgbGV0IG1lc3NhZ2VcblxuICBmb3IgKGNvbnN0IHsgcHJvZ3Jlc3MgfSBvZiBPYmplY3QudmFsdWVzKGZpbGVzKSkge1xuICAgIGNvbnN0IHsgcHJlcHJvY2VzcywgcG9zdHByb2Nlc3MgfSA9IHByb2dyZXNzXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSB3ZSBzaG91bGQgcHJvYmFibHkgZG8gdGhpcyBkaWZmZXJlbnRseS4gRm9yIG5vdyB3ZSdsbCB0YWtlIHRoZVxuICAgIC8vIG1vZGUgYW5kIG1lc3NhZ2UgZnJvbSB0aGUgZmlyc3QgZmlsZeKAplxuICAgIGlmIChtZXNzYWdlID09IG51bGwgJiYgKHByZXByb2Nlc3MgfHwgcG9zdHByb2Nlc3MpKSB7XG4gICAgICAoeyBtb2RlLCBtZXNzYWdlIH0gPSBwcmVwcm9jZXNzIHx8IHBvc3Rwcm9jZXNzKVxuICAgIH1cbiAgICBpZiAocHJlcHJvY2Vzcz8ubW9kZSA9PT0gJ2RldGVybWluYXRlJykgdmFsdWVzLnB1c2gocHJlcHJvY2Vzcy52YWx1ZSlcbiAgICBpZiAocG9zdHByb2Nlc3M/Lm1vZGUgPT09ICdkZXRlcm1pbmF0ZScpIHZhbHVlcy5wdXNoKHBvc3Rwcm9jZXNzLnZhbHVlKVxuICB9XG5cbiAgY29uc3QgdmFsdWUgPSB2YWx1ZXMucmVkdWNlKCh0b3RhbCwgcHJvZ3Jlc3NWYWx1ZSkgPT4ge1xuICAgIHJldHVybiB0b3RhbCArIHByb2dyZXNzVmFsdWUgLyB2YWx1ZXMubGVuZ3RoXG4gIH0sIDApXG5cbiAgcmV0dXJuIHtcbiAgICBtb2RlLFxuICAgIG1lc3NhZ2UsXG4gICAgdmFsdWUsXG4gIH1cbn1cbiIsImNvbnN0IHsgVUlQbHVnaW4gfSA9IHJlcXVpcmUoJ0B1cHB5L2NvcmUnKVxuY29uc3QgZ2V0U3BlZWQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0U3BlZWQnKVxuY29uc3QgZ2V0Qnl0ZXNSZW1haW5pbmcgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0Qnl0ZXNSZW1haW5pbmcnKVxuY29uc3QgZ2V0VGV4dERpcmVjdGlvbiA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRUZXh0RGlyZWN0aW9uJylcbmNvbnN0IHN0YXR1c0JhclN0YXRlcyA9IHJlcXVpcmUoJy4vU3RhdHVzQmFyU3RhdGVzJylcbmNvbnN0IFN0YXR1c0JhclVJID0gcmVxdWlyZSgnLi9TdGF0dXNCYXInKVxuXG4vKipcbiAqIFN0YXR1c0JhcjogcmVuZGVycyBhIHN0YXR1cyBiYXIgd2l0aCB1cGxvYWQvcGF1c2UvcmVzdW1lL2NhbmNlbC9yZXRyeSBidXR0b25zLFxuICogcHJvZ3Jlc3MgcGVyY2VudGFnZSBhbmQgdGltZSByZW1haW5pbmcuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3RhdHVzQmFyIGV4dGVuZHMgVUlQbHVnaW4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xuXG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRzLmlkIHx8ICdTdGF0dXNCYXInXG4gICAgdGhpcy50aXRsZSA9ICdTdGF0dXNCYXInXG4gICAgdGhpcy50eXBlID0gJ3Byb2dyZXNzaW5kaWNhdG9yJ1xuXG4gICAgdGhpcy5kZWZhdWx0TG9jYWxlID0ge1xuICAgICAgc3RyaW5nczoge1xuICAgICAgICB1cGxvYWRpbmc6ICdVcGxvYWRpbmcnLFxuICAgICAgICB1cGxvYWQ6ICdVcGxvYWQnLFxuICAgICAgICBjb21wbGV0ZTogJ0NvbXBsZXRlJyxcbiAgICAgICAgdXBsb2FkRmFpbGVkOiAnVXBsb2FkIGZhaWxlZCcsXG4gICAgICAgIHBhdXNlZDogJ1BhdXNlZCcsXG4gICAgICAgIHJldHJ5OiAnUmV0cnknLFxuICAgICAgICByZXRyeVVwbG9hZDogJ1JldHJ5IHVwbG9hZCcsXG4gICAgICAgIGNhbmNlbDogJ0NhbmNlbCcsXG4gICAgICAgIHBhdXNlOiAnUGF1c2UnLFxuICAgICAgICByZXN1bWU6ICdSZXN1bWUnLFxuICAgICAgICBkb25lOiAnRG9uZScsXG4gICAgICAgIGZpbGVzVXBsb2FkZWRPZlRvdGFsOiB7XG4gICAgICAgICAgMDogJyV7Y29tcGxldGV9IG9mICV7c21hcnRfY291bnR9IGZpbGUgdXBsb2FkZWQnLFxuICAgICAgICAgIDE6ICcle2NvbXBsZXRlfSBvZiAle3NtYXJ0X2NvdW50fSBmaWxlcyB1cGxvYWRlZCcsXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFVcGxvYWRlZE9mVG90YWw6ICcle2NvbXBsZXRlfSBvZiAle3RvdGFsfScsXG4gICAgICAgIHhUaW1lTGVmdDogJyV7dGltZX0gbGVmdCcsXG4gICAgICAgIHVwbG9hZFhGaWxlczoge1xuICAgICAgICAgIDA6ICdVcGxvYWQgJXtzbWFydF9jb3VudH0gZmlsZScsXG4gICAgICAgICAgMTogJ1VwbG9hZCAle3NtYXJ0X2NvdW50fSBmaWxlcycsXG4gICAgICAgIH0sXG4gICAgICAgIHVwbG9hZFhOZXdGaWxlczoge1xuICAgICAgICAgIDA6ICdVcGxvYWQgKyV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdVcGxvYWQgKyV7c21hcnRfY291bnR9IGZpbGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgeE1vcmVGaWxlc0FkZGVkOiB7XG4gICAgICAgICAgMDogJyV7c21hcnRfY291bnR9IG1vcmUgZmlsZSBhZGRlZCcsXG4gICAgICAgICAgMTogJyV7c21hcnRfY291bnR9IG1vcmUgZmlsZXMgYWRkZWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG5cbiAgICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgIGhpZGVVcGxvYWRCdXR0b246IGZhbHNlLFxuICAgICAgaGlkZVJldHJ5QnV0dG9uOiBmYWxzZSxcbiAgICAgIGhpZGVQYXVzZVJlc3VtZUJ1dHRvbjogZmFsc2UsXG4gICAgICBoaWRlQ2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIHNob3dQcm9ncmVzc0RldGFpbHM6IGZhbHNlLFxuICAgICAgaGlkZUFmdGVyRmluaXNoOiB0cnVlLFxuICAgICAgZG9uZUJ1dHRvbkhhbmRsZXI6IG51bGwsXG4gICAgfVxuXG4gICAgdGhpcy5vcHRzID0geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0cyB9XG5cbiAgICB0aGlzLmkxOG5Jbml0KClcblxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuaW5zdGFsbCA9IHRoaXMuaW5zdGFsbC5iaW5kKHRoaXMpXG4gIH1cblxuICBzdGFydFVwbG9hZCA9ICgpID0+IHtcbiAgICBjb25zdCB7IHJlY292ZXJlZFN0YXRlIH0gPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKHJlY292ZXJlZFN0YXRlKSB7XG4gICAgICB0aGlzLnVwcHkuZW1pdCgncmVzdG9yZS1jb25maXJtZWQnKVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnVwcHkudXBsb2FkKCkuY2F0Y2goKCkgPT4ge1xuICAgICAgLy8gRXJyb3IgbG9nZ2VkIGluIENvcmVcbiAgICB9KVxuICB9O1xuXG4gIHJlbmRlciAoc3RhdGUpIHtcbiAgICBjb25zdCB7XG4gICAgICBjYXBhYmlsaXRpZXMsXG4gICAgICBmaWxlcyxcbiAgICAgIGFsbG93TmV3VXBsb2FkLFxuICAgICAgdG90YWxQcm9ncmVzcyxcbiAgICAgIGVycm9yLFxuICAgICAgcmVjb3ZlcmVkU3RhdGUsXG4gICAgfSA9IHN0YXRlXG5cbiAgICBjb25zdCB7XG4gICAgICBuZXdGaWxlcyxcbiAgICAgIHN0YXJ0ZWRGaWxlcyxcbiAgICAgIGNvbXBsZXRlRmlsZXMsXG4gICAgICBpblByb2dyZXNzTm90UGF1c2VkRmlsZXMsXG5cbiAgICAgIGlzVXBsb2FkU3RhcnRlZCxcbiAgICAgIGlzQWxsQ29tcGxldGUsXG4gICAgICBpc0FsbEVycm9yZWQsXG4gICAgICBpc0FsbFBhdXNlZCxcbiAgICAgIGlzVXBsb2FkSW5Qcm9ncmVzcyxcbiAgICAgIGlzU29tZUdob3N0LFxuICAgIH0gPSB0aGlzLnVwcHkuZ2V0T2JqZWN0T2ZGaWxlc1BlclN0YXRlKClcblxuICAgIC8vIElmIHNvbWUgc3RhdGUgd2FzIHJlY292ZXJlZCwgd2Ugd2FudCB0byBzaG93IFVwbG9hZCBidXR0b24vY291bnRlclxuICAgIC8vIGZvciBhbGwgdGhlIGZpbGVzLCBiZWNhdXNlIGluIHRoaXMgY2FzZSBpdOKAmXMgbm90IGFuIFVwbG9hZCBidXR0b24sXG4gICAgLy8gYnV0IOKAnENvbmZpcm0gUmVzdG9yZSBCdXR0b27igJ1cbiAgICBjb25zdCBuZXdGaWxlc09yUmVjb3ZlcmVkID0gcmVjb3ZlcmVkU3RhdGVcbiAgICAgID8gT2JqZWN0LnZhbHVlcyhmaWxlcylcbiAgICAgIDogbmV3RmlsZXNcbiAgICBjb25zdCB0b3RhbEVUQSA9IGdldFRvdGFsRVRBKGluUHJvZ3Jlc3NOb3RQYXVzZWRGaWxlcylcbiAgICBjb25zdCByZXN1bWFibGVVcGxvYWRzID0gISFjYXBhYmlsaXRpZXMucmVzdW1hYmxlVXBsb2Fkc1xuICAgIGNvbnN0IHN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MgPSBjYXBhYmlsaXRpZXMudXBsb2FkUHJvZ3Jlc3MgIT09IGZhbHNlXG5cbiAgICBsZXQgdG90YWxTaXplID0gMFxuICAgIGxldCB0b3RhbFVwbG9hZGVkU2l6ZSA9IDBcblxuICAgIHN0YXJ0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB0b3RhbFNpemUgKz0gZmlsZS5wcm9ncmVzcy5ieXRlc1RvdGFsIHx8IDBcbiAgICAgIHRvdGFsVXBsb2FkZWRTaXplICs9IGZpbGUucHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZCB8fCAwXG4gICAgfSlcblxuICAgIHJldHVybiBTdGF0dXNCYXJVSSh7XG4gICAgICBlcnJvcixcbiAgICAgIHVwbG9hZFN0YXRlOiBnZXRVcGxvYWRpbmdTdGF0ZShcbiAgICAgICAgaXNBbGxFcnJvcmVkLFxuICAgICAgICBpc0FsbENvbXBsZXRlLFxuICAgICAgICByZWNvdmVyZWRTdGF0ZSxcbiAgICAgICAgc3RhdGUuZmlsZXMgfHwge31cbiAgICAgICksXG4gICAgICBhbGxvd05ld1VwbG9hZCxcbiAgICAgIHRvdGFsUHJvZ3Jlc3MsXG4gICAgICB0b3RhbFNpemUsXG4gICAgICB0b3RhbFVwbG9hZGVkU2l6ZSxcbiAgICAgIGlzQWxsQ29tcGxldGU6IGZhbHNlLFxuICAgICAgaXNBbGxQYXVzZWQsXG4gICAgICBpc0FsbEVycm9yZWQsXG4gICAgICBpc1VwbG9hZFN0YXJ0ZWQsXG4gICAgICBpc1VwbG9hZEluUHJvZ3Jlc3MsXG4gICAgICBpc1NvbWVHaG9zdCxcbiAgICAgIHJlY292ZXJlZFN0YXRlLFxuICAgICAgY29tcGxldGU6IGNvbXBsZXRlRmlsZXMubGVuZ3RoLFxuICAgICAgbmV3RmlsZXM6IG5ld0ZpbGVzT3JSZWNvdmVyZWQubGVuZ3RoLFxuICAgICAgbnVtVXBsb2Fkczogc3RhcnRlZEZpbGVzLmxlbmd0aCxcbiAgICAgIHRvdGFsRVRBLFxuICAgICAgZmlsZXMsXG4gICAgICBpMThuOiB0aGlzLmkxOG4sXG4gICAgICB1cHB5OiB0aGlzLnVwcHksXG4gICAgICBzdGFydFVwbG9hZDogdGhpcy5zdGFydFVwbG9hZCxcbiAgICAgIGRvbmVCdXR0b25IYW5kbGVyOiB0aGlzLm9wdHMuZG9uZUJ1dHRvbkhhbmRsZXIsXG4gICAgICByZXN1bWFibGVVcGxvYWRzLFxuICAgICAgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyxcbiAgICAgIHNob3dQcm9ncmVzc0RldGFpbHM6IHRoaXMub3B0cy5zaG93UHJvZ3Jlc3NEZXRhaWxzLFxuICAgICAgaGlkZVVwbG9hZEJ1dHRvbjogdGhpcy5vcHRzLmhpZGVVcGxvYWRCdXR0b24sXG4gICAgICBoaWRlUmV0cnlCdXR0b246IHRoaXMub3B0cy5oaWRlUmV0cnlCdXR0b24sXG4gICAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b246IHRoaXMub3B0cy5oaWRlUGF1c2VSZXN1bWVCdXR0b24sXG4gICAgICBoaWRlQ2FuY2VsQnV0dG9uOiB0aGlzLm9wdHMuaGlkZUNhbmNlbEJ1dHRvbixcbiAgICAgIGhpZGVBZnRlckZpbmlzaDogdGhpcy5vcHRzLmhpZGVBZnRlckZpbmlzaCxcbiAgICAgIGlzVGFyZ2V0RE9NRWw6IHRoaXMuaXNUYXJnZXRET01FbCxcbiAgICB9KVxuICB9XG5cbiAgb25Nb3VudCAoKSB7XG4gICAgLy8gU2V0IHRoZSB0ZXh0IGRpcmVjdGlvbiBpZiB0aGUgcGFnZSBoYXMgbm90IGRlZmluZWQgb25lLlxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsXG4gICAgY29uc3QgZGlyZWN0aW9uID0gZ2V0VGV4dERpcmVjdGlvbihlbGVtZW50KVxuICAgIGlmICghZGlyZWN0aW9uKSB7XG4gICAgICBlbGVtZW50LmRpciA9ICdsdHInXG4gICAgfVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IHRoaXMub3B0c1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMubW91bnQodGFyZ2V0LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51bm1vdW50KClcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUb3RhbFNwZWVkIChmaWxlcykge1xuICBsZXQgdG90YWxTcGVlZCA9IDBcbiAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgIHRvdGFsU3BlZWQgKz0gZ2V0U3BlZWQoZmlsZS5wcm9ncmVzcylcbiAgfSlcbiAgcmV0dXJuIHRvdGFsU3BlZWRcbn1cblxuZnVuY3Rpb24gZ2V0VG90YWxFVEEgKGZpbGVzKSB7XG4gIGNvbnN0IHRvdGFsU3BlZWQgPSBnZXRUb3RhbFNwZWVkKGZpbGVzKVxuICBpZiAodG90YWxTcGVlZCA9PT0gMCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICBjb25zdCB0b3RhbEJ5dGVzUmVtYWluaW5nID0gZmlsZXMucmVkdWNlKCh0b3RhbCwgZmlsZSkgPT4ge1xuICAgIHJldHVybiB0b3RhbCArIGdldEJ5dGVzUmVtYWluaW5nKGZpbGUucHJvZ3Jlc3MpXG4gIH0sIDApXG5cbiAgcmV0dXJuIE1hdGgucm91bmQoKHRvdGFsQnl0ZXNSZW1haW5pbmcgLyB0b3RhbFNwZWVkKSAqIDEwKSAvIDEwXG59XG5cbmZ1bmN0aW9uIGdldFVwbG9hZGluZ1N0YXRlIChpc0FsbEVycm9yZWQsIGlzQWxsQ29tcGxldGUsIHJlY292ZXJlZFN0YXRlLCBmaWxlcykge1xuICBpZiAoaXNBbGxFcnJvcmVkKSB7XG4gICAgcmV0dXJuIHN0YXR1c0JhclN0YXRlcy5TVEFURV9FUlJPUlxuICB9XG5cbiAgaWYgKGlzQWxsQ29tcGxldGUpIHtcbiAgICByZXR1cm4gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0NPTVBMRVRFXG4gIH1cblxuICBpZiAocmVjb3ZlcmVkU3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkdcbiAgfVxuXG4gIGxldCBzdGF0ZSA9IHN0YXR1c0JhclN0YXRlcy5TVEFURV9XQUlUSU5HXG4gIGNvbnN0IGZpbGVJRHMgPSBPYmplY3Qua2V5cyhmaWxlcylcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgeyBwcm9ncmVzcyB9ID0gZmlsZXNbZmlsZUlEc1tpXV1cbiAgICAvLyBJZiBBTlkgZmlsZXMgYXJlIGJlaW5nIHVwbG9hZGVkIHJpZ2h0IG5vdywgc2hvdyB0aGUgdXBsb2FkaW5nIHN0YXRlLlxuICAgIGlmIChwcm9ncmVzcy51cGxvYWRTdGFydGVkICYmICFwcm9ncmVzcy51cGxvYWRDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHN0YXR1c0JhclN0YXRlcy5TVEFURV9VUExPQURJTkdcbiAgICB9XG4gICAgLy8gSWYgZmlsZXMgYXJlIGJlaW5nIHByZXByb2Nlc3NlZCBBTkQgcG9zdHByb2Nlc3NlZCBhdCB0aGlzIHRpbWUsIHdlIHNob3cgdGhlXG4gICAgLy8gcHJlcHJvY2VzcyBzdGF0ZS4gSWYgYW55IGZpbGVzIGFyZSBiZWluZyB1cGxvYWRlZCB3ZSBzaG93IHVwbG9hZGluZy5cbiAgICBpZiAocHJvZ3Jlc3MucHJlcHJvY2VzcyAmJiBzdGF0ZSAhPT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1VQTE9BRElORykge1xuICAgICAgc3RhdGUgPSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfUFJFUFJPQ0VTU0lOR1xuICAgIH1cbiAgICAvLyBJZiBOTyBmaWxlcyBhcmUgYmVpbmcgcHJlcHJvY2Vzc2VkIG9yIHVwbG9hZGVkIHJpZ2h0IG5vdywgYnV0IHNvbWUgZmlsZXMgYXJlXG4gICAgLy8gYmVpbmcgcG9zdHByb2Nlc3NlZCwgc2hvdyB0aGUgcG9zdHByb2Nlc3Mgc3RhdGUuXG4gICAgaWYgKFxuICAgICAgcHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICAgICYmIHN0YXRlICE9PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfVVBMT0FESU5HXG4gICAgICAmJiBzdGF0ZSAhPT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1BSRVBST0NFU1NJTkdcbiAgICApIHtcbiAgICAgIHN0YXRlID0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1BPU1RQUk9DRVNTSU5HXG4gICAgfVxuICB9XG4gIHJldHVybiBzdGF0ZVxufVxuIiwiLyoqXG4gKiBEZWZhdWx0IHN0b3JlIHRoYXQga2VlcHMgc3RhdGUgaW4gYSBzaW1wbGUgb2JqZWN0LlxuICovXG5jbGFzcyBEZWZhdWx0U3RvcmUge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgdGhpcy5jYWxsYmFja3MgPSBbXVxuICB9XG5cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlXG4gIH1cblxuICBzZXRTdGF0ZSAocGF0Y2gpIHtcbiAgICBjb25zdCBwcmV2U3RhdGUgPSB7IC4uLnRoaXMuc3RhdGUgfVxuICAgIGNvbnN0IG5leHRTdGF0ZSA9IHsgLi4udGhpcy5zdGF0ZSwgLi4ucGF0Y2ggfVxuXG4gICAgdGhpcy5zdGF0ZSA9IG5leHRTdGF0ZVxuICAgIHRoaXMuI3B1Ymxpc2gocHJldlN0YXRlLCBuZXh0U3RhdGUsIHBhdGNoKVxuICB9XG5cbiAgc3Vic2NyaWJlIChsaXN0ZW5lcikge1xuICAgIHRoaXMuY2FsbGJhY2tzLnB1c2gobGlzdGVuZXIpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdGVuZXIuXG4gICAgICB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLmluZGV4T2YobGlzdGVuZXIpLFxuICAgICAgICAxXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgI3B1Ymxpc2ggKC4uLmFyZ3MpIHtcbiAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgbGlzdGVuZXIoLi4uYXJncylcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmYXVsdFN0b3JlICgpIHtcbiAgcmV0dXJuIG5ldyBEZWZhdWx0U3RvcmUoKVxufVxuIiwiY29uc3QgdHVzID0gcmVxdWlyZSgndHVzLWpzLWNsaWVudCcpXG5cbmZ1bmN0aW9uIGlzQ29yZG92YSAoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiAoXG4gICAgdHlwZW9mIHdpbmRvdy5QaG9uZUdhcCAhPT0gJ3VuZGVmaW5lZCdcbiAgICB8fCB0eXBlb2Ygd2luZG93LkNvcmRvdmEgIT09ICd1bmRlZmluZWQnXG4gICAgfHwgdHlwZW9mIHdpbmRvdy5jb3Jkb3ZhICE9PSAndW5kZWZpbmVkJ1xuICApXG59XG5cbmZ1bmN0aW9uIGlzUmVhY3ROYXRpdmUgKCkge1xuICByZXR1cm4gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB0eXBlb2YgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdzdHJpbmcnXG4gICAgJiYgbmF2aWdhdG9yLnByb2R1Y3QudG9Mb3dlckNhc2UoKSA9PT0gJ3JlYWN0bmF0aXZlJ1xufVxuXG4vLyBXZSBvdmVycmlkZSB0dXMgZmluZ2VycHJpbnQgdG8gdXBweeKAmXMgYGZpbGUuaWRgLCBzaW5jZSB0aGUgYGZpbGUuaWRgXG4vLyBub3cgYWxzbyBpbmNsdWRlcyBgcmVsYXRpdmVQYXRoYCBmb3IgZmlsZXMgYWRkZWQgZnJvbSBmb2xkZXJzLlxuLy8gVGhpcyBtZWFucyB5b3UgY2FuIGFkZCAyIGlkZW50aWNhbCBmaWxlcywgaWYgb25lIGlzIGluIGZvbGRlciBhLFxuLy8gdGhlIG90aGVyIGluIGZvbGRlciBiIOKAlCBgYS9maWxlLmpwZ2AgYW5kIGBiL2ZpbGUuanBnYCwgd2hlbiBhZGRlZFxuLy8gdG9nZXRoZXIgd2l0aCBhIGZvbGRlciwgd2lsbCBiZSB0cmVhdGVkIGFzIDIgc2VwYXJhdGUgZmlsZXMuXG4vL1xuLy8gRm9yIFJlYWN0IE5hdGl2ZSBhbmQgQ29yZG92YSwgd2UgbGV0IHR1cy1qcy1jbGllbnTigJlzIGRlZmF1bHRcbi8vIGZpbmdlcnByaW50IGhhbmRsaW5nIHRha2UgY2hhcmdlLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRGaW5nZXJwcmludCAodXBweUZpbGVPYmopIHtcbiAgcmV0dXJuIChmaWxlLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKGlzQ29yZG92YSgpIHx8IGlzUmVhY3ROYXRpdmUoKSkge1xuICAgICAgcmV0dXJuIHR1cy5kZWZhdWx0T3B0aW9ucy5maW5nZXJwcmludChmaWxlLCBvcHRpb25zKVxuICAgIH1cblxuICAgIGNvbnN0IHVwcHlGaW5nZXJwcmludCA9IFtcbiAgICAgICd0dXMnLFxuICAgICAgdXBweUZpbGVPYmouaWQsXG4gICAgICBvcHRpb25zLmVuZHBvaW50LFxuICAgIF0uam9pbignLScpXG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwcHlGaW5nZXJwcmludClcbiAgfVxufVxuIiwiY29uc3QgQmFzZVBsdWdpbiA9IHJlcXVpcmUoJ0B1cHB5L2NvcmUvbGliL0Jhc2VQbHVnaW4nKVxuY29uc3QgdHVzID0gcmVxdWlyZSgndHVzLWpzLWNsaWVudCcpXG5jb25zdCB7IFByb3ZpZGVyLCBSZXF1ZXN0Q2xpZW50LCBTb2NrZXQgfSA9IHJlcXVpcmUoJ0B1cHB5L2NvbXBhbmlvbi1jbGllbnQnKVxuY29uc3QgZW1pdFNvY2tldFByb2dyZXNzID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2VtaXRTb2NrZXRQcm9ncmVzcycpXG5jb25zdCBnZXRTb2NrZXRIb3N0ID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldFNvY2tldEhvc3QnKVxuY29uc3Qgc2V0dGxlID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL3NldHRsZScpXG5jb25zdCBFdmVudFRyYWNrZXIgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvRXZlbnRUcmFja2VyJylcbmNvbnN0IE5ldHdvcmtFcnJvciA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9OZXR3b3JrRXJyb3InKVxuY29uc3QgaXNOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvaXNOZXR3b3JrRXJyb3InKVxuY29uc3QgeyBSYXRlTGltaXRlZFF1ZXVlIH0gPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvUmF0ZUxpbWl0ZWRRdWV1ZScpXG5jb25zdCBoYXNQcm9wZXJ0eSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9oYXNQcm9wZXJ0eScpXG5jb25zdCBnZXRGaW5nZXJwcmludCA9IHJlcXVpcmUoJy4vZ2V0RmluZ2VycHJpbnQnKVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4nKS5UdXNPcHRpb25zfSBUdXNPcHRpb25zICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgndHVzLWpzLWNsaWVudCcpLlVwbG9hZE9wdGlvbnN9IFJhd1R1c09wdGlvbnMgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdAdXBweS9jb3JlJykuVXBweX0gVXBweSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ0B1cHB5L2NvcmUnKS5VcHB5RmlsZX0gVXBweUZpbGUgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdAdXBweS9jb3JlJykuRmFpbGVkVXBweUZpbGU8e30+fSBGYWlsZWRVcHB5RmlsZSAqL1xuXG4vKipcbiAqIEV4dHJhY3RlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS90dXMvdHVzLWpzLWNsaWVudC9ibG9iL21hc3Rlci9saWIvdXBsb2FkLmpzI0wxM1xuICogZXhjZXB0ZWQgd2UgcmVtb3ZlZCAnZmluZ2VycHJpbnQnIGtleSB0byBhdm9pZCBhZGRpbmcgbW9yZSBkZXBlbmRlbmNpZXNcbiAqXG4gKiBAdHlwZSB7UmF3VHVzT3B0aW9uc31cbiAqL1xuY29uc3QgdHVzRGVmYXVsdE9wdGlvbnMgPSB7XG4gIGVuZHBvaW50OiAnJyxcblxuICB1cGxvYWRVcmw6IG51bGwsXG4gIG1ldGFkYXRhOiB7fSxcbiAgdXBsb2FkU2l6ZTogbnVsbCxcblxuICBvblByb2dyZXNzOiBudWxsLFxuICBvbkNodW5rQ29tcGxldGU6IG51bGwsXG4gIG9uU3VjY2VzczogbnVsbCxcbiAgb25FcnJvcjogbnVsbCxcblxuICBvdmVycmlkZVBhdGNoTWV0aG9kOiBmYWxzZSxcbiAgaGVhZGVyczoge30sXG4gIGFkZFJlcXVlc3RJZDogZmFsc2UsXG5cbiAgY2h1bmtTaXplOiBJbmZpbml0eSxcbiAgcmV0cnlEZWxheXM6IFswLCAxMDAwLCAzMDAwLCA1MDAwXSxcbiAgcGFyYWxsZWxVcGxvYWRzOiAxLFxuICByZW1vdmVGaW5nZXJwcmludE9uU3VjY2VzczogZmFsc2UsXG4gIHVwbG9hZExlbmd0aERlZmVycmVkOiBmYWxzZSxcbiAgdXBsb2FkRGF0YUR1cmluZ0NyZWF0aW9uOiBmYWxzZSxcbn1cblxuLyoqXG4gKiBUdXMgcmVzdW1hYmxlIGZpbGUgdXBsb2FkZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUdXMgZXh0ZW5kcyBCYXNlUGx1Z2luIHtcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VXBweX0gdXBweVxuICAgKiBAcGFyYW0ge1R1c09wdGlvbnN9IG9wdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLnR5cGUgPSAndXBsb2FkZXInXG4gICAgdGhpcy5pZCA9IHRoaXMub3B0cy5pZCB8fCAnVHVzJ1xuICAgIHRoaXMudGl0bGUgPSAnVHVzJ1xuXG4gICAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdXNlRmFzdFJlbW90ZVJldHJ5OiB0cnVlLFxuICAgICAgbGltaXQ6IDUsXG4gICAgICByZXRyeURlbGF5czogWzAsIDEwMDAsIDMwMDAsIDUwMDBdLFxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICB9XG5cbiAgICAvLyBtZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlclxuICAgIC8qKiBAdHlwZSB7aW1wb3J0KFwiLi5cIikuVHVzT3B0aW9uc30gKi9cbiAgICB0aGlzLm9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH1cblxuICAgIGlmICgnYXV0b1JldHJ5JyBpbiBvcHRzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgYXV0b1JldHJ5YCBvcHRpb24gd2FzIGRlcHJlY2F0ZWQgYW5kIGhhcyBiZWVuIHJlbW92ZWQuJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaW11bHRhbmVvdXMgdXBsb2FkIGxpbWl0aW5nIGlzIHNoYXJlZCBhY3Jvc3MgYWxsIHVwbG9hZHMgd2l0aCB0aGlzIHBsdWdpbi5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtSYXRlTGltaXRlZFF1ZXVlfVxuICAgICAqL1xuICAgIHRoaXMucmVxdWVzdHMgPSBuZXcgUmF0ZUxpbWl0ZWRRdWV1ZSh0aGlzLm9wdHMubGltaXQpXG5cbiAgICB0aGlzLnVwbG9hZGVycyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgIHRoaXMudXBsb2FkZXJTb2NrZXRzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICAgdGhpcy5oYW5kbGVSZXNldFByb2dyZXNzID0gdGhpcy5oYW5kbGVSZXNldFByb2dyZXNzLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVVwbG9hZCA9IHRoaXMuaGFuZGxlVXBsb2FkLmJpbmQodGhpcylcbiAgfVxuXG4gIGhhbmRsZVJlc2V0UHJvZ3Jlc3MgKCkge1xuICAgIGNvbnN0IGZpbGVzID0geyAuLi50aGlzLnVwcHkuZ2V0U3RhdGUoKS5maWxlcyB9XG4gICAgT2JqZWN0LmtleXMoZmlsZXMpLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgLy8gT25seSBjbG9uZSB0aGUgZmlsZSBvYmplY3QgaWYgaXQgaGFzIGEgVHVzIGB1cGxvYWRVcmxgIGF0dGFjaGVkLlxuICAgICAgaWYgKGZpbGVzW2ZpbGVJRF0udHVzICYmIGZpbGVzW2ZpbGVJRF0udHVzLnVwbG9hZFVybCkge1xuICAgICAgICBjb25zdCB0dXNTdGF0ZSA9IHsgLi4uZmlsZXNbZmlsZUlEXS50dXMgfVxuICAgICAgICBkZWxldGUgdHVzU3RhdGUudXBsb2FkVXJsXG4gICAgICAgIGZpbGVzW2ZpbGVJRF0gPSB7IC4uLmZpbGVzW2ZpbGVJRF0sIHR1czogdHVzU3RhdGUgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnVwcHkuc2V0U3RhdGUoeyBmaWxlcyB9KVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFuIHVwIGFsbCByZWZlcmVuY2VzIGZvciBhIGZpbGUncyB1cGxvYWQ6IHRoZSB0dXMuVXBsb2FkIGluc3RhbmNlLFxuICAgKiBhbnkgZXZlbnRzIHJlbGF0ZWQgdG8gdGhlIGZpbGUsIGFuZCB0aGUgQ29tcGFuaW9uIFdlYlNvY2tldCBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqL1xuICByZXNldFVwbG9hZGVyUmVmZXJlbmNlcyAoZmlsZUlELCBvcHRzID0ge30pIHtcbiAgICBpZiAodGhpcy51cGxvYWRlcnNbZmlsZUlEXSkge1xuICAgICAgY29uc3QgdXBsb2FkZXIgPSB0aGlzLnVwbG9hZGVyc1tmaWxlSURdXG5cbiAgICAgIHVwbG9hZGVyLmFib3J0KClcblxuICAgICAgaWYgKG9wdHMuYWJvcnQpIHtcbiAgICAgICAgdXBsb2FkZXIuYWJvcnQodHJ1ZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGxvYWRlcnNbZmlsZUlEXSA9IG51bGxcbiAgICB9XG4gICAgaWYgKHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXSkge1xuICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLnJlbW92ZSgpXG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0gPSBudWxsXG4gICAgfVxuICAgIGlmICh0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdKSB7XG4gICAgICB0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdLmNsb3NlKClcbiAgICAgIHRoaXMudXBsb2FkZXJTb2NrZXRzW2ZpbGVJRF0gPSBudWxsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBUdXMgdXBsb2FkLlxuICAgKlxuICAgKiBBIGxvdCBjYW4gaGFwcGVuIGR1cmluZyBhbiB1cGxvYWQsIHNvIHRoaXMgaXMgcXVpdGUgaGFyZCB0byBmb2xsb3chXG4gICAqIC0gRmlyc3QsIHRoZSB1cGxvYWQgaXMgc3RhcnRlZC4gSWYgdGhlIGZpbGUgd2FzIGFscmVhZHkgcGF1c2VkIGJ5IHRoZSB0aW1lIHRoZSB1cGxvYWQgc3RhcnRzLCBub3RoaW5nIHNob3VsZCBoYXBwZW4uXG4gICAqICAgSWYgdGhlIGBsaW1pdGAgb3B0aW9uIGlzIHVzZWQsIHRoZSB1cGxvYWQgbXVzdCBiZSBxdWV1ZWQgb250byB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLlxuICAgKiAgIFdoZW4gYW4gdXBsb2FkIHN0YXJ0cywgd2Ugc3RvcmUgdGhlIHR1cy5VcGxvYWQgaW5zdGFuY2UsIGFuZCBhbiBFdmVudFRyYWNrZXIgaW5zdGFuY2UgdGhhdCBtYW5hZ2VzIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICogICBmb3IgcGF1c2luZywgY2FuY2VsbGF0aW9uLCByZW1vdmFsLCBldGMuXG4gICAqIC0gV2hpbGUgdGhlIHVwbG9hZCBpcyBpbiBwcm9ncmVzcywgaXQgbWF5IGJlIHBhdXNlZCBvciBjYW5jZWxsZWQuXG4gICAqICAgUGF1c2luZyBhYm9ydHMgdGhlIHVuZGVybHlpbmcgdHVzLlVwbG9hZCwgYW5kIHJlbW92ZXMgdGhlIHVwbG9hZCBmcm9tIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUuIEFsbCBvdGhlciBzdGF0ZSBpc1xuICAgKiAgIG1haW50YWluZWQuXG4gICAqICAgQ2FuY2VsbGluZyByZW1vdmVzIHRoZSB1cGxvYWQgZnJvbSB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLCBhbmQgY29tcGxldGVseSBhYm9ydHMgdGhlIHVwbG9hZC0tIHRoZSBgdHVzLlVwbG9hZGBcbiAgICogICBpbnN0YW5jZSBpcyBhYm9ydGVkIGFuZCBkaXNjYXJkZWQsIHRoZSBFdmVudFRyYWNrZXIgaW5zdGFuY2UgaXMgZGVzdHJveWVkIChyZW1vdmluZyBhbGwgbGlzdGVuZXJzKS5cbiAgICogICBSZXN1bWluZyB0aGUgdXBsb2FkIHVzZXMgdGhlIGB0aGlzLnJlcXVlc3RzYCBxdWV1ZSBhcyB3ZWxsLCB0byBwcmV2ZW50IHNlbGVjdGl2ZWx5IHBhdXNpbmcgYW5kIHJlc3VtaW5nIHVwbG9hZHMgZnJvbVxuICAgKiAgIGJ5cGFzc2luZyB0aGUgbGltaXQuXG4gICAqIC0gQWZ0ZXIgY29tcGxldGluZyBhbiB1cGxvYWQsIHRoZSB0dXMuVXBsb2FkIGFuZCBFdmVudFRyYWNrZXIgaW5zdGFuY2VzIGFyZSBjbGVhbmVkIHVwLCBhbmQgdGhlIHVwbG9hZCBpcyBtYXJrZWQgYXMgZG9uZVxuICAgKiAgIGluIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUuXG4gICAqIC0gV2hlbiBhbiB1cGxvYWQgY29tcGxldGVkIHdpdGggYW4gZXJyb3IsIHRoZSBzYW1lIGhhcHBlbnMgYXMgb24gc3VjY2Vzc2Z1bCBjb21wbGV0aW9uLCBidXQgdGhlIGB1cGxvYWQoKWAgcHJvbWlzZSBpc1xuICAgKiAgIHJlamVjdGVkLlxuICAgKlxuICAgKiBXaGVuIHdvcmtpbmcgb24gdGhpcyBmdW5jdGlvbiwga2VlcCBpbiBtaW5kOlxuICAgKiAgLSBXaGVuIGFuIHVwbG9hZCBpcyBjb21wbGV0ZWQgb3IgY2FuY2VsbGVkIGZvciBhbnkgcmVhc29uLCB0aGUgdHVzLlVwbG9hZCBhbmQgRXZlbnRUcmFja2VyIGluc3RhbmNlcyBuZWVkIHRvIGJlIGNsZWFuZWRcbiAgICogICAgdXAgdXNpbmcgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpLlxuICAgKiAgLSBXaGVuIGFuIHVwbG9hZCBpcyBjYW5jZWxsZWQgb3IgcGF1c2VkLCBmb3IgYW55IHJlYXNvbiwgaXQgbmVlZHMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUgdXNpbmdcbiAgICogICAgYHF1ZXVlZFJlcXVlc3QuYWJvcnQoKWAuXG4gICAqICAtIFdoZW4gYW4gdXBsb2FkIGlzIGNvbXBsZXRlZCBmb3IgYW55IHJlYXNvbiwgaW5jbHVkaW5nIGVycm9ycywgaXQgbmVlZHMgdG8gYmUgbWFya2VkIGFzIHN1Y2ggdXNpbmdcbiAgICogICAgYHF1ZXVlZFJlcXVlc3QuZG9uZSgpYC5cbiAgICogIC0gV2hlbiBhbiB1cGxvYWQgaXMgc3RhcnRlZCBvciByZXN1bWVkLCBpdCBuZWVkcyB0byBnbyB0aHJvdWdoIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUuIFRoZSBgcXVldWVkUmVxdWVzdGAgdmFyaWFibGVcbiAgICogICAgbXVzdCBiZSB1cGRhdGVkIHNvIHRoZSBvdGhlciB1c2VzIG9mIGl0IGFyZSB2YWxpZC5cbiAgICogIC0gQmVmb3JlIHJlcGxhY2luZyB0aGUgYHF1ZXVlZFJlcXVlc3RgIHZhcmlhYmxlLCB0aGUgcHJldmlvdXMgYHF1ZXVlZFJlcXVlc3RgIG11c3QgYmUgYWJvcnRlZCwgZWxzZSBpdCB3aWxsIGtlZXAgdGFraW5nXG4gICAqICAgIHVwIGEgc3BvdCBpbiB0aGUgcXVldWUuXG4gICAqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGUgZm9yIHVzZSB3aXRoIHVwbG9hZFxuICAgKiBAcGFyYW0ge251bWJlcn0gY3VycmVudCBmaWxlIGluIGEgcXVldWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIG51bWJlciBvZiBmaWxlcyBpbiBhIHF1ZXVlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgKi9cbiAgdXBsb2FkIChmaWxlKSB7XG4gICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IHR1cyB1cGxvYWRcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcblxuICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgLi4udGhpcy5vcHRzLFxuICAgICAgICAuLi4oZmlsZS50dXMgfHwge30pLFxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdHMuaGVhZGVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvcHRzLmhlYWRlcnMgPSBvcHRzLmhlYWRlcnMoZmlsZSlcbiAgICAgIH1cblxuICAgICAgLyoqIEB0eXBlIHtSYXdUdXNPcHRpb25zfSAqL1xuICAgICAgY29uc3QgdXBsb2FkT3B0aW9ucyA9IHtcbiAgICAgICAgLi4udHVzRGVmYXVsdE9wdGlvbnMsXG4gICAgICAgIC4uLm9wdHMsXG4gICAgICB9XG5cbiAgICAgIC8vIFdlIG92ZXJyaWRlIHR1cyBmaW5nZXJwcmludCB0byB1cHB54oCZcyBgZmlsZS5pZGAsIHNpbmNlIHRoZSBgZmlsZS5pZGBcbiAgICAgIC8vIG5vdyBhbHNvIGluY2x1ZGVzIGByZWxhdGl2ZVBhdGhgIGZvciBmaWxlcyBhZGRlZCBmcm9tIGZvbGRlcnMuXG4gICAgICAvLyBUaGlzIG1lYW5zIHlvdSBjYW4gYWRkIDIgaWRlbnRpY2FsIGZpbGVzLCBpZiBvbmUgaXMgaW4gZm9sZGVyIGEsXG4gICAgICAvLyB0aGUgb3RoZXIgaW4gZm9sZGVyIGIuXG4gICAgICB1cGxvYWRPcHRpb25zLmZpbmdlcnByaW50ID0gZ2V0RmluZ2VycHJpbnQoZmlsZSlcblxuICAgICAgdXBsb2FkT3B0aW9ucy5vbkJlZm9yZVJlcXVlc3QgPSAocmVxKSA9PiB7XG4gICAgICAgIGNvbnN0IHhociA9IHJlcS5nZXRVbmRlcmx5aW5nT2JqZWN0KClcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhb3B0cy53aXRoQ3JlZGVudGlhbHNcblxuICAgICAgICBpZiAodHlwZW9mIG9wdHMub25CZWZvcmVSZXF1ZXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgb3B0cy5vbkJlZm9yZVJlcXVlc3QocmVxKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwbG9hZE9wdGlvbnMub25FcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmxvZyhlcnIpXG5cbiAgICAgICAgY29uc3QgeGhyID0gZXJyLm9yaWdpbmFsUmVxdWVzdCA/IGVyci5vcmlnaW5hbFJlcXVlc3QuZ2V0VW5kZXJseWluZ09iamVjdCgpIDogbnVsbFxuICAgICAgICBpZiAoaXNOZXR3b3JrRXJyb3IoeGhyKSkge1xuICAgICAgICAgIGVyciA9IG5ldyBOZXR3b3JrRXJyb3IoZXJyLCB4aHIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG5cbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1lcnJvcicsIGZpbGUsIGVycilcblxuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgfVxuXG4gICAgICB1cGxvYWRPcHRpb25zLm9uUHJvZ3Jlc3MgPSAoYnl0ZXNVcGxvYWRlZCwgYnl0ZXNUb3RhbCkgPT4ge1xuICAgICAgICB0aGlzLm9uUmVjZWl2ZVVwbG9hZFVybChmaWxlLCB1cGxvYWQudXJsKVxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXByb2dyZXNzJywgZmlsZSwge1xuICAgICAgICAgIHVwbG9hZGVyOiB0aGlzLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQsXG4gICAgICAgICAgYnl0ZXNUb3RhbCxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdXBsb2FkT3B0aW9ucy5vblN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVwbG9hZFJlc3AgPSB7XG4gICAgICAgICAgdXBsb2FkVVJMOiB1cGxvYWQudXJsLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3VjY2VzcycsIGZpbGUsIHVwbG9hZFJlc3ApXG5cbiAgICAgICAgaWYgKHVwbG9hZC51cmwpIHtcbiAgICAgICAgICB0aGlzLnVwcHkubG9nKGBEb3dubG9hZCAke3VwbG9hZC5maWxlLm5hbWV9IGZyb20gJHt1cGxvYWQudXJsfWApXG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKHVwbG9hZClcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29weVByb3AgPSAob2JqLCBzcmNQcm9wLCBkZXN0UHJvcCkgPT4ge1xuICAgICAgICBpZiAoaGFzUHJvcGVydHkob2JqLCBzcmNQcm9wKSAmJiAhaGFzUHJvcGVydHkob2JqLCBkZXN0UHJvcCkpIHtcbiAgICAgICAgICBvYmpbZGVzdFByb3BdID0gb2JqW3NyY1Byb3BdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSAqL1xuICAgICAgY29uc3QgbWV0YSA9IHt9XG4gICAgICBjb25zdCBtZXRhRmllbGRzID0gQXJyYXkuaXNBcnJheShvcHRzLm1ldGFGaWVsZHMpXG4gICAgICAgID8gb3B0cy5tZXRhRmllbGRzXG4gICAgICAgIC8vIFNlbmQgYWxvbmcgYWxsIGZpZWxkcyBieSBkZWZhdWx0LlxuICAgICAgICA6IE9iamVjdC5rZXlzKGZpbGUubWV0YSlcbiAgICAgIG1ldGFGaWVsZHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBtZXRhW2l0ZW1dID0gZmlsZS5tZXRhW2l0ZW1dXG4gICAgICB9KVxuXG4gICAgICAvLyB0dXNkIHVzZXMgbWV0YWRhdGEgZmllbGRzICdmaWxldHlwZScgYW5kICdmaWxlbmFtZSdcbiAgICAgIGNvcHlQcm9wKG1ldGEsICd0eXBlJywgJ2ZpbGV0eXBlJylcbiAgICAgIGNvcHlQcm9wKG1ldGEsICduYW1lJywgJ2ZpbGVuYW1lJylcblxuICAgICAgdXBsb2FkT3B0aW9ucy5tZXRhZGF0YSA9IG1ldGFcblxuICAgICAgY29uc3QgdXBsb2FkID0gbmV3IHR1cy5VcGxvYWQoZmlsZS5kYXRhLCB1cGxvYWRPcHRpb25zKVxuICAgICAgdGhpcy51cGxvYWRlcnNbZmlsZS5pZF0gPSB1cGxvYWRcbiAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBuZXcgRXZlbnRUcmFja2VyKHRoaXMudXBweSlcblxuICAgICAgdXBsb2FkLmZpbmRQcmV2aW91c1VwbG9hZHMoKS50aGVuKChwcmV2aW91c1VwbG9hZHMpID0+IHtcbiAgICAgICAgY29uc3QgcHJldmlvdXNVcGxvYWQgPSBwcmV2aW91c1VwbG9hZHNbMF1cbiAgICAgICAgaWYgKHByZXZpb3VzVXBsb2FkKSB7XG4gICAgICAgICAgdGhpcy51cHB5LmxvZyhgW1R1c10gUmVzdW1pbmcgdXBsb2FkIG9mICR7ZmlsZS5pZH0gc3RhcnRlZCBhdCAke3ByZXZpb3VzVXBsb2FkLmNyZWF0aW9uVGltZX1gKVxuICAgICAgICAgIHVwbG9hZC5yZXN1bWVGcm9tUHJldmlvdXNVcGxvYWQocHJldmlvdXNVcGxvYWQpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGxldCBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0cy5ydW4oKCkgPT4ge1xuICAgICAgICBpZiAoIWZpbGUuaXNQYXVzZWQpIHtcbiAgICAgICAgICB1cGxvYWQuc3RhcnQoKVxuICAgICAgICB9XG4gICAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGhlcmUsIHRoZSBjYWxsZXIgd2lsbCB0YWtlIGNhcmUgb2YgY2FuY2VsbGluZyB0aGUgdXBsb2FkIGl0c2VsZlxuICAgICAgICAvLyB1c2luZyByZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpLiBUaGlzIGlzIGJlY2F1c2UgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKSBoYXMgdG8gYmVcbiAgICAgICAgLy8gY2FsbGVkIHdoZW4gdGhpcyByZXF1ZXN0IGlzIHN0aWxsIGluIHRoZSBxdWV1ZSwgYW5kIGhhcyBub3QgYmVlbiBzdGFydGVkIHlldCwgdG9vLiBBdFxuICAgICAgICAvLyB0aGF0IHBvaW50IHRoaXMgY2FuY2VsbGF0aW9uIGZ1bmN0aW9uIGlzIG5vdCBnb2luZyB0byBiZSBjYWxsZWQuXG4gICAgICAgIC8vIEFsc28sIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSByZXF1ZXN0IGZyb20gdGhlIHF1ZXVlIF93aXRob3V0XyBkZXN0cm95aW5nIGV2ZXJ5dGhpbmdcbiAgICAgICAgLy8gcmVsYXRlZCB0byB0aGlzIHVwbG9hZCB0byBoYW5kbGUgcGF1c2VzLlxuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25GaWxlUmVtb3ZlKGZpbGUuaWQsICh0YXJnZXRGaWxlSUQpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZCwgeyBhYm9ydDogISF1cGxvYWQudXJsIH0pXG4gICAgICAgIHJlc29sdmUoYHVwbG9hZCAke3RhcmdldEZpbGVJRH0gd2FzIHJlbW92ZWRgKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblBhdXNlKGZpbGUuaWQsIChpc1BhdXNlZCkgPT4ge1xuICAgICAgICBpZiAoaXNQYXVzZWQpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgdGhpcyBmaWxlIGZyb20gdGhlIHF1ZXVlIHNvIGFub3RoZXIgZmlsZSBjYW4gc3RhcnQgaW4gaXRzIHBsYWNlLlxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgIHVwbG9hZC5hYm9ydCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVzdW1pbmcgYW4gdXBsb2FkIHNob3VsZCBiZSBxdWV1ZWQsIGVsc2UgeW91IGNvdWxkIHBhdXNlIGFuZCB0aGVuXG4gICAgICAgICAgLy8gcmVzdW1lIGEgcXVldWVkIHVwbG9hZCB0byBtYWtlIGl0IHNraXAgdGhlIHF1ZXVlLlxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB1cGxvYWQuc3RhcnQoKVxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblBhdXNlQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHVwbG9hZC5hYm9ydCgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uQ2FuY2VsQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZCwgeyBhYm9ydDogISF1cGxvYWQudXJsIH0pXG4gICAgICAgIHJlc29sdmUoYHVwbG9hZCAke2ZpbGUuaWR9IHdhcyBjYW5jZWxlZGApXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUmVzdW1lQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIGlmIChmaWxlLmVycm9yKSB7XG4gICAgICAgICAgdXBsb2FkLmFib3J0KClcbiAgICAgICAgfVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0cy5ydW4oKCkgPT4ge1xuICAgICAgICAgIHVwbG9hZC5zdGFydCgpXG4gICAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnIpXG4gICAgICB0aHJvdyBlcnJcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGUgZm9yIHVzZSB3aXRoIHVwbG9hZFxuICAgKiBAcGFyYW0ge251bWJlcn0gY3VycmVudCBmaWxlIGluIGEgcXVldWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIG51bWJlciBvZiBmaWxlcyBpbiBhIHF1ZXVlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgKi9cbiAgdXBsb2FkUmVtb3RlIChmaWxlKSB7XG4gICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuXG4gICAgY29uc3Qgb3B0cyA9IHsgLi4udGhpcy5vcHRzIH1cbiAgICBpZiAoZmlsZS50dXMpIHtcbiAgICAgIC8vIEluc3RhbGwgZmlsZS1zcGVjaWZpYyB1cGxvYWQgb3ZlcnJpZGVzLlxuICAgICAgT2JqZWN0LmFzc2lnbihvcHRzLCBmaWxlLnR1cylcbiAgICB9XG5cbiAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN0YXJ0ZWQnLCBmaWxlKVxuICAgIHRoaXMudXBweS5sb2coZmlsZS5yZW1vdGUudXJsKVxuXG4gICAgaWYgKGZpbGUuc2VydmVyVG9rZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RUb1NlcnZlclNvY2tldChmaWxlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBDbGllbnQgPSBmaWxlLnJlbW90ZS5wcm92aWRlck9wdGlvbnMucHJvdmlkZXIgPyBQcm92aWRlciA6IFJlcXVlc3RDbGllbnRcbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQodGhpcy51cHB5LCBmaWxlLnJlbW90ZS5wcm92aWRlck9wdGlvbnMpXG5cbiAgICAgIC8vICEhIGNhbmNlbGxhdGlvbiBpcyBOT1Qgc3VwcG9ydGVkIGF0IHRoaXMgc3RhZ2UgeWV0XG4gICAgICBjbGllbnQucG9zdChmaWxlLnJlbW90ZS51cmwsIHtcbiAgICAgICAgLi4uZmlsZS5yZW1vdGUuYm9keSxcbiAgICAgICAgZW5kcG9pbnQ6IG9wdHMuZW5kcG9pbnQsXG4gICAgICAgIHVwbG9hZFVybDogb3B0cy51cGxvYWRVcmwsXG4gICAgICAgIHByb3RvY29sOiAndHVzJyxcbiAgICAgICAgc2l6ZTogZmlsZS5kYXRhLnNpemUsXG4gICAgICAgIGhlYWRlcnM6IG9wdHMuaGVhZGVycyxcbiAgICAgICAgbWV0YWRhdGE6IGZpbGUubWV0YSxcbiAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnVwcHkuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHsgc2VydmVyVG9rZW46IHJlcy50b2tlbiB9KVxuICAgICAgICBmaWxlID0gdGhpcy51cHB5LmdldEZpbGUoZmlsZS5pZClcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdFRvU2VydmVyU29ja2V0KGZpbGUpXG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnIpXG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU2VlIHRoZSBjb21tZW50IG9uIHRoZSB1cGxvYWQoKSBtZXRob2QuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgd2hlbiBhbiB1cGxvYWQgaXMgcmVtb3ZlZCwgY29tcGxldGVkLCBvciBjYW5jZWxsZWQsIHdlIG5lZWQgdG8gY2xvc2UgdGhlIFdlYlNvY2tldCBjb25uZWN0aW9uLiBUaGlzIGlzXG4gICAqIGhhbmRsZWQgYnkgdGhlIHJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKCkgZnVuY3Rpb24sIHNvIHRoZSBzYW1lIGd1aWRlbGluZXMgYXBwbHkgYXMgaW4gdXBsb2FkKCkuXG4gICAqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGVcbiAgICovXG4gIGNvbm5lY3RUb1NlcnZlclNvY2tldCAoZmlsZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IGZpbGUuc2VydmVyVG9rZW5cbiAgICAgIGNvbnN0IGhvc3QgPSBnZXRTb2NrZXRIb3N0KGZpbGUucmVtb3RlLmNvbXBhbmlvblVybClcbiAgICAgIGNvbnN0IHNvY2tldCA9IG5ldyBTb2NrZXQoeyB0YXJnZXQ6IGAke2hvc3R9L2FwaS8ke3Rva2VufWAsIGF1dG9PcGVuOiBmYWxzZSB9KVxuICAgICAgdGhpcy51cGxvYWRlclNvY2tldHNbZmlsZS5pZF0gPSBzb2NrZXRcbiAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBuZXcgRXZlbnRUcmFja2VyKHRoaXMudXBweSlcblxuICAgICAgdGhpcy5vbkZpbGVSZW1vdmUoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgc29ja2V0LnNlbmQoJ2NhbmNlbCcsIHt9KVxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG4gICAgICAgIHJlc29sdmUoYHVwbG9hZCAke2ZpbGUuaWR9IHdhcyByZW1vdmVkYClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25QYXVzZShmaWxlLmlkLCAoaXNQYXVzZWQpID0+IHtcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoaXMgZmlsZSBmcm9tIHRoZSBxdWV1ZSBzbyBhbm90aGVyIGZpbGUgY2FuIHN0YXJ0IGluIGl0cyBwbGFjZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXN1bWluZyBhbiB1cGxvYWQgc2hvdWxkIGJlIHF1ZXVlZCwgZWxzZSB5b3UgY291bGQgcGF1c2UgYW5kIHRoZW5cbiAgICAgICAgICAvLyByZXN1bWUgYSBxdWV1ZWQgdXBsb2FkIHRvIG1ha2UgaXQgc2tpcCB0aGUgcXVldWUuXG4gICAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHNvY2tldC5zZW5kKCdyZXN1bWUnLCB7fSlcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25QYXVzZUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25DYW5jZWxBbGwoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgc29ja2V0LnNlbmQoJ2NhbmNlbCcsIHt9KVxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG4gICAgICAgIHJlc29sdmUoYHVwbG9hZCAke2ZpbGUuaWR9IHdhcyBjYW5jZWxlZGApXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUmVzdW1lQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIGlmIChmaWxlLmVycm9yKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgIH1cbiAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncmVzdW1lJywge30pXG4gICAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUmV0cnkoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICAvLyBPbmx5IGRvIHRoZSByZXRyeSBpZiB0aGUgdXBsb2FkIGlzIGFjdHVhbGx5IGluIHByb2dyZXNzO1xuICAgICAgICAvLyBlbHNlIHdlIGNvdWxkIHRyeSB0byBzZW5kIHRoZXNlIG1lc3NhZ2VzIHdoZW4gdGhlIHVwbG9hZCBpcyBzdGlsbCBxdWV1ZWQuXG4gICAgICAgIC8vIFdlIG1heSBuZWVkIGEgYmV0dGVyIGNoZWNrIGZvciB0aGlzIHNpbmNlIHRoZSBzb2NrZXQgbWF5IGFsc28gYmUgY2xvc2VkXG4gICAgICAgIC8vIGZvciBvdGhlciByZWFzb25zLCBsaWtlIG5ldHdvcmsgZmFpbHVyZXMuXG4gICAgICAgIGlmIChzb2NrZXQuaXNPcGVuKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUmV0cnlBbGwoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICAvLyBTZWUgdGhlIGNvbW1lbnQgaW4gdGhlIG9uUmV0cnkoKSBjYWxsXG4gICAgICAgIGlmIChzb2NrZXQuaXNPcGVuKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBzb2NrZXQub24oJ3Byb2dyZXNzJywgKHByb2dyZXNzRGF0YSkgPT4gZW1pdFNvY2tldFByb2dyZXNzKHRoaXMsIHByb2dyZXNzRGF0YSwgZmlsZSkpXG5cbiAgICAgIHNvY2tldC5vbignZXJyb3InLCAoZXJyRGF0YSkgPT4ge1xuICAgICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IGVyckRhdGEuZXJyb3JcbiAgICAgICAgY29uc3QgZXJyb3IgPSBPYmplY3QuYXNzaWduKG5ldyBFcnJvcihtZXNzYWdlKSwgeyBjYXVzZTogZXJyRGF0YS5lcnJvciB9KVxuXG4gICAgICAgIC8vIElmIHRoZSByZW1vdGUgcmV0cnkgb3B0aW1pc2F0aW9uIHNob3VsZCBub3QgYmUgdXNlZCxcbiAgICAgICAgLy8gY2xvc2UgdGhlIHNvY2tldOKAlHRoaXMgd2lsbCB0ZWxsIGNvbXBhbmlvbiB0byBjbGVhciBzdGF0ZSBhbmQgZGVsZXRlIHRoZSBmaWxlLlxuICAgICAgICBpZiAoIXRoaXMub3B0cy51c2VGYXN0UmVtb3RlUmV0cnkpIHtcbiAgICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZSBzZXJ2ZXJUb2tlbiBzbyB0aGF0IGEgbmV3IG9uZSB3aWxsIGJlIGNyZWF0ZWQgZm9yIHRoZSByZXRyeS5cbiAgICAgICAgICB0aGlzLnVwcHkuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgICAgIHNlcnZlclRva2VuOiBudWxsLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc29ja2V0LmNsb3NlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnJvcilcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSlcblxuICAgICAgc29ja2V0Lm9uKCdzdWNjZXNzJywgKGRhdGEpID0+IHtcbiAgICAgICAgY29uc3QgdXBsb2FkUmVzcCA9IHtcbiAgICAgICAgICB1cGxvYWRVUkw6IGRhdGEudXJsLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdWNjZXNzJywgZmlsZSwgdXBsb2FkUmVzcClcbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcblxuICAgICAgbGV0IHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgIHNvY2tldC5vcGVuKClcbiAgICAgICAgaWYgKGZpbGUuaXNQYXVzZWQpIHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGhlcmUsIHRoZSBjYWxsZXIgd2lsbCB0YWtlIGNhcmUgb2YgY2FuY2VsbGluZyB0aGUgdXBsb2FkIGl0c2VsZlxuICAgICAgICAvLyB1c2luZyByZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpLiBUaGlzIGlzIGJlY2F1c2UgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKSBoYXMgdG8gYmVcbiAgICAgICAgLy8gY2FsbGVkIHdoZW4gdGhpcyByZXF1ZXN0IGlzIHN0aWxsIGluIHRoZSBxdWV1ZSwgYW5kIGhhcyBub3QgYmVlbiBzdGFydGVkIHlldCwgdG9vLiBBdFxuICAgICAgICAvLyB0aGF0IHBvaW50IHRoaXMgY2FuY2VsbGF0aW9uIGZ1bmN0aW9uIGlzIG5vdCBnb2luZyB0byBiZSBjYWxsZWQuXG4gICAgICAgIC8vIEFsc28sIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSByZXF1ZXN0IGZyb20gdGhlIHF1ZXVlIF93aXRob3V0XyBkZXN0cm95aW5nIGV2ZXJ5dGhpbmdcbiAgICAgICAgLy8gcmVsYXRlZCB0byB0aGlzIHVwbG9hZCB0byBoYW5kbGUgcGF1c2VzLlxuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgdXBsb2FkVXJsIG9uIHRoZSBmaWxlIG9wdGlvbnMsIHNvIHRoYXQgd2hlbiBHb2xkZW4gUmV0cmlldmVyXG4gICAqIHJlc3RvcmVzIHN0YXRlLCB3ZSB3aWxsIGNvbnRpbnVlIHVwbG9hZGluZyB0byB0aGUgY29ycmVjdCBVUkwuXG4gICAqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZFVSTFxuICAgKi9cbiAgb25SZWNlaXZlVXBsb2FkVXJsIChmaWxlLCB1cGxvYWRVUkwpIHtcbiAgICBjb25zdCBjdXJyZW50RmlsZSA9IHRoaXMudXBweS5nZXRGaWxlKGZpbGUuaWQpXG4gICAgaWYgKCFjdXJyZW50RmlsZSkgcmV0dXJuXG4gICAgLy8gT25seSBkbyB0aGUgdXBkYXRlIGlmIHdlIGRpZG4ndCBoYXZlIGFuIHVwbG9hZCBVUkwgeWV0LlxuICAgIGlmICghY3VycmVudEZpbGUudHVzIHx8IGN1cnJlbnRGaWxlLnR1cy51cGxvYWRVcmwgIT09IHVwbG9hZFVSTCkge1xuICAgICAgdGhpcy51cHB5LmxvZygnW1R1c10gU3RvcmluZyB1cGxvYWQgdXJsJylcbiAgICAgIHRoaXMudXBweS5zZXRGaWxlU3RhdGUoY3VycmVudEZpbGUuaWQsIHtcbiAgICAgICAgdHVzOiB7IC4uLmN1cnJlbnRGaWxlLnR1cywgdXBsb2FkVXJsOiB1cGxvYWRVUkwgfSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbihzdHJpbmcpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25GaWxlUmVtb3ZlIChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCdmaWxlLXJlbW92ZWQnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKGZpbGVJRCA9PT0gZmlsZS5pZCkgY2IoZmlsZS5pZClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbihib29sZWFuKTogdm9pZH0gY2JcbiAgICovXG4gIG9uUGF1c2UgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3VwbG9hZC1wYXVzZScsICh0YXJnZXRGaWxlSUQsIGlzUGF1c2VkKSA9PiB7XG4gICAgICBpZiAoZmlsZUlEID09PSB0YXJnZXRGaWxlSUQpIHtcbiAgICAgICAgLy8gY29uc3QgaXNQYXVzZWQgPSB0aGlzLnVwcHkucGF1c2VSZXN1bWUoZmlsZUlEKVxuICAgICAgICBjYihpc1BhdXNlZClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25SZXRyeSAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigndXBsb2FkLXJldHJ5JywgKHRhcmdldEZpbGVJRCkgPT4ge1xuICAgICAgaWYgKGZpbGVJRCA9PT0gdGFyZ2V0RmlsZUlEKSB7XG4gICAgICAgIGNiKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25SZXRyeUFsbCAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigncmV0cnktYWxsJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm5cbiAgICAgIGNiKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25QYXVzZUFsbCAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigncGF1c2UtYWxsJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm5cbiAgICAgIGNiKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25DYW5jZWxBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ2NhbmNlbC1hbGwnLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpIHJldHVyblxuICAgICAgY2IoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IGNiXG4gICAqL1xuICBvblJlc3VtZUFsbCAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigncmVzdW1lLWFsbCcsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuXG4gICAgICBjYigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyhVcHB5RmlsZSB8IEZhaWxlZFVwcHlGaWxlKVtdfSBmaWxlc1xuICAgKi9cbiAgdXBsb2FkRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBmaWxlcy5tYXAoKGZpbGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBpICsgMVxuICAgICAgY29uc3QgdG90YWwgPSBmaWxlcy5sZW5ndGhcblxuICAgICAgaWYgKCdlcnJvcicgaW4gZmlsZSAmJiBmaWxlLmVycm9yKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZmlsZS5lcnJvcikpXG4gICAgICB9IGlmIChmaWxlLmlzUmVtb3RlKSB7XG4gICAgICAgIC8vIFdlIGVtaXQgdXBsb2FkLXN0YXJ0ZWQgaGVyZSwgc28gdGhhdCBpdCdzIGFsc28gZW1pdHRlZCBmb3IgZmlsZXNcbiAgICAgICAgLy8gdGhhdCBoYXZlIHRvIHdhaXQgZHVlIHRvIHRoZSBgbGltaXRgIG9wdGlvbi5cbiAgICAgICAgLy8gRG9uJ3QgZG91YmxlLWVtaXQgdXBsb2FkLXN0YXJ0ZWQgZm9yIEdvbGRlbiBSZXRyaWV2ZXItcmVzdG9yZWQgZmlsZXMgdGhhdCB3ZXJlIGFscmVhZHkgc3RhcnRlZFxuICAgICAgICBpZiAoIWZpbGUucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZCB8fCAhZmlsZS5pc1Jlc3RvcmVkKSB7XG4gICAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy51cGxvYWRSZW1vdGUoZmlsZSwgY3VycmVudCwgdG90YWwpXG4gICAgICB9XG4gICAgICAvLyBEb24ndCBkb3VibGUtZW1pdCB1cGxvYWQtc3RhcnRlZCBmb3IgR29sZGVuIFJldHJpZXZlci1yZXN0b3JlZCBmaWxlcyB0aGF0IHdlcmUgYWxyZWFkeSBzdGFydGVkXG4gICAgICBpZiAoIWZpbGUucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZCB8fCAhZmlsZS5pc1Jlc3RvcmVkKSB7XG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3RhcnRlZCcsIGZpbGUpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy51cGxvYWQoZmlsZSwgY3VycmVudCwgdG90YWwpXG4gICAgfSlcblxuICAgIHJldHVybiBzZXR0bGUocHJvbWlzZXMpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gZmlsZUlEc1xuICAgKi9cbiAgaGFuZGxlVXBsb2FkIChmaWxlSURzKSB7XG4gICAgaWYgKGZpbGVJRHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKCdbVHVzXSBObyBmaWxlcyB0byB1cGxvYWQnKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0cy5saW1pdCA9PT0gMCkge1xuICAgICAgdGhpcy51cHB5LmxvZyhcbiAgICAgICAgJ1tUdXNdIFdoZW4gdXBsb2FkaW5nIG11bHRpcGxlIGZpbGVzIGF0IG9uY2UsIGNvbnNpZGVyIHNldHRpbmcgdGhlIGBsaW1pdGAgb3B0aW9uICh0byBgMTBgIGZvciBleGFtcGxlKSwgdG8gbGltaXQgdGhlIG51bWJlciBvZiBjb25jdXJyZW50IHVwbG9hZHMsIHdoaWNoIGhlbHBzIHByZXZlbnQgbWVtb3J5IGFuZCBuZXR3b3JrIGlzc3VlczogaHR0cHM6Ly91cHB5LmlvL2RvY3MvdHVzLyNsaW1pdC0wJyxcbiAgICAgICAgJ3dhcm5pbmcnXG4gICAgICApXG4gICAgfVxuXG4gICAgdGhpcy51cHB5LmxvZygnW1R1c10gVXBsb2FkaW5nLi4uJylcbiAgICBjb25zdCBmaWxlc1RvVXBsb2FkID0gZmlsZUlEcy5tYXAoKGZpbGVJRCkgPT4gdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSlcblxuICAgIHJldHVybiB0aGlzLnVwbG9hZEZpbGVzKGZpbGVzVG9VcGxvYWQpXG4gICAgICAudGhlbigoKSA9PiBudWxsKVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgIGNhcGFiaWxpdGllczogeyAuLi50aGlzLnVwcHkuZ2V0U3RhdGUoKS5jYXBhYmlsaXRpZXMsIHJlc3VtYWJsZVVwbG9hZHM6IHRydWUgfSxcbiAgICB9KVxuICAgIHRoaXMudXBweS5hZGRVcGxvYWRlcih0aGlzLmhhbmRsZVVwbG9hZClcblxuICAgIHRoaXMudXBweS5vbigncmVzZXQtcHJvZ3Jlc3MnLCB0aGlzLmhhbmRsZVJlc2V0UHJvZ3Jlc3MpXG4gIH1cblxuICB1bmluc3RhbGwgKCkge1xuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBjYXBhYmlsaXRpZXM6IHsgLi4udGhpcy51cHB5LmdldFN0YXRlKCkuY2FwYWJpbGl0aWVzLCByZXN1bWFibGVVcGxvYWRzOiBmYWxzZSB9LFxuICAgIH0pXG4gICAgdGhpcy51cHB5LnJlbW92ZVVwbG9hZGVyKHRoaXMuaGFuZGxlVXBsb2FkKVxuICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZSBhIHdyYXBwZXIgYXJvdW5kIGFuIGV2ZW50IGVtaXR0ZXIgd2l0aCBhIGByZW1vdmVgIG1ldGhvZCB0byByZW1vdmVcbiAqIGFsbCBldmVudHMgdGhhdCB3ZXJlIGFkZGVkIHVzaW5nIHRoZSB3cmFwcGVkIGVtaXR0ZXIuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRXZlbnRUcmFja2VyIHtcbiAgI2VtaXR0ZXJcblxuICAjZXZlbnRzID0gW11cblxuICBjb25zdHJ1Y3RvciAoZW1pdHRlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIgPSBlbWl0dGVyXG4gIH1cblxuICBvbiAoZXZlbnQsIGZuKSB7XG4gICAgdGhpcy4jZXZlbnRzLnB1c2goW2V2ZW50LCBmbl0pXG4gICAgcmV0dXJuIHRoaXMuI2VtaXR0ZXIub24oZXZlbnQsIGZuKVxuICB9XG5cbiAgcmVtb3ZlICgpIHtcbiAgICBmb3IgKGNvbnN0IFtldmVudCwgZm5dIG9mIHRoaXMuI2V2ZW50cy5zcGxpY2UoMCkpIHtcbiAgICAgIHRoaXMuI2VtaXR0ZXIub2ZmKGV2ZW50LCBmbilcbiAgICB9XG4gIH1cbn1cbiIsImNsYXNzIE5ldHdvcmtFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKGVycm9yLCB4aHIgPSBudWxsKSB7XG4gICAgc3VwZXIoYFRoaXMgbG9va3MgbGlrZSBhIG5ldHdvcmsgZXJyb3IsIHRoZSBlbmRwb2ludCBtaWdodCBiZSBibG9ja2VkIGJ5IGFuIGludGVybmV0IHByb3ZpZGVyIG9yIGEgZmlyZXdhbGwuYClcblxuICAgIHRoaXMuY2F1c2UgPSBlcnJvclxuICAgIHRoaXMuaXNOZXR3b3JrRXJyb3IgPSB0cnVlXG4gICAgdGhpcy5yZXF1ZXN0ID0geGhyXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXR3b3JrRXJyb3JcbiIsImZ1bmN0aW9uIGNyZWF0ZUNhbmNlbEVycm9yICgpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQ2FuY2VsbGVkJylcbn1cblxuY2xhc3MgUmF0ZUxpbWl0ZWRRdWV1ZSB7XG4gICNhY3RpdmVSZXF1ZXN0cyA9IDBcblxuICAjcXVldWVkSGFuZGxlcnMgPSBbXVxuXG4gIGNvbnN0cnVjdG9yIChsaW1pdCkge1xuICAgIGlmICh0eXBlb2YgbGltaXQgIT09ICdudW1iZXInIHx8IGxpbWl0ID09PSAwKSB7XG4gICAgICB0aGlzLmxpbWl0ID0gSW5maW5pdHlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saW1pdCA9IGxpbWl0XG4gICAgfVxuICB9XG5cbiAgI2NhbGwgKGZuKSB7XG4gICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgKz0gMVxuXG4gICAgbGV0IGRvbmUgPSBmYWxzZVxuXG4gICAgbGV0IGNhbmNlbEFjdGl2ZVxuICAgIHRyeSB7XG4gICAgICBjYW5jZWxBY3RpdmUgPSBmbigpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLiNhY3RpdmVSZXF1ZXN0cyAtPSAxXG4gICAgICB0aHJvdyBlcnJcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6ICgpID0+IHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVyblxuICAgICAgICBkb25lID0gdHJ1ZVxuICAgICAgICB0aGlzLiNhY3RpdmVSZXF1ZXN0cyAtPSAxXG4gICAgICAgIGNhbmNlbEFjdGl2ZSgpXG4gICAgICAgIHRoaXMuI3F1ZXVlTmV4dCgpXG4gICAgICB9LFxuXG4gICAgICBkb25lOiAoKSA9PiB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm5cbiAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgICB0aGlzLiNxdWV1ZU5leHQoKVxuICAgICAgfSxcbiAgICB9XG4gIH1cblxuICAjcXVldWVOZXh0ICgpIHtcbiAgICAvLyBEbyBpdCBzb29uIGJ1dCBub3QgaW1tZWRpYXRlbHksIHRoaXMgYWxsb3dzIGNsZWFyaW5nIG91dCB0aGUgZW50aXJlIHF1ZXVlIHN5bmNocm9ub3VzbHlcbiAgICAvLyBvbmUgYnkgb25lIHdpdGhvdXQgY29udGludW91c2x5IF9hZHZhbmNpbmdfIGl0IChhbmQgc3RhcnRpbmcgbmV3IHRhc2tzIGJlZm9yZSBpbW1lZGlhdGVseVxuICAgIC8vIGFib3J0aW5nIHRoZW0pXG4gICAgcXVldWVNaWNyb3Rhc2soKCkgPT4gdGhpcy4jbmV4dCgpKVxuICB9XG5cbiAgI25leHQgKCkge1xuICAgIGlmICh0aGlzLiNhY3RpdmVSZXF1ZXN0cyA+PSB0aGlzLmxpbWl0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gRGlzcGF0Y2ggdGhlIG5leHQgcmVxdWVzdCwgYW5kIHVwZGF0ZSB0aGUgYWJvcnQvZG9uZSBoYW5kbGVyc1xuICAgIC8vIHNvIHRoYXQgY2FuY2VsbGluZyBpdCBkb2VzIHRoZSBSaWdodCBUaGluZyAoYW5kIGRvZXNuJ3QganVzdCB0cnlcbiAgICAvLyB0byBkZXF1ZXVlIGFuIGFscmVhZHktcnVubmluZyByZXF1ZXN0KS5cbiAgICBjb25zdCBuZXh0ID0gdGhpcy4jcXVldWVkSGFuZGxlcnMuc2hpZnQoKVxuICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLiNjYWxsKG5leHQuZm4pXG4gICAgbmV4dC5hYm9ydCA9IGhhbmRsZXIuYWJvcnRcbiAgICBuZXh0LmRvbmUgPSBoYW5kbGVyLmRvbmVcbiAgfVxuXG4gICNxdWV1ZSAoZm4sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGhhbmRsZXIgPSB7XG4gICAgICBmbixcbiAgICAgIHByaW9yaXR5OiBvcHRpb25zLnByaW9yaXR5IHx8IDAsXG4gICAgICBhYm9ydDogKCkgPT4ge1xuICAgICAgICB0aGlzLiNkZXF1ZXVlKGhhbmRsZXIpXG4gICAgICB9LFxuICAgICAgZG9uZTogKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBtYXJrIGEgcXVldWVkIHJlcXVlc3QgYXMgZG9uZTogdGhpcyBpbmRpY2F0ZXMgYSBidWcnKVxuICAgICAgfSxcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmZpbmRJbmRleCgob3RoZXIpID0+IHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnByaW9yaXR5ID4gb3RoZXIucHJpb3JpdHlcbiAgICB9KVxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRoaXMuI3F1ZXVlZEhhbmRsZXJzLnB1c2goaGFuZGxlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jcXVldWVkSGFuZGxlcnMuc3BsaWNlKGluZGV4LCAwLCBoYW5kbGVyKVxuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlclxuICB9XG5cbiAgI2RlcXVldWUgKGhhbmRsZXIpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmluZGV4T2YoaGFuZGxlcilcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLiNxdWV1ZWRIYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG5cbiAgcnVuIChmbiwgcXVldWVPcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuI2FjdGl2ZVJlcXVlc3RzIDwgdGhpcy5saW1pdCkge1xuICAgICAgcmV0dXJuIHRoaXMuI2NhbGwoZm4pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNxdWV1ZShmbiwgcXVldWVPcHRpb25zKVxuICB9XG5cbiAgd3JhcFByb21pc2VGdW5jdGlvbiAoZm4sIHF1ZXVlT3B0aW9ucykge1xuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgbGV0IHF1ZXVlZFJlcXVlc3RcbiAgICAgIGNvbnN0IG91dGVyUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucnVuKCgpID0+IHtcbiAgICAgICAgICBsZXQgY2FuY2VsRXJyb3JcbiAgICAgICAgICBsZXQgaW5uZXJQcm9taXNlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlubmVyUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShmbiguLi5hcmdzKSlcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlubmVyUHJvbWlzZSA9IFByb21pc2UucmVqZWN0KGVycilcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbm5lclByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAoY2FuY2VsRXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGNhbmNlbEVycm9yKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGNhbmNlbEVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChjYW5jZWxFcnJvcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjYW5jZWxFcnJvciA9IGNyZWF0ZUNhbmNlbEVycm9yKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHF1ZXVlT3B0aW9ucylcbiAgICAgIH0pXG5cbiAgICAgIG91dGVyUHJvbWlzZS5hYm9ydCA9ICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRlclByb21pc2VcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFJhdGVMaW1pdGVkUXVldWUsXG4gIGludGVybmFsUmF0ZUxpbWl0ZWRRdWV1ZTogU3ltYm9sKCdfX3F1ZXVlJyksXG59XG4iLCJjb25zdCBoYXMgPSByZXF1aXJlKCcuL2hhc1Byb3BlcnR5JylcblxuZnVuY3Rpb24gaW5zZXJ0UmVwbGFjZW1lbnQgKHNvdXJjZSwgcngsIHJlcGxhY2VtZW50KSB7XG4gIGNvbnN0IG5ld1BhcnRzID0gW11cbiAgc291cmNlLmZvckVhY2goKGNodW5rKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgc291cmNlIGNvbnRhaW5zIG11bHRpcGxlIHBsYWNlaG9sZGVycyBmb3IgaW50ZXJwb2xhdGlvbixcbiAgICAvLyB3ZSBzaG91bGQgaWdub3JlIGNodW5rcyB0aGF0IGFyZSBub3Qgc3RyaW5ncywgYmVjYXVzZSB0aG9zZVxuICAgIC8vIGNhbiBiZSBKU1ggb2JqZWN0cyBhbmQgd2lsbCBiZSBvdGhlcndpc2UgaW5jb3JyZWN0bHkgdHVybmVkIGludG8gc3RyaW5ncy5cbiAgICAvLyBXaXRob3V0IHRoaXMgY29uZGl0aW9uIHdl4oCZZCBnZXQgdGhpczogW29iamVjdCBPYmplY3RdIGhlbGxvIFtvYmplY3QgT2JqZWN0XSBteSA8YnV0dG9uPlxuICAgIGlmICh0eXBlb2YgY2h1bmsgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3UGFydHMucHVzaChjaHVuaylcbiAgICB9XG5cbiAgICByZXR1cm4gcnhbU3ltYm9sLnNwbGl0XShjaHVuaykuZm9yRWFjaCgocmF3LCBpLCBsaXN0KSA9PiB7XG4gICAgICBpZiAocmF3ICE9PSAnJykge1xuICAgICAgICBuZXdQYXJ0cy5wdXNoKHJhdylcbiAgICAgIH1cblxuICAgICAgLy8gSW50ZXJsYWNlIHdpdGggdGhlIGByZXBsYWNlbWVudGAgdmFsdWVcbiAgICAgIGlmIChpIDwgbGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICAgIG5ld1BhcnRzLnB1c2gocmVwbGFjZW1lbnQpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIG5ld1BhcnRzXG59XG5cbi8qKlxuICogVGFrZXMgYSBzdHJpbmcgd2l0aCBwbGFjZWhvbGRlciB2YXJpYWJsZXMgbGlrZSBgJXtzbWFydF9jb3VudH0gZmlsZSBzZWxlY3RlZGBcbiAqIGFuZCByZXBsYWNlcyBpdCB3aXRoIHZhbHVlcyBmcm9tIG9wdGlvbnMgYHtzbWFydF9jb3VudDogNX1gXG4gKlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKiB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9haXJibmIvcG9seWdsb3QuanMvYmxvYi9tYXN0ZXIvbGliL3BvbHlnbG90LmpzI0wyOTlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGhyYXNlIHRoYXQgbmVlZHMgaW50ZXJwb2xhdGlvbiwgd2l0aCBwbGFjZWhvbGRlcnNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzXG4gKiBAcmV0dXJucyB7YW55W119IGludGVycG9sYXRlZFxuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZSAocGhyYXNlLCBvcHRpb25zKSB7XG4gIGNvbnN0IGRvbGxhclJlZ2V4ID0gL1xcJC9nXG4gIGNvbnN0IGRvbGxhckJpbGxzWWFsbCA9ICckJCQkJ1xuICBsZXQgaW50ZXJwb2xhdGVkID0gW3BocmFzZV1cblxuICBpZiAob3B0aW9ucyA9PSBudWxsKSByZXR1cm4gaW50ZXJwb2xhdGVkXG5cbiAgZm9yIChjb25zdCBhcmcgb2YgT2JqZWN0LmtleXMob3B0aW9ucykpIHtcbiAgICBpZiAoYXJnICE9PSAnXycpIHtcbiAgICAgIC8vIEVuc3VyZSByZXBsYWNlbWVudCB2YWx1ZSBpcyBlc2NhcGVkIHRvIHByZXZlbnQgc3BlY2lhbCAkLXByZWZpeGVkXG4gICAgICAvLyByZWdleCByZXBsYWNlIHRva2Vucy4gdGhlIFwiJCQkJFwiIGlzIG5lZWRlZCBiZWNhdXNlIGVhY2ggXCIkXCIgbmVlZHMgdG9cbiAgICAgIC8vIGJlIGVzY2FwZWQgd2l0aCBcIiRcIiBpdHNlbGYsIGFuZCB3ZSBuZWVkIHR3byBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dC5cbiAgICAgIGxldCByZXBsYWNlbWVudCA9IG9wdGlvbnNbYXJnXVxuICAgICAgaWYgKHR5cGVvZiByZXBsYWNlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVwbGFjZW1lbnQgPSBkb2xsYXJSZWdleFtTeW1ib2wucmVwbGFjZV0ocmVwbGFjZW1lbnQsIGRvbGxhckJpbGxzWWFsbClcbiAgICAgIH1cbiAgICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBgUmVnRXhwYCBlYWNoIHRpbWUgaW5zdGVhZCBvZiB1c2luZyBhIG1vcmUtZWZmaWNpZW50XG4gICAgICAvLyBzdHJpbmcgcmVwbGFjZSBzbyB0aGF0IHRoZSBzYW1lIGFyZ3VtZW50IGNhbiBiZSByZXBsYWNlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgLy8gaW4gdGhlIHNhbWUgcGhyYXNlLlxuICAgICAgaW50ZXJwb2xhdGVkID0gaW5zZXJ0UmVwbGFjZW1lbnQoaW50ZXJwb2xhdGVkLCBuZXcgUmVnRXhwKGAlXFxcXHske2FyZ31cXFxcfWAsICdnJyksIHJlcGxhY2VtZW50KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbnRlcnBvbGF0ZWRcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGVzIHN0cmluZ3Mgd2l0aCBpbnRlcnBvbGF0aW9uICYgcGx1cmFsaXphdGlvbiBzdXBwb3J0LlxuICogRXh0ZW5zaWJsZSB3aXRoIGN1c3RvbSBkaWN0aW9uYXJpZXMgYW5kIHBsdXJhbGl6YXRpb24gZnVuY3Rpb25zLlxuICpcbiAqIEJvcnJvd3MgaGVhdmlseSBmcm9tIGFuZCBpbnNwaXJlZCBieSBQb2x5Z2xvdCBodHRwczovL2dpdGh1Yi5jb20vYWlyYm5iL3BvbHlnbG90LmpzLFxuICogYmFzaWNhbGx5IGEgc3RyaXBwZWQtZG93biB2ZXJzaW9uIG9mIGl0LiBEaWZmZXJlbmNlczogcGx1cmFsaXphdGlvbiBmdW5jdGlvbnMgYXJlIG5vdCBoYXJkY29kZWRcbiAqIGFuZCBjYW4gYmUgZWFzaWx5IGFkZGVkIGFtb25nIHdpdGggZGljdGlvbmFyaWVzLCBuZXN0ZWQgb2JqZWN0cyBhcmUgdXNlZCBmb3IgcGx1cmFsaXphdGlvblxuICogYXMgb3Bwb3NlZCB0byBgfHx8fGAgZGVsaW1ldGVyXG4gKlxuICogVXNhZ2UgZXhhbXBsZTogYHRyYW5zbGF0b3IudHJhbnNsYXRlKCdmaWxlc19jaG9zZW4nLCB7c21hcnRfY291bnQ6IDN9KWBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUcmFuc2xhdG9yIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fEFycmF5PG9iamVjdD59IGxvY2FsZXMgLSBsb2NhbGUgb3IgbGlzdCBvZiBsb2NhbGVzLlxuICAgKi9cbiAgY29uc3RydWN0b3IgKGxvY2FsZXMpIHtcbiAgICB0aGlzLmxvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHt9LFxuICAgICAgcGx1cmFsaXplIChuKSB7XG4gICAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMVxuICAgICAgfSxcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShsb2NhbGVzKSkge1xuICAgICAgbG9jYWxlcy5mb3JFYWNoKHRoaXMuI2FwcGx5LCB0aGlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNhcHBseShsb2NhbGVzKVxuICAgIH1cbiAgfVxuXG4gICNhcHBseSAobG9jYWxlKSB7XG4gICAgaWYgKCFsb2NhbGU/LnN0cmluZ3MpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHByZXZMb2NhbGUgPSB0aGlzLmxvY2FsZVxuICAgIHRoaXMubG9jYWxlID0geyAuLi5wcmV2TG9jYWxlLCBzdHJpbmdzOiB7IC4uLnByZXZMb2NhbGUuc3RyaW5ncywgLi4ubG9jYWxlLnN0cmluZ3MgfSB9XG4gICAgdGhpcy5sb2NhbGUucGx1cmFsaXplID0gbG9jYWxlLnBsdXJhbGl6ZSB8fCBwcmV2TG9jYWxlLnBsdXJhbGl6ZVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyB0cmFuc2xhdGUgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgbGF0ZXIgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnMgaW4gc3RyaW5nXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRyYW5zbGF0ZWQgKGFuZCBpbnRlcnBvbGF0ZWQpXG4gICAqL1xuICB0cmFuc2xhdGUgKGtleSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZUFycmF5KGtleSwgb3B0aW9ucykuam9pbignJylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSB0cmFuc2xhdGlvbiBhbmQgcmV0dXJuIHRoZSB0cmFuc2xhdGVkIGFuZCBpbnRlcnBvbGF0ZWQgcGFydHMgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnNcbiAgICogQHJldHVybnMge0FycmF5fSBUaGUgdHJhbnNsYXRlZCBhbmQgaW50ZXJwb2xhdGVkIHBhcnRzLCBpbiBvcmRlci5cbiAgICovXG4gIHRyYW5zbGF0ZUFycmF5IChrZXksIG9wdGlvbnMpIHtcbiAgICBpZiAoIWhhcyh0aGlzLmxvY2FsZS5zdHJpbmdzLCBrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG1pc3Npbmcgc3RyaW5nOiAke2tleX1gKVxuICAgIH1cblxuICAgIGNvbnN0IHN0cmluZyA9IHRoaXMubG9jYWxlLnN0cmluZ3Nba2V5XVxuICAgIGNvbnN0IGhhc1BsdXJhbEZvcm1zID0gdHlwZW9mIHN0cmluZyA9PT0gJ29iamVjdCdcblxuICAgIGlmIChoYXNQbHVyYWxGb3Jtcykge1xuICAgICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuc21hcnRfY291bnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IHBsdXJhbCA9IHRoaXMubG9jYWxlLnBsdXJhbGl6ZShvcHRpb25zLnNtYXJ0X2NvdW50KVxuICAgICAgICByZXR1cm4gaW50ZXJwb2xhdGUoc3RyaW5nW3BsdXJhbF0sIG9wdGlvbnMpXG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dGVtcHRlZCB0byB1c2UgYSBzdHJpbmcgd2l0aCBwbHVyYWwgZm9ybXMsIGJ1dCBubyB2YWx1ZSB3YXMgZ2l2ZW4gZm9yICV7c21hcnRfY291bnR9JylcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZXJwb2xhdGUoc3RyaW5nLCBvcHRpb25zKVxuICB9XG59XG4iLCJjb25zdCB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpXG5cbmZ1bmN0aW9uIGVtaXRTb2NrZXRQcm9ncmVzcyAodXBsb2FkZXIsIHByb2dyZXNzRGF0YSwgZmlsZSkge1xuICBjb25zdCB7IHByb2dyZXNzLCBieXRlc1VwbG9hZGVkLCBieXRlc1RvdGFsIH0gPSBwcm9ncmVzc0RhdGFcbiAgaWYgKHByb2dyZXNzKSB7XG4gICAgdXBsb2FkZXIudXBweS5sb2coYFVwbG9hZCBwcm9ncmVzczogJHtwcm9ncmVzc31gKVxuICAgIHVwbG9hZGVyLnVwcHkuZW1pdCgndXBsb2FkLXByb2dyZXNzJywgZmlsZSwge1xuICAgICAgdXBsb2FkZXIsXG4gICAgICBieXRlc1VwbG9hZGVkLFxuICAgICAgYnl0ZXNUb3RhbCxcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGUoZW1pdFNvY2tldFByb2dyZXNzLCAzMDAsIHtcbiAgbGVhZGluZzogdHJ1ZSxcbiAgdHJhaWxpbmc6IHRydWUsXG59KVxuIiwiY29uc3QgTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnLi9OZXR3b3JrRXJyb3InKVxuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIHdpbmRvdy5mZXRjaCB0aGF0IHRocm93cyBhIE5ldHdvcmtFcnJvciB3aGVuIGFwcHJvcHJpYXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmV0Y2hXaXRoTmV0d29ya0Vycm9yICguLi5vcHRpb25zKSB7XG4gIHJldHVybiBmZXRjaCguLi5vcHRpb25zKVxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyLm5hbWUgPT09ICdBYm9ydEVycm9yJykge1xuICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBOZXR3b3JrRXJyb3IoZXJyKVxuICAgICAgfVxuICAgIH0pXG59XG4iLCJjb25zdCBpc0RPTUVsZW1lbnQgPSByZXF1aXJlKCcuL2lzRE9NRWxlbWVudCcpXG5cbi8qKlxuICogRmluZCBhIERPTSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Tm9kZXxzdHJpbmd9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtOb2RlfG51bGx9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluZERPTUVsZW1lbnQgKGVsZW1lbnQsIGNvbnRleHQgPSBkb2N1bWVudCkge1xuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICB9XG5cbiAgaWYgKGlzRE9NRWxlbWVudChlbGVtZW50KSkge1xuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuIiwiZnVuY3Rpb24gZW5jb2RlQ2hhcmFjdGVyIChjaGFyYWN0ZXIpIHtcbiAgcmV0dXJuIGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDMyKVxufVxuXG5mdW5jdGlvbiBlbmNvZGVGaWxlbmFtZSAobmFtZSkge1xuICBsZXQgc3VmZml4ID0gJydcbiAgcmV0dXJuIG5hbWUucmVwbGFjZSgvW15BLVowLTldL2lnLCAoY2hhcmFjdGVyKSA9PiB7XG4gICAgc3VmZml4ICs9IGAtJHtlbmNvZGVDaGFyYWN0ZXIoY2hhcmFjdGVyKX1gXG4gICAgcmV0dXJuICcvJ1xuICB9KSArIHN1ZmZpeFxufVxuXG4vKipcbiAqIFRha2VzIGEgZmlsZSBvYmplY3QgYW5kIHR1cm5zIGl0IGludG8gZmlsZUlELCBieSBjb252ZXJ0aW5nIGZpbGUubmFtZSB0byBsb3dlcmNhc2UsXG4gKiByZW1vdmluZyBleHRyYSBjaGFyYWN0ZXJzIGFuZCBhZGRpbmcgdHlwZSwgc2l6ZSBhbmQgbGFzdE1vZGlmaWVkXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGZpbGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBmaWxlSURcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZUZpbGVJRCAoZmlsZSkge1xuICAvLyBJdCdzIHRlbXB0aW5nIHRvIGRvIGBbaXRlbXNdLmZpbHRlcihCb29sZWFuKS5qb2luKCctJylgIGhlcmUsIGJ1dCB0aGF0XG4gIC8vIGlzIHNsb3dlciEgc2ltcGxlIHN0cmluZyBjb25jYXRlbmF0aW9uIGlzIGZhc3RcblxuICBsZXQgaWQgPSAndXBweSdcbiAgaWYgKHR5cGVvZiBmaWxlLm5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWQgKz0gYC0ke2VuY29kZUZpbGVuYW1lKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpKX1gXG4gIH1cblxuICBpZiAoZmlsZS50eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS50eXBlfWBcbiAgfVxuXG4gIGlmIChmaWxlLm1ldGEgJiYgdHlwZW9mIGZpbGUubWV0YS5yZWxhdGl2ZVBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgaWQgKz0gYC0ke2VuY29kZUZpbGVuYW1lKGZpbGUubWV0YS5yZWxhdGl2ZVBhdGgudG9Mb3dlckNhc2UoKSl9YFxuICB9XG5cbiAgaWYgKGZpbGUuZGF0YS5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS5kYXRhLnNpemV9YFxuICB9XG4gIGlmIChmaWxlLmRhdGEubGFzdE1vZGlmaWVkICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS5kYXRhLmxhc3RNb2RpZmllZH1gXG4gIH1cblxuICByZXR1cm4gaWRcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0Qnl0ZXNSZW1haW5pbmcgKGZpbGVQcm9ncmVzcykge1xuICByZXR1cm4gZmlsZVByb2dyZXNzLmJ5dGVzVG90YWwgLSBmaWxlUHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZFxufVxuIiwiLyoqXG4gKiBUYWtlcyBhIGZ1bGwgZmlsZW5hbWUgc3RyaW5nIGFuZCByZXR1cm5zIGFuIG9iamVjdCB7bmFtZSwgZXh0ZW5zaW9ufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmdWxsRmlsZU5hbWVcbiAqIEByZXR1cm5zIHtvYmplY3R9IHtuYW1lLCBleHRlbnNpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24gKGZ1bGxGaWxlTmFtZSkge1xuICBjb25zdCBsYXN0RG90ID0gZnVsbEZpbGVOYW1lLmxhc3RJbmRleE9mKCcuJylcbiAgLy8gdGhlc2UgY291bnQgYXMgbm8gZXh0ZW5zaW9uOiBcIm5vLWRvdFwiLCBcInRyYWlsaW5nLWRvdC5cIlxuICBpZiAobGFzdERvdCA9PT0gLTEgfHwgbGFzdERvdCA9PT0gZnVsbEZpbGVOYW1lLmxlbmd0aCAtIDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogZnVsbEZpbGVOYW1lLFxuICAgICAgZXh0ZW5zaW9uOiB1bmRlZmluZWQsXG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZTogZnVsbEZpbGVOYW1lLnNsaWNlKDAsIGxhc3REb3QpLFxuICAgIGV4dGVuc2lvbjogZnVsbEZpbGVOYW1lLnNsaWNlKGxhc3REb3QgKyAxKSxcbiAgfVxufVxuIiwiY29uc3QgZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24gPSByZXF1aXJlKCcuL2dldEZpbGVOYW1lQW5kRXh0ZW5zaW9uJylcbmNvbnN0IG1pbWVUeXBlcyA9IHJlcXVpcmUoJy4vbWltZVR5cGVzJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRGaWxlVHlwZSAoZmlsZSkge1xuICBpZiAoZmlsZS50eXBlKSByZXR1cm4gZmlsZS50eXBlXG5cbiAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGZpbGUubmFtZSA/IGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uKGZpbGUubmFtZSkuZXh0ZW5zaW9uPy50b0xvd2VyQ2FzZSgpIDogbnVsbFxuICBpZiAoZmlsZUV4dGVuc2lvbiAmJiBmaWxlRXh0ZW5zaW9uIGluIG1pbWVUeXBlcykge1xuICAgIC8vIGVsc2UsIHNlZSBpZiB3ZSBjYW4gbWFwIGV4dGVuc2lvbiB0byBhIG1pbWUgdHlwZVxuICAgIHJldHVybiBtaW1lVHlwZXNbZmlsZUV4dGVuc2lvbl1cbiAgfVxuICAvLyBpZiBhbGwgZmFpbHMsIGZhbGwgYmFjayB0byBhIGdlbmVyaWMgYnl0ZSBzdHJlYW0gdHlwZVxuICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U29ja2V0SG9zdCAodXJsKSB7XG4gIC8vIGdldCB0aGUgaG9zdCBkb21haW5cbiAgY29uc3QgcmVnZXggPSAvXig/Omh0dHBzPzpcXC9cXC98XFwvXFwvKT8oPzpbXkBcXG5dK0ApPyg/Ond3d1xcLik/KFteXFxuXSspL2lcbiAgY29uc3QgaG9zdCA9IHJlZ2V4LmV4ZWModXJsKVsxXVxuICBjb25zdCBzb2NrZXRQcm90b2NvbCA9IC9eaHR0cDpcXC9cXC8vaS50ZXN0KHVybCkgPyAnd3MnIDogJ3dzcydcblxuICByZXR1cm4gYCR7c29ja2V0UHJvdG9jb2x9Oi8vJHtob3N0fWBcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3BlZWQgKGZpbGVQcm9ncmVzcykge1xuICBpZiAoIWZpbGVQcm9ncmVzcy5ieXRlc1VwbG9hZGVkKSByZXR1cm4gMFxuXG4gIGNvbnN0IHRpbWVFbGFwc2VkID0gRGF0ZS5ub3coKSAtIGZpbGVQcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gIGNvbnN0IHVwbG9hZFNwZWVkID0gZmlsZVByb2dyZXNzLmJ5dGVzVXBsb2FkZWQgLyAodGltZUVsYXBzZWQgLyAxMDAwKVxuICByZXR1cm4gdXBsb2FkU3BlZWRcbn1cbiIsIi8qKlxuICogR2V0IHRoZSBkZWNsYXJlZCB0ZXh0IGRpcmVjdGlvbiBmb3IgYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtzdHJpbmd8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGdldFRleHREaXJlY3Rpb24gKGVsZW1lbnQpIHtcbiAgLy8gVGhlcmUgaXMgYW5vdGhlciB3YXkgdG8gZGV0ZXJtaW5lIHRleHQgZGlyZWN0aW9uIHVzaW5nIGdldENvbXB1dGVkU3R5bGUoKSwgYXMgZG9uZSBoZXJlOlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGVuY2lsLWpzL3RleHQtZGlyZWN0aW9uL2Jsb2IvMmEyMzVjZTk1MDg5YjMxODVhY2VjM2I1MTMxM2NiYmE5MjFiMzgxMS90ZXh0LWRpcmVjdGlvbi5qc1xuICAvL1xuICAvLyBXZSBkbyBub3QgdXNlIHRoYXQgYXBwcm9hY2ggYmVjYXVzZSB3ZSBhcmUgaW50ZXJlc3RlZCBzcGVjaWZpY2FsbHkgaW4gdGhlIF9kZWNsYXJlZF8gdGV4dCBkaXJlY3Rpb24uXG4gIC8vIElmIG5vIHRleHQgZGlyZWN0aW9uIGlzIGRlY2xhcmVkLCB3ZSBoYXZlIHRvIHByb3ZpZGUgb3VyIG93biBleHBsaWNpdCB0ZXh0IGRpcmVjdGlvbiBzbyBvdXJcbiAgLy8gYmlkaXJlY3Rpb25hbCBDU1Mgc3R5bGUgc2hlZXRzIHdvcmsuXG4gIHdoaWxlIChlbGVtZW50ICYmICFlbGVtZW50LmRpcikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuICByZXR1cm4gZWxlbWVudD8uZGlyXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGV4dERpcmVjdGlvblxuIiwiLyoqXG4gKiBBZGRzIHplcm8gdG8gc3RyaW5ncyBzaG9ydGVyIHRoYW4gdHdvIGNoYXJhY3RlcnMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG51bWJlclxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcGFkIChudW1iZXIpIHtcbiAgcmV0dXJuIG51bWJlciA8IDEwID8gYDAke251bWJlcn1gIDogbnVtYmVyLnRvU3RyaW5nKClcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdGltZXN0YW1wIGluIHRoZSBmb3JtYXQgb2YgYGhvdXJzOm1pbnV0ZXM6c2Vjb25kc2BcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRUaW1lU3RhbXAgKCkge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKVxuICBjb25zdCBob3VycyA9IHBhZChkYXRlLmdldEhvdXJzKCkpXG4gIGNvbnN0IG1pbnV0ZXMgPSBwYWQoZGF0ZS5nZXRNaW51dGVzKCkpXG4gIGNvbnN0IHNlY29uZHMgPSBwYWQoZGF0ZS5nZXRTZWNvbmRzKCkpXG4gIHJldHVybiBgJHtob3Vyc306JHttaW51dGVzfToke3NlY29uZHN9YFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXMgKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpXG59XG4iLCIvKipcbiAqIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhIERPTSBlbGVtZW50LiBEdWNrLXR5cGluZyBiYXNlZCBvbiBgbm9kZVR5cGVgLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNET01FbGVtZW50IChvYmopIHtcbiAgcmV0dXJuIG9iaj8ubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFXG59XG4iLCJmdW5jdGlvbiBpc05ldHdvcmtFcnJvciAoeGhyKSB7XG4gIGlmICgheGhyKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuICh4aHIucmVhZHlTdGF0ZSAhPT0gMCAmJiB4aHIucmVhZHlTdGF0ZSAhPT0gNCkgfHwgeGhyLnN0YXR1cyA9PT0gMFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmV0d29ya0Vycm9yXG4iLCIvLyBfX19XaHkgbm90IGFkZCB0aGUgbWltZS10eXBlcyBwYWNrYWdlP1xuLy8gICAgSXQncyAxOS43a0IgZ3ppcHBlZCwgYW5kIHdlIG9ubHkgbmVlZCBtaW1lIHR5cGVzIGZvciB3ZWxsLWtub3duIGV4dGVuc2lvbnMgKGZvciBmaWxlIHByZXZpZXdzKS5cbi8vIF9fX1doZXJlIHRvIHRha2UgbmV3IGV4dGVuc2lvbnMgZnJvbT9cbi8vICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qc2h0dHAvbWltZS1kYi9ibG9iL21hc3Rlci9kYi5qc29uXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZDogJ3RleHQvbWFya2Rvd24nLFxuICBtYXJrZG93bjogJ3RleHQvbWFya2Rvd24nLFxuICBtcDQ6ICd2aWRlby9tcDQnLFxuICBtcDM6ICdhdWRpby9tcDMnLFxuICBzdmc6ICdpbWFnZS9zdmcreG1sJyxcbiAganBnOiAnaW1hZ2UvanBlZycsXG4gIHBuZzogJ2ltYWdlL3BuZycsXG4gIGdpZjogJ2ltYWdlL2dpZicsXG4gIGhlaWM6ICdpbWFnZS9oZWljJyxcbiAgaGVpZjogJ2ltYWdlL2hlaWYnLFxuICB5YW1sOiAndGV4dC95YW1sJyxcbiAgeW1sOiAndGV4dC95YW1sJyxcbiAgY3N2OiAndGV4dC9jc3YnLFxuICB0c3Y6ICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJyxcbiAgdGFiOiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcycsXG4gIGF2aTogJ3ZpZGVvL3gtbXN2aWRlbycsXG4gIG1rczogJ3ZpZGVvL3gtbWF0cm9za2EnLFxuICBta3Y6ICd2aWRlby94LW1hdHJvc2thJyxcbiAgbW92OiAndmlkZW8vcXVpY2t0aW1lJyxcbiAgZG9jOiAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgZG9jbTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLmRvY3VtZW50Lm1hY3JvZW5hYmxlZC4xMicsXG4gIGRvY3g6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCcsXG4gIGRvdDogJ2FwcGxpY2F0aW9uL21zd29yZCcsXG4gIGRvdG06ICdhcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTInLFxuICBkb3R4OiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwudGVtcGxhdGUnLFxuICB4bGE6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bGFtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLmFkZGluLm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsYzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsZjogJ2FwcGxpY2F0aW9uL3gteGxpZmYreG1sJyxcbiAgeGxtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxzOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxzYjogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5iaW5hcnkubWFjcm9lbmFibGVkLjEyJyxcbiAgeGxzbTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5tYWNyb2VuYWJsZWQuMTInLFxuICB4bHN4OiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnLFxuICB4bHQ6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHRtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsdHg6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZScsXG4gIHhsdzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHR4dDogJ3RleHQvcGxhaW4nLFxuICB0ZXh0OiAndGV4dC9wbGFpbicsXG4gIGNvbmY6ICd0ZXh0L3BsYWluJyxcbiAgbG9nOiAndGV4dC9wbGFpbicsXG4gIHBkZjogJ2FwcGxpY2F0aW9uL3BkZicsXG4gIHppcDogJ2FwcGxpY2F0aW9uL3ppcCcsXG4gICc3eic6ICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnLFxuICByYXI6ICdhcHBsaWNhdGlvbi94LXJhci1jb21wcmVzc2VkJyxcbiAgdGFyOiAnYXBwbGljYXRpb24veC10YXInLFxuICBnejogJ2FwcGxpY2F0aW9uL2d6aXAnLFxuICBkbWc6ICdhcHBsaWNhdGlvbi94LWFwcGxlLWRpc2tpbWFnZScsXG59XG4iLCJjb25zdCBzZWNvbmRzVG9UaW1lID0gcmVxdWlyZSgnLi9zZWNvbmRzVG9UaW1lJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwcmV0dHlFVEEgKHNlY29uZHMpIHtcbiAgY29uc3QgdGltZSA9IHNlY29uZHNUb1RpbWUoc2Vjb25kcylcblxuICAvLyBPbmx5IGRpc3BsYXkgaG91cnMgYW5kIG1pbnV0ZXMgaWYgdGhleSBhcmUgZ3JlYXRlciB0aGFuIDAgYnV0IGFsd2F5c1xuICAvLyBkaXNwbGF5IG1pbnV0ZXMgaWYgaG91cnMgaXMgYmVpbmcgZGlzcGxheWVkXG4gIC8vIERpc3BsYXkgYSBsZWFkaW5nIHplcm8gaWYgdGhlIHRoZXJlIGlzIGEgcHJlY2VkaW5nIHVuaXQ6IDFtIDA1cywgYnV0IDVzXG4gIGNvbnN0IGhvdXJzU3RyID0gdGltZS5ob3VycyA9PT0gMCA/ICcnIDogYCR7dGltZS5ob3Vyc31oYFxuICBjb25zdCBtaW51dGVzU3RyID0gdGltZS5taW51dGVzID09PSAwID8gJycgOiBgJHt0aW1lLmhvdXJzID09PSAwID8gdGltZS5taW51dGVzIDogYCAke3RpbWUubWludXRlcy50b1N0cmluZygxMCkucGFkU3RhcnQoMiwgJzAnKX1gfW1gXG4gIGNvbnN0IHNlY29uZHNTdHIgPSB0aW1lLmhvdXJzICE9PSAwID8gJycgOiBgJHt0aW1lLm1pbnV0ZXMgPT09IDAgPyB0aW1lLnNlY29uZHMgOiBgICR7dGltZS5zZWNvbmRzLnRvU3RyaW5nKDEwKS5wYWRTdGFydCgyLCAnMCcpfWB9c2BcblxuICByZXR1cm4gYCR7aG91cnNTdHJ9JHttaW51dGVzU3RyfSR7c2Vjb25kc1N0cn1gXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlY29uZHNUb1RpbWUgKHJhd1NlY29uZHMpIHtcbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHJhd1NlY29uZHMgLyAzNjAwKSAlIDI0XG4gIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHJhd1NlY29uZHMgLyA2MCkgJSA2MFxuICBjb25zdCBzZWNvbmRzID0gTWF0aC5mbG9vcihyYXdTZWNvbmRzICUgNjApXG5cbiAgcmV0dXJuIHsgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUgKHByb21pc2VzKSB7XG4gIGNvbnN0IHJlc29sdXRpb25zID0gW11cbiAgY29uc3QgcmVqZWN0aW9ucyA9IFtdXG4gIGZ1bmN0aW9uIHJlc29sdmVkICh2YWx1ZSkge1xuICAgIHJlc29sdXRpb25zLnB1c2godmFsdWUpXG4gIH1cbiAgZnVuY3Rpb24gcmVqZWN0ZWQgKGVycm9yKSB7XG4gICAgcmVqZWN0aW9ucy5wdXNoKGVycm9yKVxuICB9XG5cbiAgY29uc3Qgd2FpdCA9IFByb21pc2UuYWxsKFxuICAgIHByb21pc2VzLm1hcCgocHJvbWlzZSkgPT4gcHJvbWlzZS50aGVuKHJlc29sdmVkLCByZWplY3RlZCkpXG4gIClcblxuICByZXR1cm4gd2FpdC50aGVuKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2Vzc2Z1bDogcmVzb2x1dGlvbnMsXG4gICAgICBmYWlsZWQ6IHJlamVjdGlvbnMsXG4gICAgfVxuICB9KVxufVxuIiwiLyoqXG4gKiBDb252ZXJ0cyBsaXN0IGludG8gYXJyYXlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5mcm9tXG4iLCJjb25zdCBVcHB5ID0gcmVxdWlyZSgnQHVwcHkvY29yZScpXG5jb25zdCBGaWxlSW5wdXQgPSByZXF1aXJlKCdAdXBweS9maWxlLWlucHV0JylcbmNvbnN0IFN0YXR1c0JhciA9IHJlcXVpcmUoJ0B1cHB5L3N0YXR1cy1iYXInKVxuY29uc3QgVHVzID0gcmVxdWlyZSgnQHVwcHkvdHVzJylcblxuY29uc3QgdXBweU9uZSA9IG5ldyBVcHB5KHtkZWJ1ZzogdHJ1ZSwgYXV0b1Byb2NlZWQ6IHRydWV9KVxudXBweU9uZVxuICAudXNlKEZpbGVJbnB1dCwgeyB0YXJnZXQ6ICcuVXBweUlucHV0JywgcHJldHR5OiBmYWxzZSB9KVxuICAudXNlKFR1cywgeyBlbmRwb2ludDogJ2h0dHBzOi8vdHVzZC50dXNkZW1vLm5ldC9maWxlcy8nIH0pXG4gIC51c2UoU3RhdHVzQmFyLCB7XG4gICAgdGFyZ2V0OiAnLlVwcHlJbnB1dC1Qcm9ncmVzcycsXG4gICAgaGlkZVVwbG9hZEJ1dHRvbjogdHJ1ZSxcbiAgICBoaWRlQWZ0ZXJGaW5pc2g6IGZhbHNlXG4gIH0pXG4iXX0=
