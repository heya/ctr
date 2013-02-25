(function(factory){
	if(typeof define != "undefined"){ // AMD
		define(["./evalWithEnv"], factory);
	}else if(typeof module != "undefined"){ // node.js
		module.exports = factory(require("./evalWithEnv"));
	}else{
		ctrTarget = factory(ctrEvalWithEnv);
	}
})(function(evalWithEnv){
	"use strict";

	function Target(lines){
		this.lines = lines;
	}

	Target.prototype = {
		getCode: function(asArray){
			return asArray ? this.lines : this.lines.join("\n");
		},
		compile: function(env, accessors, binder){
			var code = this.getCode();
			return env ? evalWithEnv(env, accessors, binder)(code) : eval(code);
		}
	};

	return Target;
});
