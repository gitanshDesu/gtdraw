import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@gtdraw/common/config";
import { CustomError } from "@gtdraw/common/utils/CustomError";
import { prisma } from "@gtdraw/db";
import http from "http";

const server = http.createServer();

const wss = new WebSocketServer({
  server,
});

/*
Notes:
const users = [
  {
    //this is roughly how our schema will look
    userId:1,
    rooms: ["room1","room2"],
    ws: socket // reference object to user's socket connection (using this object will send messages to user with userId 1)
  }
]; // store all the users that connect to us.
OR
const rooms = []; // store all the rooms
*/
//TODO: Manage state usiing singletons.
interface User {
  ws: WebSocket;
  rooms: Array<string>;
  userId: string;
}

const users: Array<User> = [];

//Put verify JWT logic, otherwise whenver there will be a JWT error or some sends wrong JWT this will crash our server
const verifyCookies = (ws: WebSocket, request: http.IncomingMessage) => {
  try {
    const accessToken = request.headers.cookie;
    if (!accessToken) {
      console.error("Cookies Are Required To Establish Web Socket Connection");
      ws.close();
      throw new CustomError(401, "Unauthorized Request");
    }
    const decodedTokenInfo = jwt.verify(
      accessToken!,
      ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    if (!decodedTokenInfo || !decodedTokenInfo.id) {
      ws.close();
      console.error(
        "You have sent invalid access token in web socket connection"
      );
      throw new CustomError(401, "Invalid Access Token!");
    }
    const user = prisma.user.findFirst({
      where: {
        id: decodedTokenInfo.id,
      },
    });
    if (!user) {
      ws.close();
      console.error("id from Decoded Token can't be matched to any user in DB");
      throw new CustomError(401, "Invalid Access Token!");
    }
    return user;
  } catch (error) {
    console.error("Error Occurred while verifying JWT From Cookies:\n", error);
    throw new CustomError(500, "Error Occurred While Verifying JWT");
  }
};

const checkUser = (token: string, ws: WebSocket): string | null => {
  try {
    const decodedToken = jwt.verify(token!, ACCESS_TOKEN_SECRET!) as JwtPayload;
    if (!decodedToken || !decodedToken.id) {
      ws.close();
      //TODO: throw custom Error
      return null;
    }
    return decodedToken.id;
  } catch (error) {
    throw new CustomError(
      500,
      `Error Occurred while verifying JWT:\n ${error}`
    );
  }
};

wss.on("connection", function connection(ws, request) {
  //TODO: Instead of query params, figure to get token via cookies(if possible) or else header

  // const user =  verifyCookies(ws, request); // Test this later

  const url = request.url;
  if (!url) {
    ws.close();
    //TODO: Throw custom Error
    return;
  }
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token");
  const userId = checkUser(token!, ws);
  if (userId == null) {
    ws.close();
    return;
  }
  users.push({
    userId,
    ws,
    rooms: [],
  });

  //Authenticate if user is signed in
  ws.on("message", async function message(data) {
    let jsonString: string = "";
    if (Buffer.isBuffer(data)) {
      jsonString = data.toString("utf-8");
    } else if (data instanceof ArrayBuffer) {
      jsonString = new TextDecoder("utf-8").decode(data);
    } else if (Array.isArray(data)) {
      jsonString = Buffer.concat(data).toString("utf-8");
    }
    const parsedData = JSON.parse(jsonString);

    if (parsedData.type === "join_room") {
      const user = users.find((user) => user.ws === ws); // find user whose socket object === ws
      if (!user) {
        ws.close();
        console.error(
          'User\'s Socket Connection refrence object "ws" Not found in users array.'
        );
        throw new CustomError(404, "User Doesn't Exist");
      }
      //Check if room exists in DB
      const room = prisma.room.findFirst({
        where: {
          id: parsedData.roomId,
        },
      });
      if (!room) {
        ws.close();
        console.error('Room with room id "roomId " Not Found in DB');
        throw new CustomError(404, "Room Doesn't Exist!");
      }
      user.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((user) => user.ws === ws);
      if (!user) {
        ws.close();
        console.error(
          'User\'s Socket Connection refrence object "ws" Not found in users array.'
        );
        throw new CustomError(404, "User Doesn't Exist");
      }
      user.rooms = user.rooms.filter((room) => room !== parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const room = parsedData.roomId;
      const message = parsedData.message;

      //Before brodcasting chat to every user in the room save chat to DB (will make brodcasting message to others slow, instead use queue)

      const chat = await prisma.chat.create({
        data: {
          roomId: room,
          message,
          userId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(room)) {
          // we can only send string or binary data over ws connection (mentioned in ws's spec)
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId: room,
            })
          );
          /*
          Things to fix:
          1. Not persisting things on DB (takes time, not instantaneous as we want in RTC so we should use queues and create a pipeline to push from queue to DB.)
          2. There is no auth (i.e. any one can send messages to any room, i.e. I subscribed to room1 , I can send messages to room2)
          3. Permissions (maybe certain people only can send messages)
          */
        }
      });
    }
  });
});

server.listen(8080, () => {
  console.log("Server is running on Port 8080");
});
