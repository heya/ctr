/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
([], function(){
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
		env.keys = keys;
		accessors && evalWithEnv.addAccessors(env, accessors, binder);
		return env;
	}

	function addAccessors(env, accessors, binder){
		binder = binder || prefixSlot;
		env.closure = env("({\n\t" +
			(accessors === true ?
				env.keys.map(binder).join(",\n\t") :
				accessors.replace(/([,\s]*)(\b\w+\b)/g, function(_, spaces, name){
					return (spaces ? ",\n\t" : "") + binder(name);
				})
			) +
		"\n})");
	}
	evalWithEnv.addAccessors = addAccessors;

	function inlineSlot(name){
		return "get " + name + "(){ return " + name +
			"; }, set " + name + "(value){ return " + name + " = value; }";
	}
	evalWithEnv.inlineSlot = inlineSlot;

	function functionSlot(name){
		return name + ": function(value){ return arguments.length < 1 ? " +
			name + " : " + name + " = value; }";
	}
	evalWithEnv.functionSlot = functionSlot;

	function doubleSlot(name){
		return name + ": {get: function(){ return " + name +
			"; }, set: function(value){ return " + name + " = value; }}";
	}
	evalWithEnv.doubleSlot = doubleSlot;

	function prefixSlot(name){
		var capitalizedName = name.charAt(0).toUpperCase() + name.substring(1);
		return "get" + capitalizedName + ": function(){ return " + name +
			"; }, set" + capitalizedName + " : function(value){ return " + name + " = value; }";
	}
	evalWithEnv.prefixSlot = prefixSlot;

	return evalWithEnv;
});
