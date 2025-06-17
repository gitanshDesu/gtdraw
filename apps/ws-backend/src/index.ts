import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  //TODO: Instead of query params, figure to get token via cookies(if possible) or else header
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token");
  const decodedToken = jwt.verify(token!, "secret") as JwtPayload;
  if (!decodedToken || !decodedToken._id) {
    ws.close();
    //TODO: throw custom Error
    return;
  }
  //Authenticate if user is signed in
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
