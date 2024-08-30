import { CasperServiceByJsonRPC } from 'casper-js-sdk';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

let CasperWalletEventTypes: any;
type CasperWalletState = {
  isLocked: boolean;
  isConnected: boolean;
  activeKey: string | null;
};

let casperWalletInstance: any;
const getCasperWalletInstance = () => {
  try {
    if (casperWalletInstance == null) {
      if (typeof (window as any).CasperWalletProvider == 'function') {
        casperWalletInstance = (window as any).CasperWalletProvider();
      } else {
        casperWalletInstance = undefined;
      }
    }
    return casperWalletInstance;
  } catch (err) {
    console.log("🚀 ~ file: wallet-service.tsx:25 ~ getCasperWalletInstance ~ err:", err)
  }
};

const WALLET_STORAGE_KEY = 'cspr-wallet-sync';
type WalletStorageState = {
  publicKey: string | null;
};

const GRPC_URL = 'http://3.136.227.9:7777/rpc';
export let casperService = new CasperServiceByJsonRPC(GRPC_URL);

type WalletService = {
  activePublicKey: string | null;
  connect: () => Promise<boolean>;
  switchAccount: () => Promise<boolean>;
  sign: (
    deployJson: string,
    accountPublicKey: string
  ) => Promise<
    { cancelled: true } | { cancelled: false; signature: Uint8Array }
  >;
  signMessage: (
    message: string,
    accountPublicKey: string
  ) => Promise<
    { cancelled: true } | { cancelled: false; signature: Uint8Array }
  >;
  disconnect: () => Promise<boolean>;
  isConnected: () => Promise<boolean>;
  getActivePublicKey: () => Promise<string | undefined>;
};




export const walletServiceContext = createContext<WalletService>({} as any);

const { Provider: WalletServiceContextProvider } = walletServiceContext;

export const useWalletService = () => {
  return useContext(walletServiceContext);
};

