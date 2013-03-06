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

	function evalWithEnv(env, accessors, binder){
		// disassemble our dictionary
		var keys = [], vals = [];
		for(var key in env){
			keys.push(key);
			vals.push(env[key]);
		}
		env = new Function(keys, "return function(){ return eval(arguments[0]); }").apply(null, vals);
		if(accessors){
			binder = binder || evalWithEnv.prefixSlot;
			env.closure = env("({\n\t" +
				(accessors === true ?
					keys.map(binder).join(",\n\t") :
					accessors.replace(/([,\s]*)(\b\w+\b)/g, function(_, spaces, name){
						return (spaces ? ",\n\t" : "") + binder(name);
					})
				) +
			"\n})");
		}
		return env;
	}

	evalWithEnv.inlineSlot = function(name){
		return "get " + name + "(){ return " + name +
			"; }, set " + name + "(value){ return " + name + " = value; }";
	};

	evalWithEnv.functionSlot = function(name){
		return name + ": function(value){ return arguments.length < 1 ? " +
			name + " : " + name + " = value; }";
	};

	evalWithEnv.doubleSlot = function(name){
		return name + ": {get: function(){ return " + name +
			"; }, set: function(value){ return " + name + " = value; }}";
	};

	evalWithEnv.prefixSlot = function(name){
		var capitalizedName = name.charAt(0).toUpperCase() + name.substring(1);
		return "get" + capitalizedName + ": function(){ return " + name +
			"; }, set" + capitalizedName + " : function(value){ return " + name + " = value; }";
	};

	return evalWithEnv;
});
