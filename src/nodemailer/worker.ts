import { Worker } from 'bullmq';
import config from '../config';
import processor from './'; // smtp transporter is meant to be the process function run by worker
import { BullMQOtel } from 'bullmq-otel';

const { bullmqConfig } = config;

export const initWorker = () => {
    const worker = new Worker(bullmqConfig.queueName, processor, {
        connection: bullmqConfig.connections,
        concurrency: bullmqConfig.concurrency,
        telemetry: new BullMQOtel('nodemailer-worker', '1.0.0')
    });

    worker.on('completed', (job) => {
        console.log(`Job with id ${job.id} has been completed`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job with id ${job?.id} has failed with error ${err.message}`);
    });
};
