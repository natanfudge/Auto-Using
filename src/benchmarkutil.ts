function logBenchmark(performance : any) : void{
	performance.measure('Timing', "start", "end");

	const measurements = performance.getEntriesByType('measure');
	console.log("Time = " + measurements[0].duration);
}

function startBenchmark(performance : any) : void{
	performance.mark('start');
}

function stopBenchmark(performance : any) : void{
	performance.mark("end");
}