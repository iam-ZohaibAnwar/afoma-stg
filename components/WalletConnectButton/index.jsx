import { ConnectButton } from "thirdweb/react";
import { client, wallets, clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
import { bsc } from "thirdweb/chains";

// Replace with your custom token details
const customToken = {
  address: "0x49578c57023f4ffe291de731306ba66ff4d77d98", // Your token's contract address
  name: "AFOMA", // Your token's name
  symbol: "OMA", // Your token's symbol
  icon: "https://afoma.io/images/Statement/Desktop%20-%20Mission%20Statement%20Token%20Logo.svg", // URL to your token's icon
};
function WalletConnectButton({ className, setConnectedWallet }) {
  return (
    <ConnectButton
      className={className}
      chain={bsc}
      supportedTokens={{
        [bsc.id]: [customToken], // Add your custom token here
      }}
      onConnect={async (t) => {
        setConnectedWallet(true);
      }}
      btnTitle="My Wallet"
      modalTitle="My Wallet"
      client={client}
      wallets={wallets}
      detailsButton={{
        className: className,
        style: {
          width: 0,
          height: 0,
          display: "none",
        },
      }}
      connectButton={{
        className: className,
        style: {
          width: 0,
          height: 0,
          display: "none",
        },
      }}
      switchButton={{
        className: className, // Custom class to hide the button
        style: {
          width: 0,
          height: 0,
          display: "none",
        }, // Inline style to ensure it's hidden
      }}
    />
  );
}

export default WalletConnectButton;
