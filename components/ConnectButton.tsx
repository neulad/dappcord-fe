import { useEffect, useRef } from "react";
import { Maybe } from "@metamask/providers/dist/utils";

interface ConnectButtonProps {
  setAccount: any;
  account: string;
}

const ConnectButton = ({ setAccount, account }: ConnectButtonProps) => {
  const accountChangeCount = useRef(0);

  useEffect(() => {
    if (!window.ethereum) return;

    const listener = () => {
      accountChangeCount.current += 1;
      if (accountChangeCount.current < 2) {
        return;
      }

      window.location.reload();
    };
    window.ethereum.on("accountsChanged", listener);

    return () => {
      if (!window.ethereum) return;
      window.ethereum.removeListener("accountsChanged", listener);
    };
  }, []);

  const connectHandler = async () => {
    if (!window.ethereum) return;

    window.ethereum
      .request<string[]>({ method: "eth_requestAccounts" })
      .then((accounts: Maybe<string[]>) => {
        setAccount(accounts ? accounts[0] : "");
      })
      .catch((err: Error) => {
        console.error(err.message);
      });
  };

  if (account) {
    return (
      <button className="nav__connect">
        {account.slice(0, 6) + "..." + account.slice(38, 42)}{" "}
      </button>
    );
  }

  return (
    <button className="nav__connect" onClick={connectHandler}>
      Connect
    </button>
  );
};

export default ConnectButton;
