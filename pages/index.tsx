import Navigation from "@/components/Navigation";
import { ethers } from "ethers";
import getConfig from "next/config";
import { useEffect, useState } from "react";
import ServerList from "@/components/ServerList";
import Channels from "@/components/Channels";

import Messages from "@/components/Messages";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type Channel = {
  id: number;
  name: string;
  owner: string;
  price: number;
  balance: number;
};

export default function Home() {
  const { publicRuntimeConfig } = getConfig();
  const [account, setAccount] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel>();
  const [dappcord, setDappcord] = useState<ethers.Contract>();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [compatible, setCompatible] = useState(false);
  const [messages, setMessages] = useState<
    { channel: number; account: string; text: string }[]
  >([]);

  const loadData = async () => {
    if (!window.ethereum || !window.ethereum.request) {
      return setCompatible(false);
    }
    setCompatible(true);

    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as import("ethers").providers.ExternalProvider
    );

    const chainId = await window.ethereum.request<number>({
      method: "eth_chainId",
    });
    if (!chainId) {
      return;
    }

    console.log(chainId);
    const dappcord = new ethers.Contract(
      publicRuntimeConfig.contracts.addresses[chainId].Dappcord.address,
      publicRuntimeConfig.contracts.Dappcord.abi,
      provider
    );

    const channelsNumber = await dappcord.getChannelsNumber();

    const channels = [];
    for (let i = 0; i < channelsNumber; i++) {
      const channel: Channel = await dappcord.getChannel(i);
      channels.push(channel);
    }

    setChannels(channels);
    setDappcord(dappcord);
    setProvider(provider);
  };

  useEffect(() => {
    if (publicRuntimeConfig.contracts) {
      loadData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicRuntimeConfig, account]);

  if (!compatible) {
    return <div>Not Compatible browser. Install Metamask to proceed!</div>;
  }

  return (
    <>
      <Navigation setAccount={setAccount} account={account} />
      <main>
        <ServerList dappcord={dappcord} provider={provider} />
        <Channels
          provider={provider}
          account={account}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
          dappcord={dappcord}
          channels={channels}
        />
        <Messages
          messages={messages}
          account={account}
          setMessages={setMessages}
          currentChannel={currentChannel}
        />
      </main>
    </>
  );
}
