/* UMD.define */ (typeof define=="function"&&define||function(d,f,m){m={module:module,require:require};module.exports=f.apply(null,d.map(function(n){return m[n]||require(n)}))})
([], function(){
	"use strict";

	// standard delegator (see Object.create() and dcl/mini.js)
	var F = new Function;
	function delegate(o){
		F.prototype = o;
		var t = new F;
		F.prototype = null;
		return t;
	}

	// standard mixer (see dcl/mini.js)
	function mix(a, b){
		for(var n in b){
			if(b.hasOwnProperty(n)){
				a[n] = b[n];
			}
		}
	}

	function Pool(){
		this.envs = [];
	}

	Pool.delegate = delegate;
	Pool.mix = mix;

	Pool.prototype = {
		newEnv: function(){
			return this.top ? delegate(this.top) : {};
		},
		commit: function(env){
			this.envs.push(this.top = env);
		},
		merge: function(env){
			if(!this.top){
				this.envs.push(this.top = {});
			}
			mix(this.top, env);
		},
		getTop: function(){
			return this.top;
		},
		pop: function(){
			if(this.top){
				var env = this.envs.pop();
				var l = this.envs.length;
				this.top = l ? this.envs[l - 1] : null;
				return env;
			}
			return null;
		}
	};

	return Pool;
});

// Example of a commit-based exception processing:
//
// var pool = new Pool();
// for(var i = 0; i < TRIES; ++i){
//     try{
//         var env = pool.newEnv();
//         doSomethingWithEnv(env);
//         pool.commit(env);
//         break; // we are done
//     }catch(e){
//	       // error processing
//     }
//     // if we are here => retry
// }
