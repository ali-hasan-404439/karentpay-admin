import {
  FaWallet,
  FaMoneyBill,
  FaPiggyBank,
  FaFileInvoiceDollar,
  FaRocket,
  FaPaperPlane,
  FaPhoneAlt,
  FaBuilding,
  FaTasks,
  FaHandHoldingUsd,
  FaBook,
  FaMedal,
  FaUserFriends,
  FaGlobe,
  FaEnvelope,
  FaHeadset,
  FaMoneyCheckAlt
} from 'react-icons/fa';
import useFetchData from '../../utils/useFetchData';
import TitleDynamic from '../../TitleDynamic';
import InfoCard from './InfoCard';

function DashboardHome() {
  const { data } = useFetchData('/admin/merchant/data');

  const cards = [
    {
      title: 'Today Cash In',
      value: `${data?.data?.today_cash_in ? data?.data?.today_cash_in : 0}`,
      icon: FaWallet,
      bgColor: 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600',
      moreInfo: 'bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500',
      url: '/deposit'
    },
    {
      title: 'Today Payout',
      value: `${data?.data?.today_payout ? data?.data?.today_payout : 0}`,
      icon: FaMoneyBill,
      bgColor:
        'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600',
      moreInfo: 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500',
      url: '/payout'
    },
    {
      title: 'Today Withdraw',
      value: `${data?.data?.today_withdraw ? data?.data?.today_withdraw : 0}`,
      icon: FaPiggyBank,
      bgColor:
        'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
      moreInfo: 'bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500',
      url: '/withdraw'
    },
    {
      title: 'Yesterday Cash In',
      value: `${data?.data?.yesterday_cash_in ? data?.data?.yesterday_cash_in : 0
        }`,
      icon: FaBuilding,
      bgColor:
        'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
      moreInfo: 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500',
      url: '/deposit'
    },
    {
      title: 'Yesterday Payout',
      value: `${data?.data?.yesterday_payout ? data?.data?.yesterday_payout : 0
        }`,
      icon: FaTasks,
      bgColor:
        'bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600',
      moreInfo: 'bg-gradient-to-r from-indigo-400 to-teal-400 hover:from-indigo-500 hover:to-teal-500',
      url: '/payout'
    },
    {
      title: 'Yesterday Withdraw',
      value: `${data?.data?.yesterday_withdraw ? data?.data?.yesterday_withdraw : 0
        }`,
      icon: FaHandHoldingUsd,
      bgColor:
        'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      moreInfo: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500',
      url: '/withdraw'
    },
    {
      title: 'Weekly Cash In',
      value: `${data?.data?.weekly_cash_in ? data?.data?.weekly_cash_in : 0}`,
      icon: FaUserFriends,
      bgColor:
        'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600',
      moreInfo: 'bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500',
      url: '/deposit'
    },
    {
      title: 'Weekly Payout',
      value: `${data?.data?.weekly_payout ? data?.data?.weekly_payout : 0}`,
      icon: FaFileInvoiceDollar,
      bgColor:
        'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
      moreInfo: 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500',
      url: '/payout'
    },
    {
      title: 'Weekly Withdraw',
      value: `${data?.data?.weekly_withdraw ? data?.data?.weekly_withdraw : 0}`,
      icon: FaFileInvoiceDollar,
      bgColor:
        'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600',
      moreInfo: 'bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500',
      url: '/withdraw'
    },
    {
      title: 'Total Cash In',
      value: `${data?.data?.total_cash_in ? data?.data?.total_cash_in : 0}`,
      icon: FaRocket,
      bgColor:
        'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      moreInfo: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500',
      url: '/deposit'
    },
    {
      title: 'Total Payout',
      value: `${data?.data?.total_payout ? data?.data?.total_payout : 0}`,
      icon: FaPaperPlane,
      bgColor:
        'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-600 hover:to-blue-600',
      moreInfo: 'bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500',
      url: '/payout'
    },
    {
      title: 'Total Withdraw',
      value: `${data?.data?.total_withdraw ? data?.data?.total_withdraw : 0}`,
      icon: FaPhoneAlt,
      bgColor:
        'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
      moreInfo: 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500',
      url: '/withdraw'
    },
    {
      title: 'Total User',
      value: data?.data?.all_users ? data?.data?.all_users : 0,
      icon: FaBook,
      bgColor:
        'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
      moreInfo: 'bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500',
      url: '/merchant/all/user'
    },
    {
      title: 'Active Merchant',
      value: `${data?.data?.all_active_merchant ? data?.data?.all_active_merchant : 0
        }`,
      icon: FaMedal,
      bgColor:
        'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      moreInfo: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500',
      url: '/all/merchant'
    },
    {
      title: 'Pending Merchant',
      value: data?.data?.all_pending_merchant
        ? data?.data?.all_pending_merchant
        : 0,
      icon: FaGlobe,
      bgColor:
        'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-600 hover:to-blue-600',
      moreInfo: 'bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500',
      url: '/merchant/request'
    },
    {
      title: 'Total Email',
      value: `${data?.data?.total_emails ? data?.data?.total_emails : 0}`,
      icon: FaEnvelope,
      bgColor:
        'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600',
      moreInfo: 'bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500',
      url: '/email'
    },
    {
      title: 'Total Support',
      value: `${data?.data?.all_supports ? data?.data?.all_supports : 0}`,
      icon: FaHeadset,
      bgColor:
        'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
      moreInfo: 'bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500',
      url: '/support'
    },
    {
      title: 'Payment Method',
      value: `${data?.data?.payment_methods ? data?.data?.payment_methods : 0}`,
      icon: FaMoneyCheckAlt,
      bgColor:
        'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      moreInfo: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500',
      url: '/payment/payout'
    }
  ];

  return (
    <div>
      <TitleDynamic title='Dashboard' />
      <div className='grid grid-cols-1 md:grid-cols-12 gap-5 pb-5'>
        {cards?.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            gradient={card.bgColor}
            url={card.url}
            moreInfo={card.moreInfo}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardHome;
