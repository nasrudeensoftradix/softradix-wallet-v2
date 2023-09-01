import { useState } from "react";
import { ethers } from "ethers";

export default function GenerateWallet() {
  const [wallet, setwallet] = useState({
    walletAddress: "",
    privateKey: "",
    mnemonic: "",
  });
  const [importAddress, setimportAddress] = useState({
    isShow: false,
    mnemonic: "",
  });

  const createWallet = async (e) => {
    // Generate a random mnemonic

    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    const node = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const path = "m/44'/60'/0'/0/" + 0; // last value we can use for second or more wallet with the same mnemonic key
    const wallet = node.derivePath(path);
    setwallet({
      walletAddress: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic,
    });
  };

  //import existing wallet
  const importWallet = async (e) => {
    e.preventDefault();
    try {
      if (!importAddress?.mnemonic) return alert("Mnemonic keys required");
      const node = ethers.utils.HDNode.fromMnemonic(importAddress?.mnemonic);
      const path = "m/44'/60'/0'/0/" + 0; // last value we can use for second or more wallet with the same mnemonic key
      const wallet = node.derivePath(path);
      setwallet({
        walletAddress: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: importAddress?.mnemonic,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="card">
        <h1>Softradix Wallet</h1>
        <div className="wrapper">
          {!importAddress?.isShow ? (
            <div>
              <button className="btn_" onClick={createWallet}>
                Get wallet
              </button>
              <button
                className="btn_2"
                onClick={() => setimportAddress({ isShow: true, address: "" })}
              >
                Import wallet
              </button>
            </div>
          ) : (
            <form onSubmit={importWallet}>
              <div className="">
                <input
                  type="text"
                  placeholder="Enter your mnemonic keys"
                  onChange={(e) =>
                    setimportAddress((prev) => ({
                      ...prev,
                      mnemonic: e.target.value,
                    }))
                  }
                />
                <button className="btn_2">Import</button>
              </div>
            </form>
          )}
        </div>
        <div id="customers" className={wallet?.walletAddress ? "wallet" : ""}>
          <p className="p1">
            <b>Wallet Address: </b>
            {wallet?.walletAddress}
          </p>
          <p className="p2">
            <b>Private key: </b>
            {wallet?.privateKey}
          </p>
          <p className="p3">
            <b>Mnemonic: </b>
            {wallet?.mnemonic}
          </p>
        </div>{" "}
      </div>
    </>
  );
}
