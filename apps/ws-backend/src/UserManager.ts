import { TypeFieldEnums } from "@gtdraw/common";
import { CustomError } from "@gtdraw/common";
import { prisma } from "@gtdraw/db";
import { QueueManager } from "@gtdraw/queue/QueueManager";
import WebSocket from "ws";
export interface User {
  ws: WebSocket;
  rooms: Array<string>;
}

export class UserManager {
  private static instance: UserManager;
  private users: Map<string, User>;
  private queue: QueueManager;
  private constructor() {
    this.users = new Map<string, User>();
    this.queue = QueueManager.getInstance();
  }

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
      return UserManager.instance;
    }
    return UserManager.instance;
  }

  public getUserId(ws: WebSocket) {
    for (let [userId, user] of this.users.entries()) {
      if (user.ws === ws) {
        return userId;
      }
    }
  }

  public addUser(userId: string, ws: WebSocket) {
    if (!this.users.has(userId)) {
      this.users.set(userId, { ws, rooms: [] });
      console.log(`User with ${userId} added successfully!`);
      return;
    }
    console.log(`User with ${userId} already exists `);
    return;
  }

  public async joinRoom(userId: string, roomId: string) {
    try {
      if (!this.users.has(userId)) {
        console.error(`User with ${userId} doesn't exist in users list`);
        throw new CustomError(404, "User Doesn't Exist!");
      }
      //Check if room exists in DB
      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
        },
      });
      if (!room) {
        this.users.get(userId)?.ws.close();
        console.error('Room with room id "roomId " Not Found in DB');
        throw new CustomError(404, "Room Doesn't Exist!");
      }
      //Check if user has already joined the room if yes return, (helps to avoid duplicates)
      if (this.users.get(userId)?.rooms.includes(roomId)) {
        console.log(`User ${userId} is already added to room ${roomId}`);
        return;
      }
      this.users.get(userId)?.rooms.push(roomId);
      console.log(`User ${userId} added to room ${roomId}`);
      return;
    } catch (error) {
      console.error(`Error Occurred while joining room:\n ${error}`);
      throw new CustomError(500, `Error Occurred while joining room!`);
    }
  }
  public async leaveRoom(userId: string, roomId: string) {
    try {
      if (!this.users.has(userId)) {
        console.error(`User with ${userId} doesn't exist in users list`);
        throw new CustomError(404, "User Doesn't Exist!");
      }

      //Check if room exists in DB
      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
        },
      });
      if (!room) {
        this.users.get(userId)?.ws.close();
        console.error('Room with room id "roomId " Not Found in DB');
        throw new CustomError(404, "Room Doesn't Exist!");
      }

      const ws = this.users.get(userId)?.ws;
      const rooms = this.users
        .get(userId)
        ?.rooms.filter((room) => room !== roomId);

      if (!ws) {
        console.error(`User ${userId} ws is undefined`);
        return;
      }

      if (!rooms) {
        console.error(`User ${userId} rooms array is undefined`);
        return;
      }

      this.users.set(userId, { ws, rooms });
      console.log(`User ${userId} left room ${roomId}`);
      return;
    } catch (error) {
      console.error(`Error Occurred while leaving room:\n${error}`);
      throw new CustomError(500, "Error Occurred while leaving room!");
    }
  }
  public async sendMessage(userId: string, roomId: string, message: string) {
    try {
      //check if user exists in users
      if (!this.users.has(userId)) {
        console.log(`User ${userId} Doesn't Exist in users list`);
        throw new CustomError(404, "User Doesn't Exist");
      }

      //Check if room exists in DB
      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
        },
      });
      if (!room) {
        this.users.get(userId)?.ws.close();
        console.error('Room with room id "roomId " Not Found in DB');
        throw new CustomError(404, "Room Doesn't Exist!");
      }

      //Check if user is part of the room he is trying to send message to
      if (!this.users.get(userId)?.rooms.includes(roomId)) {
        console.error(`User ${userId} does not have ${roomId} in rooms array`);
        throw new CustomError(401, "User is not part of the room!");
      }

      // Now, before broadcasting message in room save in DB
      //TODO: Add queuing logic to reduce latency for broadcasting messages
      this.queue.push({ userId, roomId, message });
      //Broadcast message to each user in room
      this.users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: TypeFieldEnums.CHAT,
              message,
              roomId,
            })
          );
        }
      });
    } catch (error) {
      console.error(`Error Occured while sending message:\n ${error}`);
      throw new CustomError(500, `Error Occurred while sending message!`);
    }
  }

  public removeUser(userId: string) {
    return this.users.delete(userId);
  }
}
