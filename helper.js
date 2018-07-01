/**
 * Make a class inherit from another class.
 * @param {function(new:*)} base - The base class.
 * @param {function(new:*)} sub - The sub-class.
 */
function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
     sub.prototype[key] = origProto[key];
  }
  // The constructor property was set wrong, let's fix it
  Object.defineProperty(sub.prototype, 'constructor', { 
    enumerable: false, 
    value: sub 
  });
}

/**
 * Format a time into a string.
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds)
{
	let out = "";
	
	// Hours
	if (seconds >= 3600)
	{
		let hours = Math.floor(seconds / 3600);
		out += hours + ":";
		seconds %= 3600;
	}
	
	// Minutes
	let minutes = Math.floor(seconds / 60);
	if (minutes < 10)
	{
		out += "0";
	}
	out += minutes + ":";
	seconds %= 60;
	
	// Seconds
	if (seconds < 10)
	{
		out += "0";
	}
	out += seconds;
	
	return out;
}

//
// Object.assign polyfill for old IE
//
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}