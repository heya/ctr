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
			).join("\n");
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
			).join("\n");
		submit("Hello, world #2", text ===
				"(function(a, b){\n" +
				"    var c = a + b;\n" +
				"    return c;\n" +
				"})"
			);
	},
	// JST tests
	function(){
		var text = jst.compile(
				[
					"Hello, <%= name %>!"
				].join("\n"),
				{
					name: "world"
				}
			)();
		submit("Hello, world #3", text === "Hello, world!");
	},
	function(){
		var text = jst.compile(
				[
					"Hello, Bob's <%= name %>!"
				].join("\n"),
				{
					name: "world"
				}
			)();
		submit("Hello, world #4", text === "Hello, Bob's world!");
	},
	function(){
		var text = jst.compile(
				[
					"Hello, <%= name %>!"
				].join("\n"),
				{
					name: "Bob's world"
				}
			)();
		submit("Hello, world #5", text === "Hello, Bob's world!");
	},
	function(){
		var text = jst.compile(sorryTmpl1, {count: 0})();
		submit("I am not sorry", text === "I am not sorry.");
	},
	function(){
		var text = jst.compile(sorryTmpl1, {count: 1})();
		submit("I am sorry", text === "I am sorry.");
	},
	function(){
		var text = jst.compile(sorryTmpl1, {count: 2})();
		submit("I am very sorry", text === "I am very sorry.");
	},
	function(){
		var text = jst.compile(sorryTmpl1, {count: 3})();
		submit("I am very very sorry", text === "I am very very sorry.");
	},
	function(){
		var text = jst.compile(sorryTmpl2, {count: 3})();
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
