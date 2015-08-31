function Variable(name, compute, dependencies) {
	this.name = name;
	this.compute = compute;
	this.dependencies = dependencies;
	this.val = null;
	
	this.update = function() {
		this.val = this.compute();
	}
	
	this.update();
	
	this.dependencies.forEach(function(d) {
		d.addDependentVariable(this);
	}, this);

	this.dependents = [];
	this.addDependentVariable = function(v) {
		this.dependents.push(v);
	}
	
	this.set = function(val) {
		this.val = val;
		
		this.dependents.forEach(function(d) {
			d.update();
		});
	}
	
	this.debugLog = function() {
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

function constVariable(name, val) {
	return new Variable(
		name,
		function() {return val},
		[]
	)
}

function add(name, a, b) {
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