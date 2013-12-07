/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["module", "heya-unit", "heya-unify", "../algos/quickSort"],
function(module, unit, unify, qsort){
	"use strict";

	function cmpNum(a, b){ return a - b; }

	unit.add(module, [
		function test_random(t){
			var qs = qsort("a < b").compile();

			var arrays = 100, size = 100;
			for(var i = 0; i < arrays; ++i){
				var a = new Array(size);
				for(var j = 0; j < size; ++j){
					a[j] = Math.random();
				}
				var b = a.slice(0);
				a.sort(cmpNum);
				qs(b);
				eval(t.TEST("unify(a, b)"));
			}
		},
		function test_external(t){
			var qs = qsort(function(a, b){ return a < b; }).compile();

			var arrays = 100, size = 100;
			for(var i = 0; i < arrays; ++i){
				var a = new Array(size);
				for(var j = 0; j < size; ++j){
					a[j] = Math.random();
				}
				var b = a.slice(0);
				a.sort(cmpNum);
				qs(b);
				eval(t.TEST("unify(a, b)"));
			}
		}
	]);

	return {};
});
