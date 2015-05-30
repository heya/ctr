/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["../../main"], function(ctr){
	"use strict";

	var fTmpl = [
			"(function __self(#{arg}){",
			"    #{extInit}",
			"    #{init}",
			"    if(__a.length > 1){",
			"        for(var __n = __a.length - 1; __n; --__n){",
			"            var a = __a[__n], b;",
			"            __a[__n] = __a[0];",
			"            __a[0] = a;",
			"            for(var __i = 0, __c = 1; __c < __n; __i = __c, __c = (__i << 1) + 1){",
			"                b = __a[__c];",
			"                if(__c + 1 < __n){",
			"                    a = __a[__c + 1];",
			"                    #{predCond}",
			"                    if(!(#{lessCond})){",
			"                        ++__c;",
			"                        b = a;",
			"                    }",
			"                }",
			"                a = __a[__i];",
			"                #{predCond}",
			"                if(!(#{lessCond})) break;",
			"                __a[__c] = a;",
			"                __a[__i] = b;",
			"            }",
			"        }",
			"    }",
			"    return #{ret};",
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
		var arg = "__a", init = [], ret = arg;
		if(opt && opt.member){
			arg  = "";
			init = "var __a = this." + opt.member + ";";
			ret  = "this";
		}
		return ctr(
			fTmpl,
			{
				arg:      arg,
				init:     init,
				ret:      ret,
				extInit:  ext,
				predCond: pred,
				lessCond: cond,
				name:     (typeof opt == "string" && opt) || (opt && opt.name) ||
							("/algos/heap/sort" + (uniqNumber++))
			},
			props
		);
	};

	/*
	// The model function:

	function sort(__a, __less){
		if(__a.length > 1){
			for(var __n = __a.length - 1; __n; --__n){
				var a = __a[__n], b;
				__a[__n] = __a[0];
				__a[0] = a;
				for(var __i = 0, __c = 1; __c < __n; __i = __c, __c = 2 * __i + 1){
					b = __a[__c];
					if(__c + 1 < __n){
						a = __a[__c + 1];
						if(!__less(a, b)){
							++__c;
							b = a;
						}
					}
					a = __a[__i];
					if(!__less(a, b)){
						break;
					}
					__a[__c] = a;
					__a[__i] = b;
				}
			}
		}
	}

	// useful index formulas:

	left   = 2 * parent + 1
	right  = 2 * parent + 2
	parent = Math.floor((child - 1) / 2)
	*/
});
