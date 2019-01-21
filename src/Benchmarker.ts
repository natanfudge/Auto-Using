// const {
//     performance,
//     PerformanceObserver
// } = require('perf_hooks');

// const wrapped = performance.timerify(() => DO STUFF);
// const obs = new PerformanceObserver((list: any) => {
//     console.log(list.getEntries()[0].duration);
//     obs.disconnect();
// });
// obs.observe({ entryTypes: ['function'] });

// // A performance timeline entry will be created
// wrapped();

/**
 * Start measuring the amount of time has passed
 */
export class Benchmarker {
    private performance: any;
    private startTime: number;

    constructor() {
        const { performance } = require("perf_hooks");
        this.performance = performance;
        this.startTime = performance.now();

    }

    /**
     * Prints the amount of time passed since benchmarker construction.
     */
    public check() : void {
        console.log("Time passed = " + (this.performance.now() - this.startTime));
    }

}