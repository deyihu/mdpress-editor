import {
    FetchScheduler
} from 'fetch-scheduler';

export const fetchScheduler = new FetchScheduler({
    requestCount: 6 // Concurrent number of fetch requests
});
