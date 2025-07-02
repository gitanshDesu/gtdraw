import WebSocket from "ws";
import http from "http";
import cookie from "cookie";
import { CustomError } from "@gtdraw/common/utils/CustomError";
import { prisma, User } from "@gtdraw/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@gtdraw/common/config";
import { ParsedDataType, parsedDataSchema } from "@gtdraw/common/ws";
import { UserManager } from "./UserManager";
import { TypeFieldEnums } from "@gtdraw/common/types/index";
export class SocketManager {
  private static instance: SocketManager;
  private ws: WebSocket;
  private request: http.IncomingMessage;
  private user: UserManager;
  private constructor(ws: WebSocket, request: http.IncomingMessage) {
    this.ws = ws;
    this.request = request;
    this.user = UserManager.getInstance();
    this.handleEmitMessage = this.handleEmitMessage.bind(this); // binds context of this to class when we pass reference to this.handleEmitMessage otherwise context of this gets lost and gets resets to global this when ws lib calls this.handleEmitMessage.
  }

  public static getInstance(
    ws: WebSocket,
    request: http.IncomingMessage
  ): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(ws, request);
      return SocketManager.instance;
    }
    return SocketManager.instance;
  }

  public async verifyCookies(): Promise<User | null> {
    try {
      const accessToken = cookie.parse(
        this.request.headers.cookie || ""
      ).accessToken;
      if (!accessToken) {
        console.error(
          "Cookies Are Required To Establish Web Socket Connection"
        );
        this.ws.close();
        throw new CustomError(401, "Unauthorized Request");
      }
      const decodedTokenInfo = jwt.verify(
        accessToken!,
        ACCESS_TOKEN_SECRET!
      ) as JwtPayload;
      if (!decodedTokenInfo || !decodedTokenInfo.id) {
        this.ws.close();
        console.error(
          "You have sent invalid access token in web socket connection"
        );
        throw new CustomError(401, "Invalid Access Token!");
      }
      const user = await prisma.user.findFirst({
        where: {
          id: decodedTokenInfo.id,
        },
      });
      if (!user) {
        this.ws.close();
        console.error(
          "id from Decoded Token can't be matched to any user in DB"
        );
        throw new CustomError(401, "Invalid Access Token!");
      }
      return user;
    } catch (error) {
      console.error(
        "Error Occurred while verifying JWT From Cookies:\n",
        error
      );
      throw new CustomError(500, "Error Occurred While Verifying JWT");
    }
  }

  public checkUser(token: string): string | null {
    try {
      const decodedToken = jwt.verify(
        token!,
        ACCESS_TOKEN_SECRET!
      ) as JwtPayload;
      if (!decodedToken || !decodedToken.id) {
        this.ws.close();
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
  }

  public emitMessage() {
    this.ws.on("message", this.handleEmitMessage);
  }

  public async handleEmitMessage(data: WebSocket.RawData) {
    let jsonString: string = "";
    if (Buffer.isBuffer(data)) {
      jsonString = data.toString("utf-8");
    } else if (data instanceof ArrayBuffer) {
      jsonString = new TextDecoder("utf-8").decode(data);
    } else if (Array.isArray(data)) {
      jsonString = Buffer.concat(data).toString("utf-8");
    }
    const raw: ParsedDataType = JSON.parse(jsonString);
    const validate = parsedDataSchema.safeParse(raw);
    if (!validate.success) {
      throw new CustomError(400, `Send Valid Input:\n ${validate.error}`);
    }
    const parsedData: ParsedDataType = validate.data;
    if (parsedData.type === TypeFieldEnums.JOIN) {
      const ws = this.ws;
      const userId = this.user.getUserId(ws);
      if (!userId) {
        console.error(`Got userId undefined from getUserId method`);
        return;
      }
      await this.user.joinRoom(userId, parsedData.roomId);
    }

    if (parsedData.type === TypeFieldEnums.LEAVE) {
      const userId = this.user.getUserId(this.ws);
      if (!userId) {
        console.error(`Got userId undefined from getUserId method`);
        return;
      }
      await this.user.leaveRoom(userId, parsedData.roomId);
    }

    if (parsedData.type === TypeFieldEnums.CHAT) {
      const userId = this.user.getUserId(this.ws);
      if (!userId) {
        console.error(`Got userId undefined from getUserId method`);
        return;
      }
      if (!parsedData.message) {
        throw new CustomError(400, "Message field required!");
      }
      await this.user.sendMessage(
        userId,
        parsedData.roomId,
        parsedData.message
      );
    }
  }

  public disconnect() {
    this.ws.on("close", () => {
      const userId = this.user.getUserId(this.ws);
      const isUserRemoved = this.user.removeUser(userId!);
      if (isUserRemoved) {
        console.log(`User Disconnected`);
        return;
      } else {
        console.log(`User doesn't exist while trying to disconnect`);
        return;
      }
    });
  }
}
