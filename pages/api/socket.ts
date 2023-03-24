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

const messages: {
  account: string;
  channel: number;
  text: string;
}[] = [];

const SocketHandler = (
  req: NextApiRequest,
  res: NextApiResponseWithSocket<Data>
) => {
  if (res.socket.server.io) {
    console.log(`Already running!`);
  } else {
    const io = new IOServer(res.socket.server, { path: "/dappcord/socket.io" });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("get-messages", (msg) => {
        socket.emit("messages", messages);
      });

      socket.on("new-message", (msg) => {
        messages.push(msg);

        io.emit("messages-update");
      });
    });
  }

  res.end();
};

export default SocketHandler;
