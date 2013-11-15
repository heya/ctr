/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["module", "heya-unit", "../algos/binarySearch"],
function(module, unit, bsearch){
	"use strict";

	unit.add(module, [
		function test_simple(t){
			var bs = bsearch("a < b").compile();

			eval(t.TEST("bs([], 1) === 0"));
			eval(t.TEST("bs([], 2) === 0"));
			eval(t.TEST("bs([], 3) === 0"));

			eval(t.TEST("bs([2], 1) === 0"));
			eval(t.TEST("bs([2], 2) === 0"));
			eval(t.TEST("bs([2], 3) === 1"));

			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 0) === 0"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 1) === 0"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 2) === 0"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 3) === 2"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 4) === 4"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 5) === 6"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 6) === 7"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 7) === 8"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 8) === 8"));
			eval(t.TEST("bs([2, 2, 3, 3, 4, 4, 5, 6, 8], 9) === 9"));

			eval(t.TEST("bs(['eight', 'five', 'four', 'nine', 'one', " +
				"'seven', 'six', 'three', 'two', 'zero' ], 'lorem') === 3"));
			eval(t.TEST("bs(['eight', 'five', 'four', 'nine', 'one', " +
				"'seven', 'six', 'three', 'two', 'zero' ], 'ipsum') === 3"));
			eval(t.TEST("bs(['eight', 'five', 'four', 'nine', 'one', " +
				"'seven', 'six', 'three', 'two', 'zero' ], 'dolor') === 0"));
			eval(t.TEST("bs(['eight', 'five', 'four', 'nine', 'one', " +
				"'seven', 'six', 'three', 'two', 'zero' ], 'sit') === 6"));
			eval(t.TEST("bs(['eight', 'five', 'four', 'nine', 'one', " +
				"'seven', 'six', 'three', 'two', 'zero' ], 'amet') === 0"));
			eval(t.TEST("bs(['eight', 'five', 'four', 'nine', 'one', " +
				"'seven', 'six', 'three', 'two', 'zero' ], 'consectetur') === 0"));
			eval(t.TEST("bs(['eight', 'five', 'four', 'nine', 'one', " +
				"'seven', 'six', 'three', 'two', 'zero' ], 'adipisicing') === 0"));
			eval(t.TEST("bs(['eight', 'five', 'four', 'nine', 'one', " +
				"'seven', 'six', 'three', 'two', 'zero' ], 'elit') === 1"));
		},
		function test_random(t){
			var bs = bsearch("a < b").compile();

			var arrays = 10, size = 100, tests = 10;
			for(var i = 0; i < arrays; ++i){
				var a = new Array(size);
				for(var j = 0; j < size; ++j){
					a[j] = Math.random();
				}
				a.sort();
				for(j = 0; j < tests; ++j){
					var value = Math.random(),
						index = bs(a, value);
					eval(t.TEST("index >= 0 && index <= a.length"));
					eval(t.TEST("(index === a.length || value <= a[index]) && (index === 0 || a[index - 1] < value)"));
				}
			}
		}
	]);

	return {};
});
