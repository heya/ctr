(function(factory){
	if(typeof define != "undefined"){ // AMD
		define([], factory);
	}else if(typeof module != "undefined"){ // node.js
		module.exports = factory();
	}else{
		ctrEvalWithEnv = factory();
	}
})(function(){
	"use strict";

	// The idea is by Max Motovilov.

	return function evalWithEnv(env){
		// disassemble our dictionary
		var keys = [], vals = [];
		for(var key in env){
			keys.push(key);
			vals.push(env[key]);
		}
		// create our custom evaluator as a closure
		return new Function(keys,
			"return function(){ return eval(arguments[0]); }").apply(null, vals);
	};
});
