import { createBrowserRouter } from 'react-router-dom';

import DashboardHome from '../dashboard/DashboardHome/DashboardHome';
import Dashboard from '../pages/Dashboard';
import ErrorPage from '../pages/ErrorPage';
import LogIn from '../pages/LogIn';
import ForgotPassword from '../pages/ForgotPassword';
import MerchantCashIn from '../dashboard/MerchantCashIn/MerchantCashIn';
import MerchantPayout from '../dashboard/MerchantPayout/MerchantPayout';
import MerchantWithdraw from '../dashboard/MerchantWithdraw/MerchantWithdraw';
import Currency from '../dashboard/DashboardManagement/Currency';
import UploadApplication from '../dashboard/DashboardManagement/UploadApplication';
import DownlandPage from '../dashboard/DashboardManagement/DownlandPage';
import MerchantRequests from '../dashboard/MerchantRequests/MerchantRequests';
import Reports from '../dashboard/Reports/Reports';
import ReportsCashIn from '../dashboard/Reports/ReportsCashIn';
import ReportsPayOut from '../dashboard/Reports/ReportsPayOut';
import ReportsWithdraw from '../dashboard/Reports/ReportsWithdraw';
import ReportsRobotic from '../dashboard/Reports/ReportsRobotic';
import AllMerchant from '../dashboard/AllMerchant/AllMerchant';
import AllUser from '../dashboard/AllUser/AllUser';
import IpRequest from '../dashboard/Ip Request/IpRequest';
import AllPaymentMethod from '../dashboard/PaymentMethod/AllPaymentMethod';
import PayoutPaymentMethod from '../dashboard/PaymentMethod/PayoutPaymentMethod/PayoutPaymentMethod';
import ManualPayment from '../dashboard/PaymentMethod/ManualPayment/ManualPayment';
import DashboardEmail from '../dashboard/DashboardEmail/DashboardEmail';
import DashboardEmailAdd from '../dashboard/DashboardEmail/DashboardEmailAdd';
import DashboardEmailDetails from '../dashboard/DashboardEmail/DashboardEmailDetails';
import DashboardSupport from '../dashboard/DashboardSupport/DashboardSupport';
import SupportReply from '../dashboard/DashboardSupport/SupportReply';
import AllPost from '../dashboard/AllPost/AllPost';
import PostCategories from '../dashboard/PostCategories/PostCategories';
import Documentation from '../dashboard/Documentation/Documentation';
import DashboardPages from '../dashboard/DashboardPages/DashboardPages';
import DashboardReview from '../dashboard/DashboardReview/DashboardReview';
import BannerSlider from '../dashboard/Home/Banner Slider/BannerSlider';
import DashboardContact from '../dashboard/Home/ContactUs/DashboardContact';
import PaymentSupport from '../dashboard/PaymentSupport/PaymentSupport';
import Pricing from '../dashboard/Home/Pricing/Pricing';
import Whyus from '../dashboard/Home/WhyUs/Whyus';
import Faq from '../dashboard/Home/Faq/Faq';
import ApplicationSetting from '../dashboard/DashboardApplicationSetting/ApplicationSetting';
import ApplicationLogo from '../dashboard/DashboardApplicationSetting/ApplicationLogo';
import ApplicationHeader from '../dashboard/DashboardApplicationSetting/ApplicationHeader';
import ApplicationFooter from '../dashboard/DashboardApplicationSetting/ApplicationFooter';
import ApplicationColor from '../dashboard/DashboardApplicationSetting/ApplicationColor';
import ApplicationMail from '../dashboard/DashboardApplicationSetting/ApplicationMail';
import ApplicationProfile from '../dashboard/DashboardApplicationSetting/ApplicationProfile';
import PaymentSetting from '../dashboard/DashboardApplicationSetting/PaymentSetting';
import OthersSetting from '../dashboard/DashboardApplicationSetting/OthersSettings';
import CashInWallet from '../dashboard/Reports/CashInWallet/CashInWallet';
import PayOutSender from '../dashboard/Reports/PayOutSender/PayOutSender';
import RoleAssignment from '../dashboard/RoleAssignment/RoleAssignment';
import ActivityLog from '../dashboard/ActivityLog/ActivityLog';
import ReportsCashInManual from '../dashboard/Reports/ReportsCashInManual';
import CashInWalletManual from '../dashboard/Reports/CashInWalletManual/CashInWalletManual';
import RoboticDevice from '../dashboard/RoboticDevice/RoboticDevice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <DashboardHome />
      },
      {
        path: '/deposit',
        element: <MerchantCashIn />
      },
      {
        path: '/payout',
        element: <MerchantPayout />
      },
      {
        path: '/withdraw',
        element: <MerchantWithdraw />
      },
      {
        path: '/management/currency',
        element: <Currency />
      },
      {
        path: '/management/upload-app',
        element: <UploadApplication />
      },
      {
        path: '/management/download-app',
        element: <DownlandPage />
      },
      {
        path: '/merchant/request',
        element: <MerchantRequests />
      },
      {
        path: '/reports',
        element: <Reports />,
        children: [
          {
            path: '/reports',
            element: <ReportsCashIn />
          },
          {
            path: '/reports/manual',
            element: <ReportsCashInManual />
          },
          {
            path: '/reports/pay/out',
            element: <ReportsPayOut />
          },
          {
            path: '/reports/withdraw',
            element: <ReportsWithdraw />
          },
          {
            path: '/reports/robotic',
            element: <ReportsRobotic />
          },
          {
            path: '/reports/cash_in/wallet/auto',
            element: <CashInWallet />
          },
          {
            path: '/reports/cash_in/wallet/manual',
            element: <CashInWalletManual />
          },
          {
            path: '/reports/pay_out/sender',
            element: <PayOutSender />
          }
        ]
      },
      {
        path: '/all/merchant',
        element: <AllMerchant />
      },
      {
        path: '/merchant/all/user',
        element: <AllUser />
      },
      {
        path: '/merchant/ip-request',
        element: <IpRequest />
      },
      {
        path: '/payment/method',
        element: <AllPaymentMethod />
      },
      {
        path: '/payment/payout',
        element: <PayoutPaymentMethod />
      },
      {
        path: '/payment/manual',
        element: <ManualPayment />
      },
      {
        path: '/payment/robotic',
        element: <RoboticDevice />
      },
      {
        path: '/email',
        element: <DashboardEmail />
      },
      {
        path: '/email/add',
        element: <DashboardEmailAdd />
      },
      {
        path: '/email/details/:id',
        element: <DashboardEmailDetails />
      },
      {
        path: '/support',
        element: <DashboardSupport />
      },
      {
        path: '/support/:track_id',
        element: <SupportReply />
      },
      {
        path: '/news/all/post',
        element: <AllPost />
      },
      {
        path: '/news/post/categories',
        element: <PostCategories />
      },
      {
        path: '/news/documentation',
        element: <Documentation />
      },
      {
        path: '/pages',
        element: <DashboardPages />
      },
      {
        path: '/review',
        element: <DashboardReview />
      },
      {
        path: '/home/banner',
        element: <BannerSlider />
      },
      {
        path: '/home/contact',
        element: <DashboardContact />
      },
      {
        path: '/home/gateway',
        element: <PaymentSupport />
      },
      {
        path: '/home/pricing',
        element: <Pricing />
      },
      {
        path: '/home/whyus',
        element: <Whyus />
      },
      {
        path: '/home/faq',
        element: <Faq />
      },
      {
        path: '/role-assignment',
        element: <RoleAssignment />
      },
      {
        path: '/activity-log',
        element: <ActivityLog />
      },
      {
        path: '/application',
        element: <ApplicationSetting />,
        children: [
          {
            path: '/application',
            element: <ApplicationLogo />
          },
          {
            path: '/application/header',
            element: <ApplicationHeader />
          },
          {
            path: '/application/footer',
            element: <ApplicationFooter />
          },
          {
            path: '/application/color',
            element: <ApplicationColor />
          },
          {
            path: '/application/mail',
            element: <ApplicationMail />
          },
          {
            path: '/application/profile',
            element: <ApplicationProfile />
          },
          {
            path: '/application/setting',
            element: <PaymentSetting />
          },
          {
            path: '/application/others-setting',
            element: <OthersSetting />
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <LogIn />
  },
  {
    path: '/forgot/password',
    element: <ForgotPassword />
  }
], {
  future: {
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_skipActionErrorRevalidation: true,
  },
});
export default router;
