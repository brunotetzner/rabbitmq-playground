import { RabbitMQBroker } from "../../../mechanisms/rabbitmq";

export class ProcessPaymentService {
  static execute() {
    const broker = new RabbitMQBroker("amqp.fanout");
    broker.consumeFannout("payment-queue", (message: unknown) => {
      console.log("Processing payment message:");
    });
  }
}
