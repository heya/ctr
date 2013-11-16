/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["../main"], function(ctr){
	"use strict";

	var aTmpl = [
			"(function __self(__a, b, __l, ${right}){",
			"   #{extInit}",
			"   ${right} = Math.min(isNaN(${right}) ? __a.length : Math.max(0, ${right}), __a.length);",
			"   __l = Math.min(isNaN(__l) ? 0 : Math.max(0, __l), ${right});",
			"   #{downcast}",
			"   while(__l < __r){",
			"       var __m = ((__r - __l) >> 1) + __l,",
			"           a = __a[__m];",
			"       #{decision}",
			"   }",
			"   #{result}",
			"})",
			"//@ sourceURL=#{name}"
		],
		dTmpl1 = "if(${lessCond}){",
		dTmpl2 = [
			"    __l = __m + 1;",
			"}else{",
			"    __r = __m;",
			"}"
		],
		fTmpl1 = [
			"if(__l >= __R) return -1;",
			"a = b, b = __a[__l];"
		],
		fTmpl2 = [
			"    return -1;",
			"}",
			"return __l;"
		];

	var uniqNumber = 0;

	return function(less, opt){
		var ext, props = null, decision, last, result;
		switch(typeof less){
			case "function":
				ext = "var __e = __self.__e;";
				props = {__e: less};
				decision = ctr(dTmpl1, {lessCond: "__e(a, b)"}).lines;
				break;
			case "string":
				decision = ctr(dTmpl1, {lessCond: less}).lines;
				break;
			default: // Array
				last = less.length - 1;
				decision = less.slice(0, last).concat(
					ctr(dTmpl1, {lessCond: less[last]}).lines
				);
				break;
		}
		if(opt && opt.fail){
			result = fTmpl1.concat(decision, fTmpl2);
		}
		return ctr(
			aTmpl,
			{
				extInit:  ext,
				right:    result ? "__R" : "__r",
				downcast: result ? "var __r = __R;" : undefined,
				decision: decision.concat(dTmpl2),
				result:   result || "return __l;",
				name:     (typeof opt == "string" && opt) || (opt && opt.name) ||
							("/algos/binarySearch/" + (uniqNumber++))
			},
			props
		);
	};

	/*
	// The model function:
	function bs(__a, b, __less){
		var __l = 0, __r = __a.length;
		while(__l < __r){
			var __m = ((__r - __l) >> 1) + __l,
				a = __a[__m];
			if(__less(a, b)){
				__l = __m + 1;
			}else{
				__r = __m;
			}
		}
		return __l;
	}
	*/
});
