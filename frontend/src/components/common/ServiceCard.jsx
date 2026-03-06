import { CiDeliveryTruck } from "react-icons/ci";

const ServiceCard = ({ 
  icon: Icon = CiDeliveryTruck, 
  title = "Order Delivery", 
  description = "Courier services available",
}) => (

    <div className="flex flex-col gap-y-4 items-center justify-center border border-gray-200 hover:shadow-lg transform duration-300 rounded-lg h-44">
      <Icon className="text-4xl text-[#7c8c7d]"/>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="opacity-60 text-base text-center px-2">{description}</p>
    </div>
  );

export default ServiceCard;