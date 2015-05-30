/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["module", "heya-unit", "../algos/heap/make", "../algos/heap/pop",
	"../algos/heap/push", "../algos/heap/sort"],
function(module, unit, makeHeap, popHeap, pushHeap, sortHeap){
	"use strict";

	function cmpNum(a, b){ return a - b; }
	function identity(x) { return x; }
	function less(a, b)  { return a < b; }

	var sample = [42, 55, 73, 21, 83, 90, 79, 83, 81, 93, 97, 84];

	function walk(heap, fn, index){
		index = index || 0;
		if(index < heap.length){
			fn(heap, index);
			walk(heap, fn, 2 * index + 1);
			walk(heap, fn, 2 * index + 2);
		}
	}

	unit.add(module, [
		function test_maxHeap_make(t){
			var make = makeHeap().compile();
			var heap = make(sample.map(identity));
			walk(heap, function(heap, index){
				var l = 2 * index + 1, r = l + 1;
				t.assert(l >= heap.length || heap[index] >= heap[l], "left child is larger than its parent");
				t.assert(r >= heap.length || heap[index] >= heap[r], "right child is larger than its parent");
			});
		},
		function test_maxHeap_make_external(t){
			var make = makeHeap(less).compile();
			var heap = make(sample.map(identity));
			walk(heap, function(heap, index){
				var l = 2 * index + 1, r = l + 1;
				t.assert(l >= heap.length || heap[index] >= heap[l], "left child is larger than its parent");
				t.assert(r >= heap.length || heap[index] >= heap[r], "right child is larger than its parent");
			});
		},
		function test_maxHeap_pop(t){
			var make = makeHeap().compile();
			var pop  = popHeap().compile();
			var heap = make(sample.map(identity));

			var a = sample.map(identity).sort(cmpNum).reverse();

			var b = [];
			while(heap.length){
				b.push(pop(heap));
			}

			eval(t.ASSERT("t.unify(a, b)"));
		},
		function test_maxHeap_pop_external(t){
			var make = makeHeap(less).compile();
			var pop  = popHeap(less).compile();
			var heap = make(sample.map(identity));

			var a = sample.map(identity).sort(cmpNum).reverse();

			var b = [];
			while(heap.length){
				b.push(pop(heap));
			}

			eval(t.ASSERT("t.unify(a, b)"));
		},
		function test_maxHeap_push(t){
			var push = pushHeap().compile();
			var pop  = popHeap().compile();

			var heap = [];
			sample.forEach(function(value){
				push(heap, value);
			});

			var a = sample.map(identity).sort(cmpNum).reverse();

			var b = [];
			while(heap.length){
				b.push(pop(heap));
			}

			eval(t.ASSERT("t.unify(a, b)"));
		},
		function test_maxHeap_push_external(t){
			var push = pushHeap(less).compile();
			var pop  = popHeap(less).compile();

			var heap = [];
			sample.forEach(function(value){
				push(heap, value);
			});

			var a = sample.map(identity).sort(cmpNum).reverse();

			var b = [];
			while(heap.length){
				b.push(pop(heap));
			}

			eval(t.ASSERT("t.unify(a, b)"));
		},
		function test_maxHeap_sort(t){
			var make = makeHeap().compile();
			var sort = sortHeap().compile();

			var heap = make(sample.map(identity));
			sort(heap);

			var a = sample.map(identity).sort(cmpNum);

			eval(t.ASSERT("t.unify(a, heap)"));
		},
		function test_maxHeap_sort_external(t){
			var make = makeHeap(less).compile();
			var sort = sortHeap(less).compile();

			var heap = make(sample.map(identity));
			sort(heap);

			var a = sample.map(identity).sort(cmpNum);

			eval(t.ASSERT("t.unify(a, heap)"));
		},
		function test_maxHeap_object(t){
			function MaxHeap(a){
				if(a){
					this.init(a);
				}else{
					this.array = [];
				}
			}

			var make = makeHeap(null, {member: "array"}).compile();
			var push = pushHeap(null, {member: "array"}).compile();
			var pop  = popHeap (null, {member: "array"}).compile();
			var sort = sortHeap(null, {member: "array"}).compile();

			MaxHeap.prototype = {
				init: function(a){
					this.array = a.map(identity);
					return this._make();
				},
				empty: function(){ return !this.array.length; },
				push:  push,
				pop:   pop,
				sort:  sort,
				_make: make
			};

			var sorted = sample.map(identity).sort(cmpNum);

			var heap = new MaxHeap(sample);

			var a = [];
			while(!heap.empty()){
				a.push(heap.pop());
			}
			a.reverse();
			eval(t.TEST("t.unify(sorted, a)"));

			sample.forEach(function(value){
				heap.push(value);
			});
			heap.sort();
			eval(t.TEST("t.unify(sorted, heap.array)"));
		}
	]);

	return {};
});
