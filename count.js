(function(factory){
	if(typeof define != "undefined"){ // AMD
		define([], factory);
	}else if(typeof module != "undefined"){ // node.js
		module.exports = factory();
	}else{
		ctrCount = factory();
	}
})(function(){
	"use strict";
	return function count(tmpl, dict){
		dict = dict || {};
		tmpl.replace(/\$+\{([^\}\s\r\n]+)\}/g, function(match, name){
			if(match.length - name.length == 3){
				if(dict.hasOwnProperty(name)){
					++dict[name];
				}else{
					dict[name] = 1;
				}
			}
			return "";
		});
		return dict;
	};
});
