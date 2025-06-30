import { WebSocketServer } from "ws";
import http from "http";
import { SocketManager } from "./SocketManager";
import { UserManager } from "./UserManager";

const server = http.createServer();

const wss = new WebSocketServer({
  server,
});
const userInstance = UserManager.getInstance();

wss.on("connection", function connection(ws, request) {
  //TODO: Instead of query params, figure to get token via cookies(if possible) or else header
  const socketInstance = SocketManager.getInstance(ws, request);
  // const user =  verifyCookies(ws, request); // Test this later

  const url = request.url;
  if (!url) {
    ws.close();
    //TODO: Throw custom Error
    return;
  }
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token");
  const userId = socketInstance.checkUser(token!);
  if (userId == null) {
    ws.close();
    return;
  }

  userInstance.addUser(userId, ws);
  socketInstance.emitMessage();
  socketInstance.disconnet();
});

server.listen(8080, () => {
  console.log("Server is running on Port 8080");
});
