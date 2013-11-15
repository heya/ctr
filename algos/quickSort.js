/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
([], function(){
	"use strict";

	var fTmpl = [
			"(function __self(__a){",
			"   #{extInit}",
			"   var __L = 0, __R = __a.length - 1, __backlog = [], __t, a, b;",
			"   for(;;){",
			"       var __l = __L, __r = __R, __pivot = __a[Math.floor(Math.random() * (__r - __l + 1)) + __l];",
			"       while(__l <= __r){",
			"           b = _pivot;",
			"           for(;; ++__l){",
			"               a = __a[__l];",
			"               #{lessCond}",
			"           }",
			"           a = _pivot;",
			"           for(;; --__r){",
			"               b = __a[__r];",
			"               #{lessCond}",
			"           }",
			"           if(__l <= __r){",
			"               __t = __a[__l];",
			"               __a[__l++] = __a[__r];",
			"               __a[__r--] = __t;",
			"           }",
			"       }",
			"       if(__L < __r){",
			"           if(__l < __R){",
			"               __backlog.push(__l, __R);"
			"           }",
			"           __R = __r;",
			"           continue;",
			"       }",
			"       if(__l < __R){",
			"           __L = __l;",
			"           continue;",
			"       }",
			"       if(!__backlog.length){",
			"           break;",
			"       }",
			"       __R = __backlog.pop();",
			"       __L = __backlog.pop();",
			"   }",
			"   return __a;",
			"})",
			"//@ sourceURL=#{name}"
		],
		dTmpl = "if(!${pred}) break;";

	var uniqNumber = 0;

	return function(less, name){
		var ext, props = null, lessCond, last;
		switch(typeof less){
			case "function":
				ext = "var __e = __self.__e;";
				props = {__e: less};
				lessCond = ctr(dTmpl, {pred: "__e(a, b)"}).lines;
				break;
			case "string":
				lessCond = ctr(dTmpl, {pred: less}).lines;
				break;
			default: // Array
				last = less.length - 1;
				lessCond = less.slice(0, last).concat(
					ctr(dTmpl, {pred: less[last]}).lines
				);
				break;
		}
		return ctr(
			fTmpl,
			{
				extInit:  ext,
				lessCond: lessCond,
				name:     name || ("/algos/quickSort/" + (uniqNumber++))
			},
			props
		);
	};

	/*
	// The model function:
	function qs(__a, __less){
		var __L = 0, __R = __a.length - 1, __backlog = [], __t, a, b;
		for(;;){
			var __l = __L, __r = __R, __pivot = __a[Math.floor(Math.random() * (__r - __l + 1)) + __l];
			while(__l <= __r){
				for(b = __pivot; a = __a[__l], __less(a, b); ++__l);
				for(a = __pivot; b = __a[__r], __less(a, b); --__r);
				if(__l <= __r){
					// swap
					__t = __a[__l];
					__a[__l++] = __a[__r];
					__a[__r--] = __t;
				}
			}
			// next iteration
			if(__L < __r){
				if(__l < __R){
					__backlog.push(__l, __R);
				}
				__R = __r;
				continue;
			}
			if(__l < __R){
				__L = __l;
				continue;
			}
			if(!__backlog.length){
				break;
			}
			__R = __backlog.pop();
			__L = __backlog.pop();
		}
		return __a;
	}
	*/
});
