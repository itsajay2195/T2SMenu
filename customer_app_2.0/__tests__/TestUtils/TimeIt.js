import now from 'performance-now';

let startTime = 0;
export default {
    start: () => {
        startTime = now();
    },
    log: (log) => {
        console.log(`${(now() - startTime).toFixed(3)} - ${log}`);
    },
    stop: () => {
        console.log(`Ended in ${(now() - startTime).toFixed(3)}`);
    }
};
