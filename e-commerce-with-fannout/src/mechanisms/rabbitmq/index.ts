import { env } from "../../common/env/setup-envs";
import amqp from "amqplib";

export enum exchangeTypeEnum {
  DIRECT = "direct",
  TOPIC = "topic",
  HEADERS = "headers",
  FANOUT = "fanout",
  MATCH = "match",
}
export class RabbitMQBroker {
  private protocol: string;
  private host: string;
  private port: number;
  private username: string;
  private password: string;
  private exchangeType: exchangeTypeEnum;
  private exchangeName: string;

  constructor(exchangeName: string) {
    this.protocol = env.RABBITMQ_PROTOCOL;
    this.host = env.RABBITMQ_HOST;
    this.port = env.RABBITMQ_PORT;
    this.username = env.RABBITMQ_USERNAME;
    this.password = env.RABBITMQ_PASSWORD;
    this.exchangeName = exchangeName;
  }
  private getConnectionString(): string {
    return `${this.protocol}://${this.username}:${this.password}@${this.host}:${this.port}`;
  }

  public async sendFanout(message: object): Promise<void> {
    const connectionString = this.getConnectionString();
    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();

    console.log("Sending message to rabbitmq");
    await channel.assertExchange(this.exchangeName, exchangeTypeEnum.FANOUT, {
      durable: true,
    });

    channel.publish(this.exchangeName, "", Buffer.from(message.toString()));
  }

  private createQueue(channel: any, queue: string) {
    return new Promise((resolve, reject) => {
      try {
        channel.assertQueue(queue, { durable: true });
        resolve(channel);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async consumeFannout(
    queue: string,
    callback: (msg: any) => void
  ): Promise<void> {
    const connectionString = this.getConnectionString();
    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();

    await this.createQueue(channel, queue);

    channel.consume(queue, callback, { noAck: true });
  }

  public async sendDirect(
    message: object,
    options: { routingKey: string }
  ): Promise<void> {
    const connectionString = this.getConnectionString();
    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();

    console.log("Sending message to rabbitmq");
    await channel.assertExchange(this.exchangeName, exchangeTypeEnum.DIRECT, {
      durable: true,
    });

    channel.publish(
      this.exchangeName,
      options.routingKey,
      Buffer.from(message.toString())
    );
  }
}
