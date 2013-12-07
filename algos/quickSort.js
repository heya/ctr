/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["../main"], function(ctr){
	"use strict";

	var fTmpl = [
			"(function __self(__a, __L, __R){",
			"    #{extInit}",
			"    __R = Math.min(isNaN(__R) ? __a.length : Math.max(0, __R), __a.length);",
			"    __L = Math.min(isNaN(__L) ? 0 : Math.max(0, __L), __R);",
			"    --__R;",
			"    var __backlog = [], __t, a, b;",
			"    for(;;){",
			"        var __l = __L, __r = __R, __pivot = __a[Math.floor(Math.random() * (__r - __l + 1)) + __l];",
			"        while(__l <= __r){",
			"            b = __pivot;",
			"            for(;; ++__l){",
			"                a = __a[__l];",
			"                #{pred}",
			"            }",
			"            a = __pivot;",
			"            for(;; --__r){",
			"                b = __a[__r];",
			"                #{pred}",
			"            }",
			"            if(__l <= __r){",
			"                __t = __a[__l];",
			"                __a[__l++] = __a[__r];",
			"                __a[__r--] = __t;",
			"            }",
			"        }",
			"        if(__L < __r){",
			"            if(__l < __R){",
			"                __backlog.push(__l, __R);",
			"            }",
			"            __R = __r;",
			"            continue;",
			"        }",
			"        if(__l < __R){",
			"            __L = __l;",
			"            continue;",
			"        }",
			"        if(!__backlog.length){",
			"            break;",
			"        }",
			"        __R = __backlog.pop();",
			"        __L = __backlog.pop();",
			"    }",
			"    return __a;",
			"})",
			"//@ sourceURL=#{name}"
		],
		dTmpl = "if(!(${lessCond})) break;";

	var uniqNumber = 0;

	return function(less, name){
		var ext, props, pred, last;
		switch(typeof less){
			case "function":
				ext   = "var __e = __self.__e;";
				props = {__e: less};
				pred  = ctr(dTmpl, {lessCond: "__e(a, b)"}).lines;
				break;
			case "string":
				pred  = ctr(dTmpl, {lessCond: less}).lines;
				break;
			default: // Array
				last  = less.length - 1;
				pred  = less.slice(0, last).concat(
					ctr(dTmpl, {lessCond: less[last]}).lines
				);
				break;
		}
		return ctr(
			fTmpl,
			{
				extInit: ext,
				pred:    pred,
				name:    name || ("/algos/quickSort/" + (uniqNumber++))
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
