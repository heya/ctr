(function(factory){
	if(typeof define != "undefined"){ // AMD
		define(["./replace"], factory);
	}else if(typeof module != "undefined"){ // node.js
		module.exports = factory(require("./replace"));
	}else{
		ctr = factory(ctrReplace);
	}
})(function(replace){
	"use strict";
	return function constructor(tmpl, dict){
		tmpl = tmpl instanceof Array ? tmpl : tmpl.split("\n");
		var result = [];
		for(var i = 0, l = tmpl.length; i < l; ++i){
			var line = replace(tmpl[i], dict),
				found = /#+\{([^\}\s\r\n]+)\}/.exec(line);
			if(found){
				var pattern = found[0];
				if(pattern.length - found[1].length > 3){
					result.push(line.replace(pattern, pattern.substring(1)));
					continue;
				}
				var value = dict[found[1]];
				if(value && value instanceof Array){
					for(var j = 0, k = value.length; j < k; ++j){
						result.push(line.replace(pattern, replace(value[j], dict)));
					}
				}else{
					if(value !== undefined){
						result.push(line.replace(pattern, replace(value, dict)));
					}
				}
			}else{
				result.push(line);
			}
		}
		return result;
	};
});
