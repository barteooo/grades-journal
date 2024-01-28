import { io } from "socket.io-client";
import config from "./config";

const socket = io(config.SOCKET_ADDRESS, {});

export default socket;
