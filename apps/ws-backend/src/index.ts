import { WebSocketServer } from "ws";
import http from "http";
import { SocketManager } from "./SocketManager";
import { UserManager } from "./UserManager";
import { QueueManager } from "@gtdraw/queue/QueueManager";
import dotenv from "dotenv";
import path from "path";
import { CustomError } from "@gtdraw/common/utils/CustomError";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
//TODO: Handle queue close connection on server shut down logic
async function main() {
  const server = http.createServer();

  const wss = new WebSocketServer({
    server,
  });
  const userInstance = UserManager.getInstance();
  const queue = QueueManager.getInstance();
  await queue.connect();
  await queue.assertQueue();

  wss.on("connection", async function connection(ws, request) {
    const socketInstance = SocketManager.getInstance(ws, request);
    const user = await socketInstance.verifyCookies();
    const userId = user?.id;
    if (userId == null) {
      ws.close();
      return;
    }

    userInstance.addUser(userId, ws);
    socketInstance.emitMessage();
    socketInstance.disconnect();
  });
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log("Server is running on Port ", PORT);
  });
}

main().catch((err) =>
  console.error(`Error Occurred in wss startup file:\n ${err}`)
);
