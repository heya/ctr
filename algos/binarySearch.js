/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["../main"], function(ctr){
	"use strict";

	var fTmpl = [
			"(function __self(__a, b){",
			"   #{extInit}",
			"   var __l = 0, __r = __a.length;",
			"   while(__l < __r){",
			"       var __m = ((__r - __l) >> 1) + __l,",
			"           a = __a[__m];",
			"       #{decision}",
			"   }",
			"   return __l;",
			"})",
			"//@ sourceURL=#{name}"
		],
		dTmpl = [
			"if(${lessCond}){",
			"    __l = __m + 1;",
			"}else{",
			"    __r = __m;",
			"}"
		];

	var uniqNumber = 0;

	return function(less, name){
		var ext, props = null, decision, last;
		switch(typeof less){
			case "function":
				ext = "var __e = __self.__e;";
				props = {__e: less};
				decision = ctr(dTmpl, {lessCond: "__e(a, b)"}).lines;
				break;
			case "string":
				decision = ctr(dTmpl, {lessCond: less}).lines;
				break;
			default: // Array
				last = less.length - 1;
				decision = less.slice(0, last).concat(
					ctr(dTmpl, {lessCond: less[last]}).lines
				);
				break;
		}
		return ctr(
			fTmpl,
			{
				extInit:  ext,
				decision: decision,
				name:     name || ("/algos/binarySearch/" + (uniqNumber++))
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
