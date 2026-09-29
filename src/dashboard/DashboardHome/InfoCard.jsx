import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const InfoCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  moreInfo,
  url,
}) => {
  return (
    <Link
      to={url}
      className={`col-span-full md:col-span-6 xl:col-span-4 shadow rounded-md border border-slate-200 dark:border-slate-700 
        `}
    // style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div
        className={`text-white rounded-md transform transition-transform duration-300 ${gradient}`}
      >
        {/* Icon and Title */}
        <div className="flex justify-between p-6 ">
          <div className="space-y-3">
            <p className="text-3xl font-semibold">{value}</p>
            <h3>{title}</h3>
          </div>
          <Icon className="text-4xl" />
        </div>
        <h2 className={`px-6 ${moreInfo} py-2 rounded-b-md text-sm flex items-center justify-center gap-2`}>More Info <FaLongArrowAltRight /></h2>
        {/* Value */}
        {/* Description */}
        {/* <p className='mt-2 text-sm text-gray-100'>{description}</p> */}
      </div>
    </Link>
  );
};

export default InfoCard;
