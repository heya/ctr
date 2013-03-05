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

	function Target(lines, props){
		this.lines = lines;
		this.props = props;
	}

	Target.prototype = {
		getCode: function(){
			return this.lines.join("\n");
		},
		compile: function(env){
			var code = this.getCode();
			if(env){
				if(typeof env != "function"){
					env = evalWithEnv(env);
				}
				code = env(code);
			}else{
				code = eval(code);
			}
			if(code && this.props){
				for(var key in this.props){
					code[key] = this.props[key];
				}
			}
			return code;
		}
	};

	return Target;
});
