// test harness

if(typeof out == "undefined"){
	out = function(msg){
		console.log(msg);
	};
	_total = 0;
	_errors = 0;
	res = function(msg, isError){
		++_total;
		if(isError){
			++_errors;
			console.log(msg);
		}
	};
	count   = require("../count");
	replace = require("../replace");
	ctr     = require("../main");
	jst     = require("../jst");
	Pool    = require("../Pool");
	evalWithEnv = require("../evalWithEnv");
}

function submit(msg, success){
	if(success){
		res("Success: " + msg);
	}else{
		res("Failed: " + msg, true);
	}
}

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

var tests = [
	// evalWithEnv() tests
	function(){
		var x = 42;
		submit("eval #1", evalWithEnv({a: 1, b: 2})("a + b") === 3);
		submit("eval #2", evalWithEnv({a: 1, b: 2})("typeof a + typeof x") === "numberundefined");
		submit("eval #3", evalWithEnv({a: 1, b: 2})("typeof b + typeof y") === "numberundefined");
	},
	function(){
		var f = evalWithEnv({a: 1, b: 2}, "a b"),
			g = f("function(c){ return a + b + c; }");
		submit("eval + default accessors #1", g(3) === 6);
		submit("eval + default accessors get A", f.closure.getA() === 1);
		submit("eval + default accessors get B", f.closure.getB() === 2);
		submit("eval + default accessors set A", f.closure.setA(4) === 4);
		submit("eval + default accessors #2", g(3) === 9);
		submit("eval + default accessors set B", f.closure.setB(5) === 5);
		submit("eval + default accessors #3", g(3) === 12);
		submit("eval + default accessors get A #2", f.closure.getA() === 4);
		submit("eval + default accessors get B #2", f.closure.getB() === 5);
	},
	function(){
		var f = evalWithEnv({a: 1, b: 2}, "a b", evalWithEnv.prefixSlot),
			g = f("function(c){ return a + b + c; }");
		submit("eval + prefix accessors #1", g(3) === 6);
		submit("eval + prefix accessors get A", f.closure.getA() === 1);
		submit("eval + prefix accessors get B", f.closure.getB() === 2);
		submit("eval + prefix accessors set A", f.closure.setA(4) === 4);
		submit("eval + prefix accessors #2", g(3) === 9);
		submit("eval + prefix accessors set B", f.closure.setB(5) === 5);
		submit("eval + prefix accessors #3", g(3) === 12);
		submit("eval + prefix accessors get A #2", f.closure.getA() === 4);
		submit("eval + prefix accessors get B #2", f.closure.getB() === 5);
	},
	function(){
		var f = evalWithEnv({a: 1, b: 2}, "a b", evalWithEnv.inlineSlot),
			g = f("function(c){ return a + b + c; }");
		submit("eval + inline accessors #1", g(3) === 6);
		submit("eval + inline accessors get A", f.closure.a === 1);
		submit("eval + inline accessors get B", f.closure.b === 2);
		submit("eval + inline accessors set A", (f.closure.a = 4) === 4);
		submit("eval + inline accessors #2", g(3) === 9);
		submit("eval + inline accessors set B", (f.closure.b = 5) === 5);
		submit("eval + inline accessors #3", g(3) === 12);
		submit("eval + inline accessors get A #2", f.closure.a === 4);
		submit("eval + inline accessors get B #2", f.closure.b === 5);
	},
	function(){
		var f = evalWithEnv({a: 1, b: 2}, "a b", evalWithEnv.doubleSlot),
			g = f("function(c){ return a + b + c; }");
		submit("eval + double accessors #1", g(3) === 6);
		submit("eval + double accessors get A", f.closure.a.get() === 1);
		submit("eval + double accessors get B", f.closure.b.get() === 2);
		submit("eval + double accessors set A", f.closure.a.set(4) === 4);
		submit("eval + double accessors #2", g(3) === 9);
		submit("eval + double accessors set B", f.closure.b.set(5) === 5);
		submit("eval + double accessors #3", g(3) === 12);
		submit("eval + double accessors get A #2", f.closure.a.get() === 4);
		submit("eval + double accessors get B #2", f.closure.b.get() === 5);
	},
	function(){
		var f = evalWithEnv({a: 1, b: 2}, "a b", evalWithEnv.functionSlot),
			g = f("function(c){ return a + b + c; }");
		submit("eval + function accessors #1", g(3) === 6);
		submit("eval + function accessors get A", f.closure.a() === 1);
		submit("eval + function accessors get B", f.closure.b() === 2);
		submit("eval + function accessors set A", f.closure.a(4) === 4);
		submit("eval + function accessors #2", g(3) === 9);
		submit("eval + function accessors set B", f.closure.b(5) === 5);
		submit("eval + function accessors #3", g(3) === 12);
		submit("eval + function accessors get A #2", f.closure.a() === 4);
		submit("eval + function accessors get B #2", f.closure.b() === 5);
	},
	// Pool tests
	function(){
		var pool = new Pool;
		submit("new top is falsy", !pool.getTop());
		var env = pool.newEnv();
		submit("new env is empty", countOwnProperties(env) == 0);
		env.a = 42;
		pool.commit(env);
		env = pool.getTop();
		submit("env has one element", countOwnProperties(env) == 1);
		submit("env has a as 42", env.a === 42);
		env = pool.newEnv();
		submit("new env has no own elements", countOwnProperties(env) == 0);
		submit("new env has a as 42", env.a === 42);
		env.b = 13;
		submit("new env has one own element", countOwnProperties(env) == 1);
		submit("new env has b as 13", env.b === 13);
		pool.merge(env);
		env = pool.getTop();
		submit("env has two own elements", countOwnProperties(env) == 2);
		submit("env has a as 42", env.a === 42);
		submit("env has b as 13", env.b === 13);
	},
	// count() tests
	function(){
		"use strict";
		var dict = count("$${a} ${a} ${b} ${a}");
		submit("a is encountered 2 times", dict.a === 2);
		submit("b is encountered 1 time",  dict.b === 1);
		if(Object.keys){
			submit("dict contains 2 names", Object.keys(dict).length == 2);
		}
	},
	function(){
		"use strict";
		var dict = count("$${a}x${a}-${b}.$$${b}/${a}${a }", {b: 1, c: 2});
		submit("a is encountered 2 times", dict.a === 2);
		submit("b is encountered 2 times", dict.b === 2);
		submit("c is encountered 2 times", dict.c === 2);
		if(Object.keys){
			submit("dict contains 3 names", Object.keys(dict).length == 3);
		}
	},
	// replace() tests
	function(){
		"use strict";
		var text = replace("$${a} ${a} ${b} ${a}", {a: "xxx", b: 777});
		submit("${a} xxx 777 xxx", text === "${a} xxx 777 xxx");
	},
	function(){
		"use strict";
		var text = replace("$${a}x${a}-${b}\n.$$${b}/${a}${a }", {a: "yyy", b: 42, c: null});
		submit("${a}xyyy-42\n.$${b}/yyy${a }", text === "${a}xyyy-42\n.$${b}/yyy${a }");
	},
	// ctr() tests
	function(){
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
		submit("Hello, world #1", text ===
				"(function(){\n" +
				"    return 'Hello, world!';\n" +
				"})"
			);
	},
	function(){
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
		submit("Hello, world #2", text ===
				"(function(a, b){\n" +
				"    var c = a + b;\n" +
				"    return c;\n" +
				"})"
			);
	},
	// JST tests
	function(){
		var text = jst([
					"Hello, <%= name %>!"
				]).compile({
					name: "world"
				})();
		submit("Hello, world #3", text === "Hello, world!");
	},
	function(){
		var text = jst("Hello, Bob's <%= name %>!").compile({
					name: "world"
				})();
		submit("Hello, world #4", text === "Hello, Bob's world!");
	},
	function(){
		var text = jst("Hello, <%= name %>!").compile({
					name: "Bob's world"
				})();
		submit("Hello, world #5", text === "Hello, Bob's world!");
	},
	function(){
		var text = jst(sorryTmpl1).compile({count: 0})();
		submit("I am not sorry", text === "I am not sorry.");
	},
	function(){
		var text = jst(sorryTmpl1).compile({count: 1})();
		submit("I am sorry", text === "I am sorry.");
	},
	function(){
		var text = jst(sorryTmpl1).compile({count: 2})();
		submit("I am very sorry", text === "I am very sorry.");
	},
	function(){
		var text = jst(sorryTmpl1).compile({count: 3})();
		submit("I am very very sorry", text === "I am very very sorry.");
	},
	function(){
		var text = jst(sorryTmpl2).compile({count: 3})();
		submit("I am very very sorry", text === "I am very very sorry.");
	}
];

function runTests(){
	_total = _errors = 0;
	var exceptionFlag = false;
	out("Starting tests...");
	for(var i = 0, l = tests.length; i < l; ++i){
		try{
			tests[i]();
		}catch(e){
			exceptionFlag = true;
			if(typeof console != "undefined"){	// IE < 9 :-(
				console.log("Unhandled exception in test #" + i + ": " + e.message);
			}
		}
	}
	out(_errors ? "Failed " + _errors + " out of " + _total + " tests." : "Finished " + _total + " tests.");
	if(typeof process != "undefined"){
		process.exit(_errors || exceptionFlag ? 1 : 0);
	}
}

if(typeof require != "undefined" && require.main === module){
	runTests();
}
