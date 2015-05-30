/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["../main"], function(ctr){
	"use strict";

	var fTmpl = [
			"(function __self(__x, __y){",
			"    #{extInit}",
			"    var __r = new Array(__x.length + __y.length), __rp = 0,",
			"        __xp = 0, __xn = __x.length, __yp = 0, __yn = __y.length,",
			"        a = __x[0], b = __y[0];",
			"    while(__xp < __xn && __yp < __yn){",
			"        #{decision}",
			"    }",
			"    while(__xp < __xn) __r[__rp++] = __x[__xp++];",
			"    while(__yp < __yn) __r[__rp++] = __y[__yp++];",
			"    return __r;",
			"})",
			"//@ sourceURL=#{name}"
		],
		dTmpl1 = "if(${lessCond}){",
		dTmpl2 = [
			"    __r[__rp++] = a;",
			"    a = __x[++__xp];",
			"}else{",
			"    __r[__rp++] = b;",
			"    b = __y[++__yp];",
			"}"
		];

	var uniqNumber = 0;

	return function(less, name){
		var ext, props, decision, last;
		switch(typeof less){
			case "function":
				ext      = "var __e = __self.__e;";
				props    = {__e: less};
				decision = ctr(dTmpl1, {lessCond: "__e(a, b)"}).lines;
				break;
			case "string":
				decision = ctr(dTmpl1, {lessCond: less}).lines;
				break;
			default: // Array
				if(less instanceof Array){
					last     = less.length - 1;
					decision = less.slice(0, last).concat(
						ctr(dTmpl1, {lessCond: less[last]}).lines
					);
				}else{
					decision = ctr(dTmpl1, {lessCond: "a < b"}).lines;
				}
				break;
		}
		return ctr(
			fTmpl,
			{
				extInit:  ext,
				decision: decision.concat(dTmpl2),
				name:     name || ("/algos/mergeArrays/" + (uniqNumber++))
			},
			props
		);
	};

	/* the model function
	function mergeArrays(x, y, less){
		var r = new Array(x.length + y.length), rp = 0,
			xp = 0, xn = x.length, yp = 0, yn = y.length;
		while(xp < xn && yp < yn){
			r[rp++] = less(x[xp], y[yp]) ? x[xp++] : y[yp++];
		}
		while(xp < xn) r[rp++] = x[xp++];
		while(yp < yn) r[rp++] = y[yp++];
		return r;
	}
	*/
});
