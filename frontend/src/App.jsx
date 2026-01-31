import { useState } from "react";
import { ethers } from "ethers";
import logo from "./logo.jpg"; // Add your logo file in src/logo.png

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const bal = await provider.getBalance(address);
      const net = await provider.getNetwork();

      setAccount(address);
      setBalance(ethers.formatEther(bal));
      setNetwork(net.name);
    } catch (error) {
      console.error(error);
      alert("Failed to connect wallet");
    }
  }

  async function sendETH() {
    if (!to || !amount) {
      alert("Please enter recipient and amount");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      alert("Transaction sent!\nHash: " + tx.hash);
      setTo("");
      setAmount("");
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    }
  }

  // Auto-refresh on network change
  if (window.ethereum) {
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#E5E7EB",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#020617",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          boxShadow: "0 0 25px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header with Logo */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={logo}
            alt="BARON CRYPTOS"
            style={{ width: "100px", marginBottom: "10px" }}
          />
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
            BARON CRYPTOS
          </h2>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>
            Web3 Wallet Dashboard
          </p>
        </div>

        {/* Wallet connection */}
        {!account ? (
          <button
            onClick={connectWallet}
            style={{
              width: "100%",
              padding: "12px",
              background: "#6366F1",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <p>
              <strong>Address:</strong>
            </p>
            <p
              style={{
                fontSize: "12px",
                wordBreak: "break-all",
                marginBottom: "10px",
              }}
            >
              {account}
            </p>

            <p>
              <strong>Balance:</strong>{" "}
              {balance ? Number(balance).toFixed(4) : "0"} ETH
            </p>
            <p style={{ marginBottom: "15px" }}>
              <strong>Network:</strong> {network}
            </p>

            <hr style={{ margin: "15px 0" }} />

            {/* Send ETH Section */}
            <input
              placeholder="Recipient address"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "1px solid #333",
                background: "#1f2937",
                color: "#E5E7EB",
              }}
            />
            <input
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "1px solid #333",
                background: "#1f2937",
                color: "#E5E7EB",
              }}
            />
            <button
              onClick={sendETH}
              style={{
                width: "100%",
                padding: "10px",
                background: "#22C55E",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Send ETH
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
