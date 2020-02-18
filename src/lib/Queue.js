import Bee from 'bee-queue';
import NewDelivery from '../app/jobs/NewDelivery';
import CancelDelivey from '../app/jobs/CancelDelivery';
import redisConfig from '../config/redis';

const jobs = [NewDelivery, CancelDelivey];

class Queue {
    constructor() {
        this.queue = {};

        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => {
            this.queue[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    addKey(key, job) {
        return this.queues[key].bee.createJob(job).save();
    }

    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queue[job.key];
            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue();
