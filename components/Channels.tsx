import { ethers, Signer } from "ethers";
import { useEffect, useRef, useState } from "react";
import { Channel } from "../pages/index";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface ChannelsProps {
  provider: ethers.providers.Web3Provider | undefined;
  account: string;
  dappcord: ethers.Contract | undefined;
  channels: any[];
  setCurrentChannel: any;
  currentChannel: Channel | undefined;
}

const Channels = ({
  provider,
  account,
  setCurrentChannel,
  dappcord,
  currentChannel,
  channels,
}: ChannelsProps) => {
  const userJoined = useRef(false);

  const channelHandler = async (channel: Channel) => {
    if (
      (userJoined.current &&
        currentChannel?.id.toString() === channel.id.toString()) ||
      !dappcord ||
      !account
    ) {
      return;
    }

    for (let i = 0; true; i++) {
      try {
        const userTokenId = await dappcord.tokenOfOwnerByIndex(account, i);
        const tokenJoined = await dappcord.getIfParticipant(
          channel.id,
          userTokenId
        );
        if (tokenJoined) {
          userJoined.current = true;
          setCurrentChannel(channel);
          break;
        }
      } catch (err) {
        const signer = provider?.getSigner();
        console.log("here");
        await dappcord
          .connect(signer as Signer)
          .mint(channel.id, { value: channel.price });
        break;
      }
    }
  };

  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

        <ul>
          {channels.map((channel, index) => (
            <li
              onClick={() => channelHandler(channel)}
              key={index}
              className={
                currentChannel?.id?.toString() === channel.id.toString()
                  ? "active"
                  : ""
              }
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Channels;
