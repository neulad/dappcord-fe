import ethereum from "../public/ethereum.svg";
import plus from "../public/plus.svg";
import Image from "next/image";
import { ethers } from "ethers";
import { useState } from "react";
import ChannelPopup from "./ChannelPopup";

interface ServerListProps {
  provider: ethers.providers.Web3Provider | undefined;
  dappcord: ethers.Contract;
}

const ServerList = ({ provider, dappcord }: ServerListProps) => {
  const [isPopupActive, setIsPopupActive] = useState(false);

  return (
    <div className="servers">
      <div className="server">
        <Image src={ethereum} alt="Ethereumm Logo" />
      </div>
      <div
        className="server"
        onClick={() => {
          setIsPopupActive(true);
        }}
      >
        <Image src={plus} alt="Add Server" />
      </div>
      {isPopupActive && (
        <ChannelPopup
          dappcord={dappcord}
          setIsPopupActive={setIsPopupActive}
          provider={provider}
        />
      )}
    </div>
  );
};

export default ServerList;
