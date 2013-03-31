(function(factory){
	if(typeof define != "undefined"){ // AMD
		define(["module", "heya-unit",
			"../count", "../replace", "../main", "../jst",
			"../Pool", "../evalWithEnv"], factory);
	}else if(typeof module != "undefined"){ // node.js
		factory(module, require("heya-unit"),
			require("../count"), require("../replace"),
			require("../main"), require("../jst"),
			require("../Pool"), require("../evalWithEnv"));
	}
})(function(module, unit, count, replace, ctr, jst, Pool, evalWithEnv){
	"use strict";

	var countOwnProperties;
	if(Object.keys){
		countOwnProperties = function(object){
			return Object.keys(object).length;
		};
	}else{
		countOwnProperties = function(object){
			var count = 0;
			for(var name in object){
				if(object.hasOwnProperty(name)){
					++count;
				}
			}
			return count;
		};
	}

	var sorryTmpl1 = [
			"I am<% if(count > 0){",
			"           while(count--){",
			"               if(count){",
			"                   %> very<%",
			"               }",
			"           }",
			"       }else{",
			"           %> not<%",
			"       }",
			" %> sorry."
		].join("\n");

	var sorryTmpl2 = [
			"I am<% if(count > 0){",
			"           while(count--){",
			"               if(count){",
			"                   print(\" very\");",
			"               }",
			"           }",
			"       }else{",
			"           print(\" not\");",
			"       }",
			" %> sorry."
		].join("\n");

	// tests

	unit.add(module, [
		// evalWithEnv() tests
		function test_evalWithEnv_eval(t){
			var x = 42;
			eval(t.test('evalWithEnv({a: 1, b: 2})("a + b") === 3'));
			eval(t.test('evalWithEnv({a: 1, b: 2})("typeof a + typeof x") === "numberundefined"'));
			eval(t.test('evalWithEnv({a: 1, b: 2})("typeof b + typeof y") === "numberundefined"'));
		},
		function test_evalWithEnv_defaultAccessors(t){
			var f = evalWithEnv({a: 1, b: 2}, "a b"),
				g = f("(function(c){ return a + b + c; })");
			eval(t.test('g(3) === 6'));
			eval(t.test('f.closure.getA() === 1'));
			eval(t.test('f.closure.getB() === 2'));
			eval(t.test('f.closure.setA(4) === 4'));
			eval(t.test('g(3) === 9'));
			eval(t.test('f.closure.setB(5) === 5'));
			eval(t.test('g(3) === 12'));
			eval(t.test('f.closure.getA() === 4'));
			eval(t.test('f.closure.getB() === 5'));
		},
		function test_evalWithEnv_prefixAccessors(t){
			var f = evalWithEnv({a: 1, b: 2}, "a b", evalWithEnv.prefixSlot),
				g = f("(function(c){ return a + b + c; })");
			eval(t.test('g(3) === 6'));
			eval(t.test('f.closure.getA() === 1'));
			eval(t.test('f.closure.getB() === 2'));
			eval(t.test('f.closure.setA(4) === 4'));
			eval(t.test('g(3) === 9'));
			eval(t.test('f.closure.setB(5) === 5'));
			eval(t.test('g(3) === 12'));
			eval(t.test('f.closure.getA() === 4'));
			eval(t.test('f.closure.getB() === 5'));
		},
		function test_evalWithEnv_inlineAccessors(t){
			var f = evalWithEnv({a: 1, b: 2}, "a b", evalWithEnv.inlineSlot),
				g = f("(function(c){ return a + b + c; })");
			eval(t.test('g(3) === 6'));
			eval(t.test('f.closure.a === 1'));
			eval(t.test('f.closure.b === 2'));
			eval(t.test('(f.closure.a = 4) === 4'));
			eval(t.test('g(3) === 9'));
			eval(t.test('(f.closure.b = 5) === 5'));
			eval(t.test('g(3) === 12'));
			eval(t.test('f.closure.a === 4'));
			eval(t.test('f.closure.b === 5'));
		},
		function test_evalWithEnv_doubleAccessors(t){
			var f = evalWithEnv({a: 1, b: 2}, "a b", evalWithEnv.doubleSlot),
				g = f("(function(c){ return a + b + c; })");
			eval(t.test('g(3) === 6'));
			eval(t.test('f.closure.a.get() === 1'));
			eval(t.test('f.closure.b.get() === 2'));
			eval(t.test('f.closure.a.set(4) === 4'));
			eval(t.test('g(3) === 9'));
			eval(t.test('f.closure.b.set(5) === 5'));
			eval(t.test('g(3) === 12'));
			eval(t.test('f.closure.a.get() === 4'));
			eval(t.test('f.closure.b.get() === 5'));
		},
		function test_evalWithEnv_functionAccessors(t){
			var f = evalWithEnv({a: 1, b: 2}, "a b", evalWithEnv.functionSlot),
				g = f("(function(c){ return a + b + c; })");
			eval(t.test('g(3) === 6'));
			eval(t.test('f.closure.a() === 1'));
			eval(t.test('f.closure.b() === 2'));
			eval(t.test('f.closure.a(4) === 4'));
			eval(t.test('g(3) === 9'));
			eval(t.test('f.closure.b(5) === 5'));
			eval(t.test('g(3) === 12'));
			eval(t.test('f.closure.a() === 4'));
			eval(t.test('f.closure.b() === 5'));
		},
		function test_evalWithEnv_defaultFullAccessors(t){
			var f = evalWithEnv({a: 1, b: 2}, true),
				g = f("(function(c){ return a + b + c; })");
			eval(t.test('g(3) === 6'));
			eval(t.test('f.closure.getA() === 1'));
			eval(t.test('f.closure.getB() === 2'));
			eval(t.test('f.closure.setA(4) === 4'));
			eval(t.test('g(3) === 9'));
			eval(t.test('f.closure.setB(5) === 5'));
			eval(t.test('g(3) === 12'));
			eval(t.test('f.closure.getA() === 4'));
			eval(t.test('f.closure.getB() === 5'));
		},
		function test_evalWithEnv_defaultCommaAccessors(t){
			var f = evalWithEnv({a: 1, b: 2}, "a, b"),
				g = f("(function(c){ return a + b + c; })");
			eval(t.test('g(3) === 6'));
			eval(t.test('f.closure.getA() === 1'));
			eval(t.test('f.closure.getB() === 2'));
			eval(t.test('f.closure.setA(4) === 4'));
			eval(t.test('g(3) === 9'));
			eval(t.test('f.closure.setB(5) === 5'));
			eval(t.test('g(3) === 12'));
			eval(t.test('f.closure.getA() === 4'));
			eval(t.test('f.closure.getB() === 5'));
		},
		// Pool tests
		function test_pool(t){
			var pool = new Pool;
			eval(t.test('!pool.getTop()'));
			var env = pool.newEnv();
			eval(t.test('countOwnProperties(env) == 0'));
			env.a = 42;
			pool.commit(env);
			env = pool.getTop();
			eval(t.test('countOwnProperties(env) == 1'));
			eval(t.test('env.a === 42'));
			env = pool.newEnv();
			eval(t.test('countOwnProperties(env) == 0'));
			eval(t.test('env.a === 42'));
			env.b = 13;
			eval(t.test('countOwnProperties(env) == 1'));
			eval(t.test('env.b === 13'));
			pool.merge(env);
			env = pool.getTop();
			eval(t.test('countOwnProperties(env) == 2'));
			eval(t.test('env.a === 42'));
			eval(t.test('env.b === 13'));
		},
		// count() tests
		function test_simple_counts(t){
			"use strict";
			var dict = count("$${a} ${a} ${b} ${a}");
			eval(t.test('dict.a === 2'));
			eval(t.test(' dict.b === 1'));
			if(Object.keys){
				eval(t.test('Object.keys(dict).length == 2'));
			}
		},
		function test_complex_counts(t){
			"use strict";
			var dict = count("$${a}x${a}-${b}.$$${b}/${a}${a }", {b: 1, c: 2});
			eval(t.test('dict.a === 2'));
			eval(t.test('dict.b === 2'));
			eval(t.test('dict.c === 2'));
			if(Object.keys){
				eval(t.test('Object.keys(dict).length == 3'));
			}
		},
		// replace() tests
		function test_simple_replace(t){
			"use strict";
			var text = replace("$${a} ${a} ${b} ${a}", {a: "xxx", b: 777});
			eval(t.test('text === "${a} xxx 777 xxx"'));
		},
		function test_complex_replace(t){
			"use strict";
			var text = replace("$${a}x${a}-${b}\n.$$${b}/${a}${a }", {a: "yyy", b: 42, c: null});
			eval(t.test('text === "${a}xyyy-42\\n.$${b}/yyy${a }"'));
		},
		// ctr() tests
		function test_simple_ctr(t){
			"use strict";
			var text = ctr(
					"(function(${args}){\n" +
					"    #{body}\n" +
					"})",
					{
						args: "",
						body: "return 'Hello, world!';"
					}
				).getCode();
			eval(t.test('text ===' +
					'"(function(){\\n" +' +
					'"    return \'Hello, world!\';\\n" +' +
					'"})"'));
		},
		function test_complex_ctr(t){
			"use strict";
			var text = ctr(
					[
						"(function(${args}){",
						"    #{body}",
						"})"
					],
					{
						args: "a, b",
						body: [
								"var c = a + b;",
								"return c;"
							]
					}
				).getCode();
			eval(t.test('text ===' +
					'"(function(a, b){\\n" +' +
					'"    var c = a + b;\\n" +' +
					'"    return c;\\n" +' +
					'"})"'));
		},
		// JST tests
		function test_jst_simple1(t){
			var text = jst([
						"Hello, <%= name %>!"
					]).compile({
						name: "world"
					})();
			eval(t.test('text === "Hello, world!"'));
		},
		function test_jst_simple2(t){
			var text = jst("Hello, Bob's <%= name %>!").compile({
						name: "world"
					})();
			eval(t.test('text === "Hello, Bob\'s world!"'));
		},
		function test_jst_simple3(t){
			var text = jst("Hello, <%= name %>!").compile({
						name: "Bob's world"
					})();
			eval(t.test('text === "Hello, Bob\'s world!"'));
		},
		function test_jst_sorry0(t){
			var text = jst(sorryTmpl1).compile({count: 0})();
			eval(t.test('text === "I am not sorry."'));
		},
		function test_jst_sorry1(t){
			var text = jst(sorryTmpl1).compile({count: 1})();
			eval(t.test('text === "I am sorry."'));
		},
		function test_jst_sorry2(t){
			var text = jst(sorryTmpl1).compile({count: 2})();
			eval(t.test('text === "I am very sorry."'));
		},
		function test_jst_sorry3(t){
			var text = jst(sorryTmpl1).compile({count: 3})();
			eval(t.test('text === "I am very very sorry."'));
		},
		function test_jst_sorry3_inline(t){
			var text = jst(sorryTmpl2).compile({count: 3})();
			eval(t.test('text === "I am very very sorry."'));
		}
	]);

	unit.run();
});
