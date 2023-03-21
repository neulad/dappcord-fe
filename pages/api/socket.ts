import { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket<T> extends NextApiResponse<T> {
  socket: SocketWithIO;
}

type Data = {
  name: string;
};

const messages = [
  {
    channel: 0,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
  {
    channel: 1,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
  {
    channel: 0,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
  {
    channel: 1,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
  {
    channel: 0,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
  {
    channel: 1,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
  {
    channel: 0,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
  {
    channel: 1,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
  {
    channel: 0,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    text: "Hello everyone",
  },
];

const SocketHandler = (
  req: NextApiRequest,
  res: NextApiResponseWithSocket<Data>
) => {
  if (res.socket.server.io) {
    console.log(`Already running!`);
  } else {
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("get-messages", (msg) => {
        socket.emit("messages", messages);
      });

      socket.on("new-message", (msg) => {
        messages.push(msg);

        socket.broadcast.emit("messages-update");
      });
    });
  }

  res.end();
};

export default SocketHandler;
