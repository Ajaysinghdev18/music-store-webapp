import { ThemeProvider } from '@chakra-ui/core';
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import React, { FC, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { Splash } from './components/Splash';
import { REACT_APP_LANG_KEY } from './constants';
import { StorageHelper } from './helpers';
import i18n from './i18n';
import AppRoutes from './routes';
import { store, persistor } from './store';
import { WalletServiceProvider } from './utils/wallet-service';
import { PersistGate } from 'redux-persist/integration/react';


const App: FC = () => {
  const [visiblePage, setVisiblePage] = useState(false);

  useEffect(
    () => {
      setTimeout(() => setVisiblePage(true), 4000);
      i18n.changeLanguage(StorageHelper.getItem(REACT_APP_LANG_KEY));
    },
    []
  );

  const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
    return new Web3Provider(provider);
  };

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <Web3ReactProvider getLibrary={getLibrary}>
          <WalletServiceProvider>
            <ThemeProvider>{visiblePage ? <AppRoutes /> : <Splash />}</ThemeProvider>
          </WalletServiceProvider>
        </Web3ReactProvider>
      {/* </PersistGate> */}
    </Provider>
  );
};

export default App;
