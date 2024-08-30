// Dependencies
import { FC } from 'react';

// Pages
import {
  ArticleDetailPage,
  ArticleListPage,
  ArtistDetailPage,
  ArtistListPage,
  CartPage,
  CategoryPage,
  CheckoutPage,
  DepositPage,
  EventsPage,
  FAQDetailPage,
  FAQGroupPage,
  FAQPage,
  ForgotPassword,
  GalleryDetailPage,
  HelpCenterPage,
  ImagesPage,
  MerchandisePage,
  ObjectsPage,
  OrderDetailPage,
  PrivacyStatementPage,
  ProfilePage,
  ResetPassword,
  SearchResultPage,
  ShopPage,
  SignInPage,
  SignUpPage,
  SongPage,
  TermsConditionsPage,
  TicketFormPage,
  TicketListPage,
  UsPage,
  VideosPage,
  WalletDetailPage,
  WithdrawPage,
} from '../pages';
import { ConfirmEmailPage } from '../pages/Auth/SignUp/ConfirmEmail';
import { Verify } from '../pages/Auth/Verify';
import { OrderNftDetailPage } from '../pages/OrderDetail/NftDetail';
// Routes
import { ROUTES } from './config';
import KYCPage from '../pages/KYC';
import KYCVerificationPage from '../pages/KYC/KYCVerificationPage';
import KYCVerificationConfirmPage from '../pages/KYC/KYCVerificationConfirmPage';
import KYCEmailChangePage from '../pages/KYC/KYCEmailChangePage';
import KYCAddressChangePage from '../pages/KYC/KYCAddressChangePage';
import { HomePage } from '../pages/Home';
import { PageListScreen } from '../pages/Page';
import { PageDetailScreen } from '../pages/Page/PageDetails';
import { ThankyouPage } from '../pages/Checkout/Thankyou';
import { Venues } from '../pages/Venues';
import { VenuesDetailPage } from '../pages/Venues/VenuesDetailPage';
// Interface
export interface IRoute {
  id: string;
  name: string;
  path: string;
  component: any;
  children?: IRoute[] | null;
  guard?: FC;
}

export const AUTH_ROUTES: IRoute[] = [
  {
    id: 'SignIn',
    name: 'SignIn',
    path: ROUTES.AUTH.SIGN_IN,
    component: SignInPage,
    children: null
  },
  {
    id: 'SignUp',
    name: 'SignUp',
    path: ROUTES.AUTH.SIGN_UP,
    component: SignUpPage,
    children: null
  },
  {
    id: 'ForgotPassword',
    name: 'ForgotPassword',
    path: ROUTES.AUTH.FORGOTPASSWORD,
    component: ForgotPassword
  },
  {
    id: 'ConfirmEmail',
    name: 'ConfirmEmail',
    path: ROUTES.AUTH.CONFIRM_EMAIL,
    component: ConfirmEmailPage
  },
  {
    id: 'ResetPassword',
    name: 'ResetPassword',
    path: ROUTES.AUTH.RESET_PASSWORD,
    component: ResetPassword
  },
  {
    id: 'Verify',
    name: 'Verify',
    path: ROUTES.AUTH.VERIFY,
    component: Verify
  }
];

