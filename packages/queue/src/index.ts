import dotenv from "dotenv";
import path from "path";
import { QueueManager } from "./QueueManager";
import { CustomError } from "@gtdraw/common/utils/CustomError";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
//TODO: Handle queue close connection on server shut down logic
async function main() {
  const queue = QueueManager.getInstance();
  await queue.connect();
  await queue.assertQueue();
  queue.pop();
}

main().catch((err) => {
  console.error(
    `Failed to connect or pop from queue from queue/index/main method:\n ${err}`
  );
  throw new CustomError(500, "Failed To Connect to Queue or Consume Message!");
});
