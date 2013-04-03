/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["./evalWithEnv"], function(evalWithEnv){
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
