import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    nodemailerConfig: {
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT ? parseInt(process.env.NODEMAILER_PORT) : undefined,
        auth: {
            user: process.env.NODEMAILER_AUTH_USER,
            pass: process.env.NODEMAILER_AUTH_PASS,
        },
    },
    postgresConfig: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : undefined,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB
    },
    bullmqConfig: {
        concurrency: process.env.BULLMQ_CONCURRENCY ? parseInt(process.env.BULLMQ_CONCURRENCY) : 5,
        queueName: process.env.BULLMQ_QUEUE_NAME || 'newsletterQueue',
        connections: {
            host: process.env.BULLMQ_HOST,
            port: process.env.BULLMQ_PORT ? parseInt(process.env.BULLMQ_PORT) : undefined,
        }
    }
};