import {createThirdwebClient} from "thirdweb";
import {createWallet, inAppWallet, walletConnect} from "thirdweb/wallets";
import Cookies from 'js-cookie'
import { getGeoIP  } from "./geoIP";

/**
 * Call this whenever you want to log the user out.
 */
export const clearThirdWebAuthTokens = () => {
  // remove thirdweb auth tokens
  const thirdwebRegex =
    /^thirdweb|walletToken-|lastAuthProvider|^a-[a-f0-9-]{36}$/;
  Object.keys(localStorage).forEach((key) => {
    if (thirdwebRegex.test(key)) {
      localStorage.removeItem(key);
    }
  });

    // remove user auth token
    localStorage.removeItem('user')
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("oldSubTotal");

    Cookies.remove('accessToken');
    localStorage.removeItem('userInfo')
    localStorage.removeItem('bypassthirdweb')
    getGeoIP()
};

export const client = createThirdwebClient({
  clientId: "a3f69624654c96d9feed95ac0bb3d1e5",
});

export const wallets = [
  createWallet("com.binance"),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  walletConnect(),
  inAppWallet({
    hidePrivateKeyExport: false,
    auth: {
      options: ["email", "google", "apple", "facebook"],
    },
  }),
  createWallet("com.trustwallet.app"),
  createWallet("io.zerion.wallet"),
  createWallet("me.rainbow"),
  createWallet("app.phantom"),
];
