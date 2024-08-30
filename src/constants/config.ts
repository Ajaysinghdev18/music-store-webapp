import WalletConnect from '@walletconnect/web3-provider';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import Web3Modal from 'web3modal';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN || 'access-token';

export const API_SERVER = process.env.REACT_APP_API_SERVER;
export const REACT_APP_API_ASSET_SERVER =
  process.env.REACT_APP_API_ASSET_SERVER || 'https://music-store-staging.s3.amazonaws.com';
export const REACT_APP_ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;
export const REACT_APP_LANG_KEY = process.env.REACT_APP_LANG_KEY || 'music-store-lang';
export const METAMASK_FAQS_URL = 'https://metamask.io/faqs.html';

//.env variables
export const termsOfService = '/mod-marketplace-terms-of-service.pdf';
export const privacyPolicy = `${process.env.NEXT_PUBLIC_SITE_URL}/assets/privacy-policy-MinesofDalarnia.pdf`;
export const codeOfProduct = `${process.env.NEXT_PUBLIC_SITE_URL}/assets/code-of-conduct-MinesofDalarnia.pdf`;

//config for web3react (metamask, walletConnect)
const providerOptions = {
  walletConnect: {
    package: WalletConnect
  }
};
const supportedNetworks = '1,3,56,97,43113,43114';
export const injected = new InjectedConnector({
  supportedChainIds: supportedNetworks.split(',').map(Number)
});
export const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions
});
export const supportedWallets = {
  METAMASK: {
    connector: injected
  }
};
export const walletConnect = new WalletConnectConnector({
  rpc: {
    56: 'https://bsc-dataseed.binance.org/',
    97: 'https://bsc-testnet.public.blastapi.io'
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
});

export const ROUTES = {
  HOME: '/',
  PROFILE: {
    PREFIX: '/profile',
    INDEX: '/profile/:tab',
    DASHBOARD: '/profile/dashboard',
    LIKED_PRODUCTS: '/profile/liked-products',
    SUBSCRIBED_ARTIST: '/profile/subscribed-artist',
    WALLET: {
      LIST: '/profile/wallet',
      DETAIL: '/profile/wallet/:id'
    },
    SETTINGS: '/profile/settings',
    PAYMENT_METHODS: '/profile/payment-methods',
    WHEEL: '/profile/wheel'
  },
  AUCTION: {
    INDEX: '/auction',
    DETAIL: '/auction/:id'
  },
  SHOP: {
    PREFIX: '/shop',
    INDEX: '/shop',
    DETAIL: '/shop/:id'
  },
  VENUES: {
    PREFIX: '/venues',
    INDEX: '/venues',
    DETAIL: '/venues/:id'
  },
  IMAGES: {
    PREFIX: '/images',
    INDEX: '/images',
    DETAIL: '/images/:id'
  },
  OBJECTS: {
    PREFIX: '/objects',
    INDEX: '/objects',
    DETAIL: '/objects/:id'
  },
  VIDEOS: {
    PREFIX: '/videos',
    INDEX: '/videos',
    DETAIL: '/videos/:id'
  },
  MERCHANDISE: {
    PREFIX: '/merchandise',
    INDEX: '/merchandise',
    DETAIL: '/merchandise/:id'
  },
  SONGS: {
    PREFIX: '/songs',
    INDEX: '/songs',
    DETAIL: '/songs/:id'
  },
  PRODUCTS: {
    // INDEX: '/products',
    PREFIX: '/products',
    DETAIL: '/products/:id',
    BY_CATEGORY: '/products'
  },
  EVENTS: {
    PREFIX: '/events',
    INDEX: '/events',
    DETAIL: '/events/:id'
  },
  CATEGORY: '/category',
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_COMPLETED: '/checkout/thankyou',
  CHECKOUT_THANKYOU: '/checkout/thankyou',
  SEARCH_RESULT: '/search-result',
  US: '/us',
  AUTH: {
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    FORGOTPASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY: '/verify',
    CONFIRM_EMAIL: '/confirm-email'
  },
  CRYPTO: {
    DEPOSIT: '/crypto-deposit',
    WITHDRAW: '/crypto-withdraw'
  },
  ORDERS: {
    PREFIX: '/orders',
    DETAIL: '/orders/:id',
    NFTDETAIL: '/orders/:id/nft/:tx'
  },
  PRIVACY_STATEMENT: '/privacy-statement',
  TERMS_CONDITIONS: '/terms-conditions',
  HELP_CENTER: {
    INDEX: '/help-center',
    PREFIX: '/help-center',
    FAQ: {
      INDEX: '/faq',
      GROUP: '/faq/:group',
      DETAIL: '/faq/:group/:question'
    },
    TICKETS: {
      INDEX: '/tickets',
      FORM: '/tickets/submit',
      EDIT: '/tickets/submit/:id'
    }
  },
  ARTICLE: {
    LIST: '/articles',
    DETAIL: '/articles/:id'
  },
  PAGES: {
    LIST: '/pages',
    DETAIL: '/pages/:id'
  },
  ARTIST: {
    LIST: '/artists',
    DETAIL: '/artists/:id',
    GALLERY_DETAIL: '/artists/:id/gallery/:galleryId/detail'
  },
  KYC: {
    INDEX: '/kyc',
    VERIFY: '/kyc/verify',
    CONFIRM: '/kyc/confirm',
    EMAIL_CHANGE: '/kyc/email_change',
    ADDRESS_CHANGE: '/kyc/address_change'
  }
};
