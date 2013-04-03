/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
([], function(){
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
