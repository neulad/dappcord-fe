import person from "../public/person.svg";
import send from "../public/send.svg";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { FormEvent, useEffect, useState } from "react";
import Img from "next/image";
import { Channel } from "@/pages";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

interface MessagesProps {
  messages: {
    account: string;
    channel: number;
    text: string;
  }[];
  account: string;
  setMessages: any;
  currentChannel: Channel | undefined;
}

const Messages = ({
  messages,
  account,
  setMessages,
  currentChannel,
}: MessagesProps) => {
  const [message, setMessage] = useState("");

  const socketInitializer = async () => {
    await fetch("/dappcord/api/socket");
    socket = io({
      path: "/dappcord/socket.io",
    });

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.emit("get-messages", "");

    socket.on(
      "messages",
      (messages: { channel: number; account: string; text: string }[]) => {
        console.log(messages);
        setMessages(messages);
      }
    );

    socket.on("messages-update", () => {
      socket.emit("get-messages");
    });

    return () => {
      socket.off("messages-update");
      socket.off("connect");
    };
  };
  useEffect(() => {
    socketInitializer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentChannel || message.length == 0) return;

    const msgObj = {
      channel: currentChannel.id.toString(),
      account,
      text: message,
    };

    setMessage("");
    socket.emit("new-message", msgObj);
  };

  return (
    <div className="text">
      <div className="messages">
        {messages
          .filter((message) => {
            return message.channel.toString() === currentChannel?.id.toString();
          })
          .map((message, index) => (
            <div className="message" key={index}>
              <Img src={person} alt="Person" />
              <div className="message_content">
                <h3>
                  {message.account.slice(0, 6) +
                    "..." +
                    message.account.slice(38, 42)}
                </h3>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          onChange={(e) => {
            e.preventDefault();
            setMessage(e.target.value);
          }}
          placeholder="Start your conversation..."
          value={message}
          disabled={!account || !currentChannel}
        ></input>

        <button type="submit" disabled={!account || !currentChannel}>
          <Img src={send} alt="Send Message" />
        </button>
      </form>
    </div>
  );
};

export default Messages;
