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