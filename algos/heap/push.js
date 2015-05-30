/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["../../main"], function(ctr){
	"use strict";

	var fTmpl = [
			"(function __self(__a, b){",
			"    #{extInit}",
			"    var __i = __a.length;",
			"    __a.push(b);",
			"    while(__i){",
			"        var __p = (__i - 1) >> 1, a = __a[__p];",
			"        #{predCond}",
			"        if(!(#{lessCond})) break;",
			"        __a[__i] = a;",
			"        __a[__p] = b;",
			"        __i = __p;",
			"    }",
			"    return __a;",
			"})",
			"//@ sourceURL=#{name}"
		];

	var uniqNumber = 0;

	return function(less, opt){
		var ext, props, pred, cond, last;
		switch(typeof less){
			case "function":
				ext   = "var __e = __self.__e;";
				props = {__e: less};
				cond  = "__e(a, b)";
				break;
			case "string":
				cond  = less;
				break;
			default: // Array
				if(less instanceof Array){
					last  = less.length - 1;
					pred  = less.slice(0, last);
					cond = less[last];
				}else{
					cond = "a < b";
				}
				break;
		}
		return ctr(
			fTmpl,
			{
				extInit:  ext,
				predCond: pred,
				lessCond: cond,
				name:     (typeof opt == "string" && opt) || (opt && opt.name) ||
							("/algos/heap/push" + (uniqNumber++))
			},
			props
		);
	};

	/*
	// The model function:

	function push(__a, b, __less){
		var __i = __a.length;
		__a.push(b);
		while(__i){
			var __p = (__i - 1) >> 1, a = __a[__p];
			if(!__less(a, b)){
				break;
			}
			__a[__i] = a;
			__a[__p] = b;
			__i = __p;
		}
	}

	// useful index formulas:

	left   = 2 * parent + 1
	right  = 2 * parent + 2
	parent = Math.floor((child - 1) / 2)
	*/
});