export const MAIN_ROUTES: IRoute[] = [
  {
    id: 'Home',
    name: 'Home',
    path: ROUTES.HOME,
    component: HomePage,
    children: null
  },
  {
    id: 'Venues',
    name: 'Venues',
    path: ROUTES.VENUES.INDEX,
    component: Venues,
    children: null
  },
  {
    id: 'VenuesDetail',
    name: 'VenuesDetail',
    path: ROUTES.VENUES.DETAIL,
    component: VenuesDetailPage,
    children: null
  },  
  {
    id: 'Shop',
    name: 'Shop',
    path: ROUTES.SHOP.INDEX,
    component: ShopPage,
    children: null
  },
  {
    id: 'thankyou',
    name: 'thankyou',
    path: ROUTES.CHECKOUT_COMPLETED,
    component: ThankyouPage,
    children: null
  },
  {
    id: 'ProductsByCategory',
    name: 'ProductsByCategory',
    path: ROUTES.PRODUCTS.BY_CATEGORY,
    component: ShopPage,
    children: null
  },
  {
    id: 'events',
    name: 'Events',
    path: ROUTES.EVENTS.INDEX,
    component: ShopPage
  },
  {
    id: 'images',
    name: 'Images',
    path: ROUTES.IMAGES.INDEX,
    component: ShopPage
  },
  {
    id: 'objects',
    name: 'Objects',
    path: ROUTES.OBJECTS.INDEX,
    component: ShopPage
  },
  {
    id: 'videos',
    name: 'Videos',
    path: ROUTES.VIDEOS.INDEX,
    component: ShopPage
  },
  {
    id: 'merchandise',
    name: 'Merchandise',
    path: ROUTES.MERCHANDISE.INDEX,
    component: ShopPage
  },
  {
    id: 'merchandise-detail',
    name: 'merchandise Detail',
    path: ROUTES.MERCHANDISE.DETAIL,
    component: MerchandisePage
  },
  {
    id: 'Songs',
    name: 'Songs',
    path: ROUTES.SONGS.INDEX,
    component: ShopPage,
    children: null
  },
  {
    id: 'object-detail',
    name: 'Object Detail',
    path: ROUTES.OBJECTS.DETAIL,
    component: ObjectsPage
  },
  {
    id: 'song-detail',
    name: 'Song Detail',
    path: ROUTES.SONGS.DETAIL,
    component: SongPage
  },
  {
    id: 'song-detail',
    name: 'Song Detail',
    path: ROUTES.CHECKOUT_THANKYOU,
    component: ThankyouPage
  },
  {
    id: 'event-detail',
    name: 'Event Detail',
    path: ROUTES.EVENTS.DETAIL,
    component: EventsPage
  },
  {
    id: 'videos-detail',
    name: 'Video Detail',
    path: ROUTES.VIDEOS.DETAIL,
    component: VideosPage
  },
  {
    id: 'image-detail',
    name: 'Image Detail',
    path: ROUTES.IMAGES.DETAIL,
    component: ImagesPage
  },
  {
    id: 'Us',
    name: 'Us',
    path: ROUTES.US,
    component: UsPage
  },
  {
    id: 'Cart',
    name: 'Cart',
    path: ROUTES.CART,
    component: CartPage,
    children: null
  },
  {
    id: 'Category',
    name: 'Category',
    path: ROUTES.CATEGORY,
    component: CategoryPage,
    children: null
  },
  {
    id: 'Checkout',
    name: 'Checkout',
    path: ROUTES.CHECKOUT,
    component: CheckoutPage,
    children: null
  },
  {
    id: 'Profile',
    name: 'Profile',
    path: ROUTES.PROFILE.INDEX,
    component: ProfilePage,
    children: null
  },
  {
    id: 'SearchResult',
    name: 'SearchResult',
    path: ROUTES.SEARCH_RESULT,
    component: SearchResultPage
  },
  {
    id: 'DepositCrypto',
    name: 'DepositCrypto',
    path: ROUTES.CRYPTO.DEPOSIT,
    component: DepositPage
  },
  {
    id: 'WithdrawCrypto',
    name: 'WithdrawCrypto',
    path: ROUTES.CRYPTO.WITHDRAW,
    component: WithdrawPage
  },
  {
    id: 'OrderDetail',
    name: 'OrderDetail',
    path: ROUTES.ORDERS.DETAIL,
    component: OrderDetailPage
  },
  {
    id: 'OrderNftDetail',
    name: 'OrderNftDetail',
    path: ROUTES.ORDERS.NFTDETAIL,
    component: OrderNftDetailPage
  },
  {
    id: 'PrivacyStatement',
    name: 'PrivacyStatement',
    path: ROUTES.PRIVACY_STATEMENT,
    component: PrivacyStatementPage
  },
  {
    id: 'TermsConditions',
    name: 'TermsConditions',
    path: ROUTES.TERMS_CONDITIONS,
    component: TermsConditionsPage
  },
  {
    id: 'Articles',
    name: 'Articles',
    path: ROUTES.ARTICLE.LIST,
    component: ArticleListPage
  },
  {
    id: 'Article Detail',
    name: 'Article Detail',
    path: ROUTES.ARTICLE.DETAIL,
    component: ArticleDetailPage
  },
  {
    id: 'Pages',
    name: 'Pages',
    path: ROUTES.PAGES.LIST,
    component: PageListScreen
  },
  {
    id: 'Page Detail',
    name: 'Page Detail',
    path: ROUTES.PAGES.DETAIL,
    component: PageDetailScreen
  },
  {
    id: 'Artists',
    name: 'Artists',
    path: ROUTES.ARTIST.LIST,
    component: ArtistListPage
  },
  {
    id: 'Artist Detail',
    name: 'Artist Detail',
    path: ROUTES.ARTIST.DETAIL,
    component: ArtistDetailPage
  },
  {
    id: 'Gallery Detail',
    name: 'Gallery Detail',
    path: ROUTES.ARTIST.GALLERY_DETAIL,
    component: GalleryDetailPage
  },
  {
    id: 'Wallet Detail',
    name: 'Wallet Detail',
    path: ROUTES.PROFILE.WALLET.DETAIL,
    component: WalletDetailPage
  },
  {
    id: 'KYC',
    name: 'KYC',
    path: ROUTES.KYC.INDEX,
    component: KYCPage
  },
  {
    id: 'ID Verification',
    name: 'ID Verification',
    path: ROUTES.KYC.VERIFY,
    component: KYCVerificationPage,
  },
  {
    id: 'ID Verification Confirm',
    name: 'ID Verification Confirm',
    path: ROUTES.KYC.CONFIRM,
    component: KYCVerificationConfirmPage
  },
  {
    id: 'Email Change',
    name: 'Email Change',
    path: ROUTES.KYC.EMAIL_CHANGE,
    component: KYCEmailChangePage
  },
  {
    id: 'Address Change',
    name: 'Address Change',
    path: ROUTES.KYC.ADDRESS_CHANGE,
    component: KYCAddressChangePage
  }
];

export const HELP_CENTER_ROUTES: IRoute[] = [
  {
    id: 'HelpCenter',
    name: 'HelpCenter',
    path: ROUTES.HELP_CENTER.INDEX,
    component: HelpCenterPage
  },
  {
    id: 'FAQ',
    name: 'FAQ',
    path: ROUTES.HELP_CENTER.FAQ.INDEX,
    component: FAQPage
  },
  {
    id: 'FAQGroup',
    name: 'FAQGroup',
    path: ROUTES.HELP_CENTER.FAQ.GROUP,
    component: FAQGroupPage
  },
  {
    id: 'FAQDetail',
    name: 'FAQDetail',
    path: ROUTES.HELP_CENTER.FAQ.DETAIL,
    component: FAQDetailPage
  },
  {
    id: 'TicketList',
    name: 'TicketList',
    path: ROUTES.HELP_CENTER.TICKETS.INDEX,
    component: TicketListPage
  },
  {
    id: 'TicketForm',
    name: 'TicketForm',
    path: ROUTES.HELP_CENTER.TICKETS.FORM,
    component: TicketFormPage
  },
  {
    id: 'TicketEdit',
    name: 'TicketEdit',
    path: ROUTES.HELP_CENTER.TICKETS.EDIT,
    component: TicketFormPage
  }
];
