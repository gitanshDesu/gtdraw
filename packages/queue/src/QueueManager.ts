import amqp from "amqplib";
import { CustomError } from "@gtdraw/common/utils/CustomError";
import { QueueMessageType } from "@gtdraw/common/types/index";
import { prisma } from "@gtdraw/db";

export class QueueManager {
  private static instance: QueueManager;
  private channel!: amqp.Channel; //Definite Assignment Assertion(!): Asserts channel will be initialized later by some method.
  private constructor() {}

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
      return QueueManager.instance;
    }
    return QueueManager.instance;
  }

  public async connect() {
    try {
      const connection = await amqp.connect(process.env.QUEUE_CONNECTION_URL);
      this.channel = await connection.createChannel();
      return this.channel;
    } catch (error) {
      throw new CustomError(
        500,
        `Error Occurred while Connecting to Queue:\n ${error}`
      );
    }
  }

  public async assertQueue() {
    try {
      await this.channel.assertQueue(process.env.QUEUE_NAME, { durable: true });
    } catch (error) {
      throw new CustomError(
        500,
        `Error Occurred while setting queue name:\n ${error}`
      );
    }
  }

  public push(message: QueueMessageType) {
    this.channel.sendToQueue(
      process.env.QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  public async pop() {
    //Insert in DB and pop()
    try {
      await this.channel.consume(process.env.QUEUE_NAME, (message) =>
        this.handleMessage(message)
      );
    } catch (error) {
      //TODO: Throw custom  error
      console.log(error);
    }
  }
  public async handleMessage(message: amqp.ConsumeMessage | null) {
    try {
      if (message) {
        const parsedData: QueueMessageType = JSON.parse(
          message.content.toString()
        );
        const chat = await prisma.chat.create({
          data: {
            userId: parsedData.userId,
            roomId: parsedData.roomId,
            message: parsedData.message,
          },
        });
        if (chat) {
          this.channel.ack(message);
        }
      } else {
        console.error(`message param is null in handleMessage method!`);
        throw new CustomError(400, "Message is required to insert in DB!");
      }
    } catch (error) {
      console.error(`Failed to insert message to DB:\n ${error}`);
      //send no ack and Requeue the message
      if (!message) {
        throw new CustomError(400, "message is required to insert in DB");
      }
      this.channel.nack(message, false, true);
    }
  }
}
