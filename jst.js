/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["./Target"], function(Target){
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
		tmpl = tmpl instanceof Array ? tmpl.join("\n") :
			(tmpl.getCode ? tmpl.getCode() : tmpl);
		var result = [
			"(function(){",
			"    var __r = [];",
			"    function print(text){ __r.push(text); }"
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
		return new Target(result);
	}

	jst.escape  = escape;

	return jst;
});
