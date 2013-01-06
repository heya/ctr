(function(factory){
	if(typeof define != "undefined"){ // AMD
		define([], factory);
	}else if(typeof module != "undefined"){ // node.js
		module.exports = factory();
	}else{
		ctrJst = factory();
	}
})(function(){
	"use strict";

	var escapeTable = {
		"\\": "\\\\",
		"\t": "\\t",
		"\r": "\\r",
		"\n": "\\n",
		"\u2028": "\\u2028",
		"\u2029": "\\u2029",
		'"': '\\"',
		"'": "\\'"
	};

	function escape(text){
		return text.replace(/[\\\t\r\n\u2028\u2029"']/g, function(match){
			return escapeTable[match];
		});
	}

	function jst(tmpl){
		var result = [
			"(function(){",
			"    var __r = []; print = function(text){ __r.push(text); };",
		];
		var start = 0;
		tmpl.replace(/<%(=?)([\s\S]+?)%>/g, function(match, prefix, text, offset){
			// process the previous literal
			if(start < offset){
				result.push("    __r.push(\"" + escape(tmpl.substring(start, offset)) + "\");");
			}
			start = offset + match.length;
			if(prefix){
				// interpolate
				result.push("    __r.push(" + text + ");");
			}else{
				// evaluate
				result.push("    " + text);
			}
			return "";
		});
		if(start < tmpl.length){
			result.push("    __r.push(\"" + escape(tmpl.substring(start)) + "\");");
		}
		result.push(
			"    return __r.join(\"\");",
			"})"
		);
		return result;
	}

	function compile(tmpl, env){
		return evalWithEnv(env || {})(jst(tmpl).join("\n"));
	}

	jst.compile = compile;
	jst.escape  = escape;

	return jst;
});
