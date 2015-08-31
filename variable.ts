interface ComputeFunc {
	(): any;
}

class Variable {
	name: string
	compute: ComputeFunc
	dependencies: Variable[]
	val: any
	dependents: Variable[]
	
	constructor(name: string, compute: ComputeFunc, dependencies: Variable[]) {
		this.name = name;
		this.compute = compute;
		this.dependencies = dependencies;
		this.dependents = [];
		this.val = null;

		this.update();
		
		this.dependencies.forEach(function(d) {
			d.addDependentVariable(this);
		}, this);
	}
		
	update() {
		this.val = this.compute();
	}
	
	addDependentVariable(v: Variable) {
		this.dependents.push(v);
	}
	
	set(val: any) {
		this.val = val;
		
		this.dependents.forEach(function(d: Variable) {
			d.update();
		});
	}
	
	debugLog() {
		var res = "";
		
		res += this.name;
		res += " = "
		res += this.val;
		res += " (";
		res += this.dependencies.map(function(d){return d.name}).join(", ");
		res += ")";
				
		console.log(res);
	}
};

function constVariable(name, val): Variable {
	return new Variable(
		name,
		function() {return val},
		[]
	)
}

function add(name, a, b): Variable {
	return new Variable(
		name,
		function() {return a.val + b.val},
		[a,b]
	);
};

var a = constVariable("a", 1);
var b = constVariable("b", 2);
var c = add("a+b", a, b);

a.debugLog();
b.debugLog();
c.debugLog();