import { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";

interface NavigationProps {
  setAccount: any;
  account: string;
}

const Navigation = ({ setAccount, account }: NavigationProps) => {
  return (
    <nav>
      <div className="nav__brand">
        <h1 className="">Dappcord</h1>
      </div>
      <ConnectButton account={account} setAccount={setAccount} />
    </nav>
  );
};

export default Navigation;
