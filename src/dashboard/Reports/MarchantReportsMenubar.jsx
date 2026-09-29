import { Link, useLocation } from 'react-router-dom';
// Updated Icon Import
import { MdOutlineAttachMoney, MdMoneyOff, MdAccountBalanceWallet } from 'react-icons/md';
import { AiOutlineRobot } from 'react-icons/ai';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { RiSendPlaneLine } from 'react-icons/ri';
import { GiPayMoney } from 'react-icons/gi';
import { BsCashCoin } from 'react-icons/bs';

const menuItems = [
  {
    path: '/reports',
    label: 'Cash In Auto',
    icon: <BsCashCoin />,
  },
  {
    path: '/reports/manual',
    label: 'Cash In Manual',
    icon: <MdMoneyOff />,
  },
  {
    path: '/reports/pay/out',
    label: 'Pay Out',
    icon: <GiPayMoney />,
  },
  {
    path: '/reports/withdraw',
    label: 'Withdraw',
    icon: <MdAccountBalanceWallet />,
  },
  {
    path: '/reports/robotic',
    label: 'Robotic',
    icon: <AiOutlineRobot />,
  },
  {
    path: '/reports/cash_in/wallet/auto',
    label: 'Cashin Wallet Auto',
    icon: <RiSendPlaneLine />,
  },
  {
    path: '/reports/cash_in/wallet/manual',
    label: 'Cashin Wallet Manual',
    icon: <MdOutlineAttachMoney />,
  },
  {
    path: '/reports/pay_out/sender',
    label: 'Pay Out Sender',
    icon: <FaMoneyCheckAlt />,
  },
];

function MenuItem({ path, label, icon, isActive }) {
  return (
    <li
      className={`text-black transition duration-300 rounded-[4px] dark:text-white hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer border dark:border-[#374151] ${isActive ? 'text-white bg-gradient-to-r from-[#395BEF] to-[#5C28D5]' : ''
        }`}
    >
      <Link to={path} className="flex items-center py-2.5 px-2">
        <span className="border-black hover:border-white dark:border-white text-[16px]">
          {icon}
        </span>
        <span className="ms-3">{label}</span>
      </Link>
    </li>
  );
}

function MarchantReportsMenubar() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="bg-white dark:bg-gray-800 h-full rounded pt-2 overscroll-y-auto">
      <ul className="space-y-1 p-2">
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            path={item.path}
            label={item.label}
            icon={item.icon}
            isActive={pathname === item.path}
          />
        ))}
      </ul>
    </div>
  );
}

export default MarchantReportsMenubar;
