import axios from "axios";
import config from "./config.js";

export const api = axios.create({
  baseURL: config.websocket.SERVER_URL,
  mode: "no-cors",
  cache: "no-cache",
  headers: {
    "Content-Type": "application/json",
  },
});