export const WalletServiceProvider = (props: any) => {
  // const [logs, setLogs] = useState<[string, object][]>([]);
  // const log = (msg: string, payload?: any) =>
  //   setLogs(state => [[msg, payload], ...state]);

  const [counter, setCounter] = useState(0);
  const [extensionLoaded, setExtensionLoaded] = useState(false);

  useEffect(() => {
    let timer: any;
    if ((window as any).CasperWalletEventTypes != null) {
      CasperWalletEventTypes = (window as any).CasperWalletEventTypes;
      setExtensionLoaded(true);
      clearTimeout(timer);
    } else {
      timer = setTimeout(() => {
        setCounter(i => (i = 1));
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [counter]);

  const [activePublicKey, _setActivePublicKey] = useState<null | string>(() => {
    const state: WalletStorageState | null = JSON.parse(
      localStorage.getItem(WALLET_STORAGE_KEY) || 'null'
    );
    return state?.publicKey || null;
  });

  const setActivePublicKey = useCallback((key: string | null) => {
    _setActivePublicKey(key);
    localStorage.setItem(
      WALLET_STORAGE_KEY,
      JSON.stringify({
        publicKey: key
      } as WalletStorageState)
    );
  }, []);

  // WALLET SUBSCRIPTIONS
  useEffect(() => {
    if (extensionLoaded === false) {
      return;
    }

    const handleConnected = (event: any) => {
      console.log('event:connected', event.detail);
      try {
        const action: CasperWalletState = JSON.parse(event.detail);
        if (action.activeKey) {
          setActivePublicKey(action.activeKey);
        }
      } catch (err) {
        handleError(err);
      }
    };

    const handleActiveKeyChanged = (event: any) => {
      console.log('event:activeKeyChanged', event.detail);
      try {
        const state: CasperWalletState = JSON.parse(event.detail);
        if (state.activeKey) {
          setActivePublicKey(state.activeKey);
        } else {
          setActivePublicKey(null);
        }
      } catch (err) {
        handleError(err);
      }
    };

    const handleDisconnected = (event: any) => {
      console.log('event:disconnected', event.detail);
      try {
        if (activePublicKey) {
          setActivePublicKey(null);
        }
      } catch (err) {
        handleError(err);
      }
    };

    const handleTabChanged = (event: any) => {
      console.log('event:tabChanged', event.detail);
      try {
        const action: CasperWalletState = JSON.parse(event.detail);
        if (action.activeKey) {
          setActivePublicKey(action.activeKey);
        } else {
          setActivePublicKey(null);
        }
      } catch (err) {
        handleError(err);
      }
    };

    const handleLocked = (event: any) => {
      console.log('event:locked', event.detail);
      try {
        // const action: WalletState = JSON.parse(msg.detail);
        // TODO: diplay locked label
      } catch (err) {
        handleError(err);
      }
    };

    const handleUnlocked = (event: any) => {
      console.log('event:unlocked', event.detail);
      try {
        const action: CasperWalletState = JSON.parse(event.detail);
        if (action.activeKey) {
          setActivePublicKey(action.activeKey);
        } else {
          setActivePublicKey(null);
        }
      } catch (err) {
        handleError(err);
      }
    };

    // subscribe to signer events
    window.addEventListener(CasperWalletEventTypes.Connected, handleConnected);
    window.addEventListener(
      CasperWalletEventTypes.ActiveKeyChanged,
      handleActiveKeyChanged
    );
    window.addEventListener(
      CasperWalletEventTypes.Disconnected,
      handleDisconnected
    );
    window.addEventListener(
      CasperWalletEventTypes.TabChanged,
      handleTabChanged
    );
    window.addEventListener(CasperWalletEventTypes.Locked, handleLocked);
    window.addEventListener(CasperWalletEventTypes.Unlocked, handleUnlocked);

    return () => {
      window.removeEventListener(
        CasperWalletEventTypes.Connected,
        handleConnected
      );
      window.removeEventListener(
        CasperWalletEventTypes.ActiveKeyChanged,
        handleActiveKeyChanged
      );
      window.removeEventListener(
        CasperWalletEventTypes.Disconnected,
        handleDisconnected
      );
      window.removeEventListener(
        CasperWalletEventTypes.TabChanged,
        handleTabChanged
      );
      window.removeEventListener(CasperWalletEventTypes.Locked, handleLocked);
      window.removeEventListener(
        CasperWalletEventTypes.Unlocked,
        handleUnlocked
      );
    };
  }, [activePublicKey, setActivePublicKey, extensionLoaded]);

  const connect = async () => {
    try {
      const instance = await getCasperWalletInstance();
      if (instance) {
        return instance.requestConnection();
      } else {
        return undefined;
      }
    } catch (error) {
      console.log("🚀 ~ file: wallet-service.tsx:243 ~ connect ~ error:", error)
      return error;

    }
  };

  const switchAccount = () => {
    return getCasperWalletInstance()
      .requestSwitchAccount()
      .then((res: any) => console.log(`Switch response: ${res}`));
  };

  const sign = async (deployJson: string, accountPublicKey: string) => {
    return getCasperWalletInstance().sign(deployJson, accountPublicKey);
  };

  const signMessage = async (message: string, accountPublicKey: string) => {
    return getCasperWalletInstance().signMessage(message, accountPublicKey);
  };

  const disconnect = () => {
    setActivePublicKey(null);
    return getCasperWalletInstance()
      .disconnectFromSite()
      .then((res: any) => console.log(`Disconnected response: ${res}`));
  };

  const isConnected = async () => {
    return getCasperWalletInstance().isConnected();
  };

  const getActivePublicKey = async () => {
    return getCasperWalletInstance().getActivePublicKey();
  };

  const contextProps: WalletService = {
    activePublicKey: activePublicKey,
    connect: connect,
    switchAccount: switchAccount,
    sign: sign,
    signMessage: signMessage,
    disconnect: disconnect,
    isConnected: isConnected,
    getActivePublicKey: getActivePublicKey,
  };

  return <WalletServiceContextProvider value={contextProps} {...props} />;
};

function handleError(err: any) {
  console.log(err);
}
