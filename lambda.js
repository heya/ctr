/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
(["./Target"], function(Target){

	// This module adds high-level functions and related constructs:
	//	- anonymous functions built from the string

	// Acknowledgements:
	//	- lambda() is based on work by Oliver Steele
	//		(http://osteele.com/sources/javascript/functional/functional.js)
	//		which was published under MIT License

	// Notes:
	//	- lambda() produces functions, which after the compilation step are
	//		as fast as regular JS functions (at least theoretically).

	// Lambda input values:
	//	- returns functions unchanged
	//	- converts strings to functions
	//	- converts arrays to a functional composition

	var lcache = {};

	function identity(x){ return x; }

	function crackLambda(/*String*/ s){
		// summary:
		//		builds a function from a snippet, or array (composing),
		//		returns an object describing the function; functions are
		//		passed through unmodified.
		// description:
		//		This method is to normalize a functional representation (a
		//		text snippet) to an object that contains an array of
		//		arguments, and a body , which is used to calculate the
		//		returning value.
		var args = [], sects = s.split(/\s*->\s*/m);
		if(sects.length == 2){
			s = sects[1];
			args = sects[0].split(/\s*,\s*|\s+/m);
		}else if(s.match(/\b_\b/)){
			args = ["_"];
		}else{
			var l = s.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m),
				r = s.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);
			if(l || r){
				if(l){
					args.push("__$1");
					s = "__$1" + s;
				}
				if(r){
					args.push("__$2");
					s = s + "__$2";
				}
			}else{
				// the point of the long regex below is to exclude all well-known
				// lower-case words from the list of potential arguments
				var vars = s.
					replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*:|this|true|false|null|undefined|typeof|instanceof|in|delete|new|void|arguments|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|eval|isFinite|isNaN|parseFloat|parseInt|unescape|window|document|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, "").
					match(/([a-z_$][a-z_$\d]*)/gi) || [], t = {}, i = 0, v;
				for(; i < vars.length; ++i){
					v = vars[i];
					if(!t.hasOwnProperty(v)){
						args.push(v);
						t[v] = 1;
					}
				}
			}
		}
		return {args: args, body: s};	// Object
	};

	function compose(/*Array*/ a){
		return a.length ?
			function(){
				var i = a.length - 1, x = lambda(a[i]).apply(this, arguments);
				for(--i; i >= 0; --i){ x = lambda(a[i]).call(this, x); }
				return x;
			} : identity;
	}

	function sourceLambda(/*String*/ s){
		// summary:
		//		builds a function from a snippet, returns a string, which
		//		represents the function.
		// description:
		//		This method returns a textual representation of a function
		//		built from the snippet. It is meant to be evaled in the
		//		proper context, so local variables can be pulled from the
		//		environment.
		var l = crackLambda(s);
		return "(function(" + l.args.join(", ") + "){ return (" + l.body + "); })";	// String
	}

	function buildLambda(s, props){
		return new Target([sourceLambda(s)], props);
	}

	function lambda(/*Function|String|Array*/ s){
		// summary:
		//		builds a function from a snippet, or array (composing),
		//		returns a function object; functions are passed through
		//		unmodified.
		// description:
		//		This method is used to normalize a functional
		//		representation (a text snippet, an array, or a function) to
		//		a function object.
		if(s instanceof Array){ return compose(s); }
		if(typeof s == "string"){
			if(lcache.hasOwnProperty(s)){ return lcache[s]; }
			var l = crackLambda(s);
			// the next assignment is intentional
			return lcache[s] = new Function(l.args, "return (" + l.body + ");");	// Function
		}
		return s;
	}

	lambda.crack = crackLambda;
	lambda.build = buildLambda;
	lambda.source = sourceLambda;
	lambda.clearCache = function(){ lcache = {}; };

	return lambda;
});
