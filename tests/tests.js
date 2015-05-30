/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["heya-unit", "./test_main", "./test_algos_binarySearch", "./test_algos_quickSort", "./test_algos_mergeArrays",
	"./test_algos_heap"],
function(unit){
	"use strict";

	unit.run();

	return {};
});
