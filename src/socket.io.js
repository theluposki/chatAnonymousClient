import { io } from "socket.io-client";
import config from "./config";

export const socket = io(config.websocket.SERVER_URL, {
  transports: ["websocket"],
});
