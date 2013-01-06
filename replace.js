(function(factory){
	if(typeof define != "undefined"){ // AMD
		define([], factory);
	}else if(typeof module != "undefined"){ // node.js
		module.exports = factory();
	}else{
		ctrReplace = factory();
	}
})(function(){
	"use strict";
	return function replace(tmpl, dict){
		return tmpl.replace(/\$+\{([^\}\s\r\n]+)\}/g, function(match, name){
			if(match.length - name.length > 3){
				return match.substring(1);
			}
			return dict[name];
		});
	};
});
