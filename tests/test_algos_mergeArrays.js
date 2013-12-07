/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["module", "heya-unit", "heya-unify", "../algos/mergeArrays"],
function(module, unit, unify, merge){
	"use strict";

	function cmpNum(a, b){ return a - b; }

	unit.add(module, [
		function test_random(t){
			var m = merge("a < b").compile();

			var arrays = 100, size = 100;
			for(var i = 0; i < arrays; ++i){
				var a = new Array(size);
				for(var j = 0; j < size; ++j){
					a[j] = Math.random();
				}
				var b = new Array(size);
				for(var j = 0; j < size; ++j){
					b[j] = Math.random();
				}
				var c = a.concat(b).sort(cmpNum),
					d = m(a.sort(cmpNum), b.sort(cmpNum));
				eval(t.TEST("unify(c, d)"));
			}
		},
		function test_external(t){
			var m = merge(function(a, b){ return a < b; }).compile();

			var arrays = 100, size = 100;
			for(var i = 0; i < arrays; ++i){
				var a = new Array(size);
				for(var j = 0; j < size; ++j){
					a[j] = Math.random();
				}
				var b = new Array(size);
				for(var j = 0; j < size; ++j){
					b[j] = Math.random();
				}
				var c = a.concat(b).sort(cmpNum),
					d = m(a.sort(cmpNum), b.sort(cmpNum));
				eval(t.TEST("unify(c, d)"));
			}
		}
	]);

	return {};
});
