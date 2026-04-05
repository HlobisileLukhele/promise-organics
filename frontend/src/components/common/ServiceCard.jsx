import { CiDeliveryTruck } from "react-icons/ci";
import { createElement } from 'react';

const ServiceCard = ({ 
  icon: Icon = CiDeliveryTruck, 
  title = "Order Delivery", 
  description = "Courier services available",
}) => (

    <div className="flex flex-col gap-y-4 items-center justify-center border border-gray-200 dark:border-[#2d5a3d] dark:bg-[#1e3d2a] hover:shadow-lg transform duration-300 rounded-lg h-44">
      {createElement(Icon, { className: 'text-4xl text-[#7c8c7d]' })}
      <h2 className="text-xl font-semibold dark:text-[#f0f7f2]">{title}</h2>
      <p className="opacity-60 text-base text-center px-2 dark:text-[#c8dece]">{description}</p>
    </div>
  );

export default ServiceCard;
