import { NodemailerInterface } from "../interfaces/nodemailer.interface";
import { Queue } from "bullmq";
import config from "../config";
import SubscribedUserCrud from "../models/subscribedUser.crud";
import { BullMQOtel } from "bullmq-otel";

const { bullmqConfig } = config;

class NewsletterService {
    private queue: Queue
    private subscribedUserCRUD: typeof SubscribedUserCrud;;
    constructor() {
        this.queue = new Queue<NodemailerInterface>(config.bullmqConfig.queueName, { 
            connection: bullmqConfig.connections,
            telemetry: new BullMQOtel('newsletter-service', '1.0.0'),
        });
        this.subscribedUserCRUD = SubscribedUserCrud;
    }

    async subscribeToNewsletter(email: string) {
        const subscribedUser = await this.subscribedUserCRUD.create(email);
        
        if (!subscribedUser) {
            return false;
        };

        await this.queue.add('sendEmail', {
            from: '"Newsletter" <newsletter@example.com>',
            to: email,
            subject: 'Newsletter Subscription Confirmation',
            text: 'Thank you for subscribing to our newsletter!',
        });

        console.log(`Added to queue sendEmail-subscribe: ${email}`);

        return subscribedUser;
    }

    async unsubcribeFromNewsletter(email: string) {
        const removedUser = await this.subscribedUserCRUD.delete(email);

        if (!removedUser) {
            return false;
        };

        await this.queue.add('sendEmail', {
            from: '"Newsletter" <newsletter@example.com>',
            to: email,
            subject: 'Newsletter Unsubscription Confirmation',
            text: 'You have been unsubscribed from our newsletter.',
        });

        console.log('Added to queue sendEmail-unsubscribe: ', email);
        return removedUser;
    }
}

export default new NewsletterService();
