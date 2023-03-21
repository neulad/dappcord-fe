import { ethers } from "ethers";
import { FormEvent, useState } from "react";

interface ChannelPopupProps {
  provider: ethers.providers.Web3Provider | undefined;
  setIsPopupActive: any;
  dappcord: ethers.Contract;
}

const ChannelPopup = ({
  provider,
  setIsPopupActive,
  dappcord,
}: ChannelPopupProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signer = provider?.getSigner();
    if (!signer || !/^[0-9]+$/.test(price)) return;

    const txRec = await dappcord.connect(signer).createChannel(name, price);
    txRec.wait(1).then(() => {
      window.location.reload();
    });
    setIsPopupActive(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-black rounded-lg"
    >
      <svg
        className="w-6 absolute right-4 top-4 opacity-40 cursor-pointer hover:opacity-90 ease-in transition"
        onClick={() => {
          setIsPopupActive(false);
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="31.92 28.03 69.68 68.8"
      >
        <line
          x1="33.9248"
          y1="94.8199"
          x2="98.4348"
          y2="30.3099"
          stroke="orange"
          stroke-width="3"
          stroke-linecap="round"
          data-darkreader-inline-stroke=""
        ></line>
        <line
          x1="35.0675"
          y1="30.038"
          x2="99.5775"
          y2="94.548"
          stroke="orange"
          stroke-width="3"
          stroke-linecap="round"
          data-darkreader-inline-stroke=""
        ></line>
      </svg>
      <div>
        <label htmlFor="name" className="text-white block mb-2 mt-4">
          Name of the channel you want to create:
        </label>
        <input
          type="text"
          className="outline-none text-white border border-gray-600 focus:border-orange-500 caret-slate-200 bg-gray-600 rounded-sm p-1"
          id="name"
          onChange={(e: any) => {
            setName(e.target.value);
          }}
          value={name}
          placeholder="Minecraft gang"
        />
        <label htmlFor="price" className="text-white block mb-2 mt-4">
          Price to join the channel in wei
        </label>
        <input
          type="text"
          className="outline-none appearance-none border text-white border-gray-600 focus:border-orange-500 caret-slate-200 bg-gray-600 rounded-sm p-1"
          id="price"
          onChange={(e: any) => {
            setPrice(e.target.value);
          }}
          value={price}
          placeholder="3923"
        />
      </div>
      <button
        type="submit"
        className="text-white mt-4 p-2 bg-slate-500 rounded-lg"
      >
        Create channel
      </button>
    </form>
  );
};

export default ChannelPopup;
