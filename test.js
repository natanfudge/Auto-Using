const { performance } = require('perf_hooks');
const startTime = performance.now();

function measure(name) {
	let now = performance.now();
	console.log(name + " = " + (now - startTime));
}

const SAMPLE_SIZE = 100;

async function measure(name, func){
	let sum =0;
	for(let i = 0; i < SAMPLE_SIZE; i++){
		let start = performance.now();
		await func();
		let end = performance.now();
		sum += (end - start);
	}

	// console.log("sum = " + sum);

	console.log(name + " = " + sum / SAMPLE_SIZE);
}

const LOOPS = 100000

let arr = new Array(LOOPS);

for(let i = 0; i < LOOPS; i++) arr[i] = i;


measure("for",() =>{
	for(let i =0; i < LOOPS; i++){
		arr[i] = 2;
	}
})

measure("map",() =>{
	arr.map(() => 2);
})